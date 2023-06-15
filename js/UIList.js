import UIController from "./UIController.js";
import UIItem from "./UIItem.js";
import ListDisplayManager from "./ListDisplayManager.js";

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
    return item.uuid;
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
  
  createItem()
  {
    let item = new UIItem();
    item.list = this;
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    this.list.forEach(item => UIController.controllers.delete(item.uuid));
    this.update("list", [], "replace");
    this.subsets = {};
    this.forceNextRender = true;
  }
}
