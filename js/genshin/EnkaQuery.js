import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinWeaponData from "./gamedata/GenshinWeaponData.js";

export default class EnkaQuery
{
  static dataStatLookup = {
    FIGHT_PROP_HP: "hp",
    FIGHT_PROP_ATTACK: "atk",
    FIGHT_PROP_DEFENSE: "def",
    FIGHT_PROP_HP_PERCENT: "hp_",
    FIGHT_PROP_ATTACK_PERCENT: "atk_",
    FIGHT_PROP_DEFENSE_PERCENT: "def_",
    FIGHT_PROP_CRITICAL: "critRate_",
    FIGHT_PROP_CRITICAL_HURT: "critDMG_",
    FIGHT_PROP_CHARGE_EFFICIENCY: "enerRech_",
    FIGHT_PROP_HEAL_ADD: "heal_",
    FIGHT_PROP_ELEMENT_MASTERY: "eleMas",
    FIGHT_PROP_PHYSICAL_ADD_HURT: "physical_dmg_",
    FIGHT_PROP_FIRE_ADD_HURT: "pyro_dmg_",
    FIGHT_PROP_ELEC_ADD_HURT: "electro_dmg_",
    FIGHT_PROP_WATER_ADD_HURT: "hydro_dmg_",
    FIGHT_PROP_WIND_ADD_HURT: "anemo_dmg_",
    FIGHT_PROP_ICE_ADD_HURT: "cryo_dmg_",
    FIGHT_PROP_ROCK_ADD_HURT: "geo_dmg_",
    FIGHT_PROP_GRASS_ADD_HURT: "dendro_dmg_",
  };
  
