import { handlebars, Renderer } from "./Renderer.js";

handlebars.registerHelper("get", (item, property, context) => item.get(property));

export default class UIController {
  static controllers = new Map();
  static dontSerialize = ["uuid","dependents"];
  
  static fromJSON(data, {addProperties={}}={})
  {
    let obj = new this();
    for(let prop in addProperties)
      obj[prop] = addProperties[prop];
    for(let prop in obj)
      if(this.dontSerialize.indexOf(prop) == -1 && data[prop] !== undefined)
        obj.update(prop, data[prop], "replace");
    return obj;
  }
  
  uuid;
  dependents = {};
  
  constructor()
  {
    this.uuid = crypto.randomUUID();
    UIController.controllers.set(this.uuid, this);
  }
  
  parseField(field, create=true)
  {
    if(!Array.isArray(field))
      field = field.split(".");
    let obj = this;
    for(let i=0; i<field.length-1; i++)
    {
      if(obj[field[i]] == undefined)
      {
        if(create)
          obj[field[i]] = {};
        else
        {
          obj = undefined;
          break;
        }
      }
      else if(typeof(obj[field[i]]) != "object")
      {
        console.error(`[${this.constructor.name} object].${field.join('.')} encountered a non-object at '${field[i]}'.`);
        return {string:field.join("."), path:field};
      }
      obj = obj[field[i]];
      if(!obj)
        break;
    }
    return {string:field.join("."), path:field, object:obj, property:field[field.length-1], value:obj?.[field[field.length-1]]};
  }
  
  get(field)
  {
    return this.parseField(field, false).value;
  }
  
  update(field, value, action="")
  {
    field = this.parseField(field);
    value = this.beforeUpdate(field, value);
    let needsUpdate = false;
    if(typeof(field.value) == "object" || typeof(field.value) == "function")
    {
      if(!action)
        console.warn(`${this.constructor.name}.update(3) expects a third argument when the property being updated (${field.string}) is non-scalar (it's a ${typeof(field.value)}).`);
      else
      {
        if(Array.isArray(field.value))
        {
          if(action == "notify")
            needsUpdate = true;
          else if(action == "replace")
          {
            field.object[field.property] = value;
            for(let prev of field.value)
            {
              if(prev instanceof UIController)
                prev.notifyAll();
            }
            needsUpdate = true;
          }
          else if(action == "push")
          {
            field.object[field.property].push(value);
            needsUpdate = true;
          }
          else if(action == "remove")
          {
            field.object[field.property] = field.object[field.property].filter(item => item != value);
            if(value instanceof UIController)
              value.notifyAll();
            needsUpdate = true;
          }
          else
            console.warn(`Unknown action '${action}' in ${this.constructor.name}.update(3) when updating array '${field.string}'.`);
        }
        else if(typeof(field.value) == "object")
        {
          if(action == "notify")
            needsUpdate = true;
          else if(action == "replace")
          {
            field.object[field.property] = value;
            needsUpdate = true;
          }
          else
            console.warn(`Unknown action '${action}' in ${this.constructor.name}.update(3) when updating array '${field.string}'.`);
        }
        else if(typeof(field.value) == "function")
        {
          if(action == "notify")
            needsUpdate = true;
          else
            console.warn(`Unknown action '${action}' in ${this.constructor.name}.update(3) when updating array '${field.string}'.`);
        }
      }
    }
    else
    {
      if(field.value !== value)
      {
        field.object[field.property] = value;
        needsUpdate = true;
      }
    }
    
    if(needsUpdate)
    {
      for(let dep of this.dependents[field.string] ?? [])
        if(dep)
        {
          Renderer.needsUpdate.add(dep);
          dep.needsUpdate = true;
        }
    }
    this.afterUpdate(field, value);
    return this;
  }
  
  beforeUpdate(field, value)
  {
    // Code to validate the value before updating.
    return value;
  }
  
  afterUpdate(field, value)
  {
    // Any code to run after a value is changed.
  }
  
  notifyAll()
  {
    for(let field in this.dependents)
      for(let dep of this.dependents[field] ?? [])
        if(dep)
        {
          Renderer.needsUpdate.add(dep);
          dep.needsUpdate = true;
        }
  }
  
  cleanupDependents()
  {
    for(let field in this.dependents)
      this.dependents[field] = this.dependents[field].filter(element => element && element.parentElement);
  }
  
  addDependent(field, dep)
  {
    field = this.parseField(field);
    if(!this.dependents[field.string])
      this.dependents[field.string] = [];
    this.dependents[field.string].push(dep);
    return this;
  }
  
  removeDependent(field, dep)
  {
    field = this.parseField(field);
    if(this.dependents[field.string])
      this.dependents[field.string] = this.dependents[field.string].filter(element => element != dep);
    return this;
  }
  
  unlink(options)
  {
    UIController.controllers.delete(this.uuid);
  }
  
  toJSON()
  {
    let result = {__class__: this.constructor.name};
    for(let key of Object.keys(this))
      if(["object","string","boolean","number","bigint"].indexOf(typeof(this[key])) > -1 && this.constructor.dontSerialize.indexOf(key) == -1)
        result[key] = this[key];
    return result;
  }
}
