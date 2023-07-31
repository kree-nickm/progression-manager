import UIList from "./UIList.js";
import GenshinItem from "./GenshinItem.js";

export default class GenshinList extends UIList {
  static fromJSON(data, {viewer, addProperties={}}={})
  {
    let result = super.fromJSON(data, {viewer, addProperties});
    return result;
  }
  
  getUnique(item)
  {
    return (this.constructor.unique ? (item.key ?? item.id) : item.uuid) ?? this.getHash(item);
  }
  
  fromGOOD(goodData, {source="GOOD"}={})
  {
    this.startImport(source);
    this.clear();
    if(Array.isArray(goodData))
    {
      for(let goodItem of goodData)
        this.addGOOD(goodItem);
    }
    else if(typeof(goodData) == "object" && goodData != null)
    {
      for(let key in goodData)
        this.addGOOD({goodKey:key, goodValue:goodData[key]});
    }
    else
    {
      console.error("GenshinList.fromGOOD(goodData) only works if goodData is an array or object.", goodData);
    }
    this.forceNextRender = true;
    this.finishImport();
    return this.list.length;
  }
  
  addGOOD(goodData)
  {
    if(typeof(goodData) != "object")
    {
      console.error("Argument passed to GenshinList.addGOOD() must be an object.", goodItem);
      return null;
    }
    
    if(this.constructor.unique)
    {
      let existing = this.get(this.getUnique(goodData));
      if(existing)
      {
        existing.fromGOOD(goodData);
        this.subsets = {};
        return existing;
      }
    }
    
    this.subsets = {};
    return this.createItem(goodData);
  }
  
  createItem(goodData)
  {
    let item = new this.constructor.itemClass();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  toGOOD()
  {
    let result = [];
    for(let item of this.list)
      result.push(item.toGOOD());
    return result;
  }
}
