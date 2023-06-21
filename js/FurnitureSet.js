import GiftSets from "./gamedata/GiftSets.js";

import GenshinItem from "./GenshinItem.js";

export default class FurnitureSet extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["furniture","loaded"]);
  
  key = "";
  furniture;
  loaded = false;
  learned = false;
  settled = [];
  
  afterLoad()
  {
    if(GiftSets[this.key])
    {
      this.loaded = true;
      this.furniture = this.recipe.map(furn => this.list.viewer.lists.FurnitureList.get(furn.key));
    }
    else
    {
      console.warn(`Unknown furniture set "${this.key}".`);
      this.loaded = false;
      this.furniture = [];
    }
    return this.loaded;
  }
  
  get name(){ return this.loaded ? GiftSets[this.key].name : this.key; }
  get recipe(){ return this.loaded ? GiftSets[this.key].materials : []; }
  get characters(){ return this.loaded ? GiftSets[this.key].characters : []; }
}
