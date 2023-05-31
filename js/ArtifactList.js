import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";

import { Renderer } from "./Renderer.js";
import UIList from "./UIList.js";
import Artifact from "./Artifact.js";

export default class ArtifactList extends UIList
{
  static name = "artifacts";
  static dontSerialize = UIList.dontSerialize.concat(["elements"]);
  static abundantSets = ["WanderersTroupe","GladiatorsFinale","Berserker","Gambler","TinyMiracle","Scholar","BraveHeart","DefendersWill"];
  static valuableSets = ["NoblesseOblige","EmblemOfSeveredFate","GildedDreams","ViridescentVenerer"];
  
  static minimumScore(artifact)
  {
    let base = 0.6;
    if(ArtifactList.abundantSets.indexOf(artifact.setKey) > -1)
      base += 0.1;
    if(ArtifactList.valuableSets.indexOf(artifact.setKey) > -1)
      base -= 0.1;
    if(artifact.slotKey == "flower" || artifact.slotKey == "plume")
      base -= 0.1;
    base -= 0.02 * Math.ceil((artifact.levelCap - artifact.level) / 4);
    return base;
  }
  
  subsetDefinitions = {
    'flower': item => item.slotKey == "flower",
    'plume': item => item.slotKey == "plume",
    'sands': item => item.slotKey == "sands",
    'goblet': item => item.slotKey == "goblet",
    'circlet': item => item.slotKey == "circlet",
  };
  elements = {};
  
  evaluate()
  {
    console.log(`Evaluating all artifacts...`);
    this.list.forEach(artifact => artifact.update("wanters", [], "replace"));
    this.list.forEach(artifact => artifact.update("valuable", 0));
    // Cycle through every character so we can access their artifact priority lists.
    this.viewer.lists.characters.list.forEach(character => {
      for(let buildId in character.getBuilds())
      {
        //let buildId = "default"; // TODO: Cycle through all builds once we have multiple.
        let related = character.getRelatedItems(buildId);
        // Handle each slot separately.
        for(let slot of ["flower","plume","sands","goblet","circlet"])
        {
          // Mark the 5 best artifacts we have.
          for(let i=0; i<5; i++)
            if(related.bestArtifacts[slot][i])
            {
              related.bestArtifacts[slot][i].update("valuable", related.bestArtifacts[slot][i].valuable + 1);
              related.bestArtifacts[slot][i].update("wanters", `#${i+1} for ${character.name}`, "push");
            }
          for(let setKey in related.buildData.artifactSets)
          {
            // Mark the 2 best artifacts we have for each desired set.
            let bestOfSet = related.bestArtifacts[slot].filter(artifact => artifact.setKey == setKey);
            for(let i=0; i<2; i++)
              if(bestOfSet[i])
              {
                bestOfSet[i].update("valuable", bestOfSet[i].valuable + 1);
                bestOfSet[i].update("wanters", `#${i+1} ${setKey} piece for ${character.name}`, "push");
              }
          }
        }
      }
    });
    console.log(`...Done.`);
  }
  
