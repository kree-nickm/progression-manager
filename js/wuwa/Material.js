const {default:LootData} = await window.importer.get(`js/wuwa/gamedata/LootData.js`);
const {default:MaterialData} = await window.importer.get(`js/wuwa/gamedata/MaterialData.js`);

const {default:WuWaItem} = await window.importer.get(`js/wuwa/WuWaItem.js`);
const {default:Ingredient} = await window.importer.get(`js/Ingredient.js`);

export default class Material extends Ingredient(WuWaItem)
{
  static dontSerialize = super.dontSerialize.concat(["_shorthand","type","subtype","source"]);
  
  key = "";
  
  _shorthand;
  type;
  subtype;
  source = "";
  
  get shorthand(){ return this._shorthand ?? this.name; }
  set shorthand(val){ this._shorthand = val; }
  get name() { return MaterialData[this.key]?.name ?? "!unknown!"; }
  get rarity() { return MaterialData[this.key]?.rarity ?? 1; }
  get image(){ return "img/wuwa/small/" + (MaterialData[this.key]?.icon?.slice(MaterialData[this.key]?.icon?.lastIndexOf(".")+1) ?? "blank") + ".webp"; }
  
  afterLoad()
  {
    if(!MaterialData[this.key])
      this.key = this.list.constructor.toKey(this.key);
    return true;
  }
  
  getFieldValue(cost, useImage=false, {noName=false, plan}={})
  {
    let numbersPart = {
      value: `${this.count} / ${cost}`,
      title: this.prevTier || this.converts
        ? `Up to ${this.getCraftCount({plan})} if you craft.`
        : ``,
      classes: {
        "quantity": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount({plan}) < cost,
      },
      edit: {target: {item:this, field:"count"}, min:0, max:99999},
    };
    
    let namePart = {
      value: this.shorthand,
      classes: {
        "material": true,
        "q1": this.rarity == 1,
        "q2": this.rarity == 2,
        "q3": this.rarity == 3,
        "q4": this.rarity == 4,
        "q5": this.rarity == 5,
      },
      title: this.getFullSource(),
    };
    
    return noName ? numbersPart : [numbersPart, namePart];
  }
}
