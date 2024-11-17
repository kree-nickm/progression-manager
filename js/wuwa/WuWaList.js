const {default:UIList} = await window.importer.get(`js/UIList.js`);

export default class WuWaList extends UIList
{
  static fromJSON(data, {viewer, addProperties={}}={})
  {
    let result = super.fromJSON(data, {viewer, addProperties});
    return result;
  }
  
  static toKey(string)
  {
    return string
      .replaceAll(/[-— (][a-z]/g, (match, offset, str) => match.toUpperCase())
      .replaceAll(/[^a-zA-Z0-9_]/g, "");
  }
  
  static fromKey(string)
  {
    return string
      .replaceAll(/[A-Z]/g, " $&").trim()
      .replaceAll(/ (a|an|the|and|but|or|for|nor|of|for|at|in|by|from|to|as) /gi, (match, p1, offset, str) => match.toLowerCase());
  }
  
  getUnique(item)
  {
    return (this.constructor.unique ? WuWaList.toKey(item.key) : item.uuid) ?? this.getHash(item);
  }
  
  get(unique)
  {
    return super.get(this.constructor.toKey(unique));
  }
  
  items(a, b)
  {
    return super.items(a, b).filter(item => !item.isLeakHidden);
  }
}
