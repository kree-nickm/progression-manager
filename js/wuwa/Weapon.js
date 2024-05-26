import AscensionData from "./gamedata/AscensionData.js";
import LootData from "./gamedata/LootData.js";
import WeaponData from "./gamedata/WeaponData.js";
import WeaponMetadata from "./gamedata/WeaponMetadata.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaItem from "./WuWaItem.js";

export default class Weapon extends WuWaItem
{
  static dontSerialize = WuWaItem.dontSerialize.concat(["MaterialList","character"]);
  static templateName = "wuwa/renderWeaponAsPopup";
  
  key = "";
  _level = 1;
  _ascension = 0;
  _syntonization = 1;
  location = "";
  lock = false;
  
  isPreview = false;
  favorite = false;
  
  MaterialList;
  character = null;
  
  afterLoad()
  {
    if(this.isPreview)
    {
    }
    else if(!WeaponData[this.key])
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
        credit: this.viewer.lists.MaterialList.get("Shell Credit"),
      };
      // Retrieve the materials used by this character.
      this.MaterialList.enemy = {
        '2': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].enemyMat][2]),
        '3': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].enemyMat][3]),
        '4': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].enemyMat][4]),
        '5': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].enemyMat][5]),
      };
      this.MaterialList.forgery = {
        '2': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].forgeryMat][2]),
        '3': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].forgeryMat][3]),
        '4': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].forgeryMat][4]),
        '5': this.viewer.lists.MaterialList.get(LootData.primary[WeaponData[this.key].forgeryMat][5]),
      };
      
      // Inform those materials that this character uses them.
      for(let i in this.MaterialList.enemy)
        this.MaterialList.enemy[i]?.addUser(this);
      for(let i in this.MaterialList.forgery)
        this.MaterialList.forgery[i]?.addUser(this);
      
      return true;
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
  
  getPassive(syntonization=this.syntonization)
  {
    return WeaponData[this.key]?.passive?.replaceAll(/\{(\d+)\}/g, (m, id) => `<b title="${Object.values(WeaponData[this.key]?.rankData?.[id]??[]).join(' / ')}">${WeaponData[this.key]?.rankData?.[id]?.[parseInt(syntonization)-1]}</b>`).replaceAll(`\n`,"<br/>");
  }
  
  getRankData(ascension=this.ascension)
  {
    return AscensionData[ascension] ?? AscensionData[6];
  }
  
  getMat(type, ascension=this.ascension)
  {
    let rarity = this.getRankData(ascension)[`${type}RarityWeapon`];
    if(rarity)
      return this.MaterialList[type]?.[rarity];
    else
      return this.MaterialList[type];
  }
  
  getMatCost(type, ascension=this.ascension)
  {
    return this.getRankData(ascension)[`${type}CostWeapon`][this.rarity];
  }
  
  upPhase(event)
  {
    if(this.ascension == 6)
    {
      console.error(`Tried to ascend ${this.name}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getMat('enemy').update("count", this.getMat('enemy').count - this.getMatCost('enemy'));
    this.getMat('forgery').update("count", this.getMat('forgery').count - this.getMatCost('forgery'));
    this.getMat('credit').update("count", this.getMat('credit').count - this.getMatCost('credit'));
    if(this.level < this.getRankData().levelCap)
      this.update("level", this.getRankData().levelCap);
    this.update("ascension", this.ascension+1);
  }
  
  canUpPhase(withCrafting=false)
  {
    if(this.ascension == 6)
      return false;
    else if(withCrafting)
      return this.getMat('enemy')?.getCraftCount() >= this.getMatCost('enemy') &&
        this.getMat('forgery')?.getCraftCount() >= this.getMatCost('forgery') &&
        this.getMat('credit')?.getCraftCount() >= this.getMatCost('credit');
    else
      return this.getMat('enemy')?.count >= this.getMatCost('enemy') &&
        this.getMat('forgery')?.count >= this.getMatCost('forgery') &&
        this.getMat('credit')?.count >= this.getMatCost('credit');
  }
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
}
