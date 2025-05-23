const {default:GenshinArtifactData} = await window.importer.get(`js/genshin/gamedata/GenshinArtifactData.js`);
const {default:GenshinArtifactStats} = await window.importer.get(`js/genshin/gamedata/GenshinArtifactStats.js`);

const {default:GenshinItem} = await window.importer.get(`js/genshin/GenshinItem.js`);
const {default:Equipment} = await window.importer.get(`js/Equipment.js`);

export default class Artifact extends Equipment(GenshinItem)
{
  static dontSerialize = super.dontSerialize.concat(["wanters","substatRolls"]);
  static goodProperties = ["setKey","slotKey","level","rarity","mainStatKey","location","lock","substats"];
  static templateName = "genshin/renderArtifactAsPopup";
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
  
  setKey = "";
  slotKey = "";
  _level = 0;
  _rarity = 0;
  mainStatKey = "";
  location = "";
  lock = false;
  substats = [];
  
  id;
  isPreview;
  characterList = window.viewer.lists.CharacterList;
  
  wanters = [];
  substatRolls = {};
  
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
    if(!this.importing && this.substats && (field.string == "substats" || field.string == "level" || field.string == "rarity"))
      this.determineRolls();
    this.clearMemory("storedStats", "ratings");
    this.clearMemory("storedStats", "characters");
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
  get maxRarity(){ return GenshinArtifactData[this.setKey]?.maxRarity ?? 5; }
  get image(){ return GenshinArtifactData[this.setKey]?.[this.slotKey+'Img'] ?? ""; }
  get levelCap(){ return GenshinArtifactStats[this.rarity]?.levelCap ?? 0; }
  get mainStatShorthand(){ return GenshinItem.getStatShorthand(this.mainStatKey); }
  get mainStatValue(){
    let key = this.mainStatKey.endsWith("o_dmg_") ? "elemental_dmg_" : this.mainStatKey;
    return GenshinArtifactStats[this.rarity].mainstats[key][this.level];
  }
  get releaseTimestamp(){ return GenshinArtifactData[this.key]?.release ? Date.parse(GenshinArtifactData[this.key]?.release) : 0; }
  get equipProperty() { return this.slotKey + "Artifact"; }
  
  get isCutContent(){ return GenshinArtifactData[this.key]?.deletedContent; }
  get isFodder()
  {
    return this.getFinalRating() < this.list.getMinRating(this.slotKey, this.setKey);
  }
  
  getFinalRating()
  {
    return this.wanters.reduce((result, wanter, idx) => result+Math.pow(wanter.scaledScore, 1+idx), 0)
  }
  
