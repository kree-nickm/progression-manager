import LootData from "./gamedata/LootData.js";
import MaterialData from "./gamedata/MaterialData.js";

import { Renderer } from "../Renderer.js";
import WuWaList from "./WuWaList.js";
import Material from "./Material.js";

export default class MaterialList extends WuWaList
{
  static unique = true;
  static itemClass = Material;
  static subsetDefinitions = {
  };
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
      classes: item => ({
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      }),
    });
    
    let countField = this.display.addField("count", {
      label: "Count",
      dynamic: true,
      value: item => item.count + (item.prevTier || item.converts ? " (+"+ (item.getCraftCount()-item.count) +")" : ""),
      edit: item => ({
        target: {item:item, field:"count"}, min:0, max:99999,
      }),
      //dependencies: item => item.getCraftDependencies(),
    });
  }
  
  initialize()
  {
    for(let matKey in MaterialData)
    {
      this.createItem({
        key: matKey,
        count: 0,
      });
    }
    
    // Primary mats
    for(let shorthand in LootData.primary)
    {
      let tiers = [];
      for(let rarity of [5,4,3,2])
      {
        if(LootData.primary[shorthand][rarity])
        {
          let key = this.constructor.toKey(LootData.primary[shorthand][rarity]);
          let mat = this.get(key);
          if(mat)
            tiers.push(mat.update("shorthand", shorthand));
          else
            console.error(`Can't find ${key}`);
        }
      }
      Material.setupTiers(tiers);
    }
  }
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("count", 0);
    }
  }
}
