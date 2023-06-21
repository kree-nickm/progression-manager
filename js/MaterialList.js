import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";

import { Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Material from "./Material.js";

export default class MaterialList extends GenshinList
{
  static unique = true;
  static itemClass = Material;
  
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
  
  initialize()
  {
    // Enemy mats
    for(let e in GenshinLootData.enemy)
      Material.setupTiers([4,3,2,1].map(q => GenshinLootData.enemy[e][q] ? this.addGOOD({goodKey:GenshinLootData.enemy[e][q], goodValue:0}).update("source", GenshinLootData.enemy[e].source ?? e).update("quality", q).update("shorthand", e) : null));
    
    // Trounce mats
    for(let domain of GenshinLootData.trounce)
      for(let itemName of domain.loot)
        this.addGOOD({goodKey:itemName, goodValue:0}).update("source", domain.boss).update("quality", 5);
      
    // Boss mats
    for(let b in GenshinLootData.boss)
      this.addGOOD({goodKey:GenshinLootData.boss[b]['4'], goodValue:0}).update("source", GenshinLootData.boss[b].name).update("quality", 4).update("shorthand", b);
    
    // Gemstone mats
    Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:"Brilliant Diamond" + Material.gemQualities[q], goodValue:0}).update("quality", q).update("shorthand", "Diamond" + Material.gemQualities[q])));
    for(let elem in GenshinLootData.gemstone)
      Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:GenshinLootData.gemstone[elem].prefix + Material.gemQualities[q], goodValue:0}).update("quality", q).update("shorthand", elem + Material.gemQualities[q])));
    
    // Mastery mats
    for(let suffix in GenshinLootData.mastery)
      Material.setupTiers([4,3,2].map(q => this.addGOOD({goodKey:Material.masteryQualities[q] + suffix, goodValue:0}).update("source", GenshinLootData.mastery[suffix].source).update("days", GenshinLootData.mastery[suffix].days, "replace").update("quality", q).update("shorthand", suffix)));
    this.addGOOD({goodKey:"Crown Of Insight", goodValue:0}).update("quality", 5);
    
    // Forgery mats
    for(let suffix in GenshinLootData.forgery)
      Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:GenshinLootData.forgery[suffix][q], goodValue:0}).update("source", GenshinLootData.forgery[suffix].source).update("days", GenshinLootData.forgery[suffix].days, "replace").update("quality", q).update("shorthand", suffix)));
    
    // Flora mats
    for(let c in GenshinCharacterData)
      this.addGOOD({goodKey:GenshinCharacterData[c].matFlower, goodValue:0}).update("quality", 1);
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
