import GenshinItem from "./GenshinItem.js";
import Character from "./Character.js";
import Weapon from "./Weapon.js";

export default class Material extends GenshinItem
{
  static gemQualities = {
    '5': " Gemstone",
    '4': " Chunk",
    '3': " Fragment",
    '2': " Sliver",
  };
  static masteryQualities = {
    '4': "Philosophies Of ",
    '3': "Guide To ",
    '2': "Teachings Of ",
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
    return string.replaceAll(/\b(to|the|from|a|of)\b/g, (match, p1, offset, string) => string.at(0).toLowerCase()+string.substring(1)).replaceAll(/[-' ]/g, "");
  }
  
  static fromKey(string)
  {
    return string.replaceAll(/([A-Z])/g, " $1").trim();
  }
  
  #count = 0;
  #shorthand;
  source = "";
  quality = 1;
  days = [];
  usedBy = [];
  prevTier = null;
  nextTier = null;
  
  fromGOOD(goodData)
  {
    let data = {
      key: Material.toKey(goodData.goodKey),
      count: goodData.goodValue,
    };
    data.name = (goodData.goodKey == data.key) ? Material.fromKey(goodData.goodKey) : goodData.goodKey;
    return super.fromGOOD(data);
  }
  
  toGOOD()
  {
    console.warn("Material.toGOOD() should not be called directly.");
    return this.count;
  }
  
  get count(){ return this.#count; }
  set count(val){
    if(val < 0)
      val = this.#count + val;
    this.#count = Math.max(val, 0);
  }
  get shorthand(){ return this.#shorthand ?? this.name; }
  set shorthand(val){ this.#shorthand = val; }
  
  getFullSource()
  {
    return `${this.name}` + (this.source?`, dropped by ${this.source}`:"") + (this.days?`, on ${this.days.join("/")}`:"");
  }
  
  addUser(item)
  {
    if(this.usedBy.indexOf(item) == -1)
    {
      this.usedBy.push(item);
      for(let cell of this.dependents["usedBy"] ?? [])
        cell.needsUpdate = true;
    }
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
        
        if(this == item.materials.trounce)
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
