const { Renderer } = await window.importer.get(`js/Renderer.js`);

const Ingredient = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["usedBy","prevTier","nextTier","tierUpReq","tierDownReq","converts","convertReq","baseType","typeAmount"]);
  
  /**
   * Given an array of Ingredients, this will assume that they can be crafted into one another via adjacent indexes, and will set prevTier and nextTier on each of them accordingly.
   */
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
  
  static setupDisplay(display)
  {
    if(!display.getField("count"))
      display.addField("count", {
        label: "Count",
        dynamic: true,
        title: item => {
          let craftCount = item.getCraftCount({plan:item.viewer.account.plan.getSimplified()});
          let wanterString = item.viewer.account.plan.resolved[item.key]?.wanters.map(wanter => `${wanter.item?.name??wanter.source} wants ${wanter.amount}`).join(`\r\n`);
          return (craftCount ? `Up to ${craftCount} if you craft.` : ``)
            + (wanterString ? `\r\n${wanterString}` : ``);
        },
        value: item => {
          if(item.viewer.account.plan.resolved[item.key])
            return `${item.count} / ${item.viewer.account.plan.resolved[item.key].amount}`;
          else {
            let craftCount = item.getCraftCount({plan:item.viewer.account.plan.getSimplified()});
            return item.count + (craftCount ? ` (+${craftCount-item.count})` : "");
          }
        },
        edit: item => ({
          target: {item:item, field:"count"}, min:0, max:99999,
        }),
        dependencies: item => {
          let dependencies = item.getCraftDependencies();
          dependencies.push({item:item, field:"usedBy"});
          for(let i of item.usedBy) {
            dependencies.push({item:i, field:"wishlist"});
            dependencies.push({item:i, field:i.constructor.ascensionProperty});
            dependencies.push({item:i, field:i.constructor.talentProperty});
          }
          return dependencies;
        },
        classes: item => ({
          "pending": item.count < item.viewer.account.plan.resolved[item.key]?.amount,
          "insufficient": item.getCraftCount({plan:item.viewer.account.plan.getSimplified()}) < item.viewer.account.plan.resolved[item.key]?.amount,
        }),
      });
  
    if(!display.getField("users"))
      display.addField("users", {
        label: "Used By",
        dynamic: true,
        value: item => item.getUsage().map(user => `${user.item.name}` + (user.note.length ? ` (${user.note.join(', ')})` : ``)).join("; "),
        dependencies: item => {
          let dependencies = [{item:item, field:["usedBy"]}];
          for(let i of item.usedBy)
            dependencies.push({item:i, field:["favorite"]});
          return dependencies;
        },
      });
    
    super.setupDisplay(display);
  }
  
  _count = 0;
  usedBy = [];
  prevTier;
  nextTier;
  tierUpReq;
  tierDownReq;
  converts;
  convertReq;
  baseType;
  typeAmount; // for exp
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
  }
  
  getFullSource()
  {
    return `${this.name}`;
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
      let amount = [];
      let note = [];
      for(let matDef of item.materialDefs.materials)
      {
        // If this is the user's ascension mat, add their desired amount.
        if(this == item.getMat(matDef.property) && item.getMatCost(matDef.property))
        {
          amount.push(item.getMatCost(matDef.property));
        }
        
        // Cycle through the user's talents.
        for(let talentType in item.constructor.talentTypes)
        {
          // If this is the user's talent mat, add their desired amount.
          if(this == item.getTalentMat(matDef.property, talentType) && item.getTalentMatCost(matDef.property, talentType))
          {
            amount.push(item.getTalentMatCost(matDef.property, talentType));
          }
        }
      }
      /*if(item instanceof Character)
      {
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
        if(this.type == "enemy" || this.type == "forgery")
        {
          if(item.ascension < 6)
            note.push(`A${item.ascension}`);
        }
      }*/
      if(amount.length)
        results.push({item, amount:amount.reduce((t,i) => t+i, 0), amounts:amount.join(", "), note});
    }
    return results;
  }
  
  getCraftCount({plan, checkConv=true, checkPrev=true, checkNext=true}={})
  {
    let bonusCount = 0;
    
    if(checkConv && this.convertReq && this.converts)
    {
      for(let convert of this.converts)
      {
        let craftCount = convert.getCraftCount({
          plan,
          checkConv: false,
          checkPrev,
          checkNext,
        });
        let planCount = plan?.[convert.key] ?? 0;
        bonusCount += Math.floor(Math.max(0, craftCount - planCount) / this.convertReq);
      }
    }
    
    if(checkPrev && this.tierUpReq && this.prevTier)
    {
      let craftCount = this.prevTier.getCraftCount({
        plan,
        checkConv,
        checkPrev,
        checkNext: false,
      });
      let planCount = plan?.[this.prevTier.key] ?? 0;
      bonusCount += Math.floor(Math.max(0, craftCount - planCount) / this.tierUpReq);
    }
    
    if(checkNext && this.tierDownReq && this.nextTier)
    {
      let craftCount = this.nextTier.getCraftCount({
        plan,
        checkConv,
        checkPrev: false,
        checkNext,
      });
      let planCount = plan?.[this.nextTier.key] ?? 0;
      bonusCount += Math.max(0, craftCount - planCount) * this.tierDownReq;
    }
    
    return this.count + bonusCount;
  }
  
  getCraftDependencies({checkConv=true, checkPrev=true, checkNext=true}={})
  {
    let dependencies = [];
    
    if(checkConv && this.convertReq && this.converts)
      dependencies = dependencies
        .concat(this.converts.map(mat => ({item:mat, field:"count"})));
        
    if(checkPrev && this.tierUpReq && this.prevTier)
      dependencies = dependencies
        .concat(this.prevTier.getCraftDependencies({
          checkConv,
          checkPrev,
          checkNext: false,
        }))
        .concat([{item:this.prevTier, field:"count"}]);
        
    if(checkNext && this.tierDownReq && this.nextTier)
      dependencies = dependencies
        .concat(this.nextTier.getCraftDependencies({
          checkConv,
          checkPrev: false,
          checkNext,
        }))
        .concat([{item:this.nextTier, field:"count"}]);
        
    return dependencies;
  }
  
  getFieldValue(cost, useImage=false, {noName=false, plan}={})
  {
    let numbersPart = {
      value: `${this.count} / ${cost}`,
      title: this.prevTier || this.converts
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
      value: this.name,
      classes: {
        "material": true,
      },
      title: this.getFullSource(),
    };
    
    return noName ? numbersPart : [numbersPart, namePart];
  }
};

export default Ingredient;
