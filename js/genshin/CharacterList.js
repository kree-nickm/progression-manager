import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";

import { handlebars, Renderer } from "../Renderer.js";
import { mergeObjects } from "../Util.js";
import GenshinList from "./GenshinList.js";
import Character from "./Character.js";
import Traveler from "./Traveler.js";
import Artifact from "./Artifact.js";

export default class CharacterList extends GenshinList
{
  static unique = true;
  static itemClass = [Character,Traveler];
  static subsetDefinitions = {
    'traveler': item => item instanceof Traveler && item.owned,
    'nottraveler': item => !(item instanceof Traveler) && item.owned,
    'equippable': item => (!(item instanceof Traveler) || !item.base) && item.owned,
    'listable': item => (!(item instanceof Traveler) || item.base) && item.owned,
    
    'traveler-all': item => item instanceof Traveler,
    'nottraveler-all': item => !(item instanceof Traveler),
    'equippable-all': item => (!(item instanceof Traveler) || !item.base),
    'listable-all': item => (!(item instanceof Traveler) || item.base),
    
    'owned': item => item.owned,
    'unowned': item => !item.owned,
  };
  
  static fromJSON(data, options)
  {
    for(let key in data?.list??[])
      if(data.list[key] === undefined)
        data.list[key].owned = true;
    let list = super.fromJSON(data, options);
    list.addTraveler();
    list.addRemaining();
    return list;
  }
  
  targetEnemyData = {};
  
