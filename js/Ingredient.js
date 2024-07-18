const Ingredient = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["usedBy","prevTier","nextTier","converts"]);
  
  static setupDisplay(display)
  {
    super.setupDisplay(display);
  }
  
  _count;
  usedBy;
  prevTier;
  nextTier;
  converts;
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
  }
  
  afterLoad()
  {
    return super.afterLoad();
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
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
        "long-text": this.count>999 || cost>999,
        "longer-text": this.count>9999 || cost>9999,
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
        "small": this.count>999 || cost>999,
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
};

export default Ingredient;
