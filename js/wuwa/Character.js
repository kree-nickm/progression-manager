import AscensionData from "./gamedata/AscensionData.js";
import ForteData from "./gamedata/ForteData.js";
import LootData from "./gamedata/LootData.js";
import CharacterData from "./gamedata/CharacterData.js";
import CharacterMetadata from "./gamedata/CharacterMetadata.js";

import { handlebars, Renderer } from "../Renderer.js";
import Ascendable from "../Ascendable.js";
import WuWaItem from "./WuWaItem.js";

export default class Character extends Ascendable(WuWaItem)
{
  static dontSerialize = super.dontSerialize.concat(["_weapon","echoes"]);
  static templateName = "wuwa/renderCharacterAsPopup";
  
  static AscensionData = AscensionData;
  static TalentData = ForteData;
  static talentProperty = "forte";
  static talentTypes = {
    'Basic Attack': {full:"Basic Attack", word:"Attack", char:"A", min:1, dataType:""},
    'Resonance Skill': {full:"Resonance Skill", word:"Skill", char:"S", min:1, dataType:""},
    'Forte Circuit': {full:"Forte Circuit", word:"Circuit", char:"C", min:1, dataType:""},
    'Resonance Liberation': {full:"Resonance Liberation", word:"Liberation", char:"L", min:1, dataType:""},
    'Intro Skill': {full:"Intro Skill", word:"Intro", char:"I", min:1, dataType:""},
    'Basic Attack Bonus': {full:"Basic Attack Bonus", word:"Attack", char:"PA", min:0, dataType:"bonusB"},
    'Resonance Skill Bonus': {full:"Resonance Skill Bonus", word:"Skill", char:"PS", min:0, dataType:"bonusA"},
    'Forte Circuit Passive': {full:"Forte Circuit Passive", word:"Circuit", char:"PC", min:0, dataType:"circuit"},
    'Resonance Liberation Bonus': {full:"Resonance Liberation Bonus", word:"Liberation", char:"PL", min:0, dataType:"bonusA"},
    'Intro Skill Bonus': {full:"Intro Skill Bonus", word:"Intro", char:"PI", min:0, dataType:"bonusB"},
  };
  
  // Properties determined in-game.
  key = "";
  _level = 1;
  _ascension = 0;
  _sequence = 0;
  forte;

  // Properties that are not serialized.
  _weapon = null;
  echoes = {
    '0': null,
    '1': null,
    '2': null,
    '3': null,
    '4': null,
  };
  
