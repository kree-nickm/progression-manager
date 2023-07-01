import GenshinFurnitureData from "./gamedata/GenshinFurnitureData.js";

import { Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Furniture from "./Furniture.js";

export default class FurnitureList extends GenshinList
{
  static unique = true;
  static itemClass = Furniture;
  
  initialize()
  {
    for(let k in GenshinFurnitureData)
    {
      this.addGOOD({key:k, learned:false, count:0});
    }
  }
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
    });
    
    let learnedField = this.display.addField("learned", {
      label: "Learned",
      sort: {generic: {type:"boolean",property:"learned"}},
      dynamic: true,
      edit: item => ({
        target: {item:item, field:"learned"},
        type: "checkbox",
        value: item.learned,
        trueClasses: ["fa-solid","fa-scroll"],
        falseClasses: [],
      }),
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
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("learned", false);
      item.update("count", 0);
    }
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      container: this.viewer.elements[this.constructor.name],
    });
    this.forceNextRender = false;
    
    let footer = document.getElementById("footer");
    footer.classList.add("d-none");
  }
}
