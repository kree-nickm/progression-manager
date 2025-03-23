const {default:GenshinLootData} = await window.importer.get(`js/genshin/gamedata/GenshinLootData.js`);
const {default:GenshinCharacterData} = await window.importer.get(`js/genshin/gamedata/GenshinCharacterData.js`);

const { Renderer } = await window.importer.get(`js/Renderer.js`);
const {default:GenshinList} = await window.importer.get(`js/genshin/GenshinList.js`);
const {default:Material} = await window.importer.get(`js/genshin/Material.js`);

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
      classes: item => ({
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      }),
      popup: item => item,
    });
    
    let sourceField = this.display.addField("source", {
      label: "Source",
      dynamic: true,
      value: item => item.source ? item.source + (item.days?.length ? "; "+ item.days?.join(", ") : "") : "",
      classes: item => ({
        "today": item.days?.indexOf(item.list.viewer.today()) > -1,
      }),
      dependencies: item => [
        item.days?.length ? {item:this.viewer, field:"today"} : null,
      ],
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
              "d-none": item.days?.indexOf(item.viewer.today()) == -1,
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
      popup: item => item,
      dependencies: item => [
        item.days?.length ? {item:this.viewer, field:"today"} : null,
      ],
    });
    
    Material.setupDisplay(this.display);
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
    this.addGOOD({goodKey:"TheCornerstoneOfStarsAndFlames", goodValue:0}).update("source", "Obtained from completed regional quests in Natlan");
      
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
    
    // Generic prog mats
    this.addGOOD({goodKey:"Mora", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"HerosWit", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"AdventurersExperience", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"WanderersAdvice", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"MysticEnhancementOre", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"FineEnhancementOre", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"EnhancementOre", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"SanctifyingEssence", goodValue:0}).update("type", "leyline");
    this.addGOOD({goodKey:"SanctifyingUnction", goodValue:0}).update("type", "leyline");
    
    // Billets
    this.addGOOD({goodKey:"StrangeTooth", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"NorthlanderSwordBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"NorthlanderBowBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"NorthlanderClaymoreBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"NorthlanderCatalystBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"NorthlanderPolearmBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"MidlanderSwordBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"MidlanderBowBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"MidlanderClaymoreBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"MidlanderCatalystBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"MidlanderPolearmBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"BorderlandSwordBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"BorderlandBowBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"BorderlandClaymoreBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"BorderlandCatalystBillet", goodValue:0}).update("type", "billet");
    this.addGOOD({goodKey:"BorderlandPolearmBillet", goodValue:0}).update("type", "billet");
    
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
    {
      data.fields = [
        {field:this.display.getField("name"), params:[]},
        {field:this.display.getField("count"), params:[]},
        {field:this.display.getField("source"), params:[]},
        {field:this.display.getField("users"), params:[]},
      ];
      return {element, data, options};
    }
  }
}
