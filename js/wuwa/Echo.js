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
  useSkill = false;
  location = "";
  lock = true;
  
  character = null;
  
  afterLoad()
  {
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location")
    {
      if(value)
      {
        if(this.list?.viewer?.lists?.CharacterList)
        {
          let newCharacter = this.list.viewer.lists.CharacterList.get(value);
          if(newCharacter)
            newCharacter.equipItem(this, options.skillEcho);
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
        {
          if(this.character.skillEcho == this)
            this.character.update("skillEcho", null, "replace");
          else
            this.character.update("echoes", this, "remove");
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
  get bonusImage(){ return EchoSetData[this.setKey]?.icon?.slice(EchoSetData[this.setKey]?.icon?.lastIndexOf(".")+1) ?? ""; }
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
