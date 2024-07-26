import AscensionData from "./gamedata/AscensionData.js";
import LootData from "./gamedata/LootData.js";
import WeaponData from "./gamedata/WeaponData.js";
import WeaponMetadata from "./gamedata/WeaponMetadata.js";

import { handlebars, Renderer } from "../Renderer.js";
import Ascendable from "../Ascendable.js";
import Equipment from "../Equipment.js";
import WuWaItem from "./WuWaItem.js";

export default class Weapon extends Equipment(Ascendable(WuWaItem))
{
  static templateName = "wuwa/renderWeaponAsPopup";
  static AscensionData = AscensionData;
  
  key = "";
  _level = 1;
  _ascension = 0;
  _syntonization = 1;
  
  isPreview = false;
  characterList = window.viewer.lists.CharacterList;
  
  afterLoad()
  {
    if(this.isPreview)
    {
      return true;
    }
    else if(!WeaponData[this.key])
    {
      console.warn(`Unknown weapon "${this.key}".`);
      return false;
    }
    else
    {
      if(WeaponData[this.key].renamed)
        this.key = WeaponData[this.key].renamed;
      
      this.materialDefs = {
        raritySuffix: "RarityWeapon",
        costSuffix: "CostWeapon",
        materials: [
          {
            property: "credit",
            key: "Shell Credit",
            skipUser: true,
          },
          {
            property: "enemy",
            group: LootData.primary[WeaponData[this.key].enemyMat],
            tiers: [2,3,4,5],
          },
          {
            property: "forgery",
            group: LootData.primary[WeaponData[this.key].forgeryMat],
            tiers: [2,3,4,5],
          },
        ],
        list: this.viewer.lists.MaterialList,
      };
      super.afterLoad();
      return true;
    }
  }
  
  // Getters/setters that enforce a value range.
  get level(){ return this._level; }
  set level(val){ this._level = Math.min(Math.max(val, 1), 90); }
  get ascension(){ return this._ascension; }
  set ascension(val){ this._ascension = Math.min(Math.max(val, 0), 6); }
  get syntonization(){ return this._syntonization; }
  set syntonization(val){ this._syntonization = Math.min(Math.max(val, 1), 5); }
  
  // Getters/setters for item data that is not stored on each instance of this class.
  get name(){ return WeaponData[this.key]?.name; }
  get rarity(){ return WeaponData[this.key]?.rarity; }
  get type(){ return WeaponData[this.key]?.type; }
  get releaseTimestamp(){ return WeaponData[this.key]?.release ? Date.parse(WeaponData[this.key]?.release) : 0; }
  get equipProperty() { return "weapon"; }
  
  getPlanMaterials(result={})
  {
    // EXP
    let exp = 0;
    for(let i=this.level; i<this.wishlist?.level??this.level; i++)
      exp += WeaponMetadata.levelScaling[i][`exp${this.rarity}`];
    if(exp > 0)
    {
      result["ShellCredit"] = Math.ceil(exp*0.4);
      result["PremiumEnergyCore"] = Math.floor(exp/20000);
      exp -= result["PremiumEnergyCore"] * 20000;
      result["AdvancedEnergyCore"] = Math.floor(exp/8000);
      exp -= result["AdvancedEnergyCore"] * 8000;
      result["MediumEnergyCore"] = Math.floor(exp/3000);
      exp -= result["MediumEnergyCore"] * 3000;
      result["BasicEnergyCore"] = Math.ceil(exp/1000);
      exp -= result["BasicEnergyCore"] * 1000;
    }
    
    return super.getPlanMaterials(result);
  }
  
  canEquip(character)
  {
    return this.type == character.weaponType;
  }
  
  getPassive(syntonization=this.syntonization)
  {
    return WeaponData[this.key]?.passive?.replaceAll(/\{(\d+)\}/g, (m, id) => `<b title="${Object.values(WeaponData[this.key]?.rankData?.[id]??[]).join(' / ')}">${WeaponData[this.key]?.rankData?.[id]?.[parseInt(syntonization)-1]}</b>`).replaceAll(`\n`,"<br/>");
  }
}
