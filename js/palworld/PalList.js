import PalsData from "./gamedata/PalworldPals.js";
import PalworldPassives from "./gamedata/PalworldPassives.js";

import { Renderer } from "../Renderer.js";
import PalworldList from "./PalworldList.js";
import Pal from "./Pal.js";

export default class PalList extends PalworldList
{
  static unique = false;
  static itemClass = Pal;
  static templateName = "palworld/renderPalListPopup";
  static templatePartials = ["palworld/renderParentList"];
  
  passiveFilter = [];
  
  setupDisplay()
  {
    // For List
    this.display.addField("passiveFilter", {
      label: "Filter Passives",
      dynamic: true,
      edit: item => ({
        target: {item, field:"passiveFilter"},
        type: "select-multiple",
        list: Object.keys(PalworldPassives).map(key => ({value:key, innerHTML:PalworldPassives[key].name})).toSorted((a,b) => a.innerHTML.localeCompare(b.innerHTML)),
        valueProperty: "value",
        displayProperty: "innerHTML",
      }),
    });
    
    // For Items
    this.display.addField("type", {
      label: "Type",
      sort: {generic: {type:"string",property:"number"}},
      dynamic: false,
      value: item => `#${item.number} ${item.type}`,
      popup: item => item,
    });
    
    this.display.addField("breedPower", {
      label: "BP",
      sort: {generic: {type:"number",property:"breedPower"}},
      dynamic: false,
      value: item => item.breedPower,
    });
    
    this.display.addField("sex", {
      label: "Sex",
      sort: {generic: {type:"string",property:"sex"}},
      dynamic: true,
      value: item => item.sex,
      edit: item => ({
        target: {item, field:"sex"},
        type: "select",
        list: ["M","F"],
      }),
    });
    
    this.display.addField("location", {
      label: "Where",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.location,
      edit: item => ({
        target: {item, field:"location"},
        type: "select",
        list: ["Base 1","Base 2","Base 3"],
      }),
    });
    
    this.display.addField("alphaStatus", {
      label: "Alpha",
      labelTitle: "Whether the pal is an alpha, and what type of alpha (boss, lucky, legend)",
      sort: {generic: {type:"string",property:"alphaStatus"}},
      dynamic: true,
      value: item => item.alphaStatus,
      edit: item => ({
        target: {item, field:"alphaStatus"},
        type: "select",
        list: ["","Boss","Lucky"],
      }),
    });
    
    this.display.addField("name", {
      label: "Name",
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: item => item.name,
      edit: item => ({type:"string", target: {item, field:"name"}}),
    });
    
    this.display.addField("level", {
      label: "Lvl",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      value: item => item.level,
      edit: item => ({type:"number", target: {item, field:"level"}}),
    });
    
    this.display.addField("passive", {
      label: (item,num) => `Passive ${num+1}`,
      dynamic: true,
      value: (item,num) => {
        if(item.passives[num])
          return item.passives[num].name;
        else
          return "-";
      },
      title: (item,num) => {
        if(item.passives[num])
          return item.passives[num].effect;
        else
          return "Click to add.";
      },
      classes: (item,num) => {
        let classes = {
          'tier-3': false,
          'tier-2': false,
          'tier-1': false,
          'tier--1': false,
          'tier--2': false,
          'tier--3': false,
        };
        if(item.passives[num])
          classes[`tier-${item.passives[num].tier}`] = true;
        return classes;
      },
      edit: (item,num) => ({
        target: {item, field:["passivesKeys",item.passives.length>num?num:item.passives.length]},
        type: "select",
        list: Object.values(PalworldPassives).toSorted((a, b) => a.name.localeCompare(b.name)),
        valueProperty: "name",
        displayProperty: "name",
      }),
    });
    
    this.display.addField("partnerLevel", {
      label: "P.Lvl",
      labelTitle: "Partner Skill Level",
      sort: {generic: {type:"number",property:"partnerLevel"}},
      dynamic: true,
      value: item => item.partnerLevel,
      edit: item => ({type:"number", target: {item, field:"partnerLevel"}}),
    });
    
    this.display.addField("matchingPassives", {
      label: "#",
      labelTitle: "Number of filtered passives this pal possesses",
      sort: {func: (o,a,b) => {
        let func = this.display.getField("matchingPassives").value;
        let A = parseInt(func(a));
        let B = parseInt(func(b));
        return o * (B - A);
      }},
      dynamic: true,
      value: item => {
        let result = 0;
        let selectFilter = document.getElementById("filterSelect");
        if(selectFilter?.selectedOptions?.length)
          for(let passive of item.passivesKeys)
            if(Array.from(selectFilter.selectedOptions).some(opt => opt.value == passive))
              result++;
        return result;
      },
      dependencies: item => [
        {item:item, field:"passivesKeys"},
        {item:item.list, field:"passiveFilter"},
      ],
    });
    
    this.display.addField("delete", {
      label: "D",
      dynamic: false,
      button: item => ({
        icon: "fa-solid fa-trash-can",
        action: event => {
          event.stopPropagation();
          item.unlink();
          item.list.viewer.store();
        },
      }),
    });
  }
  
