import { Renderer } from "./Renderer.js";

const Ingredient = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["usedBy","prevTier","nextTier","converts"]);
  
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
  // TODO: depend on the wishlist of users
  static setupDisplay(display)
  {
    if(!display.getField("count"))
    display.addField("count", {
      label: "Count",
      dynamic: true,
      title: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
        {
          let wanters = planMaterials.resolved[item.key].wanters.map(wanter => `${Renderer.controllers.get(wanter.src).name} wants ${wanter.amount}`).join(`\r\n`);
          return (item.prevTier || item.converts
            ? `Up to ${item.getCraftCount({plan:planMaterials.original})} if you craft.`
            : ``) + (wanters ? `\r\n`+wanters : ``);
        }
        else
        {
          return (item.prevTier || item.converts
            ? `Up to ${item.getCraftCount()} if you craft.`
            : ``);
        }
      },
      value: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
          return `${item.count} / ${planMaterials.original[item.key]}`;
        else
          return item.count + (item.prevTier || item.converts ? " (+"+ (item.getCraftCount()-item.count) +")" : "");
      },
      edit: item => ({
        target: {item:item, field:"count"}, min:0, max:99999,
      }),
      dependencies: item => {
        //let planMaterials = item.viewer.account.plan.getFullPlan();
        return item.getCraftDependencies();
      },
      classes: item => {
        let planMaterials = item.viewer.account.plan.getFullPlan();
        if(planMaterials.original[item.key])
          return {
            "pending": item.count < planMaterials.original[item.key],
            "insufficient": item.getCraftCount({plan:planMaterials.original}) < planMaterials.original[item.key],
          };
        else
          return {};
      },
    });
  
    if(!display.getField("users"))
    display.addField("users", {
      label: "Used By",
      dynamic: true,
      value: item => item.getUsage(),
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
  converts;
  
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
      if(item.favorite === false)
        continue;
      let amount = [];
      let note = [];
      for(let matDef of item.materialDefs.material)
      {
        if(this == item.getMat(matDef.property) && item.getMatCost(matDef.property))
          amount.push(item.getMatCost(matDef.property));
        for(let talentType in item.constructor.talentTypes)
        {
          if(this == item.getTalentMat(matDef.property, talentType) && item.getTalentMatCost(matDef.property, talentType))
            amount.push(item.getTalentMatCost(matDef.property, talentType));
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
        results.push({name:item.name, amount:amount.join(", "), note});
    }
    return results.map(user => `${user.name}` + (user.note.length ? ` (${user.note.join(', ')})` : ``)).join("; ");
  }
  
  getCraftCount({plan}={})
  {
    if(this.converts)
      return this.count + this.converts.reduce((total, mat) => total+Math.max(0,mat.count-(plan?.[mat.key]??0)), 0);
    else
      return this.count + (this.prevTier ? Math.floor(Math.max(0,this.prevTier.getCraftCount({plan})-(plan?.[this.prevTier.key]??0))/3) : 0);
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
