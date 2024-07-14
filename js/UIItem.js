import { handlebars, Renderer } from "./Renderer.js";
import UIController from "./UIController.js";

handlebars.registerHelper("unique", (item, options) => item instanceof UIItem ? item.getUnique() : console.error(`Helper 'unique' must be called on a UIItem.`, {item, options}));

export default class UIItem extends UIController {
  static dontSerialize = super.dontSerialize.concat(["list"]);
  static templateName = "renderItemAsPopup";
  static listTemplateName = "renderItemAsRow";
  
  static fromJSON(data, {addProperties={}, postLoad=true}={})
  {
    let obj = super.fromJSON(data, {addProperties});
    if(postLoad)
      obj.afterLoad();
    return obj;
  }
  
  static setupDisplay(display)
  {
    display.addField("favorite", {
      label: "F",
      labelTitle: "Mark certain items as favorites, then click to sort them higher than others.",
      sort: {generic: {type:"boolean",property:"favorite"}},
      dynamic: true,
      title: item => `${item.favorite?"Unmark":"Mark"} Favorite`,
      edit: item => ({
        target: {item, field:"favorite"},
        type: "checkbox",
        value: item.favorite,
        trueClasses: ["fa-solid","fa-circle-check"],
        falseClasses: [],
      }),
    });
    
    if(!this.unique)
    {
      display.addField("deleteBtn", {
        label: "D",
        dynamic: true,
        dependencies: item => [
          {item, field:"lock"},
          {item, field:"location"},
        ],
        title: item => (item.lock || item.location) ? "Unlock/unequip the item before deleting it." : "Delete this item from the list.",
        button: item => (item.lock || item.location) ? {icon: "fa-solid fa-trash-can"} : {
          icon: "fa-solid fa-trash-can",
          action: event => {
            event.stopPropagation();
            item.unlink();
            item.list.viewer.queueStore();
          },
        },
      });
    }
    
    //super.setupDisplay(display);
  }
  
  list;
  owned;
  favorite = false;
  
  get viewer() { return this.list.viewer; }
  set viewer(val) { console.warn(`UIItem cannot change viewer.`); }
  
  get display() { return this.list.display; }
  set display(val) { console.warn(`UIItem cannot change display.`); }
  
  // Note: While the uuid property is meant to be completely unique for every UIController no matter what, this is meant to be derived from the UIItem's data, in order to determine if two UIItems are duplicates.
  // Note: Currently, this calls the UIList's method, because that can be used on generic objects with all of the UIItem's properties, to see if they are potential duplicates, before creating new UIItems from such objects.
  getUnique()
  {
    return this.list.getUnique(this);
  }
  
  afterLoad()
  {
    return true;
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "owned")
      this.list.update("list", null, "notify", {toggleOwned:this});
    return true;
  }
  
  notifyType(type="")
  {
    let elements = Array.from(document.querySelectorAll(`.list-item[data-uuid="${this.uuid}"] .type-dependent`));
    elements.forEach(element => {
      for(let dep of element.dependencies ?? [])
        if(dep?.type === type)
          Renderer.queueUpdate(element);
    });
  }
  
  unlink({skipList, skipHTML}={})
  {
    super.unlink({skipHTML});
    if(!skipList)
      this.list?.update("list", this, "remove", {skipHTML:true}); // UIController.unlink handles removing the HTML elements in case the UIItem isn't part of a UIList, so tell the UIList not to also do it.
  }
}
