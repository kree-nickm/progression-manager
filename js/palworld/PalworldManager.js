import { Renderer } from "../Renderer.js";

import DataManager from "../DataManager.js";
import PalList from "./PalList.js";

export default class PalworldManager extends DataManager
{
  //static dontSerialize = DataManager.dontSerialize.concat([]);
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadModal");
    this.elements['loadError'] = document.getElementById("loadError");
    this.settings.server = "";
    
    this.registerList(PalList);
    
    this.registerNavItem("Pals", "pals", {listName:"PalList", isDefault:true});
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