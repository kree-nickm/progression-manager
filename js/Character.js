import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinPhaseData from "./gamedata/GenshinPhaseData.js";
import GenshinTalentData from "./gamedata/GenshinTalentData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import { Renderer } from "./Renderer.js";
import GenshinItem from "./GenshinItem.js";
import Artifact from "./Artifact.js";
import Material from "./Material.js";

export default class Character extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["loaded","_weapon","_flower","_plume","_sands","_goblet","_circlet","MaterialList","maxScores"]);
  static goodProperties = ["key","level","constellation","ascension","talent"];
  static templateName = "renderCharacterAsPopup";
  static statBase = {
    critRate_: 5,
    critDMG_: 50,
    enerRech_: 100,
  };
  static ascendStatProgression = {
    '4': {
      anemo_dmg_: [0,0,6,12,12,18,24],
      cryo_dmg_: [0,0,6,12,12,18,24],
      dendro_dmg_: [0,0,6,12,12,18,24],
      electro_dmg_: [0,0,6,12,12,18,24],
      geo_dmg_: [0,0,6,12,12,18,24],
      hydro_dmg_: [0,0,6,12,12,18,24],
      pyro_dmg_: [0,0,6,12,12,18,24],
      atk_: [0,0,6,12,12,18,24],
      hp_: [0,0,6,12,12,18,24],
      critDMG_: null,
      critRate_: null,
      def_: [0,0,7.5,15,15,22.5,30],
      physical_dmg_: [0,0,7.5,15,15,22.5,30],
      eleMas: [0,0,24,48,48,72,96],
      enerRech_: [0,0,6.7,13.4,13.4,20.1,26.8],
      heal_: null,
    },
    '5': {
      anemo_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      cryo_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      dendro_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      electro_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      geo_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      hydro_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      pyro_dmg_: [0,0,7.2,14.4,14.4,21.6,28.8],
      atk_: [0,0,7.2,14.4,14.4,21.6,28.8],
      hp_: [0,0,7.2,14.4,14.4,21.6,28.8],
      critDMG_: [0,0,9.6,19.2,19.2,28.8,38.4],
      critRate_: [0,0,4.8,9.6,9.6,14.4,19.2],
      def_: null,
      physical_dmg_: null,
      eleMas: [0,0,28.8,57.6,57.6,86.4,115.2],
      enerRech_: [0,0,8,16,16,24,32],
      heal_: [0,0,5.5,11,11,16.5,22],
    },
  };
  
  static sortArtifacts(buildId,useTargets,a,b)
  {
    let A = parseFloat(a.getCharacterScore(this,20,buildId,useTargets));
    let B = parseFloat(b.getCharacterScore(this,20,buildId,useTargets));
    if(isNaN(A) && !isNaN(B))
      return 1;
    else if(!isNaN(A) && isNaN(B))
      return -1;
    else if(isNaN(A) && isNaN(B))
      return 0;
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
  consider = true;

  loaded = false;
  _weapon = null;
  _flower = null;
  _plume = null;
  _sands = null;
  _goblet = null;
  _circlet = null;
  MaterialList;
  maxScores = {};
  
  afterLoad()
  {
    this.MaterialList = {crown: this.list.viewer.lists.MaterialList.get("CrownOfInsight")};
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
    super.afterUpdate(field, value, action, options);
    if(field.string == "consider")
    {
      this.viewer.lists.ArtifactList?.update("evaluate", null, "notify");
    }
    else if(field.string == "buildData" || field.path[0]?.[0] == "getBuild")
    {
      if(options.property != "artifactSets")
      {
        if(options.buildId)
        {
          if(options.property == "sandsStat" || options.property == "gobletStat" || options.property == "circletStat")
          {
            this.maxScores[options.buildId][options.property.slice(0,-4)] = {};
            if(this.maxScores[''])
              this.maxScores[''][options.property.slice(0,-4)] = {};
          }
          else
          {
            this.maxScores[options.buildId] = {};
            this.maxScores[''] = {};
          }
        }
        else
        {
          this.maxScores = {};
        }
      }
    }
    return true;
  }
  
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
    
    // Make note of existing equips and then unequip them.
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
          log.push(`Inventory Kamera is known to misread the "Source" label of any artifact where said label is visible, and think it's an "Equipped By" label.`);
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
            return this;
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
      if(skip)
        log.push(`Ignoring the most recent one, because better items generally comes first in the import, and we'll assume you have the best one equipped.`);
      logFunc(...log);
      if(skip)
        return this;
    }
    
    // Unequip the previous equips that we noted above.
    item.character = null;
    this[property] = null;
    
    // If we had an item equipped, and the new item was equipped to another character, give that character our old item.
    if(previousItem && previousCharacter)
    {
      //console.log(`Swapping previous item '${previousItem.name}' to '${previousCharacter.name}'.`);
      previousItem.update("location", previousCharacter.key);
    }
    // If we had an item equipped, let it know it is now unequipped.
    else if(previousItem)
    {
      //console.log(`Setting item '${previousItem.name}' to unequipped.`);
      previousItem.update("location", "");
    }
    // If the new item was equipped to another character, delete the reference to the item.
    else if(previousCharacter)
    {
      //console.log(`Setting character '${previousCharacter}' ${property} slot to unequipped.`);
      previousCharacter[property] = null;
      previousCharacter.update("gear", null, "notify", {slot:property});
    }
    else
    {
      //console.log(`Character had no previous item and item had no previous character.`);
    }
    
    // Notify character item display on both this and previous that they need to update.
    this.notifyType(property);
    previousCharacter?.notifyType(property);
    
    // Finally, set the references on this character and the item to each other.
    this[property] = item;
    this.update("gear", null, "notify", {slot:property});
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
  
  // Getters for genshin item data that is not stored on each instance of this class.
  get name(){ return GenshinCharacterData[this.key]?.name ?? this.key; }
  get weaponType(){ return GenshinCharacterData[this.key]?.weapon ?? ""; }
  get element(){ return GenshinCharacterData[this.key]?.element ?? ""; }
  get rarity(){ return this.loaded ? GenshinCharacterData[this.key].rarity : 0; }
  get ascendStat(){ return this.loaded ? GenshinCharacterData[this.key].ascendStat : ""; }
  get bossMatType(){ return this.loaded ? GenshinCharacterData[this.key].matBoss : ""; }
  get flowerMatType(){ return this.loaded ? GenshinCharacterData[this.key].matFlower : ""; }
  get enemyMatType(){ return this.loaded ? GenshinCharacterData[this.key].matEnemy : ""; }
  
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
    else
      return null;
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
        this.getMat('enemy').getCraftCount() >= this.getMatCost('enemy');
    else
      return this.getMat('gem').count >= this.getMatCost('gem') &&
        (!this.getMat('boss') || this.getMat('boss').count >= this.getMatCost('boss')) &&
        this.getMat('flower').count >= this.getMatCost('flower') &&
        this.getMat('enemy').count >= this.getMatCost('enemy');
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
    this.update(["talent", talent], this.talent[talent]+1);
    //this.list.viewer.store();
    //this.list.render();
  }
  
  canUpTalent(talent, withCrafting=false)
  {
    if(this.talent[talent] == 10)
      return false;
    else if(withCrafting)
      return this.getTalentMat('mastery',talent).getCraftCount() >= this.getTalent(talent).matDomainCount &&
        this.getTalentMat('enemy',talent).getCraftCount() >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce.getCraftCount() >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown.getCraftCount() >= this.getTalent(talent).matCrownCount;
    else
      return this.getTalentMat('mastery',talent).count >= this.getTalent(talent).matDomainCount &&
        this.getTalentMat('enemy',talent).count >= this.getTalent(talent).matEnemyCount &&
        this.MaterialList.trounce.count >= this.getTalent(talent).matTrounceCount &&
        this.MaterialList.crown.count >= this.getTalent(talent).matCrownCount;
  }
  
  getStat(stat, alternates)
  {
    let result = Character.statBase[stat] ?? 0;
    if(this.ascendStat == stat)
      result += Character.ascendStatProgression[this.rarity][this.ascendStat][this.ascension];
    if(this.weapon?.stat == stat)
      result += this.weapon.getStat();
    for(let slot of ['flower','plume','sands','goblet','circlet'])
    {
      let prop = slot + 'Artifact';
      if(this[prop])
      {
        if(this[prop].mainStatKey == stat)
          result += this[prop].mainStatValue;
        result += this[prop]?.getSubstatSum(stat) ?? 0;
      }
    }
    result += this.getSetBonus().stats[stat] ?? 0;
    return result;
  }
  
  getSetBonus(alternates)
  {
    let sets = {};
    for(let slot of ['flower','plume','sands','goblet','circlet'])
    {
      let prop = slot + 'Artifact';
      if(this[prop])
      {
        if(!sets[this[prop].setKey])
          sets[this[prop].setKey] = {count:0};
        sets[this[prop].setKey].count++;
      }
    }
    
    // Collect the current bonuses and their code.
    let bonuses = [];
    let codes = [];
    for(let set in sets)
    {
      for(let i=1; i<=sets[set].count; i++)
      {
        let b = 'bonus'+i;
        let c = 'bonus'+i+'code';
        if(GenshinArtifactData[set][b])
          bonuses.push([set, i, GenshinArtifactData[set][b]]);
        if(GenshinArtifactData[set][c])
        {
          if(Array.isArray(GenshinArtifactData[set][c][0]))
            codes = codes.concat(GenshinArtifactData[set][c]);
          else
            codes.push(GenshinArtifactData[set][c]);
        }
      }
    }
    
    // Handle the codes.
    let substats = [];
    let stats = {};
    for(let code of codes)
    {
      if(code[0] == "proc")
      {
      }
      else if(code[0] == "stat")
      {
        // code[1][0] is the stat to change, or array of stats
        // code[1][1] is the amount, or an array defining a calculation
        let which = Array.isArray(code[1][0]) ? code[1][0] : [code[1][0]];
        for(let s of which)
        {
          if(Array.isArray(code[1][1]))
            console.log("func to handle:", code[1][1]);
          else
            stats[s] = (stats[s] ?? 0) + code[1][1];
        }
      }
      else
      {
        console.log("Unhandled set bonus code:", code);
      }
    }
    return {sets, bonuses, codes, stats, substats}
  }
  
  getBuilds()
  {
    if(this.loaded)
    {
      let builds = this.list.viewer.buildData[this.key] ?? {};
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
    let related = {
      weapons: this.list.viewer.lists.WeaponList.items(this.weaponType),
      bestArtifacts: {
        flower: skipSort ? this.list.viewer.lists.ArtifactList.items("flower") : this.list.viewer.lists.ArtifactList.items("flower").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        plume: skipSort ? this.list.viewer.lists.ArtifactList.items("plume") : this.list.viewer.lists.ArtifactList.items("plume").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        sands: skipSort ? this.list.viewer.lists.ArtifactList.items("sands") : this.list.viewer.lists.ArtifactList.items("sands").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        goblet: skipSort ? this.list.viewer.lists.ArtifactList.items("goblet") : this.list.viewer.lists.ArtifactList.items("goblet").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
        circlet: skipSort ? this.list.viewer.lists.ArtifactList.items("circlet") : this.list.viewer.lists.ArtifactList.items("circlet").sort(Character.sortArtifacts.bind(this,buildId,useTargets)),
      },
      artifactFields: this.list.viewer.lists.ArtifactList.display.fields,
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
    if(!this.maxScores[buildId]?.[slot]?.[level])
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
          buildSlot = {hp:0};
        else if(slot == "plume")
          buildSlot = {atk:0};
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
        if(!this.maxScores[b])
          this.maxScores[b] = {};
        if(!this.maxScores[b][slot])
          this.maxScores[b][slot] = {};
        this.maxScores[b][slot][level] = max;
        if(max > gigaMax)
          gigaMax = max;
      }
      if(buildId == "")
      {
        if(!this.maxScores[buildId])
          this.maxScores[buildId] = {};
        if(!this.maxScores[buildId][slot])
          this.maxScores[buildId][slot] = {};
        this.maxScores[buildId][slot][level] = gigaMax;
      }
    }
    return this.maxScores[buildId][slot][level];
  }
  
  getArtifactSetPrio(setKey, build)
  {
    return this.getBuild(build).artifactSets?.[setKey] ? 1 : 0;
  }
  
  onRender(element)
  {
    super.onRender(element);
    if(element.dataset.template == "renderCharacterAsPopup")
    {
      for(let buildSection of element.querySelectorAll(".character-build"))
      {
        this._addBuildEventHandlers(buildSection);
      }
    }
    else if(element.dataset.template == "renderCharacterStats")
    {
      // Nothing needs doing, yet.
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
            this.update("buildData", null, "notify", {build});
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
        document.querySelector("#artifactEvaluateBtn")?.classList.add("show-notice");
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
          let stat = slider.attributes.getNamedItem('name')?.value;
          this.getBuild(buildId)[property][stat] = parseFloat(slider.value);
          this.update("buildData", null, "notify", {property, buildId});
          label.innerHTML = slider.value;
          this.viewer.lists.ArtifactList.items().forEach(artifact => {
            if(property == "artifactSubstats" || artifact.slotKey === property.slice(0,-4))
              artifact.storedStats.characters[this.key][buildId] = {};
          });
          Renderer.rerender(buildSection.querySelector(".character-artifacts"), {relatedItems:this.getRelatedItems(buildId)});
          document.querySelector("#artifactEvaluateBtn")?.classList.add("show-notice");
        };
      }
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
          let lastERWithinLimit = this.getBuild(buildId).minER <= this.getStat("enerRech_") && this.getStat("enerRech_") < this.getBuild(buildId).maxER;
          this.getBuild(buildId)[property] = parseFloat(targetInput.value);
          this.update("buildData", null, "notify", {property,buildId});
          let currentERWithinLimit = this.getBuild(buildId).minER <= this.getStat("enerRech_") && this.getStat("enerRech_") < this.getBuild(buildId).maxER;
          if(property == "ratioCritRate" || property == "ratioCritDMG" || lastERWithinLimit != currentERWithinLimit)
          {
            this.viewer.lists.ArtifactList.items().forEach(artifact => {
              artifact.storedStats.characters[this.key][buildId].targets = null;
            });
            let listElements = buildSection.querySelectorAll(".character-artifacts .list[data-filter]");
            for(let listElement of listElements)
              Renderer.sortItems(listElement);
          }
        };
      }
    }
    
    /** Stat Target Toggle **/
    let useTargetsChk = buildSection.querySelector("#useTargets");
    if(!useTargetsChk.onchange)
    {
      useTargetsChk.onchange = event => {
        let listElements = buildSection.querySelectorAll(".character-artifacts .list[data-filter]");
        for(let listElement of listElements)
          Renderer.sortItems(listElement);
      };
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
          Renderer.rerender(artifactElement, {item:artifact, buildId, character:this}, {});
          if(prevArtifactElement)
            Renderer.rerender(prevArtifactElement, {item:prevArtifact, buildId, character:this}, {renderedItem:this});
        };
      }
    }
  }
}
