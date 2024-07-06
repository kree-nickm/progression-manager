const Plannable = (SuperClass) => class extends SuperClass {
  plan;
  
  getPlanMaterials()
  {
    let result = {};
    return result;
  }
};

export default Plannable;
