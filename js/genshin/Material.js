import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinMaterialData from "./gamedata/GenshinMaterialData.js";

import GenshinItem from "./GenshinItem.js";
import Character from "./Character.js";
import Weapon from "./Weapon.js";
import Ingredient from "../Ingredient.js";

export default class Material extends Ingredient(GenshinItem)
{
  static dontSerialize = super.dontSerialize.concat(["_shorthand","_type","source","days"]);
  
  static gemQualities = {
    '5': " Gemstone",
    '4': " Chunk",
    '3': " Fragment",
    '2': " Sliver",
  };
  static masteryQualities = {
    '4': "Philosophies of ",
    '3': "Guide to ",
    '2': "Teachings of ",
  };
  
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
  
  key = "";
  _shorthand;
  _type;
  source = "";
  days = [];
  
  fromGOOD(goodData)
  {
    let data;
    if('goodKey' in goodData && 'goodValue' in goodData)
    {
      data = {
        key: Material.toKey(goodData.goodKey),
        count: goodData.goodValue,
      };
    }
    else
      data = goodData;
    return super.fromGOOD(data);
  }
  
  toGOOD()
  {
    console.warn("Material.toGOOD() should not be called directly.");
    return this.count;
  }
  
  get shorthand(){ return this._shorthand ?? this.name; }
  set shorthand(val){ this._shorthand = val; }
  get name() { return GenshinMaterialData[this.key]?.name ?? this.key; }
  get type() {
    if(!this._type)
    {
      if(this.key == "CrownOfInsight")
        this._type = "crown";
      if(!this._type)
        for(let type in GenshinLootData)
        if(this.shorthand in GenshinLootData[type])
          this._type = type;
      if(!this._type)
        for(let wboss of GenshinLootData.trounce)
          if(wboss.loot.indexOf(this.name) > -1)
            this._type = "trounce";
      if(!this._type)
      {
        let words = this.shorthand.split(" ");
        if(words.length == 2 && (words[0] == "Diamond" || Object.keys(GenshinLootData.gemstone).indexOf(words[0]) > -1 && (words[0] + Material.gemQualities[this.rarity]) == this.shorthand))
          this._type = "gemstone";
        else if(words[words.length-1] == "Billet")
          this._type = "billet";
        else if(words[words.length-1] == "Bait")
          this._type = "bait";
        else if(words[words.length-1] == "Wood")
          this._type = "wood";
      }
    }
    return this._type ?? "unknown";
  }
  set type(val){ this._type = val; }
  get image(){ return GenshinMaterialData[this.key]?.img ?? ""; }
  get rarity(){ return GenshinMaterialData[this.key]?.rarity ?? 1; }
  get releaseTimestamp(){ return GenshinMaterialData[this.key]?.release ? Date.parse(GenshinMaterialData[this.key]?.release) : 0; }
  
  async getRelatedItems()
  {
    return {
      topFields: [
        {
          fieldDefs: [
            [
              { field:this.display.getField("image"), params:[] },
            ],
          ],
        },
        {
          header: "Count",
          fieldDefs: [
            [
              { field:this.display.getField("count"), params:[] },
            ],
          ],
        },
      ],
    };
  }
  
  getFullSource()
  {
    return `${this.name}` + (this.source?`, dropped by ${this.source}`:"") + (this.days.length?`, on ${this.days.join("/")}`:"");
  }
  
  getFieldValue(cost, useImage=false, {noName=false, plan}={})
  {
    let bosskills3 = Math.ceil((cost-this.count)/3);
    let bosskills2 = Math.ceil((cost-this.count)/2);
    
    let iconPart = {
      tag: "div",
      value: [
        {
          tag: "div",
          value: [
            {
              tag: "i",
              classes: {
                "display-badge": true,
                "fa-solid": true,
                "fa-sun": true,
                "d-none": this.days.indexOf(this.viewer.today()) == -1,
              },
              title: "This drop can be obtained today.",
            },
            {
              tag: "img",
              src: this.image,
              alt: this.name,
            }
          ],
          classes: {"display-img": true, ["rarity-"+this.rarity]: true},
        },
        {
          value: `${this.count} / ${cost}`,
          title: this.type == "boss"
            ? `Requires `+ (bosskills2!=bosskills3?`${bosskills3}-${bosskills2}`:bosskills2) +` more boss kill`+ (bosskills2!=1||bosskills3!=1?"s":"") +`.`
            : this.type == "flora"
              ? `` // TODO: Compile data for number of each flora that exists on the map and display the relevant number here.
              : this.prevTier
                ? `Up to ${this.getCraftCount({plan})} if you craft.`
                : ``,
          classes: {"display-caption": true},
          edit: {target: {item:this, field:"count"}},
        }
      ],
      classes: {
        "item-display": true,
        "item-material": true,
        "display-sm": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount({plan}) < cost,
        "long-text": this.count>999 || cost>999,
        "longer-text": this.count>9999 || cost>9999,
      },
      title: this.getFullSource(),
    };
    
    let numbersPart = {
      value: `${this.count} / ${cost}`,
      title: this.type == "boss"
        ? `Requires `+ (bosskills2!=bosskills3?`${bosskills3}-${bosskills2}`:bosskills2) +` more boss kill`+ (bosskills2!=1||bosskills3!=1?"s":"") +`.`
        : this.type == "flora"
          ? `` // TODO: Compile data for number of each flora that exists on the map and display the relevant number here.
          : this.prevTier || this.converts
            ? `Up to ${this.getCraftCount({plan})} if you craft.`
            : ``,
      classes: {
        "quantity": true,
        "pending": this.count < cost,
        "insufficient": this.getCraftCount({plan}) < cost,
        "small": this.count>999 || cost>999,
      },
      edit: {target: {item:this, field:"count"}, min:0, max:99999},
    };
    
    let namePart = {
      value: this.shorthand + (this.days.indexOf(this.viewer.today()) > -1 ? "*" : ""),
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
    if(this.type == "gemstone")
      for(let element of ["Anemo","Cryo","Dendro","Electro","Geo","Hydro","Pyro"])
        namePart.value = namePart.value.replace(element, `{{element:${element}}}`);
    
    return this.image && useImage ? iconPart : noName ? numbersPart : [numbersPart, namePart];
  }
}
