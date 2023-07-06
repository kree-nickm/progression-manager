import { handlebars, Renderer } from "./Renderer.js";

handlebars.registerHelper("getProperty", (item, property, context) => item.getProperty(property));
handlebars.registerHelper("uuid", (item, context) => {
  try{return item.uuid;}catch(x){console.error(context, x);return "*INVALID UUID*";}
});

export default class UIController {
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
  dependents = {}; // Note: In the future, properties of this object could be changed to Sets instead of Arrays.
  
  constructor()
  {
    this.uuid = crypto.randomUUID();
    Renderer.controllers.set(this.uuid, this);
  }
  
  parseProperty(prop, {create=true}={})
  {
    if(!Array.isArray(prop))
      prop = prop.split(".");
    let obj = this;
    for(let i=0; i<prop.length-1; i++)
    {
      if(obj[prop[i]] == undefined)
      {
        if(create)
          obj[prop[i]] = {};
        else
        {
          obj = undefined;
          break;
        }
      }
      else if(typeof(obj[prop[i]]) != "object")
      {
        console.error(`[${this.constructor.name} object].${prop.join('.')} encountered a non-object at '${prop[i]}'.`);
        return {string:prop.join("."), path:prop};
      }
      obj = obj[prop[i]];
      if(!obj)
        break;
    }
    return {string:prop.join("."), path:prop, object:obj, property:prop[prop.length-1], value:obj?.[prop[prop.length-1]]};
  }
  
  getProperty(prop, {create=true}={})
  {
    return this.parseProperty(prop, false).value;
  }
  
  update(field, value, action="")
  {
    field = this.parseProperty(field, {create: value!==undefined});
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
          // Note: I'm not sure if "notify" always needs to trigger a viewer.store
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
      window.viewer.queueStore();
      for(let dep of this.dependents[field.string] ?? [])
        if(dep)
          Renderer.queueUpdate(dep);
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
          Renderer.queueUpdate(dep);
  }
  
  cleanupDependents()
  {
    for(let field in this.dependents)
      this.dependents[field] = this.dependents[field].filter(element => element && element.isConnected);
  }
  
  addDependent(prop, dep)
  {
    prop = this.parseProperty(prop);
    if(!this.dependents[prop.string])
      this.dependents[prop.string] = [];
    this.dependents[prop.string].push(dep);
    return this;
  }
  
  removeDependent(prop, dep)
  {
    prop = this.parseProperty(prop);
    if(this.dependents[prop.string])
      this.dependents[prop.string] = this.dependents[prop.string].filter(element => element != dep);
    return this;
  }
  
  onRender(element)
  {
  }
  
  unlink(options)
  {
    Renderer.controllers.delete(this.uuid);
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
