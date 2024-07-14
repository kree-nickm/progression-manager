import WeaponData from "./gamedata/WeaponData.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaList from "./WuWaList.js";
import Weapon from "./Weapon.js";

export default class WeaponList extends WuWaList
{
  static itemClass = Weapon;
  static subsetDefinitions = {
    'Sword': item => item.type == "Sword",
    'Broadblade': item => item.type == "Broadblade",
    'Gauntlets': item => item.type == "Gauntlets",
    'Pistols': item => item.type == "Pistols",
    'Rectifier': item => item.type == "Rectifier",
  };
  
  setupDisplay()
  {
    this.display.addField("name", {
      label: "Name",
      popup: item => item,
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
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
    
    this.display.addField("type", {
      label: "Type",
      sort: {generic: {type:"string", property:"type"}},
      dynamic: false,
      value: item => item.type,
      /*value: item => ({
        tag: "img",
        classes: {'weapon-icon':true},
        src: `img/Weapon_${item.type}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),*/
    });
    
    this.display.addField("lock", {
      label: "L",
      title: item => "Is Locked?",
      sort: {generic: {type:"boolean", property:"lock"}},
      dynamic: true,
      edit: item => ({
        target: {item, field:"lock"},
        type: "checkbox",
        value: item.lock,
        trueClasses: ["fa-solid","fa-lock"],
        falseClasses: [],
      }),
    });
    
    this.display.addField("level", {
      label: "Lvl",
      sort: {generic: {type:"number", property:"level"}},
      dynamic: true,
      value: item => item.level,
      edit: item => ({target: {item, field:"level"}}),
      /*classes: item => ({
        "at-max": item.level >= item.levelCap,
      }),*/
    });
    
    this.display.addField("syntonization", {
      label: "Syn",
      sort: {generic: {type:"number", property:"syntonization"}},
      dynamic: true,
      value: item => item.syntonization,
      edit: item => ({target: {item, field:"syntonization"}}),
    });
    
    this.display.addField("location", {
      label: "User",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.character ? {
        value: [
          {
            value: item.character.name,
            edit: {
              target: {item:item, field:"location"},
              type: "select",
              list: item.list.viewer.lists.CharacterList.items("owned").filter(cha => item.type == cha.weaponType),
              valueProperty: "key",
              displayProperty: "name",
            },
          },
          {
            tag: "i",
            classes: {'fa-solid':true, 'fa-eye':true},
            popup: item.character.variants?.length ? item.character.variants[0] : item.character,
          },
        ],
        classes: {
          "user-field": true,
        },
      } : {
        value: "-",
        edit: {
          target: {item:item, field:"location"},
          type: "select",
          list: item.list.viewer.lists.CharacterList.items("owned").filter(cha => item.type == cha.weaponType),
          valueProperty: "key",
          displayProperty: "name",
        },
      },
      dependencies: item => [
        {item:item.list.viewer.lists.CharacterList, field:"list"},
      ],
    });
    
    this.display.addField("passive", {
      label: "Passive",
      dynamic: true,
      html: true,
      value: item => item.getPassive(),
      dependencies: item => [
        {item, field:"syntonization"},
      ],
    });
    
    Weapon.setupDisplay(this.display);
  }
  
  clear()
  {
    super.clear();
    this.viewer.lists.CharacterList.list.forEach(character => character.weapon = null);
  }
  
  getFooterParams()
  {
    return {
      add: [
        {
          property: "key",
          options: Object.keys(WeaponData)
            .filter(key => !WeaponData[key].renamed && (!WeaponData[key].release || Date.parse(WeaponData[key].release) <= Date.now()))
            .map(key => ({value:key, label:WeaponData[key].name})),
        },
      ],
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
    data.fields.push({field:this.display.getField("syntonization"), params:[]});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['forgery']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['enemy']});
    data.fields.push({field:this.display.getField("location"), params:[]});
    data.fields.push({field:this.display.getField("deleteBtn"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
}
