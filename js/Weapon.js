import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";
import GenshinWeaponStats from "./gamedata/GenshinWeaponStats.js";
import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";

import GenshinItem from "./GenshinItem.js";

export default class Weapon extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["MaterialList","loaded"]);
  static templateName = "renderWeaponAsPopup";
  static templateTitleName = "renderWeaponAsPopupTitle";
  
  id;
  key = "";
  _refinement = 1;
  _ascension = 0;
  _level = 1;
  location = "";
  lock = false;
  loaded = false;
  favorite = false;
  MaterialList;
  
  afterLoad()
  {
    this.MaterialList = {};
    if(GenshinWeaponData[this.key])
    {
      this.loaded = true;
      
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
          console.error(`${this.name} has an invalid forgery material at quality ${i}.`);
      }
      for(let i in this.MaterialList.strong)
      {
        if(this.MaterialList.strong[i])
          this.MaterialList.strong[i].addUser(this);
        else
          console.error(`${this.name} has an invalid strong enemy material at quality ${i}.`);
      }
      for(let i in this.MaterialList.weak)
      {
        if(this.MaterialList.weak[i])
          this.MaterialList.weak[i].addUser(this);
        else
          console.error(`${this.name} has an invalid weak enemy material at quality ${i}.`);
      }
    }
    else
    {
      console.warn(`Unknown weapon "${this.key}".`);
      this.loaded = false;
    }
    return this.loaded;
  }
  
  toGOOD()
  {
    let result = super.toGOOD();
    result.favorite = this.favorite;
    return result;
  }
  
  afterUpdate(field, value)
  {
    if(field.string == "location")
    {
      if(value)
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
        if(this.character)
        {
          this.character.weapon = null;
          this.character.notifyType("weapon");
        }
        this.character = null;
      }
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
  get name(){ return this.loaded ? GenshinWeaponData[this.key].name : this.key; }
  get quality(){ return this.loaded ? GenshinWeaponData[this.key].quality : 0; }
  get type(){ return this.loaded ? GenshinWeaponData[this.key].type : ""; }
  get stat(){ return this.loaded ? GenshinWeaponData[this.key].stat : ""; }
  get baseStat(){ return this.loaded ? GenshinWeaponData[this.key].baseStat : 0; }
  get baseATK(){ return this.loaded ? GenshinWeaponData[this.key].baseATK : 0; }
  get forgeryMatType(){ return this.loaded ? GenshinWeaponData[this.key].matForgery : ""; }
  get strongMatType(){ return this.loaded ? GenshinWeaponData[this.key].matStrongEnemy : ""; }
  get weakMatType(){ return this.loaded ? GenshinWeaponData[this.key].matWeakEnemy : ""; }
  
  getPhase(phase=this.ascension) { return GenshinPhaseData[phase] ?? GenshinPhaseData[6]; }
  get levelCap(){ return this.getPhase().levelCap; }
  
  getMat(type, ascension=this.ascension)
  {
    if(type == "forgery")
      return this.MaterialList.forgery[this.getPhase(ascension).ascendMatForgeQuality];
    else if(type == "strong")
      return this.MaterialList.strong[this.getPhase(ascension).ascendMatStrongQuality];
    else if(type == "weak")
      return this.MaterialList.weak[this.getPhase(ascension).ascendMatWeakQuality];
    else
      return null;
  }
  
  getMatCost(type, ascension=this.ascension)
  {
    if(type == "forgery")
      return this.getPhase(ascension).ascendMatForgeCount[this.quality];
    else if(type == "strong")
      return this.getPhase(ascension).ascendMatStrongCount[this.quality];
    else if(type == "weak")
      return this.getPhase(ascension).ascendMatWeakCount[this.quality];
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
    this.getMat('forgery').update("count", this.getMat('forgery').count - this.getMatCost('forgery'));
    this.getMat('strong').update("count", this.getMat('strong').count - this.getMatCost('strong'));
    this.getMat('weak').update("count", this.getMat('weak').count - this.getMatCost('weak'));
    if(this.level < this.levelCap)
      this.update("level", this.levelCap);
    this.update("ascension", this.ascension+1);
    this.list.viewer.store();
    this.list.render();
  }
  
  canUpPhase(withCrafting=false)
  {
    if(this.ascension == 6)
      return false;
    else if(withCrafting)
      return this.getMat('forgery').getCraftCount() >= this.getMatCost('forgery') &&
        this.getMat('strong').getCraftCount() >= this.getMatCost('strong') &&
        this.getMat('weak').getCraftCount() >= this.getMatCost('weak');
    else
      return this.getMat('forgery').count >= this.getMatCost('forgery') &&
        this.getMat('strong').count >= this.getMatCost('strong') &&
        this.getMat('weak').count >= this.getMatCost('weak');
  }
  
  getATK()
  {
    let statLower = GenshinWeaponStats[this.quality][this.baseATK].atk[this.ascension*2];
    let statUpper = GenshinWeaponStats[this.quality][this.baseATK].atk[this.ascension*2+1];
    let lvlMin = GenshinPhaseData[this.ascension-1]?.levelCap ?? 1;
    let lvlMax = GenshinPhaseData[this.ascension].levelCap;
    let scale = (this.level - lvlMin) / (lvlMax - lvlMin);
    return statLower + (statUpper-statLower) * scale;
  }
  
  getStat()
  {
    let stat = GenshinWeaponStats[this.quality][this.baseATK][this.stat] ?? this.baseStat;
    //let stat = this.baseStat;
    let factor = 1 + 0.04038405 * (this.level-1);
    return stat * factor;
  }
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink();
  }
}
