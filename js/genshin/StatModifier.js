import GenshinArtifactData from "./gamedata/GenshinArtifactData.js";

import { handlebars } from "../Renderer.js";
import GenshinItem from "./GenshinItem.js";

handlebars.registerHelper("maxStacks", function(modifier, asker, preview, options) {
  return modifier.maxStacks(asker, {preview:Boolean(preview)});
});

export default class StatModifier {
  static create(code, characterSource, type, properties={})
  {
    let found;
    for(let mod of characterSource.statModifiers)
    {
      if(mod.type == type)
      {
        if(type == "setBonus")
        {
          if(mod.artifactSet == properties.set && mod.artifactPieces == properties.pieces)
          {
            found = mod;
            break;
          }
        }
        else if(type == "weapon")
        {
          if(mod.weapon == properties.weapon && mod.weaponRefinement == properties.weaponRefinement)
          {
            found = mod;
            break;
          }
        }
        else if(type == "constellation")
        {
          if(mod.constellation == properties.constellation)
          {
            found = mod;
            break;
          }
        }
        else if(type == "talentPassive")
        {
          if(mod.talent == properties.talent)
          {
            found = mod;
            break;
          }
        }
      }
    }
    if(!found)
    {
      let normalizedCode = StatModifier.normalizeCode(code);
      if(window.DEBUGLOG?.StatModifier_create) console.debug("StatModifier.create", {code, normalizedCode, characterSource, type, properties});
      for(let c in normalizedCode)
      {
        properties.partIdx = c;
        found = new StatModifier(normalizedCode[c], characterSource, type, properties);
        characterSource.statModifiers.push(found);
      }
    }
  }
  
  // Convert a code of arbitrary nested arrays into an array where each element needs to be converted into a StatModifier.
  static normalizeCode(code)
  {
    if(Array.isArray(code[0]))
    {
      let result = [];
      let passives = [];
      code.forEach(subcode => {
        if(subcode[0] == "proc")
          result.push(subcode);
        else
          passives.push(subcode);
      });
      if(passives.length == 1)
        result = result.concat(passives);
      if(passives.length > 1)
        result.push(passives);
      return result;
    }
    else
    {
      return [code];
    }
  }
  
  id;
  code;
  characterSource;
  partIdx;
  type;
  label;
  isProc;
  active = 0;
  teamwide = false;
  mvChange = false;
  stats = {__calculations__:{}};
  motionValues = {};
  
  constructor(code, characterSource, type, properties={})
  {
    this.code = code;
    this.characterSource = characterSource;
    this.type = type;
    this.partIdx = properties.partIdx ?? 0;
    
    if(code[0] == "proc")
    {
      this.isProc = true;
      if(typeof(code[2]) == "number" || Array.isArray(code[2]) && (code[2][0] == "mv"))
      {
        this._maxStacks = code[2];
        this.trigger = code[3] ?? "When active";
      }
      else
      {
        this._maxStacks = code[3] ?? 1;
        this.trigger = code[2] ?? "When active";
      }
      if(Array.isArray(this._maxStacks))
      {
        this._maxStacks = {func:this._maxStacks[0], args:this._maxStacks.slice(1)};
      }
    }
    else
    {
      this.isProc = false;
      this.active = 1;
    }
    
    if(this.type == "resonance")
    {
      this.id = `${properties.element}Resonance_${this.partIdx}`;
      this.label = `Resonance`;
      this.resonance = properties.element;
    }
    else if(this.type == "setBonus")
    {
      this.artifactSet = properties.set;
      this.artifactPieces = properties.pieces;
      this.id = `${this.characterSource.key}_${this.artifactSet}${this.artifactPieces}_${this.partIdx}`;
      this.label = `${GenshinArtifactData[this.artifactSet].name} ${this.artifactPieces}-piece`;
    }
    else if(this.type == "weapon")
    {
      this.weapon = properties.weapon;
      this.weaponRefinement = properties.weaponRefinement;
      this.id = `${this.characterSource.key}_R${this.weaponRefinement}${this.weapon.key}_${this.partIdx}`;
      this.label = `R${this.weaponRefinement} ${this.weapon.name}`;
    }
    else if(this.type == "constellation")
    {
      this.constellation = properties.constellation;
      this.id = `${this.characterSource.key}_C${this.constellation}_${this.partIdx}`;
      this.label = `C${this.constellation}`;
    }
    else if(this.type == "talentPassive")
    {
      this.talent = properties.talent;
      this.id = `${this.characterSource.key}_${this.talent.replace(" ","")}_${this.partIdx}`;
      this.label = `${this.talent}`;
    }
    else
    {
      console.warn(`Unknown stat modifier type: ${type}`);
      this.id = `${this.characterSource.key}_${this.type}_${this.partIdx}`;
      this.label = `${this.type}`;
    }
    
    ({ stats:this.stats, motionValues:this.motionValues } = this.parseCode());
  }
  
