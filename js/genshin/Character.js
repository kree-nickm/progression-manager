import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";
import GenshinTalentData from "./gamedata/GenshinTalentData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinCharacterStats from "./gamedata/GenshinCharacterStats.js";
import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import { handlebars, Renderer } from "../Renderer.js";
import GenshinItem from "./GenshinItem.js";
import Artifact from "./Artifact.js";
import Weapon from "./Weapon.js";
import Material from "./Material.js";
import Team from "./Team.js";
import StatModifier from "./StatModifier.js";

handlebars.registerHelper("ifHasStat", function(character, statId, options) {
  if(!character || !character.getStat)
  {
    console.error(`Helper 'ifHasStat' called with invalid character argument:`, character);
    return null;
  }
  
  for(let mod of character.teamStatModifiers)
    if(mod.hasStat(statId, character, {situation:options.hash.situation}))
      return options.fn(this);
  
  if(!options.hash.situation && character.getStat(statId))
    return options.fn(this);
  
  return options.inverse(this);
});

handlebars.registerHelper("getMotionValues", function(character, talent, options) {
  return character.getMotionValues(talent);
});

handlebars.registerHelper("isPreviewing", function(character, item, options) {
  if(item instanceof Artifact)
    return character.preview[item.slotKey] == item;
  else
    console.warn(`Invalid item being checked in isPreview for '${character.name}':`, item);
  return false;
});

handlebars.registerHelper("buildName", (character, buildId, options) => character?.getBuild(buildId)?.name);

