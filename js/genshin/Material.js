import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinMaterialData from "./gamedata/GenshinMaterialData.js";

import GenshinItem from "./GenshinItem.js";
import Character from "./Character.js";
import Weapon from "./Weapon.js";

export default class Material extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["_shorthand","_type","source","days","usedBy","prevTier","nextTier","converts"]);
  
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
  
  static toKey(string)
  {
    return string
      .replaceAll(/[-— (][a-z]/g, (match, offset, str) => match.toUpperCase())
      .replaceAll(/[^a-zA-Z0-9_]/g, "");
  }
  
  static fromKey(string)
  {
    return string
      .replaceAll(/[A-Z]/g, " $&").trim()
      .replaceAll(/ (a|an|the|and|but|or|for|nor|of|for|at|in|by|from|to|as) /gi, (match, p1, offset, str) => match.toLowerCase());
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
  
  fromGOOD(goodData)
  {
    let data;
    if('goodKey' in goodData && 'goodValue' in goodData)
    {
      data = {
        key: Material.toKey(goodData.goodKey),
        count: goodData.goodValue,
      };
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
  get name() { return GenshinMaterialData[this.key]?.name ?? this.key; }
  get type() {
    if(!this._type)
    {
      if(this.key == "CrownOfInsight")
        this._type = "crown";
      if(!this._type)
        for(let type in GenshinLootData)
        if(this.shorthand in GenshinLootData[type])
          this._type = type;
      if(!this._type)
        for(let wboss of GenshinLootData.trounce)
          if(wboss.loot.indexOf(this.name) > -1)
            this._type = "trounce";
      if(!this._type)
      {
        let words = this.shorthand.split(" ");
        if(words.length == 2 && (words[0] == "Diamond" || Object.keys(GenshinLootData.gemstone).indexOf(words[0]) > -1 && (words[0] + Material.gemQualities[this.rarity]) == this.shorthand))
          this._type = "gemstone";
      }
    }
    return this._type ?? "unknown";
  }
  set type(val){ this._type = val; }
  get image(){ return GenshinMaterialData[this.key]?.img ?? ""; }
  get rarity(){ return GenshinMaterialData[this.key]?.rarity ?? 1; }
  get releaseTimestamp(){ return GenshinMaterialData[this.key]?.release ? Date.parse(GenshinMaterialData[this.key]?.release) : 0; }
  
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
      let note = [];
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
        
        if(this == item.getTalentMat('mastery','auto') && item.getTalent('auto').matMasteryCount)
          amount.push(item.getTalent('auto').matMasteryCount);
        if(this == item.getTalentMat('mastery','skill') && item.getTalent('skill').matMasteryCount)
          amount.push(item.getTalent('skill').matMasteryCount);
        if(this == item.getTalentMat('mastery','burst') && item.getTalent('burst').matMasteryCount)
          amount.push(item.getTalent('burst').matMasteryCount);
        
        if(this == item.MaterialList.trounce)
          amount.push(item.getTalent('auto').matTrounceCount + item.getTalent('skill').matTrounceCount + item.getTalent('burst').matTrounceCount);
        
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
  }
  
  getCraftCount({plan}={})
  {
    if(this.converts)
      return this.count + this.converts.reduce((total, mat) => total+Math.max(0,mat.count-(plan?.[mat.key]??0)), 0);
    else
      return this.count + (this.prevTier ? Math.floor(Math.max(0,this.prevTier.getCraftCount()-(plan?.[this.prevTier.key]??0))/3) : 0);
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
  
  getFieldValue(cost, useImage=false, {noName=false, plan}={})
  {
    let bosskills3 = Math.ceil((cost-this.count)/3);
    let bosskills2 = Math.ceil((cost-this.count)/2);
    
    let iconPart = {
      tag: "div",
      value: [
        {
          tag: "div",
          value: [
            {
              tag: "i",
              classes: {
                "display-badge": true,
                "fa-solid": true,
                "fa-sun": true,
                "d-none": this.days.indexOf(this.viewer.today()) == -1,
              },
              title: "This drop can be obtained today.",
            },
            {
              tag: "img",
              src: this.image,
              alt: this.name,
            }
          ],
          classes: {"display-img": true, ["rarity-"+this.rarity]: true},
        },
        {
          value: `${this.count} / ${cost}`,
          title: this.type == "boss"
            ? `Requires `+ (bosskills2!=bosskills3?`${bosskills3}-${bosskills2}`:bosskills2) +` more boss kill`+ (bosskills2!=1||bosskills3!=1?"s":"") +`.`
            : this.type == "flora"
              ? `` // TODO: Compile data for number of each flora that exists on the map and display the relevant number here.
              : this.prevTier
                ? `Up to ${this.getCraftCount({plan})} if you craft.`
                : ``,
          classes: {"display-caption": true},
          edit: {target: {item:this, field:"count"}},
        }
      ],
      classes: {
        "item-display": true,
        "item-material": true,
        "display-sm": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount({plan}) < cost,
      },
      title: this.getFullSource(),
    };
    
    let numbersPart = {
      value: `${this.count} / ${cost}`,
      title: this.type == "boss"
        ? `Requires `+ (bosskills2!=bosskills3?`${bosskills3}-${bosskills2}`:bosskills2) +` more boss kill`+ (bosskills2!=1||bosskills3!=1?"s":"") +`.`
        : this.type == "flora"
          ? `` // TODO: Compile data for number of each flora that exists on the map and display the relevant number here.
          : this.prevTier || this.converts
            ? `Up to ${this.getCraftCount({plan})} if you craft.`
            : ``,
      classes: {
        "quantity": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount({plan}) < cost,
      },
      edit: {target: {item:this, field:"count"}, min:0, max:99999},
    };
    
    let namePart = {
      value: this.shorthand + (this.days.indexOf(this.viewer.today()) > -1 ? "*" : ""),
      classes: {
        "material": true,
        "q1": this.rarity == 1,
        "q2": this.rarity == 2,
        "q3": this.rarity == 3,
        "q4": this.rarity == 4,
        "q5": this.rarity == 5,
      },
      title: this.getFullSource(),
    };
    if(this.type == "gemstone")
      for(let element of ["Anemo","Cryo","Dendro","Electro","Geo","Hydro","Pyro"])
        namePart.value = namePart.value.replace(element, `{{element:${element}}}`);
    
    return this.image && useImage ? iconPart : noName ? numbersPart : [numbersPart, namePart];
  }
}
