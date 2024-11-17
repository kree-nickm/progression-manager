const {default:GenshinFurnitureData} = await window.importer.get(`js/genshin/gamedata/GenshinFurnitureData.js`);

const {default:GenshinItem} = await window.importer.get(`js/genshin/GenshinItem.js`);

export default class Furniture extends GenshinItem
{
  key = "";
  learned = false;
  _count = 0;
  
  get name() { return GenshinFurnitureData[this.key].name; }
  get type() { return GenshinFurnitureData[this.key].type; }
  get image() { return GenshinFurnitureData[this.key].img; }
  
  get count(){ return this._count; }
  set count(val){
    if(val < 0)
      val = this._count + val;
    this._count = Math.max(val, 0);
  }
}
