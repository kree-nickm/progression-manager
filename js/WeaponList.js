import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";

import { handlebars, Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Artifact from "./Artifact.js";
import Weapon from "./Weapon.js";

handlebars.registerHelper("getWeaponData", (key, options) => GenshinWeaponData[key]);
handlebars.registerHelper("weaponList", (item, options) => item.viewer.lists.WeaponList.items(options.hash.filter));

export default class WeaponList extends GenshinList
{
  static itemClass = Weapon;
  static subsetDefinitions = {
    'Sword': item => item.type == "Sword",
    'Claymore': item => item.type == "Claymore",
    'Polearm': item => item.type == "Polearm",
    'Bow': item => item.type == "Bow",
    'Catalyst': item => item.type == "Catalyst",
  };
  
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
      popup: item => item,
      sort: {generic: {type:"string",property:"name"}},
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
        title: item.name,
      } : item.name,
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
    });
    
    let type = this.display.addField("type", {
      label: "Type",
      sort: {generic: {type:"string", property:"type"}},
      dynamic: false,
      value: item => ({
        tag: "img",
        classes: {'weapon-icon':true},
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
      value: item => Artifact.getStatShorthand(item.stat),
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
      label: "",
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
    
    let iconLookup = {
      'forgery': `<i class="fa-solid fa-dungeon"></i>`,
      'strong': `<i class="fa-solid fa-skull fa-lg"></i>`,
      'weak': `<i class="fa-solid fa-skull fa-sm"></i>`,
    };
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
          label: iconLookup[m.p],
          labelTitle: m.l,
          sort: isNaN(phase) ? {generic: {type:"string", property:m.p+'MatType'}} : undefined,
          columnClasses: ["ascension-materials"],
          tags: isNaN(phase) ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getMat(m.p,phase) && item.getMatCost(m.p,phase) ? item.getMat(m.p,phase).getFieldValue(item.getMatCost(m.p,phase), this.viewer.settings.preferences.listDisplay=='1') : "",
          title: item => item.getMat(m.p,phase)?.getFullSource() ?? "",
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
      label: "User",
      sort: {generic: {type:"string", property:"location"}},
      dynamic: true,
      value: item => item.character?.name ?? "-",
      edit: item => ({
        target: {item, field:"location"},
        type: "select",
        list: item.list.viewer.lists.CharacterList.items("equippable").filter(cha => item.type == cha.weaponType),
        valueProperty: "key",
        displayProperty: "name",
      }),
      classes: item => ({"text-muted": !item.character}),
      dependencies: item => [
        {item:item.list.viewer.lists.characters, field:"list"},
      ],
    });
    
    let deleteBtn = this.display.addField("deleteBtn", {
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
    
    let passiveField = this.display.addField("passive", {
      label: "Passive",
      tags: ["detailsOnly"],
      dynamic: true,
      html: true,
      value: item => item.getPassive(),
      dependencies: item => [
        {item, field:"refinement"},
      ],
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
      label: "Stat",
      tags: ["detailsOnly"],
      dynamic: true,
      title: item => item.getStat(),
      value: item => item.getStat().toFixed(item.stat=="eleMas"?0:1),
      dependencies: item => [
        {item, field:"level"},
      ],
    });
    
    let imageField = this.display.addField("image", {
      label: "Image",
      tags: ["detailsOnly"],
      dynamic: true,
      value: item => {
        return {
          tag: "img",
          src: item.image,
        };
      },
      dependencies: item => [
        {item, field:"ascension"},
      ],
    });
  }
  
  clear()
  {
    super.clear();
    this.viewer.lists.CharacterList.list.forEach(character => character.weapon = null);
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
      
      let divAdd = footer.appendChild(document.createElement("div"));
      divAdd.classList.add("input-group", "mt-2");
      let selectAdd = divAdd.appendChild(document.createElement("select"));
      selectAdd.id = "addWeaponSelect";
      selectAdd.classList.add("form-select", "size-to-content");
      let btnAdd = divAdd.appendChild(document.createElement("button"));
      btnAdd.innerHTML = "Add Weapon";
      btnAdd.classList.add("btn", "btn-primary");
      btnAdd.addEventListener("click", event => {
        let selectAdd = document.getElementById("addWeaponSelect");
        if(selectAdd.value)
        {
          let item = this.addGOOD({
            id: this.list.reduce((c,i) => Math.max(c,i.id), 0)+1,
            key: selectAdd.value,
            level: 1,
            refinement: 1,
            ascension: 0,
            location: "",
            lock: false,
          });
          selectAdd.value = "";
          
          let listElement = this.viewer.elements[this.constructor.name].querySelector(`.list[data-uuid="${this.uuid}"]`);
          let listTargetElement = listElement.querySelector(".list-target");
          if(!listTargetElement)
            listTargetElement = listElement;
          Renderer.rerender(null, {
            item,
            groups: this.display.getGroups({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}),
            fields: this.display.getFields({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}).map(field => ({field, params:[]})),
            wrapper: "tr",
            fieldWrapper: "td",
          }, {template:"renderItem", parentElement:listTargetElement});
        }
      });
      
      selectAdd.appendChild(document.createElement("option"))
      for(let itm in GenshinWeaponData)
      {
        let option = selectAdd.appendChild(document.createElement("option"));
        option.value = itm;
        option.innerHTML = GenshinWeaponData[itm].name;
      }
    }
  }
}
