const {default:EchoData} = await window.importer.get(`js/wuwa/gamedata/EchoData.js`);
const {default:EchoSetData} = await window.importer.get(`js/wuwa/gamedata/EchoSetData.js`);
const {default:EchoMetadata} = await window.importer.get(`js/wuwa/gamedata/EchoMetadata.js`);
const {default:Stats} = await window.importer.get(`js/wuwa/gamedata/Stats.js`);

const { Renderer } = await window.importer.get(`js/Renderer.js`);
const {default:WuWaList} = await window.importer.get(`js/wuwa/WuWaList.js`);
const {default:Echo} = await window.importer.get(`js/wuwa/Echo.js`);

export default class EchoList extends WuWaList
{
  static itemClass = Echo;
  //static subsetDefinitions = {};
  static templateName = "wuwa/renderEchoList";
  static templatePartials = ["wuwa/renderEcho","wuwa/renderEchoIcon"];
  
  setupDisplay()
  {
    this.display.addField("icon", {
      label: "Echo",
      sort: {generic: {type:"string", property:"monster"}},
      dynamic: true,
      template: "wuwa/renderEchoIcon",
      dependencies: (item,size) => [
        {item:item, field:"location"},
      ],
    });
    
    this.display.addField("level", {
      label: "Lvl",
      labelTitle: "Sort by level.",
      sort: {generic: {type:"number", property:"level"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.level,
      edit: item => ({target: {item, field:"level"}}),
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
    
    this.display.addField("substat", {
      group: {label:"Substats"},
      label: (item,statKey) => parseInt(statKey)==statKey?`Substat ${statKey}`:Stats[statKey]?.abbr??Stats[statKey]?.name??statKey,
      dynamic: true,
      value: (item,statKey,labeled) => {
        if(parseInt(statKey) == statKey)
        {
          let substat = item.substats[statKey];
          if(substat)
            return labeled ? {classes:{'labeled-substat':true}, value:[{value:Stats[substat.key]?.abbr??substat.key}, {value:substat.value}]} : substat.value;
          else
            return "-";
        }
        else
          return labeled ? {classes:{'labeled-substat':true}, value:[{value:Stats[statKey]?.abbr??statKey}, {value:item.getSubstat(statKey)}]} : item.getSubstat(statKey);
      },
      edit: (item,statKey) => {
        if(parseInt(statKey) == statKey)
        {
          let substat = item.substats[statKey];
          if(substat)
            return {
              func: value => item.setSubstat(substat.key, value),
              type: "number",
              value: item.getSubstat(substat.key),
            };
          else
            return {
              func: value => item.setSubstat(value, 1),
              type: "select",
              list: EchoMetadata.subStats.map(sKey => ({value:sKey, display:Stats[sKey]?.abbr??substat.key})),
            };
        }
        else
        {
          return {
            func: value => item.setSubstat(statKey, value),
            type: "number",
            value: item.getSubstat(statKey),
          };
        }
      },
      dependencies: item => [
        {item:item, field:"substats"},
      ],
    });
    
    this.display.addField("location", {
      label: "User",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.character ? {
        value: [
          {
            value: item.character.name + (item.location.endsWith(":0")?" (Main)":""),
            edit: {
              target: {item:item, field:"location"},
              type: "select",
              list: [].concat(...item.characterList.items("owned").filter(cha => item.canEquip(cha)).map(cha => [{value:`${cha.key}`, display:`${cha.name}`}, {value:`${cha.key}:0`, display:`${cha.name} (Main)`}])),
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
          list: [].concat(...item.characterList.items("owned").filter(cha => item.canEquip(cha)).map(cha => [{value:cha.key, display:cha.name}, {value:`${cha.key}:0`, display:`${cha.name} (Main)`}])),
        },
      },
      dependencies: item => [
        {item:item.characterList, field:"list"},
      ],
    });
    
    Echo.setupDisplay(this.display);
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
    data.fields.push({field:this.display.getField("deleteBtn"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
}
