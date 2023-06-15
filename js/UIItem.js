import UIController from "./UIController.js";

export default class UIItem extends UIController {
  static dontSerialize = UIController.dontSerialize.concat(["list"]);
  
  list;
  
  get viewer()
  {
    return this.list.viewer;
  }
  
  get display()
  {
    return this.list.display;
  }
  
  getUnique()
  {
    return this.list.getUnique(this);
  }
  
  equals(object)
  {
    return this.constructor?.name == object.constructor?.name && this.getUnique() == object.getUnique();
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
