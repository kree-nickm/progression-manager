const {default:GenshinLootData} = await import(`./gamedata/GenshinLootData.js?v=${window.versionId}`);

const {default:Character} = await import(`./Character.js?v=${window.versionId}`);
const {default:Material} = await import(`./Material.js?v=${window.versionId}`);

export default class Traveler extends Character
{
  static dontSerialize = super.dontSerialize.concat(["_element","base","variants"]);
  
  _element = "";
  base;
  variants = [];
  
  afterLoad()
  {
    this.materialDefs = {
      raritySuffix: "RarityCharacter",
      costSuffix: "CostCharacter",
      talentRaritySuffix: "Rarity",
      talentCostSuffix: "Cost",
      materials: [
        {
          property: "mora",
          key: "Mora",
        },
        {
          property: "gem",
          prefix: "Brilliant Diamond",
          group: Material.gemQualities,
          tiers: [2,3,4,5],
        },
        {
          property: "flora",
          key: "Windwheel Aster",
        },
        {
          property: "crown",
          key: "Crown Of Insight",
        },
        {
          property: "enemy",
          group: GenshinLootData.enemy["Hilichurls"],
          tiers: [1,2,3],
        },
      ],
      list: this.viewer.lists.MaterialList,
    };
    if(this.key.endsWith("Anemo"))
    {
      this._element = "Anemo";
      this.materialDefs.materials.push({
        property: "trounce",
        key: "Dvalin's Sigh",
      });
      this.materialDefs.materials.push({
        property: "enemyTalent",
        group: GenshinLootData.enemy["Samachurls"],
        tiers: [1,2,3],
      });
      this.materialDefs.materials.push({
        property: "mastery",
        cycle: [
          {group:Material.masteryQualities, suffix:"Freedom", tiers:[2,3,4]},
          {group:Material.masteryQualities, suffix:"Resistance", tiers:[3,4]},
          {group:Material.masteryQualities, suffix:"Ballad", tiers:[3,4]},
        ],
      });
    }
    else if(this.key.endsWith("Geo"))
    {
      this._element = "Geo";
      this.materialDefs.materials.push({
        property: "trounce",
        key: "Tail Of Boreas",
      });
      this.materialDefs.materials.push({
        property: "enemyTalent",
        group: GenshinLootData.enemy["Hili.Archers"],
        tiers: [1,2,3],
      });
      this.materialDefs.materials.push({
        property: "mastery",
        cycle: [
          {group:Material.masteryQualities, suffix:"Prosperity", tiers:[2,3,4]},
          {group:Material.masteryQualities, suffix:"Diligence", tiers:[3,4]},
          {group:Material.masteryQualities, suffix:"Gold", tiers:[3,4]},
        ],
      });
    }
    else if(this.key.endsWith("Electro"))
    {
      this._element = "Electro";
      this.materialDefs.materials.push({
        property: "trounce",
        key: "Dragon Lord's Crown",
      });
      this.materialDefs.materials.push({
        property: "enemyTalent",
        group: GenshinLootData.enemy["Nobushi"],
        tiers: [1,2,3],
      });
      this.materialDefs.materials.push({
        property: "mastery",
        cycle: [
          {group:Material.masteryQualities, suffix:"Transience", tiers:[2,3,4]},
          {group:Material.masteryQualities, suffix:"Elegance", tiers:[3,4]},
          {group:Material.masteryQualities, suffix:"Light", tiers:[3,4]},
        ],
      });
    }
    else if(this.key.endsWith("Dendro"))
    {
      this._element = "Dendro";
      this.materialDefs.materials.push({
        property: "trounce",
        key: "Mudra Of The Malefic General",
      });
      this.materialDefs.materials.push({
        property: "enemyTalent",
        group: GenshinLootData.enemy["Fungi"],
        tiers: [1,2,3],
      });
      this.materialDefs.materials.push({
        property: "mastery",
        cycle: [
          {group:Material.masteryQualities, suffix:"Admonition", tiers:[2,3,4]},
          {group:Material.masteryQualities, suffix:"Ingenuity", tiers:[3,4]},
          {group:Material.masteryQualities, suffix:"Praxis", tiers:[3,4]},
        ],
      });
    }
    else if(this.key.endsWith("Hydro"))
    {
      this._element = "Hydro";
      this.materialDefs.materials.push({
        property: "trounce",
        key: "Worldspan Fern",
      });
      this.materialDefs.materials.push({
        property: "enemyTalent",
        group: GenshinLootData.enemy["Fontemer"],
        tiers: [1,2,3],
      });
      this.materialDefs.materials.push({
        property: "mastery",
        cycle: [
          {group:Material.masteryQualities, suffix:"Equity", tiers:[2,3,4]},
          {group:Material.masteryQualities, suffix:"Justice", tiers:[3,4]},
          {group:Material.masteryQualities, suffix:"Order", tiers:[3,4]},
        ],
      });
    }
    
    super.afterLoad();
    return true;
  }
  
