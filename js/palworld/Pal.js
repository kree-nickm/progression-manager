import PalsData from "./gamedata/PalworldPals.js";
import PalworldPassives from "./gamedata/PalworldPassives.js";

import PalworldItem from "./PalworldItem.js";

export default class Pal extends PalworldItem
{
  static templateName = "palworld/renderPalAsPopup";
  
  // These can only be bred if both parents are the same.
  static isolatedBreeds = ["Frostallion","Jetragon","Paladius","Necromus","Jormuntide Ignis"];
  
  // Special combos that ignore the breed formula.
  static specificBreeds = {
    "Relaxaurus Lux": ["Relaxaurus", "Sparkit"],
    "Incineram Noct": ["Incineram", "Maraith"],
    "Mau Cryst": ["Mau", "Pengullet"],
    "Vanwyrm Cryst": ["Vanwyrm", "Foxcicle"],
    "Eikthyrdeer Terra": ["Eikthyrdeer", "Hangyu"],
    "Elphidran Aqua": ["Elphidran", "Surfent"],
    "Pyrin Noct": ["Pyrin", "Katress"],
    "Mammorest Cryst": ["Mammorest", "Wumpo"],
    "Mossanda Lux": ["Mossanda", "Grizzbolt"],
    "Dinossom Lux": ["Dinossom", "Rayhound"],
    "Jolthog Cryst": ["Jolthog", "Pengullet"],
    "Frostallion Noct": ["Frostallion", "Helzephyr"],
    "Kingpaca Cryst": ["Kingpaca", "Reindrix"],
    "Lyleen Noct": ["Lyleen", "Menasting"],
    "Leezpunk Ignis": ["Leezpunk", "Flambelle"],
    "Blazehowl Noct": ["Blazehowl", "Felbat"],
    "Robinquill Terra": ["Robinquill", "Fuddler"],
    "Broncherry Aqua": ["Broncherry", "Fuack"],
    "Surfent Terra": ["Surfent", "Dumud"],
    "Gobfin Ignis": ["Gobfin", "Rooby"],
    "Suzaku Aqua": ["Suzaku", "Jormuntide"],
    "Reptyro Cryst": ["Reptyro", "Foxcicle"],
    "Hangyu Cryst": ["Hangyu", "Swee"],
    "Lyleen": ["Mossanda", "Petallia"],
    "Faleris": ["Vanwyrm", "Anubis"],
    "Grizzbolt": ["Mossanda", "Rayhound"],
    "Orserk": ["Grizzbolt", "Relaxaurus"],
    "Shadowbeak": ["Kitsun", "Astegon"],
  };
  
  static getChild(parentA, parentB)
  {
    if(parentA == parentB)
      return parentA;
    
    for(let child in Pal.specificBreeds)
    {
      if(Pal.specificBreeds[child].includes(parentA) && Pal.specificBreeds[child].includes(parentB))
        return child;
    }
    
    let targetBP = (PalsData[parentA].breedPower + PalsData[parentB].breedPower) / 2;
    let child;
    let childDiff;
    for(let key in PalsData)
    {
      if(Pal.isolatedBreeds.includes(key) || key in Pal.specificBreeds)
        continue;
      let diff = Math.abs(targetBP - PalsData[key].breedPower);
      if(!child || diff < childDiff || diff == childDiff && PalsData[child].breedTiebreaker > PalsData[key].breedTiebreaker)
      {
        child = key;
        childDiff = diff;
      }
    }
    return child;
  }

  static getParents(child)
  {
    if(Pal.isolatedBreeds.includes(child))
      return [[child,child]];
    
    if(child in Pal.specificBreeds)
      return [Pal.specificBreeds[child]];
    
    //PalsData[child].breedPower;
    //PalsData[child].breedTiebreaker;
    let result = [];
    for(let parentA in PalsData)
    {
      for(let parentA in PalsData)
      {
      }
    }
    return result;
  }
  
  key = "";
  name = "";
  passivesKeys = [];
  alphaStatus = "";
  level = 1;
  hp = 1;
  atk = 1;
  def = 1;
  partnerLevel = 1;
  sex;
  location = "";
  
  get number() { return PalsData[this.key].number; }
  get type() { return PalsData[this.key].type; }
  get img() { return PalsData[this.key].img; }
  get breedPower() { return PalsData[this.key].breedPower; }
  get breedTiebreaker() { return PalsData[this.key].breedTiebreaker; }
  get elements() { return PalsData[this.key].elements; }
  get drops() { return PalsData[this.key].drops; }
  get food() { return PalsData[this.key].food; }
  get partnerSkill() { return PalsData[this.key].partnerSkill; }
  get kindling() { return PalsData[this.key].work.kindling; }
  get watering() { return PalsData[this.key].work.watering; }
  get planting() { return PalsData[this.key].work.planting; }
  get generating() { return PalsData[this.key].work.generating; }
  get handiwork() { return PalsData[this.key].work.handiwork; }
  get gathering() { return PalsData[this.key].work.gathering; }
  get lumbering() { return PalsData[this.key].work.lumbering; }
  get mining() { return PalsData[this.key].work.mining; }
  get medicine() { return PalsData[this.key].work.medicine; }
  get cooling() { return PalsData[this.key].work.cooling; }
  get transporting() { return PalsData[this.key].work.transporting; }
  get farming() { return PalsData[this.key].work.farming; }
  
  get passives()
  {
    return this.passivesKeys.map(key => PalworldPassives[key]).filter(passive => passive);
  }
  
  async getRelatedItems()
  {
    return {
      children: this.getPossibleChildren(),
    };
  }
  
  getPossibleChildren()
  {
    let result = [];
    for(let coparent of this.list.items("currentFilter"))
    {
      if(coparent.sex != this.sex)
        result.push({coparent, child:PalsData[Pal.getChild(this.key, coparent.key)]});
    }
    result.sort((a, b) => {
      let sort = b.child.breedPower - a.child.breedPower;
      if(sort == 0)
        sort = a.coparent.type.localeCompare(b.coparent.type);
      if(sort == 0)
        sort = b.coparent.level - a.coparent.level;
      return sort;
    });
    return result;
  }
}
