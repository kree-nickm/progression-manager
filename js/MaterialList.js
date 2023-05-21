import { Renderer } from "./Renderer.js";
import UIList from "./UIList.js";
import Material from "./Material.js";

export default class MaterialList extends UIList
{
  static unique = true;
  static name = "materials";
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
      classes: item => {return{
        "material": true,
        "q1": item.quality == 1,
        "q2": item.quality == 2,
        "q3": item.quality == 3,
        "q4": item.quality == 4,
        "q5": item.quality == 5,
      };},
    });
    
    let countField = this.display.addField("count", {
      label: "Count",
      dynamic: true,
      value: item => item.count + (item.prevTier ? " (+"+ (item.getCraftCount()-item.count) +")" : ""),
      edit: item => {return{
        target: {item:item, field:"count"},
      };},
      dependencies: item => item.getCraftDependencies(),
    });
    
    let sourceField = this.display.addField("source", {
      label: "Source",
      dynamic: true,
      value: item => item.source ? item.source + (item.days.length ? "; "+ item.days.join(", ") : "") : "",
      classes: item => ({
        "today": item.days.indexOf(item.list.viewer.today()) > -1,
      }),
      dependencies: item => [
        item.days ? {item:this.viewer, field:"today"} : {},
      ],
    });
    
    let usersField = this.display.addField("users", {
      label: "Used By",
      dynamic: true,
      value: item => item.getUsage(),
      dependencies: item => {
        let dependencies = [{item:item, field:["usedBy"]}];
        for(let i of item.usedBy)
          dependencies.push({item:i, field:["favorite"]});
        return dependencies;
      },
    });
  }
  
  getUnique(item)
  {
    return Material.toKey(item.goodKey ?? item.key);
  }
  
  get(string)
  {
    if(typeof(string) == "string")
      return super.get(Material.toKey(string));
    else
      return null;
  }
  
  toGOOD()
  {
    let result = {};
    for(let item of this.list)
      result[item.key] = item.count;
    return result;
  }
  
  createItem(goodData)
  {
    let item = new Material();
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
