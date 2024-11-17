const {default:GenshinFurnitureSetData} = await window.importer.get(`js/genshin/gamedata/GenshinFurnitureSetData.js`);

const {default:GenshinItem} = await window.importer.get(`js/genshin/GenshinItem.js`);

export default class FurnitureSet extends GenshinItem
{
  static dontSerialize = super.dontSerialize.concat(["furniture"]);
  
  key;
  furniture;
  learned;
  settled = [];
  
  afterLoad()
  {
    if(GenshinFurnitureSetData[this.key])
    {
      this.furniture = this.recipe.map(furn => this.list.viewer.lists.FurnitureList.get(furn.key));
    }
    else
    {
      console.warn(`Unknown furniture set "${this.key}".`);
      this.furniture = [];
    }
    return true;
  }
  
  get name(){ return GenshinFurnitureSetData[this.key]?.name ?? this.key; }
  get image(){ return GenshinFurnitureSetData[this.key]?.img ?? ""; }
  get recipe(){ return GenshinFurnitureSetData[this.key]?.materials ?? []; }
  get characters(){ return GenshinFurnitureSetData[this.key]?.characters ?? []; }
}
