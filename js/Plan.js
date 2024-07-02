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
    this.subPlans[source] = plan;
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
}