  get weapon()
  {
    if(this.base)
      return this.base.weapon;
    else
      return this._weapon;
  }
  set weapon(val)
  {
    if(this.base)
      this.base.weapon = val;
    else
      this._weapon = val;
  }
  get flowerArtifact()
  {
    if(this.base)
      return this.base.flowerArtifact;
    else
      return this._flower;
  }
  set flowerArtifact(val)
  {
    if(this.base)
      this.base.flowerArtifact = val;
    else
      this._flower = val;
  }
  get plumeArtifact()
  {
    if(this.base)
      return this.base.plumeArtifact;
    else
      return this._plume;
  }
  set plumeArtifact(val)
  {
    if(this.base)
      this.base.plumeArtifact = val;
    else
      this._plume = val;
  }
  get sandsArtifact()
  {
    if(this.base)
      return this.base.sandsArtifact;
    else
      return this._sands;
  }
  set sandsArtifact(val)
  {
    if(this.base)
      this.base.sandsArtifact = val;
    else
      this._sands = val;
  }
  get gobletArtifact()
  {
    if(this.base)
      return this.base.gobletArtifact;
    else
      return this._goblet;
  }
  set gobletArtifact(val)
  {
    if(this.base)
      this.base.gobletArtifact = val;
    else
      this._goblet = val;
  }
  get circletArtifact()
  {
    if(this.base)
      return this.base.circletArtifact;
    else
      return this._circlet;
  }
  set circletArtifact(val)
  {
    if(this.base)
      this.base.circletArtifact = val;
    else
      this._circlet = val;
  }
  get ascension()
  {
    if(this.base)
      return this.base.ascension;
    else
      return this._ascension;
  }
  set ascension(val)
  {
    if(this.base)
      this.base.ascension = val;
    else
      this._ascension = Math.min(Math.max(val, 0), 6);
  }
  get level()
  {
    if(this.base)
      return this.base.level;
    else
      return this._level;
  }
  set level(val)
  {
    if(this.base)
      this.base.level = val;
    else
      this._level = Math.min(Math.max(val, 1), 90);
  }
  
  get name(){ return this.element ? "Traveler: "+ this.element : "Traveler"; }
  get weaponType(){ return "Sword"; }
  get element(){ return this._element; }
  get rarity(){ return 4; }
  get ascendStat(){ return "atk_"; }
  get bossMatType(){ return ""; }
  get flowerMatType(){ return "Windwheel Aster"; }
  get enemyMatType(){ return "Hilichurls"; }
  get image(){ return this.variants?.[0]?.image??super.image; }
  
  getTalentMat(type, talent)
  {
    if(type == "enemy")
      return super.getTalentMat("enemyTalent", talent);
    else
      return super.getTalentMat(type, talent);
  }
  
  postRender(element)
  {
    // Only the variants can be inspected, so force it to one of them if this is the base Traveler.
    if(this.base)
      super.postRender(element);
    else
      this.variants[0].postRender(element);
  }
}
