import Character from "./Character.js";

export default class Rover extends Character
{
  static dontSerialize = Character.dontSerialize.concat(["_element","base","variants"]);
  
  _element = "";
  base;
  variants = [];
  
  afterLoad()
  {
    this.MaterialList = {};
    
    if(this.key.endsWith("Spectro"))
    {
      this._element = "Spectro";
      this.MaterialList.forgery = {
        '2': this.viewer.lists.MaterialList.get("Inert Metallic Drip"),
        '3': this.viewer.lists.MaterialList.get("Reactive Metallic Drip"),
        '4': this.viewer.lists.MaterialList.get("Polarized Metallic Drip"),
        '5': this.viewer.lists.MaterialList.get("Heterized Metallic Drip"),
      };
      this.MaterialList.weekly = this.viewer.lists.MaterialList.get("Unending Destruction");
    }
    else if(this.key.endsWith("Havoc"))
    {
      this._element = "Havoc";
      this.MaterialList.forgery = {
        '2': this.viewer.lists.MaterialList.get("Inert Metallic Drip"),
        '3': this.viewer.lists.MaterialList.get("Reactive Metallic Drip"),
        '4': this.viewer.lists.MaterialList.get("Polarized Metallic Drip"),
        '5': this.viewer.lists.MaterialList.get("Heterized Metallic Drip"),
      };
      this.MaterialList.weekly = this.viewer.lists.MaterialList.get("Dreamless Feather");
    }
    else
    {
    }
      
    // Retrieve the materials used by this character.
    this.MaterialList.credit = this.viewer.lists.MaterialList.get("Shell Credit");
    this.MaterialList.enemy = {
      '2': this.viewer.lists.MaterialList.get("LF Whisperin Core"),
      '3': this.viewer.lists.MaterialList.get("MF Whisperin Core"),
      '4': this.viewer.lists.MaterialList.get("HF Whisperin Core"),
      '5': this.viewer.lists.MaterialList.get("FF Whisperin Core"),
    };
    this.MaterialList.boss = this.viewer.lists.MaterialList.get("Mysterious Code");
    this.MaterialList.flora = this.viewer.lists.MaterialList.get("Pecok Flower");
      
    // Inform those materials that this character uses them.
    for(let i in this.MaterialList.enemy)
      this.MaterialList.enemy[i]?.addUser(this);
    this.MaterialList.boss?.addUser(this);
    this.MaterialList.flora?.addUser(this);
    
    return true;
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
  
  get name(){ return this.element ? "Rover: "+ this.element : "Rover"; }
  get weaponType(){ return "Sword"; }
  get element(){ return this._element; }
  get rarity(){ return 5; }
  
  onRender(element)
  {
    // Only the variants can be inspected, so force it to one of them if this is the base Rover.
    if(this.base)
      super.onRender(element);
    else
      this.variants[0].onRender(element);
  }
}