  getParentCombinations(childKey, desiredPassives={})
  {
    if(!PalsData[childKey])
    {
      console.warn(`${childKey} is not a valid pal.`);
      return null;
    }
    
    if(Array.isArray(desiredPassives))
    {
      let temp = Object.values(desiredPassives);
      desiredPassives = {};
      for(let passive of temp)
        desiredPassives[passive] = 1;
    }
    
    let parents;
    if(Pal.isolatedBreeds.includes(childKey))
      parents = this.items(pal => pal.key == childKey);
    else if(childKey in Pal.specificBreeds)
      parents = this.items(pal => pal.key == childKey || Pal.specificBreeds[childKey].includes(pal.key));
    else
      parents = this.items();
    
    let result = [];
    for(let parentA of parents)
    {
      let start = false;
      for(let parentB of parents)
      {
        if(parentB == parentA)
        {
          start = true;
          continue;
        }
        else if(!start)
          continue;
        else if(parentA.sex == parentB.sex)
          continue;
        
        /*let breedTarget = (PalsData[parentA.key].breedPower + PalsData[parentB.key].breedPower) / 2;
        if(!Pal.isolatedBreeds.includes(childKey) && !(childKey in Pal.specificBreeds) && Math.abs(breedTarget - PalsData[childKey].breedPower) > 20)
          continue;*/
        
        let potentialChild = Pal.getChild(parentA.key, parentB.key);
        if(potentialChild == childKey)
        {
          let potentialPassives = parentA.passivesKeys.concat(parentB.passivesKeys).filter((value, index, array) => array.indexOf(value) === index);
          let passiveScore = 0;
          for(let passive of potentialPassives)
          {
            if(passive in desiredPassives)
              passiveScore += desiredPassives[passive];
            else
            {
              if(!PalworldPassives[passive])
              {
                console.warn(`Unknown passive "${passive}"`);
                passiveScore -= 0.25;
              }
              else if(PalworldPassives[passive].tier < 0)
                passiveScore -= -0.3 * PalworldPassives[passive].tier;
              else
                passiveScore -= 0.25;
            }
          }
          result.push({parentA, parentB, potentialPassives, passiveScore});
        }
      }
    }
    result.sort((a,b) => b.passiveScore - a.passiveScore);
    return result;
  }
  
  getRelatedItems()
  {
    return {
      palsData: PalsData,
      passives: PalworldPassives,
    };
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [
      {field:this.display.getField("type"), params:[]},
      {field:this.display.getField("sex"), params:[]},
      {field:this.display.getField("alphaStatus"), params:[]},
      {field:this.display.getField("name"), params:[]},
      {field:this.display.getField("level"), params:[]},
      {field:this.display.getField("passive"), params:[0]},
      {field:this.display.getField("passive"), params:[1]},
      {field:this.display.getField("passive"), params:[2]},
      {field:this.display.getField("passive"), params:[3]},
      {field:this.display.getField("matchingPassives"), params:[]},
      {field:this.display.getField("partnerLevel"), params:[]},
      {field:this.display.getField("breedPower"), params:[]},
      {field:this.display.getField("location"), params:[]},
      {field:this.display.getField("delete"), params:[]},
    ];
    return {element, data, options};
  }
  
