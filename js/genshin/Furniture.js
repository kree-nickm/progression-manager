const {default:GenshinFurnitureData} = await window.importer.get(`js/genshin/gamedata/GenshinFurnitureData.js`);

const {default:GenshinItem} = await window.importer.get(`js/genshin/GenshinItem.js`);

export default class Furniture extends GenshinItem
{
  key = "";
  learned = false;
  _count = 0;
  
  get name() { return GenshinFurnitureData[this.key]?.name ?? this.key; }
  get type() { return this.getSource() === "depot-buy" ? "purchasable" : "craftable"; }
  get load() { return GenshinFurnitureData[this.key]?.load ?? 0; }
  get energy() { return GenshinFurnitureData[this.key]?.energy ?? 0; }
  get efficiency() { return this.energy / this.load; }
  get source() { return GenshinFurnitureData[this.key]?.source ?? "???"; }
  get image() { return GenshinFurnitureData[this.key]?.img; }
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
    if(this._count && !this.learned)
      this.update("learned", true);
  }
  
  getSource()
  {
    if(this.source.endsWith("Chest Reward"))
      return "chest";
    //else if(this.source.startsWith("Adeptal Mirror"))
    //  return "reward";
    //else if(this.source.startsWith("Teapot Spirit"))
    //  return "reward";
    else if(this.source.endsWith("Reward"))
      return "reward";
    else if(this.source.endsWith("Quest"))
      return "reward";
    else if(this.source.endsWith("Shop"))
      return "shop";
    else if(this.source.startsWith("Purchased"))
      return "depot-buy";
    else
      return "depot";
  }
}
