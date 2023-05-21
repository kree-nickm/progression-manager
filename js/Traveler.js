import Character from "./Character.js";
import Material from "./Material.js";

export default class Traveler extends Character
{
  //#constellation = 0;
  #ascension = 0;
  #level = 1;
  #element = "";
  #talentEnemyMatType = "";
  #talentMasteryMatTypes = ["","",""];
  #weapon;
  base;
  variants = [];
  
  afterLoad()
  {
    this.loaded = true;
    
    // Retrieve the materials used by this character.
    this.materials = {};
    
    if(this.key.endsWith("Anemo"))
    {
      this.#element = "Anemo";
      this.#talentEnemyMatType = "Samachurls";
      this.#talentMasteryMatTypes = ["Freedom","Resistance","Ballad"];
      this.materials.talentEnemy = {
        '1': this.list.viewer.lists.materials.get("Divining Scroll"),
        '2': this.list.viewer.lists.materials.get("Sealed Scroll"),
        '3': this.list.viewer.lists.materials.get("Forbidden Curse Scroll"),
      };
      this.materials.mastery = [
        {
          '2': this.list.viewer.lists.materials.get("Teachings Of Freedom"),
          '3': this.list.viewer.lists.materials.get("Guide To Freedom"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Freedom"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Resistance"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Resistance"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Ballad"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Ballad"),
        },
      ];
      this.materials.trounce = this.list.viewer.lists.materials.get("Dvalin's Sigh");
    }
    else if(this.key.endsWith("Geo"))
    {
      this.#element = "Geo";
      this.#talentEnemyMatType = "Hilichurl Archers";
      this.#talentMasteryMatTypes = ["Prosperity","Diligence","Gold"];
      this.materials.talentEnemy = {
        '1': this.list.viewer.lists.materials.get("Firm Arrowhead"),
        '2': this.list.viewer.lists.materials.get("Sharp Arrowhead"),
        '3': this.list.viewer.lists.materials.get("Weathered Arrowhead"),
      };
      this.materials.mastery = [
        {
          '2': this.list.viewer.lists.materials.get("Teachings Of Prosperity"),
          '3': this.list.viewer.lists.materials.get("Guide To Prosperity"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Prosperity"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Diligence"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Diligence"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Gold"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Gold"),
        },
      ];
      this.materials.trounce = this.list.viewer.lists.materials.get("Tail Of Boreas");
    }
    else if(this.key.endsWith("Electro"))
    {
      this.#element = "Electro";
      this.#talentEnemyMatType = "Nobushi";
      this.#talentMasteryMatTypes = ["Transience","Elegance","Light"];
      this.materials.talentEnemy = {
        '1': this.list.viewer.lists.materials.get("Old Handguard"),
        '2': this.list.viewer.lists.materials.get("Kageuchi Handguard"),
        '3': this.list.viewer.lists.materials.get("Famed Handguard"),
      };
      this.materials.mastery = [
        {
          '2': this.list.viewer.lists.materials.get("Teachings Of Transience"),
          '3': this.list.viewer.lists.materials.get("Guide To Transience"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Transience"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Elegance"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Elegance"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Light"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Light"),
        },
      ];
      this.materials.trounce = this.list.viewer.lists.materials.get("Dragon Lord's Crown");
    }
    else if(this.key.endsWith("Dendro"))
    {
      this.#element = "Dendro";
      this.#talentEnemyMatType = "Fungi";
      this.#talentMasteryMatTypes = ["Admonition","Ingenuity","Praxis"];
      this.materials.talentEnemy = {
        '1': this.list.viewer.lists.materials.get("Fungal Spores"),
        '2': this.list.viewer.lists.materials.get("Luminescent Pollen"),
        '3': this.list.viewer.lists.materials.get("Crystalline Cyst Dust"),
      };
      this.materials.mastery = [
        {
          '2': this.list.viewer.lists.materials.get("Teachings Of Admonition"),
          '3': this.list.viewer.lists.materials.get("Guide To Admonition"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Admonition"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Ingenuity"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Ingenuity"),
        },
        {
          '3': this.list.viewer.lists.materials.get("Guide To Praxis"),
          '4': this.list.viewer.lists.materials.get("Philosophies Of Praxis"),
        },
      ];
      this.materials.trounce = this.list.viewer.lists.materials.get("Mudra Of The Malefic General");
    }
    else
    {
      this.materials.gem = {
        '2': this.list.viewer.lists.materials.get("Brilliant Diamond" + Material.gemQualities[2]),
        '3': this.list.viewer.lists.materials.get("Brilliant Diamond" + Material.gemQualities[3]),
        '4': this.list.viewer.lists.materials.get("Brilliant Diamond" + Material.gemQualities[4]),
        '5': this.list.viewer.lists.materials.get("Brilliant Diamond" + Material.gemQualities[5]),
      };
      this.materials.flower = this.list.viewer.lists.materials.get("Windwheel Aster");
      this.materials.enemy = {
        '1': this.list.viewer.lists.materials.get("Damaged Mask"),
        '2': this.list.viewer.lists.materials.get("Stained Mask"),
        '3': this.list.viewer.lists.materials.get("Ominous Mask"),
      };
      
      // Inform those materials that this character uses them.
      for(let i in this.materials.gem)
        this.materials.gem[i].addUser(this);
      
      for(let i in this.materials.enemy)
        this.materials.enemy[i].addUser(this);
      
      this.materials.flower.addUser(this);
    }
    
    if(this.element)
    {
      this.materials.crown = this.list.viewer.lists.materials.get("Crown Of Insight");
      
      for(let i in this.materials.talentEnemy)
        this.materials.talentEnemy[i].addUser(this);
        
      for(let m of this.materials.mastery)
        for(let i in m)
        {
          if(m[i])
            m[i].addUser(this);
          else
            console.error(`${this.name} has a null key '${i}'`, m);
        }
      
      this.materials.trounce.addUser(this);
      this.materials.crown.addUser(this);
    }
    
    return this.loaded;
  }
  
  get weapon()
  {
    if(this.base)
      return this.base.weapon;
    else
      return this.#weapon;
  }
  set weapon(val)
  {
    if(this.base)
      this.base.weapon = val;
    else
      this.#weapon = val;
  }
  /*get constellation()
  {
    if(this.base)
      return this.base.constellation;
    else
      return this.#constellation;
  }
  set constellation(val)
  {
    if(this.base)
      this.base.constellation = val;
    else
      this.#constellation = Math.min(Math.max(val, 0), 6);
  }*/
  get ascension()
  {
    if(this.base)
      return this.base.ascension;
    else
      return this.#ascension;
  }
  set ascension(val)
  {
    if(this.base)
      this.base.ascension = val;
    else
      this.#ascension = Math.min(Math.max(val, 0), 6);
  }
  get level()
  {
    if(this.base)
      return this.base.level;
    else
      return this.#level;
  }
  set level(val)
  {
    if(this.base)
      this.base.level = val;
    else
      this.#level = Math.min(Math.max(val, 1), 90);
  }
  
  get name(){ return this.element ? "Traveler: "+ this.element : "Traveler"; }
  get weaponType(){ return "Sword"; }
  get element(){ return this.#element; }
  get bossMatType(){ return ""; }
  get flowerMatType(){ return "Windwheel Aster"; }
  get enemyMatType(){ return "Hilichurls"; }
  
  getMat(type, ascension=this.ascension)
  {
    if(type == "gem")
      return this.base ? this.base.materials.gem[this.getPhase(ascension).ascendMatGemQuality] : this.materials.gem[this.getPhase(ascension).ascendMatGemQuality];
    else if(type == "boss")
      return null;
    else if(type == "flower")
      return this.base ? this.base.materials.flower : this.materials.flower;
    else if(type == "enemy")
      return this.base ? this.base.materials.enemy[this.getPhase(ascension).ascendMatEnemyQuality] : this.materials.enemy[this.getPhase(ascension).ascendMatEnemyQuality];
    else
      return null;
  }
  
  getTalentMat(type, talent)
  {
    if(type == "mastery")
      return this.materials.mastery?.[((isNaN(talent)?this.talent[talent]:talent)-1)%3][this.getTalent(talent).matDomainQuality] ?? null;
    else if(type == "enemy")
      return this.materials.talentEnemy?.[this.getTalent(talent).matEnemyQuality] ?? null;
    else if(type == "trounce")
      return this.materials.trounce;
    else if(type == "crown")
      return this.materials.crown;
    else
      return null;
  }
  
  getTalentMatType(type, talent)
  {
    if(type == "mastery")
    {
      if(isNaN(talent))
        return this.base ? this.#talentMasteryMatTypes[(this.talent[talent]-1)%3] : "";
      else
        return this.base ? this.#talentMasteryMatTypes[(talent-1)%3] : "";
    }
    else if(type == "enemy")
      return this.base ? this.#talentEnemyMatType : "";
    else if(type == "trounce")
      return this.base ? this.materials.trounce.name : "";
    else if(type == "crown")
      return "Crown";
    else
      return "";
  }
}
