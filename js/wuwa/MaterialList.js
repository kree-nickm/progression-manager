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
      title: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
        {
          let wanters = planMaterials.resolved[item.key].wanters.map(wanter => `${Renderer.controllers.get(wanter.src).name} wants ${wanter.amount}`).join(`\r\n`);
          return (item.prevTier || item.converts
            ? `Up to ${item.getCraftCount({plan:planMaterials.original})} if you craft.`
            : ``) + (wanters ? `\r\n`+wanters : ``);
        }
        else
        {
          return (item.prevTier || item.converts
            ? `Up to ${item.getCraftCount()} if you craft.`
            : ``);
        }
      },
      value: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
          return `${item.count} / ${planMaterials.original[item.key]}`;
        else
          return item.count + (item.prevTier || item.converts ? " (+"+ (item.getCraftCount()-item.count) +")" : "");
      },
      edit: item => ({
        target: {item:item, field:"count"}, min:0, max:99999,
      }),
      dependencies: item => {
        //let planMaterials = item.viewer.account.plan.getFullPlan();
        return item.getCraftDependencies();
      },
      classes: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
          return {
            "pending": item.count < planMaterials.original[item.key],
            "insufficient": item.getCraftCount({plan:planMaterials.original}) < planMaterials.original[item.key],
          };
        else
          return {};
      },
    });
  }
  
  initialize()
  {
    super.initialize();
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