export default class Character extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["MaterialList","loaded","_weapon","_flower","_plume","_sands","_goblet","_circlet","_previewGear","preview","statModifiers","activeTeam"]);
  static goodProperties = ["key","level","constellation","ascension","talent"];
  static templateName = "genshin/renderCharacterAsPopup";

  static sortArtifacts(buildId,useTargets,a,b)
  {
    let A = parseFloat(a.getCharacterScore(this, parseInt(a.viewer.settings.preferences.artifactMaxLevel ?? 20), buildId, {useTargets}));
    let B = parseFloat(b.getCharacterScore(this, parseInt(b.viewer.settings.preferences.artifactMaxLevel ?? 20), buildId, {useTargets}));
    if(isNaN(A) || isNaN(B))
    {
      console.error(`Cannot sort artifacts because NaN was encountered for a score.`, A, a, B, b);
      return 0;
    }
    else
      return (B-A);
  }
  
  key = "";
  _level = 1;
  _constellation = 0;
  _ascension = 0;
  talent = {
    auto: 1,
    skill: 1,
    burst: 1,
  };

  favorite = false;
  selectedBuild = 0;
  wishlist = {};
  previews = {};

  MaterialList;
  loaded = false;
  _weapon = null;
  _flower = null;
  _plume = null;
  _sands = null;
  _goblet = null;
  _circlet = null;
  _previewGear = {};
  preview = {};
  statModifiers = [];
  activeTeam = null;
  
  afterLoad()
  {
    this.MaterialList = {
      crown: this.list.viewer.lists.MaterialList.get("CrownOfInsight"),
      mora: this.list.viewer.lists.MaterialList.get("Mora"),
    };
    if(GenshinCharacterData[this.key])
    {
      this.loaded = true;
      
      // Retrieve the materials used by this character.
      this.MaterialList.gem = {
        '2': this.list.viewer.lists.MaterialList.get(GenshinLootData.gemstone[this.element].prefix + Material.gemQualities[2]),
        '3': this.list.viewer.lists.MaterialList.get(GenshinLootData.gemstone[this.element].prefix + Material.gemQualities[3]),
        '4': this.list.viewer.lists.MaterialList.get(GenshinLootData.gemstone[this.element].prefix + Material.gemQualities[4]),
        '5': this.list.viewer.lists.MaterialList.get(GenshinLootData.gemstone[this.element].prefix + Material.gemQualities[5]),
      };
      this.MaterialList.boss = this.list.viewer.lists.MaterialList.get(GenshinLootData.boss[this.bossMatType][4]);
      this.MaterialList.flower = this.list.viewer.lists.MaterialList.get(this.flowerMatType);
      this.MaterialList.enemy = {
        '1': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.enemyMatType][1]),
        '2': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.enemyMatType][2]),
        '3': this.list.viewer.lists.MaterialList.get(GenshinLootData.enemy[this.enemyMatType][3]),
      };
      this.MaterialList.mastery = {
        '2': this.list.viewer.lists.MaterialList.get(Material.masteryQualities[2] + this.getTalentMatType('mastery')),
        '3': this.list.viewer.lists.MaterialList.get(Material.masteryQualities[3] + this.getTalentMatType('mastery')),
        '4': this.list.viewer.lists.MaterialList.get(Material.masteryQualities[4] + this.getTalentMatType('mastery')),
      };
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get(this.getTalentMatType('trounce'));
      
      // Inform those materials that this character uses them.
      for(let i in this.MaterialList.gem)
        this.MaterialList.gem[i]?.addUser(this);
      
      for(let i in this.MaterialList.enemy)
        this.MaterialList.enemy[i]?.addUser(this);
      
      if(this.MaterialList.boss)
        this.MaterialList.boss?.addUser(this);
      
      this.MaterialList.flower?.addUser(this);
        
      for(let i in this.MaterialList.mastery)
        this.MaterialList.mastery[i]?.addUser(this);
      
      this.MaterialList.trounce?.addUser(this);
      this.MaterialList.crown?.addUser(this);
    }
    else
    {
      console.warn(`Unknown character "${this.key}".`);
      this.loaded = false;
    }
    return this.loaded;
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(["preview","ascension","constellation","weapon","flowerArtifact","plumeArtifact","sandsArtifact","gobletArtifact","circletArtifact"].includes(field.path[0]))
    {
      this.clearMemory("stats");
      this.clearMemory("motionValues");
      this.update("statModifiers", null, "notify", {listChange:true, mvChange:"*", mainChange:true, rxnChange:false});
      
      if(!["preview"].includes(field.path[0]))
      {
        this.notifyType(field.string);
        // Iterate through artifacts and clear some amount of artifact.storedStats
        this.viewer.lists.ArtifactList?.items().forEach(artifact => {
          artifact.clearMemory("storedStats", "characters", this.key);
        });
        this.viewer.lists.ArtifactList?.update("evaluate", null, "notify");
      }
    }
    else if(field.path[0] == "statModifiers")
    {
      // TODO: Stuff like this should be handled using dependencies, but at the moment, only item fields are easy to handle using dependencies, which these are not.
      if(options.mainChange)
      {
        let element = document.querySelector(`[data-template="genshin/renderCharacterMainStats"][data-uuid="${this.uuid}"]`);
        if(element) Renderer.queueUpdate(element);
      }
      if(options.rxnChange)
      {
        let element = document.querySelector(`[data-template="genshin/renderCharacterReactions"][data-uuid="${this.uuid}"]`);
        if(element) Renderer.queueUpdate(element);
      }
      // listChange should be true when modifiers could have been added or removed from the list.
      if(options.listChange)
      {
        let element = document.querySelector(`[data-template="genshin/renderCharacterStatModifiers"][data-uuid="${this.uuid}"]`);
        if(element) Renderer.queueUpdate(element);
      }
      // mvChange should be true when motion values could have been added or removed from a list or motion values.
      if(options.mvChange == "*")
      {
        document.querySelectorAll(`[data-template="genshin/renderCharacterMotionValues"][data-uuid="${this.uuid}"]`).forEach(elem => Renderer.queueUpdate(elem));
      }
      else if(["auto","skill","burst"].indexOf(options.mvChange) > -1)
      {
        let element = document.querySelector(`#characterStats\\.${options.mvChange}[data-template="genshin/renderCharacterMotionValues"][data-uuid="${this.uuid}"]`);
        if(element) Renderer.queueUpdate(element);
      }
    }
    else if(field.string == "activeTeam")
    {
      this.clearMemory("stats");
      this.clearMemory("motionValues");
      if(!options.teammate)
      {
        field.value?.characters.forEach(character => {
          if(character != this)
          {
            character.update("activeTeam", null, "replace", {teammate:true});
          }
        });
        value?.characters.forEach(character => {
          if(character != this)
          {
            character.update("activeTeam", this.activeTeam, "replace", {teammate:true});
            character.getStat("none", {teammate:true});
          }
        });
      }
      this.update("statModifiers", null, "notify", {listChange:true, mvChange:"*"});
    }
    else if(field.path[0] == "talent")
    {
      this.clearMemory("motionValues", "current", field.path[1]);
      this.clearMemory("motionValues", "preview", field.path[1]);
    }
    else if(field.string == "buildData" || field.path[0]?.[0] == "getBuild")
    {
      if(["artifactSubstats","sandsStat","gobletStat","circletStat"].indexOf(options.property) > -1)
      {
        // Clear some amount of saved maxScores
        if(options.buildId)
        {
          if(options.property == "sandsStat" || options.property == "gobletStat" || options.property == "circletStat")
          {
            this.clearMemory("maxScores", options.buildId, options.property.slice(0,-4));
            this.clearMemory("maxScores", "", options.property.slice(0,-4));
          }
          else
          {
            this.clearMemory("maxScores", options.buildId);
            this.clearMemory("maxScores", "");
          }
        }
        else
        {
          this.clearMemory("maxScores");
        }
        // Iterate through artifacts and clear some amount of artifact.storedStats
        this.viewer.lists.ArtifactList?.items().forEach(artifact => {
          if(options.property == "artifactSubstats" || artifact.slotKey === options.property.slice(0,-4))
          {
            if(options.buildId)
              artifact.clearMemory("storedStats", "characters", this.key, options.buildId);
            else
              artifact.clearMemory("storedStats", "characters", this.key);
          }
        });
      }
      else if(["minER","maxER","ratioCritRate","ratioCritDMG","enerRech_","critRatio","modifiers"].indexOf(options.property) > -1)
      {
        // Iterate through artifacts and clear some amount of artifact.storedStats
        this.viewer.lists.ArtifactList?.items().forEach(artifact => {
          if(options.buildId)
            artifact.clearMemory("storedStats", "characters", this.key, options.buildId, "withTargets");
          else
            artifact.clearMemory("storedStats", "characters", this.key);
        });
      }
      this.viewer.lists.ArtifactList?.update("evaluate", null, "notify");
    }
    else if(field.string.startsWith("previews"))
    {
      this.clearMemory("stats");
      this.clearMemory("motionValues");
      this.update("statModifiers", null, "notify", {listChange:true, mvChange:"*", mainChange:true, rxnChange:false});
    }
    return true;
  }
  
  /**
  This method should only be called by the item that is being equipped, when its "location" property is updated.
  */
  equipItem(item)
  {
    // Determine the name of the property on this character that stores items of this type.
    let property;
    if(item.constructor.name == "Weapon")
      property = 'weapon';
    else if(item.constructor.name == "Artifact")
      property = item.slotKey +'Artifact';
    else
    {
      console.error(`${this.name} cannot equip unknown item type '${item.constructor.name}'.`);
      return this;
    }
    
    // Make note of existing equips.
    let previousCharacter = item.character;
    let previousItem = this[property];
    
    // Do a quick bug check on the import, if applicable.
    if(previousItem?.list.importing)
    {
      let skip = true;
      let log = [];
      if(item.constructor.name == "Weapon")
        log.push(`Multiple weapons were located on ${this.name} during the import (${previousItem.key},R${previousItem.refinement}L${previousItem.level} and ${item.key},R${item.refinement}L${item.level}).`);
      if(item.constructor.name == "Artifact")
        log.push(`Multiple ${item.slotKey}s were located on ${this.name} during the import (${previousItem.rarity}*${previousItem.setKey}+${previousItem.level}#${previousItem.id} and ${item.rarity}*${item.setKey}+${item.level}#${item.id}).`);
      log.push(`GOOD data may have been exported incorrectly; consider reporting a bug to the developer of the export tool.`);
      let logFunc = console.warn;
      //if(previousItem.list.importing == "Inventory_Kamera") // TODO: Implement this.
      {
        if(item.constructor.name == "Artifact")
        {
          log.pop();
          log.push(`Inventory Kamera V<1.3.10  is known to misread the "Source" label of any artifact where said label is visible, and think it's an "Equipped By" label.`);
          let detectProblem = artifact => {
            if(artifact.rarity == 5)
            {
              if(artifact.setKey == "HeartOfDepth")
              {
                if(artifact.substats.length == 3 && (artifact.slotKey == "flower" || artifact.slotKey == "plume" || artifact.slotKey == "sands") || (artifact.slotKey == "circlet"))
                  return `Assuming ${artifact.rarity}*${artifact.setKey}+${artifact.level}#${artifact.id} is the source of this problem and ignoring it.`;
              }
              else if(artifact.setKey == "EmblemOfSeveredFate")
              {
                if(artifact.substats.length == 3 && (artifact.slotKey == "plume" || artifact.slotKey == "goblet") || (artifact.slotKey == "circlet"))
                  return `Assuming ${artifact.rarity}*${artifact.setKey}+${artifact.level}#${artifact.id} is the source of this problem and ignoring it.`;
              }
              else if(artifact.setKey == "NoblesseOblige")
              {
                if(artifact.substats.length == 3 && (artifact.slotKey == "flower" || artifact.slotKey == "plume" || artifact.slotKey == "goblet" || artifact.slotKey == "circlet"))
                  return `Assuming ${artifact.rarity}*${artifact.setKey}+${artifact.level}#${artifact.id} is the source of this problem and ignoring it.`;
              }
              else if(artifact.setKey == "MaidenBeloved")
              {
                if((artifact.slotKey == "flower" || artifact.slotKey == "plume" || artifact.slotKey == "goblet"))
                  return `Assuming ${artifact.rarity}*${artifact.setKey}+${artifact.level}#${artifact.id} is the source of this problem and ignoring it.`;
              }
              else if(artifact.setKey == "BloodstainedChivalry")
              {
                if(artifact.substats.length == 3 && (artifact.slotKey == "flower" || artifact.slotKey == "plume"))
                  return `Assuming ${artifact.rarity}*${artifact.setKey}+${artifact.level}#${artifact.id} is the source of this problem and ignoring it.`;
              }
            }
            return false;
          };
          let msg1 = detectProblem(item);
          let msg2 = detectProblem(previousItem);
          if(msg1 && msg2)
          {
            log.push(`Both artifacts are potentially incorrect.`);
          }
          else if(msg1)
          {
            logFunc = console.log;
            log.unshift(`[SOLVED]`);
            log.push(msg1);
          }
          else if(msg2)
          {
            logFunc = console.log;
            log.unshift(`[SOLVED]`);
            log.push(msg2);
            skip = false;
          }
        }
      }
      if(skip && log[0] != "[SOLVED]")
      {
        log.unshift(`[MAYBE SOLVED]`);
        log.push(`Ignoring the most recent one, because better items generally comes first in the import, and we'll assume you have the best one equipped.`);
      }
      logFunc(...log);
      if(skip)
      {
        item.update("location", "");
        return this;
      }
    }
    
    // Unequip the previous equips that we noted above.
    item.character = null;
    this[property] = null;
    
    // If we had an item equipped, and the new item was equipped to another character, give that character our old item.
    if(previousItem && previousCharacter)
      previousItem.update("location", previousCharacter.key);
    // If we had an item equipped, let it know it is now unequipped.
    else if(previousItem)
      previousItem.update("location", "");
    // If the new item was equipped to another character, delete the reference to the item.
    else if(previousCharacter)
      previousCharacter.update(property, null, "replace");
    
    // Finally, set the references on this character and the item to each other.
    this.update(property, item, "replace");
    item.character = this;
    return this;
  }
  
  // Getters/setters that enforce a value range.
  get weapon(){ return this._weapon; }
  set weapon(val){ this._weapon = val; }
  get flowerArtifact(){ return this._flower; }
  set flowerArtifact(val){ this._flower = val; }
  get plumeArtifact(){ return this._plume; }
  set plumeArtifact(val){ this._plume = val; }
  get sandsArtifact(){ return this._sands; }
  set sandsArtifact(val){ this._sands = val; }
  get gobletArtifact(){ return this._goblet; }
  set gobletArtifact(val){ this._goblet = val; }
  get circletArtifact(){ return this._circlet; }
  set circletArtifact(val){ this._circlet = val; }
  get constellation(){ return this._constellation; }
  set constellation(val){ this._constellation = Math.min(Math.max(val, 0), 6); }
  get ascension(){ return this._ascension; }
  set ascension(val){ this._ascension = Math.min(Math.max(val, 0), 6); }
  get level(){ return this._level; }
  set level(val){ this._level = Math.min(Math.max(val, 1), 90); }
  get autoTalentLevel(){ return this.talent.auto + this.getStat("autoLevel"); }
  get skillTalentLevel(){ return this.talent.skill + this.getStat("skillLevel"); }
  get burstTalentLevel(){ return this.talent.burst + this.getStat("burstLevel"); }
  
  // Getters for genshin item data that is not stored on each instance of this class.
  get data(){ return GenshinCharacterData[this.key]; }
  get name(){ return GenshinCharacterData[this.key]?.name ?? this.key; }
  get weaponType(){ return GenshinCharacterData[this.key]?.weapon ?? ""; }
  get element(){ return GenshinCharacterData[this.key]?.element ?? ""; }
  get rarity(){ return this.loaded ? GenshinCharacterData[this.key].rarity : 0; }
  get ascendStat(){ return this.loaded ? GenshinCharacterData[this.key].ascendStat : ""; }
  get bossMatType(){ return this.loaded ? GenshinCharacterData[this.key].matBoss : ""; }
  get flowerMatType(){ return this.loaded ? GenshinCharacterData[this.key].matFlower : ""; }
  get enemyMatType(){ return this.loaded ? GenshinCharacterData[this.key].matEnemy : ""; }
  get hpBaseValue(){ return GenshinCharacterData[this.key]?.hpBase ?? 0; }
  get atkBaseValue(){ return GenshinCharacterData[this.key]?.atkBase ?? 0; }
  get defBaseValue(){ return GenshinCharacterData[this.key]?.defBase ?? 0; }
  get hpAscValue(){ return GenshinCharacterData[this.key]?.hpMaxAsc ?? 0; }
  get atkAscValue(){ return GenshinCharacterData[this.key]?.atkMaxAsc ?? 0; }
  get defAscValue(){ return GenshinCharacterData[this.key]?.defMaxAsc ?? 0; }
  get image(){ return GenshinCharacterData[this.key]?.img ?? ""; }
  get autoIcon(){ return GenshinCharacterData[this.key]?.talents?.["Normal Attack"]?.img ?? ""; }
  get skillIcon(){ return GenshinCharacterData[this.key]?.talents?.["Elemental Skill"]?.img ?? ""; }
  get burstIcon(){ return GenshinCharacterData[this.key]?.talents?.["Elemental Burst"]?.img ?? ""; }
  get releaseTimestamp(){ return GenshinCharacterData[this.key]?.release ? Date.parse(GenshinCharacterData[this.key]?.release) : 0; }
  
  getPhase(ascension=this.ascension){ return GenshinPhaseData[ascension] ?? GenshinPhaseData[6]; }
  get levelCap() { return this.getPhase().levelCap; }
  get talentCap() { return this.getPhase().maxTalent; }
  
  get previewWeapon()
  {
    if(!this.previews.weaponKey && !this.previews.weaponLevel && !this.previews.weaponAscension && !this.previews.weaponRefinement)
      return null;
    let key = this.previews?.weaponKey ?? this.weapon?.key;
    if(!key)
      return null;
    let level = this.previews?.weaponLevel ?? this.weapon?.level ?? 1;
    let ascension = this.previews?.weaponAscension ?? this.weapon?.ascension ?? 0;
    let refinement = this.previews?.weaponRefinement ?? this.weapon?.refinement ?? 1;
    if(key == this.weapon?.key && level == this.weapon?.level && ascension == this.weapon?.ascension && refinement == this.weapon?.refinement)
      return null;
    if(!this._previewGear.weapon)
      this._previewGear.weapon = new Weapon();
    this._previewGear.weapon.key = key;
    this._previewGear.weapon.isPreview = true;
    this._previewGear.weapon.character = this;
    this._previewGear.weapon.level = this.previews?.weaponLevel ?? this.weapon?.level ?? 1;
    this._previewGear.weapon.ascension = this.previews?.weaponAscension ?? this.weapon?.ascension ?? 0;
    this._previewGear.weapon.refinement = this.previews?.weaponRefinement ?? this.weapon?.refinement ?? 1;
    return this._previewGear.weapon;
  }
  // Lowercase because the slot key is always lowercase.
  getPreviewArtifact(slotKey)
  {
    let current = this.preview[slotKey] ?? this[slotKey+'Artifact'];
    if(!current)
      return null;
    if(!this.previews[slotKey+'Stat'] || this.previews[slotKey+'Stat'] == current.mainStatKey)
      return this.preview[slotKey];
    if(!this._previewGear[slotKey])
      this._previewGear[slotKey] = new Artifact();
    this._previewGear[slotKey].isPreview = true;
    this._previewGear[slotKey].character = this;
    this._previewGear[slotKey].setKey = current.setKey;
    this._previewGear[slotKey].slotKey = current.slotKey;
    this._previewGear[slotKey].level = current.level;
    this._previewGear[slotKey].rarity = current.rarity;
    this._previewGear[slotKey].mainStatKey = this.previews[slotKey+'Stat'];
    if(this._previewGear[slotKey].substats != current.substats)
    {
      this._previewGear[slotKey].substats = current.substats;
      this._previewGear[slotKey].determineRolls();
    }
    return this._previewGear[slotKey];
  }
  
  getMat(type, ascension=this.ascension)
  {
    if(type == "gem")
      return this.MaterialList.gem[this.getPhase(ascension).ascendMatGemQuality];
    else if(type == "boss")
      return this.MaterialList.boss;
    else if(type == "flower")
      return this.MaterialList.flower;
    else if(type == "enemy")
      return this.MaterialList.enemy[this.getPhase(ascension).ascendMatEnemyQuality];
    else if(type == "mora")
      return this.MaterialList.mora;
    else
      return null;
  }
  
  getMatCost(type, ascension=this.ascension)
  {
    if(type == "gem")
      return this.getPhase(ascension).ascendMatGemCount;
    else if(type == "boss")
      return this.getPhase(ascension).ascendMatBossCount;
    else if(type == "flower")
      return this.getPhase(ascension).ascendMatFlowerCount;
    else if(type == "enemy")
      return this.getPhase(ascension).ascendMatEnemyCount;
    else if(type == "mora")
      return this.getPhase(ascension).ascendMoraCost;
    else
      return 0;
  }
  
  getTalent(talent){ return GenshinTalentData[this.talent[talent] ?? talent] ?? GenshinTalentData[10]; }
  getTalentMat(type, talent)
  {
    if(type == "mastery")
      return this.MaterialList.mastery[this.getTalent(talent).matMasteryQuality];
    else if(type == "enemy")
      return this.MaterialList.enemy[this.getTalent(talent).matEnemyQuality];
    else if(type == "trounce")
      return this.MaterialList.trounce;
    else if(type == "crown")
      return this.MaterialList.crown;
    else if(type == "mora")
      return this.MaterialList.mora;
    else
    {
      console.warn(`Invalid talent mat type '${type}'.`);
      return null;
    }
  }
  
  getTalentMatType(type, talent)
  {
    if(type == "mastery")
      return this.loaded ? GenshinCharacterData[this.key].matMastery : "";
    else if(type == "enemy")
      return this.loaded ? GenshinCharacterData[this.key].matEnemy : "";
    else if(type == "trounce")
      return this.loaded ? GenshinCharacterData[this.key].matTrounce : "";
    else if(type == "crown")
      return "Crown";
    else if(type == "mora")
      return "Mora";
    else
      return "";
  }
  
  upPhase(event)
  {
    if(this.ascension == 6)
    {
      console.error(`Tried to ascend ${this.name}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getMat('gem').update("count", this.getMat('gem').count - this.getMatCost('gem'));
    if(this.getMat('boss'))
      this.getMat('boss').update("count", this.getMat('boss').count - this.getMatCost('boss'));
    this.getMat('flower').update("count", this.getMat('flower').count - this.getMatCost('flower'));
    this.getMat('enemy').update("count", this.getMat('enemy').count - this.getMatCost('enemy'));
    this.getMat('mora').update("count", this.getMat('mora').count - this.getMatCost('mora'));
    if(this.level < this.levelCap)
      this.update("level", this.levelCap);
    this.update("ascension", this.ascension+1);
  }
  
  canUpPhase(withCrafting=false)
  {
    if(this.ascension == 6)
      return false;
    else if(withCrafting)
      return this.getMat('gem')?.getCraftCount() >= this.getMatCost('gem') &&
        (!this.getMat('boss') || this.getMat('boss').getCraftCount() >= this.getMatCost('boss')) &&
        this.getMat('flower')?.getCraftCount() >= this.getMatCost('flower') &&
        this.getMat('enemy')?.getCraftCount() >= this.getMatCost('enemy') &&
        this.getMat('mora')?.getCraftCount() >= this.getMatCost('mora');
    else
      return this.getMat('gem')?.count >= this.getMatCost('gem') &&
        (!this.getMat('boss') || this.getMat('boss').count >= this.getMatCost('boss')) &&
        this.getMat('flower')?.count >= this.getMatCost('flower') &&
        this.getMat('enemy')?.count >= this.getMatCost('enemy') &&
        this.getMat('mora')?.count >= this.getMatCost('mora');
  }
  
  upTalent(talent, event)
  {
    if(this.talent[talent] >= this.talentCap)
    {
      console.error(`Tried to increase ${talent} talent of ${this.name}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getTalentMat('mastery',talent).update("count", this.getTalentMat('mastery',talent).count - this.getTalent(talent).matMasteryCount);
    this.getTalentMat('enemy',talent).update("count", this.getTalentMat('enemy',talent).count - this.getTalent(talent).matEnemyCount);
    this.MaterialList.trounce.update("count", this.MaterialList.trounce.count - this.getTalent(talent).matTrounceCount);
    this.MaterialList.crown.update("count", this.MaterialList.crown.count - this.getTalent(talent).matCrownCount);
    this.MaterialList.mora.update("count", this.MaterialList.mora.count - this.getTalent(talent).matMoraCount);
    this.update(["talent", talent], this.talent[talent]+1);
  }
  
  canUpTalent(talent, withCrafting=false)
  {
    if(this.talent[talent] >= this.talentCap)
      return false;
    else if(withCrafting)
      return this.getTalentMat('mastery',talent)?.getCraftCount() >= this.getTalent(talent).matMasteryCount &&
        this.getTalentMat('enemy',talent)?.getCraftCount() >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce?.getCraftCount() >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown?.getCraftCount() >= this.getTalent(talent).matCrownCount &&
        this.MaterialList.mora?.getCraftCount() >= this.getTalent(talent).matMoraCount;
    else
      return this.getTalentMat('mastery',talent)?.count >= this.getTalent(talent).matMasteryCount &&
        this.getTalentMat('enemy',talent)?.count >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce?.count >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown?.count >= this.getTalent(talent).matCrownCount &&
        this.MaterialList.mora?.count >= this.getTalent(talent).matMoraCount;
  }
  
  get teams()
  {
    return this.viewer.lists.TeamList.items(team => team.memberKeys.indexOf(this.key) > -1);
  }
  
  get teamStatModifiers()
  {
    return this.activeTeam ? this.activeTeam.getStatModifiers(this) : this.statModifiers;
  }
  
  getStat(stat, alternates={})
  {
    if(!stat)
    {
      console.error(`Character.getStat for '${this.name}' called with no stat.`);
      return null;
    }
    
    let baseStat;
    let variant;
    [baseStat, variant] = stat.split("-");
    let isPrimary = ["atk","hp","def"].indexOf(baseStat) > -1;
    
    // If this is a calculated value, pass it off to the calculated method.
    if(["swirl","superconduct","spread","bloom","burning","aggravate","hyperbloom","electrocharged","overloaded","burgeon","shattered","melt","vaporize"].indexOf(baseStat) > -1)
      return this.getReaction(stat, alternates);
    
    if(alternates?.preview)
    {
      alternates.unmodified = false;
      alternates.substats = false;
    }
    else if(alternates?.substats)
    {
      alternates.unmodified = true;
    }
    let result;
    let remembered = this.loadMemory("stats", alternates?.preview?"preview":alternates?.substats?"artifacts":alternates?.unmodified?"unmodified":"current", stat, alternates?.situation??"general");
    //Check if this is a value we should use memory for.
    let useMemory = !(alternates?.level || alternates?.ascension || alternates?.weapon || alternates?.weaponLevel || alternates?.weaponAscension || alternates?.refinement || alternates?.flower || alternates?.plume || alternates?.sands || alternates?.goblet || alternates?.circlet || alternates?.constellation || alternates?.autoTalent || alternates?.skillTalent || alternates?.burstTalent);
    if(!useMemory || !remembered)
    {
      result = GenshinCharacterStats.statBase[stat] ?? 0;
      let baseResult = result;
      let level = alternates?.level ?? (alternates?.preview ? (this.previews.level??this.level) : this.level);
      let ascension = alternates?.ascension ?? (alternates?.preview ? (this.previews.ascension??this.ascension) : this.ascension);
      let constellation = alternates?.constellation ?? (alternates?.preview ? (this.previews.constellation??this.constellation) : this.constellation);
      let weapon = alternates?.weapon ?? (alternates?.preview ? (this.previewWeapon??this.weapon) : this.weapon);
      let weaponRefinement = alternates?.refinement ?? weapon?.refinement;
      
      // Bonus from character level/ascension
      if(this.ascendStat == stat)
        result += GenshinCharacterStats.ascendStatBase[this.rarity][this.ascendStat] * GenshinPhaseData[ascension].ascendStatMultiplier;
      else if(isPrimary)
        baseResult += this[baseStat+'BaseValue'] * GenshinCharacterStats.levelMultiplier[level][this.rarity]
                   + this[baseStat+'AscValue'] * GenshinPhaseData[ascension].baseStatMultiplier;
      
      // Bonus from weapon stats
      if(weapon?.stat == stat)
        result += weapon.getStat(alternates);
      else if(baseStat == "atk")
        baseResult += weapon?.getATK(alternates) ?? 0;
      
      if(variant != "base")
      {
        if(alternates?.substats)
          result = 0;
        else if(isPrimary)
        {
          if(variant != "bonus")
            result = baseResult;
          result += baseResult * this.getStat(baseStat+"_", alternates) / 100;
        }
        
        // Bonus from artifact substats
        for(let slot of ['flower','plume','sands','goblet','circlet'])
        {
          let prop = slot + 'Artifact';
          let artifact = alternates?.[slot] ?? (alternates?.preview ? (this.getPreviewArtifact(slot)??this[prop]) : this[prop]);
          if(artifact)
          {
            if(!alternates?.substats && artifact.mainStatKey == (baseStat))
              result += artifact.mainStatValue;
            result += artifact.getSubstatSum(baseStat) ?? 0;
          }
        }
        
        if(!alternates?.substats)
        {
          // TODO: StatModifier checks to see if the character meets the requirements of talents/cons, so we probably don't need to here.
          // Collect bonuses from talents
          for(let talent in GenshinCharacterData[this.key].talents??[])
          {
            if(talent == "1st Ascension Passive" && ascension < 1)
              continue;
            if(talent == "4th Ascension Passive" && ascension < 4)
              continue;
            if(GenshinCharacterData[this.key].talents[talent].code)
              StatModifier.create(GenshinCharacterData[this.key].talents[talent].code, this, "talentPassive", {talent});
          }
          
          // Collect bonuses from constellations
          for(let c=1; c<=constellation; c++)
            if(GenshinCharacterData[this.key].constellations?.[c]?.code)
              StatModifier.create(GenshinCharacterData[this.key].constellations?.[c]?.code, this, "constellation", {constellation:c});
          
          // Collect bonuses from weapon passive
          let weaponPassive = weapon?.getCode(alternates);
          if(weaponPassive)
            StatModifier.create(weaponPassive, this, "weapon", {weapon, weaponRefinement});
          
          // Collect bonuses from artifact set
          let setBonus = this.getSetBonuses(alternates);
          for(let set in setBonus)
          {
            for(let i=1; i<=setBonus[set].count; i++)
            {
              let code = GenshinArtifactData[set]['bonus'+i+'code'];
              if(code)
              {
                StatModifier.create(code, this, "setBonus", {set, pieces:i});
              }
            }
          }
          /**
          bonus#code is an array.
            If element 0 is a string, then the array is a command. [0] is the command name and [1] is an array of arguments (unless the command name is 'proc' or 'custom').
            If element 0 is an array, then the array is multiple commands, and we iterate through them as if they were bonus#code.
          Valid commands are:
            stat: 2 arguments, increase a stat
              1: a string stat id, or an array of string stat ids for multiple stats.
              2: amount to increase the stat by.
            pstat: 2 arguments, increase a stat for entire party
              1: a string stat id, or an array of string stat ids for multiple stats.
              2: amount to increase the stat by.
            sstat: 3 arguments, increase a stat but only for specific situations
              1: specifier for the situation the bonus applies
              2: a string stat id, or an array of string stat ids for multiple stats.
              3: amount to increase the stat by.
            estat: 2 arguments, increase (or decrease) a stat for enemies
              1: a string stat id, or an array of string stat ids for multiple stats.
              2: amount to increase the stat by (negative to decrease).
          */
          
          // Apply all valid bonuses.
          this.teamStatModifiers.forEach(mod => {
            result += mod.getStat(baseStat, this, alternates);
          });
        }
      }
      else
        result = baseResult;
      
      if(useMemory)
        this.saveMemory(result, "stats", alternates?.preview?"preview":alternates?.substats?"artifacts":alternates?.unmodified?"unmodified":"current", stat, alternates?.situation??"general");
    }
    else
    {
      result = remembered;
    }
    return result;
  }
  
  getReaction(type, alternates={})
  {
    let baseType;
    let variant;
    let variant2;
    [baseType, variant, variant2] = type.split("-");
    
    let dmgType;
    if(["swirl"].indexOf(baseType) > -1)
      dmgType = variant;
    if(["superconduct"].indexOf(baseType) > -1 || baseType=="melt" && variant=="reverse")
      dmgType = "cryo";
    if(["bloom","hyperbloom","burgeon","spread"].indexOf(baseType) > -1)
      dmgType = "dendro";
    if(["burning","overloaded"].indexOf(baseType) > -1 || baseType=="melt" && variant=="forward" || baseType=="vaporize" && variant=="reverse")
      dmgType = "pyro";
    if(["electrocharged","aggravate"].indexOf(baseType) > -1)
      dmgType = "electro";
    if(baseType=="vaporize" && variant=="forward")
      dmgType = "hydro";
    if(["shattered"].indexOf(baseType) > -1)
      dmgType = "physical";
    
    if(variant2 == "swirl")
    {
      let swirl = this.getReaction("swirl-"+dmgType, alternates);
      let mult = this.getReaction(baseType+"-"+variant, alternates);
      return swirl * mult;
    }
    
    let level = alternates?.level??(alternates?.preview?(this.previews.level??this.level):this.level);
    if(["swirl","superconduct","bloom","burning","hyperbloom","electrocharged","overloaded","burgeon","shattered"].indexOf(baseType) > -1)
    {
      let rxnMult;
      if(["burning"].indexOf(baseType) > -1)
        rxnMult = 0.25;
      if(["superconduct"].indexOf(baseType) > -1)
        rxnMult = 0.5;
      if(["swirl"].indexOf(baseType) > -1)
        rxnMult = 0.6;
      if(["electrocharged"].indexOf(baseType) > -1)
        rxnMult = 1.2;
      if(["shattered"].indexOf(baseType) > -1)
        rxnMult = 1.5;
      if(["bloom","overloaded"].indexOf(baseType) > -1)
        rxnMult = 2;
      if(["hyperbloom","burgeon"].indexOf(baseType) > -1)
        rxnMult = 3;
      
      let bonusEM = 16 * this.getStat("eleMas",alternates) / (this.getStat("eleMas",alternates) + 2000);
      let RES = (this.list.targetEnemyData[`enemy${dmgType.at(0).toUpperCase()+dmgType.slice(1)}RES`]??10) + this.getStat("enemy_"+dmgType+"_res_",alternates);
      let reduction = RES>=75 ? 1/(4*RES+1) : RES>=0 ? 1-RES/100 : 1-RES/200;
      return rxnMult * GenshinCharacterStats.levelReactionMultiplier[level].pc * (1 + bonusEM + this.getStat(baseType+"_dmg_",alternates) / 100) * reduction;
    }
    else if(["aggravate","spread"].indexOf(baseType) > -1)
    {
      let rxnMult;
      if(["aggravate"].indexOf(baseType) > -1)
        rxnMult = 1.15;
      if(["spread"].indexOf(baseType) > -1)
        rxnMult = 1.25;
        
      // Defense
      let DEF = 5 * (this.list.targetEnemyData[`enemyLevel`]??90) + 500;
      let k = (1 + this.getStat("enemy_def_",alternates)/100) * (1 - this.getStat("ignore_def_",alternates)/100); // TODO: Ignore def is probably not a stat, because it's attack-specific and not an actual buff to the character.
      let reductionDEF = (this.level + 100) / (k * ((this.list.targetEnemyData[`enemyLevel`]??90) + 100) + (this.level + 100));
      
      // Resistances
      let RES = (this.list.targetEnemyData[`enemy${dmgType.at(0).toUpperCase()+dmgType.slice(1)}RES`]??10) + this.getStat("enemy_"+dmgType+"_res_",alternates);
      let reductionRES = RES>=75 ? 1/(4*RES+1) : RES>=0 ? 1-RES/100 : 1-RES/200;
      
      let bonusEM = 5 * this.getStat("eleMas",alternates) / (this.getStat("eleMas",alternates) + 1200);
      return rxnMult * GenshinCharacterStats.levelReactionMultiplier[level].pc * (1 + bonusEM + this.getStat(baseType+"_dmg_",alternates) / 100) * (1 + this.getStat(dmgType+"_dmg_",alternates) / 100) * reductionRES * reductionDEF;
    }
    else if(["vaporize","melt"].indexOf(baseType) > -1)
    {
      let rxnMult = variant=="forward" ? 2 : 1.5;
      let bonusEM = 2.78 * this.getStat("eleMas",alternates) / (this.getStat("eleMas",alternates) + 1400);
      return rxnMult * (1 + bonusEM + this.getStat(baseType+"_dmg_",alternates) / 100);
    }
    console.warn(`Unknown calculation type:`, type);
    return 0;
  }
  
  getMotionValues(talent, alternates={}, {onlyKey}={})
  {
    if(!GenshinCharacterData[this.key].talents)
      return [];
    
    let result = [];
    let remembered = this.loadMemory("motionValues", alternates?.preview?"preview":"current", talent);
    
    if(remembered)
      result = remembered;
    else
    {
      // Determine which talent to use the scaling properties of.
      let scaling;
      if(onlyKey)
      {
        talent = null;
        for(let t of ["Normal Attack","Elemental Burst","Elemental Skill"])
        {
          for(let mv in GenshinCharacterData[this.key].talents[t]?.scaling ?? [])
            if(mv == onlyKey)
              talent = t
        }
        if(!talent)
        {
          this.teamStatModifiers.forEach(mod => {
            // Dynamically add any motion values we need from stat modifiers.
            mod.getAddedMotionValues(null, this, alternates).forEach(mv => {
              if(mv.label == onlyKey)
                talent = mv.talent;
            });
          });
        }
        if(!talent)
        {
          console.error(`Invalid key for onlyKey in getMotionValues: ${onlyKey}`);
          return null;
        }
      }
      if(talent == "auto" || talent == "Normal Attack")
      {
        talent = "auto";
        scaling = GenshinCharacterData[this.key].talents["Normal Attack"].scaling;
      }
      else if(talent == "skill" || talent == "Elemental Skill")
      {
        talent = "skill";
        scaling = GenshinCharacterData[this.key].talents["Elemental Skill"].scaling;
      }
      else if(talent == "burst" || talent == "Elemental Burst")
      {
        talent = "burst";
        scaling = GenshinCharacterData[this.key].talents["Elemental Burst"].scaling;
      }
      else
      {
        console.error(`Invalid talent in getMotionValues: ${talent}`);
        return null;
      }
      if(!scaling)
      {
        console.error(`Character ${this.key} has potentially invalid talents:`, GenshinCharacterData[this.key].talents);
        return null;
      }
      
      
      // We clone the scaling object so this function doesn't modify the default character data when we dynamically add motion values.
      scaling = Object.assign({}, scaling);
      let addedMVs = [];
      let mvModifiers = [];
      this.teamStatModifiers.forEach(mod => {
        // Dynamically add any motion values we need from stat modifiers.
        mod.getAddedMotionValues(talent, this, alternates).forEach(mv => {
          scaling[mv.label] = {};
          for(let lvl in scaling[Object.keys(scaling)[0]])
            scaling[mv.label][lvl] = mv.value;
          addedMVs.push(mv.label);
        });
        // Collect all the edits to the motion values from stat modifiers.
        mvModifiers = mvModifiers.concat(mod.getEditedMotionValues(talent, this, alternates));
      });
      
      // Iterate through each line of the talent properties.
      let allKeys = Object.keys(scaling);
      for(let k=0; k<allKeys.length; k++)
      {
        if(onlyKey && allKeys[k] != onlyKey)
          continue;
        
        let motionValue = {
          talent,
          rawKey: allKeys[k],
          key: allKeys[k],
        };
        
        // If this is a dynamically-added key for the purpose of additional reaction data, figure that out now.
        ["melt-reverse","melt-forward","vaporize-reverse","vaporize-forward","aggravate","spread"].forEach(rxn => {
          if(motionValue.key.endsWith(` [${rxn}]`))
          {
            motionValue.reaction = rxn;
            motionValue.key = motionValue.key.slice(0, -1*(rxn.length+3));
          }
        });
        motionValue.newKey = motionValue.key;
        
        // Note if this motion value was added by a stat modifier.
        if(addedMVs.includes(motionValue.key))
          motionValue.fromModifier = true;
        
        // Determine current raw value based on talent level.
        let talentLvl = (alternates?.[talent+'Talent']??(alternates?.preview?(this.previews.talent?.[talent]??this.talent[talent]):this.talent[talent])) + this.getStat(talent+"Level", alternates);
        motionValue.rawValue = scaling[motionValue.key]?.[talentLvl];
        if(!motionValue.rawValue)
        {
          console.error(`Character ${this.key} has potentially invalid ${talent} talent at key '${motionValue.key}' talent lvl '${talentLvl}':`, GenshinCharacterData[this.key].talents);
          return null;
        }
        
        // Parse the values.
        motionValue.rawValues = typeof(motionValue.rawValue) == "string" ? motionValue.rawValue.split("+") : [motionValue.rawValue];
        motionValue.values = new Array(motionValue.rawValues.length);
        
        // Motion value modifications that do not require the motion value to be calculated first.
        for(let modifier of mvModifiers)
        {
          if(Array.isArray(modifier.label) ? modifier.label.indexOf(motionValue.key) > -1 : modifier.label == motionValue.key)
          {
            if(modifier.method == "+hit")
            {
              motionValue.rawValues.push(modifier.value);
              motionValue.values.push({fromModifier:true});
            }
          }
        }
        
        for(let v in motionValue.rawValues)
        {
          if(!motionValue.values[v])
            motionValue.values[v] = {};
          motionValue.values[v].value = String(motionValue.rawValues[v]).trim();
          motionValue.values[v].hits = 1;
          for(let modifier of mvModifiers)
            if((modifier.method == "infuse") && (this.weaponType == "Claymore" || this.weaponType == "Sword" || this.weaponType == "Polearm"))
              motionValue.values[v].dmgType = modifier.value;
          
          // Parse out some data based on the value.
          if(motionValue.values[v].value.includes("×") || motionValue.values[v].value.includes("*"))
            [motionValue.values[v].value, motionValue.values[v].hits] = motionValue.values[v].value.split(/[×*]/);
          if(motionValue.values[v].value.includes("@"))
            [motionValue.values[v].value, motionValue.values[v].dmgType] = motionValue.values[v].value.split("@");
          if(motionValue.values[v].value.includes("%:"))
          {
            let other, idx;
            [motionValue.values[v].value, other] = motionValue.values[v].value.split("%:");
            [other, idx] = other.split(".");
            idx = idx ?? 0;
            let otherAttack = result.find(attack => attack.rawKey == other);
            if(!otherAttack)
            {
              otherAttack = this.getMotionValues("", alternates, {onlyKey:other})?.find(attack => attack.rawKey == other);
              if(!otherAttack)
              {
                console.error(`Invalid motion value specification "${motionValue.rawValues[v]}" for ${this.name}: can't find existing motion value "${other}"`);
                continue;
              }
            }
            motionValue.values[v].value = String(parseFloat(motionValue.values[v].value)/100 * parseFloat(otherAttack.values[idx]?.baseDMG));
            motionValue.values[v].stat = "flat";
          }
          
          // Try to turn motionValue.values[v].value into a number, parsing out any non-numeric components where possible
          if(motionValue.values[v].value.endsWith("%"))
          {
            motionValue.values[v].value = motionValue.values[v].value.slice(0, -1);
            motionValue.values[v].stat = "atk";
          }
          else if(motionValue.values[v].value.endsWith(" Max HP"))
          {
            motionValue.values[v].value = motionValue.values[v].value.slice(0, -7);
            if(motionValue.values[v].value.endsWith("%"))
              motionValue.values[v].value = motionValue.values[v].value.slice(0, -1);
            motionValue.values[v].stat = "hp";
          }
          else if(motionValue.values[v].value.endsWith(" ATK"))
          {
            motionValue.values[v].value = motionValue.values[v].value.slice(0, -4);
            if(motionValue.values[v].value.endsWith("%"))
              motionValue.values[v].value = motionValue.values[v].value.slice(0, -1);
            motionValue.values[v].stat = "atk";
          }
          else if(motionValue.values[v].value.endsWith(" DEF"))
          {
            motionValue.values[v].value = motionValue.values[v].value.slice(0, -4);
            if(motionValue.values[v].value.endsWith("%"))
              motionValue.values[v].value = motionValue.values[v].value.slice(0, -1);
            motionValue.values[v].stat = "def";
          }
          else if(motionValue.values[v].value.endsWith(" Elemental Mastery"))
          {
            motionValue.values[v].value = motionValue.values[v].value.slice(0, -18);
            if(motionValue.values[v].value.endsWith("%"))
              motionValue.values[v].value = motionValue.values[v].value.slice(0, -1);
            motionValue.values[v].stat = "eleMas";
          }
          else if(motionValue.values[v].value.endsWith("/s"))
          {
            // per second, as with many charged attacks
          }
          else if(motionValue.values[v].value.endsWith("s"))
          {
            // duration, for CDs etc.
          }
          if(!isNaN(motionValue.values[v].value.replaceAll(",","")))
            motionValue.values[v].value = motionValue.values[v].value.replaceAll(",","");
          
          if(!isNaN(motionValue.values[v].value))
          {
            // Determine any special dmgType
            if(motionValue.key.includes("RES") || motionValue.key.includes("Ratio") || motionValue.key.includes("Chance"))
            {
              motionValue.values[v].dmgType = "percent";
              motionValue.values[v].stat = "";
            }
            else if(motionValue.key.includes("Bonus Ratio") || motionValue.key.includes("ATK Bonus"))
              motionValue.values[v].dmgType = "bonus";
            else if(motionValue.key.includes("Regeneration") || motionValue.key.includes("Healing"))
              motionValue.values[v].dmgType = "healing";
            else if(motionValue.key.includes("Absorption"))
              motionValue.values[v].dmgType = "shielding";
            else if(motionValue.key.startsWith("Inherited HP"))
              motionValue.values[v].dmgType = "hp";
            
            // Determine stat scaling for poorly-labeled talents that can't be handled with general rules.
            if(this.key == "KujouSara" && motionValue.key == "ATK Bonus Ratio (%)" || this.key == "Bennett" && motionValue.key == "ATK Bonus Ratio (% Base ATK)")
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, motionValue.key.indexOf("(")-1);
              motionValue.values[v].stat = "atk-base";
              motionValue.values[v].dmgType = "bonus";
            }
            else if(this.key == "Furina" && motionValue.key.endsWith("HP Consumption (% Max HP)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -11);
              motionValue.values[v].dmgType = "self";
            }
            else if(this.key == "Gorou" && motionValue.key == "DEF Increase")
            {
              motionValue.values[v].stat = null;
              motionValue.values[v].dmgType = "bonus";
            }
            else if(this.key == "Gorou" && motionValue.key == "Geo DMG Bonus")
            {
              motionValue.values[v].stat = null;
              motionValue.values[v].dmgType = "percent";
            }
            // Determine stat scaling.
            else if(motionValue.key.endsWith(" (%)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -4);
              motionValue.values[v].stat = motionValue.values[v].stat ?? "atk";
            }
            else if(motionValue.key.endsWith(" (% Max HP)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -11);
              motionValue.values[v].stat = motionValue.values[v].stat ?? "hp";
            }
            else if(motionValue.key.endsWith(" (%Max HP)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -10);
              motionValue.values[v].stat = motionValue.values[v].stat ?? "hp";
            }
            else if(motionValue.key.endsWith(" (% DEF)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -8);
              motionValue.values[v].stat = motionValue.values[v].stat ?? "def";
            }
            else if(motionValue.key.endsWith(" (% Base ATK)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -13);
              motionValue.values[v].stat = motionValue.values[v].stat ?? "atk-base";
            }
            else if(motionValue.key.endsWith(" (% ATK + % Elemental Mastery)"))
            {
              if(motionValue.key == motionValue.newKey)
                motionValue.newKey = motionValue.key.slice(0, -30);
              motionValue.values[v].stat = motionValue.values[v].stat ?? (v ? "eleMas" : "atk");
            }
            else if(talent == "auto" && motionValue.key.includes("DMG"))
            {
              motionValue.values[v].stat = motionValue.values[v].stat ?? "atk";
            }
            
            // Do the calculation.
            if(motionValue.values[v].stat)
            {
              let baseAdd = 0;
              let baseMult = 1;
              // Motion value modifications that need to be passed to this.applyFormulas()
              for(let modifier of mvModifiers)
              {
                if(Array.isArray(modifier.label) ? modifier.label.indexOf(motionValue.key) > -1 : modifier.label == motionValue.key)
                {
                  if(modifier.method == "+base")
                  {
                    baseAdd += modifier.value;
                  }
                  else if(modifier.method == "*base")
                  {
                    baseMult += modifier.value;
                  }
                }
              }
              this.applyFormulas(motionValue, v, alternates, {baseAdd, baseMult});
              if(motionValue.reaction && !motionValue.newKey.startsWith(`{{reaction:${motionValue.reaction}}} `))
                motionValue.newKey = `{{reaction:${motionValue.reaction}}} ` + motionValue.newKey;
            }
            else if(motionValue.key.endsWith("Stamina Cost"))
            {
              motionValue.values[v].value = parseFloat(motionValue.values[v].value) * (1 + (this.getStat("stamina_cost_", alternates))/100);
              motionValue.values[v].dmgType = null;
            }
            else if(motionValue.key == "Energy Cost")
            {
              motionValue.values[v].value = parseFloat(motionValue.values[v].value);
              motionValue.values[v].dmgType = null;
            }
            // Healing and shielding often add flat values to the stat-scaled value, so handle it here.
            else if(motionValue.values[v].dmgType == "healing" || motionValue.values[v].dmgType == "shielding" || motionValue.values[v].dmgType == "hp")
            {
              if(motionValue.values[v].dmgType == "healing")
                motionValue.values[v].value = motionValue.values[v].value * (1 + this.getStat("heal_", alternates)/100);
              else if(motionValue.values[v].dmgType == "shielding")
                motionValue.values[v].value = motionValue.values[v].value * (1 + this.getStat("shield_", alternates)/100);
            }
            // Specific hard-coded formulas that are too hard to handle automatically.
            else if(this.key == "Shenhe" && motionValue.key == "DMG Bonus (% ATK)")
            {
              motionValue.newKey = "DMG Bonus";
              motionValue.values[v].value = motionValue.values[v].value/100 * this.getStat("atk", alternates);
              motionValue.values[v].dmgType = "bonus";
            }
            else if(this.key == "Xianyun" && motionValue.key == "Plunging Attack Shockwave DMG Bonus (% ATK)")
            {
              motionValue.newKey = "Plunging Attack Shockwave DMG Bonus";
              motionValue.values[v].value = motionValue.values[v].value/100 * this.getStat("atk", alternates);
              motionValue.values[v].dmgType = "bonus";
            }
            else if(this.key == "Nahida" && motionValue.key.startsWith("Pyro: DMG Bonus"))
            {
              motionValue.newKey = motionValue.key.replace("% - ", "");
              motionValue.values[v].dmgType = "percent";
            }
            else if(motionValue.key == "Wave Instances" || motionValue.key == "Maximum Fanfare" || motionValue.key.endsWith("Trigger Quota"))
            {
              motionValue.values[v].dmgType = null;
            }
            // Everything else.
            else if(motionValue.values[v].dmgType == "percent" || motionValue.values[v].dmgType == "self" || motionValue.values[v].dmgType == "bonus")
            {
              motionValue.newKey = motionValue.key.replace(" (%)", "");
            }
            else
            {
              console.warn(`Unhandled numeric motion value.`, motionValue.key, motionValue.rawValues, v);
              motionValue.values[v].value = "**" + motionValue.rawValues[v];
              motionValue.values[v].dmgType = null;
            }
          }
          else if(motionValue.key.endsWith("CD"))
          {
            let tiers = motionValue.rawValues[v].split("/");
            tiers.forEach((cd,i) => tiers[i] = (parseFloat(cd.endsWith("s")?cd.slice(0,-1):cd) * (1 - (this.getStat("cd_", alternates) + this.getStat(talent+"_cd_", alternates))/100)).toFixed(1));
            motionValue.values[v].value = tiers.join("/") + "s";
            motionValue.values[v].dmgType = null;
            // TODO: Some modifiers reduce cooldowns by a flat number of seconds. Will need to see if that applied before or after % reductions.
          }
          else if(motionValue.key.endsWith("Duration"))
          {
            let tiers = motionValue.rawValues[v].split("/");
            tiers.forEach((cd,i) => tiers[i] = (parseFloat(cd.endsWith("s")?cd.slice(0,-1):cd) + this.getStat(talent+"_duration", alternates)).toFixed(1));
            motionValue.values[v].value = tiers.join("/") + "s";
            motionValue.values[v].dmgType = null;
          }
          else if(motionValue.key.endsWith("Interval"))
          {
            let tiers = motionValue.rawValues[v].split("/");
            tiers.forEach((cd,i) => tiers[i] = parseFloat(cd.endsWith("s")?cd.slice(0,-1):cd).toFixed(1));
            motionValue.values[v].value = tiers.join("/") + "s";
            motionValue.values[v].dmgType = null;
          }
          else
          {
            motionValue.values[v].value = "**" + motionValue.rawValues[v];
            motionValue.values[v].dmgType = null;
          }
        }
        motionValue.newKey = motionValue.newKey.replace(") (", " + ");
        
        // Determine the numeric qualities of the motion value.
        let isAllNumeric = motionValue.values.every(elem => !isNaN(elem.value));
        let canCrit = isAllNumeric && motionValue.values.every(elem => !isNaN(elem.critical) && !isNaN(elem.average) && elem.value != elem.critical && elem.dmgType!="percent" && elem.dmgType!="self");
        if(isAllNumeric)
        {
          motionValue.values.forEach(hit => {
            hit.value = parseFloat(hit.value);
            hit.critical = parseFloat(hit.critical);
            hit.average = parseFloat(hit.average);
          });
        }

        // Motion value modifications that require the entire motion value to be calculated first.
        for(let modifier of mvModifiers)
        {
          if(Array.isArray(modifier.label) ? modifier.label.indexOf(motionValue.key) > -1 : modifier.label == motionValue.key)
          {
            if(isAllNumeric && modifier.method == "+hit*")
            {
              let additional = Object.assign({}, motionValue.values[motionValue.values.length-1]);
              additional.value *= modifier.value;
              additional.critical *= modifier.value;
              additional.average *= modifier.value;
              additional.hits = 1;
              motionValue.rawValues.push("");
              motionValue.values.push(additional);
            }
            else if(isAllNumeric && modifier.method == "*")
            {
              motionValue.values.forEach(hit => {
                hit.value *= 1+modifier.value;
                hit.critical *= 1+modifier.value;
                hit.average *= 1+modifier.value;
              });
            }
          }
        }
        
        // Calculate the final number to output.
        if(isAllNumeric)
        {
          if(motionValue.values.every(elem => elem.dmgType))
            motionValue.final = motionValue.values.reduce((out, elem) => out + (canCrit?elem.average:elem.value) * elem.hits, 0);
          else
            motionValue.final = "";
        }
        else
          motionValue.final = "";
        
        // Calculate the text to output.
        motionValue.string = motionValue.values.reduce((out, elem) => {
          return (out!==null ? `${out} + ` : ``)
            + (["anemo","cryo","dendro","electro","hydro","geo","pyro","physical"].indexOf(elem.dmgType)>-1 ? `{{element:${elem.dmgType.slice(0,1).toUpperCase()+elem.dmgType.slice(1).toLowerCase()}}}` : "")
            + (isAllNumeric&&elem.dmgType!="percent"&&elem.dmgType!="self" ? elem.value.toFixed(0) + (canCrit ? ` (${elem.critical.toFixed(0)})` : ``) : elem.value)
            + (elem.dmgType=="percent"||elem.dmgType=="self" ? "%" : "")
            + (elem.hits>1 ? ` × ${elem.hits}` : ``);
        }, null);
        
        result.push(motionValue);
        
        if(!motionValue.reaction)
        {
          if(motionValue.values.some(elem => elem.dmgType == "electro"))
            allKeys.push(motionValue.key+" [aggravate]");
          if(motionValue.values.some(elem => elem.dmgType == "dendro"))
            allKeys.push(motionValue.key+" [spread]");
          if(motionValue.values.some(elem => elem.dmgType == "cryo"))
            allKeys.push(motionValue.key+" [melt-reverse]");
          if(motionValue.values.some(elem => elem.dmgType == "hydro"))
            allKeys.push(motionValue.key+" [vaporize-forward]");
          if(motionValue.values.some(elem => elem.dmgType == "pyro"))
          {
            allKeys.push(motionValue.key+" [melt-forward]");
            allKeys.push(motionValue.key+" [vaporize-reverse]");
          }
          // TODO: If an infusion is toggled-on, these values will not be added, because new motion values are not added on normal value updates, only full statblock updates.
        }
      }
      if(!onlyKey)
        this.saveMemory(result, "motionValues", alternates?.preview?"preview":"current", talent);
    }
    return result;
  }
  
  applyFormulas(motionValue, iValue, rawAlternates, {ignoreRES, ignoreDEF, baseAdd=0, baseMult=1}={})
  {
    let partialValue = motionValue?.values?.[iValue];
    if(isNaN(partialValue.value))
    {
      console.error(`NaN (${partialValue.value}) passed to `);
      return;
    }
    
    let alternates = Object.assign({}, rawAlternates);
    partialValue.value = parseFloat(partialValue.value);
    partialValue.baseDMG = partialValue.stat=="flat" ? partialValue.value : partialValue.value*this.getStat(partialValue.stat, alternates)/100;
    
    if(partialValue.dmgType == "healing")
    {
      partialValue.value = partialValue.baseDMG * (1 + this.getStat("heal_", rawAlternates)/100);
      return;
    }
    else if(partialValue.dmgType == "shielding")
    {
      partialValue.value = partialValue.baseDMG * (1 + this.getStat("shield_", rawAlternates)/100);
      return;
    }
    else if(partialValue.dmgType == "hp" || partialValue.dmgType == "percent" || partialValue.dmgType == "self" || partialValue.dmgType == "bonus")
    {
      partialValue.value = partialValue.baseDMG;
      return;
    }
    
    let critRate;
    let critDMG;
    let dmgMult = 100;
    if(motionValue.talent == "auto")
    {
      if(this.weaponType == "Catalyst")
        partialValue.dmgType = partialValue.dmgType ?? this.element.toLowerCase();
      
      if(motionValue.key.includes("Plunge DMG"))
      {
        partialValue.dmgType = partialValue.dmgType ?? "physical";
        alternates.situation = "Plunging Attack";
        baseAdd += this.getStat("plunging_dmg", alternates);
        dmgMult = this.getStat("plunging_dmg_", alternates);
      }
      else if(motionValue.key.includes("-Hit DMG") || motionValue.key.includes("Aimed Shot") && !motionValue.key.includes("Charge"))
      {
        partialValue.dmgType = partialValue.dmgType ?? "physical";
        alternates.situation = "Normal Attack";
        baseAdd += this.getStat("normal_dmg", alternates);
        dmgMult = this.getStat("normal_dmg_", alternates);
      }
      else
      {
        if(this.weaponType == "Bow")
          partialValue.dmgType = partialValue.dmgType ?? this.element.toLowerCase();
        else
          partialValue.dmgType = partialValue.dmgType ?? "physical";
        alternates.situation = "Charged Attack";
        baseAdd += this.getStat("charged_dmg", alternates);
        dmgMult = this.getStat("charged_dmg_", alternates);
      }
      critRate = this.getStat("critRate_", alternates)/100;
      critDMG = 1 + this.getStat("critDMG_", alternates)/100;
      baseAdd += this.getStat(partialValue.dmgType+"_dmg", alternates) + this.getStat("dmg", alternates);
      dmgMult += this.getStat(partialValue.dmgType+"_dmg_", alternates) + this.getStat("dmg_", alternates);
      if(partialValue.dmgType != "physical")
        dmgMult += this.getStat("elemental_dmg_", alternates);
    }
    else if(motionValue.talent == "reaction")
    {
      dmgMult = this.getStat(partialValue.stat+"_dmg_", alternates);
      critRate = 0;
      critDMG = 0;
    }
    else
    {
      if(motionValue.talent == "skill")
        alternates.situation = "Elemental Skill";
      else if(motionValue.talent == "burst")
        alternates.situation = "Elemental Burst";
      partialValue.dmgType = partialValue.dmgType ?? this.element.toLowerCase();
      critRate = this.getStat("critRate_", alternates)/100;
      critDMG = 1 + this.getStat("critDMG_", alternates)/100;
      baseAdd += this.getStat(motionValue.talent+"_dmg", alternates);
      dmgMult = this.getStat(motionValue.talent+"_dmg_", alternates);
      baseAdd += this.getStat(partialValue.dmgType+"_dmg", alternates) + this.getStat("dmg", alternates);
      dmgMult += this.getStat(partialValue.dmgType+"_dmg_", alternates) + this.getStat("dmg_", alternates);
      if(partialValue.dmgType != "physical")
        dmgMult += this.getStat("elemental_dmg_", alternates);
    }
    
    let level = alternates?.level??(alternates?.preview?(this.previews.level??this.level):this.level);
    if(partialValue.dmgType == "electro" && motionValue.reaction == "aggravate" || partialValue.dmgType == "dendro" && motionValue.reaction == "spread")
    {
      let rxnMult;
      if(motionValue.reaction == "aggravate")
        rxnMult = 1.15;
      if(motionValue.reaction == "spread")
        rxnMult = 1.25;
      let bonusEM = 5 * this.getStat("eleMas",alternates) / (this.getStat("eleMas",alternates) + 1200);
      baseAdd += rxnMult * GenshinCharacterStats.levelReactionMultiplier[level].pc * (1 + bonusEM + this.getStat(motionValue.reaction+"_dmg_",alternates) / 100);
    }
    
    // Defense
    let DEF = 5 * (this.list.targetEnemyData[`enemyLevel`]??90) + 500;
    let k = (1 + this.getStat("enemy_def_",alternates)/100) * (1 - this.getStat("ignore_def_",alternates)/100); // TODO: Ignore def is probably not a stat, because it's attack-specific and not an actual buff to the character.
    let reductionDEF = (level + 100) / (k * ((this.list.targetEnemyData[`enemyLevel`]??90) + 100) + (level + 100));
    
    // Resistances
    let RES = (this.list.targetEnemyData[`enemy${partialValue.dmgType.at(0).toUpperCase()+partialValue.dmgType.slice(1)}RES`]??10) + this.getStat("enemy_"+partialValue.dmgType+"_res_",alternates);
    let reductionRES = RES>=75 ? 1/(4*RES+1) : RES>=0 ? 1-RES/100 : 1-RES/200;
    
    // Vape/Melt
    let rxnMult = 1;
    if(partialValue.dmgType == "cryo" && motionValue.reaction == "melt-reverse" || partialValue.dmgType == "hydro" && motionValue.reaction == "vaporize-forward" || partialValue.dmgType == "pyro" && (motionValue.reaction == "melt-forward" || motionValue.reaction == "vaporize-reverse"))
      rxnMult = this.getReaction(motionValue.reaction, alternates);
    
    // Final
    partialValue.value = (partialValue.baseDMG * baseMult + baseAdd) * (1 + dmgMult/100) * (ignoreRES ? 1 : reductionRES) * (ignoreDEF ? 1 : reductionDEF) * rxnMult;
    partialValue.critical = partialValue.value * critDMG;
    partialValue.average = critRate * partialValue.critical + (1-critRate) * partialValue.value;
  }
  
  getSetBonuses(alternates={})
  {
    // Count the pieces of each set.
    let sets = {};
    for(let slot of ['flower','plume','sands','goblet','circlet'])
    {
      let prop = slot + 'Artifact';
      let artifact = alternates?.[slot]??(alternates?.preview?(this.getPreviewArtifact(slot)??this[prop]):this[prop]);
      if(artifact)
      {
        if(!sets[artifact.setKey])
          sets[artifact.setKey] = {count:0};
        sets[artifact.setKey].count++;
      }
    }
    if(alternates.preview)
    {
      if(this.previews.artifactSet?.[0] && !sets[this.previews.artifactSet[0]])
        sets[this.previews.artifactSet[0]] = {count:0};
      if(this.previews.artifactSet?.[1] && !sets[this.previews.artifactSet[1]])
        sets[this.previews.artifactSet[1]] = {count:0};
      // Apply alternates
      let setsFound = 0;
      for(let set in sets)
      {
        if(sets[set].count >= 4)
        {
          if(this.previews.artifactSet?.[0])
          {
            sets[set].count -= 2;
            sets[this.previews.artifactSet[0]].count += 2;
          }
          if(this.previews.artifactSet?.[1])
          {
            sets[set].count -= 2;
            sets[this.previews.artifactSet[1]].count += 2;
          }
          setsFound += 2;
        }
        else if(sets[set].count >= 2)
        {
          if(this.previews.artifactSet?.[setsFound])
          {
            sets[set].count -= 2;
            sets[this.previews.artifactSet[setsFound]].count += 2;
          }
          setsFound++;
        }
        else if(set == this.previews.artifactSet?.[setsFound])
        {
          sets[this.previews.artifactSet[setsFound]].count += 2;
          setsFound++;
        }
        if(setsFound > 1)
          break;
      }
    }
    return sets;
  }
  
  getBuilds()
  {
    if(this.loaded)
    {
      if(!this.list.viewer.buildData[this.key])
        this.list.viewer.buildData[this.key] = [];
      let builds = Object.values(this.list.viewer.buildData[this.key]);
      if(!builds.length)
      {
        builds.push({name:"default"});
        this.list.viewer.buildData[this.key] = builds;
      }
      for(let build of builds)
      {
        if(!build.name)
          build.name = "???";
        if(!build.artifactSets)
          build.artifactSets = {};
        if(!build.artifactSubstats)
          build.artifactSubstats = {};
        if(!build.sandsStat)
          build.sandsStat = {};
        if(!build.gobletStat)
          build.gobletStat = {};
        if(!build.circletStat)
          build.circletStat = {};
        if(!("minER" in build))
          build.minER = 100;
        if(!("maxER" in build))
          build.maxER = 300;
        if(!("ratioCritRate" in build))
          build.ratioCritRate = 1;
        if(!("ratioCritDMG" in build))
          build.ratioCritDMG = 2;
        if(!("useTargets" in build))
          build.useTargets = {};
        if(!("importance" in build))
          build.importance = 100;
      }
      return builds;
    }
    else
      return [];
  }
  
  getBuild(buildId=this.selectedBuild)
  {
    let builds = this.getBuilds();
    if(builds[buildId])
      return builds[buildId];
    else
    {
      console.warn(`${this.name} has no build '${buildId}'.`);
      return builds[0] ?? {};
    }
  }
  
  getRelatedItems({buildId=this.selectedBuild, skipSort, forceTargets, ignoreTargets}={})
  {
    let useTargets = forceTargets || !ignoreTargets;
    /*let artifacts;
    if(!skipSort)
      artifacts = this.list.viewer.lists.ArtifactList.list.toSorted(Character.sortArtifacts.bind(this, buildId, useTargets));
    else
      artifacts = this.list.viewer.lists.ArtifactList.list;*/
    let related = {
      weapons: this.list.viewer.lists.WeaponList.items(this.weaponType),
      bestArtifacts: {
        /*flower: artifacts.filter(this.list.viewer.lists.ArtifactList.subsetDefinitions['flower']),
        plume: artifacts.filter(this.list.viewer.lists.ArtifactList.subsetDefinitions['plume']),
        sands: artifacts.filter(this.list.viewer.lists.ArtifactList.subsetDefinitions['sands']),
        goblet: artifacts.filter(this.list.viewer.lists.ArtifactList.subsetDefinitions['goblet']),
        circlet: artifacts.filter(this.list.viewer.lists.ArtifactList.subsetDefinitions['circlet']),*/
        flower: this.list.viewer.lists.ArtifactList.items('flower'),
        plume: this.list.viewer.lists.ArtifactList.items('plume'),
        sands: this.list.viewer.lists.ArtifactList.items('sands'),
        goblet: this.list.viewer.lists.ArtifactList.items('goblet'),
        circlet: this.list.viewer.lists.ArtifactList.items('circlet'),
      },
      artifactSets: GenshinArtifactData,
      buildData: this.getBuild(buildId),
      buildId: buildId,
      builds: this.getBuilds(),
      artifactList: this.list.viewer.lists.ArtifactList,
    };
    if(!skipSort)
    {
      let sorter = Character.sortArtifacts.bind(this, buildId, useTargets);
      related.bestArtifacts.flower.sort(sorter);
      related.bestArtifacts.plume.sort(sorter);
      related.bestArtifacts.sands.sort(sorter);
      related.bestArtifacts.goblet.sort(sorter);
      related.bestArtifacts.circlet.sort(sorter);
    }
    if(window.DEBUGLOG.getRelatedItems)
    {
      console.debug(`Getting ${this.name}'s related items for build "${related.buildData?.name}" (${buildId}).`, skipSort?`Skipping artifact sorting.`:`Sorting artifacts.`, useTargets?`Using targets.`:`Ignoring targets.`, related, related.bestArtifacts.goblet[0]);
      console.trace();
    }
    return related;
  }
  
  getMaxArtifactScore(slot, buildId=this.selectedBuild, level=parseInt(this.viewer.settings.preferences.artifactMaxLevel ?? 20))
  {
    if(!slot)
      return null;
    let result = this.loadMemory("maxScores", buildId, slot, level);
    if(!result)
    {
      let levelFactor = level / 20 * 6.8 + 1.2;
      let builds = buildId ? {[buildId]:this.getBuild(buildId)} : this.getBuilds();
      let gigaMax = 0;
      for(let b in builds)
      {
        let bestSubstats = [];
        let build = builds[b];
        for(let s in build.artifactSubstats)
        {
          let value = Math.max(build.artifactSubstats[s]??0, Artifact.substatMins[s]);
          let sort = false;
          // If bestSubstats isn't full, just add a new element.
          if(bestSubstats.length < 5)
          {
            bestSubstats.push({key:s, value:value});
            if(bestSubstats.length == 5)
              sort = true;
          }
          // If bestSubstats is full, overwrite the lowest value element if this one is higher.
          else
          {
            for(let stat in bestSubstats)
            {
              if(bestSubstats[stat].value < value)
              {
                bestSubstats[stat] = {key:s, value:value};
                sort = true;
                break;
              }
            }
          }
          // If a change was made and bestSubstats is full, make sure it's sorted for the next one.
          if(sort)
            bestSubstats.sort((a,b) => a.value-b.value);
        }
        bestSubstats.sort((a,b) => b.value-a.value);
        
        let buildSlot;
        if(slot == "flower")
          buildSlot = {hp:1};
        else if(slot == "plume")
          buildSlot = {atk:1};
        else
          buildSlot = build[slot+'Stat'] ?? {'':0};
        let max = 0;
        for(let s in buildSlot)
        {
          let top4 = bestSubstats.filter(item => item.key != s).slice(0,4);
          let value = buildSlot[s] * levelFactor + top4.reduce((carry,item) => carry+item.value, (top4[0]?.value??0)*5);
          if(value > max)
            max = value;
        }
        this.saveMemory(max, "maxScores", b, slot, level);
        result = max;
        if(max > gigaMax)
          gigaMax = max;
      }
      if(buildId == "")
      {
        this.saveMemory(gigaMax, "maxScores", buildId, slot, level);
        result = gigaMax;
      }
    }
    return result;
  }
  
  getArtifactSetPrio(setKey, buildId=this.selectedBuild)
  {
    return this.getBuild(buildId).artifactSets?.[setKey] ? 1 : 0;
  }
  
  preRender(element, options)
  {
    this.statModifiers = this.statModifiers.filter(mod => mod.isAvailable);
  }
  
  onRender(element)
  {
    super.onRender(element);
    if(element.dataset.template == "genshin/renderCharacterAsPopup")
    {
      this._addStatsEventHandlers(element.querySelector(".character-stats"));
      for(let buildSection of element.querySelectorAll(".character-build"))
      {
        this._addBuildEventHandlers(buildSection);
      }
    }
    else if(element.dataset.template == "genshin/renderCharacterStats" || element.dataset.template == "genshin/renderCharacterStatModifiers" || element.dataset.template == "genshin/renderCharacterMotionValues")
    {
      this._addStatsEventHandlers(element);
    }
    else if(element.dataset.template == "genshin/renderCharacterBuild")
    {
      this._addBuildEventHandlers(element);
    }
    else if(element.dataset.template == "genshin/renderCharacterArtifactLists" || element.dataset.template == "genshin/renderArtifactAsCard")
    {
      this._addArtifactListsEventHandlers(element)
    }
    else
    {
      console.warn(`Character.onRender called for an unrecognized element template.`, element);
    }
  }
  
  _addStatsEventHandlers(statSection)
  {
    let procInputs = statSection.querySelectorAll("input.proc-input");
    for(let procInput of procInputs)
    {
      if(!procInput.onchange)
      {
        procInput.onchange = event => {
          this.clearMemory("stats");
          this.clearMemory("motionValues");
          let value = event.target.type=="checkbox" ? Number(event.target.checked) : parseInt(event.target.value);
          if(event.target.dataset?.owner)
          {
            if(event.target.dataset?.owner == "Team")
            {
              let mod = Team.statModifiers.find(mod => mod.id == event.target.id);
              if(mod)
              {
                mod.active = value;
                this.activeTeam.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
              }
            }
            else
            {
              let character = Renderer.controllers.get(event.target.dataset?.owner);
              let mod = character?.statModifiers.find(mod => mod.id == event.target.id);
              if(mod)
              {
                mod.active = value;
                character.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
                this.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
              }
            }
          }
          else
          {
            let mod = this.statModifiers.find(mod => mod.id == event.target.id);
            if(mod)
            {
              mod.active = value;
              this.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
            }
          }
        };
      }
    }
    
    let enemyInputs = statSection.querySelectorAll("input.enemy-stat");
    for(let enemyInput of enemyInputs)
    {
      if(!enemyInput.onchange)
      {
        this.list.targetEnemyData[enemyInput.id] = parseFloat(enemyInput.value);
        enemyInput.onchange = event => {
          this.clearMemory("stats");
          this.clearMemory("motionValues");
          this.list.update(["targetEnemyData", event.target.id], parseFloat(event.target.value));
        };
      }
    }
    
    let previewResetBtn = statSection.querySelector(".preview-reset");
    if(previewResetBtn && !previewResetBtn.onclick)
    {
      previewResetBtn.onclick = event => {
        event.stopPropagation();
        event.preventDefault();
        this.update("previews", {}, "replace");
      };
    }
    
    previewResetBtn = statSection.querySelector(".preview-reset-team");
    if(previewResetBtn && !previewResetBtn.onclick)
    {
      previewResetBtn.onclick = event => {
        event.stopPropagation();
        event.preventDefault();
        this.activeTeam?.characters.forEach(chara => chara.update("previews", {}, "replace"));
      };
    }
    
    previewResetBtn = statSection.querySelector(".preview-reset-all");
    if(previewResetBtn && !previewResetBtn.onclick)
    {
      previewResetBtn.onclick = event => {
        event.stopPropagation();
        event.preventDefault();
        this.list.list.forEach(chara => chara.update("previews", {}, "replace"));
      };
    }
  }
  
  _addBuildEventHandlers(buildSection)
  {
    let buildId = buildSection.attributes.getNamedItem('name')?.value;
    if(!buildId)
    {
      console.log(`Build section does not have a name attribute specifying what build it's for:`, buildSection);
      return false;
    }
    this.update("selectedBuild", buildId);
    
    /** Add Build Button **/
    let addBuild = buildSection.querySelector("#addBuildBtn");
    if(addBuild && !addBuild.onclick)
      addBuild.onclick = event => {
        let buildName = buildSection.querySelector("#addBuildFld")?.value;
        if(buildName && this.loaded)
        {
          if(!this.list.viewer.buildData[this.key].some(build => build.name == buildName))
          {
            this.list.viewer.buildData[this.key].push({name:buildName});
            this.update("buildData", null, "notify", {buildId:this.list.viewer.buildData[this.key].length-1});
            Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems({buildId:this.list.viewer.buildData[this.key].length-1})});
          }
          else
            console.warn(`Cannot add two builds with the same name '${buildName}'.`);
        }
        else
          console.warn(`Unable to add build.`);
      };
    
    /** Select Build Button **/
    let buildSelect = buildSection.querySelectorAll(".select-build");
    for(let buildTab of buildSelect)
    {
      if(!buildTab.onclick)
        buildTab.onclick = event => {
          Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems({buildId:buildTab.dataset.buildId})});
        };
    }
    
    /** Delete Build Button **/
    let deleteBuild = buildSection.querySelector("#deleteBuildBtn");
    if(deleteBuild && !deleteBuild.onclick)
      deleteBuild.onclick = event => {
        if(this.list.viewer.buildData[this.key].length <= 1)
        {
          console.warn(`Character must keep at least one build.`);
        }
        else if(this.list.viewer.buildData[this.key][buildId])
        {
          this.list.viewer.buildData[this.key].splice(buildId, 1);
          this.update("buildData", null, "notify", {buildId});
          this.update("selectedBuild", 0);
          Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems()});
        }
        else
          console.warn(`Cannot delete nonexistent build '${buildId}'.`);
      };
    
    /** Build Name **/
    let buildTab = buildSection.querySelector(`.nav-item [data-build-id="${buildId}"]`);
    let nameInput = buildSection.querySelector("#buildName");
    if(!nameInput.oninput)
    {
      nameInput.oninput = event => {
        buildTab.innerHTML = nameInput.value;
      };
    }
    if(!nameInput.onblur)
    {
      nameInput.onblur = event => {
        this.getBuild(buildId).name = nameInput.value;
        this.update("buildData", null, "notify", {buildId});
      };
    }
    
    /** Build Importance **/
    let importanceSlider = buildSection.querySelector("#buildImportance");
    if(!importanceSlider.onchange)
    {
      importanceSlider.onchange = event => {
        this.getBuild(buildId).importance = parseInt(importanceSlider.value);
        this.update("buildData", null, "notify", {buildId});
      };
    }
      
    /** Artifact Set Preferences **/
    let artifactSets = buildSection.querySelector("#bestArtifactSets");
    if(artifactSets && !artifactSets.onchange)
      artifactSets.onchange = event => {
        let build = this.getBuild(buildId);
        let sets = [];
        Array.from(artifactSets.selectedOptions).forEach(optionElement => {
          sets.push(optionElement.value);
          if(!build.artifactSets[optionElement.value])
            build.artifactSets[optionElement.value] = {};
        });
        let previousSets = Object.keys(build.artifactSets);
        previousSets.forEach(setKey => {
          if(sets.indexOf(setKey) == -1)
            delete build.artifactSets[setKey];
        });
        this.update("buildData", null, "notify", {property:"artifactSets", buildId});
        Renderer.rerender(buildSection.querySelector(".character-artifacts"), {relatedItems: this.getRelatedItems({buildId, skipSort:true})});
        // TODO: Don't need to rerender everything, just elements marked .favorite and any artifacts of the selected sets.
      };
    
    /** Stat Priority Sliders **/
    let statSliders = buildSection.querySelectorAll(".artifact-stat-slider");
    for(let sliderDiv of statSliders)
    {
      let slider = sliderDiv.querySelector("input");
      if(!slider.onchange)
      {
        let property = sliderDiv.attributes.getNamedItem('name')?.value;
        let label = sliderDiv.querySelector("*[name='value']");
        slider.oninput = event => {
          label.innerHTML = slider.value;
        };
        slider.onchange = event => {
          label.innerHTML = slider.value;
          let stat = slider.attributes.getNamedItem('name')?.value;
          if(property && stat)
          {
            this.getBuild(buildId)[property][stat] = parseFloat(slider.value);
            this.update("buildData", null, "notify", {property, buildId});
            Renderer.rerender(buildSection.querySelector(".character-artifacts"), {relatedItems:this.getRelatedItems({buildId})});
          }
        };
      }
    }
    
    /** Stat Target Toggle **/
    let useTargetsChks = buildSection.querySelectorAll(".target-options");
    useTargetsChks.forEach(useTargetsChk => {
      if(!useTargetsChk.onchange)
      {
        useTargetsChk.onchange = event => {
          this.getBuild(buildId).useTargets[event.target.value] = event.target.checked;
          this.update("buildData", null, "notify", {property:event.target.value,buildId});
          let relatedItems = this.getRelatedItems({buildId}); // Causes the artifact lists to be re-sorted.
          let listElements = buildSection.querySelectorAll(".character-artifacts .list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement, {items:relatedItems.bestArtifacts[listElement.dataset.filter]});
        };
      }
    });
    
    /** Stat Target Fields **/
    let targetInputs = buildSection.querySelectorAll("input.stat-target");
    for(let targetInput of targetInputs)
    {
      if(!targetInput.onchange)
      {
        let property;
        if(targetInput.id == "characterMinER") property = "minER";
        else if(targetInput.id == "characterMaxER") property = "maxER";
        else if(targetInput.id == "characterRatioCritRate") property = "ratioCritRate";
        else if(targetInput.id == "characterRatioCritDMG") property = "ratioCritDMG";
        else continue;
        targetInput.onchange = event => {
          this.getBuild(buildId)[property] = parseFloat(targetInput.value);
          this.update("buildData", null, "notify", {property,buildId});
          let relatedItems = this.getRelatedItems({buildId}); // Causes the artifact lists to be re-sorted.
          let listElements = buildSection.querySelectorAll(".character-artifacts .list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement, {items:relatedItems.bestArtifacts[listElement.dataset.filter]});
        };
      }
    }
    
    let characterArtifacts = buildSection.querySelector(".character-artifacts");
    if(characterArtifacts)
    {
      /** Load Artifacts On Expand **/
      let artifactLists = document.getElementById("characterArtifactLists");
      if(artifactLists && !artifactLists.onexpand)
      {
        artifactLists.addEventListener("show.bs.collapse", event => {
          document.getElementById("loadArtifacts")?.dispatchEvent(new Event("click"));
          //Renderer.rerender(characterArtifacts, {relatedItems:this.getRelatedItems({buildId})});
        });
        artifactLists.onexpand = true;
      }
      
      this._addArtifactListsEventHandlers(characterArtifacts, {buildSection,buildId});
    }
    else
      console.warn(`Build section has no artifact lists section.`);
  }
  
  // Note: Also works if characterArtifacts is an artifact card element, as will be the case when the onlick event below fires and rerenders the card.
  _addArtifactListsEventHandlers(element, {buildSection,buildId,rootElement}={})
  {
    // Determine if element is the container for artifact lists or a child of it.
    let characterArtifacts = element;
    while(characterArtifacts && !characterArtifacts.classList.contains("character-artifacts"))
      characterArtifacts = characterArtifacts.parentElement;
    if(!characterArtifacts)
    {
      console.error(`Element is not a child of the artifact list container.`, element);
      return false;
    }
    
    // Determine the build section element.
    if(!buildSection)
    {
      buildSection = characterArtifacts.parentElement;
      while(buildSection && !buildSection.classList.contains("character-build"))
        buildSection = buildSection.parentElement;
    }
    if(!buildSection)
    {
      console.error(`Equip button element has no ancestor with the 'list-item' class.`);
      return false;
    }
    
    if(!buildId)
      buildId = buildSection.attributes.getNamedItem('name')?.value;
    if(!buildId)
    {
      console.log(`Build section does not have a name attribute specifying what build it's for:`, buildSection);
      return false;
    }
    
    // Determine the root template element.
    if(!rootElement)
    {
      rootElement = buildSection.parentElement;
      while(rootElement && rootElement.dataset.template != this.constructor.templateName)
        rootElement = rootElement.parentElement;
    }
    if(!rootElement)
    {
      console.error(`Artifact list container element has no ancestor with the template data attribute '${this.constructor.templateName}'.`, characterArtifacts);
      return false;
    }
    
    /** Load Artifacts Button **/
    let loadBtn = document.getElementById("loadArtifacts");
    if(loadBtn && !loadBtn.onclick)
      loadBtn.onclick = event => {
        Renderer.rerender(characterArtifacts, {relatedItems:this.getRelatedItems({buildId})});
      };
    
    
    /** showFavoritesToggle **/
    let showFavoritesToggle = document.getElementById("artifactsFilterFavorites");
    if(showFavoritesToggle && !showFavoritesToggle.onchange)
    {
      showFavoritesToggle.onchange = event => {
        if(event.target.checked)
          characterArtifacts.classList.add("favorites-only");
        else
          characterArtifacts.classList.remove("favorites-only");
      };
    }
    
    
    /** Equip Artifact Button **/
    let showTakenToggle = document.getElementById("artifactsFilterTaken");
    if(showTakenToggle && !showTakenToggle.onchange)
    {
      showTakenToggle.onchange = event => {
        if(event.target.checked)
          characterArtifacts.classList.add("available-only");
        else
          characterArtifacts.classList.remove("available-only");
      };
    }
    
    // TODO: Combine the two loops below into maybe a new method for rendering the artifact card.
    /** Preview Artifact Button **/
    let previewButtons = element.querySelectorAll(".preview-artifact");
    for(let equipBtn of previewButtons)
    {
      // Add the equip event.
      if(!equipBtn.onclick)
      {
        // Determine the item for the button.
        let artifactElement = equipBtn.parentElement;
        while(artifactElement && !artifactElement.classList.contains("list-item"))
          artifactElement = artifactElement.parentElement;
        if(!artifactElement)
        {
          console.error(`Preview button element has no ancestor with the 'list-item' class.`);
          return false;
        }
        
        // Verify that item and field are found.
        let artifact = Renderer.controllers.get(artifactElement.dataset.uuid);
        if(!artifact)
        {
          console.error(`Unable to determine item of this button element to preview.`, artifactElement);
          return false;
        }
        
        equipBtn.onclick = event => {
          let prevArtifact = this.preview[artifact.slotKey];
          let prevArtifactElement;
          if(prevArtifact == artifact)
          {
            this.preview[artifact.slotKey] = null;
          }
          else
          {
            prevArtifactElement = prevArtifact ? characterArtifacts.querySelector(`.list-item[data-uuid="${prevArtifact.uuid}"]`) : null;
            this.preview[artifact.slotKey] = artifact;
          }
          this.update("preview", null, "notify");
          let relatedItems = this.getRelatedItems({buildId});
          // This could be handled by implementing "needsUpdate" on all templated elements, and using an "update()" on an associated item.
          //Renderer.rerender(rootElement.querySelector(".character-stats"), {relatedItems});
          let listElements = characterArtifacts.querySelectorAll(".list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement, {items:relatedItems.bestArtifacts[listElement.dataset.filter]});
          Renderer.rerender(artifactElement, {item:artifact, buildId, character:this}, {renderedItem:this});
          if(prevArtifactElement)
            Renderer.rerender(prevArtifactElement, {item:prevArtifact, buildId, character:this}, {renderedItem:this});
        };
      }
    }
    
    /** Equip Artifact Button **/
    let equipButtons = element.querySelectorAll(".equip-artifact");
    for(let equipBtn of equipButtons)
    {
      // Add the equip event.
      if(!equipBtn.onclick)
      {
        // Determine the item for the button.
        let artifactElement = equipBtn.parentElement;
        while(artifactElement && !artifactElement.classList.contains("list-item"))
          artifactElement = artifactElement.parentElement;
        if(!artifactElement)
        {
          console.error(`Equip button element has no ancestor with the 'list-item' class.`);
          return false;
        }
        
        // Verify that item and field are found.
        let artifact = Renderer.controllers.get(artifactElement.dataset.uuid);
        if(!artifact)
        {
          console.error(`Unable to determine item of this button element to equip.`, artifactElement);
          return false;
        }
        
        equipBtn.onclick = event => {
          let prevArtifact = this[artifact.slotKey+'Artifact'];
          let prevArtifactElement = prevArtifact ? characterArtifacts.querySelector(`.list-item[data-uuid="${prevArtifact.uuid}"]`) : null;
          artifact.update("location", this.base?.key ?? this.key);
          let relatedItems = this.getRelatedItems({buildId});
          // This could be handled by implementing "needsUpdate" on all templated elements, and using an "update()" on an associated item.
          //Renderer.rerender(rootElement.querySelector(".character-stats"), {relatedItems});
          let listElements = characterArtifacts.querySelectorAll(".list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement, {items:relatedItems.bestArtifacts[listElement.dataset.filter]});
          Renderer.rerender(artifactElement, {item:artifact, buildId, character:this}, {renderedItem:this});
          if(prevArtifactElement)
            Renderer.rerender(prevArtifactElement, {item:prevArtifact, buildId, character:this}, {renderedItem:this});
        };
      }
    }
  }
}
