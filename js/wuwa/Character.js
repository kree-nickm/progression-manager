import AscensionData from "./gamedata/AscensionData.js";
import ForteData from "./gamedata/ForteData.js";
import LootData from "./gamedata/LootData.js";
import CharacterData from "./gamedata/CharacterData.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaItem from "./WuWaItem.js";

export default class Character extends WuWaItem
{
  static dontSerialize = WuWaItem.dontSerialize.concat(["MaterialList","_weapon"]);
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
  };

  owned;
  favorite = false;

  MaterialList;
  _weapon = null;
  
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
  
  getForteRankData(forte)
  {
    return ForteData[this.forte[forte]] ?? ForteData[forte] ?? ForteData[10];
  }
  
  getForteMat(type, forte)
  {
    let rarity = this.getForteRankData(forte)[`${type}Rarity`];
    if(rarity)
      return this.MaterialList[type]?.[rarity];
    else
      return this.MaterialList[type];
  }
  
  getForteMatCost(type, forte)
  {
    return this.getForteRankData(forte)[`${type}Cost`];
  }
  
  upForte(forte, event)
  {
    console.log(`upForte`, {'this':this, forte, event});
    if(this.forte[forte] == 10)
    {
      console.error(`Tried to upgrade ${this.name} forte ${forte}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getForteMat('enemy',forte).update("count", this.getForteMat('enemy',forte).count - this.getForteMatCost('enemy',forte));
    this.getForteMat('forgery',forte).update("count", this.getForteMat('forgery',forte).count - this.getForteMatCost('forgery',forte));
    this.getForteMat('weekly',forte).update("count", this.getForteMat('weekly',forte).count - this.getForteMatCost('weekly',forte));
    this.getForteMat('credit',forte).update("count", this.getForteMat('credit',forte).count - this.getForteMatCost('credit',forte));
    this.update(`forte.${forte}`, this.forte[forte]+1);
  }
  
  canUpForte(forte, withCrafting=false)
  {
    if(this.forte[forte] == 10)
      return false;
    else if(withCrafting)
      return this.getForteMat('enemy',forte)?.getCraftCount() >= this.getForteMatCost('enemy',forte) &&
        this.getForteMat('forgery',forte)?.getCraftCount() >= this.getForteMatCost('forgery',forte) &&
        this.getForteMat('weekly',forte)?.getCraftCount() >= this.getForteMatCost('weekly',forte) &&
        this.getForteMat('credit',forte)?.getCraftCount() >= this.getForteMatCost('credit',forte);
    else
      return this.getForteMat('enemy',forte)?.count >= this.getForteMatCost('enemy',forte) &&
        this.getForteMat('forgery',forte)?.count >= this.getForteMatCost('forgery',forte) &&
        this.getForteMat('weekly',forte)?.count >= this.getForteMatCost('weekly',forte) &&
        this.getForteMat('credit',forte)?.count >= this.getForteMatCost('credit',forte);
  }
  
  // This method should only be called by the item that is being equipped, when its "location" property is updated.
  equipItem(item)
  {
    // Determine the name of the property on this character that stores items of this type.
    let property;
    if(item.constructor.name == "Weapon")
      property = 'weapon';
    else if(item.constructor.name == "Echo")
      property = item.slotKey;
    else
    {
      console.error(`${this.name} cannot equip unknown item type '${item.constructor.name}'.`);
      return this;
    }
    
    // Make note of existing equips.
    let previousCharacter = item.character;
    let previousItem = this[property];
    
    // Unequip the previous equips that we noted above.
    item.character = null;
    this[property] = null;
    
    // If we had an item equipped, and the new item was equipped to another character, give that character our old item.
    if(previousItem && previousCharacter)
      previousItem.update("location", previousCharacter.key);
    // If we had an item equipped, let it know it is now unequipped.
    else if(previousItem)
      previousItem.update("location", "");
    // If the new item was equipped to another character, delete the reference to the item.
    else if(previousCharacter)
      previousCharacter.update(property, null, "replace");
    
    // Finally, set the references on this character and the item to each other.
    this.update(property, item, "replace");
    item.character = this;
    return this;
  }
}
