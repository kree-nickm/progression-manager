import { Renderer } from "./Renderer.js";
import UIList from "./UIList.js";
import Furniture from "./Furniture.js";

export default class FurnitureList extends UIList
{
  static unique = true;
  static name = "furniture";
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
    });
    
    let countField = this.display.addField("count", {
      label: "Count",
      dynamic: true,
      value: item => item.count,
      edit: item => ({
        target: {item:item, field:"count"},
      }),
    });
  }
  
  createItem(goodData)
  {
    let item = new Furniture();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("count", 0);
    }
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      container: window.viewer.elements[this.constructor.name],
    });
    this.forceNextRender = false;
  }
}