  static getCharacter(data)
  {
    let key = Object.keys(GenshinCharacterData).find(k => GenshinCharacterData[k].id == data.avatarId || GenshinCharacterData[k].idAlt == data.avatarId || GenshinCharacterData[k].id == data.avatarId+"-"+data.skillDepotId || GenshinCharacterData[k].idAlt == data.avatarId+"-"+data.skillDepotId);
    if(!key)
    {
      console.warn(`Unknown character ID '${data.avatarId+"-"+data.skillDepotId}' in EnkaQuery.`);
      return null;
    }
    return {
      key,
      ascension: parseInt(data.propMap[1002].val??0),
      level: parseInt(data.propMap[4001].val??0),
      constellation: Object.keys(data.talentIdList??[]).length,
      talent: {
        auto: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[0]]),
        skill: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[1]]),
        burst: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[2]]),
      },
    };
  }
  
  static getWeapon(data)
  {
    if(!data.weapon)
    {
      console.warn(`Weapon has invalid data in EnkaQuery.`, {data});
      return null;
    }
    let key = Object.keys(GenshinWeaponData).find(k => GenshinWeaponData[k].id == data.itemId);
    if(!key)
    {
      console.warn(`Unknown weapon ID '${data.itemId}' in EnkaQuery.`);
      return null;
    }
    return {
      key,
      level: parseInt(data.weapon.level),
      ascension: parseInt(data.weapon.promoteLevel??0),
      refinement: (Object.values(data.weapon.affixMap??[0])?.[0]??0) + 1,
      lock: true,
    };
  }
  
  static getArtifact(data)
  {
    if(!data.reliquary || !data.flat)
    {
      console.warn(`Artifact has invalid data in EnkaQuery.`, {data});
      return null;
    }
    let setId = data.flat.icon.slice(13, 18); // This is not the optimal way to get the set ID, but it's most convenient as long as they don't change icon format.
    let setKey = Object.keys(GenshinArtifactData).find(k => GenshinArtifactData[k].id == setId);
    if(!setKey)
    {
      console.warn(`Unknown artifact set ID '${setId}' in EnkaQuery.`);
      return null;
    }
    return {
      setKey,
      slotKey: {
        EQUIP_BRACER: "flower",
        EQUIP_NECKLACE: "plume",
        EQUIP_SHOES: "sands",
        EQUIP_RING: "goblet",
        EQUIP_DRESS: "circlet",
      }[data.flat.equipType],
      level: data.reliquary.level,
      rarity: data.flat.rankLevel,
      mainStatKey: EnkaQuery.dataStatLookup[data.flat.reliquaryMainstat.mainPropId],
      lock: true,
      /*substats: [
        {key:"", value:0},
      ],*/
      substats: data.flat.reliquarySubstats.map(raw => ({key:EnkaQuery.dataStatLookup[raw.appendPropId], value:raw.statValue})),
    };
  }
  
  apiURL;
  apiType;
  response;
  characterData = [];
  weaponData = [];
  artifactData = [];
  hoyos = [];
  
  constructor(parameter)
  {
    let idx;
    if(parseInt(parameter) > 0)
    {
      this.apiURL = `https://enka.network/api/uid/${parameter}`;
      this.apiType = "showcase";
    }
    else if((idx = parameter.indexOf("enka.network/u/")) > -1)
    {
      let parts = parameter.slice(idx+15).split("/");
      if(parseInt(parts[0]) > 0)
      {
        this.apiURL = `https://enka.network/api/uid/${parts[0]}`;
        this.apiType = "showcase";
      }
      else
      {
        this.apiURL = `https://enka.network/api/profile/${parts[0]}/hoyos/${parts[1]}/builds/`;
        this.apiType = "builds";
      }
    }
    else if(parameter)
    {
      this.apiURL = `https://enka.network/api/profile/${parameter}/hoyos/`;
      this.apiType = "hoyos";
    }
    else
    {
      throw new Exception(`Invalid parameter sent to EnkaQuery.`);
    }
  }
  
  selectHoyo(hash)
  {
    for(let hoyo of this.hoyos)
    {
      if(hoyo.hash == hash)
      {
        this.apiURL = `${this.apiURL}${hash}/builds/`;
        this.apiType = "builds";
      }
    }
    if(this.apiType != "builds")
    {
      throw new Exception(`Invalid hoyo hash '${hash}' given in selectHoyo().`, {validHoyos:this.hoyos});
    }
  }
  
  async request()
  {
    let response = await fetch("https://corsproxy.io/?" + encodeURIComponent(this.apiURL));
    this.status = response.status;
    this.headers = response.headers;
    if(this.status == 400 || this.status == 404)
    {
      throw new Exception(`Invalid UID or account provided.`);
    }
    else if(this.status == 424 || this.status == 429 || this.status == 500 || this.status == 503)
    {
      throw new Exception(`Enka API is currently unavailable.`);
    }
    else
    {
      this.response = await response.json();
      if(this.apiType == "showcase")
      {
        if(this.response.owner)
        {
          this.apiURL = `https://enka.network/api/profile/${this.response.owner.username}/hoyos/${this.response.owner.hash}/builds/`;
          this.apiType = "builds";
          return await this.request();
        }
        else
        {
          for(let data of this.response.avatarInfoList)
            this.handleAvatar(data);
          return "showcase";
        }
      }
      else if(this.apiType == "builds")
      {
        for(let id in this.response)
          this.handleAvatar(this.response[id][0].avatar_data);
        return "builds";
      }
      else if(this.apiType == "hoyos")
      {
        for(let hoyo in this.response)
        {
          if(this.response[hoyo].hoyo_type == 0)
          {
            this.hoyos.push({
              uid: this.response[hoyo].uid,
              region: this.response[hoyo].region,
              ar: this.response[hoyo].player_info.level,
              nickname: this.response[hoyo].player_info.nickname,
              signature: this.response[hoyo].player_info.signature,
              worldLevel: this.response[hoyo].player_info.worldLevel,
              hash: this.response[hoyo].hash,
            });
          }
        }
        if(this.hoyos.length == 1)
        {
          this.apiURL = `${this.apiURL}${this.hoyos[0].hash}/builds/`;
          this.apiType = "builds";
          return await this.request();
        }
        else
        {
          return "hoyos";
        }
      }
    }
  }
  
  handleAvatar(data)
  {
    let character = EnkaQuery.getCharacter(data);
    if(character)
    {
      this.characterData.push(character);
      for(let equip of data.equipList)
      {
        if(equip.flat?.itemType == "ITEM_RELIQUARY")
        {
          let artifact = EnkaQuery.getArtifact(equip);
          if(artifact)
          {
            artifact.location = character.key;
            this.artifactData.push(artifact);
          }
          else
          {
            console.warn(`Invalid artifact found on ${character.key}`, {data:equip});
          }
        }
        else if(equip.flat?.itemType == "ITEM_WEAPON")
        {
          let weapon = EnkaQuery.getWeapon(equip);
          if(weapon)
          {
            weapon.location = character.key;
            this.weaponData.push(weapon);
          }
          else
          {
            console.warn(`Invalid weapon found on ${character.key}`, {data:equip});
          }
        }
        else
        {
          console.error(`Unknown itemType '${equip.flat?.itemType}' on ${character.key}`, {data:equip});
        }
      }
    }
  }
}
