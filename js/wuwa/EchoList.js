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
  static templateName = "wuwa/renderEchoList";
  
  setupDisplay()
  {
    this.display.addField("icon", {
      label: "Echo",
      sort: {generic: {type:"string", property:"monster"}},
      dynamic: true,
      value: (item,size) => ({
        tag: "div",
        value: [
          {
            tag: "div",
            value: [
              {
                tag: "img",
                src: item.image,
                classes: {"item-image":true},
              },
              item.character ? {
                tag: "div",
                value: {
                  tag: "img",
                  src: item.character.icon,
                },
                title: `Equipped by ${item.character.name}`+(item.character.echoes[0] == item ? " in the main slot." : "."),
                classes: {"item-character":true, "item-character-special":item.character.echoes[0]==item},
              } : undefined,
              /*{
                tag: "div",
                value: [],
                classes: {"dropdown":true},
              },*/
              {
                tag: "div",
                value: {
                  edit: {
                    target: {item, field:"lock"},
                    type: "checkbox",
                    value: item.lock,
                    trueClasses: ["fa-solid","fa-lock"],
                    falseClasses: ["fa-solid","fa-lock-open"],
                  },
                },
                title: item.lock ? "Currently locked. Click to unlock." : "Currently unlocked. Click to lock.",
                classes: {"item-lock":true, "item-unlocked":!item.lock},
              },
              {
                tag: "div",
                value: item.cost,
                title: `Cost ${item.cost}`,
                classes: {"item-detail":true},
              },
            ],
            title: item.monster,
            classes: {"item-image-container":true, ["item-rarity-"+item.rarity]:true},
          },
          {
            tag: "div",
            value: [
              {
                tag: "img",
                src: item.bonusImage,
                title: item.set,
                classes: {"item-set":true},
              },
              {
                value: "+"+item.level,
                title: `Click to change echo level.`,
                classes: {"item-level":true},
                edit: {target:{item:item, field:"level"}},
              },
            ],
            classes: {"item-props":true},
          },
        ],
        classes: {"echo-icon":true},
      }),
      dependencies: (item,size) => [
        {item:item, field:"location"},
      ],
    });
    
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
    
    this.display.addField("primaryStat", {
      label: "Stat 1",
      sort: {generic: {type:"string", property:"primaryStat"}},
      dynamic: false,
      value: item => Stats[item.primaryStat]?.name??item.primaryStat,
    });
    
    this.display.addField("secondaryStat", {
      label: "Stat 2",
      sort: {generic: {type:"string", property:"secondaryStat"}},
      dynamic: false,
      value: item => Stats[item.secondaryStat]?.name??item.secondaryStat,
    });
    
    let substatGroup = {label:"Substats"};
    this.display.addField("substat", {
      group: substatGroup,
      label: (item,statKey) => parseInt(statKey)==statKey?`Substat ${statKey}`:Stats[statKey]?.abbr??Stats[statKey]?.name??statKey,
      dynamic: true,
      value: (item,statKey) => item.getSubstat(statKey),
      edit: (item,statKey) => ({
        func: value => {console.log(`saving`, {item, statKey, value}); return item.setSubstat(statKey, value);},
        type: "number",
      }),
      dependencies: item => [
        {item:item, field:"substats"},
      ],
    });
    
    this.display.addField("location", {
      label: "User",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => {
        let list = [];
        for(let character of item.list.viewer.lists.CharacterList.items("owned"))
        {
          list.push({value:character.key, display:character.name});
          list.push({value:character.key+":0", display:character.name+" (Skill)"});
        }
        return item.character ? {
          value: [
            {
              value: item.character.name + (item.character.echoes[0] == item ? " (Skill)" : ""),
              edit: {
                target: {item:item, field:"location"},
                type: "select",
                list: list,
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
            list: list,
          },
        };
      },
      dependencies: item => [
        {item:item.list.viewer.lists.CharacterList, field:"list"},
      ],
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
          options: [{value:2,label:"Rarity 2"},{value:3,label:"Rarity 3"},{value:4,label:"Rarity 4"},{value:5,label:"Rarity 5"}],
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
    if(true)
    {
      data.fields.push({field:this.display.getField("icon"), params:[]});
    }
    else
    {
      data.fields.push({field:this.display.getField("monster"), params:[]});
      data.fields.push({field:this.display.getField("set"), params:[]});
      data.fields.push({field:this.display.getField("rarity"), params:[]});
      data.fields.push({field:this.display.getField("lock"), params:[]});
    }
    data.fields.push({field:this.display.getField("primaryStat"), params:[]});
    data.fields.push({field:this.display.getField("secondaryStat"), params:[]});
    for(let statKey of EchoMetadata.subStats)
      data.fields.push({field:this.display.getField("substat"), params:[statKey]});
    data.fields.push({field:this.display.getField("location"), params:[]});
    data.fields.push({field:this.display.getField("delete"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
}