  parseCode(code=this.code)
  {
    let stats = {__calculations__:{}};
    let motionValues = {added:[], padded:[], edited:[], pedited:[]};
    // Note: Current __calculations__ implementation is not compatible if a single modifier buffs the same stat in two different ways, but I don't think that's ever a thing.
    const [command, parameters] = code;
    if(Array.isArray(command))
    {
      code.forEach(subcode => {
        const { stats:istats, motionValues:mvs } = this.parseCode(subcode);
        for(let stat in istats)
          if(stat != "__calculations__")
            stats[stat] = (stats[stat] ?? 0) + istats[stat];
        stats.__calculations__ = Object.assign(stats.__calculations__, istats.__calculations__);
        for(let type in mvs)
          motionValues[type] = motionValues[type].concat(mvs[type]);
      });
    }
    else if(command == "proc")
    {
      const { stats:istats, motionValues:mvs } = this.parseCode(parameters);
      for(let stat in istats)
        if(stat != "__calculations__")
          stats[stat] = (stats[stat] ?? 0) + istats[stat];
      stats.__calculations__ = Object.assign(stats.__calculations__, istats.__calculations__);
      for(let type in mvs)
        motionValues[type] = motionValues[type].concat(mvs[type]);
    }
    else if(command == "stat" || command == "estat" || command == "pstat" || command == "opstat" || command == "sstat" || command == "spstat" || command == "sopstat")
    {
      const [targetStats, amount, situation] = parameters;
      for(let codeStat of (Array.isArray(targetStats) ? targetStats : [targetStats]))
      {
        if(command == "estat")
        {
          this.teamwide = true;
          codeStat = "enemy_" + codeStat + "*";
        }
        else if(command == "pstat")
        {
          this.teamwide = true;
          codeStat = codeStat + "*";
        }
        else if(command == "opstat")
        {
          this.teamwide = true;
          codeStat = codeStat + "!";
        }
        else if(command == "sstat")
          codeStat = codeStat + ":" + situation;
        else if(command == "spstat")
        {
          this.teamwide = true;
          codeStat = codeStat + ":" + situation + "*";
        }
        else if(command == "sopstat")
        {
          this.teamwide = true;
          codeStat = codeStat + ":" + situation + "!";
        }
        if(Array.isArray(amount))
        {
          const [func, ...args] = amount;
          stats.__calculations__[codeStat] = {func, args};
        }
        else
          stats[codeStat] = (stats[codeStat] ?? 0) + amount;
      }
    }
    else if(command == "pinfuse" || command == "oinfuse" || command == "infuse")
    {
      if(command == "pinfuse")
      {
        this.teamwide = true;
        motionValues.pedited.push({talent:"Normal Attack", method:"infuse", value:parameters});
      }
      else if(command == "oinfuse")
      {
        motionValues.edited.push({talent:"Normal Attack", method:"infuse", value:parameters+"!"});
      }
      else if(command == "infuse")
      {
        motionValues.edited.push({talent:"Normal Attack", method:"infuse", value:parameters});
      }
      this.mvChange = "auto";
    }
    else if(command == "editmv" || command == "peditmv")
    {
      if(command == "peditmv")
        this.teamwide = true;
      let collection = command=="peditmv" ? motionValues.pedited : motionValues.edited;
      let labels = parameters[1];
      if(!Array.isArray(labels))
        labels = [labels];
      for(let label of labels)
      {
        collection.push({
          talent: parameters[0],
          label: label,
          method: parameters[2],
          value: Array.isArray(parameters[3]) ? undefined : parameters[3],
          calc: Array.isArray(parameters[3]) ? {func:parameters[3][0], args:parameters[3].slice(1)} : undefined,
        });
      }
    }
    else if(command == "addmv" || command == "paddmv")
    {
      if(command == "paddmv")
        this.teamwide = true;
      let collection = command=="paddmv" ? motionValues.padded : motionValues.added;
      motionValues.added.push({
        talent: parameters[0],
        label: parameters[1],
        value: Array.isArray(parameters[2]) ? undefined : parameters[2],
        calc: Array.isArray(parameters[2]) ? {func:parameters[2][0], args:parameters[2].slice(1)} : undefined,
      });
    }
    else
    {
      console.log(`Unhandled code "${command}".`);
    }
    return { stats, motionValues };
  }
  
