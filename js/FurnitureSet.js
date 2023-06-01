import GiftSets from "./gamedata/GiftSets.js";

import GenshinItem from "./GenshinItem.js";

export default class FurnitureSet extends GenshinItem
{
  afterLoad()
  {
    if(GiftSets[this.key])
    {
      this.loaded = true;
      this.furniture = this.recipe.map(furn => this.list.viewer.lists.furniture.get(furn.key));
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