  async render(force=false)
  {
    let superResult = await super.render(force);
    
    let footer = document.getElementById("footer");
    footer.classList.remove("d-none");
    if(footer.dataset.list != this.uuid)
    {
      footer.replaceChildren();
      footer.dataset.list = this.uuid;
      
      // "Add" DIV
      let divAdd = footer.appendChild(document.createElement("div"));
      divAdd.classList.add("input-group", "mt-2", "w-auto");
      let selectAdd = divAdd.appendChild(document.createElement("select"));
      selectAdd.id = "addSelect";
      selectAdd.classList.add("form-select", "size-to-content");
      let btnAdd = divAdd.appendChild(document.createElement("button"));
      btnAdd.innerHTML = "Add";
      btnAdd.classList.add("btn", "btn-primary");
      btnAdd.addEventListener("click", event => {
        let selectAdd = document.getElementById("addSelect");
        if(selectAdd.value)
        {
          let item = this.createItem({
            key: selectAdd.value,
            name: selectAdd.value,
          });
          //selectAdd.value = "";
          
          // TODO: createItem should automatically trigger an update that handles the below addition to the DOM
          let listElement = this.viewer.elements[this.constructor.name].querySelector(`.list[data-uuid="${this.uuid}"]`);
          let listTargetElement = listElement.querySelector(".list-target");
          if(!listTargetElement)
            listTargetElement = listElement;
          let temp = this.prepareRender(listElement, {}, {});
          Renderer.rerender(null, {
            item,
            groups: temp.data.groups,
            fields: temp.data.fields,
            wrapper: "tr",
            fieldWrapper: "td",
          }, {template:"renderItem", parentElement:listTargetElement});
        }
      });
      
      selectAdd.appendChild(document.createElement("option"))
      let selectAddOptions = Object.keys(PalsData).map(key => ({value:key, innerHTML:PalsData[key].type})).toSorted((a,b) => a.innerHTML.localeCompare(b.innerHTML));
      for(let opt of selectAddOptions)
      {
        let option = selectAdd.appendChild(document.createElement("option"));
        option.value = opt.value;
        option.innerHTML = opt.innerHTML;
      }
      
      // "Filter" DIV
      let divFilter = footer.appendChild(document.createElement("div"));
      divFilter.classList.add("input-group", "mt-2", "w-auto");
      let selectFilter = divFilter.appendChild(document.createElement("select"));
      selectFilter.id = "filterSelect";
      selectFilter.multiple = true;
      selectFilter.classList.add("selectpicker");
      let btnFilter = divFilter.appendChild(document.createElement("button"));
      btnFilter.innerHTML = "Filter";
      btnFilter.classList.add("btn", "btn-primary");
      btnFilter.addEventListener("click", event => {
        let selectFilter = document.getElementById("filterSelect");
        if(selectFilter.selectedOptions.length)
        {
          this.subsets = {};
          this.items("currentFilter", item => {
            for(let opt of selectFilter.selectedOptions)
              if(item.passivesKeys.includes(opt.value))
                return true;
            return false;
          });
        }
        else
        {
          this.subsets = {};
          this.items("currentFilter", item => true);
        }
        this.update("passiveFilter", [], "notify");
        this.forceNextRender = true;
        let temp = this.prepareRender(this.viewer.elements[this.constructor.name].querySelector(`.list[data-uuid="${this.uuid}"]`), {}, {});
        Renderer.rerender(temp.element, {
          item: this,
          groups: temp.data.groups,
          fields: temp.data.fields,
          filter: "currentFilter",
        });
      });
      
      selectFilter.appendChild(document.createElement("option"))
      let selectFilterOptions = Object.keys(PalworldPassives).map(key => ({value:key, innerHTML:PalworldPassives[key].name})).toSorted((a,b) => a.innerHTML.localeCompare(b.innerHTML));
      for(let opt of selectFilterOptions)
      {
        let option = selectFilter.appendChild(document.createElement("option"));
        option.value = opt.value;
        option.innerHTML = opt.innerHTML;
      }
      $(selectFilter).selectpicker('render');
      
      let divPopup = footer.appendChild(document.createElement("div"));
      divPopup.classList.add("input-group", "mt-2", "w-auto");
      let btnPopup = divPopup.appendChild(document.createElement("button"));
      btnPopup.innerHTML = "Settings";
      btnPopup.classList.add("btn", "btn-secondary");
      btnPopup.addEventListener("click", this.renderPopup.bind(this));
    }
  }
  
  async renderPopup(event)
  {
    await Renderer.rerender(this.viewer.elements.popup.querySelector(".modal-content"), {item: this}, {template: this.constructor.templateName, partials: this.constructor.templatePartials, showPopup: true});
    let popupContent = this.viewer.elements.popup.querySelector(".modal-content");
    document.getElementById("breedingFind").addEventListener("click", event => {
      let childKey = document.getElementById("breedingChild").value;
      let passives = {};
      Array.from(document.getElementById("breedingPassivesSecondary").selectedOptions).forEach(opt => passives[opt.value] = 0.24);
      Array.from(document.getElementById("breedingPassives").selectedOptions).forEach(opt => passives[opt.value] = 1);
      
      let parents = this.getParentCombinations(childKey, passives);
      popupContent.querySelector(`[data-template="palworld/renderParentList"]`);
      Renderer.rerender(popupContent.querySelector(`[data-template="palworld/renderParentList"]`), {parents});
    });
  }
}