  maxStacks(asker, alternates={})
  {
    if(typeof(this._maxStacks) == "object")
      return this.calcStat(this._maxStacks, asker, alternates);
    else
      return this._maxStacks;
  }
  
  get isAvailable()
  {
    return this.isCurrent || this.isPreview;
  }
  
  get isCurrent()
  {
    if(this.type == "resonance")
    {
      return true;
    }
    else if(this.type == "setBonus")
    {
      return this.characterSource.getSetBonuses()[this.artifactSet]?.count >= this.artifactPieces;
    }
    else if(this.type == "weapon")
    {
      return this.characterSource.weapon?.key == this.weapon.key && this.characterSource.weapon?.refinement == this.weaponRefinement;
    }
    else if(this.type == "constellation")
    {
      return this.characterSource.constellation >= this.constellation;
    }
    else if(this.type == "talentPassive")
    {
      if(this.talent == "1st Ascension Passive" && this.characterSource.ascension < 1)
        return false;
      if(this.talent == "4th Ascension Passive" && this.characterSource.ascension < 4)
        return false;
      return true;
    }
    else
    {
      return true;
    }
  }
  
  get isPreview()
  {
    if(this.type == "resonance")
    {
      return true;
    }
    else if(this.type == "setBonus")
    {
      return this.characterSource.getSetBonuses({preview:1})[this.artifactSet]?.count >= this.artifactPieces;
    }
    else if(this.type == "weapon")
    {
      return (this.characterSource.previewWeapon?.key ?? this.characterSource.weapon?.key) == this.weapon.key && (this.characterSource.previews.weaponRefinement ?? (this.characterSource.previewWeapon ?? this.characterSource.weapon)?.refinement) == this.weaponRefinement;
    }
    else if(this.type == "constellation")
    {
      return (this.characterSource.previews.constellation ?? this.characterSource.constellation) >= this.constellation;
    }
    else if(this.type == "talentPassive")
    {
      if(this.talent == "1st Ascension Passive" && (this.characterSource.previews.ascension ?? this.characterSource.ascension) < 1)
        return false;
      if(this.talent == "4th Ascension Passive" && (this.characterSource.previews.ascension ?? this.characterSource.ascension) < 4)
        return false;
      return true;
    }
    else
    {
      return true;
    }
  }
  
  get description()
  {
    return StatModifier.codeToString(this.code);
  }
  
