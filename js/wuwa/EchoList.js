import EchoData from "./gamedata/EchoData.js";
import EchoSetData from "./gamedata/EchoSetData.js";
import EchoMetadata from "./gamedata/EchoMetadata.js";
import Stats from "./gamedata/Stats.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaList from "./WuWaList.js";
import Echo from "./Echo.js";

export default class EchoList extends WuWaList
{
  static itemClass = Echo;
  static subsetDefinitions = {
  };
  
  setupDisplay()
  {
    this.display.addField("monster", {
      label: "Monster",
      sort: {generic: {type:"string", property:"monster"}},
      dynamic: false,
      value: item => item.monster,
    });
    
    this.display.addField("set", {
      label: "Set Bonus",
      sort: {generic: {type:"string", property:"set"}},
      dynamic: false,
      value: item => item.set,
    });
    
    this.display.addField("rarity", {
      label: "R",
      sort: {generic: {type:"string", property:"rarity"}},
      dynamic: false,
      value: item => item.rarity,
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
              list: item.list.viewer.lists.CharacterList.items("owned"),
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
          list: item.list.viewer.lists.CharacterList.items("owned"),
          valueProperty: "key",
          displayProperty: "name",
        },
      },
      dependencies: item => [
        {item:item.list.viewer.lists.CharacterList, field:"list"},
      ],
    });
    
    this.display.addField("delete", {
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
  }
  
  getFooterParams()
  {
    return {
      add: [
        {
          property: "monsterKey",
          options: Object.keys(EchoData)
            .filter(key => !EchoData[key].release || Date.parse(EchoData[key].release) <= Date.now())
            .map(key => ({value:key, label:EchoData[key].monster})),
        },
        {
          property: "setKey",
          options: Object.keys(EchoSetData)
            .filter(key => !EchoSetData[key].release || Date.parse(EchoSetData[key].release) <= Date.now())
            .map(key => ({value:key, label:EchoSetData[key].name})),
        },
        {
          property: "rarity",
          options: [2,3,4,5],
        },
        {
          property: "primaryStat",
          options: EchoMetadata.primaryStats.map(key => ({value:key, label:Stats[key].name})),
        },
        {
          property: "secondaryStat",
          options: EchoMetadata.secondaryStats.map(key => ({value:key, label:Stats[key].name})),
        },
      ],
    };
  }
  
  clear()
  {
    super.clear();
    this.viewer.lists.CharacterList.list.forEach(character => {
      character.skillEcho = null;
      character.echoes = [];
    });
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [];
    data.fields.push({field:this.display.getField("monster"), params:[]});
    data.fields.push({field:this.display.getField("set"), params:[]});
    data.fields.push({field:this.display.getField("rarity"), params:[]});
    data.fields.push({field:this.display.getField("lock"), params:[]});
    data.fields.push({field:this.display.getField("location"), params:[]});
    data.fields.push({field:this.display.getField("delete"), params:[]});
    data.groups = this.display.getGroups({fields: data.fields.map(fieldTuple => fieldTuple.field)});
    return {element, data, options};
  }
}
