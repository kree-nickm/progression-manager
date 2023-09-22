import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";
import GenshinTalentData from "./gamedata/GenshinTalentData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinCharacterStats from "./gamedata/GenshinCharacterStats.js";
import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import { handlebars, Renderer } from "./Renderer.js";
import GenshinItem from "./GenshinItem.js";
import Artifact from "./Artifact.js";
import Material from "./Material.js";
import Team from "./Team.js";
import StatModifier from "./StatModifier.js";

handlebars.registerHelper("ifHasStat", function(character, statId, options) {
  if(!character || !character.getStat)
  {
    console.error(`Helper 'ifHasStat' called with invalid character argument:`, character);
    return null;
  }
  if(options.hash.situation)
  {
    let general = character.getStat(statId,{},true);
    let situational = character.getStat(statId, {situation:options.hash.situation}, true);
    if(general !== situational) // TODO: IDK how to handle it if the stat is normally 0, but can proc to be increased, but only in specific situations. For example, Candace increasing the Hydro DMG Bonus for only Normal Attacks after her burst, when she has no Hydro DMG Bonus to begin with.
      return options.fn(this);
    return options.inverse(this);
  }
  else
  {
    if(character.getStat(statId,{},true) !== null)
      return options.fn(this);
    return options.inverse(this);
  }
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

export default class Character extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["MaterialList","loaded","_weapon","_flower","_plume","_sands","_goblet","_circlet","preview","statModifiers","activeTeam"]);
  static goodProperties = ["key","level","constellation","ascension","talent"];
  static templateName = "renderCharacterAsPopup";

  static sortArtifacts(buildId,useTargets,a,b)
  {
    let A = parseFloat(a.getCharacterScore(this,20,buildId,{useTargets}));
    let B = parseFloat(b.getCharacterScore(this,20,buildId,{useTargets}));
    if(isNaN(A) || isNaN(B))
    {
      console.error(`Cannot sort artifacts because NaN was encountered for a score.`, A, a, B, b);
      return 0;
    }
    else
      return (B-A);
  }
  
  key = "";
  _constellation = 0;
  _ascension = 0;
  _level = 1;
  talent = {
    auto: 1,
    skill: 1,
    burst: 1,
  };
  favorite = false;

  MaterialList;
  loaded = false;
  _weapon = null;
  _flower = null;
  _plume = null;
  _sands = null;
  _goblet = null;
  _circlet = null;
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
        this.MaterialList.gem[i].addUser(this);
      
      for(let i in this.MaterialList.enemy)
        this.MaterialList.enemy[i].addUser(this);
      
      if(this.MaterialList.boss)
        this.MaterialList.boss.addUser(this);
      
      this.MaterialList.flower.addUser(this);
        
      for(let i in this.MaterialList.mastery)
        this.MaterialList.mastery[i].addUser(this);
      
      this.MaterialList.trounce.addUser(this);
      this.MaterialList.crown.addUser(this);
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
      this.update("statModifiers", null, "notify", {listChange:true, mvChange:"*"});
      
      if(!["preview"].includes(field.path[0]))
      {
        this.viewer.lists.ArtifactList?.update("evaluate", null, "notify");
        this.notifyType(field.string);
        // Iterate through artifacts and clear some amount of artifact.storedStats
        this.viewer.lists.ArtifactList?.items().forEach(artifact => {
          for(let buildId in artifact.storedStats.characters[this.key]??[])
            artifact.storedStats.characters[this.key][buildId].withTargets = null;
        });
      }
    }
    else if(field.path[0] == "statModifiers")
    {
      // listChange should be true when modifiers could have been added or removed from the list.
      if(options.listChange)
      {
        let statModifiersElement = document.querySelector(`[data-template="renderCharacterStatModifiers"][data-uuid="${this.uuid}"]`);
        if(statModifiersElement) Renderer.queueUpdate(statModifiersElement);
      }
      // mvChange should be true when motion values could have been added or removed from a list or motion values.
      if(options.mvChange == "*")
        document.querySelectorAll(`[data-template="renderCharacterMotionValues"][data-uuid="${this.uuid}"]`).forEach(elem => Renderer.queueUpdate(elem));
      else if(["auto","skill","burst"].indexOf(options.mvChange) > -1)
      {
        let motionValuesElement = document.querySelector(`#characterStats\.${options.mvChange}[data-template="renderCharacterMotionValues"][data-uuid="${this.uuid}"]`);
        if(motionValuesElement) Renderer.queueUpdate(motionValuesElement);
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
              artifact.storedStats.characters[this.key][options.buildId] = null;
            else
              artifact.storedStats.characters[this.key] = null;
          }
        });
      }
      else if(["minER","maxER","ratioCritRate","ratioCritDMG"].indexOf(options.property) > -1)
      {
        // Iterate through artifacts and clear some amount of artifact.storedStats
        this.viewer.lists.ArtifactList?.items().forEach(artifact => {
          if(options.buildId)
            artifact.storedStats.characters[this.key][options.buildId].withTargets = null;
          else
            for(let buildId in artifact.storedStats.characters[this.key]??[])
              artifact.storedStats.characters[this.key][buildId].withTargets = null;
        });
      }
      this.viewer.lists.ArtifactList?.update("evaluate", null, "notify");
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
  
  getPhase(ascension=this.ascension){ return GenshinPhaseData[ascension] ?? GenshinPhaseData[6]; }
  get levelCap(){ return this.getPhase().levelCap; }
  
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
      return this.MaterialList.mastery[this.getTalent(talent).matDomainQuality];
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
      return this.getMat('gem').getCraftCount() >= this.getMatCost('gem') &&
        (!this.getMat('boss') || this.getMat('boss').getCraftCount() >= this.getMatCost('boss')) &&
        this.getMat('flower').getCraftCount() >= this.getMatCost('flower') &&
        this.getMat('enemy').getCraftCount() >= this.getMatCost('enemy') &&
        this.getMat('mora').getCraftCount() >= this.getMatCost('mora');
    else
      return this.getMat('gem').count >= this.getMatCost('gem') &&
        (!this.getMat('boss') || this.getMat('boss').count >= this.getMatCost('boss')) &&
        this.getMat('flower').count >= this.getMatCost('flower') &&
        this.getMat('enemy').count >= this.getMatCost('enemy') &&
        this.getMat('mora').count >= this.getMatCost('mora');
  }
  
  upTalent(talent, event)
  {
    if(this.talent[talent] == 10)
    {
      console.error(`Tried to increase ${talent} talent of ${this.name}, but already at max.`);
      return false;
    }
    event.stopPropagation();
    this.getTalentMat('mastery',talent).update("count", this.getTalentMat('mastery',talent).count - this.getTalent(talent).matDomainCount);
    this.getTalentMat('enemy',talent).update("count", this.getTalentMat('enemy',talent).count - this.getTalent(talent).matEnemyCount);
    this.MaterialList.trounce.update("count", this.MaterialList.trounce.count - this.getTalent(talent).matTrounceCount);
    this.MaterialList.crown.update("count", this.MaterialList.crown.count - this.getTalent(talent).matCrownCount);
    this.MaterialList.mora.update("count", this.MaterialList.mora.count - this.getTalent(talent).matMoraCount);
    this.update(["talent", talent], this.talent[talent]+1);
  }
  
  canUpTalent(talent, withCrafting=false)
  {
    if(this.talent[talent] == 10)
      return false;
    else if(withCrafting)
      return this.getTalentMat('mastery',talent).getCraftCount() >= this.getTalent(talent).matDomainCount &&
        this.getTalentMat('enemy',talent).getCraftCount() >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce.getCraftCount() >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown.getCraftCount() >= this.getTalent(talent).matCrownCount &&
        this.MaterialList.mora.getCraftCount() >= this.getTalent(talent).matMoraCount;
    else
      return this.getTalentMat('mastery',talent).count >= this.getTalent(talent).matDomainCount &&
        this.getTalentMat('enemy',talent).count >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce.count >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown.count >= this.getTalent(talent).matCrownCount &&
        this.MaterialList.mora.count >= this.getTalent(talent).matMoraCount;
  }
  
  get teams()
  {
    return this.viewer.lists.TeamList.items(team => team.memberKeys.indexOf(this.key) > -1);
  }
  
  get teamStatModifiers()
  {
    let result = this.statModifiers;
    if(this.activeTeam)
    {
      let teamElements = {Anemo:0, Cryo:0, Dendro:0, Electro:0, Geo:0, Hydro:0, Pyro:0};
      this.activeTeam.characters.forEach(teammate => {
        teamElements[teammate.element]++;
        if(teammate != this)
          result = result.concat(teammate.statModifiers.filter(mod => mod.teamwide));
      });
      let unique = true;
      for(let element in teamElements)
      {
        if(teamElements[element] > 1)
        {
          unique = false;
          result = result.concat(Team.statModifiers.filter(mod => mod.resonance == element));
        }
      }
      if(unique)
        result = result.concat(Team.statModifiers.filter(mod => mod.resonance == "Unique"));
    }
    return result;
  }
  
  getStat(stat, alternates={}, returnNull=false)
  {
    let baseStat;
    let variant;
    [baseStat, variant] = stat.split("-");
    let isPrimary = ["atk","hp","def"].indexOf(baseStat) > -1;
    alternates.character = this;
    
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
      let exists = !returnNull;
      result = GenshinCharacterStats.statBase[stat] ?? 0;
      let baseResult = result;
      let level = alternates?.level??(alternates?.preview?(this.preview.level??this.level):this.level);
      let ascension = alternates?.ascension??(alternates?.preview?(this.preview.ascension??this.ascension):this.ascension);
      let constellation = alternates?.constellation??(alternates?.preview?(this.preview.constellation??this.constellation):this.constellation);
      let weapon = alternates?.weapon??(alternates?.preview?(this.preview.weapon??this.weapon):this.weapon);
      let weaponRefinement = alternates?.refinement??(alternates?.preview?(this.preview.refinement??weapon?.refinement):weapon?.refinement)
      
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
          let artifact = alternates?.[slot]??(alternates?.preview?(this.preview[slot]??this[prop]):this[prop]);
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
          let setBonus = this.handleSetBonus(alternates);
          
          // Apply all valid bonuses.
          this.teamStatModifiers.forEach(mod => {
            result += mod.getStat(baseStat, this, alternates);
            if(mod.hasStat(baseStat, this, alternates))
              exists = true;
          });
        }
      }
      else
        result = baseResult;
      
      result = (exists||result) ? result : null;
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
    
    let level = alternates?.level??(alternates?.preview?(this.preview.level??this.level):this.level);
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
          for(let mv in GenshinCharacterData[this.key].talents?.[t]?.scaling ?? [])
            if(mv == onlyKey)
              talent = t
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
      
      // We clone the scaling object so it doesn't modify the default character data.
      scaling = Object.assign({}, scaling);
      
      // If any new motion values are being dynamically added, do it here.
      console.debug({character:this.key, talent, alternates});
      let mvModifiers = [];
      this.teamStatModifiers.forEach(mod => {
        console.debug(mod);
        mod.getAddedMotionValues(talent, this, alternates).forEach(mv => {
          scaling[mv.label] = {};
          for(let lvl in scaling[Object.keys(scaling)[0]])
            scaling[mv.label][lvl] = mv.value;
        });
        mvModifiers = mvModifiers.concat(mod.getEditedMotionValues(talent, this, alternates));
      });
      console.debug({mvModifiers});
      
      // Iterate through each line of the talent properties.
      let allKeys = Object.keys(scaling);
      for(let k=0; k<allKeys.length; k++)
      {
        let rawKey = allKeys[k];
        let key = rawKey;
        if(onlyKey && key != onlyKey)
          continue;
        
        // If this is a dynamically-added key for the purpose of additional reaction data, figure that out now.
        let reaction;
        if(key.endsWith(" [melt-reverse]"))
        {
          reaction = "melt-reverse";
          key = key.slice(0, -15);
        }
        else if(key.endsWith(" [melt-forward]"))
        {
          reaction = "melt-forward";
          key = key.slice(0, -15);
        }
        else if(key.endsWith(" [vaporize-reverse]"))
        {
          reaction = "vaporize-reverse";
          key = key.slice(0, -19);
        }
        else if(key.endsWith(" [vaporize-forward]"))
        {
          reaction = "vaporize-forward";
          key = key.slice(0, -19);
        }
        else if(key.endsWith(" [aggravate]"))
        {
          reaction = "aggravate";
          key = key.slice(0, -12);
        }
        else if(key.endsWith(" [spread]"))
        {
          reaction = "spread";
          key = key.slice(0, -9);
        }
        
        // Determine current value based on talent level.
        let talentLvl = (alternates?.[talent+'Talent']??(alternates?.preview?(this.preview[talent+'Talent']??this.talent[talent]):this.talent[talent])) + this.getStat(talent+"Level", alternates);
        let value = scaling[key][talentLvl];
        if(!value)
        {
          console.error(`Character ${this.key} has potentially invalid ${talent} talent at key '${key}' talent lvl '${talentLvl}':`, GenshinCharacterData[this.key].talents);
          return null;
        }
        // Parse and calculate the values.
        let values = typeof(value)=="string" ? value.split("+") : [value];
        let calcValues = [];
        let dmgType;
        let newKey = key;
        // Motion value modifications that do not require the motion value to be calculated first.
        for(let modifier of mvModifiers)
        {
          if(Array.isArray(modifier.label) ? modifier.label.indexOf(key) > -1 : modifier.label == key)
          {
            if(modifier.method == "+hit")
              values.push(modifier.value);
          }
        }
        for(let v in values)
        {
          let val = String(values[v]);
          let baseDMG, critical, average;
          let hits = 1;
          let stat;
          dmgType = null;
          for(let modifier of mvModifiers)
            if((modifier.method == "infuse") && (this.weaponType == "Claymore" || this.weaponType == "Sword" || this.weaponType == "Polearm"))
              dmgType = modifier.value;
          
          // Parse out some data based on the value.
          if(val.includes("×") || val.includes("*"))
            [val, hits] = val.split(/[×*]/);
          if(val.includes("@"))
            [val, dmgType] = val.split("@");
          if(val.includes("%:"))
          {
            let other, idx;
            [val, other] = val.split("%:");
            [other, idx] = other.split(".");
            idx = idx ?? 0;
            let otherAttack = result.find(attack => attack.rawKey == other);
            if(!otherAttack)
            {
              otherAttack = this.getMotionValues("", alternates, {onlyKey:other})?.find(attack => attack.rawKey == other);
              if(!otherAttack)
              {
                console.error(`Invalid motion value specification "${values[v]}" for ${this.name}: can't find existing motion value "${other}"`);
                continue;
              }
            }
            val = String(parseFloat(val)/100 * parseFloat(otherAttack.valueList[idx]?.baseDMG));
            stat = "flat";
          }
          
          // Try to turn val into a number, parsing out any non-numeric components where possible
          if(val.endsWith("%"))
          {
            val = val.slice(0, -1);
            stat = "atk";
          }
          else if(val.endsWith("% Max HP"))
          {
            val = val.slice(0, -8);
            stat = "hp";
          }
          else if(val.endsWith("% DEF"))
          {
            val = val.slice(0, -5);
            stat = "def";
          }
          if(!isNaN(val.replaceAll(",","")))
            val = val.replaceAll(",","");
          
          if(!isNaN(val))
          {
            // Determine stat scaling.
            if(key.includes("Regeneration") || key.includes("Healing"))
              dmgType = "healing";
            else if(key.includes("Absorption"))
              dmgType = "shielding";
            else if(key.startsWith("Inherited HP"))
              dmgType = "hp";
            
            if(key.includes("RES Decrease") || key.includes("Ratio"))
            {
              dmgType = "percent";
              stat = null;
            }
            else if(key.endsWith(" (%)"))
            {
              if(key == newKey)
                newKey = key.slice(0, -4);
              stat = "atk";
            }
            else if(key.endsWith(" (% Max HP)"))
            {
              if(key == newKey)
                newKey = key.slice(0, -11);
              stat = "hp";
            }
            else if(key.endsWith(" (% DEF)"))
            {
              if(key == newKey)
                newKey = key.slice(0, -8);
              stat = "def";
            }
            else if(key.endsWith(" (% ATK + % Elemental Mastery)"))
            {
              if(key == newKey)
                newKey = key.slice(0, -30);
              stat = v ? "eleMas" : "atk";
            }
            else if(talent == "auto" && key.includes("DMG"))
            {
              stat = "atk";
            }
            
            // Do the calculation.
            if(stat)
            {
              ({damage:val, dmgType, baseDMG, critical, average} = this.getDamage(val, stat, alternates, {key, talent, dmgType, reaction}));
              if(dmgType != "hp" && !newKey.endsWith(` (${reaction??dmgType})`))
                newKey = newKey + ` (${reaction??dmgType})`;
            }
            else if(key.endsWith("Stamina Cost"))
            {
              val = parseFloat(val) * (1 + (this.getStat("stamina_cost_", alternates))/100);
              dmgType = null;
            }
            else if(key == "Energy Cost")
            {
              val = parseFloat(val);
              dmgType = null;
            }
            // Healing and shielding often add flat values to the stat-scaled value, so handle it here.
            else if(dmgType == "healing" || dmgType == "shielding" || dmgType == "hp")
            {
              //({damage:val, dmgType, baseDMG, critical, average} = this.getDamage(val, "flat", alternates, {key, talent, dmgType, reaction}));
              if(dmgType == "healing")
                val = val * (1 + this.getStat("heal_", alternates)/100);
              else if(dmgType == "shielding")
                val = val * (1 + this.getStat("shield_", alternates)/100);
            }
            // Specific hard-coded formulas that are too hard to handle automatically.
            else if(this.key == "Bennett" && key == "ATK Bonus Ratio (% Base ATK)")
            {
              newKey = "ATK Bonus";
              val = val/100 * this.getStat("atk-base", alternates);
              dmgType = "bonus";
            }
            else if(this.key == "Shenhe" && key == "DMG Bonus (% ATK)")
            {
              newKey = "DMG Bonus";
              val = val/100 * this.getStat("atk", alternates);
              dmgType = "bonus";
            }
            else if(this.key == "Nahida" && key.startsWith("Pyro: DMG Bonus"))
            {
              newKey = key.replace("% - ", "");
              dmgType = "percent";
            }
            else if(key.includes("Instances")) // Candace "Wave Instances"
            {
              dmgType = null;
            }
            // Everything else.
            else if(dmgType == "percent")
            {
              newKey = key.replace(" (%)", "");
            }
            else
            {
              console.warn(`Unhandled numeric motion value.`, key, values, v);
              val = "**" + values[v];
              dmgType = null;
            }
          }
          else if(key.endsWith("CD"))
          {
            let tiers = values[v].slice(0,-1).split("/");
            tiers.forEach((cd,i) => tiers[i] = (parseFloat(cd) * (1 - (this.getStat("cd_", alternates) + this.getStat(talent+"_cd_", alternates))/100)).toFixed(1));
            val = tiers.join("/") + "s";
            dmgType = null;
          }
          else if(key.endsWith("Duration"))
          {
            let tiers = values[v].slice(0,-1).split("/");
            tiers.forEach((cd,i) => tiers[i] = (parseFloat(cd) + this.getStat(talent+"_duration", alternates)).toFixed(1));
            val = tiers.join("/") + "s";
            dmgType = null;
          }
          else
          {
            val = "**" + values[v];
            dmgType = null;
          }
          calcValues.push({raw:values[v], val, hits, baseDMG, critical, average, dmgType});
        }
        newKey = newKey.replace(") (", " + ");
        
        // Motion value modifications that require the motion value to be calculated first.
        for(let modifier of mvModifiers)
        {
          if(Array.isArray(modifier.label) ? modifier.label.indexOf(key) > -1 : modifier.label == key)
          {
            if(modifier.method == "+hit*")
            {
              calcValues.push({val:calcValues[calcValues.length-1].val*modifier.value, hits:1});
            }
            else if(modifier.method == "*")
            {
              calcValues.forEach(cv => cv.val *= 1+modifier.value);
            }
          }
        }
        
        let isAllNumeric = calcValues.every(elem => !isNaN(elem.val));
        let canCrit = isAllNumeric && calcValues.every(elem => !isNaN(elem.critical) && !isNaN(elem.average) && elem.val != elem.critical);
        let valueOut;
        if(isAllNumeric)
        {
          calcValues.forEach(elem => {
            elem.val = parseFloat(elem.val);
            elem.critical = parseFloat(elem.critical);
            elem.average = parseFloat(elem.average);
          });
          if(calcValues.every(elem => elem.dmgType))
            valueOut = calcValues.reduce((out, elem) => out + (canCrit?elem.average:elem.val) * elem.hits, 0);
          else
            valueOut = "";
        }
        else
          valueOut = "";
        
        let stringOut = calcValues.reduce((out, elem) => {
          return (out!==null ? `${out} + ` : ``)
            //+ (["anemo","cryo","dendro","electro","hydro","geo","pyro","physical"].indexOf(elem.dmgType)>-1 ? `{{element:${elem.dmgType.slice(0,1).toUpperCase()+elem.dmgType.slice(1).toLowerCase()}}}` : "")
            + (isAllNumeric ? elem.val.toFixed(0) + (canCrit ? ` (${elem.critical.toFixed(0)})` : ``) : elem.val)
            + (elem.dmgType=="percent" ? "%" : "")
            + (elem.hits>1 ? ` × ${elem.hits}` : ``);
        }, null);
        
        result.push({
          rawKey,
          key: newKey,
          rawValue: value,
          valueList: calcValues,
          string: stringOut,
          value: valueOut,
        });
        
        if(!reaction)
        {
          if(calcValues.some(elem => elem.dmgType == "electro"))
            allKeys.push(key+" [aggravate]");
          if(calcValues.some(elem => elem.dmgType == "dendro"))
            allKeys.push(key+" [spread]");
          if(calcValues.some(elem => elem.dmgType == "cryo"))
            allKeys.push(key+" [melt-reverse]");
          if(calcValues.some(elem => elem.dmgType == "hydro"))
            allKeys.push(key+" [vaporize-forward]");
          if(calcValues.some(elem => elem.dmgType == "pyro"))
          {
            allKeys.push(key+" [melt-forward]");
            allKeys.push(key+" [vaporize-reverse]");
          }
          // TODO: If an infusion is toggled-on, these values will not be added, because new motion values are not added on normal value updates, only full statblock updates.
        }
      }
      if(!onlyKey)
        this.saveMemory(result, "motionValues", alternates?.preview?"preview":"current", talent);
    }
    return result;
  }
  
  getDamage(value, stat, rawAlternates, {key="", talent, dmgType, ignoreRES, ignoreDEF, reaction}={})
  {
    if(isNaN(value))
    {
      console.error(`NaN (${value}) passed to `);
      return {
        damage: NaN,
        dmgType,
      };
    }
    
    let alternates = Object.assign({}, rawAlternates);
    value = parseFloat(value);
    let baseDMG = stat=="flat" ? value : value/100 * this.getStat(stat, alternates);
    
    if(dmgType == "healing")
    {
      let value = baseDMG * (1 + this.getStat("heal_", rawAlternates)/100);
      return {
        baseDMG,
        damage: value,
        dmgType,
        critical: value,
        average: value,
      };
    }
    else if(dmgType == "shielding")
    {
      let value = baseDMG * (1 + this.getStat("shield_", rawAlternates)/100);
      return {
        baseDMG,
        damage: value,
        dmgType,
        critical: value,
        average: value,
      };
    }
    else if(dmgType == "hp")
    {
      return {
        baseDMG,
        damage: baseDMG,
        dmgType,
        critical: baseDMG,
        average: baseDMG,
      };
    }
    
    let critRate = this.getStat("critRate_", alternates)/100;
    let critDMG = 1 + this.getStat("critDMG_", alternates)/100;
    let dmgMult = 100;
    if(talent == "auto")
    {
      if(this.weaponType == "Catalyst")
        dmgType = dmgType ?? this.element.toLowerCase();
      
      if(key.includes("Plunge DMG"))
      {
        dmgType = dmgType ?? "physical";
        alternates.situation = "Plunging Attack";
        dmgMult = this.getStat("plunging_dmg_", alternates);
      }
      else if(key.includes("-Hit DMG") || key.includes("Aimed Shot") && !key.includes("Charge"))
      {
        dmgType = dmgType ?? "physical";
        alternates.situation = "Normal Attack";
        dmgMult = this.getStat("normal_dmg_", alternates);
      }
      else
      {
        if(this.weaponType == "Bow")
          dmgType = dmgType ?? this.element.toLowerCase();
        else
          dmgType = dmgType ?? "physical";
        alternates.situation = "Charged Attack";
        dmgMult = this.getStat("charged_dmg_", alternates);
      }
      dmgMult += this.getStat(dmgType+"_dmg_", alternates) + this.getStat("dmg_", alternates);
    }
    else if(talent == "reaction")
    {
      dmgMult = this.getStat(stat+"_dmg_", alternates);
      critRate = 0;
      critDMG = 0;
    }
    else
    {
      if(talent == "skill")
        alternates.situation = "Elemental Skill";
      else if(talent == "burst")
        alternates.situation = "Elemental Burst";
      dmgType = dmgType ?? this.element.toLowerCase();
      dmgMult = this.getStat(talent+"_dmg_", alternates);
      dmgMult += this.getStat(dmgType+"_dmg_", alternates) + this.getStat("dmg_", alternates);
    }
    
    let level = alternates?.level??(alternates?.preview?(this.preview.level??this.level):this.level);
    let baseMult = 1; // TODO: A couple passives/cons add this.
    let baseAdd = 0; // TODO: A lot of things add this.
    if(dmgType == "electro" && reaction == "aggravate" || dmgType == "dendro" && reaction == "spread")
    {
      let rxnMult;
      if(reaction == "aggravate")
        rxnMult = 1.15;
      if(reaction == "spread")
        rxnMult = 1.25;
      let bonusEM = 5 * this.getStat("eleMas",alternates) / (this.getStat("eleMas",alternates) + 1200);
      baseAdd += rxnMult * GenshinCharacterStats.levelReactionMultiplier[level].pc * (1 + bonusEM + this.getStat(reaction+"_dmg_",alternates) / 100);
    }
    
    // Defense
    let DEF = 5 * (this.list.targetEnemyData[`enemyLevel`]??90) + 500;
    let k = (1 + this.getStat("enemy_def_",alternates)/100) * (1 - this.getStat("ignore_def_",alternates)/100); // TODO: Ignore def is probably not a stat, because it's attack-specific and not an actual buff to the character.
    let reductionDEF = (this.level + 100) / (k * ((this.list.targetEnemyData[`enemyLevel`]??90) + 100) + (this.level + 100));
    
    // Resistances
    let RES = (this.list.targetEnemyData[`enemy${dmgType.at(0).toUpperCase()+dmgType.slice(1)}RES`]??10) + this.getStat("enemy_"+dmgType+"_res_",alternates);
    let reductionRES = RES>=75 ? 1/(4*RES+1) : RES>=0 ? 1-RES/100 : 1-RES/200;
    
    // Vape/Melt
    let rxnMult = 1;
    if(dmgType == "cryo" && reaction == "melt-reverse" || dmgType == "hydro" && reaction == "vaporize-forward" || dmgType == "pyro" && (reaction == "melt-forward" || reaction == "vaporize-reverse"))
      rxnMult = this.getReaction(reaction, alternates);
    
    // Final
    //console.debug(`Damage calculations for "${newKey}":`, {value, [stat]:this.getStat(stat, alternates), baseDMG, baseMult, baseAdd, dmgMult, hits, resistance:{RES, reductionRES}, defense:{DEF, k, reductionDEF}, alternates});
    let damage = (baseDMG * baseMult + baseAdd) * (1 + dmgMult/100) * (ignoreRES ? 1 : reductionRES) * (ignoreDEF ? 1 : reductionDEF) * rxnMult;
    let critical = damage * critDMG;
    let average = critRate * critical + (1-critRate) * damage;
    return {baseDMG, damage, dmgType, critical, average};
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
  handleSetBonus(alternates={})
  {
    // Count the pieces of each set.
    let sets = {};
    for(let slot of ['flower','plume','sands','goblet','circlet'])
    {
      let prop = slot + 'Artifact';
      let artifact = alternates?.[slot]??(alternates?.preview?(this.preview[slot]??this[prop]):this[prop]);
      if(artifact)
      {
        if(!sets[artifact.setKey])
          sets[artifact.setKey] = {count:0};
        sets[artifact.setKey].count++;
        // If you have enough pieces for a set bonus, create a stat modifier for it.
        let code = GenshinArtifactData[artifact.setKey]['bonus'+sets[artifact.setKey].count+'code'];
        if(code)
        {
          StatModifier.create(code, this, "setBonus", {set:artifact.setKey, pieces:sets[artifact.setKey].count});
        }
      }
    }
    return sets;
  }
  
  getBuilds()
  {
    if(this.loaded)
    {
      if(!this.list.viewer.buildData[this.key])
        this.list.viewer.buildData[this.key] = {};
      let builds = this.list.viewer.buildData[this.key];
      if(!builds.default)
        builds.default = {};
      for(let b in builds)
      {
        if(!builds[b].artifactSets)
          builds[b].artifactSets = {};
        if(!builds[b].artifactSubstats)
          builds[b].artifactSubstats = {};
        if(!builds[b].sandsStat)
          builds[b].sandsStat = {};
        if(!builds[b].gobletStat)
          builds[b].gobletStat = {};
        if(!builds[b].circletStat)
          builds[b].circletStat = {};
        if(!("minER" in builds[b]))
          builds[b].minER = 100;
        if(!("maxER" in builds[b]))
          builds[b].maxER = 300;
        if(!("ratioCritRate" in builds[b]))
          builds[b].ratioCritRate = 1;
        if(!("ratioCritDMG" in builds[b]))
          builds[b].ratioCritDMG = 2;
        if(!("useTargets" in builds[b]))
          builds[b].useTargets = {};
        if(!("importance" in builds[b]))
          builds[b].importance = 100;
      }
      return builds;
    }
    else
      return {};
  }
  
  getBuild(build="default")
  {
    if(this.getBuilds()[build])
      return this.getBuilds()[build];
    else
    {
      console.warn(`${this.name} has no build '${build}'.`);
      return {};
    }
  }
  
  getRelatedItems(buildId="default", {skipSort,forceTargets,ignoreTargets}={})
  {
    let useTargets = forceTargets || !ignoreTargets && document.getElementById('useTargets')?.checked;
    if(window.DEBUGLOG.getRelatedItems) console.debug(`Getting ${this.name}'s related items for build ${buildId}.`, skipSort?`Skipping artifact sorting.`:`Sorting artifacts.`, useTargets?`Using targets.`:`Ignoring targets.`);
    let related = {
      weapons: this.list.viewer.lists.WeaponList.items(this.weaponType),
      bestArtifacts: {
        flower: skipSort ? this.list.viewer.lists.ArtifactList.items("flower") : this.list.viewer.lists.ArtifactList.items("flower").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        plume: skipSort ? this.list.viewer.lists.ArtifactList.items("plume") : this.list.viewer.lists.ArtifactList.items("plume").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        sands: skipSort ? this.list.viewer.lists.ArtifactList.items("sands") : this.list.viewer.lists.ArtifactList.items("sands").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        goblet: skipSort ? this.list.viewer.lists.ArtifactList.items("goblet") : this.list.viewer.lists.ArtifactList.items("goblet").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        circlet: skipSort ? this.list.viewer.lists.ArtifactList.items("circlet") : this.list.viewer.lists.ArtifactList.items("circlet").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
      },
      //artifactFields: this.list.viewer.lists.ArtifactList.display.getFields().map(field => ({field, params:[]})),
      artifactSets: GenshinArtifactData,
      buildData: this.getBuild(buildId),
      buildName: buildId,
      builds: Object.keys(this.getBuilds()),
      artifactList: this.list.viewer.lists.ArtifactList,
    };
    return related;
  }
  
  getMaxArtifactScore(slot, buildId="", level=20)
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
  
  getArtifactSetPrio(setKey, build)
  {
    return this.getBuild(build).artifactSets?.[setKey] ? 1 : 0;
  }
  
  preRender(element, options)
  {
    this.statModifiers = this.statModifiers.filter(mod => mod.isAvailable);
  }
  
  onRender(element)
  {
    super.onRender(element);
    if(element.dataset.template == "renderCharacterAsPopup")
    {
      this._addStatsEventHandlers(element.querySelector(".character-stats"));
      for(let buildSection of element.querySelectorAll(".character-build"))
      {
        this._addBuildEventHandlers(buildSection);
      }
    }
    else if(element.dataset.template == "renderCharacterStats" || element.dataset.template == "renderCharacterStatModifiers" || element.dataset.template == "renderCharacterMotionValues")
    {
      this._addStatsEventHandlers(element);
    }
    else if(element.dataset.template == "renderCharacterBuild")
    {
      this._addBuildEventHandlers(element);
    }
    else if(element.dataset.template == "renderCharacterArtifactLists" || element.dataset.template == "renderArtifactAsCard")
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
    let activeTeam = statSection.querySelector("#activeTeam");
    if(activeTeam && !activeTeam.onchange)
      activeTeam.onchange = event => this.update("activeTeam", event.target.value ? Renderer.controllers.get(event.target.value) : null, "replace");
    
    let procInputs = statSection.querySelectorAll("input.proc-input");
    for(let procInput of procInputs)
    {
      if(!procInput.onchange)
      {
        procInput.onchange = event => {
          this.clearMemory("stats");
          this.clearMemory("motionValues");
          if(event.target.dataset?.owner)
          {
            let character = Renderer.controllers.get(event.target.dataset?.owner);
            let mod = character?.statModifiers.find(mod => mod.id == event.target.id);
            if(mod)
            {
              mod.active = parseInt(event.target.value);
              character.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
              this.update("statModifiers", null, "notify", {mvChange:mod.mvChange});
            }
          }
          else
          {
            let mod = this.statModifiers.find(mod => mod.id == event.target.id);
            if(mod)
            {
              mod.active = parseInt(event.target.value);
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
        let previewInputs = statSection.querySelectorAll("input.preview-stat, select.preview-stat");
        for(let previewInput of previewInputs)
        {
          if(previewInput.value != previewInput.dataset.current)
          {
            previewInput.value = previewInput.dataset.current;
            previewInput.dispatchEvent(new Event("change"));
          }
        }
        this.update("preview", null, "notify");
      };
    }
    
    let previewInputs = statSection.querySelectorAll("input.preview-stat, select.preview-stat");
    for(let previewInput of previewInputs)
    {
      if(!previewInput.onchange)
      {
        previewInput.onchange = event => {
          if(previewInput.id == "previewWeapon")
          {
            this.preview.weapon = Renderer.controllers.get(previewInput.value);
            this.preview.weaponLevel = parseFloat(document.getElementById('previewWeaponLevel').value);
            this.preview.weaponAscension = parseFloat(document.getElementById('previewWeaponAscend').value);
            this.preview.refinement = parseFloat(document.getElementById('previewRefinement').value);
            this.update("preview", null, "notify");
          }
          else
            this.update(["preview", previewInput.dataset.stat], parseFloat(previewInput.value));
        };
      }
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
    
    /** Add Build Button **/
    let addBuild = buildSection.querySelector("#addBuildBtn");
    if(addBuild && !addBuild.onclick)
      addBuild.onclick = event => {
        let build = buildSection.querySelector("#addBuildFld")?.value;
        if(build && this.loaded)
        {
          if(!this.list.viewer.buildData[this.key][build])
          {
            this.list.viewer.buildData[this.key][build] = {};
            this.update("buildData", null, "notify", {buildId:build});
            Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems(build)});
          }
          else
            console.warn(`Cannot add two builds with the same name '${build}'.`);
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
          Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems(buildTab.innerHTML)});
        };
    }
    
    /** Delete Build Button **/
    let deleteBuild = buildSection.querySelector("#deleteBuildBtn");
    if(deleteBuild && !deleteBuild.onclick)
      deleteBuild.onclick = event => {
        if(this.list.viewer.buildData[this.key][buildId])
        {
          delete this.list.viewer.buildData[this.key][buildId];
          this.update("buildData", null, "notify", {buildId});
          Renderer.rerender(buildSection, {relatedItems:this.getRelatedItems()});
        }
        else
          console.warn(`Cannot delete nonexistent build '${buildId}'.`);
      };
    
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
        Renderer.rerender(buildSection.querySelector(".character-artifacts"), {relatedItems: this.getRelatedItems(buildId, {skipSort:true})});
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
            Renderer.rerender(buildSection.querySelector(".character-artifacts"), {relatedItems:this.getRelatedItems(buildId)});
          }
        };
      }
    }
    
    /** Stat Target Toggle **/
    let useTargetsChk = buildSection.querySelector("#useTargets");
    if(!useTargetsChk.onchange)
    {
      useTargetsChk.onchange = event => {
        if(event.target == useTargetsChk)
        {
          this.getBuild(buildId).useTargets = { // TODO: Add a checkbox for every different stat target.
            enerRech_: useTargetsChk.checked,
            critRatio: useTargetsChk.checked,
          };
          this.update("buildData", null, "notify", {property:'useTargets',buildId});
        }
        this.getRelatedItems(buildId); // Causes the artifact lists to be re-sorted.
        let listElements = buildSection.querySelectorAll(".character-artifacts .list[data-filter]");
        for(let listElement of listElements)
          Renderer.sortItems(listElement);
      };
    }
    
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
          if(useTargetsChk.checked)
            useTargetsChk.onchange(event);
        };
      }
    }
    
    this._addArtifactListsEventHandlers(buildSection.querySelector(".character-artifacts"), {buildSection,buildId});
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
        Renderer.rerender(characterArtifacts, {relatedItems:this.getRelatedItems(buildId)});
      };
      
    
    /** Equip Artifact Button **/
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
          let relatedItems = this.getRelatedItems(buildId);
          // This could be handled by implementing "needsUpdate" on all templated elements, and using an "update()" on an associated item.
          Renderer.rerender(rootElement.querySelector(".character-stats"), {relatedItems});
          let listElements = characterArtifacts.querySelectorAll(".list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement);
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
          let relatedItems = this.getRelatedItems(buildId);
          // This could be handled by implementing "needsUpdate" on all templated elements, and using an "update()" on an associated item.
          Renderer.rerender(rootElement.querySelector(".character-stats"), {relatedItems});
          let listElements = characterArtifacts.querySelectorAll(".list[data-filter]");
          for(let listElement of listElements)
            Renderer.sortItems(listElement);
          Renderer.rerender(artifactElement, {item:artifact, buildId, character:this}, {renderedItem:this});
          if(prevArtifactElement)
            Renderer.rerender(prevArtifactElement, {item:prevArtifact, buildId, character:this}, {renderedItem:this});
        };
      }
    }
  }
}