  static codeToString(code)
  {
    if(Array.isArray(code[0]))
      return code.map(subcode => StatModifier.codeToString(subcode)).join(" ");
    
    if(code[0] == "proc")
    {
      let stacks, trigger;
      if(typeof(code[2]) == "number" || Array.isArray(code[2]) && (code[2][0] == "mv"))
      {
        stacks = code[2];
        trigger = code[3];
      }
      else
      {
        stacks = code[3];
        trigger = code[2];
      }
      if(Array.isArray(stacks))
      {
        if(stacks[0] == "mv")
        {
          stacks = `(the motion value "${stacks[1]}")`;
        }
      }
      return (trigger ? `<i>${trigger}:</i> ` : `<i>When active:</i> `) + StatModifier.codeToString(code[1]) + (stacks ? ` (Stacks up to ${stacks} times.)` : "");
    }
    
    const [command, parameters] = code;
    if(command == "stat" || command == "estat" || command == "pstat" || command == "opstat" || command == "sstat" || command == "spstat" || command == "sopstat")
    {
      const [stat, amount, situation] = parameters;
      let statStr = Array.isArray(stat) ? stat.reduce((acc,s,i) => (acc ? acc + (i==stat.length-1?" and ":", ") : "") + GenshinItem.getStatFull(s), "") : GenshinItem.getStatFull(stat);
      let result = `${command=="pstat"||command=="spstat"?"all characters' ":""}${command=="estat"?"enemy's ":""}${command=="opstat"||command=="sopstat"?"other team members' ":""}${situation?situation+" ":""}${statStr}`;
      if(Array.isArray(amount))
      {
        const [func, ...args] = amount;
        if(func == "mv")
        {
          result = `Change ${result} by the motion value of "${args[0]}".`;
        }
        else if(func == "stat%")
        {
          result = `${args[0]>0?"Increase":"Decrease"} ${result} by ${Math.abs(args[0])}${GenshinItem.isStatPercent(args[1])?"":"%"} of ${GenshinItem.getStatFull(args[1])}${args[2]?", to a max of "+args[2]+"%":""}.`;
        }
        else if(func == "stacks")
        {
          result = `Change ${result} by ${args.join('/')} depending on stacks.`;
        }
        else
        {
          result = `Change ${result} by some function "${func}"; ${args.join(", ")}.`;
        }
      }
      else
      {
        result = `${amount>0?"Increase":"Decrease"} ${result} by ${Math.abs(amount)}${GenshinItem.isStatPercent(Array.isArray(stat)?stat[0]:stat)?"%":""}.`;
      }
      return result;
    }
    else if(command == "editmv" || command == "peditmv")
    {
      let mvStr = Array.isArray(parameters[1]) ? parameters[1].reduce((acc,mv,i) => (acc ? acc + (i==parameters[1].length-1?'" and "':'", "') : '') + mv, '') : parameters[1];
      let valueNumber = Array.isArray(parameters[3]) ? parameters[3].slice(1).join(' / ')+" (based on stacks)" : parameters[3];
      let valuePercent = Array.isArray(parameters[3]) ? parameters[3].slice(1).map(v=>(v*100)+"%").join(' / ')+" (based on stacks)" : (parameters[3]*100)+"%";
      let result = `Edit ${parameters[0]} motion value "${mvStr}"`;
      if(command == "peditmv")
        result += ` of the whole party`;
      if(parameters[2] == "+hit")
        result += `, adding an additional hit of ${valueNumber}.`;
      else if(parameters[2] == "+hit*")
        result += `, adding an additional hit equal to ${valuePercent} of the existing value.`;
      else if(parameters[2] == "*")
        result += `, increasing it by ${valuePercent}.`;
      else if(parameters[2] == "s")
        result += `, reducing the time by ${valuePercent}.`;
      else if(parameters[2] == "*base")
        result += `, increasing the base DMG multiplier by ${valuePercent}.`;
      else if(parameters[2] == "+base")
        result += `, increasing the base DMG by ${valueNumber}.`;
      else
        result += `, affecting it in some way (TBA) by ${valueNumber}.`;
      return result;
    }
    else if(command == "addmv" || command == "paddmv")
    {
      let result = `Add a new ${parameters[0]} motion value "${parameters[1]}"`;
      if(command == "paddmv")
        result += ` to the whole party`;
      if(typeof(parameters[2]) == "string" && parameters[2].includes("%:"))
      {
        const [amount, other] = parameters[2].split("%:");
        const [otherMV, otherPart] = other.split(".");
        result += `, that is ${amount}% of the motion value "${otherMV}"` + (otherPart!==undefined ? ` (hit ${parseInt(otherPart)+1})` : "") +  `.`;
      }
      else
        result += ` with value ${parameters[2]}.`;
      return result;
    }
    else if(command == "infuse" || command == "pinfuse" || command == "binfuse" || command == "oinfuse")
    {
      return `Infuse ${command=="pinfuse"?"all characters' Swords, Claymores, and Polearms":"this character's weapon"} with ${parameters}${command=="oinfuse"?" that cannot be overridden":""}.`;
    }
    else if(command == "custom")
      return `Custom code.`;
    else
      return `Unknown code.`;
  }
  
  getAddedMotionValues(talent, asker, alternates={})
  {
    if(!this.active)
      return [];
    if(this.isAvailable)
    {
      if(!talent)
        return asker == this.characterSource ? this.motionValues.padded.concat(this.motionValues.added) : this.motionValues.padded;
      
      if(talent == "auto") talent = "Normal Attack";
      else if(talent == "skill") talent = "Elemental Skill";
      else if(talent == "burst") talent = "Elemental Burst";
      
      let result = this.motionValues.padded.filter(mv => mv.talent == talent);
      if(asker == this.characterSource)
        result = result.concat(this.motionValues.added.filter(mv => mv.talent == talent));
      return result;
    }
    else
      return [];
  }
  
