import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";

export default EnkaQuery
{
  apiURL;
  apiType;
  response;
  characterData = [];
  weaponData = [];
  artifactData = [];
  hoyos = [];
  
  static getCharacter(data)
  {
    let key = Object.keys(GenshinCharacterData).find(k => GenshinCharacterData[k].id == data.avatarId || GenshinCharacterData[k].idAlt == data.avatarId || GenshinCharacterData[k].id == data.avatarId+"-"+data.skillDepotId || GenshinCharacterData[k].idAlt == data.avatarId+"-"+data.skillDepotId);
    if(!key)
    {
      console.warn(`Unknown character ID '${id}' in EnkaQuery.`);
      return null;
    }
    return {
      key,
      ascension: parseInt(data.propMap[1002]),
      level: parseInt(data.propMap[4001]),
      constellation: Object.keys(data.talentIdList??[]).length,
      talent: {
        auto: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[0]]),
        skill: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[1]]),
        burst: parseInt(data.skillLevelMap[GenshinCharacterData[key].skillIds[2]]),
      },
    };
  }
  
  constructor(parameter)
  {
    let idx;
    if(parseInt(parameter) > 0)
    {
      this.apiURL = `https://enka.network/api/uid/${parameter}/`;
      this.apiType = "showcase";
    }
    else if((idx = parameter.indexOf("enka.network/u/")) > -1)
    {
      let parts = parameter.slice(idx+15).split("/");
      if(parseInt(parts[0]) > 0)
      {
        this.apiURL = `https://enka.network/api/uid/${parts[0]}/`;
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
  
  async request()
  {
    let response = await fetch(this.apiURL);
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
        for(let data of this.response.avatarInfoList)
        {
          let character = EnkaQuery.getCharacter(data);
          if(character)
            this.characterData.push(character);
        }
        return "showcase";
      }
      else if(this.apiType == "builds")
      {
        for(let id in this.response)
        {
          let character = EnkaQuery.getCharacter(this.response[id][0].avatar_data);
          if(character)
            this.characterData.push(character);
        }
        return "builds";
      }
      else if(this.apiType == "hoyos")
      {
        for(let hoyo in this.response)
        {
          this.hoyos.push({
            uid: this.response[hoyo].uid,
            ar: this.response[hoyo].player_info.level,
            nickname: this.response[hoyo].player_info.nickname,
            signature: this.response[hoyo].player_info.signature,
            worldLevel: this.response[hoyo].player_info.worldLevel,
            hash: this.response[hoyo].hash,
          });
        }
        return "hoyos";
      }
    }
  }
}
