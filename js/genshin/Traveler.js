import Character from "./Character.js";
import Material from "./Material.js";

export default class Traveler extends Character
{
  static dontSerialize = Character.dontSerialize.concat(["_element","_talentEnemyMatType","_talentMasteryMatTypes","base","variants"]);
  
  _element = "";
  _talentEnemyMatType = "";
  _talentMasteryMatTypes = ["","",""];
  base;
  variants = [];
  
  afterLoad()
  {
    this.loaded = true;
    
    // Retrieve the materials used by this character.
    this.MaterialList = {};
    
    if(this.key.endsWith("Anemo"))
    {
      this._element = "Anemo";
      this._talentEnemyMatType = "Samachurls";
      this._talentMasteryMatTypes = ["Freedom","Resistance","Ballad"];
      this.MaterialList.talentEnemy = {
        '1': this.list.viewer.lists.MaterialList.get("Divining Scroll"),
        '2': this.list.viewer.lists.MaterialList.get("Sealed Scroll"),
        '3': this.list.viewer.lists.MaterialList.get("Forbidden Curse Scroll"),
      };
      this.MaterialList.mastery = [
        {
          '2': this.list.viewer.lists.MaterialList.get("Teachings Of Freedom"),
          '3': this.list.viewer.lists.MaterialList.get("Guide To Freedom"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Freedom"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Resistance"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Resistance"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Ballad"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Ballad"),
        },
      ];
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get("Dvalin's Sigh");
    }
    else if(this.key.endsWith("Geo"))
    {
      this._element = "Geo";
      this._talentEnemyMatType = "Hili.Archers";
      this._talentMasteryMatTypes = ["Prosperity","Diligence","Gold"];
      this.MaterialList.talentEnemy = {
        '1': this.list.viewer.lists.MaterialList.get("Firm Arrowhead"),
        '2': this.list.viewer.lists.MaterialList.get("Sharp Arrowhead"),
        '3': this.list.viewer.lists.MaterialList.get("Weathered Arrowhead"),
      };
      this.MaterialList.mastery = [
        {
          '2': this.list.viewer.lists.MaterialList.get("Teachings Of Prosperity"),
          '3': this.list.viewer.lists.MaterialList.get("Guide To Prosperity"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Prosperity"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Diligence"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Diligence"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Gold"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Gold"),
        },
      ];
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get("Tail Of Boreas");
    }
    else if(this.key.endsWith("Electro"))
    {
      this._element = "Electro";
      this._talentEnemyMatType = "Nobushi";
      this._talentMasteryMatTypes = ["Transience","Elegance","Light"];
      this.MaterialList.talentEnemy = {
        '1': this.list.viewer.lists.MaterialList.get("Old Handguard"),
        '2': this.list.viewer.lists.MaterialList.get("Kageuchi Handguard"),
        '3': this.list.viewer.lists.MaterialList.get("Famed Handguard"),
      };
      this.MaterialList.mastery = [
        {
          '2': this.list.viewer.lists.MaterialList.get("Teachings Of Transience"),
          '3': this.list.viewer.lists.MaterialList.get("Guide To Transience"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Transience"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Elegance"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Elegance"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Light"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Light"),
        },
      ];
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get("Dragon Lord's Crown");
    }
    else if(this.key.endsWith("Dendro"))
    {
      this._element = "Dendro";
      this._talentEnemyMatType = "Fungi";
      this._talentMasteryMatTypes = ["Admonition","Ingenuity","Praxis"];
      this.MaterialList.talentEnemy = {
        '1': this.list.viewer.lists.MaterialList.get("Fungal Spores"),
        '2': this.list.viewer.lists.MaterialList.get("Luminescent Pollen"),
        '3': this.list.viewer.lists.MaterialList.get("Crystalline Cyst Dust"),
      };
      this.MaterialList.mastery = [
        {
          '2': this.list.viewer.lists.MaterialList.get("Teachings Of Admonition"),
          '3': this.list.viewer.lists.MaterialList.get("Guide To Admonition"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Admonition"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Ingenuity"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Ingenuity"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Praxis"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Praxis"),
        },
      ];
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get("Mudra Of The Malefic General");
    }
    else if(this.key.endsWith("Hydro"))
    {
      this._element = "Hydro";
      this._talentEnemyMatType = "Fontemer";
      this._talentMasteryMatTypes = ["Equity","Justice","Order"];
      this.MaterialList.talentEnemy = {
        '1': this.list.viewer.lists.MaterialList.get("Transoceanic Pearl"),
        '2': this.list.viewer.lists.MaterialList.get("Transoceanic Chunk"),
        '3': this.list.viewer.lists.MaterialList.get("Xenochromatic Crystal"),
      };
      this.MaterialList.mastery = [
        {
          '2': this.list.viewer.lists.MaterialList.get("Teachings Of Equity"),
          '3': this.list.viewer.lists.MaterialList.get("Guide To Equity"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Equity"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Justice"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Justice"),
        },
        {
          '3': this.list.viewer.lists.MaterialList.get("Guide To Order"),
          '4': this.list.viewer.lists.MaterialList.get("Philosophies Of Order"),
        },
      ];
      this.MaterialList.trounce = this.list.viewer.lists.MaterialList.get("Worldspan Fern");
    }
    else
    {
      this.MaterialList.gem = {
        '2': this.list.viewer.lists.MaterialList.get("Brilliant Diamond" + Material.gemQualities[2]),
        '3': this.list.viewer.lists.MaterialList.get("Brilliant Diamond" + Material.gemQualities[3]),
        '4': this.list.viewer.lists.MaterialList.get("Brilliant Diamond" + Material.gemQualities[4]),
        '5': this.list.viewer.lists.MaterialList.get("Brilliant Diamond" + Material.gemQualities[5]),
      };
      this.MaterialList.flower = this.list.viewer.lists.MaterialList.get("Windwheel Aster");
      this.MaterialList.enemy = {
        '1': this.list.viewer.lists.MaterialList.get("Damaged Mask"),
        '2': this.list.viewer.lists.MaterialList.get("Stained Mask"),
        '3': this.list.viewer.lists.MaterialList.get("Ominous Mask"),
      };
      
      // Inform those materials that this character uses them.
      for(let i in this.MaterialList.gem)
        this.MaterialList.gem[i].addUser(this);
      
      for(let i in this.MaterialList.enemy)
        this.MaterialList.enemy[i].addUser(this);
      
      this.MaterialList.flower.addUser(this);
    }
    
    if(this.element)
    {
      this.MaterialList.crown = this.list.viewer.lists.MaterialList.get("Crown Of Insight");
      this.MaterialList.mora = this.list.viewer.lists.MaterialList.get("Mora");
      
      for(let i in this.MaterialList.talentEnemy)
        this.MaterialList.talentEnemy[i].addUser(this);
        
      for(let m of this.MaterialList.mastery)
        for(let i in m)
        {
          if(m[i])
            m[i].addUser(this);
          else
            console.error(`${this.name} has a null key '${i}'`, m);
        }
      
      this.MaterialList.trounce.addUser(this);
      this.MaterialList.crown.addUser(this);
    }
    
    return this.loaded;
  }
  
  get weapon()
  {
    if(this.base)
      return this.base.weapon;
    else
      return this._weapon;
  }
  set weapon(val)
  {
    if(this.base)
      this.base.weapon = val;
    else
      this._weapon = val;
  }
  get flowerArtifact()
  {
    if(this.base)
      return this.base.flowerArtifact;
    else
      return this._flower;
  }
  set flowerArtifact(val)
  {
    if(this.base)
      this.base.flowerArtifact = val;
    else
      this._flower = val;
  }
  get plumeArtifact()
  {
    if(this.base)
      return this.base.plumeArtifact;
    else
      return this._plume;
  }
  set plumeArtifact(val)
  {
    if(this.base)
      this.base.plumeArtifact = val;
    else
      this._plume = val;
  }
  get sandsArtifact()
  {
    if(this.base)
      return this.base.sandsArtifact;
    else
      return this._sands;
  }
  set sandsArtifact(val)
  {
    if(this.base)
      this.base.sandsArtifact = val;
    else
      this._sands = val;
  }
  get gobletArtifact()
  {
    if(this.base)
      return this.base.gobletArtifact;
    else
      return this._goblet;
  }
  set gobletArtifact(val)
  {
    if(this.base)
      this.base.gobletArtifact = val;
    else
      this._goblet = val;
  }
  get circletArtifact()
  {
    if(this.base)
      return this.base.circletArtifact;
    else
      return this._circlet;
  }
  set circletArtifact(val)
  {
    if(this.base)
      this.base.circletArtifact = val;
    else
      this._circlet = val;
  }
  get ascension()
  {
    if(this.base)
      return this.base.ascension;
    else
      return this._ascension;
  }
  set ascension(val)
  {
    if(this.base)
      this.base.ascension = val;
    else
      this._ascension = Math.min(Math.max(val, 0), 6);
  }
  get level()
  {
    if(this.base)
      return this.base.level;
    else
      return this._level;
  }
  set level(val)
  {
    if(this.base)
      this.base.level = val;
    else
      this._level = Math.min(Math.max(val, 1), 90);
  }
  
  get name(){ return this.element ? "Traveler: "+ this.element : "Traveler"; }
  get weaponType(){ return "Sword"; }
  get element(){ return this._element; }
  get rarity(){ return 4; }
  get ascendStat(){ return "atk_"; }
  get bossMatType(){ return ""; }
  get flowerMatType(){ return "Windwheel Aster"; }
  get enemyMatType(){ return "Hilichurls"; }
  get image(){ return this.variants?.[0]?.image??super.image; }
  
  getMat(type, ascension=this.ascension)
  {
    if(type == "gem")
      return this.base ? this.base.MaterialList?.gem[this.getPhase(ascension).ascendMatGemQuality] : this.MaterialList?.gem[this.getPhase(ascension).ascendMatGemQuality];
    else if(type == "boss")
      return null;
    else if(type == "flower")
      return this.base ? this.base.MaterialList?.flower : this.MaterialList?.flower;
    else if(type == "enemy")
      return this.base ? this.base.MaterialList?.enemy[this.getPhase(ascension).ascendMatEnemyQuality] : this.MaterialList?.enemy[this.getPhase(ascension).ascendMatEnemyQuality];
    else
      return null;
  }
  
  getTalentMat(type, talent)
  {
    if(type == "mastery")
      return this.MaterialList?.mastery?.[((isNaN(talent)?this.talent[talent]:talent)-1)%3]?.[this.getTalent(talent).matMasteryQuality] ?? null;
    else if(type == "enemy")
      return this.MaterialList?.talentEnemy?.[this.getTalent(talent).matEnemyQuality] ?? null;
    else if(type == "trounce")
      return this.MaterialList?.trounce;
    else if(type == "crown")
      return this.MaterialList?.crown;
    else
      return null;
  }
  
  getTalentMatType(type, talent)
  {
    if(type == "mastery")
    {
      if(isNaN(talent))
        return this.base ? this._talentMasteryMatTypes[(this.talent[talent]-1)%3] : "";
      else
        return this.base ? this._talentMasteryMatTypes[(talent-1)%3] : "";
    }
    else if(type == "enemy")
      return this.base ? this._talentEnemyMatType : "";
    else if(type == "trounce")
      return this.base ? this.MaterialList?.trounce.name : "";
    else if(type == "crown")
      return "Crown";
    else
      return "";
  }
  
  onRender(element)
  {
    // Only the variants can be inspected, so force it to one of them if this is the base Traveler.
    if(this.base)
      super.onRender(element);
    else
      this.variants[0].onRender(element);
  }
}
