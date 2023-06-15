import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";

import { Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Artifact from "./Artifact.js";
import Weapon from "./Weapon.js";

export default class WeaponList extends GenshinList
{
  static name = "weapons";
  static dontSerialize = GenshinList.dontSerialize.concat(["elements"]);
  
  elements = {};
  
  setupDisplay()
  {
    let favorite = this.display.addField("favorite", {
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
    
    let name = this.display.addField("name", {
      label: "Name",
      popup: true,
      sort: {generic: {type:"string",property:"name"}},
      dynamic: false,
      value: item => item.name,
      classes: item => ({
        "material": true,
        "q1": item.quality == 1,
        "q2": item.quality == 2,
        "q3": item.quality == 3,
        "q4": item.quality == 4,
        "q5": item.quality == 5,
      }),
    });
    
    let type = this.display.addField("type", {
      label: "Type",
      sort: {generic: {type:"string", property:"type"}},
      dynamic: false,
      value: item => ({
        tag: "img",
        src: `img/Weapon_${item.type}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let stat = this.display.addField("stat", {
      label: "Stat",
      sort: {generic: {type:"string", property:"stat"}},
      dynamic: false,
      value: item => Artifact.shorthandStat[item.stat],
    });
    
    let refinement = this.display.addField("refinement", {
      label: "Ref",
      sort: {generic: {type:"number", property:"refinement"}},
      dynamic: true,
      value: item => item.refinement,
      edit: item => ({target: {item, field:"refinement"}}),
    });
    
    let lock = this.display.addField("lock", {
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
    
    let ascension = this.display.addField("ascension", {
      label: "Phs",
      sort: {generic: {type:"number", property:"ascension"}},
      dynamic: true,
      value: item => item.ascension,
      edit: item => ({target: {item, field:"ascension"}}),
      dependencies: item => [
        {item:item.getMat('forgery'), field:"count"},
        {item:item.getMat('strong'), field:"count"},
        {item:item.getMat('weak'), field:"count"},
      ].concat(item.getMat('forgery').getCraftDependencies()).concat(item.getMat('strong').getCraftDependencies()).concat(item.getMat('weak').getCraftDependencies()),
      button: item => {
        if(item.canUpPhase(false))
          return {
            icon: "fa-solid fa-star",
            action: item.upPhase.bind(item),
          };
        else if(item.canUpPhase(true))
          return {icon: "fa-solid fa-star"};
      },
    });
    
    let level = this.display.addField("level", {
      label: "Lvl",
      sort: {generic: {type:"number", property:"level"}},
      dynamic: true,
      value: item => item.level,
      edit: item => ({target: {item, field:"level"}}),
      classes: item => ({
        "pending": item.level < item.levelCap,
      }),
      dependencies: item => [
        {item:item.getMat('forgery'), field:"count"},
        {item:item.getMat('strong'), field:"count"},
        {item:item.getMat('weak'), field:"count"},
        {item, field:"ascension"},
        item.getMat('forgery').days ? {item:this.viewer, field:"today"} : {},
      ].concat(item.getMat('forgery').getCraftDependencies()).concat(item.getMat('strong').getCraftDependencies()).concat(item.getMat('weak').getCraftDependencies()),
    });
    
    let mats = [
      {p:"forgery",l:"Forgery Rewards"},
      {p:"strong",l:"Strong Drops"},
      {p:"weak",l:"Weak Drops"},
    ];
    let ascGroup = {label:"Ascension Materials"};
    for(let phase of [undefined,0,1,2,3,4,5])
    {
      for(let m of mats)
      {
        let ascMat = this.display.addField(m.p+"Mat"+(phase??""), {
          group: ascGroup,
          label: m.l,
          sort: isNaN(phase) ? {generic: {type:"string", property:m.p+'MatType'}} : undefined,
          columnClasses: ["ascension-materials"],
          tags: isNaN(phase) ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getMat(m.p,phase) && item.getMatCost(m.p,phase) ? [
            {
              value: `${item.getMat(m.p,phase).count} / ${item.getMatCost(m.p,phase)}`,
              classes: {
                "quantity": true,
                "pending": item.getMat(m.p,phase).count < item.getMatCost(m.p,phase),
                "insufficient": item.getMat(m.p,phase).getCraftCount() < item.getMatCost(m.p,phase),
              },
            },
            {
              value: item[m.p+'MatType'] + (item.getMat(m.p,phase).days.indexOf(item.list.viewer.today()) > -1 ? "*" : ""),
              classes: item.getMat(m.p,phase).getRenderClasses(),
            },
          ] : "",
          title: item => item.getMat(m.p,phase)?.getFullSource() ?? "",
          edit: item => item.getMat(m.p,phase) && item.getMatCost(m.p,phase) ? {target: {item:item.getMat(m.p,phase), field:"count"}} : null,
          dependencies: item => [
            {item, field:"ascension"},
            item.getMat(m.p,phase).days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getMat(m.p,phase).getCraftDependencies()),
        });
      }
      if(!isNaN(phase))
      {
        let ascPhase = this.display.addField("ascension"+phase, {
          label: "Phs"+phase,
          tags: ["detailsOnly"],
          dynamic: true,
          value: item => `${phase} ➤ ${phase+1}`,
          dependencies: item => [
            {item:item.getMat('forgery',phase), field:"count"},
            {item:item.getMat('strong',phase), field:"count"},
            {item:item.getMat('weak',phase), field:"count"},
            {item, field:"ascension"},
          ],
          button: item => {
            if(phase == item.ascension)
            {
              if(item.canUpPhase(false))
              {
                return {
                  icon: "fa-solid fa-circle-up",
                  action: item.upPhase.bind(item),
                };
              }
              else
              {
                return {
                  icon: "fa-solid fa-circle-up",
                };
              }
            }
          },
        });
      }
    }
    
    let equipped = this.display.addField("equipped", {
      label: "Equipped By",
      sort: {generic: {type:"string", property:"location"}},
      dynamic: true,
      value: item => item.character?.name ?? "",
      edit: item => ({
        target: {item, field:"location"},
        type: "select",
        list: item.list.viewer.lists.characters.list.filter(cha => (cha.constructor.name == "Character" || !cha.base) && item.type == cha.weaponType),
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
        {item, field:"lock"},
      ],
      title: item => (item.lock || item.location) ? "Unlock/unequip the weapon before deleting it." : "Delete this weapon from the list.",
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
    
    let atk = this.display.addField("atk", {
      label: "ATK",
      tags: ["detailsOnly"],
      dynamic: true,
      value: item => item.getATK().toFixed(0),
      dependencies: item => [
        {item, field:"ascension"},
        {item, field:"level"},
      ],
    });
    
    let statVal = this.display.addField("statVal", {
      label: "ATK",
      tags: ["detailsOnly"],
      dynamic: true,
      title: item => item.getStat(),
      value: item => item.getStat().toFixed(item.stat=="eleMas"?0:1),
      dependencies: item => [
        {item, field:"level"},
      ],
    });
  }

  getUnique(item)
  {
    return `${item.key}${item.id}`;
  }
  
  createItem(goodData)
  {
    let item = new Weapon();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    super.clear();
    this.viewer.lists.characters.list.forEach(character => character.weapon = null);
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      exclude: field => field.tags.indexOf("detailsOnly") > -1,
      container: window.viewer.elements[this.constructor.name],
    });
    this.forceNextRender = false;
    
    if(!this.elements.divAdd)
    {
      this.elements.divAdd = window.viewer.elements[this.constructor.name].appendChild(document.createElement("div"));
      this.elements.divAdd.classList.add("input-group", "mt-2");
      this.elements.selectAdd = this.elements.divAdd.appendChild(document.createElement("select"));
      this.elements.selectAdd.classList.add("form-select", "size-to-content");
      this.elements.btnAdd = this.elements.divAdd.appendChild(document.createElement("button"));
      this.elements.btnAdd.innerHTML = "Add Weapon";
      this.elements.btnAdd.classList.add("btn", "btn-primary");
      this.elements.btnAdd.addEventListener("click", event => {
        if(this.elements.selectAdd.value)
        {
          let item = this.addGOOD({
            id: this.list.reduce((c,i) => Math.max(c,i.id), 0)+1,
            key: this.elements.selectAdd.value,
            level: 1,
            refinement: 1,
            ascension: 0,
            location: "",
            lock: false,
          });
          this.elements.selectAdd.value = "";
          this.viewer.store();
          Renderer.renderNewItem(item, {exclude: field => field.tags.indexOf("detailsOnly") > -1});
        }
      });
      
      this.elements.selectAdd.appendChild(document.createElement("option"))
      for(let itm in GenshinWeaponData)
      {
        let option = this.elements.selectAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = GenshinWeaponData[itm].name;
      }
    }
  }
}
