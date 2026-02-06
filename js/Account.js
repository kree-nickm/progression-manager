const {default:Plan} = await window.importer.get(`js/Plan.js`);
const {default:Setting} = await window.importer.get(`js/Setting.js`);

export default class Account
{
  id;
  lists;
  
  viewer;
  plan;
  settings;
  settingDefs;
  errors;
  
  constructor(id, {lists, viewer}={})
  {
    this.errors = false;
    this.id = id;
    
    if(lists)
      this.lists = lists;
    else
      this.lists = {};
    
    this.settings = {};
    this.settingDefs = {};
    
    if(viewer)
    {
      this.viewer = viewer;
      this.plan = new Plan();
      this.plan.viewer = viewer;
    }
    
    this.setup();
  }
  
  setup()
  {
    // Add settings.
  }
  
  addSetting(setting)
  {
    if(!(setting instanceof Setting))
      throw Error(`Tried to add a non-Setting as a setting.`);
    if(!setting.key)
      throw Error(`Tried to add a Setting with no key.`);
    
    if(this.settings[setting.key] === undefined)
      this.settings[setting.key] = setting.initial;
    this.settingDefs[setting.key] = setting;
  }
  
  loadData(data)
  {
    console.debug(`Loading data into ${this.id}.`);
    if(!this.viewer)
    {
      throw new Error(`Viewer must be defined in account "${this.id}" order to load lists via loadData().`);
    }
    this.viewer.settings.server = this.id;
    
    // Determine where the actual game data (lists) that the user has saved is located within the account data.
    let source;
    if(!data)
      source = {};
    else if(data.__class__ == this.constructor.name) // dataVersion > 1
      source = data.lists;
    else if(window.stringInstanceOf(this, data.__class__))
    {
      console.warn(`Stored account "${this.id}" is of class ${data.__class__}. Converting to expected class ${this.constructor.name}.`);
      source = data.lists;
    }
    else if(!("__class__" in data)) // dataVersion == 1
      source = data;
    else
    {
      console.error(`Unable to load data for account "${this.id}", invalid class specified; expected ${this.constructor.name}.`, {class: data.__class__, data});
      this.errors = true;
      return;
    }
    
    // Load any settings.
    if(data?.settings)
    {
      for(let key in data.settings)
      {
        if(this.settingDefs[key])
        {
          this.settings[key] = this.settingDefs[key].validate(data.settings[key]);
        }
        else
        {
          this.settings[key] = data.settings[key];
          console.warn(`Imported data has an unknown setting '${key}' with value '${data.settings[key]}'.`);
        }
      }
    }
    
    // Load the lists based on what the manager is expecting (listClasses).
    for(let list in this.viewer.listClasses)
    {
      try
      {
        if(list in source)
        {
          console.debug(`Loading new data for ${list}.`);
          this.lists[list] = this.viewer.listClasses[list].fromJSON(source[list], {viewer:this.viewer});
          
          // Band-aid solution to catch the random error that happens on game data updates, which can delete all user data.
          if(source[list].list.length > this.lists[list].list.length)
          {
            console.error(`${list} failed to load for unknown reasons. Normally this only happens on the first page load after an update, so reloading the page should hopefully fix it.`);
            console.debug(`Data for ${list}:`, {sourceData:source[list], currentData:this.lists[list]});
            this.errors = true;
          }
        }
        else if(!this.lists[list])
        {
          console.debug(`Creating empty list for ${list}.`);
          this.lists[list] = new this.viewer.listClasses[list](this.viewer);
          this.lists[list].initialize();
        }
        else
          console.debug(`Leaving ${list} unchanged.`);
      }
      catch(x)
      {
        console.error(`Unable to load data for account "${this.id}", fatal error trying to load list "${list}".`, {listData:source[list]});
        console.error(x);
        this.errors = true;
        return;
      }
    }
    for(let list in source)
      if(!this.viewer.listClasses[list])
        console.warn(`Stored data contained unregistered list class: ${list}`, {registeredLists: Object.keys(this.viewer.listClasses)});
  }
  
  toJSON()
  {
    return {
      __class__: this.constructor.name,
      id: this.id,
      lists: this.lists,
      settings: this.settings,
    };
  }
}
