import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinArtifactStats from "./gamedata/GenshinArtifactStats.js";

import GenshinItem from "./GenshinItem.js";

export default class Artifact extends GenshinItem
{
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
    'anemo_dmg_': "Anemo",
    'hydro_dmg_': "Hydro",
    'cryo_dmg_': "Cryo",
    'pyro_dmg_': "Pyro",
    'electro_dmg_': "Electro",
    'dendro_dmg_': "Dendro",
    'geo_dmg_': "Geo",
    'physical_dmg_': "Phys",
    'heal_': "Heal",
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
  
  #level = 0;
  #rarity = 0;
  storedStats = {
    sums: {},
    ratings: {},
    characters: {},
  };
  character;
  loaded = false;
  valuable = 1;
  
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
  
  afterUpdate(field, value, previous)
  {
    if(field.string == "location")
    {
      if(value)
      {
        let newCharacter = this.list.viewer.lists.characters.get(value);
        if(newCharacter)
          newCharacter.equipItem(this);
        else
        {
          console.error(`Cannot equip ${this.name} to non-existent character "${this.location}".`);
          field.object[field.property] = "";
          this.character = null;
        }
      }
      else
        this.character = null;
    }
    else
    {
      this.storedStats.sums = {};
      this.storedStats.ratings = {};
      this.storedStats.characters = {};
    }
  }
  
  get level(){ return this.#level; }
  set level(val){
    if(val < 0)
      val = this.#level + val;
    this.#level = Math.min(Math.max(val, 0), 20);
  }
  get rarity(){ return this.#rarity; }
  set rarity(val){ this.#rarity = Math.min(Math.max(val, 1), 5); }
  
  get name(){ return this.loaded ? GenshinArtifactData[this.setKey][this.slotKey] : `${this.setName} ${this.slotKey}`; }
  get setName(){ return this.loaded ? GenshinArtifactData[this.setKey].name : this.setKey; }
  get levelCap(){ return GenshinArtifactStats[this.rarity].levelCap; }
  get mainStatShorthand(){ return Artifact.shorthandStat[this.mainStatKey]; }
  get mainStatValue(){
    let key = this.mainStatKey.endsWith("o_dmg_") ? "elemental_dmg_" : this.mainStatKey;
    return GenshinArtifactStats[this.rarity].mainstats[key][this.level];
  }
  
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
      this.update("substats", this.substats, "notify");
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
        this.storedStats.ratings[statId] = 0;
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
          this.storedStats.ratings[statId] = baseRating + chanceRating;
        else
        {
          // Instead, now we need to calculate the odds of gaining the stat first...
          let total = 0;
          for(let s in GenshinArtifactStats.odds)
            if(s != this.mainStatKey)
              total += GenshinArtifactStats.odds[s];
          let chance = 1 - Math.pow(1 - GenshinArtifactStats.odds[statId] / total, Math.min(tiersRemaining, statsOpen));
          this.storedStats.ratings[statId] = chance * chanceRating;
        }
      }
    }
    return this.storedStats.ratings[statId];
  }
  
  getCharacterScoreParts(character=this.list.viewer.lists.characters.list[0])
  {
    if(!this.storedStats.characters[character.key])
    {
      let mainImportanceFactor = character?.getBuild()[this.slotKey+'Stat']?.[this.mainStatKey] ?? 0;
      let mainRarityFactor = (this.rarity==1 ? 0.5 : (this.rarity==2 ? 0.6 : (this.rarity==3 ? 0.75 : (this.rarity==4 ? 0.9 : 1))));
      let mainScore = mainImportanceFactor * mainRarityFactor * 8;
      let subScore = 0;
      let subScores = {};
      if(character?.getBuild().artifactSubstats)
      {
        for(let substat of Artifact.substats)
        {
          subScores[substat] = Math.max(character.getBuild().artifactSubstats[substat]??0, Artifact.substatMins[substat]) * this.getSubstatRating(substat);
          subScore += subScores[substat];
        }
      }
      this.storedStats.characters[character.key] = {mainScore, subScore, subScores};
    }
    return this.storedStats.characters[character.key];
  }
  
  getCharacterScore(character=this.list.viewer.lists.characters.list[0], level=20)
  {
    let score = this.getCharacterScoreParts(character);
    level = Math.max(0, Math.min(level, this.rarity<=2 ? 4 : (this.rarity==3 ? 12 : (this.rarity==4 ? 16 : 20))));
    let levelFactor = level / 20 * 6.8 + 1.2;
    let max = character.getMaxArtifactScore(this.slotKey, null, level);
    if(!max)
      return 0;
    return ((score.mainScore * levelFactor / 8) + score.subScore) / max;
  }
  
  getMaxCharacterScore()
  {
    if(!this.storedStats.characters["*"])
    {
      let scores = this.list.viewer.lists.characters.list.map(character => [character,this.getCharacterScore(character)]);
      let maxChar = "";
      let maxScore = 0;
      for(let tup of scores)
      {
        if(tup[1] > maxScore)
        {
          maxChar = tup[0].name;
          maxScore = tup[1];
        }
        else if(tup[1] == maxScore)
        {
          maxChar = maxChar +", "+ tup[0].name;
        }
      }
      this.storedStats.characters["*"] = {character:maxChar, score:maxScore};
    }
    return this.storedStats.characters["*"];
  }
}
