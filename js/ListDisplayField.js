export default class ListDisplayField
{
  static properties = ["group", "label", "labelTitle", "columnClasses", "sort", "tags", "dynamic", "html", "popup", "value", "button", "edit", "title", "classes", "dependencies"];
  
  manager;
  id = "";
  statics = {};
  columnClasses = [];
  tags = [];
  dynamic = true;
  
  constructor(manager, id)
  {
    this.manager = manager;
    this.id = id;
  }
  
  setData(properties={})
  {
    for(let prop of ListDisplayField.properties)
      this[prop] = properties[prop];
    if(properties.edit)
      this.editable = true;
  }
  
  getAll(item, ...params)
  {
    let result = {};
    for(let property of ListDisplayField.properties)
      result[property] = this.get(property, item, ...params);
    return result;
  }
  
  get(property, item, ...params)
  {
    if(ListDisplayField.properties.indexOf(property) == -1)
    {
      console.error(`'${property}' is not a valid field property.`);
      return null;
    }
    
    // If it's not a function, just return it.
    if(typeof(this[property]) != "function")
      return this[property];
    
    // If it's not dynamic and is stored, return the stored value.
    if(!this.dynamic && this.statics[item.uuid]?.[property] !== undefined)
      return this.statics[item.uuid][property];
    
    // Get the value.
    let result = this[property](item, ...params);
    
    // If it's not dynamic, store the value before returning.
    if(!this.dynamic)
    {
      if(!this.statics[item.uuid])
        this.statics[item.uuid] = {};
      this.statics[item.uuid][property] = result;
    }
    return result;
  }
}