  setupDisplay()
  {
    let idField = this.display.addField("id", {
      label: "id",
      sort: {generic: {type:"number",property:"id"}},
      dynamic: false,
      value: item => item.id,
    });
    
    let setField = this.display.addField("set", {
      label: "Set",
      sort: {generic: {type:"string",property:"setName"}},
      dynamic: false,
      value: item => item.setName,
      classes: item => ({
        "material": true,
        "q1": item.rarity == 1,
        "q2": item.rarity == 2,
        "q3": item.rarity == 3,
        "q4": item.rarity == 4,
        "q5": item.rarity == 5,
      }),
    });
    
    let slotField = this.display.addField("slot", {
      label: "Slot",
      sort: {generic: {type:"string",property:"slotKey"}},
      dynamic: false,
      value: item => item.slotKey,
    });
    
    let levelField = this.display.addField("level", {
      label: "Lvl",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      value: item => item.level,
      edit: item => ({target: {item:item , field:"level"}}),
    });
    
    let lockField = this.display.addField("lock", {
      label: "L",
      sort: {generic: {type:"boolean",property:"lock"}},
      dynamic: true,
      title: item => "Is Locked?",
      classes: item => ({
        "insufficient": !item.valuable,
      }),
      edit: item => ({
        target: {item:item, field:"lock"},
        type: "checkbox",
        value: item.lock,
        trueClasses: ["fa-solid","fa-lock"],
        falseClasses: [],
      }),
      dependencies: item => [
        {item:item, field:"valuable"},
      ],
    });
    
    let mainStatField = this.display.addField("mainStat", {
      label: "Main",
      sort: {generic: {type:"string",property:"mainStatKey"}},
      dynamic: false,
      value: item => Artifact.shorthandStat[item.mainStatKey] ?? item.mainStatKey,
    });
    
    let substatValueGroup = {label:"Substat Values"};
    for(let statId of Artifact.substats)
    {
      let substatSumField = this.display.addField(statId+"Sum", {
        group: substatValueGroup,
        label: Artifact.shorthandStat[statId] ?? statId,
        sort: {func: (o,a,b) => o * (b.getSubstatSum(statId) - a.getSubstatSum(statId))},
        columnClasses: ['stat-'+statId],
        dynamic: true,
        value: item => { let result = item.getSubstatSum(statId); return result ? result : ""; },
        edit: item => ({
          func: item.setSubstat.bind(item, statId),
          type: "number",
          value: item.getSubstatSum(statId),
        }),
        dependencies: item => [
          {item:item, field:"substats"},
        ],
      });
    }
    
    let substatRatingGroup = {label:"Substat Ratings",title:"Weighs the current value of this substat against its maximum value, also factoring in the odds that it will increase if you continue to level up this artifact."};
    for(let statId of Artifact.substats)
    {
      let substatRatingField = this.display.addField(statId+"Rating", {
        group: substatRatingGroup,
        label: Artifact.shorthandStat[statId] ?? statId,
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
    
    /*let characterScoreField = this.display.addField("characterScore", {
      group: substatRatingGroup,
      label: "MAX",
      labelTitle: "Maximum total weighted piece score across all of your characters.",
      sort: {func: (o,a,b) => o * (b.getMaxCharacterScore().score - a.getMaxCharacterScore().score)},
      //columnClasses: ['stat-character-rating'],
      dynamic: true,
      title: item => "Best for "+ item.getMaxCharacterScore().character,
      value: item => Math.round(item.getMaxCharacterScore().score * 100) + "%",
      classes: item => ({
        "insufficient": item.getMaxCharacterScore().score < ArtifactList.minimumScore(item),
      }),
      dependencies: item => [
        {item:item, field:"level"},
        {item:item, field:"substats"},
      ],
    });*/
    
    let characterCountField = this.display.addField("characterCount", {
      group: substatRatingGroup,
      label: "#",
      labelTitle: "The number of characters that might desire this artifact.",
      sort: {generic: {type:"number",property:"valuable"}},
      columnClasses: ['artifact-wanters'],
      dynamic: true,
      title: item => item.wanters.join("\r\n"),
      value: item => item.valuable,
      dependencies: item => [
        {item:item, field:"valuable"},
        {item:item, field:"wanters"},
      ],
    });
    
    let locationField = this.display.addField("location", {
      label: "Equipped By",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.character?.name ?? "",
      edit: item => ({
        target: {item:item, field:"location"},
        type: "select",
        list: item.list.viewer.lists.characters.list.filter(cha => cha.constructor.name == "Character" || !cha.base),
        valueProperty: "key",
        displayProperty: "name",
      }),
      dependencies: item => [
        {item:item.list.viewer.lists.characters, field:"list"},
      ],
    });
    
    let deleteBtn = this.display.addField("deleteBtn", {
      label: "D",
      dynamic: true,
      dependencies: item => [
        {item:item, field:"lock"},
      ],
      title: item => (item.lock || item.location) ? "Unlock/unequip the artifact before deleting it." : "Delete this artifact from the list.",
      button: item => (item.lock || item.location) ? {icon: "fa-solid fa-trash-can"} : {
        icon: "fa-solid fa-trash-can",
        action: event => {
          event.stopPropagation();
          item.list.update("list", item, "remove");
          Renderer.removeItem(item);
          item.list.viewer.store();
        },
      },
    });
  }
  
  getUnique(item)
  {
    return `${item.setKey}${item.rarity}${item.slotKey}.${item.mainStatKey}.${item.id}`;
  }
  
  
  fromGOOD(goodData)
  {
    let result = super.fromGOOD(goodData);
    this.evaluate();
    return result;
  }
  
  createItem(goodData)
  {
    let item = new Artifact();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      container: window.viewer.elements[this.constructor.name],
    });
    this.forceNextRender = false;
    
    if(!this.elements.divAdd)
    {
      this.elements.divAdd = window.viewer.elements[this.constructor.name].appendChild(document.createElement("div"));
      this.elements.divAdd.classList.add("input-group", "mt-2");
      
      this.elements.selectSetAdd = this.elements.divAdd.appendChild(document.createElement("select"));
      this.elements.selectSetAdd.classList.add("form-select", "size-to-content");
      this.elements.selectSetAdd.appendChild(document.createElement("option"))
      for(let itm in GenshinArtifactData)
      {
        let option = this.elements.selectSetAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = GenshinArtifactData[itm].name;
      }
      
      this.elements.selectRarityAdd = this.elements.divAdd.appendChild(document.createElement("select"));
      this.elements.selectRarityAdd.classList.add("form-select", "size-to-content");
      this.elements.selectRarityAdd.appendChild(document.createElement("option"))
      for(let itm of [5,4,3,2,1])
      {
        let option = this.elements.selectRarityAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = itm;
      }
      
      this.elements.selectSlotAdd = this.elements.divAdd.appendChild(document.createElement("select"));
      this.elements.selectSlotAdd.classList.add("form-select", "size-to-content");
      this.elements.selectSlotAdd.appendChild(document.createElement("option"))
      for(let itm of ['flower','plume','sands','goblet','circlet'])
      {
        let option = this.elements.selectSlotAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = itm;
      }
      
      this.elements.selectStatAdd = this.elements.divAdd.appendChild(document.createElement("select"));
      this.elements.selectStatAdd.classList.add("form-select", "size-to-content");
      this.elements.selectStatAdd.appendChild(document.createElement("option"))
      for(let itm in Artifact.shorthandStat)
      {
        let option = this.elements.selectStatAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = Artifact.shorthandStat[itm];
      }
      
      this.elements.btnAdd = this.elements.divAdd.appendChild(document.createElement("button"));
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
          this.elements.selectSetAdd.value = "";
          this.elements.selectSlotAdd.value = "";
          this.elements.selectStatAdd.value = "";
          this.elements.selectRarityAdd.value = "";
          this.viewer.store();
          Renderer.renderNewItem(item);
        }
      });
    }
    
    if(!this.elements.btnEval)
    {
      this.elements.btnEval = this.viewer.elements[this.constructor.name].appendChild(document.createElement("button"));
      this.elements.btnEval.classList.add("btn", "btn-primary");
      this.elements.btnEval.innerHTML = "Evaluate Artifacts";
      this.elements.btnEval.addEventListener("click", event => {
        this.evaluate();
        this.render();
      });
    }
  }
}
