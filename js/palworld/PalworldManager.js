import { Renderer } from "../Renderer.js";

import DataManager from "../DataManager.js";
import PalList from "./PalList.js";

export default class PalworldManager extends DataManager
{
  static Renderer = Renderer; // Only here so the browser console can access it.
  //static dontSerialize = DataManager.dontSerialize.concat([]);
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadModal");
    this.elements['loadError'] = document.getElementById("loadError");
    this.settings.server = "";
    this.listClasses.PalList = PalList;
    
    for(let list in this.listClasses)
    {
      this.elements[this.listClasses[list].name] = document.getElementById(this.listClasses[list].name) ?? this.elements.content.appendChild(document.createElement("div"));
      this.elements[this.listClasses[list].name].id = this.listClasses[list].name;
      this.elements[this.listClasses[list].name].classList.add("viewer-pane");
      this.settings.paneMemory[this.listClasses[list].name] = this.settings.paneMemory[this.listClasses[list].name] ?? {};
    }
  }
  
  get lists()
  {
    return this.data?.[this.settings.server] ?? {};
  }
  
  paneFromHash()
  {
    //if(location.hash == "#materials")
    //  return "MaterialList";
    //else
      return "PalList";
  }
  
  activateAccount(server)
  {
    let changed = false;
    if(this.settings.server != server)
      changed = true;
    this.settings.server = server;
    if(!this.data)
      this.data = {};
    if(!this.data[this.settings.server])
      this.data[this.settings.server] = {};
    for(let list in this.listClasses)
      if(!this.lists[list])
        this.lists[list] = new this.listClasses[list](this);
    if(changed)
      for(let list in this.listClasses)
        this.lists[list].forceNextRender = true;
    return true;
  }
  
  switchAccount(server)
  {
    this.activateAccount(server);
    this.view(this.currentView);
    console.log(`Switching to account '${this.settings.server}'.`);
    return true;
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
        this.elements.loadError.innerHTML = "Your input did not contain valid Genshin Manager data.";
        return false;
      }
    }
    return super.postLoad(data, options);
  }
  
  fromJSON(data, {merge=false}={})
  {
    let hasData = false;
    if(data.__class__ != "PalworldManager")
    {
      return hasData;
    }
    
    // Load the user data.
    if(data.data)
    {
      hasData = true;
      if(!merge)
        this.data = {};
      for(let srv in data.data)
      {
        if(!this.data[srv])
          this.data[srv] = {};
        this.settings.server = srv;
        for(let list in data.data[srv])
        {
          this.data[srv][this.listClasses[data.data[srv][list].__class__].name] = this.listClasses[data.data[srv][list].__class__].fromJSON(data.data[srv][list], {viewer:this});
        }
      }
      console.log("Loaded account data from file.", this.data);
    }
    
    // Load site-specific preferences.
    if(data.settings)
    {
      hasData = true;
      this.settings = data.settings;
      console.log("Loaded settings from file.", this.settings);
    }
    
    this.settings.server = this.settings.server ?? Object.keys(this.data ?? {})[0] ?? "";
    
    return hasData;
  }
}