  afterLoad()
  {
    if(CharacterData[this.key] || this.key.startsWith("Rover"))
    {
      if(!this.materialDefs)
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
              key: CharacterData[this.key].bossMat,
            },
            {
              property: "flora",
              key: CharacterData[this.key].floraMat,
            },
            {
              property: "weekly",
              key: CharacterData[this.key].weeklyMat,
            },
            {
              property: "enemy",
              group: LootData.primary[CharacterData[this.key].enemyMat],
              tiers: [2,3,4,5],
            },
            {
              property: "forgery",
              group: LootData.primary[CharacterData[this.key].forgeryMat],
              tiers: [2,3,4,5],
            },
          ],
          list: this.viewer.lists.MaterialList,
        };
      }
      super.afterLoad();
      return true;
    }
    else
    {
      console.warn(`Unknown character "${this.key}".`);
      return false;
    }
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(["weapon"].includes(field.path[0]))
      this.notifyType(field.string);
    return true;
  }
  
  async importDetails()
  {
    if(!this.detailedData)
    {
      const {default:details} = await import(`./gamedata/characters/${this.key}.details.js`);
      this.detailedData = details;
    }
    return this.detailedData;
  }
  
  // Getters/setters that enforce a value range.
  get level(){ return parseInt(this._level); }
  set level(val){ this._level = Math.min(Math.max(parseInt(val), 1), 90); }
  get ascension(){ return parseInt(this._ascension); }
  set ascension(val){ this._ascension = Math.min(Math.max(parseInt(val), 0), 6); }
  get sequence(){ return parseInt(this._sequence); }
  set sequence(val){ this._sequence = Math.min(Math.max(parseInt(val), 0), 6); }
  get weapon(){ return this._weapon; }
  set weapon(val){ this._weapon = val; }
  
  // Getters for data that is not stored on each instance of this class.
  get data(){ return CharacterData[this.key]; }
  get name(){ return CharacterData[this.key]?.name ?? this.key; }
  get weaponType(){ return CharacterData[this.key]?.weapon ?? ""; }
  get element(){ return CharacterData[this.key]?.element ?? ""; }
  get rarity(){ return CharacterData[this.key].rarity ?? 0; }
  get icon(){ return "img/wuwa/small/"+ (CharacterData[this.key].icon.slice(CharacterData[this.key].icon.lastIndexOf('.')+1) ?? "blank") +".webp"; }
  get portrait(){ return "img/wuwa/full/"+ (CharacterData[this.key].portrait.slice(CharacterData[this.key].portrait.lastIndexOf('.')+1) ?? "blank") +".webp"; }
  get releaseTimestamp(){ return CharacterData[this.key]?.release ? Date.parse(CharacterData[this.key]?.release) : 0; }
  
  getPlanMaterials(result={})
  {
    // EXP
    let exp = 0;
    for(let i=this.level; i<this.wishlist?.level??this.level; i++)
      exp += CharacterMetadata.levelScaling[i+1][`exp${this.rarity}`];
    if(exp > 0)
    {
      result["ShellCredit"] = Math.ceil(exp*0.35);
      result["PremiumResonancePotion"] = Math.floor(exp/20000);
      exp -= result["PremiumResonancePotion"] * 20000;
      result["AdvancedResonancePotion"] = Math.floor(exp/8000);
      exp -= result["AdvancedResonancePotion"] * 8000;
      result["MediumResonancePotion"] = Math.floor(exp/3000);
      exp -= result["MediumResonancePotion"] * 3000;
      result["BasicResonancePotion"] = Math.ceil(exp/1000);
      exp -= result["BasicResonancePotion"] * 1000;
    }
    
    return super.getPlanMaterials(result);
  }
  
  // This method should only be called by the item that is being equipped, when its "location" property is updated.
  equipItem(item, {slot}={})
  {
    if(item.constructor.name == "Weapon")
    {
      //console.debug(`Equipping weapon:`, {character:this.key, weapon:item.key});
      // Make note of existing equips.
      let previousCharacter = item.character;
      let previousItem = this.weapon;
      
      // Unequip the previous equips that we noted above.
      item.character = null;
      this.weapon = null;
      
      // If we had an item equipped, and the new item was equipped to another character, give that character our old item.
      if(previousItem && previousCharacter)
      {
        previousItem.character = null; // Prevents unnecessary recursion;
        previousItem.update("location", previousCharacter.key);
      }
      // If we had an item equipped, let it know it is now unequipped.
      else if(previousItem)
        previousItem.update("location", "");
      // If the new item was equipped to another character, delete the reference to the item.
      else if(previousCharacter)
        previousCharacter.update("weapon", null, "replace");
      
      // Finally, set the references on this character and the item to each other.
      this.update("weapon", item, "replace");
      item.character = this;
      return this;
    }
    else if(item.constructor.name == "Echo")
    {
      if(isNaN(slot))
      {
        console.error(`Aborting echo equip; echo slot must be specified.`);
        return this;
      }
      //console.debug(`Equipping echo:`, {character:this.key, echo:item.monsterKey, slot});
      
      // Make note of existing equips.
      let previousCharacter = item.character;
      let oldSlot;
      if(previousCharacter)
      {
        oldSlot = Object.values(previousCharacter.echoes).indexOf(item);
        if(oldSlot == -1)
          console.error(`Couldn't find echo on its current character when trying to unequip it from them.`, {character:previousCharacter.key, echo:item.monsterKey});
      }
      let previousItem = this.echoes[slot];
      
      // Unequip the previous equips that we noted above.
      item.character = null;
      this.echoes[slot] = null;
      
      // If we had an item equipped, and the new item was equipped to another character, give that character our old item.
      if(previousItem && previousCharacter)
      {
        previousItem.character = null; // Prevents unnecessary recursion;
        previousItem.update("location", `${previousCharacter.key}:${oldSlot}`);
      }
      // If we had an item equipped, let it know it is now unequipped.
      else if(previousItem)
        previousItem.update("location", "");
      // If the new item was equipped to another character, delete the reference to the item.
      else if(previousCharacter)
        previousCharacter.update(`echoes.${oldSlot}`, null, "replace");
      
      // Finally, set the references on this character and the item to each other.
      this.update(`echoes.${slot}`, item, "replace");
      item.character = this;
      return this;
    }
    else
    {
      console.error(`${this.name} cannot equip unknown item type '${item.constructor.name}'.`);
      return this;
    }
  }
}
