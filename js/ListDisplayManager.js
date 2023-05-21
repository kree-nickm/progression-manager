import ListDisplayField from "./ListDisplayField.js";

export default class ListDisplayManager
{
  list;
  fields = {};
  
  constructor(list)
  {
    this.list = list;
  }
  
  addField(id, data)
  {
    let field = new ListDisplayField(this, String(id));
    if(data)
      field.setData(data);
    this.fields[id] = field;
    return field;
  }
  
  getField(id)
  {
    return this.fields[id];
  }
  
  getGroups({include=[], exclude=[]}={})
  {
    let fields = this.getFields({include, exclude});
    let result = [];
    let lastGroup;
    for(let field of fields)
    {
      if(!field.group)
      {
        result.push({label:"",size:1});
      }
      else if(field.group === lastGroup)
      {
        field.group.size++;
      }
      else
      {
        field.group.size = 1;
        result.push(field.group);
      }
      lastGroup = field.group;
    }
    return result;
  }
  
  getFields({include=[], exclude=[]}={})
  {
    let result = Object.values(this.fields);
    
    if(typeof(include) == "function")
      result = result.filter(include);
    else if(include.length)
      result = result.filter(field => include.indexOf(field.id) > -1);
    
    if(typeof(exclude) == "function")
      result = result.filter(field => !exclude.call(this,field));
    else if(exclude.length)
      result = result.filter(field => exclude.indexOf(field.id) == -1);
    
    return result;
  }
}
