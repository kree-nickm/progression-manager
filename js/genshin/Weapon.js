import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";
import GenshinWeaponStats from "./gamedata/GenshinWeaponStats.js";
import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";

import GenshinItem from "./GenshinItem.js";
import Ascendable from "../Ascendable.js";
import Equipment from "../Equipment.js";

export default class Weapon extends Equipment(Ascendable(GenshinItem))
{
  //static dontSerialize = super.dontSerialize.concat([]);
  static goodProperties = ["key","level","ascension","refinement","location","lock"];
  static templateName = "genshin/renderWeaponAsPopup";
  static AscensionData = GenshinPhaseData;
  
  key = "";
  _level = 1;
  _ascension = 0;
  _refinement = 1;
  
  isPreview = false;
  characterList = window.viewer.lists.CharacterList;
  
  afterLoad()
  {
    if(this.isPreview)
    {
      return true;
    }
    else if(!GenshinWeaponData[this.key])
    {
      console.warn(`Unknown weapon "${this.key}".`);
      return false;
    }
    else
    {
      if(GenshinWeaponData[this.key].renamed)
        this.key = GenshinWeaponData[this.key].renamed;
      
      this.materialDefs = {
        raritySuffix: "RarityWeapon",
        costSuffix: "CostWeapon",
        materials: [
          {
            property: "mora",
            key: "Mora",
            skipUser: true,
          },
          {
            property: "forgery",
            group: GenshinLootData.forgery[GenshinWeaponData[this.key]?.matForgery],
            tiers: [2,3,4,5],
          },
          {
            property: "strong",
            group: GenshinLootData.enemy[GenshinWeaponData[this.key]?.matStrongEnemy],
            tiers: [2,3,4],
          },
          {
            property: "weak",
            group: GenshinLootData.enemy[GenshinWeaponData[this.key]?.matWeakEnemy],
            tiers: [1,2,3],
          },
        ],
        list: this.viewer.lists.MaterialList,
      };
      super.afterLoad();
      return true;
    }
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "refinement")
    {
      this.clearMemory("code");
    }
  }
  
  // Getters/setters that enforce a value range.
  get refinement(){ return this._refinement; }
  set refinement(val){ this._refinement = Math.min(Math.max(val, 1), 5); }
  get ascension(){ return this._ascension; }
  set ascension(val){ this._ascension = Math.min(Math.max(val, 0), 6); }
  get level(){ return this._level; }
  set level(val){ this._level = Math.min(Math.max(val, 1), 90); }
  
  // Getters/setters for genshin item data that is not stored on each instance of this class.
  get name(){ return GenshinWeaponData[this.key]?.name; }
  get rarity(){ return GenshinWeaponData[this.key]?.rarity; }
  get type(){ return GenshinWeaponData[this.key]?.type; }
  get stat(){ return GenshinWeaponData[this.key]?.stat; }
  get baseATK(){ return GenshinWeaponData[this.key]?.baseATK; }
  get image(){ return GenshinWeaponData[this.key]?.imgs[this.ascension > 1 ? 1 : 0]; }
  get releaseTimestamp(){ return GenshinWeaponData[this.key]?.release ? Date.parse(GenshinWeaponData[this.key]?.release) : 0; }
  get equipProperty() { return "weapon"; }
  
  canEquip(character)
  {
    return this.type == character.weaponType;
  }
  
  getPassive(ref=this.refinement)
  {
    return GenshinWeaponData[this.key]?.passive?.replaceAll(/@(\d+)/g, (m, id) => `<b title="${Object.values(GenshinWeaponData[this.key]?.refinementData?.[id]??[]).join(' / ')}">${GenshinWeaponData[this.key]?.refinementData?.[id]?.[ref]}</b>`).replaceAll(`\n`,"<br/>");
  }
  
  getPlanMaterials(result={})
  {
    // EXP
    /*let exp = (GenshinCharacterStats.totalExpCost[this.wishlist.level] ?? 0) - GenshinCharacterStats.totalExpCost[this.level];
    if(exp > 0)
    {
      result["Mora"] = Math.ceil(exp/5);
      result["HerosWit"] = Math.floor(exp/20000);
      exp -= result["HerosWit"] * 20000;
      result["AdventurersExperience"] = Math.floor(exp/5000);
      exp -= result["AdventurersExperience"] * 5000;
      result["WanderersAdvice"] = Math.ceil(exp/1000);
      exp -= result["WanderersAdvice"] * 1000;
    }*/
    
    return super.getPlanMaterials(result);
  }
  
  getATK(alternates={})
  {
    let tempAscension = alternates?.weaponAscension ?? (alternates?.preview ? (alternates.character?.preview.weaponAscension ?? this.ascension) : this.ascension);
    let tempLevel = alternates?.weaponLevel ?? (alternates?.preview ? (alternates.character?.preview.weaponLevel ?? this.level) : this.level);
    return GenshinWeaponStats[this.rarity][this.baseATK].atk[0] * GenshinWeaponStats[GenshinWeaponStats[this.rarity][this.baseATK].levelAtkScale][tempLevel-1] + (tempAscension > 1 ? GenshinWeaponStats[this.rarity].ascendValues[tempAscension-1] : 0);
  }
  
  getStat(alternates={})
  {
    let tempLevel = alternates?.weaponLevel ?? (alternates?.preview ? (alternates.character?.preview.weaponLevel ?? this.level) : this.level);
    return GenshinWeaponStats[this.rarity][this.baseATK][this.stat] * GenshinWeaponStats[GenshinWeaponStats[this.rarity][this.baseATK].levelStatScale][tempLevel-1];
  }
  
  cloneCode(array=[], alternates={})
  {
    let tempRefine = alternates?.refinement ?? (alternates?.preview ? (alternates.character?.preview.refinement ?? this.refinement) : this.refinement);
    let clone = [];
    for(let elem of array)
    {
      if(typeof(elem) == "object")
        clone.push(this.cloneCode(elem, alternates));
      else
      {
        if(typeof(elem) == "string")
          elem = elem.replace(/@(\d+)/g, (m, id) => GenshinWeaponData[this.key]?.refinementData?.[id]?.[tempRefine] ?? `@${id}`);
        clone.push(elem);
      }
    }
    return clone;
  }
  
  getCode(alternates={})
  {
    let result;
    let remembered = this.loadMemory("code");
    if(!remembered)
    {
      // Clone because we don't want GenshinWeaponData to be modified when we substitute the passive's refinement-dependent values.
      let code = this.cloneCode(GenshinWeaponData[this.key]?.code??[], alternates);
      if(code.length)
      {
        result = code;
        this.saveMemory(result, "code");
      }
    }
    else
      result = remembered;
    return result;
  }
}
