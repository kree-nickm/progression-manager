import GenshinItem from "./GenshinItem.js";
import Character from "./Character.js";
import Weapon from "./Weapon.js";

export default class Material extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["_name","_shorthand","source","quality","days","usedBy","prevTier","nextTier"]);
  
  static gemQualities = {
    '5': " Gemstone",
    '4': " Chunk",
    '3': " Fragment",
    '2': " Sliver",
  };
  static masteryQualities = {
    '4': "Philosophies of ",
    '3': "Guide to ",
    '2': "Teachings of ",
  };
  
  static setupTiers(matList)
  {
    for(let m=0; m<matList.length-1; m++)
    {
      if(!matList[m])
        continue;
      if(!matList[m+1])
        break;
      if(matList[m].quality > matList[m+1].quality)
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
  
  static toKey(string)
  {
    return string
      .replaceAll(/[- (][a-z]/g, (match, offset, str) => match.toUpperCase())
      .replaceAll(/[- ()"']/g, "");
  }
  
  static fromKey(string)
  {
    return string
      .replaceAll(/[A-Z]/g, " $&").trim()
      .replaceAll(/ (a|an|the|and|but|or|for|nor|of|for|at|in|by|from|to|as) /gi, (match, p1, offset, str) => match.toLowerCase());
  }
  
  key = "";
  _name = "";
  _count = 0;
  _shorthand;
  source = "";
  quality = 1;
  days = [];
  usedBy = [];
  prevTier = null;
  nextTier = null;
  
  fromGOOD(goodData)
  {
    let data;
    if('goodKey' in goodData && 'goodValue' in goodData)
    {
      data = {
        key: Material.toKey(goodData.goodKey),
        count: goodData.goodValue,
      };
      data._name = (goodData.goodKey === data.key) ? Material.fromKey(goodData.goodKey) : goodData.goodKey;
    }
    else
      data = goodData;
    return super.fromGOOD(data);
  }
  
  toGOOD()
  {
    console.warn("Material.toGOOD() should not be called directly.");
    return this.count;
  }
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
  }
  get shorthand(){ return this._shorthand ?? this.name; }
  set shorthand(val){ this._shorthand = val; }
  get name() {
    if(!this._name)
      this._name = Material.fromKey(this.key);
    return this._name;
  }
  
  getFullSource()
  {
    return `${this.name}` + (this.source?`, dropped by ${this.source}`:"") + (this.days.length?`, on ${this.days.join("/")}`:"");
  }
  
  addUser(item)
  {
    if(this.usedBy.indexOf(item) == -1)
      this.update("usedBy", item, "push");
    return this;
  }
  
  getUsage()
  {
    let results = [];
    for(let item of this.usedBy)
    {
      if(item.favorite === false)
        continue;
      let amount = [];
      if(item instanceof Character)
      {
        if(this == item.getMat('gem') && item.getPhase().ascendMatGemCount)
          amount.push(item.getPhase().ascendMatGemCount);
        
        if(this == item.getMat('boss') && item.getPhase().ascendMatBossCount)
          amount.push(item.getPhase().ascendMatBossCount);
        
        if(this == item.getMat('flower') && item.getPhase().ascendMatFlowerCount)
          amount.push(item.getPhase().ascendMatFlowerCount);
        
        if(this == item.getMat('enemy') && item.getPhase().ascendMatEnemyCount)
          amount.push(item.getPhase().ascendMatEnemyCount);
        
        if(this == item.getTalentMat('enemy','auto') && item.getTalent('auto').matEnemyCount)
          amount.push(item.getTalent('auto').matEnemyCount);
        if(this == item.getTalentMat('enemy','skill') && item.getTalent('skill').matEnemyCount)
          amount.push(item.getTalent('skill').matEnemyCount);
        if(this == item.getTalentMat('enemy','burst') && item.getTalent('burst').matEnemyCount)
          amount.push(item.getTalent('burst').matEnemyCount);
        
        if(this == item.getTalentMat('mastery','auto') && item.getTalent('auto').matDomainCount)
          amount.push(item.getTalent('auto').matDomainCount);
        if(this == item.getTalentMat('mastery','skill') && item.getTalent('skill').matDomainCount)
          amount.push(item.getTalent('skill').matDomainCount);
        if(this == item.getTalentMat('mastery','burst') && item.getTalent('burst').matDomainCount)
          amount.push(item.getTalent('burst').matDomainCount);
        
        if(this == item.MaterialList.trounce)
          amount.push(item.getTalent('auto').matTrounceCount + item.getTalent('skill').matTrounceCount + item.getTalent('burst').matTrounceCount);
      }
      if(item instanceof Weapon)
      {
        if(this == item.getMat('forgery') && item.getMatCost('forgery'))
          amount.push(item.getMatCost('forgery'));
        if(this == item.getMat('strong') && item.getMatCost('strong'))
          amount.push(item.getMatCost('strong'));
        if(this == item.getMat('weak') && item.getMatCost('weak'))
          amount.push(item.getMatCost('weak'));
      }
      if(amount.length)
        results.push({name:item.name, amount:amount.join(", ")});
    }
    return results.map(user => user.name + ` (${user.amount})`).join("; ");
  }
  
  getCraftCount()
  {
    return this.count + (this.prevTier ? Math.floor(this.prevTier.getCraftCount()/3) : 0);
  }
  
  getCraftDependencies()
  {
    if(this.prevTier)
      return this.prevTier.getCraftDependencies().concat([{item:this.prevTier, field:"count"}]);
    else
      return [];
  }
  
  getRenderClasses()
  {
    return {
      "material": true,
      "q1": this.quality == 1,
      "q2": this.quality == 2,
      "q3": this.quality == 3,
      "q4": this.quality == 4,
      "q5": this.quality == 5,
    };
  }
}
