const {default:GenshinArtifactData} = await import(`./gamedata/GenshinArtifactData.js?v=${window.versionId}`);
const {default:GenshinArtifactStats} = await import(`./gamedata/GenshinArtifactStats.js?v=${window.versionId}`);

const { handlebars, Renderer } = await import(`../Renderer.js?v=${window.versionId}`);
const {default:GenshinList} = await import(`./GenshinList.js?v=${window.versionId}`);
const {default:Artifact} = await import(`./Artifact.js?v=${window.versionId}`);

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
            value: (item.substatRolls[item.substats[i].key]??[0]).map(roll => ({
              value: ".".repeat(roll+1),
              width: `calc(${(1/(item.substatRolls[item.substats[i].key]?.length??0)*(0.7+roll*0.1)*100)}% - 2px)`, // TODO: Doesn't work for rarity 1 and 2
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
    
    Artifact.setupDisplay(this.display);
    
    this.display.getField("lock").setData({
      title: (item,showUnlocked,showRed) => (item.lock ? "Currently locked. Click to unlock. " : "Currently unlocked. Click to lock. ") + (showRed ? "Red background indicates the artifact is below your minimum desirability rating, which theoretically means you should unlock it and use it as fodder in-game." : ""),
      classes: (item,showUnlocked,showRed) => ({
        'item-locked': item.lock,
        'item-unlocked': !item.lock,
        'undesirable': showRed && item.isFodder,
      }),
      dependencies: item => [
        {item:item, field:"wanters"},
      ],
    });
  }
  
  getFooterParams()
  {
    return {
      add: [
        {
          property: "setKey",
          options: Object.keys(GenshinArtifactData)
            .filter(key => !(!this.viewer.settings.preferences.showLeaks && Date.parse(GenshinArtifactData[key].release) > Date.now() || GenshinArtifactData[key].deletedContent))
            .map(key => ({value:key, label:GenshinArtifactData[key].name})),
        },
        {
          property: "rarity",
          options: [5,4,3,2,1],
        },
        {
          property: "slotKey",
          options: ['flower','plume','sands','goblet','circlet'],
          onChange: (elements, event) => {
            switch(elements.slotKey.value)
            {
              case "flower":
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = (statOpt.value != "hp"));
                elements.mainStatKey.value = "hp";
                break;
              case "plume":
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = (statOpt.value != "atk"));
                elements.mainStatKey.value = "atk";
                break;
              case "sands":
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas","enerRech_"].indexOf(statOpt.value) == -1));
                elements.mainStatKey.value = "";
                break;
              case "goblet":
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas"].indexOf(statOpt.value) == -1 && statOpt.value.substr(-5) != "_dmg_"));
                elements.mainStatKey.value = "";
                break;
              case "circlet":
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = (["hp_","atk_","def_","eleMas","critRate_","critDMG_","heal_"].indexOf(statOpt.value) == -1));
                elements.mainStatKey.value = "";
                break;
              default:
                Array.from(elements.mainStatKey.options).forEach(statOpt => statOpt.disabled = false);
            }
          },
        },
        {
          property: "mainStatKey",
          options: Object.keys(Artifact.shorthandStat)
            .map(itm => ({value:itm, label:Artifact.getStatShorthand(itm)})),
        },
        //id: this.list.reduce((c,i) => Math.max(c,i.id), 0)+1,
      ],
    };
  }
  
  async render(force=false)
  {
    const {render, footer, updateFooter, ul} = await super.render(force);
    
    if(updateFooter)
    {
      // Evaluate Artifacts
      let li = ul.appendChild(document.createElement("li"));
      li.classList.add("nav-item", "me-2");
      
      let evalBtn = li.appendChild(document.createElement("button"));
      evalBtn.id = "artifactEvaluateBtn";
      evalBtn.classList.add("btn", "btn-primary", "show-notice", "mt-2");
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
      {field:this.display.getField("lock"), params:[0, 1]},
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
