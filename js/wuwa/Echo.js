import EchoData from "./gamedata/EchoData.js";
import EchoSetData from "./gamedata/EchoSetData.js";
import EchoMetadata from "./gamedata/EchoMetadata.js";
import Stats from "./gamedata/Stats.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaItem from "./WuWaItem.js";
import Equipment from "../Equipment.js";

export default class Echo extends Equipment(WuWaItem)
{
  //static dontSerialize = super.dontSerialize.concat([]);
  //static templateName = "wuwa/renderEchoAsPopup";
  
  _level = 0;
  rarity = 2;
  monsterKey = "";
  setKey = "";
  primaryStat = "";
  secondaryStat = "";
  substats = [];
  
  characterList = window.viewer.lists.CharacterList;
  equipSlots = 5;
  specialSlots = 1;
  
  // Getters/setters that enforce a value range.
  get level(){ return parseInt(this._level); }
  set level(val){ this._level = Math.min(Math.max(parseInt(val), 0), 25); }
  
  // Getters/setters for item data that is not stored on each instance of this class.
  get name(){ return `${this.monster} ${this.set}`; }
  get monster(){ return EchoData[this.monsterKey]?.monster ?? this.monsterKey; }
  get cost(){ return EchoData[this.monsterKey]?.cost ?? 0; }
  get set(){ return EchoSetData[this.setKey]?.name ?? this.setKey; }
  get skill(){ return EchoData[this.monsterKey]?.skillDesc.replace(/\{(\d+)\}/g, (m,p1) => EchoData[this.monsterKey].descParams[this.rarity-1][p1]) ?? ""; }
  get image(){ return "img/wuwa/small/" + (EchoData[this.monsterKey]?.icon?.slice(EchoData[this.monsterKey]?.icon?.lastIndexOf(".")+1) ?? "blank") + ".webp"; }
  get bonusImage(){ return "img/wuwa/icons/Icon_" + this.setKey + ".webp"; }
  get releaseTimestamp(){
    return Math.max(EchoData[this.monsterKey]?.release ? Date.parse(EchoData[this.monsterKey].release) : 0, EchoSetData[this.setKey]?.release ? Date.parse(EchoSetData[this.setKey].release) : 0);
  }
  get equipProperty() { return "echoes"; }
  
  setSubstat(statKey, value)
  {
    if(!EchoMetadata.subStats.includes(statKey) || isNaN(value))
    {
      console.warn(`Invalid echo substat definition.`, {statKey, value});
      return this;
    }
    for(let substat of this.substats)
      if(substat.key == statKey)
      {
        substat.value = value;
        if(value == 0)
          this.cleanSubstats();
        this.update("substats", substat, "notify");
        return this;
      }
    if(value != 0)
      this.update("substats", {key:statKey, value}, "push");
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
  
  cleanSubstats()
  {
    this.substats = this.substats.filter(substat => substat.value != 0 && EchoMetadata.subStats.includes(substat.key));
  }
}
