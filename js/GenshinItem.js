import { handlebars } from "./Renderer.js";
import UIItem from "./UIItem.js";

handlebars.registerHelper("statText", (id, options) => options.hash?.percent ? (GenshinItem.isStatPercent(id) ? "%" : "") : options.hash?.shorthand ? GenshinItem.getStatShorthand(id) : GenshinItem.getStatFull(id));

export default class GenshinItem extends UIItem {
  static goodProperties = [];
  static statNames = [
    {id:"eleMas", shorthand:"EM", full:"Elemental Mastery"},
    {id:"enerRech_", shorthand:"ER%", full:"Energy Recharge", percent:true},
    {id:"def", shorthand:"DEF", full:"DEF"},
    {id:"def_", shorthand:"DEF%", full:"DEF%", percent:true},
    {id:"hp", shorthand:"HP", full:"Max HP"},
    {id:"hp_", shorthand:"HP%", full:"HP%", percent:true},
    {id:"atk", shorthand:"ATK", full:"ATK"},
    {id:"atk_", shorthand:"ATK%", full:"ATK%", percent:true},
    {id:"critDMG_", shorthand:"C.DMG", full:"CRIT DMG", percent:true},
    {id:"critRate_", shorthand:"C.Rate", full:"CRIT Rate", percent:true},
    {id:"anemo_dmg_", shorthand:"Anemo%", full:"Anemo DMG Bonus", percent:true},
    {id:"hydro_dmg_", shorthand:"Hydro%", full:"Hydro DMG Bonus", percent:true},
    {id:"cryo_dmg_", shorthand:"Cryo%", full:"Cryo DMG Bonus", percent:true},
    {id:"pyro_dmg_", shorthand:"Pyro%", full:"Pyro DMG Bonus", percent:true},
    {id:"electro_dmg_", shorthand:"Electro%", full:"Electro DMG Bonus", percent:true},
    {id:"dendro_dmg_", shorthand:"Dendro%", full:"Dendro DMG Bonus", percent:true},
    {id:"geo_dmg_", shorthand:"Geo%", full:"Geo DMG Bonus", percent:true},
    {id:"physical_dmg_", shorthand:"Phys%", full:"Physical DMG Bonus", percent:true},
    {id:"heal_", shorthand:"Heal%", full:"Healing Bonus", percent:true},
    {id:"inHeal_", shorthand:"InHeal%", full:"Incoming Healing Bonus", percent:true},
    {id:"stamina_cost_", shorthand:"Stam%", full:"Stamina Cost", percent:true},
    {id:"cd_", shorthand:"CD%", full:"CD Reduction", percent:true},
    {id:"skill_cd_", shorthand:"SkillCD%", full:"Skill CD Reduction", percent:true},
    {id:"skill_duration", shorthand:"SkillTime", full:"Skill Duration"},
    {id:"burst_cd_", shorthand:"BurstCD%", full:"Burst CD Reduction", percent:true},
    {id:"burst_duration", shorthand:"BurstTime", full:"Burst Duration"},
    {id:"shield_", shorthand:"Shield%", full:"Shield Strength", percent:true},
    {id:"autoLevel", shorthand:"Lv.Normal", full:"Normal Attack Level"},
    {id:"skillLevel", shorthand:"Lv.Skill", full:"Elemental Skill Level"},
    {id:"burstLevel", shorthand:"Lv.Burst", full:"Elemental Burst Level"},
    {id:"anemo_res_", shorthand:"AnemoRES", full:"Anemo RES", percent:true},
    {id:"hydro_res_", shorthand:"HydroRES", full:"Hydro RES", percent:true},
    {id:"cryo_res_", shorthand:"CryoRES", full:"Cryo RES", percent:true},
    {id:"pyro_res_", shorthand:"PyroRES", full:"Pyro RES", percent:true},
    {id:"electro_res_", shorthand:"ElectroRES", full:"Electro RES", percent:true},
    {id:"dendro_res_", shorthand:"DendroRES", full:"Dendro RES", percent:true},
    {id:"geo_res_", shorthand:"GeoRES", full:"Geo RES", percent:true},
    {id:"physical_res_", shorthand:"PhysRES", full:"Physical RES", percent:true},
    {id:"enemy_def_", shorthand:"DEFShred", full:"DEF Shred", percent:true},
    {id:"enemy_anemo_res_", shorthand:"AnemoShred", full:"Anemo RES Shred", percent:true},
    {id:"enemy_hydro_res_", shorthand:"HydroShred", full:"Hydro RES Shred", percent:true},
    {id:"enemy_cryo_res_", shorthand:"CryoShred", full:"Cryo RES Shred", percent:true},
    {id:"enemy_pyro_res_", shorthand:"PyroShred", full:"Pyro RES Shred", percent:true},
    {id:"enemy_electro_res_", shorthand:"ElectroShred", full:"Electro RES Shred", percent:true},
    {id:"enemy_dendro_res_", shorthand:"DendroShred", full:"Dendro RES Shred", percent:true},
    {id:"enemy_geo_res_", shorthand:"GeoShred", full:"Geo RES Shred", percent:true},
    {id:"enemy_physical_res_", shorthand:"PhysShred", full:"Physical RES Shred", percent:true},
    {id:"dmg_", shorthand:"DMG%", full:"All DMG Bonus", percent:true},
    {id:"spd_", shorthand:"ATKSPD", full:"ATK SPD", percent:true},
    {id:"normal_dmg_", shorthand:"Normal%", full:"Normal Attack DMG Bonus", percent:true},
    {id:"normal_spd_", shorthand:"NormalSPD", full:"Normal Attack SPD", percent:true},
    {id:"charged_dmg_", shorthand:"Charge%", full:"Charged Attack DMG Bonus", percent:true},
    {id:"charged_spd_", shorthand:"ChargeSPD", full:"Charged Attack SPD", percent:true},
    {id:"plunging_dmg_", shorthand:"Plunge%", full:"Plunging Attack DMG Bonus", percent:true},
    {id:"skill_dmg_", shorthand:"Skill%", full:"Elemental Skill DMG Bonus", percent:true},
    {id:"burst_dmg_", shorthand:"Burst%", full:"Elemental Burst DMG Bonus", percent:true},
    {id:"swirl_dmg_", shorthand:"Swirl%", full:"Swirl DMG Bonus", percent:true},
    {id:"superconduct_dmg_", shorthand:"S.Conduct%", full:"Superconduct DMG Bonus", percent:true},
    {id:"melt_dmg_", shorthand:"Melt%", full:"Melt DMG Bonus", percent:true},
    {id:"spread_dmg_", shorthand:"Spread%", full:"Spread DMG Bonus", percent:true},
    {id:"aggravate_dmg_", shorthand:"Aggra%", full:"Aggravate DMG Bonus", percent:true},
    {id:"bloom_dmg_", shorthand:"Bloom%", full:"Bloom DMG Bonus", percent:true},
    {id:"hyperbloom_dmg_", shorthand:"H.Bloom%", full:"Hyperbloom DMG Bonus", percent:true},
    {id:"burgeon_dmg_", shorthand:"Burgeon%", full:"Burgeon DMG Bonus", percent:true},
    {id:"burning_dmg_", shorthand:"Burn%", full:"Burning DMG Bonus", percent:true},
    {id:"electrocharged_dmg_", shorthand:"E.Charge%", full:"Electrocharged DMG Bonus", percent:true},
    {id:"overloaded_dmg_", shorthand:"Overload%", full:"Overloaded DMG Bonus", percent:true},
    {id:"vaporize_dmg_", shorthand:"Vape%", full:"Vaporize DMG Bonus", percent:true},
  ];
  
