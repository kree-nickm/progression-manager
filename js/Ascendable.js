const Ascendable = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["maxAscension","maxTalent","materialDefs","MaterialList"]);
  static AscensionData;
  static TalentData;
  static ascensionProperty = "ascension";
  static talentProperty = "talent";
  static talentTypes = {};
  
  static isMaterial(material)
  {
    return material && "count" in material && "getFieldValue" in material && "getCraftCount" in material && "update" in material;
  }
  
  static setupDisplay(display)
  {
    if(!display.getField("level"))
      display.addField("level", {
        label: "Lvl",
        labelTitle: "Sort by character level.",
        sort: {generic: {type:"number", property:"level"}},
        dynamic: true,
        title: item => "Click to change.",
        value: item => item.level,
        edit: item => ({target: {item:item.base??item, field:"level"}}),
        classes: item => ({
          "at-max": item.level >= item.levelCap,
        }),
        dependencies: item => [
          {item:item.base??item, field:this.ascensionProperty},
        ],
      });
    
    if(!display.getField("planLevel"))
      display.addField("planLevel", {
        tags: ["detailsOnly"],
        dynamic: true,
        value: item => item.wishlist?.level ?? "-",
        edit: item => ({target: {item, field:"wishlist.level"}}),
        dependencies: item => [
          {item:item, field:"wishlist"},
          {item:item, field:"level"},
        ],
      });
    
    if(this.AscensionData)
    {
      if(!display.getField("ascension"))
        display.addField("ascension", {
          label: "Asc",
          labelTitle: "Sort by ascension.",
          sort: {generic: {type:"number",property:this.ascensionProperty}},
          dynamic: true,
          title: item => "Click to change." + (item.canAscend(true) ? "\r\nNote: You have enough materials to ascend. Open character details to use the ascension feature." : ""),
          value: item => item[this.ascensionProperty],
          edit: item => ({target: {item:item.base??item, field:this.ascensionProperty}, min:0, max:item.maxAscension}),
          classes: item => ({
            'can-inc': item.wishlist?.[this.ascensionProperty] > item[this.ascensionProperty] && item.canAscend(true),
            "at-max": item[this.ascensionProperty] >= item.maxAscension,
          }),
          dependencies: item => [].concat(...item.materialDefs.materials.map(mat => [{item:item.getMat(mat.property), field:"count"}].concat(item.getMat(mat.property)?.getCraftDependencies()??[]))),
        });
      
      if(!display.getField("ascensionMaterial"))
        display.addField("ascensionMaterial", {
          group: {label:"Ascension Materials", startCollapsed:false},
          label: (item, type, ascension) => type.capitalize(),
          labelTitle: (item, type, ascension) => type.capitalize(),
          columnClasses: ["ascension-materials"],
          dynamic: true,
          value: (item, type, ascension) => type == "label" ? `${ascension} ➤ ${parseInt(ascension)+1}` : (item.getMat(type,ascension) && item.getMatCost(type,ascension)>0 ? item.getMat(type,ascension).getFieldValue(item.getMatCost(type,ascension), (isNaN(ascension)?item.viewer.settings.preferences?.characterList=='1':item.viewer.settings.preferences?.materialList=='1')) : ""),
          dependencies: (item, type, ascension) => [
            {item:item.base??item, field:this.ascensionProperty},
          ].concat(type == "label" ? item.materialDefs.materials.map(mat => ({item:item.getMat(mat.property,ascension), field:"count"})) : (item.getMat(type,ascension)?.getCraftDependencies() ?? [])),
          button: (item, type, ascension) => {
            if(type == "label" && ascension == item[this.ascensionProperty])
            {
              if(item.canAscend(false))
              {
                return {
                  title: "Ascend the character. This will spend the resources for you and increase their level if necessary.",
                  icon: "fa-solid fa-circle-up",
                  action: item.ascend.bind(item),
                };
              }
              else
              {
                return {
                  title: "Not enough materials to ascend.",
                  icon: "fa-solid fa-circle-up",
                };
              }
            }
          },
        });
    
      if(!display.getField("planAscension"))
        display.addField("planAscension", {
          tags: ["detailsOnly"],
          dynamic: true,
          value: item => item.wishlist?.[this.ascensionProperty] ?? "-",
          edit: item => ({target: {item, field:`wishlist.${this.ascensionProperty}`}}),
          dependencies: item => [
            {item:item, field:"wishlist"},
            {item:item, field:this.ascensionProperty},
          ],
        });
    }
    
    if(this.TalentData)
    {
      if(!display.getField("talent"))
        display.addField("talent", {
          label: (item, talent) => this.talentTypes[talent]?.char,
          labelTitle: (item, talent) => this.talentTypes[talent]?.full,
          dynamic: true,
          title: (item, talent) => `Click to change ${talent}.`,
          value: (item, talent) => item[this.talentProperty][talent],
          edit: (item, talent) => ({target: {item:item, field:`${this.talentProperty}.${talent}`}, min:this.talentTypes[talent]?.min, max:item.getTalentCap(talent)}),
          classes: (item, talent) => ({
            "can-inc": item.wishlist?.[this.talentProperty]?.[talent] > item[this.talentProperty][talent] && item.canUpTalent(talent, true),
            "at-max": item[this.talentProperty][talent] >= item.getTalentCap(talent),
          }),
          dependencies: (item, talent) => [].concat(...item.materialDefs.materials.map(mat => [{item:item.getTalentMat(mat.property,talent), field:"count"}].concat(item.getTalentMat(mat.property,talent)?.getCraftDependencies()??[]))),
        });
      
      if(!display.getField("talentMaterial"))
        display.addField("talentMaterial", {
          group: {label:"Talent Materials", startCollapsed:false},
          label: (item, type, talent) => (this.talentTypes[talent]?.word??talent) + " " + type.capitalize(),
          columnClasses: (item, type, talent) => this.talentTypes[talent] ? ["talent-materials", `${type}-${this.talentTypes[talent]?.char}-materials`] : [],
          dynamic: true,
          value: (item, type, talent) => {
            if(type == "label")
            {
              let talentVal = talent;
              for(let talentType in this.talentTypes)
              {
                let dataType = this.talentTypes[talentType].dataType;
                if(dataType && talent.includes && talent.includes(dataType))
                {
                  talentVal = talent.replace(dataType, "");
                  break;
                }
              }
              return `${talentVal} ➤ ${parseInt(talentVal)+1}`;
            }
            else
            {
              if(item.getTalentMat(type,talent) && item.getTalentMatCost(type,talent)>0)
                return item.getTalentMat(type,talent).getFieldValue(item.getTalentMatCost(type,talent), (isNaN(talent)?item.viewer.settings.preferences?.characterList=='1':item.viewer.settings.preferences?.materialList=='1'));
              else
                return "";
            }
          },
          //title: (item, type, talent) => item.getTalentMat(type?.toLowerCase(),talent)?.getFullSource()??"!ERROR!",
          dependencies: (item, type, talent) => [
            {item:item, field:`${this.talentProperty}.${talent}`},
            item.getTalentMat(type,talent)?.days?.length ? {item:item.viewer, field:"today"} : null,
          ].concat(type == "label" ? item.materialDefs.materials.map(mat => ({item:item.getTalentMat(mat.property,talent), field:"count"})) : (item.getTalentMat(type,talent)?.getCraftDependencies() ?? [])),
          button: (item, type, talent) => Object.keys(this.talentTypes).map(t => 
          {
            let dataType = this.talentTypes[t].dataType;
            let talentType = "";
            let talentVal = talent;
            if(dataType && talent.includes && talent.includes(dataType))
            {
              talentType = dataType;
              talentVal = talent.replace(dataType, "");
            }
            if(type == "label" && talentType == dataType && talentVal == item[this.talentProperty][t])
            {
              if(item.canUpTalent(t, false))
              {
                return {
                  title: `Upgrade ${t} level. This will spend the resources for you.`,
                  icon: "fa-solid fa-circle-up",
                  name: this.talentTypes[t].word,
                  text: this.talentTypes[t].word,
                  action: item.upTalent.bind(item, t),
                };
              }
              else
              {
                return {
                  title: "Not enough materials to upgrade.",
                  icon: "fa-solid fa-circle-up",
                  name: this.talentTypes[t].word,
                  text: this.talentTypes[t].word,
                };
              }
            }
          }),
        });
    
      if(!display.getField("planTalent"))
        display.addField("planTalent", {
          tags: ["detailsOnly"],
          dynamic: true,
          value: (item,talent) => item.wishlist?.[this.talentProperty]?.[talent] ?? "-",
          edit: (item,talent) => ({target: {item, field:`wishlist.${this.talentProperty}.${talent}`}}),
          dependencies: (item,talent) => [
            {item:item, field:"wishlist"},
            {item:item, field:`${this.talentProperty}.${talent}`},
          ],
        });
    }
    
    if(!display.getField("planMaterials"))
      display.addField("planMaterials", {
        tags: ["detailsOnly"],
        dynamic: true,
        value: (item,attr) => {
          let value = [];
          item.viewer.account.plan.addSubPlan(item, item.getPlanMaterials());
          let materials = item.viewer.account.plan.getSubPlan(item);
          for(let matKey in materials)
            value.push({classes:{'plan-material':true}, value:item.materialDefs.list.get(matKey).getFieldValue(materials[matKey], item.viewer.settings.preferences.materialList=='1', {plan:materials})});
          return value;
        },
        dependencies: (item,attr) => [
          {item:item, field:"wishlist"},
          {item:item, field:"level"},
          {item:item, field:this.ascensionProperty},
          {item:item, field:this.talentProperty},
        ],
      });
    
    super.setupDisplay(display);
  }
  
  maxAscension;
  maxTalent;
  materialDefs;
  MaterialList;
  wishlist;
  
  afterLoad()
  {
    if(!this.materialDefs)
      throw new Error(`materialDefs must be set for any object that extends Ascendable.`);
    else
    {
      if(!this.materialDefs.materials)
        throw new Error(`materialDefs.materials must be set for any object that extends Ascendable.`);
      if(!this.materialDefs.list)
        throw new Error(`materialDefs.list must be set for any object that extends Ascendable.`);
    }
    if(!this.constructor.AscensionData && !this.constructor.TalentData)
    {
      throw new Error(`AscensionData or TalentData must be set for any class that extends Ascendable.`);
    }
    else
    {
      if(!this.maxAscension && this.constructor.AscensionData)
        this.maxAscension = Math.max(...Object.keys(this.constructor.AscensionData));
      if(!this.maxTalent && this.constructor.TalentData)
        this.maxTalent = Math.max(...Object.keys(this.constructor.TalentData));
    }
    
    if(!this[this.constructor.talentProperty])
      this[this.constructor.talentProperty] = {};
    for(let talentType in this.constructor.talentTypes)
    {
      // TODO: This check is because I don't even know how my own code works Sadge: I don't know if these properties are set by the time this code runs, so I need to check before overwriting them with the defaults.
      if(!(talentType in this[this.constructor.talentProperty]))
        this[this.constructor.talentProperty][talentType] = this.constructor.talentTypes[talentType].min;
    }
    
    if(!this.MaterialList)
      this.MaterialList = {};
    for(let mat of this.materialDefs.materials)
    {
      if(mat.key)
      {
        this.MaterialList[mat.property] = this.materialDefs.list.get(mat.key);
        if(!mat.skipUser)
          this.MaterialList[mat.property]?.addUser(this);
      }
      else if(mat.group && mat.tiers)
      {
        this.MaterialList[mat.property] = {};
        for(let tier of mat.tiers)
        {
          this.MaterialList[mat.property][tier] = this.materialDefs.list.get((mat.prefix??"") + mat.group[tier] + (mat.suffix??""));
          if(!mat.skipUser)
            this.MaterialList[mat.property]?.[tier]?.addUser(this);
        }
      }
      else if(mat.cycle)
      {
        // TODO: I hate this copy-pasted code as much as everyone, but I just can't be bothered to make it better.
        this.MaterialList[mat.property] = [];
        for(let subMat of mat.cycle)
        {
          if(subMat.key)
          {
            let material = this.materialDefs.list.get(subMat.key);
            this.MaterialList[mat.property].push(material);
            if(!mat.skipUser)
              material?.addUser(this);
          }
          else if(subMat.group && subMat.tiers)
          {
            let materials = {};
            for(let tier of subMat.tiers)
            {
              materials[tier] = this.materialDefs.list.get((subMat.prefix??"") + subMat.group[tier] + (subMat.suffix??""));
              if(!mat.skipUser)
                materials?.[tier]?.addUser(this);
            }
            this.MaterialList[mat.property].push(materials);
          }
        }
      }
    }
    super.afterLoad();
    this.viewer.account.plan.addSubPlan(this, this.getPlanMaterials());
    return true;
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    
    let properties = Object.keys(this.constructor.talentTypes).map(talent => `${this.constructor.talentProperty}.${talent}`);
    properties.push("level");
    properties.push(this.constructor.ascensionProperty);
    
    for(let property of properties)
      if(field.string === property || (field.string === `wishlist.${property}` && !isNaN(value)))
        if(this.getProperty(property) >= this.getProperty(`wishlist.${property}`))
          this.update(`wishlist.${property}`, undefined, "replace");
    return true;
  }
  
  // Normal Ascension
  
  getAscensionData(ascension=this[this.constructor.ascensionProperty])
  {
    if(this.constructor.AscensionData)
      return this.constructor.AscensionData[ascension] ?? this.constructor.AscensionData[this.maxAscension];
    else
      return null;
  }
  
  getMat(type, ascension=this[this.constructor.ascensionProperty])
  {
    let result = this.MaterialList[type];
    let key = this.getAscensionData(ascension)?.[`${type}${this.materialDefs.raritySuffix}`];
    if(result && key)
      result = result[key];
    if(this.constructor.isMaterial(result))
      return result;
    else if(result && typeof(result) == "object" && this.constructor.isMaterial(result[this.rarity]))
      return result[this.rarity];
    else
      return null;
  }
  
  getMatCost(type, ascension=this[this.constructor.ascensionProperty])
  {
    let result = this.getAscensionData(ascension)?.[`${type}${this.materialDefs.costSuffix}`];
    if(typeof(result) == "object")
    {
      // TODO: This assumes the determining factor for the property of the object is this.rarity, which has been the case so far, but might not always be.
      return result[this.rarity];
    }
    else
      return result;
  }
  
  ascend(event)
  {
    if(!this.canAscend())
    {
      console.error(`Tried to ascend item when canAscend() is false.`, {item:this});
      return false;
    }
    event.stopPropagation();
    for(let type of this.materialDefs.materials.map(mat=>mat.property))
    {
      let material = this.getMat(type);
      let cost = this.getMatCost(type);
      if(material && cost)
        material.update("count", material.count - cost);
      else if(cost)
        console.warn(`Ascension has a '${type}' material with a cost (${cost}), but no valid material found.`, {item:this});
      else if(material && cost == undefined)
        console.warn(`Ascension has a '${type}' material specified, but no cost set.`, {item:this, material});
    }
    // TODO: This assumes this.level will always be set, which has been the case so far, but might not always be.
    let levelProp = "level";
    if(this.levelCap && this[levelProp] < this.levelCap)
      this.update(levelProp, this.levelCap);
    this.update(this.constructor.ascensionProperty, this[this.constructor.ascensionProperty]+1);
  }
  
  canAscend(withCrafting=false)
  {
    if(this[this.constructor.ascensionProperty] >= this.maxAscension)
      return false;
    
    return this.materialDefs.materials.reduce((can,mat) => {
      if(!can)
        return false;
      let material = this.getMat(mat.property);
      let cost = this.getMatCost(mat.property);
      if(material && cost)
      {
        if(withCrafting)
          return material.getCraftCount() >= cost;
        else
          return material.count >= cost;
      }
      else
        return can;
    }, true);
  }
  
  get levelCap() { return this.getAscensionData().levelCap; }
  
  getTalentCap(talent, ascension=this[this.constructor.ascensionProperty])
  {
    let dataType = this.constructor.talentTypes[talent].dataType;
    return this.getAscensionData(ascension)[`${dataType}talentCap`] ?? 0;
  }
  
  // Talent Increases
  
  /**
  @param int|String talent A key of the TalentData object whose data will be returned, or a key of the this[talentProperty] object whose value corresponds to a key of the TalentData whose data will be returned.
  */
  getTalentData(talent, options)
  {
    if(this.constructor.TalentData)
    {
      let dataType = this.constructor.talentTypes[options?.talentType??talent]?.dataType ?? "";
      let dataKey = dataType + (talent in this[this.constructor.talentProperty] ? this[this.constructor.talentProperty][talent] : talent);
      if(this.constructor.TalentData[dataKey])
        return this.constructor.TalentData[dataKey];
      else
      {
        console.warn(`Could not get talent data from parameters, falling back to default.`, {talent, options, dataType, dataKey});
        return this.constructor.TalentData[this.maxTalent];
      }
    }
    else
      return null;
  }
  
  getTalentMat(type, talent, options)
  {
    let result = this.MaterialList[type + (options?.propertySuffix??'')];
    if(Array.isArray(result))
      result = result[((isNaN(talent) ? this[this.constructor.talentProperty][talent] : talent) - 1) % result.length];
    
    let key = this.getTalentData(talent, options)?.[`${type}${this.materialDefs.talentRaritySuffix}`];
    if(result && key)
      result = result[key];
    
    // In the future, maybe account for if this item's rarity also affects the rarity of the mat, like how this item's rarity often affects the cost.
    if(this.constructor.isMaterial(result))
      return result;
    else
      return null;
  }
  
  getTalentMatCost(type, talent, options)
  {
    return this.getTalentData(talent, options)?.[`${type}${this.materialDefs.talentCostSuffix}`];
  }
  
  upTalent(talent, options, event)
  {
    if(!event)
      event = options;
    if(!this.canUpTalent(talent, false, options))
    {
      console.error(`Tried to up talent item when canUpTalent() is false.`, {item:this, talent, options});
      return false;
    }
    event.stopPropagation();
    for(let type of this.materialDefs.materials.map(mat=>mat.property))
    {
      let material = this.getTalentMat(type, talent, options);
      let cost = this.getTalentMatCost(type, talent, options);
      if(material && cost)
        material.update("count", material.count - cost);
      else if(cost)
        console.warn(`Talent has a '${type}' material with a cost (${cost}), but no valid material found.`, {item:this, talent, options});
      else if(material && cost == undefined)
        console.warn(`Talent has a '${type}' material specified, but no cost set.`, {item:this, material, type, options});
    }
    this.update(`${this.constructor.talentProperty}.${talent}`, this[this.constructor.talentProperty][talent]+1);
  }
  
  canUpTalent(talent, withCrafting, options)
  {
    if(this[this.constructor.talentProperty][talent] >= this.getTalentCap(talent))
      return false;
    
    return this.materialDefs.materials.reduce((can,mat) => {
      if(!can)
        return false;
      let material = this.getTalentMat(mat.property, talent, options);
      let cost = this.getTalentMatCost(mat.property, talent, options);
      if(material && cost)
      {
        if(withCrafting)
          return material.getCraftCount() >= cost;
        else
          return material.count >= cost;
      }
      else
        return can;
    }, true);
  }
  
  // Plans
  
  getPlanMaterials(result={})
  {
    // Ascension
    if(this.constructor.AscensionData)
    {
      if((this.wishlist?.[this.constructor.ascensionProperty]??0) - this[this.constructor.ascensionProperty] > 0)
      {
        for(let asc=this[this.constructor.ascensionProperty]; asc<this.wishlist?.[this.constructor.ascensionProperty]; asc++)
        {
          for(let type of this.materialDefs.materials.map(mat=>mat.property))
          {
            let mat = this.getMat(type, asc);
            let cost = this.getMatCost(type, asc);
            if(mat && cost)
            {
              if(!result[mat.key])
                result[mat.key] = 0;
              result[mat.key] += cost;
            }
          }
        }
      }
    }
    
    // Talents
    if(this.constructor.TalentData)
    {
      for(let talent in this.constructor.talentTypes)
      {
        let target = parseInt(this.wishlist?.[this.constructor.talentProperty]?.[talent]??0);
        let current = parseInt(this[this.constructor.talentProperty][talent]);
        if(target - current > 0)
        {
          for(let lvl=current; lvl<target; lvl++)
          {
            for(let type of this.materialDefs.materials.map(mat=>mat.property))
            {
              let mat = this.getTalentMat(type, lvl, {talentType:talent});
              let cost = this.getTalentMatCost(type, lvl, {talentType:talent});
              if(mat && cost)
              {
                if(!result[mat.key])
                  result[mat.key] = 0;
                result[mat.key] += cost;
              }
            }
          }
        }
      }
    }
    
    return result;
  }
};

export default Ascendable;