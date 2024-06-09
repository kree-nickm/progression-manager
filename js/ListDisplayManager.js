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
  
  getGroups({fields, fieldDefs}={})
  {
    if(!fields && !fieldDefs)
      fields = this.getFields({include, exclude});
    if(!fieldDefs)
      fieldDefs = fields.map(fld => ({field:fld, params:[]}));
    let result = [];
    let lastGroup;
    let idx = 0;
    for(let iFd in fieldDefs)
    {
      let field = fieldDefs[iFd].field;
      fieldDefs[iFd].groupStarter = false;
      fieldDefs[iFd].groupEnder = false;
      if(!field.group)
      {
        result.push({label:"",size:1});
        if(lastGroup?.ender)
        {
          fieldDefs[lastGroup.ender].groupEnder = true;
          delete lastGroup.ender;
        }
      }
      else if(field.group === lastGroup)
      {
        field.group.size++;
        field.group.ender = iFd;
      }
      else
      {
        if(lastGroup?.ender)
        {
          fieldDefs[lastGroup.ender].groupEnder = true;
          delete lastGroup.ender;
        }
        fieldDefs[iFd].groupStarter = true;
        field.group.size = 1;
        field.group.index = idx++;
        result.push(field.group);
      }
      lastGroup = field.group;
    }
    return result;
  }
  
  getFields({include=[], exclude=[]}={})
  {
    let valid = Object.values(this.fields);
    
    if(!exclude.length && !include.length)
      return valid;
    
    if(typeof(include) == "function")
      valid = valid.filter(include);
    else if(include.length)
      valid = valid.filter(field => include.indexOf(field.id) > -1);
    
    if(typeof(exclude) == "function")
      valid = valid.filter(field => !exclude.call(this,field));
    else if(exclude.length)
      valid = valid.filter(field => exclude.indexOf(field.id) == -1);
    
    return valid;
  }
}