  static getStatShorthand(id)
  {
    return this.statNames.find(s=>s.id==id)?.shorthand??id;
  }
  
  static getStatFull(id)
  {
    return this.statNames.find(s=>s.id==id)?.full??id;
  }
  
  static isStatPercent(id)
  {
    return !!this.statNames.find(s=>s.id==id)?.percent;
  }
  
  fromGOOD(goodData)
  {
    if(typeof(goodData) == "object" && goodData != null)
    {
      for(let key in goodData)
        this.#fromGOODHelper(goodData, key, [key]);
      return this.afterLoad();
    }
    else
    {
      console.error("GenshinItem.fromGOOD(1) only accepts an object as an argument.", goodData);
      return false;
    }
  }
  
  #fromGOODHelper(goodData, key, keys)
  {
    if(Array.isArray(goodData[key]))
      this.update(keys, goodData[key], "replace");
    else if(typeof(goodData[key]) == "object" && goodData[key] != null)
    {
      for(let subkey in goodData[key])
        this.#fromGOODHelper(goodData[key], subkey, keys.concat([subkey]));
    }
    else
      this.update(keys, goodData[key]);
  }
  
  toGOOD()
  {
    let result = {};
    for(let prop of this.constructor.goodProperties)
      result[prop] = this[prop];
    return result;
  }
  
  processRenderText(html)
  {
    html = super.processRenderText(html);
    html = html.replaceAll(/\{\{element:(\w+)\}\}/g, `<img class="element-icon element-$1 icon-inline" src="img/Element_$1.svg"/>`);
    return html;
  }
}
