import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinArtifactStats from "./gamedata/GenshinArtifactStats.js";

import { handlebars, Renderer } from "../Renderer.js";
import GenshinList from "./GenshinList.js";
import Artifact from "./Artifact.js";

handlebars.registerHelper('iffave', function(character, setKey, build, options) {
  if(!options)
  {
    options = build;
    build = undefined;
  }
  if(character.getArtifactSetPrio(setKey, build))
    return options.fn(this);
  else
    return options.inverse(this);
});

handlebars.registerHelper("artifactStat", (key, character, context) => {
  if(key == "elemental_dmg_" && character instanceof Character)
    return Artifact.getStatShorthand(character.element.toLowerCase()+'_dmg_');
  else
    return Artifact.getStatShorthand(key);
});

handlebars.registerHelper("artifactRating", (artifact, statKey, character, context) => {
  if(context)
  {
    let scores = artifact.getCharacterScoreParts(character);
    return scores.subScores[statKey]?.toFixed(2) ?? "0.00";
  }
  else if(statKey instanceof Character)
    return artifact.getCharacterScore(statKey).toFixed(2);
  else
    return artifact.getSubstatRating(statKey).sum.toFixed(2);
});

handlebars.registerHelper("getArtifactSetData", (set, context) => GenshinArtifactData[set]);

export default class ArtifactList extends GenshinList
{
  static dontSerialize = super.dontSerialize.concat(["elements"]);
  static itemClass = Artifact;
  static subsetDefinitions = {
    'flower': item => item.slotKey == "flower",
    'plume': item => item.slotKey == "plume",
    'sands': item => item.slotKey == "sands",
    'goblet': item => item.slotKey == "goblet",
    'circlet': item => item.slotKey == "circlet",
  };
  
  elements = {};
  setWanterFactor = {};
  
