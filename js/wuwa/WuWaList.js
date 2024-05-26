import UIList from "../UIList.js";

export default class WuWaList extends UIList
{
  static fromJSON(data, {viewer, addProperties={}}={})
  {
    let result = super.fromJSON(data, {viewer, addProperties});
    return result;
  }
  
  getUnique(item)
  {
    return (this.constructor.unique ? (item.key ?? item.id) : item.uuid) ?? this.getHash(item);
  }
  
  items(a, b)
  {
    return super.items(a, b).filter(item => !item.isLeakHidden);
  }
}
