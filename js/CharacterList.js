import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";

import { Renderer } from "./Renderer.js";
import UIList from "./UIList.js";
import Character from "./Character.js";
import Traveler from "./Traveler.js";
import Artifact from "./Artifact.js";

export default class CharacterList extends UIList
{
  static unique = true;
  static name = "characters";
  static dontSerialize = UIList.dontSerialize.concat(["elements"]);
  
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
    });
    
    let weaponType = this.display.addField("weaponType", {
      label: "Wpn",
      sort: {generic: {type:"string",property:"weaponType"}},
      dynamic: false,
      value: item => ({
        tag: "img",
        src: `img/Weapon_${item.weaponType}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let element = this.display.addField("element", {
      label: "Elm",
      sort: {generic: {type:"string",property:"element"}},
      dynamic: false,
      value: item => ({
        tag: "img",
        src: `img/Element_${item.element}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let ascension = this.display.addField("ascension", {
      label: "Phs",
      sort: {generic: {type:"number",property:"ascension"}},
      dynamic: true,
      value: item => item.ascension,
      edit: item => ({target: {item, field:"ascension"}}),
      dependencies: item => [
        {item:item.getMat('gem'), field:"count"},
        item.getMat('boss') ? {item:item.getMat('boss'), field:"count"} : null,
        {item:item.getMat('flower'), field:"count"},
        {item:item.getMat('enemy'), field:"count"},
      ].concat(item.getMat('gem').getCraftDependencies()).concat(item.getMat('enemy').getCraftDependencies()),
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
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      value: item => item.level,
      edit: item => ({target: {item, field:"level"}}),
      classes: item => ({
        "pending": item.level < item.levelCap,
      }),
      dependencies: item => [
          {item:item.getMat('gem'), field:"count"},
          item.getMat('boss') ? {item:item.getMat('boss'), field:"count"} : null,
          {item:item.getMat('flower'), field:"count"},
          {item:item.getMat('enemy'), field:"count"},
          {item, field:"ascension"},
        ].concat(item.getMat('gem').getCraftDependencies()).concat(item.getMat('enemy').getCraftDependencies()),
    });
    
    let constellation = this.display.addField("constellation", {
      label: "Con",
      sort: {generic: {type:"number",property:"constellation"}},
      dynamic: true,
      value: item => item.constellation,
      edit: item => ({target: {item, field:"constellation"}}),
    });
    
    for(let i of ["auto","skill","burst"])
    {
      let talent = this.display.addField(i+"Talent", {
        label: "T"+ i.at(0).toUpperCase(),
        dynamic: true,
        value: item => item.talent[i],
        title: item => (item.getTalent(i).matTrounceCount ? `Also requires ${item.getTalent(i).matTrounceCount} ${item.materials.trounce.name}, dropped by ${item.materials.trounce.source} (you have ${item.materials.trounce.getCraftCount()})` : ""),
        edit: item => ({target: {item, field:["talent", i]}}),
        sort: {generic: {type:"number",property:["talent",i]}},
        dependencies: item => [
            {item:item.getTalentMat('mastery',i), field:"count"},
            {item:item.getTalentMat('enemy',i), field:"count"},
            {item, field:"ascension"},
            item.getTalentMat('mastery',i).days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat('mastery',i).getCraftDependencies()).concat(item.getTalentMat('enemy',i).getCraftDependencies()),
        button: item => {
          if(item.talent[i] < item.getPhase().maxTalent)
          {
            if(item.canUpTalent(i, false))
            {
              return {
                icon: "fa-solid fa-circle-up",
                action: item.upTalent.bind(item, i),
                classes: {
                  "sufficient": false,
                  "pending": false,
                  "insufficient": false,
                },
              };
            }
            else
            {
              return {
                icon: "fa-solid fa-circle-up",
                classes: {
                  "sufficient": item.canUpTalent(i, true),
                  "pending": item.getTalentMat('mastery',i).getCraftCount() < item.getTalent(i).matDomainCount &&
                             item.getTalentMat('mastery',i).days.indexOf(item.list.viewer.today()) > -1,
                  "insufficient": item.getTalentMat('mastery',i).getCraftCount() < item.getTalent(i).matDomainCount &&
                                  item.getTalentMat('mastery',i).days.indexOf(item.list.viewer.today()) == -1,
                },
              };
            }
          }
          return null;
        },
      });
    }
    
    let mats = [
      {t:"gem",l:"Gems"},
      {t:"boss",l:"World Boss Drops"},
      {t:"flower",l:"Flora"},
      {t:"enemy",l:"Enemy Drops"},
    ];
    let ascGroup = {label:"Ascension Materials"};
    for(let phase of [undefined,0,1,2,3,4,5])
    {
      for(let mat of mats)
      {
        let ascMaterial = this.display.addField(mat.t+"AscMat"+(phase??""), {
          group: ascGroup,
          label: mat.l,
          sort: isNaN(phase) ? {generic: {type:"string",property:[mat.t+'Mat',"shorthand"]}} : undefined,
          columnClasses: ["ascension-materials"],
          tags: isNaN(phase) ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getMat(mat.t,phase) && item.getMatCost(mat.t,phase) ? [
            {
              value: `${item.getMat(mat.t,phase).count} / ${item.getMatCost(mat.t,phase)}`,
              classes: {
                "quantity": true,
                "pending": item.getMat(mat.t,phase).count < item.getMatCost(mat.t,phase),
                "insufficient": item.getMat(mat.t,phase).getCraftCount() < item.getMatCost(mat.t,phase),
              },
            },
            {
              value: item.getMat(mat.t,phase).shorthand,
              classes: item.getMat(mat.t,phase).getRenderClasses(),
            },
          ] : "",
          title: item => item.getMat(mat.t,phase)?.getFullSource() ?? "",
          edit: item => item.getMat(mat.t,phase) && item.getMatCost(mat.t,phase) ? {target: {item:item.getMat(mat.t,phase), field:"count"}} : null,
          dependencies: item => [
            {item, field:"ascension"},
          ].concat(item.getMat(mat.t,phase)?.getCraftDependencies() ?? []),
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
            {item:item.getMat('gem',phase), field:"count"},
            item.getMat('boss',phase) ? {item:item.getMat('boss',phase), field:"count"} : null,
            {item:item.getMat('flower',phase), field:"count"},
            {item:item.getMat('enemy',phase), field:"count"},
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
    
    let talGroup = {label:"Talent Materials"};
    for(let i of ["auto","skill","burst",1,2,3,4,5,6,7,8,9])
    {
      for(let m of [{l:"Mastery",d:"Domain"},{l:"Enemy",d:"Enemy"},{l:"Trounce",d:"Trounce"},{l:"Crown",d:"Crown"}])
      {
        let talentMat = this.display.addField(isNaN(i) ? i+m.l+"Mat" : "talent"+m.l+"Mat"+i, {
          group: talGroup,
          label: m.l + (isNaN(i) ? ` (${i})` : ""),
          sort: isNaN(i) ? {generic: {type:"string",property:[i+m.l+'Mat',"name"]}} : undefined,
          columnClasses: [(isNaN(i)?i:"talent")+'-'+m.l.toLowerCase()],
          tags: isNaN(i) & m.l != "Trounce" && m.l != "Crown" ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getTalentMat(m.l.toLowerCase(),i) && item.getTalent(i)['mat'+m.d+'Count'] ? [
            {
              value: `${item.getTalentMat(m.l.toLowerCase(),i).count} / ${item.getTalent(i)['mat'+m.d+'Count']}`,
              classes: {
                "quantity": true,
                "pending": item.getTalentMat(m.l.toLowerCase(),i).count < item.getTalent(i)['mat'+m.d+'Count'],
                "insufficient": item.getTalentMat(m.l.toLowerCase(),i).getCraftCount() < item.getTalent(i)['mat'+m.d+'Count'],
              },
            },
            {
              value: item.getTalentMatType(m.l.toLowerCase(),i) + (item.getTalentMat(m.l.toLowerCase(),i).days.indexOf(item.list.viewer.today()) > -1 ? "*" : ""),
              classes: item.getTalentMat(m.l.toLowerCase(),i).getRenderClasses(),
            },
          ] : "",
          title: item => item.getTalentMat(m.l.toLowerCase(),i).getFullSource(),
          edit: item => ({target: {item:item.getTalentMat(m.l.toLowerCase(),i), field:"count"}}),
          dependencies: item => [
            {item, field:["talent", i]},
            item.getTalentMat(m.l.toLowerCase(),i).days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat(m.l.toLowerCase(),i).getCraftDependencies()),
        });
      }
      if(!isNaN(i))
      {
        let talentLvl = this.display.addField("talentLvl"+i, {
          label: "TLvl"+i,
          tags: ["detailsOnly"],
          dynamic: true,
          value: item => `${i} ➤ ${i+1}`,
          dependencies: item => [
            {item:item.getTalentMat('mastery','auto'), field:"count"},
            {item:item.getTalentMat('enemy','auto'), field:"count"},
            {item:item.getTalentMat('mastery','skill'), field:"count"},
            {item:item.getTalentMat('enemy','skill'), field:"count"},
            {item:item.getTalentMat('mastery','burst'), field:"count"},
            {item:item.getTalentMat('enemy','burst'), field:"count"},
            {item, field:"ascension"},
          ],
          button: item => [
            (item.talent.auto != i) ? null : {
              name: "auto",
              text: "auto",
              icon: item.talent.auto < item.getPhase().maxTalent ? "fa-solid fa-circle-up" : undefined,
              action: item.talent.auto < item.getPhase().maxTalent && item.canUpTalent('auto', false) ? item.upTalent.bind(item, 'auto') : undefined,
            },
            (item.talent.skill != i) ? null : {
              name: "skill",
              text: "skill",
              icon: item.talent.skill < item.getPhase().maxTalent ? "fa-solid fa-circle-up" : undefined,
              action: item.talent.skill < item.getPhase().maxTalent && item.canUpTalent('skill', false) ? item.upTalent.bind(item, 'skill') : undefined,
            },
            (item.talent.burst != i) ? null : {
              name: "burst",
              text: "burst",
              icon: item.talent.burst < item.getPhase().maxTalent ? "fa-solid fa-circle-up" : undefined,
              action: item.talent.burst < item.getPhase().maxTalent && item.canUpTalent('burst', false) ? item.upTalent.bind(item, 'burst') : undefined,
            },
          ],
        });
      }
    }
    
    let ascendStat = this.display.addField("ascendStat", {
      label: "Stat",
      sort: {generic: {type:"string",property:"ascendStat"}},
      tags: ["detailsOnly"],
      dynamic: false,
      value: item => Artifact.shorthandStat[item.ascendStat],
    });
    
    for(let stat of ['critRate_','critDMG_','eleMas','enerRech_','heal_'])
    {
      let statCurrent = this.display.addField(stat+"Current", {
        label: Artifact.shorthandStat[stat],
        tags: ["detailsOnly"],
        dynamic: true,
        title: item => item.getStat(stat),
        value: item => item.getStat(stat).toFixed(stat=="eleMas"?0:1),
        dependencies: item => [
          {item:item, field:"ascension"},
          {item:item, field:"level"},
          item.weapon ? {item:item.weapon, field:"location"} : null,
          item.weapon ? {item:item.weapon, field:"ascension"} : null,
          item.weapon ? {item:item.weapon, field:"level"} : null,
          item.flowerArtifact ? {item:item.flowerArtifact, field:"location"} : null,
          item.flowerArtifact ? {item:item.flowerArtifact, field:"level"} : null,
          item.flowerArtifact ? {item:item.flowerArtifact, field:"substats"} : null,
          item.plumeArtifact ? {item:item.plumeArtifact, field:"location"} : null,
          item.plumeArtifact ? {item:item.plumeArtifact, field:"level"} : null,
          item.plumeArtifact ? {item:item.plumeArtifact, field:"substats"} : null,
          item.sandsArtifact ? {item:item.sandsArtifact, field:"location"} : null,
          item.sandsArtifact ? {item:item.sandsArtifact, field:"level"} : null,
          item.sandsArtifact ? {item:item.sandsArtifact, field:"substats"} : null,
          item.gobletArtifact ? {item:item.gobletArtifact, field:"location"} : null,
          item.gobletArtifact ? {item:item.gobletArtifact, field:"level"} : null,
          item.gobletArtifact ? {item:item.gobletArtifact, field:"substats"} : null,
          item.circletArtifact ? {item:item.circletArtifact, field:"location"} : null,
          item.circletArtifact ? {item:item.circletArtifact, field:"level"} : null,
          item.circletArtifact ? {item:item.circletArtifact, field:"substats"} : null,
        ],
      });
    }
    /*
    let wepGroup = {label:"Equipped Weapon"};
    if(this.weapon)
    {
      let weaponData = this.weapon.getRenderData();
      let weaponName = {
        group: wepGroup,
        label: "Equipped",
        value: this.weapon.name,
        classes: {
          "material": true,
          "q1": this.weapon.quality == 1,
          "q2": this.weapon.quality == 2,
          "q3": this.weapon.quality == 3,
          "q4": this.weapon.quality == 4,
          "q5": this.weapon.quality == 5,
        },
        dependencies: [
          {item:this.weapon, field:"location"},
          {type:"weapon"},
        ],
      };
      let weaponRef = weaponData.refinement;
      weaponRef.group = wepGroup;
      weaponRef.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
      let weaponPhase = weaponData.ascension;
      weaponPhase.group = wepGroup;
      weaponPhase.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
      let weaponLevel = weaponData.level;
      weaponLevel.group = wepGroup;
      weaponLevel.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
      let weaponForgeryMat = weaponData.forgeryMat;
      weaponForgeryMat.group = wepGroup;
      weaponForgeryMat.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
      let weaponStrongMat = weaponData.strongMat;
      weaponStrongMat.group = wepGroup;
      weaponStrongMat.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
      let weaponWeakMat = weaponData.weakMat;
      weaponWeakMat.group = wepGroup;
      weaponWeakMat.dependencies.push({item:this.weapon, field:"location"}, {type:"weapon"});
    }
    else
    {
      let weaponName = {
        group: wepGroup,
        label: "Equipped",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponRef = {
        group: wepGroup,
        label: "Ref",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponPhase = {
        group: wepGroup,
        label: "Phase",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponLevel = {
        group: wepGroup,
        label: "Level",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponForgeryMat = {
        group: wepGroup,
        label: "Forgery Rewards",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponStrongMat = {
        group: wepGroup,
        label: "Strong Drops",
        value: "",
        dependencies: [{type:"weapon"}],
      };
      let weaponWeakMat = {
        group: wepGroup,
        label: "Weak Drops",
        value: "",
        dependencies: [{type:"weapon"}],
      };
    }
    */

    /*
    if traveler
    {
      if(this.base)
      {
        let renderData = super.getRenderData();
        for(let field in renderData)
        {
          if(renderData[field].edit?.target?.item == this && (renderData[field].edit?.target?.field == "ascension" || renderData[field].edit?.target?.field == "level"))
          {
            renderData[field].edit.target.item = this.base;
          }
          if(renderData[field].dependencies?.length)
          {
            let moreDeps = [];
            for(let dep of renderData[field].dependencies)
            {
              if(dep?.item == this && (dep?.field == "ascension" || dep?.field == "level"))
                moreDeps.push({item:this.base, field:dep.field});
            }
            renderData[field].dependencies = renderData[field].dependencies.concat(moreDeps);
          }
        }
        return renderData;
      }
      else
        return null;
    }
    */
  }
  
  fromGOOD(goodData)
  {
    super.fromGOOD(goodData);
    let base = this.get("Traveler") ?? this.addGOOD({"level":1,"constellation":0,"ascension":0,"talent":{"auto":1,"skill":1,"burst":1},"key":"Traveler"});
    let anemo = this.get("TravelerAnemo") ?? this.addGOOD({"level":1,"constellation":0,"ascension":0,"talent":{"auto":1,"skill":1,"burst":1},"key":"TravelerAnemo"});
    let geo = this.get("TravelerGeo") ?? this.addGOOD({"level":1,"constellation":0,"ascension":0,"talent":{"auto":1,"skill":1,"burst":1},"key":"TravelerGeo"});
    let electro = this.get("TravelerElectro") ?? this.addGOOD({"level":1,"constellation":0,"ascension":0,"talent":{"auto":1,"skill":1,"burst":1},"key":"TravelerElectro"});
    let dendro = this.get("TravelerDendro") ?? this.addGOOD({"level":1,"constellation":0,"ascension":0,"talent":{"auto":1,"skill":1,"burst":1},"key":"TravelerDendro"});
    anemo.base = base;
    geo.base = base;
    electro.base = base;
    dendro.base = base;
    base.variants.push(anemo);
    base.variants.push(geo);
    base.variants.push(electro);
    base.variants.push(dendro);
    return this.list.length;
  }
  
  createItem(goodData)
  {
    let item;
    if(goodData.key.startsWith("Traveler"))
      item = new Traveler();
    else
      item = new Character();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    // Overwriting the method to keep Traveler from being deleted, because most GOOD exports only have one version of Traveler, whereas we want all of them.
    // This does depend on the reason for the clear(). If we are importing an updated GOOD file with only one Traveler, then yes, we would want to keep the others intact.
    // However, if we are swapping over to another account with a different Traveler, it'd be better to remove them with everything else.
    // But how do we know which is the intent?
    this.update("list", this.list.filter(item => item instanceof Traveler), "replace");
    this.forceNextRender = true;
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      filter: item => !!item.element,
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
      this.elements.btnAdd.innerHTML = "Add Character";
      this.elements.btnAdd.classList.add("btn", "btn-primary");
      this.elements.btnAdd.addEventListener("click", async event => {
        if(this.elements.selectAdd.value)
        {
          let item = this.addGOOD({
            key: this.elements.selectAdd.value,
            level: 1,
            constellation: 0,
            ascension: 0,
            talent: {
              auto: 1,
              skill: 1,
              burst: 1,
            },
          });
          this.elements.selectAdd.needsUpdate = true;
          this.viewer.store();
          Renderer.renderNewItem(item, {exclude: field => field.tags.indexOf("detailsOnly") > -1});
        }
      });
    }
    if(!this.elements.selectAdd.children.length || this.elements.selectAdd.needsUpdate)
    {
      this.elements.selectAdd.innerHTML = "";
      this.elements.selectAdd.appendChild(document.createElement("option"))
      for(let chara in GenshinCharacterData)
      {
        if(!this.get(chara))
        {
          let option = this.elements.selectAdd.appendChild(document.createElement("option"));
          option.value = chara;
          option.innerHTML = GenshinCharacterData[chara].name;
        }
      }
    }
  }
}
