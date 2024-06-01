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
    this.display.addField("favorite", {
      label: "F",
      sort: {generic: {type:"boolean",property:"favorite"}},
      dynamic: true,
      title: item => "Mark as Favorite",
      edit: item => ({
        target: {item, field:"favorite"},
        type: "checkbox",
        value: item.favorite,
        trueClasses: ["fa-solid","fa-circle-check"],
        falseClasses: [],
      }),
    });
    
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
    
    this.display.addField("ascension", {
      label: "Asc",
      sort: {generic: {type:"number", property:"ascension"}},
      dynamic: true,
      value: item => item.ascension,
      edit: item => ({target: {item, field:"ascension"}}),
    });
    
    this.display.addField("syntonization", {
      label: "Syn",
      sort: {generic: {type:"number", property:"syntonization"}},
      dynamic: true,
      value: item => item.syntonization,
      edit: item => ({target: {item, field:"syntonization"}}),
    });
    
    let ascMatGroup = {label:"Ascension Materials", startCollapsed:false};
    this.display.addField("ascensionMaterial", {
      group: ascMatGroup,
      label: (item, type, phase) => type.at(0).toUpperCase()+type.substr(1).toLowerCase(),
      columnClasses: ["ascension-materials"],
      dynamic: true,
      value: (item, type, phase) => type == "label" ? `${phase} ➤ ${parseInt(phase)+1}` : (item.getMat(type,phase) && item.getMatCost(type,phase) ? item.getMat(type,phase).getFieldValue(item.getMatCost(type,phase)) : ""),
      dependencies: (item, type, phase) => [
        {item:item, field:"ascension"},
        {item:item.viewer.lists.MaterialList.get("Shell Credit"), field:"count"},
      ].concat(type == "label" ?
        [
          {item:item.getMat('enemy',phase), field:"count"},
          {item:item.getMat('forgery',phase), field:"count"},
        ] : (item.getMat(type,phase)?.getCraftDependencies() ?? [])
      ),
      button: (item, type, phase) => {
        if(type == "label" && phase == item.ascension)
        {
          if(item.canUpPhase(false))
          {
            return {
              title: "Ascend the weapon. This will spend the resources for you and increase their level if necessary.",
              icon: "fa-solid fa-circle-up",
              action: item.upPhase.bind(item),
            };
          }
          else
          {
            return {
              title: "Not enough materials to ascend.",
              icon: "fa-solid fa-circle-up",
            };
          }
        }
      },
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
    
    this.display.addField("deleteBtn", {
      label: "D",
      dynamic: true,
      dependencies: item => [
        {item, field:"lock"},
        {item, field:"location"},
      ],
      title: item => (item.lock || item.location) ? "Unlock/unequip the weapon before deleting it." : "Delete this weapon from the list.",
      button: item => (item.lock || item.location) ? {icon: "fa-solid fa-trash-can"} : {
        icon: "fa-solid fa-trash-can",
        action: event => {
          event.stopPropagation();
          item.unlink();
          item.list.viewer.store();
        },
      },
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
            .filter(key => !WeaponData[key].release || Date.parse(WeaponData[key].release) <= Date.now())
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
    data.groups = this.display.getGroups({fields: data.fields.map(fieldTuple => fieldTuple.field)});
    return {element, data, options};
  }
}