  setupDisplay()
  {
    let favorite = this.display.addField("favorite", {
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
    
    let name = this.display.addField("name", {
      label: "Name",
      labelTitle: "Sort by name.",
      popup: item => item,
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: item => item.viewer.settings.preferences.characterList=='1' ? {
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
      title: item => `Click to open a popup to examine ${item.name} in-depth.`,
    });
    
    let icon = this.display.addField("icon", {
      label: "Name",
      labelTitle: "Sort by name.",
      tags: ["detailsOnly"],
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: (item,size="sm",badge,caption) => {
        if(size.endsWith("xs"))
        {
          badge = null;
          caption = null;
        }
        else
        {
          switch(parseInt(badge))
          {
            case 1:
              badge = `C${item.constellation}`;
              break;
          }
          switch(parseInt(caption))
          {
            case 1:
              caption = `${item.level} / ${item.levelCap}`;
              break;
          }
        }
        return {
          tag: "div",
          value: [
            {
              tag: "div",
              value: [
                badge ? {
                  value: badge,
                  classes: {"small": true, "display-badge": true},
                } : undefined,
                item.base ? {
                  tag: "img",
                  src: `img/Element_${item.element}.svg`,
                  classes: {"small": true, "display-badge": true, "badge-right": true, "element-icon": true},
                } : undefined,
                {
                  tag: "img",
                  src: item.image,
                  alt: item.name,
                },
              ],
              classes: {"display-img": true, ["rarity-"+item.rarity]: !size.endsWith("xs")},
            },
            caption ? {
              value: caption,
              classes: {"display-caption": true},
            } : undefined,
          ],
          classes: {
            "item-display": true,
            ["display-"+size]: true,
            "display-no-caption": !caption,
          },
          title: item.name,
        };
      }
    });
    
    let weaponType = this.display.addField("weaponType", {
      label: "Wpn",
      labelTitle: "Sort by weapon type.",
      sort: {generic: {type:"string",property:"weaponType"}},
      dynamic: false,
      title: item => item.weaponType,
      value: item => ({
        tag: "img",
        classes: {'weapon-icon':true},
        src: `img/Weapon_${item.weaponType}.png`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let element = this.display.addField("element", {
      label: "Elm",
      labelTitle: "Sort by element.",
      sort: {generic: {type:"string",property:"element"}},
      dynamic: false,
      title: item => item.element,
      value: item => ({
        tag: "img",
        classes: {'element-icon':true},
        src: `img/Element_${item.element}.svg`,
      }),
      classes: item => ({
        'icon': true,
      }),
    });
    
    let ascension = this.display.addField("ascension", {
      label: "",
      labelTitle: "Sort by phase/ascension.",
      sort: {generic: {type:"number",property:"ascension"}},
      dynamic: true,
      title: item => "Click to change." + (item.canUpPhase(true) ? "\r\nNote: You have enough materials to ascend. Open character details to use the ascension feature." : ""),
      value: item => item.ascension,
      edit: item => ({target: {item:item.base??item, field:"ascension"}, min:0, max:6}),
      classes: item => ({
        'can-inc': item.canUpPhase(true),
        "at-max": item.ascension >= 6,
      }),
      dependencies: item => [
        {item:item.base??item, field:"ascension"},
        {item:item.getMat('gem'), field:"count"},
        item.getMat('boss') ? {item:item.getMat('boss'), field:"count"} : null,
        {item:item.getMat('flower'), field:"count"},
        {item:item.getMat('enemy'), field:"count"},
      ].concat(item.getMat('gem').getCraftDependencies()).concat(item.getMat('enemy').getCraftDependencies()),
    });
    
    let level = this.display.addField("level", {
      label: "Lvl",
      labelTitle: "Sort by character level.",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.level,
      edit: item => ({target: {item:item.base??item, field:"level"}, min:1, max:90}),
      classes: item => ({
        "at-max": item.level >= item.levelCap,
      }),
      dependencies: item => [
          {item:item.base??item, field:"level"},
          {item:item.getMat('gem'), field:"count"},
          item.getMat('boss') ? {item:item.getMat('boss'), field:"count"} : null,
          {item:item.getMat('flower'), field:"count"},
          {item:item.getMat('enemy'), field:"count"},
          {item:item.base??item, field:"ascension"},
        ].concat(item.getMat('gem').getCraftDependencies()).concat(item.getMat('enemy').getCraftDependencies()),
    });
    
    let constellation = this.display.addField("constellation", {
      label: "Con",
      labelTitle: "Sort by number of constellations.",
      sort: {generic: {type:"number",property:"constellation"}},
      dynamic: true,
      value: item => item.constellation,
      title: item => "Click to change.",
      classes: item => ({
        "at-max": item.constellation >= 6,
      }),
      edit: item => ({target: {item, field:"constellation"}, min:0, max:6}),
    });
    
    let iconLookup = {
      'auto': `<i class="fa-solid fa-a"></i>`,
      'skill': `<i class="fa-solid fa-e"></i>`,
      'burst': `<i class="fa-solid fa-q"></i>`,
      'Mastery': `<i class="fa-solid fa-dungeon mx-1"></i>`,
      'Enemy': `<i class="fa-solid fa-skull mx-1"></i>`,
      'Trounce': `<i class="fa-solid fa-calendar-week"></i>`,
      'Crown': `<i class="fa-solid fa-crown"></i>`,
      'gem': `<i class="fa-solid fa-gem"></i>`,
      'boss': `<i class="fa-solid fa-spaghetti-monster-flying"></i>`,
      'flower': `<i class="fa-solid fa-fan"></i>`,
      'enemy': `<i class="fa-solid fa-skull"></i>`,
      'Mora': `<i class="fa-solid fa-coins"></i>`,
      'mora': `<i class="fa-solid fa-coins"></i>`,
    };
    for(let i of ["auto","skill","burst"])
    {
      let talent = this.display.addField(i+"Talent", {
        label: iconLookup[i],
        labelTitle: `Sort by "${i}" talent level.`,
        dynamic: true,
        value: item => item.talent[i],
        title: item => (item.getTalent(i).matTrounceCount ? `Also requires ${item.getTalent(i).matTrounceCount} ${item.MaterialList.trounce.name}, dropped by ${item.MaterialList.trounce.source} (you have ${item.MaterialList.trounce.getCraftCount()})` : ""),
        edit: item => ({target: {item, field:["talent", i]}, min:1, max:10}),
        classes: item => ({
          "can-inc": item.canUpTalent(i, true),
          "at-max": item.talent[i] >= item.talentCap,
        }),
        sort: {generic: {type:"number",property:["talent",i]}},
        dependencies: item => [
            {item:item.viewer.lists.MaterialList.get("Mora"), field:"count"},
            {item:item.getTalentMat('mastery',i), field:"count"},
            {item:item.getTalentMat('enemy',i), field:"count"},
            {item:item.base??item, field:"ascension"},
            item.getTalentMat('mastery',i)?.days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat('mastery',i)?.getCraftDependencies()).concat(item.getTalentMat('enemy',i)?.getCraftDependencies()),
      });
    }
    
    let mats = [
      {t:"gem",l:"Gems"},
      {t:"boss",l:"World Boss"},
      {t:"flower",l:"Flora"},
      {t:"enemy",l:"Enemy Drops"},
      {t:"mora",l:"Mora"},
    ];
    this.display.addField("ascensionMaterial", {
      group: {label:"Ascension Materials"},
      label: (item, type, phase) => iconLookup[type] ?? type,
      labelTitle: (item, type, phase) => mats.find(m=>m.t==type)?.l,
      /*sort: isNaN(phase) ? {func: (o,a,b) => {
        let A = a.getMat(mat.t,phase)?.shorthand??"";
        let B = b.getMat(mat.t,phase)?.shorthand??"";
        if(!A && B)
          return 1;
        else if(A && !B)
          return -1;
        else if(!A && !B)
          return 0;
        else
          return o*A.localeCompare(B);
      }} : undefined,*/
      columnClasses: ["ascension-materials"],
      dynamic: true,
      value: (item, type, phase) => type == "label" ? `${phase} ➤ ${phase+1}` : (item.getMat(type,phase) && item.getMatCost(type,phase) ? item.getMat(type,phase).getFieldValue(item.getMatCost(type,phase), this.viewer.settings.preferences.characterList=='1') : ""),
      dependencies: (item, type, phase) => [
        {item:item.base??item, field:"ascension"},
        {item:item.viewer.lists.MaterialList.get("Mora"), field:"count"},
      ].concat(type == "label" ?
        [
          {item:item.getMat('gem',phase), field:"count"},
          item.getMat('boss',phase) ? {item:item.getMat('boss',phase), field:"count"} : null,
          {item:item.getMat('flower',phase), field:"count"},
          {item:item.getMat('enemy',phase), field:"count"},
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
    
    let talGroup = {label:"Talent Materials", startCollapsed:true};
    this.display.addField("talentMaterial", {
      group: talGroup,
      label: (item, type, level) => iconLookup[type] + (isNaN(level) ? iconLookup[level] : ""),
      labelTitle: (item, type, level) => type + (isNaN(level) ? ` (${level})` : ""),
      columnClasses: (item, type, level) => [(isNaN(level)?level:"talent")+'-'+type?.toLowerCase()],
      dynamic: true,
      value: (item, type, level) => item.getTalentMat(type?.toLowerCase(),level) && item.getTalent(level)['mat'+type+'Count'] ? (item.getTalentMat(type?.toLowerCase(),level)?.getFieldValue(item.getTalent(level)['mat'+type+'Count'], this.viewer.settings.preferences.characterList=='1')??"!ERROR!") : "",
      title: (item, type, level) => item.getTalentMat(type?.toLowerCase(),level)?.getFullSource()??"!ERROR!",
      dependencies: (item, type, level) => [
        {item, field:["talent", level]},
        {item:item.viewer.lists.MaterialList.get("Mora"), field:"count"},
        item.getTalentMat(type?.toLowerCase(),level)?.days ? {item:this.viewer, field:"today"} : {},
      ].concat(item.getTalentMat(type?.toLowerCase(),level)?.getCraftDependencies()??[]),
    });
    for(let i of ["auto","skill","burst",1,2,3,4,5,6,7,8,9])
    {
      for(let m of ["Mastery","Enemy","Trounce","Crown","Mora"])
      {
        let talentMat = this.display.addField(isNaN(i) ? i+m+"Mat" : "talent"+m+"Mat"+i, {
          group: talGroup,
          label: iconLookup[m] + (isNaN(i) ? iconLookup[i] : ""),
          labelTitle: m + (isNaN(i) ? ` (${i})` : ""),
          sort: isNaN(i) ? {func: (o,a,b) => {
            let A = a.getTalentMatType(m.toLowerCase(),i)??"";
            let B = b.getTalentMatType(m.toLowerCase(),i)??"";
            if(!A && B)
              return 1;
            else if(A && !B)
              return -1;
            else if(!A && !B)
              return 0;
            else
              return o*A.localeCompare(B);
          }} : undefined,
          columnClasses: [(isNaN(i)?i:"talent")+'-'+m.toLowerCase()],
          tags: isNaN(i) & m != "Trounce" && m != "Crown" && m != "Mora" ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getTalentMat(m.toLowerCase(),i) && item.getTalent(i)['mat'+m+'Count'] ? (item.getTalentMat(m.toLowerCase(),i)?.getFieldValue(item.getTalent(i)['mat'+m+'Count'], this.viewer.settings.preferences.characterList=='1')??"!ERROR!") : "",
          title: item => item.getTalentMat(m.toLowerCase(),i)?.getFullSource()??"!ERROR!",
          dependencies: item => [
            {item, field:["talent", i]},
            {item:item.viewer.lists.MaterialList.get("Mora"), field:"count"},
            item.getTalentMat(m.toLowerCase(),i)?.days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat(m.toLowerCase(),i)?.getCraftDependencies()??[]),
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
            {item:item.viewer.lists.MaterialList.get("Mora"), field:"count"},
            {item:item.getTalentMat('mastery','auto'), field:"count"},
            {item:item.getTalentMat('enemy','auto'), field:"count"},
            {item:item.getTalentMat('mastery','skill'), field:"count"},
            {item:item.getTalentMat('enemy','skill'), field:"count"},
            {item:item.getTalentMat('mastery','burst'), field:"count"},
            {item:item.getTalentMat('enemy','burst'), field:"count"},
            {item:item.base??item, field:"ascension"},
          ],
          button: item => [
            (item.talent.auto != i) ? null : {
              title: item.talent.auto < item.getPhase().maxTalent && item.canUpTalent('auto', false) ? "Level up the talent. This will spend the resources for you." : item.talent.auto < item.getPhase().maxTalent ? "Not enough materials to level up." : "You've reached the maximum talent level for this character's ascension.",
              name: "auto",
              text: "auto",
              icon: item.talent.auto < item.getPhase().maxTalent ? "fa-solid fa-circle-up" : undefined,
              action: item.talent.auto < item.getPhase().maxTalent && item.canUpTalent('auto', false) ? item.upTalent.bind(item, 'auto') : undefined,
            },
            (item.talent.skill != i) ? null : {
              title: item.talent.skill < item.getPhase().maxTalent && item.canUpTalent('skill', false) ? "Level up the talent. This will spend the resources for you." : item.talent.skill < item.getPhase().maxTalent ? "Not enough materials to level up." : "You've reached the maximum talent level for this character's ascension.",
              name: "skill",
              text: "skill",
              icon: item.talent.skill < item.getPhase().maxTalent ? "fa-solid fa-circle-up" : undefined,
              action: item.talent.skill < item.getPhase().maxTalent && item.canUpTalent('skill', false) ? item.upTalent.bind(item, 'skill') : undefined,
            },
            (item.talent.burst != i) ? null : {
              title: item.talent.burst < item.getPhase().maxTalent && item.canUpTalent('burst', false) ? "Level up the talent. This will spend the resources for you." : item.talent.burst < item.getPhase().maxTalent ? "Not enough materials to level up." : "You've reached the maximum talent level for this character's ascension.",
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
      value: item => Artifact.getStatShorthand(item.ascendStat),
    });
    
    let statField = this.display.addField("stat", {
      label: (item,stat,mode,situation) => Artifact.getStatShorthand(stat),
      tags: ["detailsOnly"],
      dynamic: true,
      title: (item,stat,mode,situation) => {
        mode = parseInt(mode);
        if(mode == 2)
        {
          let currentstat = item.getStat(stat, {situation, preview:0});
          let previewstat = item.getStat(stat, {situation, preview:1});
          let result = (previewstat-currentstat)/currentstat;
          return result || "";
        }
        else
          return item.getStat(stat, {situation, preview:mode==1, unmodified:mode==-1, substats:mode==-2});
      },
      value: (item,stat,mode,situation) => {
        mode = parseInt(mode);
        if(mode == 2)
        {
          let currentstat = item.getStat(stat, {situation, preview:0});
          let previewstat = item.getStat(stat, {situation, preview:1});
          let result = (previewstat-currentstat)/currentstat*100;
          return result ? ((previewstat-currentstat)/currentstat*100).toFixed(1)+"%" : "";
        }
        else
          return item.getStat(stat, {situation, preview:mode==1, unmodified:mode==-1, substats:mode==-2})?.toFixed(stat.slice(-1)=="_" ? 1 : ["melt-forward","vaporize-forward","melt-reverse","vaporize-reverse"].indexOf(stat) > -1 ? 3 : 0)??"null";
      },
      dependencies: (item,stat,mode,situation) => [
        {item:item.base??item, field:"constellation"},
        {item:item.base??item, field:"ascension"},
        {item:item.base??item, field:"level"},
        {item:item.base??item, field:"statModifiers"},
        {item:item.list, field:"targetEnemyData"},
        mode ? {item:item.base??item, field:"preview"} : null,
        item.weapon ? {item:item.weapon, field:"location"} : null,
        item.weapon ? {item:item.weapon, field:"refinement"} : null,
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
    
    let mvField = this.display.addField("mv", {
      label: (item,talent,mv,preview) => mv,
      tags: ["detailsOnly"],
      dynamic: true,
      title: (item,talent,mv,preview,format) => {
        preview = parseInt(preview);
        format = parseInt(format);
        if(preview == 2)
        {
          let currentMotionValue = item.getMotionValues(talent,{preview:0}).find(v => v.rawKey == mv).final;
          let previewMotionValue = item.getMotionValues(talent,{preview:1}).find(v => v.rawKey == mv).final;
          let result = (previewMotionValue-currentMotionValue)/currentMotionValue;
          return result || "";
        }
        else
        {
          let motionValue = item.getMotionValues(talent,{preview}).find(v => v.rawKey == mv);
          if(motionValue)
          {
            if(format==-1)
              return motionValue.rawKey;
            else if(format==1)
              return Object.keys(motionValue)
                .filter(k => !['string','newKey'].includes(k))
                .map(k => k != 'values'
                  ? `${k}: ${String(motionValue[k])}`
                  : motionValue[k].map((v,i) => Object.keys(v).map(kk => `${k}[${i}].${kk}: ${String(v[kk])}`).join(`\r\n`)).join(`\r\n`))
                .join(`\r\n`);
            else
              return motionValue.rawValue;
          }
          else
            return "null";
        }
      },
      value: (item,talent,mv,preview,format) => {
        preview = parseInt(preview);
        format = parseInt(format);
        if(preview == 2)
        {
          let currentMotionValue = item.getMotionValues(talent,{preview:0}).find(v => v.rawKey == mv).final;
          let previewMotionValue = item.getMotionValues(talent,{preview:1}).find(v => v.rawKey == mv).final;
          let result = (previewMotionValue-currentMotionValue)/currentMotionValue*100;
          return result ? result.toFixed(1)+"%" : "";
        }
        else
        {
          let motionValue = item.getMotionValues(talent,{preview}).find(v => v.rawKey == mv);
          if(motionValue)
          {
            if(format==1)
              return typeof(motionValue.final)=="number" ? motionValue.final.toFixed(0) : motionValue.final;
            else if(format==-1)
              return motionValue.newKey;
            else
              return motionValue.string;
          }
          else
            return "null";
        }
      },
      dependencies: (item,talent,mv,preview,format) => [
        {item:item, field:"constellation"},
        {item:item.base??item, field:"ascension"},
        {item:item.base??item, field:"level"},
        {item:item, field:"talent"},
        {item:item, field:"statModifiers"},
        {item:item.list, field:"targetEnemyData"},
        preview ? {item:item.base??item, field:"preview"} : null,
        item.weapon ? {item:item.weapon, field:"location"} : null,
        item.weapon ? {item:item.weapon, field:"refinement"} : null,
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
    
    let gearGroup = {label:"Gear", startCollapsed:true};
    /*
    // Note: This is a potential future implementation, for future reference.
    let weaponName = this.display.transferField(this.viewer.lists.WeaponList.display.getField("name"), "weaponName", {
      item: item => item.weapon,
      group: gearGroup,
      label: "Weapon",
      dynamic: true,
      dependencies: item => [
        item.weapon ? {item:item.weapon, field:"location"} : undefined,
        item.weapon ? {item:item.weapon, field:"refinement"} : undefined,
        item.weapon ? {item:item.weapon, field:"level"} : undefined,
        {type:"weapon"},
      ],
    });
    */
    this.display.addField("weaponName", {
      group: gearGroup,
      label: "",
      dynamic: true,
      popup: item => item.weapon,
      value: (item,useImages=this.viewer.settings.preferences.characterList,size="sm") => item.weapon ? (useImages=='1' ? {
        tag: "div",
        value: [
          {
            tag: "div",
            value: [
              {
                value: item.weapon.refinement,
                classes: {
                  "display-badge": true,
                  "badge-gold": item.weapon.refinement == 5,
                },
                title: `Refinement Rank ${item.weapon.refinement}`,
              },
              {
                tag: "img",
                src: item.weapon.image,
                alt: item.weapon.name,
              }
            ],
            classes: {"display-img": true, ["rarity-"+item.weapon.rarity]: true},
          },
          {
            value: `${item.weapon.level} / ${item.weapon.levelCap}`,
            classes: {"display-caption": true},
          }
        ],
        classes: {
          "item-display": true,
          "item-material": true,
          ["display-"+size]: true,
        },
      } : [
        {
          value: item.weapon.display.getField("name").get("value", item.weapon),
          classes: item.weapon.display.getField("name").get("classes", item.weapon),
        },
        {
          value: `R${item.weapon.refinement}, Lv.${item.weapon.level}`,
        },
      ]) : "",
      title: item => item.weapon ? `Click to open a popup to examine ${item.weapon.name} in-depth.` : "",
      columnClasses: ["character-weapon"],
      dependencies: item => [
        item.weapon ? {item:item.weapon, field:"location"} : undefined,
        item.weapon ? {item:item.weapon, field:"refinement"} : undefined,
        item.weapon ? {item:item.weapon, field:"level"} : undefined,
        {type:"weapon"},
      ],
    });
    
    for(let slotKey of ["flower","plume","sands","goblet","circlet"])
    {
      let artifactField = this.display.addField(slotKey, {
        group: gearGroup,
        label: `<img src="img/${slotKey}.webp"/>`,
        dynamic: true,
        //popup: item => item[slotKey+'Artifact'],
        value: (item,useImages=this.viewer.settings.preferences.characterList,size="sm") => {
          let artifact = item[slotKey+'Artifact'];
          return artifact ? (useImages=='1' ? {
            tag: "div",
            value: [
              {
                tag: "div",
                value: [
                  {
                    tag: "div",
                    value: [
                      {
                        value: `+${artifact.level}`,
                        classes: {"small": true, "display-badge": true, "badge-gold":artifact.level==20},
                      },
                      {
                        tag: "img",
                        src: artifact.image,
                        alt: artifact.name,
                      }
                    ],
                    classes: {"display-img": true, ["rarity-"+artifact.rarity]: true},
                  },
                  {
                    value: artifact.display.getField("mainStat").get("value", artifact),
                    classes: {"display-caption": true, "highlighter":true, ["highlight-"+(['hp_','atk_','def_'].indexOf(artifact.mainStatKey)>-1?artifact.mainStatKey.slice(0,-1):artifact.mainStatKey)]:true},
                  },
                ],
                classes: {
                  "item-display": true,
                  "item-material": true,
                  ["display-"+size]: true,
                },
                background: artifact.display.getField("characterScore").get("value", artifact, item).color.replace("0.9", "0.6"),
                title: artifact.display.getField("characterScore").get("title", artifact, item),
              },
              {
                tag: "div",
                value: [0,1,2,3].map(i => artifact.substats[i] ? {
                  value: artifact.display.getField("substat").get("value", artifact, i),
                  title: artifact.display.getField("substat").get("title", artifact, i),
                  classes: {"substat":true, "highlighter":true, ["highlight-"+(['hp_','atk_','def_'].indexOf(artifact.substats[i].key)>-1?artifact.substats[i].key.slice(0,-1):artifact.substats[i].key)]:true},
                } : ""),
                classes: {"artifact-mini-stats": true},
              },
            ],
            classes: {"artifact-mini": true},
          } : [
        // Begin text-only rendering.
            {
              value: artifact.display.getField("characterScore").get("value", artifact, item),
              title: artifact.display.getField("characterScore").get("title", artifact, item),
              shadow: "0px 0px 3px black",
            },
            {
              value: `+${artifact.level}`,
            },
            {
              value: artifact.display.getField("set").get("value", artifact),
              classes: artifact.display.getField("set").get("classes", artifact),
            },
          ]) : "";
        },
        dependencies: item => [
          item[slotKey+'Artifact'] ? {item:item[slotKey+'Artifact'], field:"location"} : undefined,
          item[slotKey+'Artifact'] ? {item:item[slotKey+'Artifact'], field:"level"} : undefined,
          item[slotKey+'Artifact'] ? {item:item[slotKey+'Artifact'], field:"substats"} : undefined,
          {item:item, field:"buildData"},
          {item:item, field:"selectedBuild"},
          {type:slotKey+'Artifact'},
        ],
      });
    }
     
    this.display.addField("equipWeapon", {
      label: "Weapon",
      dynamic: true,
      value: item => item.weapon ? {
        value: [
          {
            value: `R${item.weapon.refinement} ${item.weapon.name} Lv.${item.weapon.level}`,
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
        value: item.weapon ? `R${item.weapon.refinement} ${item.weapon.name} Lv.${item.weapon.level}` : "-",
        displayProperty: wpn => `R${wpn.refinement} ${wpn.name} Lv.${wpn.level}`,
      }),
      dependencies: item => [
        {item:item.list.viewer.lists.WeaponList, field:"list"},
        item.weapon ? {item:item.weapon, field:"location"} : undefined,
        item.weapon ? {item:item.weapon, field:"refinement"} : undefined,
        item.weapon ? {item:item.weapon, field:"level"} : undefined,
        {type:"weapon"},
      ],
    });
    
    this.display.addField("activeTeam", {
      label: "Active Team",
      title: "If you have a team set up with this character, you can select it here to see the team-wide modifiers provided by other members of the team.",
      tags: ["detailsOnly"],
      dynamic: true,
      edit: item => ({
        target: {item, field:"activeTeam"},
        type: "select",
        list: item.teams,
        value: item.activeTeam?.name ?? "",
        defaultOption: {value: "", display: "Select team..."},
        valueProperty: "uuid",
        valueFormat: "uuid",
        displayProperty: "name",
        alwaysShow: true,
      }),
      dependencies: item => [
      ],
    });
    
    this.display.addField("teammate", {
      label: "Teammate",
      tags: ["detailsOnly"],
      dynamic: true,
      value: (item,index) => {
        let teammates = item.activeTeam?.characters.filter(teammate => teammate != item) ?? [];
        if(teammates[index])
        {
          return {
            value: teammates[index].name,
            popup: teammates[index],
          };
        }
        else
          return "";
      },
      dependencies: item => [
        {item:item, field:"activeTeam"},
      ],
    });
    
    this.display.addField("previewLevel", {
      dynamic: true,
      value: item => item.previews.level ?? item.level,
      edit: item => ({target: {item, field:"previews.level"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewAscension", {
      dynamic: true,
      value: item => item.previews.ascension ?? item.ascension,
      edit: item => ({target: {item, field:"previews.ascension"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewConstellation", {
      dynamic: true,
      value: item => item.previews.constellation ?? item.constellation,
      edit: item => ({target: {item, field:"previews.constellation"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewTalent", {
      dynamic: true,
      value: (item,talent) => item.previews.talent?.[talent] ?? item.talent[talent],
      edit: (item,talent) => ({target: {item, field:"previews.talent."+talent}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewWeapon", {
      dynamic: true,
      value: item => GenshinWeaponData[item.previews.weaponKey]?.name ?? item.weapon?.name ?? "",
      edit: item => ({
        type: "select",
        target: {item, field:"previews.weaponKey"},
        alwaysShow: true,
        list: Object.keys(GenshinWeaponData).filter(wKey => GenshinWeaponData[wKey].type == item.weaponType).map(wKey => ({value: wKey, display: GenshinWeaponData[wKey].name})),
        valueProperty: "value",
        displayProperty: "display",
        defaultOption: {value:"", display:"(No preview)"},
      }),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewWeaponLevel", {
      dynamic: true,
      value: item => item.previews.weaponLevel ?? item.weapon?.level ?? 1,
      edit: item => ({target: {item, field:"previews.weaponLevel"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewWeaponAscension", {
      dynamic: true,
      value: item => item.previews.weaponAscension ?? item.weapon?.ascension ?? 0,
      edit: item => ({target: {item, field:"previews.weaponAscension"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewWeaponRefinement", {
      dynamic: true,
      value: item => item.previews.weaponRefinement ?? item.weapon?.refinement ?? 1,
      edit: item => ({target: {item, field:"previews.weaponRefinement"}, alwaysShow:true}),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewArtifactSet", {
      dynamic: true,
      value: (item,num) => {
        if(GenshinArtifactData[item.previews.artifactSet?.[num]]?.name)
          return GenshinArtifactData[item.previews.artifactSet?.[num]]?.name;
        let sets = item.getSetBonuses();
        for(let set in sets)
        {
          if(sets[set].count >= 4)
            return GenshinArtifactData[set]?.name;
          else if(sets[set].count >= 2)
          {
            if(num == 0)
              return GenshinArtifactData[set]?.name;
            else
              num--;
          }
        }
        return "";
      },
      edit: (item,num) => ({
        type: "select",
        target: {item, field:"previews.artifactSet."+num},
        alwaysShow: true,
        list: Object.keys(GenshinArtifactData).filter(aKey => GenshinArtifactData[aKey].bonus4).map(aKey => ({value: aKey, display: GenshinArtifactData[aKey].name})),
        valueProperty: "value",
        displayProperty: "display",
        defaultOption: {value:"", display:"(No preview)"},
      }),
      dependencies: item => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("previewArtifactStat", {
      dynamic: true,
      value: (item,slotKey) => Character.getStatFull(item.previews[slotKey+'Stat'] ?? item[slotKey+'Artifact']?.mainStatKey),
      edit: (item,slotKey) => ({
        type: "select",
        target: {item, field:`previews.${slotKey}Stat`},
        alwaysShow: true,
        list: ({sands:["hp_","atk_","def_","eleMas","enerRech_"],goblet:["hp_","atk_","def_","eleMas","anemo_dmg_","cryo_dmg_","dendro_dmg_","electro_dmg_","geo_dmg_","hydro_dmg_","pyro_dmg_","physical_dmg_"],circlet:["hp_","atk_","def_","eleMas","critRate_","critDMG_","heal_"]})[slotKey].map(statId => ({value:statId, display:Character.getStatFull(statId)})),
        valueProperty: "value",
        displayProperty: "display",
        defaultOption: {value:"", display:"(No preview)"},
      }),
      dependencies: (item,slotKey) => [
        {item:item, field:"previews"},
      ],
    });
    
    this.display.addField("planLevel", {
      dynamic: true,
      value: item => item.wishlist.level ?? "-",
      edit: item => ({target: {item, field:"wishlist.level"}}),
      dependencies: item => [
        {item:item, field:"wishlist"},
        {item:item, field:"level"},
      ],
    });
    
    this.display.addField("planAscension", {
      dynamic: true,
      value: item => item.wishlist.ascension ?? "-",
      edit: item => ({target: {item, field:"wishlist.ascension"}}),
      dependencies: item => [
        {item:item, field:"wishlist"},
        {item:item, field:"ascension"},
      ],
    });
    
    this.display.addField("planTalent", {
      dynamic: true,
      value: (item,talent) => item.wishlist.talent?.[talent] ?? "-",
      edit: (item,talent) => ({target: {item, field:"wishlist.talent."+talent}}),
      dependencies: (item,talent) => [
        {item:item, field:"wishlist"},
        {item:item, field:"talent."+talent},
      ],
    });
    
    this.display.addField("planMaterials", {
      dynamic: true,
      value: (item,attr) => {
        let value = [];
        let materials = item.getPlanMaterials();
        for(let matKey in materials)
          value.push({classes:{'plan-material':true}, value:this.viewer.lists.MaterialList.get(matKey).getFieldValue(materials[matKey], this.viewer.settings.preferences.characterList=='1')});
        return value;
      },
      dependencies: (item,attr) => [
        {item:item, field:"wishlist"},
        {item:item, field:"level"},
        {item:item, field:"ascension"},
        {item:item, field:"talent"},
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
  
  addTraveler()
  {
    let base = this.get("Traveler");
    let anemo = this.get("TravelerAnemo");
    let geo = this.get("TravelerGeo");
    let electro = this.get("TravelerElectro");
    let dendro = this.get("TravelerDendro");
    let hydro = this.get("TravelerHydro");
    //let pyro = this.get("TravelerPyro");
    //let cryo = this.get("TravelerCryo");
    
    if(!base)
    {
      base = Traveler.fromJSON({__class__:"Traveler",key:"Traveler"}, {addProperties:{list:this}});
      this.update("list", base, "push");
    }
    if(!anemo)
    {
      anemo = Traveler.fromJSON({__class__:"Traveler",key:"TravelerAnemo"}, {addProperties:{list:this}});
      this.update("list", anemo, "push");
    }
    if(!geo)
    {
      geo = Traveler.fromJSON({__class__:"Traveler",key:"TravelerGeo"}, {addProperties:{list:this}});
      this.update("list", geo, "push");
    }
    if(!electro)
    {
      electro = Traveler.fromJSON({__class__:"Traveler",key:"TravelerElectro"}, {addProperties:{list:this}});
      this.update("list", electro, "push");
    }
    if(!dendro)
    {
      dendro = Traveler.fromJSON({__class__:"Traveler",key:"TravelerDendro"}, {addProperties:{list:this}});
      this.update("list", dendro, "push");
    }
    if(!hydro)
    {
      hydro = Traveler.fromJSON({__class__:"Traveler",key:"TravelerHydro"}, {addProperties:{list:this}});
      this.update("list", hydro, "push");
    }
    /*if(!pyro)
    {
      pyro = Traveler.fromJSON({__class__:"Traveler",key:"TravelerPyro"}, {addProperties:{list:this}});
      this.update("list", pyro, "push");
    }*/
    /*if(!cryo)
    {
      cryo = Traveler.fromJSON({__class__:"Traveler",key:"TravelerCryo"}, {addProperties:{list:this}});
      this.update("list", cryo, "push");
    }*/
    
    anemo.base = base;
    geo.base = base;
    electro.base = base;
    dendro.base = base;
    hydro.base = base;
    //pyro.base = base;
    //cryo.base = base;
    
    base.variants = [anemo,geo,electro,dendro,hydro/*,pyro,cyro*/];
  }
  
  addRemaining()
  {
    for(let key in GenshinCharacterData)
      if(!this.get(key))
        this.createItem({key}).update("owned", false);
  }
  
  fromGOOD(goodData)
  {
    let result = super.fromGOOD(goodData);
    this.addTraveler();
    this.items().forEach(item => item.update("owned", true));
    return result;
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
    this.items("nottraveler").forEach(item => item.update("owned", false));
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  prepareRender(element, data, options)
  {
    data.filter = "listable";
    data.fields = [];
    data.fields.push({field:this.display.getField("favorite"), params:[]});
    data.fields.push({field:this.display.getField("name"), params:[]});
    data.fields.push({field:this.display.getField("weaponType"), params:[]});
    data.fields.push({field:this.display.getField("element"), params:[]});
    data.fields.push({field:this.display.getField("ascension"), params:[]});
    data.fields.push({field:this.display.getField("level"), params:[]});
    data.fields.push({field:this.display.getField("constellation"), params:[]});
    data.fields.push({field:this.display.getField("autoTalent"), params:[]});
    data.fields.push({field:this.display.getField("skillTalent"), params:[]});
    data.fields.push({field:this.display.getField("burstTalent"), params:[]});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['gem']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['boss']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['flower']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['enemy']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Mastery', 'auto']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Enemy', 'auto']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Mastery', 'skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Enemy', 'skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Mastery', 'burst']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['Enemy', 'burst']});
    data.fields.push({field:this.display.getField("weaponName"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("flower"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("plume"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("sands"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("goblet"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("circlet"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.groups = this.display.getGroups({fields: data.fields.map(fieldTuple => fieldTuple.field)});
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
      let li2 = ul.appendChild(document.createElement("li"));
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
      }
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
