import AscensionData from "./gamedata/AscensionData.js";
import ForteData from "./gamedata/ForteData.js";
import LootData from "./gamedata/LootData.js";
import CharacterData from "./gamedata/CharacterData.js";

import { handlebars, Renderer } from "../Renderer.js";
import Plannable from "./Plannable.js";
import WuWaItem from "./WuWaItem.js";

export default class Character extends Plannable(WuWaItem)
{
  static dontSerialize = WuWaItem.dontSerialize.concat(["MaterialList","_weapon","echoes"]);
  static templateName = "wuwa/renderCharacterAsPopup";
  
  key = "";
  _level = 1;
  _ascension = 0;
  _sequence = 0;
  forte = {
    'Basic Attack': 1,
    'Resonance Skill': 1,
    'Forte Circuit': 1,
    'Resonance Liberation': 1,
    'Intro Skill': 1,
    'Basic Attack Bonus': 0,
    'Resonance Skill Bonus': 0,
    'Forte Circuit Passive': 0,
    'Resonance Liberation Bonus': 0,
    'Intro Skill Bonus': 0,
  };

  owned;
  favorite = false;

  MaterialList;
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
    this.MaterialList = {
      credit: this.viewer.lists.MaterialList.get("Shell Credit"),
    };
    if(CharacterData[this.key])
    {
      // Retrieve the materials used by this character.
      this.MaterialList.enemy = {
        '2': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].enemyMat][2]),
        '3': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].enemyMat][3]),
        '4': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].enemyMat][4]),
        '5': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].enemyMat][5]),
      };
      this.MaterialList.forgery = {
        '2': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].forgeryMat][2]),
        '3': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].forgeryMat][3]),
        '4': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].forgeryMat][4]),
        '5': this.viewer.lists.MaterialList.get(LootData.primary[CharacterData[this.key].forgeryMat][5]),
      };
      this.MaterialList.boss = this.viewer.lists.MaterialList.get(CharacterData[this.key].bossMat);
      this.MaterialList.flora = this.viewer.lists.MaterialList.get(CharacterData[this.key].floraMat);
      this.MaterialList.weekly = this.viewer.lists.MaterialList.get(CharacterData[this.key].weeklyMat);
      
      // Inform those materials that this character uses them.
      for(let i in this.MaterialList.enemy)
        this.MaterialList.enemy[i]?.addUser(this);
      for(let i in this.MaterialList.forgery)
        this.MaterialList.forgery[i]?.addUser(this);
      this.MaterialList.boss?.addUser(this);
      this.MaterialList.flora?.addUser(this);
      this.MaterialList.weekly?.addUser(this);
      
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
    {
      this.notifyType(field.string);
    }
    else if(field.string == "owned")
    {
      this.list.update("list", null, "notify", {toggleOwned:this});
    }
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
  
  // Getters for genshin item data that is not stored on each instance of this class.
  get data(){ return CharacterData[this.key]; }
  get name(){ return CharacterData[this.key]?.name ?? this.key; }
  get weaponType(){ return CharacterData[this.key]?.weapon ?? ""; }
  get element(){ return CharacterData[this.key]?.element ?? ""; }
  get rarity(){ return CharacterData[this.key].rarity ?? 0; }
  get icon(){ return "img/wuwa/small/"+ (CharacterData[this.key].icon.slice(CharacterData[this.key].icon.lastIndexOf('.')+1) ?? "blank") +".webp"; }
  get portrait(){ return "img/wuwa/full/"+ (CharacterData[this.key].portrait.slice(CharacterData[this.key].portrait.lastIndexOf('.')+1) ?? "blank") +".webp"; }
  get releaseTimestamp(){ return CharacterData[this.key]?.release ? Date.parse(CharacterData[this.key]?.release) : 0; }
  
  getRankData(ascension=this.ascension)
  {
    return AscensionData[ascension] ?? AscensionData[6];
  }
  
  getMat(type, ascension=this.ascension)
  {
    let rarity = this.getRankData(ascension)[`${type}RarityCharacter`];
    if(rarity)
      return this.MaterialList[type]?.[rarity];
    else
      return this.MaterialList[type];
  }
  
  getMatCost(type, ascension=this.ascension)
  {
    return this.getRankData(ascension)[`${type}CostCharacter`];
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
    this.getMat('flora').update("count", this.getMat('flora').count - this.getMatCost('flora'));
    this.getMat('boss').update("count", this.getMat('boss').count - this.getMatCost('boss'));
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
        this.getMat('flora')?.getCraftCount() >= this.getMatCost('flora') &&
        this.getMat('boss')?.getCraftCount() >= this.getMatCost('boss') &&
        this.getMat('credit')?.getCraftCount() >= this.getMatCost('credit');
    else
      return this.getMat('enemy')?.count >= this.getMatCost('enemy') &&
        this.getMat('flora')?.count >= this.getMatCost('flora') &&
        this.getMat('boss')?.count >= this.getMatCost('boss') &&
        this.getMat('credit')?.count >= this.getMatCost('credit');
  }
  
  getForteRankData(forte, alt)
  {
    if(alt)
      return ForteData[alt+this.forte[forte+(alt=="circuit"?" Passive":" Bonus")]] ?? ForteData[alt+forte] ?? ForteData[10];
    else
      return ForteData[this.forte[forte]] ?? ForteData[forte] ?? ForteData[10];
  }
  
  getForteMat(type, forte, alt)
  {
    let rarity = this.getForteRankData(forte, alt)[`${type}Rarity`];
    if(rarity)
      return this.MaterialList[type]?.[rarity];
    else
      return this.MaterialList[type];
  }
  
  getForteMatCost(type, forte, alt)
  {
    return this.getForteRankData(forte, alt)[`${type}Cost`];
  }
  
  upForte(forte, alt, event)
  {
    if(!event)
      event = alt;
    if(!window.productionMode) console.debug(`upForte`, {'this':this, forte, event, alt});
    let forteKey = forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"");
    if(this.forte[forteKey] == (alt?2:10))
    {
      console.error(`Tried to upgrade ${this.name} forte ${forteKey}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getForteMat('enemy',forte, alt).update("count", this.getForteMat('enemy',forte, alt).count - this.getForteMatCost('enemy',forte, alt));
    this.getForteMat('forgery',forte, alt).update("count", this.getForteMat('forgery',forte, alt).count - this.getForteMatCost('forgery',forte, alt));
    this.getForteMat('weekly',forte, alt).update("count", this.getForteMat('weekly',forte, alt).count - this.getForteMatCost('weekly',forte, alt));
    this.getForteMat('credit',forte, alt).update("count", this.getForteMat('credit',forte, alt).count - this.getForteMatCost('credit',forte, alt));
    this.update(`forte.${forteKey}`, this.forte[forteKey]+1);
  }
  
  canUpForte(forte, withCrafting, alt)
  {
    let forteKey = forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"");
    if(this.forte[forteKey] == (alt?2:10))
      return false;
    else if(withCrafting)
      return this.getForteMat('enemy',forte,alt)?.getCraftCount() >= this.getForteMatCost('enemy',forte,alt) &&
        this.getForteMat('forgery',forte,alt)?.getCraftCount() >= this.getForteMatCost('forgery',forte,alt) &&
        this.getForteMat('weekly',forte,alt)?.getCraftCount() >= this.getForteMatCost('weekly',forte,alt) &&
        this.getForteMat('credit',forte,alt)?.getCraftCount() >= this.getForteMatCost('credit',forte,alt);
    else
      return this.getForteMat('enemy',forte,alt)?.count >= this.getForteMatCost('enemy',forte,alt) &&
        this.getForteMat('forgery',forte,alt)?.count >= this.getForteMatCost('forgery',forte,alt) &&
        this.getForteMat('weekly',forte,alt)?.count >= this.getForteMatCost('weekly',forte,alt) &&
        this.getForteMat('credit',forte,alt)?.count >= this.getForteMatCost('credit',forte,alt);
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
