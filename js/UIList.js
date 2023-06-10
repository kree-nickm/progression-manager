import { Renderer } from "./Renderer.js";
import UIController from "./UIController.js";
import ListDisplayManager from "./ListDisplayManager.js";
import GenshinItem from "./GenshinItem.js";

export default class UIList extends UIController {
  static dontSerialize = UIController.dontSerialize.concat(["viewer","display","subsets","subsetDefinitions","forceNextRender"]);
  static unique = false;
  static name = "";
  
  viewer;
  display;
  list = [];
  subsets = {};
  subsetDefinitions = {};
  forceNextRender = true;
  
  constructor(viewer)
  {
    super();
    this.viewer = viewer;
    this.display = new ListDisplayManager(this);
    this.setupDisplay();
  }
  
  setupDisplay(){}
  
  getUnique(item)
  {
    return item.key ?? item.id;
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
          console.warn(`Unknown subset '${subset}' given for UIList.items() with no function.`);
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
  
  fromGOOD(goodData)
  {
    this.clear();
    if(Array.isArray(goodData))
    {
      for(let goodItem of goodData)
        this.addGOOD(goodItem);
    }
    else if(typeof(goodData) == "object")
    {
      for(let key in goodData)
        this.addGOOD({goodKey:key, goodValue:goodData[key]});
    }
    else
    {
      console.error("UIList.fromGOOD(goodData) only works if goodData is an array or object.", goodData);
    }
    this.forceNextRender = true;
    return this.list.length;
  }
  
  addGOOD(goodData)
  {
    if(typeof(goodData) != "object")
    {
      console.error("Argument passed to UIList.add() must be an object.", goodItem);
      return null;
    }
    
    if(this.constructor.unique)
    {
      let existing = this.get(this.getUnique(goodData));
      if(existing)
      {
        existing.fromGOOD(goodData);
        this.subsets = {};
        return existing;
      }
    }
    
    this.subsets = {};
    return this.createItem(goodData);
  }
  
  createItem(goodData)
  {
    let item = new GenshinItem();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  toGOOD()
  {
    let result = [];
    for(let item of this.list)
      result.push(item.toGOOD());
    return result;
  }
  
  clear()
  {
    this.update("list", [], "replace");
    this.subsets = {};
    this.forceNextRender = true;
  }
}
