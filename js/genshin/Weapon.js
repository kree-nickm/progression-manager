import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";
import GenshinWeaponStats from "./gamedata/GenshinWeaponStats.js";
import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";

import GenshinItem from "./GenshinItem.js";
import Ascendable from "./Ascendable.js";

export default class Weapon extends Ascendable(GenshinItem)
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["MaterialList","character"]);
  static goodProperties = ["key","level","ascension","refinement","location","lock"];
  static templateName = "genshin/renderWeaponAsPopup";
  
  key = "";
  _level = 1;
  _ascension = 0;
  _refinement = 1;
  location = "";
  lock = false;
  
  isPreview = false;
  favorite = false;
  
  character = null;
  MaterialList;
  
  afterLoad()
  {
    if(this.isPreview)
    {
    }
    else if(!GenshinWeaponData[this.key])
    {
      console.warn(`Unknown weapon "${this.key}".`);
    }
    else if(!this.list?.viewer?.lists?.MaterialList)
    {
      console.warn(`Weapon cannot access the material list.`);
    }
    else
    {
      this.MaterialList = {
        mora: this.list.viewer.lists.MaterialList.get("Mora"),
      };
      
      // Retrieve the materials used by this character.
      this.MaterialList.forgery = {
        '2': this.list.viewer.lists.MaterialList.get(GenshinLootData.forgery[this.forgeryMatType][2]),
        '3': this.list.viewer.lists.MaterialList.get(GenshinLootData.forgery[this.forgeryMatType][3]),
        '4': this.list.viewer.lists.MaterialList.get(GenshinLootData.forgery[this.forgeryMatType][4]),
        '5': this.list.viewer.lists.MaterialList.get(GenshinLootData.forgery[this.forgeryMatType][5]),
      };
      this.MaterialList.strong = {
        '2': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.strongMatType][2]),
        '3': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.strongMatType][3]),
        '4': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.strongMatType][4]),
      };
      this.MaterialList.weak = {
        '1': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.weakMatType][1]),
        '2': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.weakMatType][2]),
        '3': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.weakMatType][3]),
      };
      
      // Inform those materials that this character uses them.
      for(let i in this.MaterialList.forgery)
      {
        if(this.MaterialList.forgery[i])
          this.MaterialList.forgery[i].addUser(this);
        else
          console.error(`${this.name} has an invalid forgery material at rarity ${i}.`);
      }
      for(let i in this.MaterialList.strong)
      {
        if(this.MaterialList.strong[i])
          this.MaterialList.strong[i].addUser(this);
        else
          console.error(`${this.name} has an invalid strong enemy material at rarity ${i}.`);
      }
      for(let i in this.MaterialList.weak)
      {
        if(this.MaterialList.weak[i])
          this.MaterialList.weak[i].addUser(this);
        else
          console.error(`${this.name} has an invalid weak enemy material at rarity ${i}.`);
      }
    }
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location" && !this.isPreview)
    {
      if(value)
      {
        if(this.list?.viewer?.lists?.CharacterList)
        {
          let newCharacter = this.list.viewer.lists.CharacterList.get(value);
          if(newCharacter)
            newCharacter.equipItem(this);
          else
          {
            console.warn(`Cannot equip ${this.name} to non-existent character "${this.location}".`);
            field.object[field.property] = "";
            this.character = null;
          }
        }
        else
        {
          console.warn(`Cannot equip ${this.name} to character "${this.location}" because character list is inaccessible.`);
          field.object[field.property] = "";
          this.character = null;
        }
      }
      else
      {
        if(this.character)
          this.character.update("weapon", null, "replace");
        this.character = null;
      }
    }
    else if(field.string == "refinement")
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
  get forgeryMatType(){ return GenshinWeaponData[this.key]?.matForgery; }
  get strongMatType(){ return GenshinWeaponData[this.key]?.matStrongEnemy; }
  get weakMatType(){ return GenshinWeaponData[this.key]?.matWeakEnemy; }
  get image(){ return GenshinWeaponData[this.key]?.imgs[this.ascension > 1 ? 1 : 0]; }
  get releaseTimestamp(){ return GenshinWeaponData[this.key]?.release ? Date.parse(GenshinWeaponData[this.key]?.release) : 0; }
  
  getPassive(ref=this.refinement)
  {
    return GenshinWeaponData[this.key]?.passive?.replaceAll(/@(\d+)/g, (m, id) => `<b title="${Object.values(GenshinWeaponData[this.key]?.refinementData?.[id]??[]).join(' / ')}">${GenshinWeaponData[this.key]?.refinementData?.[id]?.[ref]}</b>`).replaceAll(`\n`,"<br/>");
  }
  
  getPhase(phase=this.ascension) { return GenshinPhaseData[phase] ?? GenshinPhaseData[6]; }
  get levelCap(){ return this.getPhase().levelCap; }
  
  getMat(type, ascension=this.ascension)
  {
    if(type == "forgery")
      return this.MaterialList?.forgery[this.getPhase(ascension).ascendMatForgeQuality];
    else if(type == "strong")
      return this.MaterialList?.strong[this.getPhase(ascension).ascendMatStrongQuality];
    else if(type == "weak")
      return this.MaterialList?.weak[this.getPhase(ascension).ascendMatWeakQuality];
    else if(type == "mora")
      return this.MaterialList?.mora;
    else
      return null;
  }
  
  getMatCost(type, ascension=this.ascension)
  {
    if(type == "forgery")
      return this.getPhase(ascension)?.ascendMatForgeCount[this.rarity];
    else if(type == "strong")
      return this.getPhase(ascension)?.ascendMatStrongCount[this.rarity];
    else if(type == "weak")
      return this.getPhase(ascension)?.ascendMatWeakCount[this.rarity];
    else if(type == "mora")
      return this.getPhase(ascension)?.ascendWpnMoraCost[this.rarity];
    else
      return 0;
  }
  
  upPhase(event)
  {
    if(this.ascension == 6)
    {
      console.error(`Tried to ascend ${this.name}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getMat('forgery')?.update("count", this.getMat('forgery')?.count - this.getMatCost('forgery'));
    this.getMat('strong')?.update("count", this.getMat('strong')?.count - this.getMatCost('strong'));
    this.getMat('weak')?.update("count", this.getMat('weak')?.count - this.getMatCost('weak'));
    this.getMat('mora')?.update("count", this.getMat('mora')?.count - this.getMatCost('mora'));
    if(this.level < this.levelCap)
      this.update("level", this.levelCap);
    this.update("ascension", this.ascension+1);
    return true;
  }
  
  canUpPhase(withCrafting=false)
  {
    if(this.ascension == 6)
      return false;
    else if(withCrafting)
      return this.getMat('forgery')?.getCraftCount() >= this.getMatCost('forgery') &&
        this.getMat('strong')?.getCraftCount() >= this.getMatCost('strong') &&
        this.getMat('weak')?.getCraftCount() >= this.getMatCost('weak') &&
        this.getMat('mora')?.getCraftCount() >= this.getMatCost('mora');
    else
      return this.getMat('forgery')?.count >= this.getMatCost('forgery') &&
        this.getMat('strong')?.count >= this.getMatCost('strong') &&
        this.getMat('weak')?.count >= this.getMatCost('weak') &&
        this.getMat('mora')?.count >= this.getMatCost('mora');
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
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
}
