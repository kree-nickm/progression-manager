import EchoData from "./gamedata/EchoData.js";
import EchoSetData from "./gamedata/EchoSetData.js";
import EchoMetadata from "./gamedata/EchoMetadata.js";
import Stats from "./gamedata/Stats.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaItem from "./WuWaItem.js";

export default class Echo extends WuWaItem
{
  static dontSerialize = WuWaItem.dontSerialize.concat(["character"]);
  //static templateName = "wuwa/renderEchoAsPopup";
  
  _level = 0;
  rarity = 2;
  monsterKey = "";
  setKey = "";
  primaryStat = "";
  secondaryStat = "";
  substats = [];
  location = "";
  lock = true;
  
  character = null;
  
  afterLoad()
  {
  }
  
  beforeUpdate(field, value, action, options)
  {
    if(field.string == "location" && value)
    {
      if(this.list?.viewer?.lists?.CharacterList)
      {
        let characterKey, slot;
        [characterKey, slot] = value.split(":");
        slot = options.slot ?? slot;
        let newCharacter = this.list.viewer.lists.CharacterList.get(characterKey);
        if(newCharacter)
        {
          // Determine which echo slot to equip.
          if(isNaN(slot) || slot > 4 || slot < 0)
          {
            //console.debug(`No valid slot specified, searching for open slot`, {specifiedSlot:slot});
            for(slot=1; slot<5; slot++)
              if(!newCharacter.echoes[slot] || newCharacter.echoes[slot] == this)
                break;
            //console.debug(`Using slot`, {slot});
          }
          if(slot > 4)
          {
            console.warn(`No more echo slots left to equip echo.`, {character:newCharacter, echo:this});
            return field.value;
          }
          else
          {
            //console.debug(`Setting echo location to "${characterKey}:${slot}"`);
            return `${characterKey}:${slot}`;
          }
        }
        else
        {
          console.warn(`Cannot equip ${this.name} to non-existent character "${characterKey}" (slot:${slot}).`);
          return field.value;
        }
      }
      else
      {
        console.warn(`Cannot equip ${this.name} to character "${this.location}" because character list is inaccessible.`);
        return "";
      }
    }
    else
      return super.beforeUpdate(field, value, action, options);
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location" && field.value !== value)
    {
      //console.debug(`updating echo location`, {old:field.value, new:value, gigaequal:field.value===value, equal:field.value==value});
      if(value)
      {
        if(this.list?.viewer?.lists?.CharacterList)
        {
          const [characterKey, slot] = value.split(":");
          let newCharacter = this.list.viewer.lists.CharacterList.get(characterKey);
          if(newCharacter)
            newCharacter.equipItem(this, {slot});
          else
          {
            console.error(`Cannot equip ${this.name} to non-existent character "${characterKey}" (slot:${slot}).`);
            field.object[field.property] = "";
            this.character = null;
          }
        }
        else
        {
          console.error(`Cannot equip ${this.name} to character "${this.location}" because character list is inaccessible.`);
          field.object[field.property] = "";
          this.character = null;
        }
      }
      else
      {
        if(this.character)
        {
          const [characterKey, slot] = field.value.split(":");
          //console.debug(`Unequipping echo:`, {character:this.character, echo:this, previousLocation:field.value, characterKey, slot});
          this.character.update(`echoes.${slot}`, null, "replace");
        }
        this.character = null;
      }
    }
  }
  
  // Getters/setters that enforce a value range.
  get level(){ return parseInt(this._level); }
  set level(val){ this._level = Math.min(Math.max(parseInt(val), 0), 25); }
  
  // Getters/setters for item data that is not stored on each instance of this class.
  get monster(){ return EchoData[this.monsterKey]?.monster ?? this.monsterKey; }
  get cost(){ return EchoData[this.monsterKey]?.cost ?? 0; }
  get set(){ return EchoSetData[this.setKey]?.name ?? this.setKey; }
  get skill(){ return EchoData[this.monsterKey]?.skillDesc.replace(/\{(\d+)\}/g, (m,p1) => EchoData[this.monsterKey].descParams[this.rarity-1][p1]) ?? ""; }
  get image(){ return EchoData[this.monsterKey]?.icon?.slice(EchoData[this.monsterKey]?.icon?.lastIndexOf(".")+1) ?? ""; }
  get bonusImage(){ return "img/wuwa/icons/Icon_" + this.setKey + ".webp"; }
  get releaseTimestamp(){
    return Math.max(EchoData[this.monsterKey]?.release ? Date.parse(EchoData[this.monsterKey].release) : 0, EchoSetData[this.setKey]?.release ? Date.parse(EchoSetData[this.setKey].release) : 0);
  }
  
  setSubstat(statKey, value)
  {
    if(!EchoMetadata.subStats.includes(statKey))
    {
      console.warn(`Invalid echo substat ${statKey}, can't set value to ${value}`);
      return this;
    }
    for(let substat of this.substats)
      if(substat.key == statKey)
      {
        substat.value = value;
        this.update("substats", substat, "notify");
        return this;
      }
    this.substats.push({key:statKey, value});
    this.update("substats", this.substats[this.substats.length-1], "notify");
    return this;
  }
  
  getSubstat(statKey)
  {
    if(parseInt(statKey) == statKey)
    {
      return this.substats[statKey]?.value ?? 0;
    }
    else
    {
      if(!EchoMetadata.subStats.includes(statKey))
      {
        console.warn(`Invalid echo substat ${statKey}`);
        return 0;
      }
      for(let substat of this.substats)
        if(substat.key == statKey)
          return substat.value;
      return 0;
    }
  }
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
}