  setSubstat(statId, value)
  {
    // Check if we already have the substat, and update it if so.
    let found = false;
    for(let substat of this.substats)
    {
      if(substat.key == statId)
      {
        substat.value = value;
        found = true;
      }
    }
    // If we don't have it, add it if possible.
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
    // If a change was made, trigger an update()
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
    {
      // This is a ballpark value based on the erroneous assumption that lower rolls are 0.9, 0.8, or 0.7 of the highest roll, however, they should be close enough.
      // Or 0.85 for 2-star, 0.8 for 1-star
      rollTotals[stat.key] = (stat.value / GenshinArtifactStats[this.rarity].substats[stat.key][GenshinArtifactStats[this.rarity].substats[stat.key].length-1]).toFixed(1);
    }
    
    if(this.substats.length < 4)
    {
      this.substatRolls = {};
      for(let statKey in rollTotals)
      {
        if(this.rarity > 2)
          this.substatRolls[statKey] = [{'0.7':0,'0.8':1,'0.9':2,'1.0':3}[rollTotals[statKey]]];
        else if(this.rarity == 2)
          this.substatRolls[statKey] = [{'0.7':0,'0.8':1,'0.9':1,'1.0':2}[rollTotals[statKey]]];
        else if(this.rarity == 1)
          this.substatRolls[statKey] = [{'0.8':0,'1.0':1}[rollTotals[statKey]]];
      }
      return this.substatRolls;
    }
    else
    {
      let possibles = {};
      let notpossibles = {};
      for(let statKey in rollTotals)
      {
        possibles[statKey] = [];
        notpossibles[statKey] = [];
        let minNumRolls = Math.ceil(parseFloat(rollTotals[statKey]));
        let maxNumRolls = Math.floor(parseFloat(rollTotals[statKey])/0.7);
        let iterations = Math.pow(5,maxNumRolls);
        for(let iter=0; iter<iterations; iter++)
        {
          /*
          This loop will go through 5 possible values for each potential roll.
          */
          let statRolls = [];
          let i = iter;
          // Convert the iteration into a specific set of rolls for this stat.
          while(i > 0)
          {
            // Only allow roll sets that are in descending order.
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
          statRolls = statRolls.filter(num => num > 0).map(num => num-1);
          if(statRolls.length >= minNumRolls)
          {
            let sum;
            if(this.rarity > 2)
              sum = statRolls.reduce((total,num) => total+(0.7+num*0.1), 0).toFixed(1);
            else if(this.rarity == 2)
              sum = statRolls.reduce((total,num) => total+(0.7+num*0.15), 0).toFixed(1);
            else if(this.rarity == 1)
              sum = statRolls.reduce((total,num) => total+(0.8+num*0.2), 0).toFixed(1);
            // Only keep roll sets that are valid and add up to the actual stat total roll value.
            if(rollTotals[statKey] == sum)
            {
              // Only keep one roll set of a given number of rolls, since they are totally interchangeable.
              if(!possibles[statKey].find(elem => elem.length == statRolls.length))
                possibles[statKey].push(statRolls);
            }
            else
            {
              notpossibles[statKey].push({sum, statRolls});
            }
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
      console.warn(`[Ignore if you are still editing artifact] Artifact substats do not have values that can be divided into any number of valid rolls (Rarity:${this.rarity}) (Level:${this.level}) (${minRolls}<=rollCount<=${maxRolls}).`, {substats:this.substats, rollTotals, possibles, notpossibles});
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
    return this.substatRolls[statId]?.reduce((total,roll) => total+GenshinArtifactStats[this.rarity]?.substats?.[statId][roll], 0) ?? 0;
  }
  
  getSubstatRating(statId)
  {
    let stored = this.loadMemory("storedStats", "ratings", statId);
    if(stored === undefined)
    {
      // Can't roll it if it's a main stat.
      if(this.mainStatKey == statId)
      {
        stored = {base:0, chance:0, sum:0};
        this.saveMemory(stored, "storedStats", "ratings", statId);
      }
      else
      {
        let baseRating = this.substatRolls[statId]?.reduce((total,roll) => total+(0.7+roll*0.1), 0) ?? 0; // TODO: Doesn't work for rarity 1 and 2
        let avgRoll = GenshinArtifactStats[this.rarity].substats[statId][GenshinArtifactStats[this.rarity].substats[statId].length-1] * (this.rarity==1 ? 0.9 : 0.85);
        let tiersRemaining = Math.ceil((this.levelCap - this.level) / 4);
        let statsOpen = 4 - this.substats.length;
        let chanceRating = (0.25 * (tiersRemaining - statsOpen) * avgRoll) / GenshinArtifactStats[5].substats[statId][GenshinArtifactStats[5].substats[statId].length-1];
        
        // If we have the stat, we only need to factor in the boosts.
        if(baseRating > 0)
        {
          stored = {base:baseRating, chance:chanceRating, sum:baseRating+chanceRating};
          this.saveMemory(stored, "storedStats", "ratings", statId);
        }
        else
        {
          // Instead, now we need to calculate the odds of gaining the stat first...
          let total = 0;
          for(let s in GenshinArtifactStats.odds)
            if(s != this.mainStatKey)
              total += GenshinArtifactStats.odds[s];
          let chance = 1 - Math.pow(1 - GenshinArtifactStats.odds[statId] / total, Math.min(tiersRemaining, statsOpen));
          stored = {base:0, chance:chance*chanceRating, sum:chance*chanceRating};
          this.saveMemory(stored, "storedStats", "ratings", statId);
        }
      }
    }
    return stored;
  }
  
  getCharacterScoreParts(character, buildId=character.selectedBuild, {useTargets=false}={})
  {
    if(!character)
    {
      console.error(`No character provided to Artifact.getCharacterScoreParts().`);
      return null;
    }
    // TODO: Better tracking of score.
    let stored = this.loadMemory("storedStats", "characters", character.key, buildId, useTargets?'withTargets':'base');
    if(!stored)
    {
      let build = character.getBuild(buildId);
      
      // Determine if/how to penalize crit stats if using crit ratio target.
      let critPenalty = 0;
      let excessERRating = 0;
      let deficitERFactor = 1;
      if(useTargets && build.useTargets.critRatio)
      {
        if(build.ratioCritRate && build.ratioCritDMG)
        {
          let targetRateFactor = build.ratioCritRate / (build.ratioCritRate + build.ratioCritDMG);
          let myRate = character.getStat("critRate_", {unmodified:!build.useTargets.modifiers, [this.slotKey]:this});
          let myDMG = character.getStat("critDMG_", {unmodified:!build.useTargets.modifiers, [this.slotKey]:this});
          let myRateFactor = myRate / (myRate + myDMG);
          critPenalty = targetRateFactor - myRateFactor; // Positive -> Too much Crit DMG. Negative -> Too much Crit Rate.
        }
      }
      if(useTargets && build.useTargets.enerRech_)
      {
        // Alter the artifacts' ratings based on the defined target stats.
        let myER = character.getStat("enerRech_", {unmodified:!build.useTargets.modifiers, [this.slotKey]:this});
        if(myER > build.maxER)
        {
          excessERRating = (myER - build.maxER) / GenshinArtifactStats[5].substats.enerRech_[GenshinArtifactStats[5].substats.enerRech_.length-1];
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
      // Give the mainstat of flowers and plumes an automatic preference of 1, otherwise their scores get way out of whack with the other pieces.
      let mainScore = (this.slotKey=="flower"||this.slotKey=="plume" ? 1 : (build[this.slotKey+'Stat']?.[this.mainStatKey] ?? 0)) * mainRating;
      
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
      
      stored = {mainScore, subScore, subScores, deficitERFactor};
      this.saveMemory(stored, "storedStats", "characters", character.key, buildId, useTargets?'withTargets':'base')
    }
    return stored;
  }
  
  getCharacterScore(character, level=parseInt(this.viewer.settings.preferences.artifactMaxLevel ?? 20), buildId=character.selectedBuild, {useTargets}={})
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
}
