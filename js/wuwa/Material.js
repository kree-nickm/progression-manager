import LootData from "./gamedata/LootData.js";
import MaterialData from "./gamedata/MaterialData.js";

import WuWaItem from "./WuWaItem.js";

export default class Material extends WuWaItem
{
  static dontSerialize = super.dontSerialize.concat(["_name","_shorthand","_type","rarity","source","days","usedBy","prevTier","nextTier","converts"]);
  
  static setupTiers(matList)
  {
    for(let m=0; m<matList.length-1; m++)
    {
      if(!matList[m])
        continue;
      if(!matList[m+1])
        break;
      if(matList[m].rarity > matList[m+1].rarity)
      {
        matList[m].prevTier = matList[m+1];
        matList[m+1].nextTier = matList[m];
      }
      else
      {
        matList[m].nextTier = matList[m+1];
        matList[m+1].prevTier = matList[m];
      }
    }
  }
  
  key = "";
  _count = 0;
  
  _shorthand;
  _type;
  source = "";
  days = [];
  usedBy = [];
  prevTier = null;
  nextTier = null;
  converts = null;
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
  }
  get shorthand(){ return this._shorthand ?? this.name; }
  set shorthand(val){ this._shorthand = val; }
  get name() { return MaterialData[this.key]?.name ?? "!unknown!"; }
  get rarity() { return MaterialData[this.key]?.rarity ?? 1; }
  
  afterLoad()
  {
    if(!MaterialData[this.key])
      this.key = this.list.constructor.toKey(this.key);
    return true;
  }
  
  /*getFullSource()
  {
    return `${this.name}` + (this.source?`, dropped by ${this.source}`:"") + (this.days.length?`, on ${this.days.join("/")}`:"");
  }*/
  
  addUser(item)
  {
    if(this.usedBy.indexOf(item) == -1)
      this.update("usedBy", item, "push");
    return this;
  }
  
  /*getUsage()
  {
    let results = [];
    for(let item of this.usedBy)
    {
      if(item.favorite === false)
        continue;
      let amount = [];
      let note = [];
      if(item instanceof Character)
      {
        if(this == item.getMat('gem') && item.getPhase().gemCostCharacter)
          amount.push(item.getPhase().gemCostCharacter);
        
        if(this == item.getMat('boss') && item.getPhase().bossCostCharacter)
          amount.push(item.getPhase().bossCostCharacter);
        
        if(this == item.getMat('flower') && item.getPhase().floraCostCharacter)
          amount.push(item.getPhase().floraCostCharacter);
        
        if(this == item.getMat('enemy') && item.getPhase().enemyCostCharacter)
          amount.push(item.getPhase().enemyCostCharacter);
        
        if(this == item.getTalentMat('enemy','auto') && item.getTalent('auto').enemyCost)
          amount.push(item.getTalent('auto').enemyCost);
        if(this == item.getTalentMat('enemy','skill') && item.getTalent('skill').enemyCost)
          amount.push(item.getTalent('skill').enemyCost);
        if(this == item.getTalentMat('enemy','burst') && item.getTalent('burst').enemyCost)
          amount.push(item.getTalent('burst').enemyCost);
        
        if(this == item.getTalentMat('mastery','auto') && item.getTalent('auto').masteryCost)
          amount.push(item.getTalent('auto').masteryCost);
        if(this == item.getTalentMat('mastery','skill') && item.getTalent('skill').masteryCost)
          amount.push(item.getTalent('skill').masteryCost);
        if(this == item.getTalentMat('mastery','burst') && item.getTalent('burst').masteryCost)
          amount.push(item.getTalent('burst').masteryCost);
        
        if(this == item.MaterialList.trounce)
          amount.push(item.getTalent('auto').trounceCost + item.getTalent('skill').trounceCost + item.getTalent('burst').trounceCost);
        
        if(this.type == "mastery" || this.type == "trounce")
        {
          if(item.talent.auto < 10 || item.talent.skill < 10 || item.talent.burst < 10)
            note.push(`${item.talent.auto}/${item.talent.skill}/${item.talent.burst}`);
        }
        else if(this.type == "enemy")
        {
          if(item.ascension < 6)
            note.push(`A${item.ascension}`);
          if(item.talent.auto < 10 || item.talent.skill < 10 || item.talent.burst < 10)
            note.push(`${item.talent.auto}/${item.talent.skill}/${item.talent.burst}`);
        }
        else if(this.type == "gemstone" || this.type == "flora" || this.type == "boss")
        {
          if(item.ascension < 6)
            note.push(`A${item.ascension}`);
        }
      }
      if(item instanceof Weapon)
      {
        if(this == item.getMat('forgery') && item.getMatCost('forgery'))
          amount.push(item.getMatCost('forgery'));
        if(this == item.getMat('strong') && item.getMatCost('strong'))
          amount.push(item.getMatCost('strong'));
        if(this == item.getMat('weak') && item.getMatCost('weak'))
          amount.push(item.getMatCost('weak'));
        
        if(this.type == "enemy" || this.type == "forgery")
        {
          if(item.ascension < 6)
            note.push(`A${item.ascension}`);
        }
      }
      if(amount.length)
        results.push({name:item.name, amount:amount.join(", "), note});
    }
    //return results.map(user => user.name + ` (${user.amount})`).join("; ");
    return results.map(user => `${user.name}` + (user.note.length ? ` (${user.note.join(', ')})` : ``)).join("; ");
  }*/
  
  getCraftCount()
  {
    if(this.converts)
      return this.count + this.converts.reduce((total, mat) => total+mat.count, 0);
    else
      return this.count + (this.prevTier ? Math.floor(this.prevTier.getCraftCount()/3) : 0);
  }
  
  getCraftDependencies()
  {
    if(this.converts)
      return this.converts.map(mat => ({item:mat, field:"count"}));
    else if(this.prevTier)
      return this.prevTier.getCraftDependencies().concat([{item:this.prevTier, field:"count"}]);
    else
      return [];
  }
  
  getFieldValue(cost, useImage=false, {noName=false}={})
  {
    let numbersPart = {
      value: `${this.count} / ${cost}`,
      title: this.prevTier || this.converts
        ? `Up to ${this.getCraftCount()} if you craft.`
        : ``,
      classes: {
        "quantity": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount() < cost,
      },
      edit: {target: {item:this, field:"count"}, min:0, max:99999},
    };
    
    let namePart = {
      value: this.shorthand,// + (this.days.indexOf(this.viewer.today()) > -1 ? "*" : ""),
      classes: {
        "material": true,
        "q1": this.rarity == 1,
        "q2": this.rarity == 2,
        "q3": this.rarity == 3,
        "q4": this.rarity == 4,
        "q5": this.rarity == 5,
      },
      //title: this.getFullSource(),
    };
    
    return noName ? numbersPart : [numbersPart, namePart];
  }
}
