import GenshinFurnitureData from "./gamedata/GenshinFurnitureData.js";

import GenshinItem from "./GenshinItem.js";

export default class Furniture extends GenshinItem
{
  #count = 0;
  
  get name() { return GenshinFurnitureData[this.key].name; }
  get count(){ return this.#count; }
  set count(val){
    if(val < 0)
      val = this.#count + val;
    this.#count = Math.max(val, 0);
  }
}
