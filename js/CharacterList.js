import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";

import { handlebars, Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Character from "./Character.js";
import Traveler from "./Traveler.js";
import Artifact from "./Artifact.js";

export default class CharacterList extends GenshinList
{
  static unique = true;
  static itemClass = [Character,Traveler];
  static subsetDefinitions = {
    'traveler': item => item instanceof Traveler,
    'nottraveler': item => !(item instanceof Traveler),
    'equippable': item => !(item instanceof Traveler) || !item.base,
    'listable': item => !(item instanceof Traveler) || item.base,
  };
  
  static fromJSON(data, options)
  {
    let list = super.fromJSON(data, options);
    list.addTraveler();
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
      title: item => "Click to change.",
      value: item => item.ascension,
      edit: item => ({target: {item:item.base??item, field:"ascension"}}),
      dependencies: item => [
        {item:item.base??item, field:"ascension"},
        {item:item.getMat('gem'), field:"count"},
        item.getMat('boss') ? {item:item.getMat('boss'), field:"count"} : null,
        {item:item.getMat('flower'), field:"count"},
        {item:item.getMat('enemy'), field:"count"},
      ].concat(item.getMat('gem').getCraftDependencies()).concat(item.getMat('enemy').getCraftDependencies()),
      button: item => {
        if(item.canUpPhase(false))
          return {
            title: "Ascend the character. This will spend the resources for you and increase their level if necessary.",
            icon: "fa-solid fa-circle-up",
            action: item.upPhase.bind(item),
          };
        else if(item.canUpPhase(true))
          return {
            title: "Not enough materials to ascend, but you have enough lower quality materials to craft them.",
            icon: "fa-solid fa-circle-up"
          };
      },
    });
    
    let level = this.display.addField("level", {
      label: "Lvl",
      labelTitle: "Sort by character level.",
      sort: {generic: {type:"number",property:"level"}},
      dynamic: true,
      title: item => "Click to change.",
      value: item => item.level,
      edit: item => ({target: {item:item.base??item, field:"level"}}),
      classes: item => ({
        "pending": item.level < item.levelCap,
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
      edit: item => ({target: {item, field:"constellation"}}),
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
        edit: item => ({target: {item, field:["talent", i]}}),
        sort: {generic: {type:"number",property:["talent",i]}},
        dependencies: item => [
            {item:item.getTalentMat('mastery',i), field:"count"},
            {item:item.getTalentMat('enemy',i), field:"count"},
            {item:item.base??item, field:"ascension"},
            item.getTalentMat('mastery',i).days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat('mastery',i).getCraftDependencies()).concat(item.getTalentMat('enemy',i).getCraftDependencies()),
        button: item => {
          if(item.talent[i] < item.getPhase().maxTalent)
          {
            if(item.canUpTalent(i, false))
            {
              return {
                title: "Level up the talent. This will spend the resources for you.",
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
                title: "Not enough materials to level up. If the button is green, you could craft those materials now. If the button is yellow, it involves time-gated materials you could obtain today. If red, you can't obtain those materials today.",
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
      {t:"mora",l:"Mora"},
    ];
    let ascGroup = {label:"Ascension Materials"};
    for(let phase of [undefined,0,1,2,3,4,5])
    {
      for(let mat of mats)
      {
        let ascMaterial = this.display.addField(mat.t+"AscMat"+(phase??""), {
          group: ascGroup,
          label: iconLookup[mat.t],
          labelTitle: mat.l,
          sort: isNaN(phase) ? {func: (o,a,b) => {
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
          }} : undefined,
          columnClasses: ["ascension-materials"],
          tags: isNaN(phase) & mat.l != "Mora" ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getMat(mat.t,phase) && item.getMatCost(mat.t,phase) ? item.getMat(mat.t,phase).getFieldValue(item.getMatCost(mat.t,phase), this.viewer.settings.preferences.characterList=='1') : "",
          dependencies: item => [
            {item:item.base??item, field:"ascension"},
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
            {item:item.base??item, field:"ascension"},
          ],
          button: item => {
            if(phase == item.ascension)
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
      }
    }
    
    let talGroup = {label:"Talent Materials", startCollapsed:true};
    for(let i of ["auto","skill","burst",1,2,3,4,5,6,7,8,9])
    {
      for(let m of [{l:"Mastery",d:"Domain"},{l:"Enemy",d:"Enemy"},{l:"Trounce",d:"Trounce"},{l:"Crown",d:"Crown"},{l:"Mora",d:"Mora"}])
      {
        let talentMat = this.display.addField(isNaN(i) ? i+m.l+"Mat" : "talent"+m.l+"Mat"+i, {
          group: talGroup,
          label: iconLookup[m.l] + (isNaN(i) ? iconLookup[i] : ""),
          labelTitle: m.l + (isNaN(i) ? ` (${i})` : ""),
          sort: isNaN(i) ? {func: (o,a,b) => {
            let A = a.getTalentMatType(m.l.toLowerCase(),i)??"";
            let B = b.getTalentMatType(m.l.toLowerCase(),i)??"";
            if(!A && B)
              return 1;
            else if(A && !B)
              return -1;
            else if(!A && !B)
              return 0;
            else
              return o*A.localeCompare(B);
          }} : undefined,
          columnClasses: [(isNaN(i)?i:"talent")+'-'+m.l.toLowerCase()],
          tags: isNaN(i) & m.l != "Trounce" && m.l != "Crown" && m.l != "Mora" ? undefined : ["detailsOnly"],
          dynamic: true,
          value: item => item.getTalentMat(m.l.toLowerCase(),i) && item.getTalent(i)['mat'+m.d+'Count'] ? (item.getTalentMat(m.l.toLowerCase(),i)?.getFieldValue(item.getTalent(i)['mat'+m.d+'Count'], this.viewer.settings.preferences.characterList=='1')??"!ERROR!") : "",
          title: item => item.getTalentMat(m.l.toLowerCase(),i)?.getFullSource()??"!ERROR!",
          dependencies: item => [
            {item, field:["talent", i]},
            item.getTalentMat(m.l.toLowerCase(),i)?.days ? {item:this.viewer, field:"today"} : {},
          ].concat(item.getTalentMat(m.l.toLowerCase(),i)?.getCraftDependencies()??[]),
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
          return item.getStat(stat, {situation, preview:mode==1, unmodified:mode==-1, substats:mode==-2}).toFixed(stat.slice(-1)=="_" ? 1 : ["melt-forward","vaporize-forward","melt-reverse","vaporize-reverse"].indexOf(stat) > -1 ? 3 : 0)??"null";
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
        {item:item.base??item, field:"constellation"},
        {item:item.base??item, field:"ascension"},
        {item:item.base??item, field:"level"},
        {item:item.base??item, field:"talent"},
        {item:item.base??item, field:"statModifiers"},
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
    let weaponName = this.display.addField("weaponName", {
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
          {type:slotKey+'Artifact'},
        ],
      });
    }
    
    let imageField = this.display.addField("image", {
      label: "Image",
      tags: ["detailsOnly"],
      dynamic: false,
      value: item => ({
        tag: "img",
        src: item.image,
      }),
    });
    
    let activeTeam = this.display.addField("activeTeam", {
      label: "Active Team",
      tags: ["detailsOnly"],
      dynamic: true,
      edit: item => ({
        target: {item, field:"activeTeam"},
        type: "select",
        list: item.teams,
        value: item.activeTeam?.name ?? "",
        valueProperty: "uuid",
        valueFormat: "uuid",
        displayProperty: "name",
        alwaysShow: true,
      }),
      dependencies: item => [
      ],
    });
    
    let teammate = this.display.addField("teammate", {
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
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "list" && (field.value.length != value.length || options.force))
    {
      document.getElementById("addCharacterSelect").needsUpdate = true;
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
  
  fromGOOD(goodData)
  {
    let result = super.fromGOOD(goodData);
    this.addTraveler();
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
    this.items("nottraveler").forEach(item => item.unlink());
    this.update("list", this.items("traveler"), "replace");
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  prepareRender(element, data, options)
  {
    data.filter = "listable";
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
          let item = this.addGOOD({
            key: selectAdd.value,
            level: 1,
            constellation: 0,
            ascension: 0,
            talent: {
              auto: 1,
              skill: 1,
              burst: 1,
            },
          });
          selectAdd.needsUpdate = true;
          selectAdd.removeChild(selectAdd.selectedOptions.item(0));
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
                await Renderer.rerender(container, {item:this, items:characters}, {template: "renderCharacterListAsShowcase"});
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
      for(let chara in GenshinCharacterData)
      {
        if(!this.get(chara))
        {
          if(!this.viewer.settings.preferences.showLeaks && Date.parse(GenshinCharacterData[chara].release) > Date.now())
            continue;
          let option = selectAdd.appendChild(document.createElement("option"));
          option.value = chara;
          option.innerHTML = GenshinCharacterData[chara].name;
        }
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
