import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinArtifactStats from "./gamedata/GenshinArtifactStats.js";

import GenshinItem from "./GenshinItem.js";

export default class Artifact extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["character","wanters","storedStats","substatRolls"]);
  static goodProperties = ["setKey","slotKey","level","rarity","mainStatKey","location","lock","substats"];
  static shorthandStat = {
    'eleMas': "EM",
    'enerRech_': "ER%",
    'def': "DEF",
    'def_': "DEF%",
    'hp': "HP",
    'hp_': "HP%",
    'atk': "ATK",
    'atk_': "ATK%",
    'critDMG_': "C.DMG",
    'critRate_': "C.Rate",
    'anemo_dmg_': "Anemo%",
    'hydro_dmg_': "Hydro%",
    'cryo_dmg_': "Cryo%",
    'pyro_dmg_': "Pyro%",
    'electro_dmg_': "Electro%",
    'dendro_dmg_': "Dendro%",
    'geo_dmg_': "Geo%",
    'physical_dmg_': "Phys%",
    'heal_': "Heal%",
  };
  static substats = ['critRate_','critDMG_','atk_','enerRech_','eleMas','hp_','def_','atk','hp','def'];
  static substatMins = {
    'critRate_': 0.03,
    'critDMG_': 0.03,
    'atk_': 0.03,
    'enerRech_': 0.03,
    'eleMas': 0.02,
    'hp_': 0.02,
    'def_': 0.02,
    'atk': 0.02,
    'hp': 0.01,
    'def': 0.01,
  };
  
  id;
  slotKey = "";
  setKey = "";
  mainStatKey = "";
  location = "";
  lock = false;
  substats = [];
  substatRolls = {};
  _level = 0;
  _rarity = 0;
  storedStats = {
    ratings: {},
    characters: {},
  };
  character = null;
  wanters = [];
  
  afterLoad()
  {
    if(GenshinArtifactData[this.setKey])
      this.determineRolls();
    else
      console.error(`Unknown artifact set '${this.setKey}'.`);
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location")
    {
      if(value)
      {
        let newCharacter = this.list.viewer.lists.CharacterList.get(value);
        if(newCharacter)
          newCharacter.equipItem(this);
        else
        {
          console.warn(`Cannot equip ${this.name} (${this.setName} ${this.slotKey}) to non-existent character "${this.location}".` + (this.list.importing ? ` GOOD data may have been exported incorrectly; consider reporting a bug to the developer of the export tool.` : ""));
          field.object[field.property] = "";
          this.character = null;
        }
      }
      else
      {
        if(this.character)
          this.character.update(this.slotKey+'Artifact', null, "replace");
        this.character = null;
      }
    }
    else
    {
      if(!this.importing && this.substats && (field.string == "substats" || field.string == "level" || field.string == "rarity"))
        this.determineRolls();
      this.storedStats.ratings = {};
      this.storedStats.characters = {};
    }
    if(field.string != "lock")
      document.querySelector("#artifactEvaluateBtn")?.classList.add("show-notice");
  }
  
  get level(){ return this._level; }
  set level(val){
    if(val < 0)
      val = this._level + val;
    this._level = Math.min(Math.max(val, 0), 20);
  }
  get rarity(){ return this._rarity; }
  set rarity(val){ this._rarity = Math.min(Math.max(val, 1), 5); }
  
  get name(){ return GenshinArtifactData[this.setKey]?.[this.slotKey] ?? `${this.setName} ${this.slotKey}`; }
  get setName(){ return GenshinArtifactData[this.setKey]?.name ?? this.setKey; }
  get levelCap(){ return GenshinArtifactStats[this.rarity]?.levelCap ?? 0; }
  get mainStatShorthand(){ return Artifact.shorthandStat[this.mainStatKey]; }
  get mainStatValue(){
    let key = this.mainStatKey.endsWith("o_dmg_") ? "elemental_dmg_" : this.mainStatKey;
    return GenshinArtifactStats[this.rarity].mainstats[key][this.level];
  }
  get image(){ return GenshinArtifactData[this.setKey]?.[this.slotKey+'Img'] ?? ""; }
  
  setSubstat(statId, value)
  {
    let found = false;
    for(let substat of this.substats)
    {
      if(substat.key == statId)
      {
        substat.value = value;
        found = true;
      }
    }
    if(!found)
    {
      if(Artifact.substats.indexOf(statId) > -1 && this.substats.length < 4)
      {
        this.substats.push({key:statId, value:value});
        found = true;
      }
      else
        console.warn(`Could not update substat ${statId} to value ${value}, current substats:`, this.substats);
    }
    if(found)
    {
      this.determineRolls();
      this.update("substats", null, "notify");
    }
  }
  
  determineRolls()
  {
    this.cleanSubstats();
    let rollTotals = {};
    for(let stat of this.substats)
      rollTotals[stat.key] = (stat.value / GenshinArtifactStats[this.rarity].substats[stat.key]).toFixed(1);
    
    if(this.substats.length < 4)
    {
      this.substatRolls = {};
      for(let statKey in rollTotals)
        this.substatRolls[statKey] = [parseFloat(rollTotals[statKey])];
      return this.substatRolls;
    }
    else
    {
      let possibles = {};
      for(let statKey in rollTotals)
      {
        possibles[statKey] = [];
        let minNumRolls = Math.ceil(rollTotals[statKey]);
        let maxNumRolls = Math.floor(rollTotals[statKey]/0.7);
        let iterations = Math.pow(5,maxNumRolls);
        for(let iter=0; iter<iterations; iter++)
        {
          let statRolls = [];
          let i = iter;
          // Convert the iteration into a specific set of "rolls" for this stat.
          while(i > 0)
          {
            // Only allow "roll" sets that are in descending order.
            if(!statRolls.length || statRolls[statRolls.length-1] >= (i%5))
            {
              statRolls.push(i%5);
              i = Math.floor(i/5);
            }
            else
              i = -1;
          }
          if(i < 0)
            continue;
          // Convert the "rolls" into actual rolls.
          statRolls = statRolls.filter(num => num > 0).map(num => num>0 ? 0.6+num*0.1 : 0);
          // Only keep roll sets that are valid and add up to the actual stat total roll value.
          if(statRolls.length >= minNumRolls && rollTotals[statKey] == statRolls.reduce((total,num) => total+num).toFixed(1))
          {
            // Only keep one roll set of a given number of rolls, since they are totally interchangeable.
            if(!possibles[statKey].find(elem => elem.length == statRolls.length))
              possibles[statKey].push(statRolls);
          }
        }
      }
      let minRolls = Math.max(0, Math.floor(this.level/4) + this.rarity-2);
      let maxRolls = Math.floor(this.level/4) + this.rarity-1;
      let keys = Object.keys(possibles);
      for(let rollsA of possibles[keys[0]])
        for(let rollsB of possibles[keys[1]])
          for(let rollsC of possibles[keys[2]])
            for(let rollsD of possibles[keys[3]])
      {
        let rollCount = rollsA.length + rollsB.length + rollsC.length + rollsD.length;
        if(rollCount >= minRolls && rollCount <= maxRolls)
        {
          this.substatRolls = {[keys[0]]: rollsA, [keys[1]]: rollsB, [keys[2]]: rollsC, [keys[3]]: rollsD};
          return this.substatRolls;
        }
      }
      console.warn(`[Ignore if you are still editing artifact] Artifact substats do not have values that can be divided into any number of valid rolls (Rarity:${this.rarity}) (Level:${this.level}) (${minRolls}<=rollCount<=${maxRolls}).`, this.substats, rollTotals, possibles);
      return null;
    }
  }
  
  cleanSubstats()
  {
    this.substats = this.substats.filter(stat => Artifact.substats.indexOf(stat.key) > -1 && stat.value > 0);
    this.substats.sort((a,b) => Artifact.substats.indexOf(a.key) - Artifact.substats.indexOf(b.key));
  }
  
  getSubstatSum(statId)
  {
    return (this.substatRolls[statId]?.reduce((total,roll) => total+roll) ?? 0) * (GenshinArtifactStats[this.rarity]?.substats?.[statId] ?? 0);
  }
  
  getSubstatRating(statId)
  {
    if(this.storedStats.ratings[statId] === undefined)
    {
      // Can't roll it if it's a main stat.
      if(this.mainStatKey == statId)
        this.storedStats.ratings[statId] = {base:0, chance:0, sum:0};
      else
      {
        let baseRating = this.substatRolls[statId]?.reduce((total,roll) => total+roll) ?? 0;
        let avgRoll = GenshinArtifactStats[this.rarity].substats[statId] * (this.rarity==1 ? 0.9 : 0.85);
        let tiersRemaining = Math.ceil((this.levelCap - this.level) / 4);
        let statsOpen = 4 - this.substats.length;
        let chanceRating = (0.25 * (tiersRemaining - statsOpen) * avgRoll) / GenshinArtifactStats[5].substats[statId];
        
        // If we have the stat, we only need to factor in the boosts.
        if(baseRating > 0)
          this.storedStats.ratings[statId] = {base:baseRating, chance:chanceRating, sum:baseRating+chanceRating};
        else
        {
          // Instead, now we need to calculate the odds of gaining the stat first...
          let total = 0;
          for(let s in GenshinArtifactStats.odds)
            if(s != this.mainStatKey)
              total += GenshinArtifactStats.odds[s];
          let chance = 1 - Math.pow(1 - GenshinArtifactStats.odds[statId] / total, Math.min(tiersRemaining, statsOpen));
          this.storedStats.ratings[statId] = {base:0, chance:chance*chanceRating, sum:chance*chanceRating};
        }
      }
    }
    return this.storedStats.ratings[statId];
  }
  
  getCharacterScoreParts(character, buildId="default", {useTargets=false}={})
  {
    if(!character)
    {
      console.error(`No character provided to Artifact.getCharacterScoreParts().`);
      return null;
    }
    if(!this.storedStats.characters[character.key]?.[buildId]?.[useTargets?'withTargets':'base'])
    {
      // Initial variables we need.
      let build = character.getBuild(buildId);
      if(!this.storedStats.characters[character.key])
        this.storedStats.characters[character.key] = {};
      if(!this.storedStats.characters[character.key][buildId])
        this.storedStats.characters[character.key][buildId] = {};
      if(!this.storedStats.characters[character.key][buildId][useTargets?'withTargets':'base'])
        this.storedStats.characters[character.key][buildId][useTargets?'withTargets':'base'] = {};
      
      // Determine if/how to penalize crit stats if using crit ratio target.
      let critPenalty = 0;
      let excessERRating = 0;
      let deficitERFactor = 1;
      if(useTargets)
      {
        if(build.ratioCritRate && build.ratioCritDMG)
        {
          let targetRateFactor = build.ratioCritRate / (build.ratioCritRate + build.ratioCritDMG);
          let myRate = character.getStat("critRate_", {[this.slotKey+'Artifact']:this});
          let myDMG = character.getStat("critDMG_", {[this.slotKey+'Artifact']:this});
          let myRateFactor = myRate / (myRate + myDMG);
          critPenalty = targetRateFactor - myRateFactor; // Positive -> Too much Crit DMG. Negative -> Too much Crit Rate.
        }
        
        // Alter the artifacts' ratings based on the defined target stats.
        let myER = character.getStat("enerRech_", {[this.slotKey+'Artifact']:this});
        if(myER > build.maxER)
        {
          excessERRating = (myER - build.maxER) / GenshinArtifactStats[5].substats.enerRech_;
        }
        else if(myER < build.minER)
        {
          deficitERFactor = myER / build.minER - 0.25;
        }
      }
      
      // Score the main stat. A level 20 5-star artifact's main stat is about equivalent to 8 substat max rolls. The rarity factor cuts it for other rarities.
      let mainRarityFactor = (this.rarity==1 ? 0.5 : (this.rarity==2 ? 0.6 : (this.rarity==3 ? 0.75 : (this.rarity==4 ? 0.9 : 1))));
      let mainPenaltyFactor = (critPenalty>0 && this.mainStatKey=="critDMG_") ? (1-critPenalty) : (critPenalty<0 && this.mainStatKey=="critRate_") ? (1+critPenalty) : 1;
      let mainRating = mainRarityFactor * 8 * mainPenaltyFactor;
      if(this.mainStatKey == "enerRech_")
      {
        if(mainRating < excessERRating)
        {
          excessERRating -= mainRating;
          mainRating = 0;
        }
        else if(excessERRating > 0)
        {
          mainRating -= excessERRating;
          excessERRating = 0;
        }
      }
      let mainScore = (build[this.slotKey+'Stat']?.[this.mainStatKey] ?? 0) * mainRating;
      
      // Score the substats.
      let subScore = 0;
      let subScores = {};
      if(build.artifactSubstats)
      {
        for(let substat of Artifact.substats)
        {
          let penaltyFactor = (critPenalty>0 && substat=="critDMG_") ? (1-critPenalty) : (critPenalty<0 && substat=="critRate_") ? (1+critPenalty) : 1;
          let subRating = this.getSubstatRating(substat).sum;
          if(substat == "enerRech_")
          {
            if(subRating < excessERRating)
            {
              excessERRating -= subRating;
              subRating = 0;
            }
            else if(excessERRating > 0)
            {
              subRating -= excessERRating;
              excessERRating = 0;
            }
          }
          subScores[substat] = Math.max(build.artifactSubstats[substat] ?? 0, Artifact.substatMins[substat]) * subRating * penaltyFactor;
          subScore += subScores[substat];
        }
      }
      
      this.storedStats.characters[character.key][buildId][useTargets?'withTargets':'base'] = {mainScore, subScore, subScores, deficitERFactor};
    }
    return this.storedStats.characters[character.key][buildId][useTargets?'withTargets':'base'];
  }
  
  getCharacterScore(character, level=20, buildId="default", {useTargets}={})
  {
    if(!character)
    {
      console.error(`No character provided to Artifact.getCharacterScore().`);
      return null;
    }
    let score = this.getCharacterScoreParts(character, buildId, {useTargets});
    level = Math.max(0, Math.min(level, this.rarity<=2 ? 4 : (this.rarity==3 ? 12 : (this.rarity==4 ? 16 : 20))));
    let levelFactor = level / 20 * 6.8 + 1.2;
    let max = character.getMaxArtifactScore(this.slotKey, buildId, level);
    if(!max)
      return 0;
    return ((score.mainScore * levelFactor / 8) + score.subScore) / max * score.deficitERFactor;
  }
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
}
