import UIController from "./UIController.js";

export default class Plan extends UIController
{
  static dontSerialize = UIController.dontSerialize.concat(["subPlans"]);
  
  subPlans = {};
  
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
  
  getPlan()
  {
    let result = {};
    for(let plan of Object.values(this.subPlans))
      for(let mat in plan)
        result[mat] = (result[mat]??0) + plan[mat];
    return result;
  }
  
  getFullPlan(viewer)
  {
    let original = this.getPlan();
    let resolved = [];
    for(let key in original)
    {
      let material = this.viewer.lists.MaterialList.get(key);
      let idx = this.viewer.lists.MaterialList.list.indexOf(material);
      resolved.push({sort:idx, item:material, amount:original[key]});
    }
    resolved.sort((a,b) => a.sort - b.sort);
    return {resolved, original};
  }
}
