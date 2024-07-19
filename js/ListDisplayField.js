import { handlebars } from "./Renderer.js";

handlebars.registerHelper("findField", (item, field, options) => {
  if(field instanceof ListDisplayField)
    return field;
  let foundField = item?.display?.getField(field);
  if(foundField instanceof ListDisplayField)
    return foundField;
  console.error(`Error in 'fieldField' helper: cannot find field based on arguments;`, {item, field, options});
  return null;
});

handlebars.registerHelper("itemField", (item, field, property, options) => {
  let params = options.hash.params ? (Array.isArray(options.hash.params) ? options.hash.params : [options.hash.params]) : [];
  return field.get(property, item, ...params);
});

handlebars.registerHelper("itemClasses", (item, field, options) => {
  let params = options.hash.params ? (Array.isArray(options.hash.params) ? options.hash.params : [options.hash.params]) : [];
  let result = [];
  if(!item)
  {
    console.error(`item passed to itemClasses helper is invalid`, item, field, options);
    return "";
  }
  if(!field)
  {
    console.error(`field passed to itemClasses helper is invalid`, item, field, options);
    return "";
  }
  let classes = field.get('classes', item, ...params);
  for(let cls in classes)
    if(classes[cls])
      result.push(cls);
  return result.join(" ");
});

handlebars.registerHelper("fieldClasses", (field, options) => ((options.hash.params ? field.get("columnClasses", null, ...options.hash.params) : field.get("columnClasses")) ?? []).join(" "));

export default class ListDisplayField
{
  static properties = ["group", "label", "labelTitle", "columnClasses", "sort", "tags", "dynamic", "html", "popup", "value", "button", "template", "edit", "title", "classes", "dependencies"];
  
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
      if(prop in properties)
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
