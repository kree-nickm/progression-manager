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
    
    this.display.addField("sequence", {
      label: "Seq",
      labelTitle: "Sort by sequence.",
      sort: {generic: {type:"number",property:"sequence"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.sequence,
      edit: item => ({target: {item:item, field:"sequence"}}),
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
    
    Character.setupDisplay(this.display);
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
  
  getFooterParams()
  {
    return {
      add: {
        fields: [
          {
            property: "key",
            options: this.items('unowned')
              .filter(character => !character.isLeakHidden)
              .map(character => ({value:character.key, label:character.name})),
          },
        ],
        onAdd: async (event, elements, data) => {
          elements.key.needsUpdate = true;
          elements.key.removeChild(elements.key.selectedOptions.item(0));
          return this.get(data.key)?.update("owned", true);
        },
      },
    };
  }
  
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
    data.fields.push({field:this.display.getField("talent"), params:['Basic Attack']});
    data.fields.push({field:this.display.getField("talent"), params:['Resonance Skill']});
    data.fields.push({field:this.display.getField("talent"), params:['Forte Circuit']});
    data.fields.push({field:this.display.getField("talent"), params:['Resonance Liberation']});
    data.fields.push({field:this.display.getField("talent"), params:['Intro Skill']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['boss']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['flora']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['enemy']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['forgery','Basic Attack']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy','Basic Attack']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['forgery','Resonance Skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy','Resonance Skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['forgery','Forte Circuit']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy','Forte Circuit']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['forgery','Resonance Liberation']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy','Resonance Liberation']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['forgery','Intro Skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy','Intro Skill']});
    data.fields.push({field:this.display.getField("equipWeapon"), params:[]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
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
