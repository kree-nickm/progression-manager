export default class ListDisplayField
{
  static itemFields = ["value", "button", "edit", "title", "classes", "dependencies"];
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
  popup = false;
  dynamic = true;
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
  
  setData({group, label, labelTitle, columnClasses, sort, tags, popup, dynamic, value, button, edit, title, classes, dependencies}={})
  {
    if(group && typeof(group) == "object") this.group = group;
    if(label !== undefined) this.label = String(label);
    if(labelTitle !== undefined) this.labelTitle = String(labelTitle);
    if(Array.isArray(columnClasses)) this.columnClasses = columnClasses;
    if(sort?.func || sort?.generic) this.sort = sort;
    if(Array.isArray(tags)) this.tags = tags;
    if(popup !== undefined) this.popup = !!popup;
    if(dynamic !== undefined) this.dynamic = !!dynamic;
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
  
  getAll(item)
  {
    let result = {};
    for(let property of ListDisplayField.itemFields)
      result[property] = this.get(property, item);
    return result;
  }
  
  get(property, item)
  {
    if(ListDisplayField.itemFields.indexOf(property) == -1)
    {
      console.error(`[ListDisplayField object].${property} is not an item-specific field.`);
      return null;
    }
    
    if(!this.dynamic && this.statics[item.getUnique()]?.[property] !== undefined)
      return this.statics[item.getUnique()][property];
    let result = this[property](item);
    if(!this.dynamic)
    {
      if(!this.statics[item.getUnique()])
        this.statics[item.getUnique()] = {};
      this.statics[item.getUnique()][property] = result;
    }
    return result;
  }
}
