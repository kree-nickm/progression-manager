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
    
    Character.setupDisplay(this.display);
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
      showcase: {
        items: this.items("listable"),
        template: `genshin/renderCharacterListAsShowcase`,
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
    data.fields.push({field:this.display.getField("ascension"), params:[]});
    data.fields.push({field:this.display.getField("level"), params:[]});
    data.fields.push({field:this.display.getField("constellation"), params:[]});
    data.fields.push({field:this.display.getField("talent"), params:['auto']});
    data.fields.push({field:this.display.getField("talent"), params:['skill']});
    data.fields.push({field:this.display.getField("talent"), params:['burst']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['gem']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['boss']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['flora']});
    data.fields.push({field:this.display.getField("ascensionMaterial"), params:['enemy']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['mastery', 'auto']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy', 'auto']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['mastery', 'skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy', 'skill']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['mastery', 'burst']});
    data.fields.push({field:this.display.getField("talentMaterial"), params:['enemy', 'burst']});
    data.fields.push({field:this.display.getField("weaponName"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("flower"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("plume"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("sands"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("goblet"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.fields.push({field:this.display.getField("circlet"), params:[this.viewer.settings.preferences.characterList, "sm"]});
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
  
  postRender(element)
  {
    super.postRender(element);
    
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
