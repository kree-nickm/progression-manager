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
    for(let field in fields)
    {
      if(!fields[field].group)
      {
        result.push({label:"",size:1});
      }
      else if(fields[field].group === lastGroup)
      {
        fields[field].group.size++;
      }
      else
      {
        fields[field].group.size = 1;
        result.push(fields[field].group);
      }
      lastGroup = fields[field].group;
    }
    return result;
  }
  
  getFields({include=[], exclude=[]}={})
  {
    if(!exclude.length && !include.length)
      return this.fields;
    
    let valid = Object.values(this.fields);
    
    if(typeof(include) == "function")
      valid = valid.filter(include);
    else if(include.length)
      valid = valid.filter(field => include.indexOf(field.id) > -1);
    
    if(typeof(exclude) == "function")
      valid = valid.filter(field => !exclude.call(this,field));
    else if(exclude.length)
      valid = valid.filter(field => exclude.indexOf(field.id) == -1);
    
    let result = {};
    for(let field of valid)
      result[field.id] = field;
    return result;
  }
}
