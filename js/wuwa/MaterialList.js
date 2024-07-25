import LootData from "./gamedata/LootData.js";
import MaterialData from "./gamedata/MaterialData.js";

import { Renderer } from "../Renderer.js";
import WuWaList from "./WuWaList.js";
import Material from "./Material.js";

export default class MaterialList extends WuWaList
{
  static unique = true;
  static itemClass = Material;
  static subsetDefinitions = {
  };
  
  setupDisplay()
  {
    this.display.addField("name", {
      label: "Name",
      dynamic: false,
      value: item => item.name,
      classes: item => ({
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      }),
    });
    
    this.display.addField("icon", {
      label: "Material",
      sort: {generic: {type:"string", property:"name"}},
      dynamic: true,
      value: (item,size) => ({
        tag: "div",
        value: [
          {
            tag: "div",
            value: {
              tag: "img",
              src: item.image,
              classes: {"item-image":true},
            },
            title: item.name,
            classes: {"item-image-container":true, ["item-rarity-"+item.rarity]:true},
          },
          {
            tag: "div",
            value: {
              value: item.count,
              title: `Click to change.`,
              edit: {target:{item:item, field:"count"}},
            },
            classes: {"item-props":true},
          },
        ],
        classes: {"item-icon":true},
      }),
    });
    
    this.display.addField("image", {
      label: "Image",
      dynamic: false,
      value: item => ({
        tag: "div",
        //title: item.getFullSource(),
        value: {
          tag: "img",
          src: item.image,
          alt: item.name,
        },
        classes: {"display-img": true, ["rarity-"+item.rarity]: true},
      }),
    });
    
    Material.setupDisplay(this.display);
  }
  
  initialize()
  {
    super.initialize();
    for(let matKey in MaterialData)
    {
      let item = this.createItem({
        key: matKey,
        count: 0,
        type: MaterialData[matKey].type,
        subtype: MaterialData[matKey].subtype,
      });
      if(!this.constructor.subsetDefinitions[MaterialData[matKey].subtype])
        this.constructor.subsetDefinitions[MaterialData[matKey].subtype] = item => item.subtype == MaterialData[matKey].subtype;
    }
    
    // Primary mats
    for(let shorthand in LootData.primary)
    {
      let tiers = [];
      for(let rarity of [5,4,3,2])
      {
        if(LootData.primary[shorthand][rarity])
        {
          let key = this.constructor.toKey(LootData.primary[shorthand][rarity]);
          let mat = this.get(key);
          if(mat)
            tiers.push(mat.update("shorthand", shorthand));
          else
            console.error(`Can't find ${key}`);
        }
      }
      Material.setupTiers(tiers);
    }
  }
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("count", 0);
    }
  }
  
  prepareRender(element, data, options)
  {
    if(this.viewer.settings.preferences.materialList == '1')
    {
      data.items = {};
      for(let filter in this.constructor.subsetDefinitions)
        data.items[filter] = this.items(filter);
      data.fields = this.display.getFields().map(field => ({field, params:[]}));
      options.template = "wuwa/renderMaterialList";
      return {element, data, options};
    }
    else
    {
      data.fields = [
        {field:this.display.getField("name"), params:[]},
        {field:this.display.getField("count"), params:[]},
        //{field:this.display.getField("source"), params:[]},
        //{field:this.display.getField("users"), params:[]},
      ];
      return {element, data, options};
    }
  }
}
