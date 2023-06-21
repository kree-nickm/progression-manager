import { handlebars } from "./Renderer.js";
import UIController from "./UIController.js";

handlebars.registerHelper("unique", (item, context) => item.getUnique());
handlebars.registerHelper('toParam', function(item, context) {
  if(typeof(item) == "object" && item instanceof UIItem)
    return item.list.constructor.name +"##"+ item.getUnique();
  else
    return String.valueOf(item);
});

export default class UIItem extends UIController {
  static dontSerialize = UIController.dontSerialize.concat(["list"]);
  
  static fromJSON(data, {addProperties={}, postLoad=true}={})
  {
    let obj = super.fromJSON(data, {addProperties});
    if(postLoad)
      obj.afterLoad();
    return obj;
  }
  
  list;
  
  get viewer()
  {
    return this.list.viewer;
  }
  
  get display()
  {
    return this.list.display;
  }
  
  // Note: While the uuid property is meant to be completely unique for every UIController no matter what, this is meant to be derived from the UIItem's data, in order to determine if two UIItems are duplicates.
  // Note: Currently, this calls the UIList's method, because that can be used on generic objects with all of the UIItem's properties to see if they are potential duplicates.
  getUnique()
  {
    return this.list.getUnique(this);
  }
  
  afterLoad()
  {
    return true;
  }
  
  getRelatedItems()
  {
    return {};
  }
  
  addPopupEventHandlers(popupBody)
  {
  }
}
