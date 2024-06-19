import CharacterData from "./gamedata/CharacterData.js";

import { handlebars, Renderer } from "../Renderer.js";
import WuWaList from "./WuWaList.js";
import Character from "./Character.js";
import Rover from "./Rover.js";

export default class CharacterList extends WuWaList
{
  static unique = true;
  static itemClass = [Character,Rover];
  static subsetDefinitions = {
    'rover': item => item instanceof Rover && item.owned,
    'notrover': item => !(item instanceof Rover) && item.owned,
    'equippable': item => (!(item instanceof Rover) || !item.base) && item.owned,
    'listable': item => (!(item instanceof Rover) || item.base) && item.owned,
    
    'rover-all': item => item instanceof Rover,
    'notrover-all': item => !(item instanceof Rover),
    'equippable-all': item => (!(item instanceof Rover) || !item.base),
    'listable-all': item => (!(item instanceof Rover) || item.base),
    
    'owned': item => item.owned,
    'unowned': item => !item.owned,
  };
  
  static fromJSON(data, options)
  {
    for(let key in data?.list??[])
      if(data.list[key] === undefined)
        data.list[key].owned = true;
    let list = super.fromJSON(data, options);
    list.addRover();
    list.addRemaining();
    return list;
  }
  
  setupDisplay()
  {
    this.display.addField("favorite", {
      label: "F",
      labelTitle: "Mark certain characters as favorites, then click to sort them higher than others.",
      sort: {generic: {type:"boolean",property:"favorite"}},
      dynamic: true,
      title: item => `${item.favorite?"Unmark":"Mark"} Favorite`,
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
      labelTitle: "Sort by name.",
      popup: item => item,
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: item => item.name,
      title: item => `Click to open a popup to examine ${item.name} in-depth.`,
    });
    
    this.display.addField("weaponType", {
      label: "Wpn",
      labelTitle: "Sort by weapon type.",
      sort: {generic: {type:"string",property:"weaponType"}},
      dynamic: false,
      title: item => item.weaponType,
      value: item => item.weaponType,
      /*value: item => ({
        tag: "img",
        classes: {'weapon-icon':true},
        src: `img/Weapon_${item.weaponType}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),*/
    });
    
    this.display.addField("element", {
      label: "Elm",
      labelTitle: "Sort by element.",
      sort: {generic: {type:"string",property:"element"}},
      dynamic: false,
      title: item => item.element,
      value: item => item.element,
      /*value: item => ({
        tag: "img",
        classes: {'element-icon':true},
        src: `img/Element_${item.element}.svg`,
      }),
      classes: item => ({
        'icon': true,
      }),*/
    });
    
    this.display.addField("level", {
      label: "Lvl",
      labelTitle: "Sort by character level.",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.level,
      edit: item => ({target: {item:item.base??item, field:"level"}}),
    });
    
    this.display.addField("ascension", {
      label: "Asc",
      labelTitle: "Sort by ascension.",
      sort: {generic: {type:"number",property:"ascension"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.ascension,
      edit: item => ({target: {item:item.base??item, field:"ascension"}}),
    });
    
    this.display.addField("sequence", {
      label: "Seq",
      labelTitle: "Sort by sequence.",
      sort: {generic: {type:"number",property:"sequence"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.sequence,
      edit: item => ({target: {item:item, field:"sequence"}}),
    });
    
    let forteLabels = {
      'Basic Attack': {c:"A",w:"Attack"},
      'Resonance Skill': {c:"S",w:"Skill"},
      'Forte Circuit': {c:"C",w:"Circuit"},
      'Resonance Liberation': {c:"L",w:"Liberation"},
      'Intro Skill': {c:"I",w:"Intro"},
    };
    this.display.addField("forte", {
      label: (item, forte, alt) => forteLabels[forte].c,
      labelTitle: (item, forte, alt) => forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":""),
      dynamic: true,
      title: (item, forte, alt) => `Click to change ${forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"")}.`,
      value: (item, forte, alt) => item.forte[forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"")],
      edit: (item, forte, alt) => ({target: {item:item, field:`forte.${forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"")}`}}),
      dependencies: (item, forte, alt) => [
        {item:item, field:`forte.${forte}`},
        alt ? {item:item, field:`forte.${forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"")}`} : undefined,
        {item:item.viewer.lists.MaterialList.get("Shell Credit"), field:"count"},
        {item:item.getForteMat("enemy",forte,alt), field:"count"},
        {item:item.getForteMat("forgery",forte,alt), field:"count"},
        {item:item.getForteMat("weekly",forte,alt), field:"count"},
      ],
    });
    
    let ascMatGroup = {label:"Ascension Materials", startCollapsed:false};
    this.display.addField("ascensionMaterial", {
      group: ascMatGroup,
      label: (item, type, phase) => type.at(0).toUpperCase()+type.substr(1).toLowerCase(),
      columnClasses: ["ascension-materials"],
      dynamic: true,
      value: (item, type, phase) => type == "label" ? `${phase} ➤ ${parseInt(phase)+1}` : (item.getMat(type,phase) && item.getMatCost(type,phase) ? item.getMat(type,phase).getFieldValue(item.getMatCost(type,phase)) : ""),
      dependencies: (item, type, phase) => [
        {item:item.base??item, field:"ascension"},
        {item:item.viewer.lists.MaterialList.get("Shell Credit"), field:"count"},
      ].concat(type == "label" ?
        [
          {item:item.getMat('enemy',phase), field:"count"},
          {item:item.getMat('flora',phase), field:"count"},
          {item:item.getMat('boss',phase), field:"count"},
        ] : (item.getMat(type,phase)?.getCraftDependencies() ?? [])
      ),
      button: (item, type, phase) => {
        if(type == "label" && phase == item.ascension)
        {
          if(item.canUpPhase(false))
          {
            return {
              title: "Ascend the character. This will spend the resources for you and increase their level if necessary.",
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
    
    let forteMatGroup = {label:"Forte Materials", startCollapsed:false};
    this.display.addField("forteMaterial", {
      group: forteMatGroup,
      label: (item, type, forte, alt) => (forteLabels[forte]?.w??forte) + " " + type.capitalize(),
      columnClasses: (item, type, forte, alt) => forteLabels[forte] ? ["forte-materials", `${type}-${forteLabels[forte]?.c}-materials`] : [],
      dynamic: true,
      value: (item, type, forte, alt) => type == "label" ? `${forte} ➤ ${parseInt(forte)+1}` : (item.getForteMat(type,forte,alt) && item.getForteMatCost(type,forte,alt) ? item.getForteMat(type,forte,alt).getFieldValue(item.getForteMatCost(type,forte,alt)) : ""),
      dependencies: (item, type, forte, alt) => [
        {item:item, field:`forte.${forte}`},
        alt ? {item:item, field:`forte.${forte+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"")}`} : undefined,
        {item:item.viewer.lists.MaterialList.get("Shell Credit"), field:"count"},
      ].concat(type == "label" ?
        [
          {item:item.getForteMat('enemy',forte,alt), field:"count"},
          {item:item.getForteMat('forgery',forte,alt), field:"count"},
          {item:item.getForteMat('weekly',forte,alt), field:"count"},
        ] : (item.getForteMat(type,forte,alt)?.getCraftDependencies() ?? [])
      ),
      button: (item, type, forte, alt) => Object.keys(forteLabels).map(f => 
      {
        let forteKey = f;
        if(alt)
        {
          if(alt == "bonus" && f == "Forte Circuit")
            return undefined;
          if(alt == "circuit" && f != "Forte Circuit")
            return undefined;
          forteKey = f+(alt=="circuit"?" Passive":alt=="bonus"?" Bonus":"");
        }
        if(type == "label" && forte == item.forte[forteKey])
        {
          if(item.canUpForte(f, false, alt))
          {
            return {
              title: `Upgrade ${f} level. This will spend the resources for you.`,
              icon: "fa-solid fa-circle-up",
              name: forteLabels[f].w,
              text: forteLabels[f].w,
              action: item.upForte.bind(item, f, alt),
            };
          }
          else
          {
            return {
              title: "Not enough materials to upgrade.",
              icon: "fa-solid fa-circle-up",
              name: forteLabels[f].w,
              text: forteLabels[f].w,
            };
          }
        }
      }),
    });
    
    let gearGroup = {label:"Equipped Gear", startCollapsed:false};
    this.display.addField("equipWeapon", {
      group: gearGroup,
      label: "Weapon",
      columnClasses: ["character-weapon"],
      dynamic: true,
      value: item => item.weapon ? {
        value: [
          {
            value: `Lv.${item.weapon.level} S${item.weapon.syntonization} ${item.weapon.name}`,
          },
          {
            tag: "i",
            classes: {'fa-solid':true, 'fa-eye':true},
            popup: item.weapon,
          },
        ],
        classes: {
          "user-field": true,
        },
      } : "-",
      edit: item => ({
        func: wpn => wpn ? wpn.update("location", item.key) : item.weapon?.update("location", ""),
        type: "select",
        list: item.viewer.lists.WeaponList.items(item.weaponType),
        valueProperty: "uuid",
        valueFormat: "uuid",
        value: item.weapon ? `Lv.${item.weapon.level} S${item.weapon.syntonization} ${item.weapon.name}` : "-",
        displayProperty: wpn => `Lv.${wpn.level} S${wpn.syntonization} ${wpn.name}`,
      }),
      dependencies: item => [
        {item:item.list.viewer.lists.WeaponList, field:"list"},
        item.weapon ? {item:item.weapon, field:"location"} : undefined,
        item.weapon ? {item:item.weapon, field:"syntonization"} : undefined,
        item.weapon ? {item:item.weapon, field:"level"} : undefined,
        {type:"weapon"},
      ],
    });
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "list")
    {
      let select = document.getElementById("addCharacterSelect");
      if(select)
        select.needsUpdate = true;
      if(action == "notify" && options?.toggleOwned)
      {
        if(options.toggleOwned.owned)
        {
          this.subsets = {};
          super.afterUpdate(field, options.toggleOwned, "push", {force:true});
        }
        else
        {
          this.subsets = {};
          Renderer.removeElementsOf(options.toggleOwned);
        }
      }
    }
  }
  
  addRover()
  {
    let base = this.get("Rover");
    let spectro = this.get("RoverSpectro");
    let havoc = this.get("RoverHavoc");
    
    if(!base)
    {
      base = Rover.fromJSON({__class__:"Rover",key:"Rover"}, {addProperties:{list:this}});
      this.update("list", base, "push");
    }
    if(!spectro)
    {
      spectro = Rover.fromJSON({__class__:"Rover",key:"RoverSpectro"}, {addProperties:{list:this}});
      this.update("list", spectro, "push");
    }
    if(!havoc)
    {
      havoc = Rover.fromJSON({__class__:"Rover",key:"RoverHavoc"}, {addProperties:{list:this}});
      this.update("list", havoc, "push");
    }
    
    spectro.base = base;
    havoc.base = base;
    
    base.variants = [spectro,havoc];
    
    base.update("owned", true);
    spectro.update("owned", true);
  }
  
  addRemaining()
  {
    for(let key in CharacterData)
      if(!this.get(key))
        this.createItem({key}).update("owned", false);
  }
  
  clear()
  {
    this.items().forEach(item => item.update("owned", false));
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  /*getFooterParams()
  {
    return {
      add: [
        {
          property: "key",
          options: [],
        },
      ],
    };
  }*/
  
  prepareRender(element, data, options)
  {
    data.filter = "listable";
    data.fields = [];
    data.fields.push({field:this.display.getField("favorite"), params:[]});
    data.fields.push({field:this.display.getField("name"), params:[]});
    data.fields.push({field:this.display.getField("weaponType"), params:[]});
    data.fields.push({field:this.display.getField("element"), params:[]});
    data.fields.push({field:this.display.getField("level"), params:[]});
    data.fields.push({field:this.display.getField("ascension"), params:[]});
    data.fields.push({field:this.display.getField("sequence"), params:[]});
    data.fields.push({field:this.display.getField("forte"), params:['Basic Attack']});
    data.fields.push({field:this.display.getField("forte"), params:['Resonance Skill']});
    data.fields.push({field:this.display.getField("forte"), params:['Forte Circuit']});
    data.fields.push({field:this.display.getField("forte"), params:['Resonance Liberation']});
    data.fields.push({field:this.display.getField("forte"), params:['Intro Skill']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['boss']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['flora']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['enemy']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['forgery','Basic Attack']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['enemy','Basic Attack']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['forgery','Resonance Skill']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['enemy','Resonance Skill']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['forgery','Forte Circuit']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['enemy','Forte Circuit']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['forgery','Resonance Liberation']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['enemy','Resonance Liberation']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['forgery','Intro Skill']});
    data.fields.push({field:this.display.getField("forteMaterial"), params:['enemy','Intro Skill']});
    data.fields.push({field:this.display.getField("equipWeapon"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
  
  async render(force=false)
  {
    await super.render(force);
    
    let selectAdd;
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
      
      // Add Character
      let li1 = ul.appendChild(document.createElement("li"));
      li1.classList.add("nav-item", "me-2");
      
      let divAdd = li1.appendChild(document.createElement("div"));
      divAdd.classList.add("input-group");
      
      selectAdd = divAdd.appendChild(document.createElement("select"));
      selectAdd.id = "addCharacterSelect";
      selectAdd.classList.add("form-select", "size-to-content");
      let btnAdd = divAdd.appendChild(document.createElement("button"));
      btnAdd.innerHTML = "Add Character";
      btnAdd.classList.add("btn", "btn-primary");
      btnAdd.addEventListener("click", async event => {
        let selectAdd = document.getElementById("addCharacterSelect");
        if(selectAdd.value)
        {
          this.get(selectAdd.value)?.update("owned", true);
          selectAdd.needsUpdate = true;
          selectAdd.removeChild(selectAdd.selectedOptions.item(0));
          selectAdd.value = "";
        }
      });
      
      // Display Showcase
      /*let li2 = ul.appendChild(document.createElement("li"));
      li2.classList.add("nav-item", "me-2");
      
      let showcaseBtn = li2.appendChild(document.createElement("button"));
      showcaseBtn.id = "characterShowcaseBtn";
      showcaseBtn.classList.add("btn", "btn-primary");
      showcaseBtn.title = "Display your characters' stats and gear in a nice window that you can screenshot and show to others.";
      let showcaseIcon = showcaseBtn.appendChild(document.createElement("i"));
      showcaseIcon.classList.add("fa-solid", "fa-camera");
      
      if(!showcaseBtn.onclick)
      {
        showcaseBtn.onclick = async event => {
          let template = await fetch(`templates/renderShowcaseConfigPopup.html`, {cache:"no-cache"})
          .then(response => response.text())
          .then(src => handlebars.compile(src));
          
          let modalElement = document.body.appendChild(document.createElement("template"));
          let index = Array.from(document.body.children).indexOf(modalElement);
          modalElement.outerHTML = template({characters:this.items("listable")});
          modalElement = document.body.children.item(index);
          $(modalElement).find(".selectpicker").selectpicker('render');
          
          let modal = new bootstrap.Modal(modalElement);
          modal.show();
          modalElement.addEventListener("hide.bs.modal", event => {
            if(event.explicitOriginalTarget?.classList.contains("popup-ok-btn"))
            {
              let characters = Array.from(modalElement.querySelector("select.character-filter").selectedOptions).map(optionElement => Renderer.controllers.get(optionElement.value));
              let showcase = window.open("showcase.html", "_blank");
              showcase.addEventListener("DOMContentLoaded", async event => {
                document.head.querySelectorAll('link, style').forEach(htmlElement => {
                  showcase.document.head.appendChild(htmlElement.cloneNode(true));
                });
                let container = showcase.document.body.appendChild(document.createElement("div"));
                await Renderer.rerender(container, {item:this, items:characters}, {template: "genshin/renderCharacterListAsShowcase"});
              });
              showcase.addEventListener("beforeunload", event => {
                this.constructor.clearDependencies(showcase.document.body, true);
              });
            }
            modalElement.remove();
          });
        };
      }*/
    }
    selectAdd = document.getElementById("addCharacterSelect");
    if(!selectAdd.children.length || selectAdd.needsUpdate)
    {
      selectAdd.replaceChildren();
      selectAdd.appendChild(document.createElement("option"))
      for(let chara of this.items('unowned'))
      {
        if(chara.isLeakHidden)
          continue;
        let option = selectAdd.appendChild(document.createElement("option"));
        option.value = chara.key;
        option.innerHTML = chara.name;
      }
    }
  }
  
  onRender(element)
  {
    super.onRender(element);
    
    element.querySelectorAll(".highlighter").forEach(elem => {
      let stat;
      elem.classList.forEach(cls => {
        if(cls.startsWith("highlight-"))
          stat = cls.slice(10);
      });
      if(stat)
      {
        if(!elem.onmouseenter)
        {
          elem.onmouseenter = event => {
            element.querySelectorAll(".highlighter").forEach(otherElem => {
              if(otherElem.classList.contains("highlight-"+stat))
              {
                otherElem.classList.add("highlighted");
                otherElem.classList.remove("unhighlighted");
              }
              else
              {
                otherElem.classList.add("unhighlighted");
                otherElem.classList.remove("highlighted");
              }
            })
          };
        }
        
        if(!elem.onmouseleave)
        {
          elem.onmouseleave = event => {
            element.querySelectorAll(".highlighter").forEach(otherElem => {
              otherElem.classList.remove("highlighted");
              otherElem.classList.remove("unhighlighted");
            })
          };
        }
      }
    });
  }
}
