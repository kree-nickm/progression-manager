import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";

import { Renderer } from "../Renderer.js";
import GenshinList from "./GenshinList.js";
import Material from "./Material.js";

export default class MaterialList extends GenshinList
{
  static unique = true;
  static itemClass = Material;
  static subsetDefinitions = {
    'enemy': item => item.type == "enemy",
    'trounce': item => item.type == "trounce",
    'boss': item => item.type == "boss",
    'gemstone': item => item.type == "gemstone",
    'mastery': item => item.type == "mastery",
    'crown': item => item.type == "crown",
    'forgery': item => item.type == "forgery",
    'leyline': item => item.type == "leyline",
    'billet': item => item.type == "billet",
    'flora': item => item.type == "flora",
    'bait': item => item.type == "bait",
    'wood': item => item.type == "wood",
    'unknown': item => item.type == "unknown",
  };
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
      classes: item => {return{
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      };},
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
        let planMaterials = item.viewer.account.plan.getFullPlan();
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
    
    let imageField = this.display.addField("image", {
      label: "Image",
      tags: ["detailsOnly"],
      dynamic: false,
      value: item => ({
        tag: "div",
        title: item.getFullSource(),
        value: [
          {
            tag: "i",
            title: "This drop can be obtained today.",
            classes: {
              "display-badge": true,
              "fa-solid": true,
              "fa-sun": true,
              "d-none": item.days.indexOf(item.viewer.today()) == -1,
            },
          },
          {
            tag: "img",
            src: item.image,
            alt: item.name,
          }
        ],
        classes: {"display-img": true, ["rarity-"+item.rarity]: true},
      }),
    });
  }
  
  initialize()
  {
    super.initialize();
    // Enemy mats
    for(let e in GenshinLootData.enemy)
      Material.setupTiers([4,3,2,1].map(q => GenshinLootData.enemy[e][q] ? this.addGOOD({goodKey:GenshinLootData.enemy[e][q], goodValue:0}).update("source", GenshinLootData.enemy[e].source ?? e).update("shorthand", e) : null));
    
    // Trounce mats
    for(let domain of GenshinLootData.trounce)
    {
      let weeklyMats = [];
      for(let itemName of domain.loot)
        weeklyMats.push(this.addGOOD({goodKey:itemName, goodValue:0}).update("source", domain.boss));
      for(let mat of weeklyMats)
        mat.update("converts", weeklyMats.filter(m => m != mat), "replace");
    }
      
    // Boss mats
    for(let b in GenshinLootData.boss)
      this.addGOOD({goodKey:GenshinLootData.boss[b]['4'], goodValue:0}).update("source", GenshinLootData.boss[b].name).update("shorthand", b);
    
    // Gemstone mats
    Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:"Brilliant Diamond" + Material.gemQualities[q], goodValue:0}).update("shorthand", "Diamond" + Material.gemQualities[q])));
    for(let elem in GenshinLootData.gemstone)
      Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:GenshinLootData.gemstone[elem].prefix + Material.gemQualities[q], goodValue:0}).update("shorthand", elem + Material.gemQualities[q])));
    
    // Mastery mats
    for(let suffix in GenshinLootData.mastery)
      Material.setupTiers([4,3,2].map(q => this.addGOOD({goodKey:Material.masteryQualities[q] + suffix, goodValue:0}).update("source", GenshinLootData.mastery[suffix].source).update("days", GenshinLootData.mastery[suffix].days, "replace").update("shorthand", suffix)));
    this.addGOOD({goodKey:"Crown Of Insight", goodValue:0}).update("shorthand", "Crown");
    
    // Forgery mats
    for(let suffix in GenshinLootData.forgery)
      Material.setupTiers([5,4,3,2].map(q => this.addGOOD({goodKey:GenshinLootData.forgery[suffix][q], goodValue:0}).update("source", GenshinLootData.forgery[suffix].source).update("days", GenshinLootData.forgery[suffix].days, "replace").update("shorthand", suffix)));
    
    this.addGOOD({goodKey:"Mora", goodValue:0}).update("type", "mora").update("type", "leyline");
    this.addGOOD({goodKey:"HerosWit", goodValue:0}).update("type", "mora").update("type", "leyline");
    this.addGOOD({goodKey:"AdventurersExperience", goodValue:0}).update("type", "mora").update("type", "leyline");
    this.addGOOD({goodKey:"WanderersAdvice", goodValue:0}).update("type", "mora").update("type", "leyline");
    
    // Flora mats
    for(let c in GenshinCharacterData)
      if(GenshinCharacterData[c].matFlower)
        this.addGOOD({goodKey:GenshinCharacterData[c].matFlower, goodValue:0}).update("type", "flora");
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
  
  prepareRender(element, data, options)
  {
    if(this.viewer.settings.preferences.materialList == '1')
    {
      data.items = {
        'enemy': this.items('enemy'),
        'trounce': this.items('trounce'),
        'boss': this.items('boss'),
        'gemstone': this.items('gemstone'),
        'mastery': this.items('mastery'),
        'crown': this.items('crown'),
        'forgery': this.items('forgery'),
        'leyline': this.items('leyline'),
        'billet': this.items('billet'),
        'flora': this.items('flora'),
        'bait': this.items('bait'),
        'wood': this.items('wood'),
        'unknown': this.items('unknown'),
      };
      data.fields = this.display.getFields().map(field => ({field, params:[]}));
      options.template = "genshin/renderMaterialList";
      return {element, data, options};
    }
    else
      return super.prepareRender(element, data, options);
  }
  
  async render(force=false)
  {
    await super.render(force);
    
    let footer = document.getElementById("footer");
    footer.classList.add("d-none");
  }
}
