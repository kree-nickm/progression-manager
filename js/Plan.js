const {default:UIController} = await import(`./UIController.js?v=${window.versionId}`);

export default class Plan extends UIController
{
  static dontSerialize = super.dontSerialize.concat(["subPlans"]);
  
  subPlans = {};
  
  afterUpdate(field, value, action, options)
  {
    super.afterUpdate(field, value, action, options);
    if(field.path[0] == "subPlans")
    {
      this.clearMemory("combinedPlan");
      this.clearMemory("fullPlan");
    }
  }
  
  addSubPlan(source, plan)
  {
    if(source instanceof UIController)
      source = source.uuid;
    else if(typeof(source) == "object")
    {
      console.error(`source must be a UIController or scalar.`);
      return false;
    }
    this.update(`subPlans.${source}`, plan, "replace");
  }
  
  getSubPlan(source)
  {
    if(source instanceof UIController)
      source = source.uuid;
    else if(typeof(source) == "object")
    {
      console.error(`source must be a UIController or scalar.`);
      return false;
    }
    return this.subPlans[source];
  }
  
  getFullPlan()
  {
    return this.memoryFunction(() => {
      let original = {};
      let resolved = {};
      for(let src in this.subPlans)
      {
        let plan = this.subPlans[src];
        for(let matKey in plan)
        {
          original[matKey] = (original[matKey]??0) + plan[matKey];
          if(!resolved[matKey])
          {
            resolved[matKey] = {
              item: this.viewer.lists.MaterialList.get(matKey),
              amount: original[matKey],
              wanters: [{src, amount:plan[matKey]}],
            };
          }
          else
          {
            resolved[matKey].amount = original[matKey];
            resolved[matKey].wanters.push({src, amount:plan[matKey]});
          }
        }
      }
      return {resolved, original};
    }, "fullPlan");
  }
}
