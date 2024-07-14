import AscensionData from "./gamedata/AscensionData.js";
import LootData from "./gamedata/LootData.js";
import WeaponData from "./gamedata/WeaponData.js";
import WeaponMetadata from "./gamedata/WeaponMetadata.js";

import { handlebars, Renderer } from "../Renderer.js";
import Ascendable from "../Ascendable.js";
import WuWaItem from "./WuWaItem.js";

export default class Weapon extends Ascendable(WuWaItem)
{
  static dontSerialize = super.dontSerialize.concat(["character"]);
  static templateName = "wuwa/renderWeaponAsPopup";
  
  static AscensionData = AscensionData;
  
  key = "";
  _level = 1;
  _ascension = 0;
  _syntonization = 1;
  location = "";
  lock = false;
  
  isPreview = false;
  
  character = null;
  
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
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
}
