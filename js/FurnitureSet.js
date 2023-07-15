import GenshinFurnitureSetData from "./gamedata/GenshinFurnitureSetData.js";

import GenshinItem from "./GenshinItem.js";

export default class FurnitureSet extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["furniture"]);
  
  key = "";
  furniture;
  learned = false;
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
  get recipe(){ return GenshinFurnitureSetData[this.key]?.materials ?? []; }
  get characters(){ return GenshinFurnitureSetData[this.key]?.characters ?? []; }
}
