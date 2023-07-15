import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinArtifactStats from "./gamedata/GenshinArtifactStats.js";

import GenshinItem from "./GenshinItem.js";

export default class Artifact extends GenshinItem
{
  static dontSerialize = GenshinItem.dontSerialize.concat(["character","wanters","loaded","storedStats"]);
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
  substats = {};
  _level = 0;
  _rarity = 0;
  storedStats = {
    sums: {},
    ratings: {},
    characters: {},
  };
  loaded = false;
  character = null;
  wanters = [];
  
  afterLoad()
  {
    if(GenshinArtifactData[this.setKey])
    {
      this.loaded = true;
      this.cleanSubstats();
    }
    else
    {
      //console.warn(`Unknown artifact set "${this.setKey}".`);
      this.loaded = false;
    }
    return this.loaded;
  }
  
  afterUpdate(field, value, action, options)
  {
    super.afterUpdate(field, value, action, options);
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
      this.storedStats.sums = {};
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
  
  get name(){ return this.loaded ? GenshinArtifactData[this.setKey][this.slotKey] : `${this.setName} ${this.slotKey}`; }
  get setName(){ return this.loaded ? GenshinArtifactData[this.setKey].name : this.setKey; }
  get levelCap(){ return GenshinArtifactStats[this.rarity].levelCap; }
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
      this.cleanSubstats();
      this.update("substats", null, "notify");
    }
  }
  
  cleanSubstats()
  {
    this.substats = this.substats.filter(stat => Artifact.substats.indexOf(stat.key) > -1 && stat.value > 0);
  }
  
  getSubstatSum(statId)
  {
    if(this.storedStats.sums[statId] === undefined)
    {
      this.storedStats.sums[statId] = 0;
      for(let substat of this.substats)
        if(substat.key == statId)
          this.storedStats.sums[statId] = substat.value;
    }
    return this.storedStats.sums[statId];
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
        let sum = this.getSubstatSum(statId);
        let baseRating = sum / GenshinArtifactStats[5].substats[statId];
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
