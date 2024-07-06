import Plan from "./Plan.js";

export default class Account
{
  id;
  lists;
  
  viewer;
  plan;
  
  constructor(id, {lists, viewer}={})
  {
    this.id = id;
    
    if(lists)
      this.lists = lists;
    else
      this.lists = {};
    
    if(viewer)
    {
      this.viewer = viewer;
      this.plan = new Plan();
      this.plan.viewer = viewer;
    }
  }
  
  loadLists(data)
  {
    if(!this.viewer)
    {
      throw new Exception(`Viewer must be defined in account "${this.id}" order to load lists via loadLists().`);
    }
    this.viewer.settings.server = this.id;
    
    let source;
    if(!data)
      source = {};
    else if(data.__class__ == this.constructor.name) // dataVersion > 1
      source = data.lists;
    else if(!("__class__" in data)) // dataVersion == 1
      source = data;
    else
    {
      console.error(`Unable to load data for account "${this.id}", invalid class specified.`, {data});
      this.errors = true;
    }
    
    for(let list in this.viewer.listClasses)
    {
      if(list in source)
        this.lists[list] = this.viewer.listClasses[list].fromJSON(source[list], {viewer:this.viewer});
      else if(!this.lists[list])
        this.lists[list] = new this.viewer.listClasses[list](this.viewer);
    }
    for(let list in source)
      if(!this.viewer.listClasses[list])
        console.warn(`Stored data contained unregistered list class: ${list}`, {registeredLists: this.viewer.listClasses});
  }
  
  toJSON()
  {
    return {__class__:this.constructor.name, id:this.id, lists:this.lists};
  }
}
