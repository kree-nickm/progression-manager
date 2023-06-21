import UIController from "./UIController.js";
import UIItem from "./UIItem.js";
import ListDisplayManager from "./ListDisplayManager.js";

export default class UIList extends UIController {
  static dontSerialize = UIController.dontSerialize.concat(["viewer","display","subsets","subsetDefinitions","forceNextRender"]);
  static unique = false;
  static itemClass = UIItem;
  
  static fromJSON(data, {viewer}={})
  {
    let list = new this(viewer);
    //if(this.name == "CharacterList") console.log(`Constructed CharacterList:`, list, list.list.length);
    for(let prop in list)
    {
      if(this.dontSerialize.indexOf(prop) == -1 && data[prop] !== undefined)
      {
        //console.log(`Handling property ${prop}...`);
        if(prop == "list")
        {
          for(let elem of data[prop])
          {
            let itemClass = (Array.isArray(this.itemClass) ? this.itemClass : [this.itemClass]).find(v => v.name == elem.__class__);
            if(itemClass)
            {
              let item = itemClass.fromJSON(elem, {addProperties:{list}, postLoad:false});
              //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Constructed Traveler:`, item);
              if(this.unique)
              {
                let existing = list.get(item.getUnique());
                if(existing)
                {
                  //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Existing Traveler:`, existing);
                  for(let itemProp in item)
                    if(item.constructor.dontSerialize.indexOf(itemProp) == -1 && item[itemProp] !== undefined)
                      existing.update(itemProp, item[itemProp], "replace");
                  //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Updated Traveler:`, existing);
                  item.unlink();
                }
                else
                {
                  item.afterLoad();
                  list.update(prop, item, "push");
                }
              }
              else
              {
                item.afterLoad();
                list.update(prop, item, "push");
              }
            }
            else
            {
              console.error(`Tried to add an item of invalid class '${elem.__class__}' to new '${this.name}' list ; only accepts class(es):`, this.itemClass);
            }
          }
        }
        else
          list.update(prop, data[prop], "replace");
      }
    }
    return list;
  }
  
  viewer;
  display;
  subsets = {};
  subsetDefinitions = {};
  forceNextRender = true;
  list = [];
  
  constructor(viewer)
  {
    super();
    this.viewer = viewer;
    this.display = new ListDisplayManager(this);
    this.initialize();
    this.setupDisplay();
  }
  
  initialize(){}
  
  setupDisplay(){}
  
  afterUpdate(field, value)
  {
    if(field.string == "list")
    {
      this.subsets = {};
    }
  }
  
  getUnique(item)
  {
    return (this.constructor.unique ? this.getHash(item) : item.uuid) ?? this.getHash(item);
  }
  
  getHash(item)
  {
    let json = JSON.stringify(item);
    let hash = 0, i, chr;
    if(json.length === 0)
      return hash;
    for(i=0; i<json.length; i++)
    {
      chr = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  
  get(unique)
  {
    for(let item of this.list)
      if(unique == this.getUnique(item))
        return item;
    return null;
  }
  
  items(a, b)
  {
    let func, subset;
    if(typeof(a) == "function")
    {
      func = a;
      subset = b;
    }
    else
    {
      subset = a;
      if(typeof(b) == "function")
        func = b;
    }
    
    if(subset)
    {
      if(!this.subsets[subset])
      {
        if(func)
          this.subsets[subset] = this.list.filter(func);
        else if(this.subsetDefinitions[subset])
          this.subsets[subset] = this.list.filter(this.subsetDefinitions[subset]);
        else
        {
          console.warn(`Unknown subset '${subset}' given for ${this.constructor.name}.items() with no function.`);
          console.trace();
          return this.list;
        }
      }
      return this.subsets[subset];
    }
    else if(func)
      return this.list.filter(func);
    else
      return this.list;
  }
  
  createItem()
  {
    let item = new this.constructor.itemClass();
    item.list = this;
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    this.list.forEach(item => item.unlink());
    this.update("list", [], "replace");
    this.subsets = {};
    this.forceNextRender = true;
  }
}
