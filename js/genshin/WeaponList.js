import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";

import { handlebars, Renderer } from "../Renderer.js";
import GenshinList from "./GenshinList.js";
import Artifact from "./Artifact.js";
import Weapon from "./Weapon.js";

handlebars.registerHelper("getWeaponData", (key, options) => GenshinWeaponData[key]);
handlebars.registerHelper("weaponList", (item, options) => item.viewer.lists.WeaponList.items(options.hash.filter));

export default class WeaponList extends GenshinList
{
  static itemClass = Weapon;
  static subsetDefinitions = {
    'Sword': item => item.type == "Sword",
    'Claymore': item => item.type == "Claymore",
    'Polearm': item => item.type == "Polearm",
    'Bow': item => item.type == "Bow",
    'Catalyst': item => item.type == "Catalyst",
  };
  
  setupDisplay()
  {
    let name = this.display.addField("name", {
      label: "Name",
      popup: item => item,
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: item => item.viewer.settings.preferences.listDisplay=='1' ? {
        tag: "div",
        value: {
          tag: "div",
          value: {
            tag: "img",
            src: item.image,
            alt: item.name,
          },
          classes: {"display-img": true, ["rarity-"+item.rarity]: true},
        },
        classes: {
          "item-display": true,
          "item-material": true,
          "display-sm": true,
          "display-no-caption": true,
        },
        title: item.name,
      } : item.name,
      classes: item => item.viewer.settings.preferences.listDisplay=='1' ? {
        "material": false,
        "q1": false,
        "q2": false,
        "q3": false,
        "q4": false,
        "q5": false,
      } : {
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      },
    });
    
    let type = this.display.addField("type", {
      label: "Type",
      sort: {generic: {type:"string", property:"type"}},
      dynamic: false,
      value: item => ({
        tag: "img",
        classes: {'weapon-icon':true},
        src: `img/Weapon_${item.type}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let stat = this.display.addField("stat", {
      label: "Stat",
      sort: {generic: {type:"string", property:"stat"}},
      dynamic: false,
      value: item => Artifact.getStatShorthand(item.stat),
    });
    
    let refinement = this.display.addField("refinement", {
      label: "Ref",
      sort: {generic: {type:"number", property:"refinement"}},
      dynamic: true,
      value: item => item.refinement,
      edit: item => ({target: {item, field:"refinement"}, min:1, max:5}),
      classes: item => ({
        'at-max': item.refinement >= 5,
      }),
    });
    
    let iconLookup = {
      'forgery': `<i class="fa-solid fa-dungeon"></i>`,
      'strong': `<i class="fa-solid fa-skull fa-lg"></i>`,
      'weak': `<i class="fa-solid fa-skull fa-sm"></i>`,
    };
    
    let passiveField = this.display.addField("passive", {
      label: "Passive",
      tags: ["detailsOnly"],
      dynamic: true,
      html: true,
      value: item => item.getPassive(),
      dependencies: item => [
        {item, field:"refinement"},
      ],
    });
    
    let atk = this.display.addField("atk", {
      label: "ATK",
      tags: ["detailsOnly"],
      dynamic: true,
      value: item => item.getATK().toFixed(0),
      dependencies: item => [
        {item, field:"ascension"},
        {item, field:"level"},
      ],
    });
    
    let statVal = this.display.addField("statVal", {
      label: "Stat",
      tags: ["detailsOnly"],
      dynamic: true,
      title: item => item.getStat(),
      value: item => item.getStat().toFixed(item.stat=="eleMas"?0:1),
      dependencies: item => [
        {item, field:"level"},
      ],
    });
    
    let imageField = this.display.addField("image", {
      label: "Image",
      tags: ["detailsOnly"],
      dynamic: true,
      value: item => {
        return {
          tag: "img",
          src: item.image,
        };
      },
      dependencies: item => [
        {item, field:"ascension"},
      ],
    });
    
    Weapon.setupDisplay(this.display);
  }
  
  getFooterParams()
  {
    return {
      add: {
        fields: [
          {
            property: "key",
            options: Object.keys(GenshinWeaponData).filter(key => this.viewer.settings.preferences.showLeaks || !GenshinWeaponData[key].release || Date.parse(GenshinWeaponData[key].release) <= Date.now()).map(key => ({value:key, label:GenshinWeaponData[key].name})),
          },
        ],
        onAdd: (event, elements, data) => this.addGOOD({
          key: data.key,
          level: 1,
          refinement: 1,
          ascension: 0,
          location: "",
          lock: true,
        }),
      },
    };
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [];
    data.fields.push({field:this.display.getField("favorite"), params:[]});
    data.fields.push({field:this.display.getField("name"), params:[]});
    data.fields.push({field:this.display.getField("type"), params:[]});
    data.fields.push({field:this.display.getField("lock"), params:[]});
    data.fields.push({field:this.display.getField("level"), params:[]});
    data.fields.push({field:this.display.getField("ascension"), params:[]});
    data.fields.push({field:this.display.getField("refinement"), params:[]});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['forgery']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['strong']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['weak']});
    data.fields.push({field:this.display.getField("location"), params:[]});
    data.fields.push({field:this.display.getField("deleteBtn"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
}
