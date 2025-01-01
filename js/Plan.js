const { Renderer } = await window.importer.get(`js/Renderer.js`);
const {default:UIController} = await window.importer.get(`js/UIController.js`);

export default class Plan extends UIController
{
  static dontSerialize = super.dontSerialize.concat(["subPlans","resolved"]);
  
  subPlans = {};
  resolved = {};
  
  afterUpdate(field, value, action, options)
  {
    super.afterUpdate(field, value, action, options);
    
    // Rebuild resolved property.
    this.resolved = {};
    for(let source in this.subPlans)
    {
      let subPlan = this.subPlans[source];
      for(let matKey in subPlan)
      {
        if(!this.resolved[matKey])
        {
          this.resolved[matKey] = {
            item: this.viewer.lists.MaterialList.get(matKey),
            amount: subPlan[matKey],
            wanters: [{
              source,
              item: Renderer.controllers.get(source),
              amount: subPlan[matKey],
            }],
          };
        }
        else
        {
          this.resolved[matKey].amount += subPlan[matKey];
          this.resolved[matKey].wanters.push({
            source,
            item: Renderer.controllers.get(source),
            amount: subPlan[matKey],
          });
        }
      }
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
  
  getSimplified()
  {
    let simple = {};
    for(let matKey in this.resolved)
      simple[matKey] = this.resolved[matKey].amount;
    return simple;
  }
}