  async evaluate()
  {
    this.update("setWanterFactor", {}, "replace");
    this.list.forEach(artifact => artifact.update("wanters", [], "replace"));
    // Cycle through every character so we can access their artifact priority lists.
    for(let character of this.viewer.lists.CharacterList.items("listable"))
    {
      // Cycle through all their builds.
      for(let buildId in character.getBuilds())
      {
        let related = await character.getRelatedItems({buildId,ignoreTargets:true});
        // Handle each slot separately.
        for(let slot of ["flower","plume","sands","goblet","circlet"])
        {
          // Mark the best artifacts we have.
          let startDevaluing = false;
          for(let i=0; i<related.bestArtifacts[slot].length; i++)
          {
            if(related.bestArtifacts[slot][i])
            {
              let score = related.bestArtifacts[slot][i].getCharacterScore(character, parseInt(this.viewer.settings.preferences.artifactMaxLevel ?? 20), buildId, {useTargets:false});
              let scaledScore = score * Math.max(0,1-i*0.05) * related.buildData.importance/100;
              related.bestArtifacts[slot][i].update("wanters", {rank:i+1, character, buildId, score, scaledScore}, "push");
            }
          }
          for(let setKey in related.buildData.artifactSets)
          {
            let rarityFactor = 1 + (5 - (GenshinArtifactData[setKey].maxRarity ?? 5)) * 0.15;
            // Mark the best artifacts we have for each desired set.
            let bestOfSet = related.bestArtifacts[slot].filter(artifact => artifact.setKey == setKey);
            for(let i=0; i<bestOfSet.length; i++)
            {
              if(bestOfSet[i])
              {
                let score = bestOfSet[i].getCharacterScore(character, parseInt(this.viewer.settings.preferences.artifactMaxLevel ?? 20), buildId, {useTargets:false});
                let scaledScore = score * Math.max(0,1-i*0.04) * rarityFactor * related.buildData.importance/100;
                bestOfSet[i].update("wanters", {rank:i+1, character, buildId, score, scaledScore, onSet:true}, "push");
              }
            }
          }
        }
        for(let setKey in related.buildData.artifactSets)
          this.setWanterFactor[setKey] = (this.setWanterFactor[setKey] ?? 0) + related.buildData.importance/100;
      }
    }
    this.update("setWanterFactor", {}, "notify");
    this.list.forEach(artifact => artifact.wanters.sort((a,b) => b.scaledScore-a.scaledScore));
    document.querySelector("#artifactEvaluateBtn")?.classList.remove("show-notice");
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "list" && value.length != field.value.length || field.string == "evaluate")
      document.querySelector("#artifactEvaluateBtn")?.classList.add("show-notice");
  }
  
  setupDisplay()
  {
    let idField = this.display.addField("id", {
      label: "#",
      labelTitle: "Sort in the same order as the in-game inventory when you select 'quality'.",
      sort: {func: (o,a,b) => {
        let slotSortR = ["circlet","goblet","sands","plume","flower"];
        let A = a.rarity*52500 + a.level*2500 + Object.keys(GenshinArtifactData).indexOf(a.setKey)*25 + slotSortR.indexOf(a.slotKey)*5 + a.substats.length - a.id/2000;
        let B = b.rarity*52500 + b.level*2500 + Object.keys(GenshinArtifactData).indexOf(b.setKey)*25 + slotSortR.indexOf(b.slotKey)*5 + b.substats.length - b.id/2000;
        if(isNaN(A) && !isNaN(B))
          return 1;
        else if(!isNaN(A) && isNaN(B))
          return -1;
        else if(isNaN(A) && isNaN(B))
          return 0;
        else
          return o*(B-A);
      }},
      dynamic: true,
      value: item => item.id,
    });
    
    let setField = this.display.addField("set", {
      label: "Set",
      sort: {generic: {type:"string",property:"setName"}},
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
        title: item.setName,
      } : item.setName,
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
      popup: item => item,
    });
    
    let slotField = this.display.addField("slot", {
      label: "Slot",
      sort: {func: (o,a,b) => {
        let slotSortR = ["circlet","goblet","sands","plume","flower"];
        let A = slotSortR.indexOf(a.slotKey);
        let B = slotSortR.indexOf(b.slotKey);
        if(isNaN(A) && !isNaN(B))
          return 1;
        else if(!isNaN(A) && isNaN(B))
          return -1;
        else if(isNaN(A) && isNaN(B))
          return 0;
        else
          return o*(B-A);
      }},
      dynamic: false,
      title: item => item.slotKey,
      value: item => ({
        tag: "img",
        classes: {'slot-icon':true},
        src: `img/${item.slotKey}.webp`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let levelField = this.display.addField("level", {
      label: "Lvl",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      value: item => "+"+item.level,
      edit: item => ({target: {item:item , field:"level"}, min:0, max:20}),
    });
    
    let mainStatField = this.display.addField("mainStat", {
      label: "Main",
      sort: {generic: {type:"string",property:"mainStatKey"}},
      dynamic: false,
      value: item => Artifact.getStatShorthand(item.mainStatKey),
    });
    
    let substatValueGroup = {label:"Substat Values"};
    for(let statId of Artifact.substats)
    {
      let substatSumField = this.display.addField(statId+"Sum", {
        group: substatValueGroup,
        //label: Artifact.getStatShorthand(statId),
        label: `<img class="icon-inline" src="img/stat.${statId}.svg"/>`,
        sort: {func: (o,a,b) => o * (b.getSubstatSum(statId) - a.getSubstatSum(statId))},
        columnClasses: ['stat-'+statId],
        dynamic: true,
        value: item => { let result = item.getSubstatSum(statId); return result ? result.toFixed(["eleMas","hp","atk","def"].indexOf(statId)>-1?0:1) : ""; },
        edit: item => ({
          func: item.setSubstat.bind(item, statId),
          type: "number",
          value: item.getSubstatSum(statId),
          min:0,
          max:9999,
        }),
        dependencies: item => [
          {item:item, field:"substats"},
        ],
      });
    }
    
    let substatRatingGroup = {label:"Substat Ratings",title:"Weighs the current value of this substat against its maximum value, also factoring in the odds that it will increase if you continue to level up this artifact."};
    for(let statId of Artifact.substats)
    {
      let substatRatingFields = this.display.addField(statId+"Rating", {
        group: substatRatingGroup,
        tags: ["detailsOnly"],
        label: Artifact.getStatShorthand(statId),
        sort: {func: (o,a,b) => o * (b.getSubstatRating(statId).sum - a.getSubstatRating(statId).sum)},
        columnClasses: ['stat-rating-'+statId],
        dynamic: true,
        title: item => {
          let rating = item.getSubstatRating(statId);
          return `${rating.base.toFixed(2)} (base) + ${rating.chance.toFixed(2)} (chance)`;
        },
        value: item => item.getSubstatRating(statId).sum.toFixed(2),
        dependencies: item => [
          {item:item, field:"level"},
          {item:item, field:"substats"},
        ],
      });
    }
    
    let characterCountField = this.display.addField("characterCount", {
      label: "$",
      labelTitle: "Desireability rating of this artifact based on your build preferences across all of your characters. The number itself is somewhat arbitrary, but the ranking should be significant. Choose a rating where you think all artifacts are worth keeping, set it in the preferences above, and then you can easily see which artifacts are recommended for use as strongbox/exp fodder.",
      sort: {func: (o,a,b) => {
        let A = a.wanters.reduce((result, wanter, idx) => result+Math.pow(wanter.scaledScore, 1+idx), 0);
        let B = b.wanters.reduce((result, wanter, idx) => result+Math.pow(wanter.scaledScore, 1+idx), 0);
        if(isNaN(A) && !isNaN(B))
          return 1;
        else if(!isNaN(A) && isNaN(B))
          return -1;
        else if(isNaN(A) && isNaN(B))
          return 0;
        else
          return o*(B-A);
      }},
      columnClasses: ['artifact-wanters'],
      dynamic: true,
      title: item => {
        return item.wanters.map((wanter,idx) => wanter.scaledScore>0.01?`#${wanter.rank} ${wanter.onSet?item.setKey:""} ${item.slotKey} for ${wanter.character.name} (${wanter.buildId}); score:${(wanter.score*100).toFixed(1)}%, scaled:${wanter.scaledScore.toFixed(2)}, contribution:${Math.pow(wanter.scaledScore, 1+idx).toFixed(2)}`:null).filter(w=>w).join("\r\n");
      },
      value: item => item.wanters.reduce((result, wanter, idx) => result+Math.pow(wanter.scaledScore, 1+idx), 0).toFixed(2),
      dependencies: item => [
        {item:item, field:"wanters"},
      ],
    });
    
    let locationField = this.display.addField("location", {
      label: "User",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.character ? {
        value: [
          {
            value: item.viewer.settings.preferences.listDisplay=='1' ? {
              tag: "img",
              classes: {'character-icon':true},
              src: item.character.image,
            } : item.character.name,
            classes: {
              "icon": item.viewer.settings.preferences.listDisplay=='1',
            },
            edit: {
              target: {item:item, field:"location"},
              type: "select",
              list: item.list.viewer.lists.CharacterList.items("equippable"),
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
          list: item.list.viewer.lists.CharacterList.items("equippable"),
          valueProperty: "key",
          displayProperty: "name",
        },
      },
      dependencies: item => [
        {item:item.list.viewer.lists.CharacterList, field:"list"},
      ],
    });
    
    let characterIconField = this.display.addField("characterIcon", {
      label: "User",
      tags: ["detailsOnly"],
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      title: item => item.character?.name??"",
      value: item => item.character ? {
        tag: "img",
        src: item.character.image ?? "",
      } : "",
      dependencies: item => [
        {item, field:"location"},
      ],
    });
    
    let characterScoreField = this.display.addField("characterScore", {
      label: "Score",
      tags: ["detailsOnly"],
      dynamic: true,
      value: (artifact,character,buildId) => {
        let score = artifact.getCharacterScore(character,undefined,buildId);
        return {
          icon: score>0.6 ? "fa-solid fa-face-smile" : score>0.3 ? "fa-solid fa-face-meh" : "fa-solid fa-face-frown",
          color: `rgba(${score<0.5?255:255*(2-score*2)}, ${score>0.5?255:255*score*2}, 0, 0.9)`,
        };
      },
      title: (artifact,character,buildId) => `${Math.round(artifact.getCharacterScore(character,undefined,buildId)*100).toFixed(1)}% of the BiS piece for ${character.name} (${buildId??character.selectedBuild}).`,
      dependencies: (artifact,character,buildId) => [
        {item:artifact, field:"level"},
        {item:artifact, field:"substats"},
      ],
    });
    
    let characterSubstatRatingField = this.display.addField("characterSubstatRating", {
      label: "Substat Rating",
      tags: ["detailsOnly"],
      dynamic: true,
      value: (artifact,character,substat) => {
        let scores = artifact.getCharacterScoreParts(character);
        if(!scores.subScores)
        {
          console.error(`Unknown error getting characterSubstatRating:`, scores, artifact, character, substat);
          return "???";
        }
        return scores.subScores[substat]?.toFixed(2) ?? "0.00";
      },
      title: (artifact,character,substat) => `How much rating ${Artifact.getStatShorthand(substat)} is contributing to this artifact's score for ${character.name}.`,
      dependencies: (artifact,character,substat) => [
        {item:artifact, field:"level"},
        {item:artifact, field:"substats"},
      ],
    });
    
    let imageField = this.display.addField("image", {
      label: "Image",
      tags: ["detailsOnly"],
      dynamic: false,
      value: item => ({
        tag: "img",
        src: item.image,
      }),
    });
    
    let mainStatDisplayField = this.display.addField("mainStatDisplay", {
      label: "Main Stat",
      tags: ["detailsOnly"],
      dynamic: true,
      value: item => [
          {
            tag: "img",
            src: item.mainStatKey.endsWith("_dmg_") ? `img/Element_${item.mainStatKey.at(0).toUpperCase()+item.mainStatKey.slice(1,-5)}.svg` : `img/stat.${item.mainStatKey}.svg`,
            classes: {
              "light-highlight": !(item.mainStatKey.endsWith("_dmg_") && item.mainStatKey != "physical_dmg_"),
              "dark-highlight": item.mainStatKey.endsWith("_dmg_") && item.mainStatKey != "physical_dmg_",
            },
          },
          {
            value: ["eleMas","hp","atk","def"].indexOf(item.mainStatKey)>-1 ? item.getSubstatSum(item.mainStatKey).toFixed(0) : item.getSubstatSum(item.mainStatKey).toFixed(1) + "%",
          },
        ],
      dependencies: artifact => [
        {item:artifact, field:"level"},
      ],
    });
    
    let substatField = this.display.addField("substat", {
      label: "Substat",
      tags: ["detailsOnly"],
      dynamic: true,
      title: (item,i) => !item.substats[i]
                          ? `Click to add new substat.`
                          : `${item.getSubstatSum(item.substats[i].key).toFixed(2)} ${Artifact.getStatShorthand(item.substats[i].key)}, rolled ${item.substatRolls[item.substats[i].key]?.length} times (${item.substatRolls[item.substats[i].key]?.map(r=>(0.7+r*0.1)*100).join('%, ')}%)`, // TODO: Doesn't work for rarity 1 and 2
      value: (item,i) => item.substats[i] ? [
          {
            tag: "div",
            value: item.substatRolls[item.substats[i].key].map(roll => ({
              value: ".".repeat(roll+1),
              width: `calc(${(1/item.substatRolls[item.substats[i].key].length*(0.7+roll*0.1)*100)}% - 2px)`, // TODO: Doesn't work for rarity 1 and 2
            })),
            classes: {
              "rolls-display": true,
            }
          },
          {
            tag: "img",
            src: `img/stat.${item.substats[i].key}.svg`,
          },
          {
            value: ["eleMas","hp","atk","def"].indexOf(item.substats[i].key)>-1 ? item.getSubstatSum(item.substats[i].key).toFixed(0) : item.getSubstatSum(item.substats[i].key).toFixed(1) + "%",
          },
        ] : "-",
      edit: (item,i) => item.substats[i] ? {
        func: item.setSubstat.bind(item, item.substats[i].key),
        type: "number",
        value: item.getSubstatSum(item.substats[i].key).toFixed(["eleMas","hp","atk","def"].indexOf(item.substats[i].key)>-1?0:1),
        min:0,
        max:9999,
      } : {
        func: statId => {
          item.setSubstat(statId, GenshinArtifactStats[item.rarity].substats[statId][0]);
          let characterElement = item.viewer.elements.popup.querySelector(".list-item");
          let character = Renderer.controllers.get(characterElement.dataset.uuid);
          if(character)
          {
            let buildElement = characterElement.querySelector(".character-build");
            let buildId = buildElement.attributes.getNamedItem('name')?.value;
            let artifactElement = buildElement.querySelector(`.list-item[data-uuid="${item.uuid}"]`);
            Renderer.rerender(artifactElement, {item, buildId, character}, {renderedItem:character});
          }
        },
        type: "select",
        list: Artifact.substats.filter(statId => statId != item.mainStatKey && item.substats.map(s => s.key).indexOf(statId) == -1),
        displayProperty: statId => Artifact.getStatShorthand(statId),
      },
      dependencies: artifact => [
        {item:artifact, field:"substats"},
        {item:artifact, field:"level"},
      ],
    });
    
    // TODO: lock was special, but using the UIItem version of it stops that
    Artifact.setupDisplay(this.display);
  }
  
  clear()
  {
    super.clear();
    this.viewer.lists.CharacterList.list.forEach(character => {
      character.flowerArtifact = null;
      character.plumeArtifact = null;
      character.sandsArtifact = null;
      character.gobletArtifact = null;
      character.circletArtifact = null;
    });
  }
  
  async render(force=false)
  {
    await super.render(force);
    
    let footer = document.getElementById("footer");
    footer.classList.remove("d-none");
    if(footer.dataset.list != this.uuid)
    {
      footer.replaceChildren();
      footer.dataset.list = this.uuid;
      
      let container = footer.appendChild(document.createElement("div"));
      container.classList.add("container-fluid", "navbar-expand");
      
      let ul = container.appendChild(document.createElement("ul"));
      ul.classList.add("navbar-nav");
      
      // Add Artifact
      let li1 = ul.appendChild(document.createElement("li"));
      li1.classList.add("nav-item", "me-2");
      
      let inputGroup = li1.appendChild(document.createElement("div"));
      inputGroup.classList.add("input-group");
      
      this.elements.selectSetAdd = inputGroup.appendChild(document.createElement("select"));
      this.elements.selectSetAdd.classList.add("form-select", "size-to-content");
      this.elements.selectSetAdd.title = "Artifact Set";
      this.elements.selectSetAdd.appendChild(document.createElement("option"))
      for(let itm in GenshinArtifactData)
      {
        if(!this.viewer.settings.preferences.showLeaks && Date.parse(GenshinArtifactData[itm].release) > Date.now() || GenshinArtifactData[itm].deletedContent)
          continue;
        let option = this.elements.selectSetAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = GenshinArtifactData[itm].name;
      }
      
      this.elements.selectRarityAdd = inputGroup.appendChild(document.createElement("select"));
      this.elements.selectRarityAdd.classList.add("form-select", "size-to-content");
      this.elements.selectRarityAdd.title = "Artifact Rarity";
      this.elements.selectRarityAdd.appendChild(document.createElement("option"))
      for(let itm of [5,4,3,2,1])
      {
        let option = this.elements.selectRarityAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = itm;
      }
      
      this.elements.selectSlotAdd = inputGroup.appendChild(document.createElement("select"));
      this.elements.selectSlotAdd.classList.add("form-select", "size-to-content");
      this.elements.selectSlotAdd.title = "Artifact Slot";
      this.elements.selectSlotAdd.appendChild(document.createElement("option"))
      for(let itm of ['flower','plume','sands','goblet','circlet'])
      {
        let option = this.elements.selectSlotAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = itm;
      }
      this.elements.selectSlotAdd.onchange = event => {
        switch(this.elements.selectSlotAdd.value)
        {
          case "flower":
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = (statOpt.value != "hp"));
            this.elements.selectStatAdd.value = "hp";
            break;
          case "plume":
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = (statOpt.value != "atk"));
            this.elements.selectStatAdd.value = "atk";
            break;
          case "sands":
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas","enerRech_"].indexOf(statOpt.value) == -1));
            this.elements.selectStatAdd.value = "";
            break;
          case "goblet":
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas"].indexOf(statOpt.value) == -1 && statOpt.value.substr(-5) != "_dmg_"));
            this.elements.selectStatAdd.value = "";
            break;
          case "circlet":
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas","critRate_","critDMG_","heal_"].indexOf(statOpt.value) == -1));
            this.elements.selectStatAdd.value = "";
            break;
          default:
            Array.from(this.elements.selectStatAdd.options).forEach(statOpt => statOpt.disabled = false);
        }
      };
      
      this.elements.selectStatAdd = inputGroup.appendChild(document.createElement("select"));
      this.elements.selectStatAdd.classList.add("form-select", "size-to-content");
      this.elements.selectStatAdd.title = "Artifact Main Stat";
      this.elements.selectStatAdd.appendChild(document.createElement("option"))
      for(let itm in Artifact.shorthandStat)
      {
        let option = this.elements.selectStatAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = Artifact.getStatShorthand(itm);
      }
      
      this.elements.btnAdd = inputGroup.appendChild(document.createElement("button"));
      this.elements.btnAdd.innerHTML = "Add Artifact";
      this.elements.btnAdd.classList.add("btn", "btn-primary");
      this.elements.btnAdd.addEventListener("click", event => {
        if(this.elements.selectSetAdd.value && this.elements.selectSlotAdd.value && this.elements.selectStatAdd.value && this.elements.selectRarityAdd.value)
        {
          let item = this.addGOOD({
            id: this.list.reduce((c,i) => Math.max(c,i.id), 0)+1,
            setKey: this.elements.selectSetAdd.value,
            slotKey: this.elements.selectSlotAdd.value,
            mainStatKey: this.elements.selectStatAdd.value,
            rarity: this.elements.selectRarityAdd.value,
            level: 0,
            location: "",
            substats: [],
            lock: false,
          });
          this.elements.selectSlotAdd.value = "";
          this.elements.selectStatAdd.value = "";
        }
      });
      
      // Evaluate Artifacts
      let li2 = ul.appendChild(document.createElement("li"));
      li2.classList.add("nav-item", "me-2");
      
      let evalBtn = li2.appendChild(document.createElement("button"));
      evalBtn.id = "artifactEvaluateBtn";
      evalBtn.classList.add("btn", "btn-primary", "show-notice");
      evalBtn.title = "Recalculate the characters that might desire each artifact.";
      let evalIcon = evalBtn.appendChild(document.createElement("i"));
      evalIcon.classList.add("fa-solid", "fa-arrows-rotate");
      let evalNotice = evalBtn.appendChild(document.createElement("i"));
      evalNotice.classList.add("fa-solid", "fa-circle-exclamation", "notice");
      
      evalBtn.addEventListener("click", event => {
        evalIcon.classList.add("fa-spin");
        // Have to explicitly wait or else the interface will never register that fa-spin was added.
        setTimeout(() => {
          this.evaluate().then(result => evalIcon.classList.remove("fa-spin"));
        }, 1);
      });
      setTimeout(() => evalBtn.dispatchEvent(new Event("click")), 1);
    }
  }

  prepareRender(element, data, options)
  {
    data.fields = [
      {field:this.display.getField("id"), params:[]},
      {field:this.display.getField("set"), params:[]},
      {field:this.display.getField("slot"), params:[]},
      {field:this.display.getField("level"), params:[]},
      {field:this.display.getField("lock"), params:[]},
      {field:this.display.getField("mainStat"), params:[]},
      {field:this.display.getField("critRate_Sum"), params:[]},
      {field:this.display.getField("critDMG_Sum"), params:[]},
      {field:this.display.getField("atk_Sum"), params:[]},
      {field:this.display.getField("enerRech_Sum"), params:[]},
      {field:this.display.getField("eleMasSum"), params:[]},
      {field:this.display.getField("hp_Sum"), params:[]},
      {field:this.display.getField("def_Sum"), params:[]},
      {field:this.display.getField("atkSum"), params:[]},
      {field:this.display.getField("hpSum"), params:[]},
      {field:this.display.getField("defSum"), params:[]},
      {field:this.display.getField("characterCount"), params:[]},
      {field:this.display.getField("location"), params:[]},
      {field:this.display.getField("deleteBtn"), params:[]},
    ];
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
}
