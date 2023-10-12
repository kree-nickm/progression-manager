import { handlebars, Renderer } from "./Renderer.js";
import GenshinItem from "./GenshinItem.js";
import Character from "./Character.js";
import StatModifier from "./StatModifier.js";

export default class Team extends GenshinItem {
  static dontSerialize = GenshinItem.dontSerialize.concat(["_characters"]);
  static templateName = "renderTeamAsPopup";
  static statModifiers = [];
  
  _characters;
  memberKeys = [];
  name = "New Team";
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.path[0] == "memberKeys")
    {
      this._characters = null;
    }
    else if(field.path[0] == "statModifiers")
    {
      this.characters.forEach(character => character.update(field.string, value, action, Object.assign({teammate:true}, options)));
    }
    return true;
  }
  
  getStatModifiers(asker)
  {
    let result = asker ? asker.statModifiers : [];
    let teamElements = {Anemo:0, Cryo:0, Dendro:0, Electro:0, Geo:0, Hydro:0, Pyro:0};
    this.characters.forEach(teammate => {
      teamElements[teammate.element]++;
      if(teammate != asker)
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
    return result;
  }
  
  get characters()
  {
    if(!this._characters)
      this._characters = this.memberKeys.map(key => this.viewer.lists.CharacterList.get(key));
    return this._characters;
  }
}

StatModifier.create(["pstat",["atk_",25]], Team, "resonance", {element:"Pyro"});
StatModifier.create(["proc", ["pstat",["critRate_",15]], "Against Frozen/Cryo-affected Enemies"], Team, "resonance", {element:"Cryo"});
StatModifier.create(["pstat",["hp_",25]], Team, "resonance", {element:"Hydro"});
StatModifier.create([["pstat",["stamina_cost_",-15]],["pstat",["skill_cd_",5]]], Team, "resonance", {element:"Anemo"});
StatModifier.create([["pstat",["eleMas",50]], ["proc",["pstat",["eleMas",30]],"After Burning, Quicken, or Bloom (6s)"], ["proc",["pstat",["eleMas",20]],"After Aggravate, Spread, Hyperbloom, or Burgeon (6s)"]], Team, "resonance", {element:"Dendro"});
StatModifier.create([["pstat",["shield_",15]], ["proc",[["pstat",["dmg_",15]], ["estat",["geo_res_",-20]]],"While Shielded"]], Team, "resonance", {element:"Geo"});
StatModifier.create(["pstat", [["anemo_res_","cryo_res_","dendro_res_","electro_res_","hydro_res_","geo_res_","pyro_res_","physical_res_"], 15]], Team, "resonance", {element:"Unique"});