  getEditedMotionValues(talent, asker, alternates={})
  {
    if(!this.active)
      return [];
    if(alternates?.preview && this.isPreview || !alternates?.preview && this.isCurrent)
    {
      if(talent == "auto") talent = "Normal Attack";
      else if(talent == "skill") talent = "Elemental Skill";
      else if(talent == "burst") talent = "Elemental Burst";
      
      let result = this.motionValues.pedited.filter(mv => mv.talent == talent);
      if(asker == this.characterSource)
        result = result.concat(this.motionValues.edited.filter(mv => mv.talent == talent));
      result.forEach(mv => {
        if(mv.calc)
        {
          let thisStatModifier = this;
          Object.defineProperty(mv, "value", {
            get() {
              if(!("_value" in this))
                this._value = thisStatModifier.calcStat(this.calc, asker, alternates) * thisStatModifier.active;
              return this._value;
            },
          });
        }
      });
      
      // Check for modifications that override all other similar ones, such as certain weapon infusions.
      let permInfuseIdx = result.findIndex(mv => mv.method == "infuse" && mv.value.endsWith("!"));
      if(permInfuseIdx > -1)
      {
        result[permInfuseIdx].value = result[permInfuseIdx].value.slice(0, -1);
        result = result.filter((mv,i) => mv.method != "infuse" || i == permInfuseIdx);
      }
      return result;
    }
    else
      return [];
  }
  
  getStat(stat, asker, alternates={})
  {
    if(!this.active || alternates?.unmodified && (this.isProc || asker != this.characterSource))
      return 0;
    if(alternates?.preview && this.isPreview || !alternates?.preview && this.isCurrent)
    {
      let result = (this.stats[stat + "*"] ?? 0) + this.calcStat(stat + "*", asker, alternates);
      if(asker != this.characterSource)
        result += (this.stats[stat + "!"] ?? 0) + this.calcStat(stat + "!", asker, alternates);
      else
        result += (this.stats[stat] ?? 0) + this.calcStat(stat, asker, alternates);
      if(alternates?.situation)
      {
        result += (this.stats[stat + ":" + alternates?.situation + "*"] ?? 0) + this.calcStat(stat + ":" + alternates?.situation + "*", asker, alternates);
        if(asker != this.characterSource)
          result += (this.stats[stat + ":" + alternates?.situation + "!"] ?? 0) + this.calcStat(stat + ":" + alternates?.situation + "!", asker, alternates);
        else
          result += (this.stats[stat + ":" + alternates?.situation] ?? 0) + this.calcStat(stat + ":" + alternates?.situation, asker, alternates);
      }
      return result * this.active;
    }
    else
      return 0;
  }
  
  calcStat(stat, asker, alternates={})
  {
    let calc;
    if(typeof(stat) == "object" && stat.func && stat.args)
      calc = stat;
    else if(!this.stats.__calculations__[stat])
      return 0;
    else
      calc = this.stats.__calculations__[stat];
    switch(calc.func)
    {
      case "mv":
        const [ mvKey ] = calc.args;
        let motionValue = this.characterSource.getMotionValues(null, alternates, {onlyKey:mvKey}).find(mv => mv.rawKey == mvKey);
        if(typeof(motionValue?.final) == "number")
          return motionValue.final;
        else
          console.warn(`Function 'mv': "${mvKey}" is not a usable motion value:`, motionValue);
        break;
      case "stat%":
        const [ amount, otherStat, cap ] = calc.args;
        if(stat == otherStat && this.characterSource == asker)
        {
          console.warn(`Infinite recursion prevented. ${this.name}'s ${stat} is using itself in its own calculation because of:`, calc);
        }
        else
        {
          if(cap)
            return Math.min(cap, this.characterSource.getStat(otherStat, alternates) * amount);
          else
            return this.characterSource.getStat(otherStat, alternates) * amount;
        }
        break;
      case "stacks":
        if(this.active)
          // Dividing out this.active here is cringe, but it's the easiest way to deal with this.active being a multiplier in this.getStat()
          return (calc.args[this.active-1]??0) / this.active;
        else
          return 0;
        break;
      default:
        console.warn(`Unhandled function "${calc.func}" in stat calculation for "${stat}":`, calc);
    }
    return 0;
  }
  
  hasStat(stat, asker, alternates={})
  {
    for(let mvStat of Object.keys(this.stats).concat(Object.keys(this.stats.__calculations__)))
    {
      if(alternates?.situation)
      {
        if(mvStat.startsWith(stat + ":" + alternates.situation))
        {
          if(mvStat.endsWith("*"))
            return true;
          else
            return mvStat.endsWith("!") == (asker != this.characterSource);
        }
      }
      else
      {
        if(mvStat.startsWith(stat))
        {
          if(mvStat.endsWith("*"))
            return true;
          else
            return mvStat.endsWith("!") == (asker != this.characterSource);
        }
      }
    }
    return false;
  }
}
