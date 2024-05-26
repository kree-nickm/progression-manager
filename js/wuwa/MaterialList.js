import LootData from "./gamedata/LootData.js";
import CharacterData from "./gamedata/CharacterData.js";

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
    // Primary mats
    for(let shorthand in LootData.primary)
    {
      let tiers = [];
      for(let rarity of [5,4,3,2])
      {
        if(LootData.primary[shorthand][rarity])
          tiers.push(this.createItem({
            key: LootData.primary[shorthand][rarity],
            count: 0,
            source: LootData.primary[shorthand].source ?? shorthand,
            shorthand: shorthand,
            rarity: rarity,
          }));
      }
      Material.setupTiers(tiers);
    }
    
    // Character mats
    for(let key in CharacterData)
    {
      if(CharacterData[key].bossMat)
        this.createItem({
          key: CharacterData[key].bossMat,
          count: 0,
          rarity: 4,
        });
    }
    for(let key in CharacterData)
    {
      if(CharacterData[key].weeklyMat)
        this.createItem({
          key: CharacterData[key].weeklyMat,
          count: 0,
          rarity: 4,
        });
    }
    for(let key in CharacterData)
    {
      if(CharacterData[key].floraMat)
        this.createItem({
          key: CharacterData[key].floraMat,
          count: 0,
          rarity: 1,
        });
    }
    
    this.createItem({
      key: "Shell Credit",
      count: 0,
      shorthand: "Credit",
      rarity: 3,
    });
  }
  
  getUnique(item)
  {
    return item.key;
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
    await super.render(force);
    
    let footer = document.getElementById("footer");
    footer.classList.add("d-none");
  }
}
