import { Renderer } from "../Renderer.js";

import DataManager from "../DataManager.js";
import CharacterList from "./CharacterList.js";
import WeaponList from "./WeaponList.js";
import EchoList from "./EchoList.js";
import MaterialList from "./MaterialList.js";

export default class WuWaManager extends DataManager
{
  //static dontSerialize = DataManager.dontSerialize.concat([]);
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadModal");
    this.elements['loadError'] = document.getElementById("loadError");
    this.settings.server = "";
    
    this.registerList(MaterialList);
    this.registerList(CharacterList);
    this.registerList(WeaponList);
    this.registerList(EchoList);
    
    this.registerNavItem("Characters", "characters", {listName:"CharacterList", isDefault:true});
    this.registerNavItem("Weapons", "weapons", {listName:"WeaponList"});
    this.registerNavItem("Echoes", "echoes", {listName:"EchoList"});
    this.registerNavItem("Materials", "materials", {listName:"MaterialList"});
  }
  
  postLoad(data, options)
  {
    if("server" in options)
    {
      this.activateAccount(options.server);
    }
    else
    {
      if(!this.fromJSON(data))
      {
        this.elements.loadError.classList.remove("d-none");
        this.elements.loadError.innerHTML = "Your input did not contain valid Manager data.";
        return false;
      }
    }
    return super.postLoad(data, options);
  }
}