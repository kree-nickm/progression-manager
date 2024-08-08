import LootData from "./gamedata/LootData.js";

import Character from "./Character.js";

export default class Rover extends Character
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
          property: "credit",
          key: "Shell Credit",
          skipUser: true,
        },
        {
          property: "boss",
          key: "Mysterious Code",
        },
        {
          property: "flora",
          key: "Pecok Flower",
        },
        {
          property: "enemy",
          group: LootData.primary["Whisperin Core"],
          tiers: [2,3,4,5],
        },
        {
          property: "forgery",
          group: LootData.primary["Metallic Drip"],
          tiers: [2,3,4,5],
        },
      ],
      list: this.viewer.lists.MaterialList,
    };
    if(this.key.endsWith("Spectro"))
    {
      this._element = "Spectro";
      this.materialDefs.materials.push({
        property: "weekly",
        key: "Unending Destruction",
      });
    }
    else if(this.key.endsWith("Havoc"))
    {
      this._element = "Havoc";
      this.materialDefs.materials.push({
        property: "weekly",
        key: "Dreamless Feather",
      });
    }
    else
    {
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
  
  get weaponType(){ return "Sword"; }
  get element(){ return this._element; }
  get rarity(){ return 5; }
  
  getMatCost(type, ascension=this.ascension)
  {
    if(type == "boss")
      return [0,1,1,1,1,1][ascension];
    else
      return super.getMatCost(type, ascension);
  }
  
  postRender(element)
  {
    // Only the variants can be inspected, so force it to one of them if this is the base Rover.
    if(this.base)
      super.postRender(element);
    else
      this.variants[0].postRender(element);
  }
}
