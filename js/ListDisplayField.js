export default class ListDisplayField
{
  static itemFields = ["popup", "value", "button", "edit", "title", "classes", "dependencies"];
  static emptyFunction = item => null;
  
  manager;
  id = "";
  statics = {};
  group = null;
  label = "";
  labelTitle = "";
  columnClasses = [];
  sort = null;
  tags = [];
  dynamic = true;
  popup = ListDisplayField.emptyFunction;
  value = ListDisplayField.emptyFunction;
  button = ListDisplayField.emptyFunction;
  edit = ListDisplayField.emptyFunction;
  editable = false;
  title = ListDisplayField.emptyFunction;
  classes = ListDisplayField.emptyFunction;
  dependencies = ListDisplayField.emptyFunction;
  
  constructor(manager, id)
  {
    this.manager = manager;
    this.id = id;
  }
  
  setData({group, label, labelTitle, columnClasses, sort, tags, dynamic, popup, value, button, edit, title, classes, dependencies}={})
  {
    if(group && typeof(group) == "object") this.group = group;
    if(label !== undefined) this.label = String(label);
    if(labelTitle !== undefined) this.labelTitle = String(labelTitle);
    if(Array.isArray(columnClasses)) this.columnClasses = columnClasses;
    if(sort?.func || sort?.generic) this.sort = sort;
    if(Array.isArray(tags)) this.tags = tags;
    if(dynamic !== undefined) this.dynamic = !!dynamic;
    if(typeof(popup) == "function") this.popup = popup;
    else if(popup) this.popup = item => item;
    if(typeof(value) == "function") this.value = value;
    if(typeof(button) == "function") this.button = button;
    if(typeof(edit) == "function")
    {
      this.edit = edit;
      this.editable = true;
    }
    if(typeof(title) == "function") this.title = title;
    if(typeof(classes) == "function") this.classes = classes;
    if(typeof(dependencies) == "function") this.dependencies = dependencies;
  }
  
  getAll(item, ...params)
  {
    let result = {};
    for(let property of ListDisplayField.itemFields)
      result[property] = this.get(property, item, ...params);
    return result;
  }
  
  get(property, item, ...params)
  {
    if(ListDisplayField.itemFields.indexOf(property) == -1)
    {
      console.error(`[ListDisplayField object].${property} is not an item-specific field.`);
      return null;
    }
    
    if(!this.dynamic && this.statics[item.getUnique()]?.[property] !== undefined)
      return this.statics[item.getUnique()][property];
    let result = this[property](item, ...params);
    if(!this.dynamic)
    {
      if(!this.statics[item.getUnique()])
        this.statics[item.getUnique()] = {};
      this.statics[item.getUnique()][property] = result;
    }
    return result;
  }
}
