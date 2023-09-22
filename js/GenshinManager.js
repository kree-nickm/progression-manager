import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm';

import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import DataManager from "./DataManager.js";
import MaterialList from "./MaterialList.js";
import CharacterList from "./CharacterList.js";
import WeaponList from "./WeaponList.js";
import ArtifactList from "./ArtifactList.js";
import TeamList from "./TeamList.js";
import FurnitureList from "./FurnitureList.js";
import FurnitureSetList from "./FurnitureSetList.js";

export default class GenshinManager extends DataManager
{
  static dontSerialize = DataManager.dontSerialize.concat(["lastDay"]);
  
  lastDay = DateTime.now().setZone("UTC-9").weekdayLong;
  buildData = GenshinBuilds;
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadModal");
    this.elements['loadError'] = document.getElementById("loadError");
    this.settings.account = "";
    this.settings.server = "";
    this.listClasses.MaterialList = MaterialList;
    this.listClasses.CharacterList = CharacterList;
    this.listClasses.WeaponList = WeaponList;
    this.listClasses.ArtifactList = ArtifactList;
    this.listClasses.TeamList = TeamList;
    this.listClasses.FurnitureList = FurnitureList;
    this.listClasses.FurnitureSetList = FurnitureSetList;
    
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
    return this.data?.[this.settings.account]?.[this.settings.server] ?? {};
  }
  
  paneFromHash()
  {
    if(location.hash == "#materials")
      return "MaterialList";
    else if(location.hash == "#weapons")
      return "WeaponList";
    else if(location.hash == "#artifacts")
      return "ArtifactList";
    else if(location.hash == "#teams")
      return "TeamList";
    else if(location.hash == "#furnitureSets")
      return "FurnitureSetList";
    else if(location.hash == "#furniture")
      return "FurnitureList";
    else
      return "CharacterList";
  }
  
  today()
  {
    let today = DateTime.now().setZone("UTC-9").weekdayLong;
    if(this.lastDay != today)
    {
      this.update("today", null, "notify");
    }
    this.lastDay = today;
    return today;
  }
  
  activateAccount(account, server)
  {
    let changed = false;
    if(this.settings.account != account || this.settings.server != server)
      changed = true;
    this.settings.account = account;
    this.settings.server = server;
    if(!this.data)
      this.data = {};
    if(!this.data[this.settings.account])
      this.data[this.settings.account] = {};
    if(!this.data[this.settings.account][this.settings.server])
      this.data[this.settings.account][this.settings.server] = {};
    for(let list in this.listClasses)
      if(!this.lists[list])
        this.lists[list] = new this.listClasses[list](this);
    if(changed)
      for(let list in this.listClasses)
        this.lists[list].forceNextRender = true;
    return true;
  }
  
  switchAccount(account, server)
  {
    this.activateAccount(account, server);
    this.lists[CharacterList.name].addTraveler();
    this.view(this.currentView);
    console.log(`Switching to account '${this.settings.account}' on server '${this.settings.server}'.`);
    return true;
  }
  
  postLoad(data, options)
  {
    if("account" in options && "server" in options)
    {
      this.activateAccount(options.account, options.server);
      if(!this.fromGOOD(data))
      {
        this.elements.loadError.classList.remove("d-none");
        this.elements.loadError.innerHTML = "Your input did not contain valid GOOD data.";
        return false;
      }
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
    if(data.__class__ != "GenshinManager")
    {
      return hasData;
    }
    
    // Load character build preferences.
    if(data.buildData)
    {
      hasData = true;
      if(!merge)
        this.buildData = {};
      for(let c in data.buildData)
      {
        if(!this.buildData[c])
          this.buildData[c] = {};
        for(let b in data.buildData[c])
        {
          this.buildData[c][b] = data.buildData[c][b];
        }
      }
      console.log("Loaded build data from file.", this.buildData);
    }
    
    // Load the user data.
    if(data.data)
    {
      hasData = true;
      if(!merge)
        this.data = {};
      for(let acc in data.data)
      {
        if(!this.data[acc])
          this.data[acc] = {};
        this.settings.account = acc;
        for(let srv in data.data[acc])
        {
          if(!this.data[acc][srv])
            this.data[acc][srv] = {};
          this.settings.server = srv;
          for(let list in data.data[acc][srv])
          {
            this.data[acc][srv][this.listClasses[data.data[acc][srv][list].__class__].name] = this.listClasses[data.data[acc][srv][list].__class__].fromJSON(data.data[acc][srv][list], {viewer:this});
          }
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
    
    this.settings.account = this.settings.account ?? Object.keys(this.data ?? {})[0] ?? "";
    this.settings.server = this.settings.server ?? Object.keys(this.data?.[this.settings.account] ?? {})[0] ?? "";
    
    return hasData;
  }
  
  fromGOOD(goodData)
  {
    if(!goodData)
    {
      console.error(`No data provided to [object ${this.constructor.name}].fromGOOD(1)`);
      this.errors = true;
      return false;
    }
    if(goodData.format != "GOOD")
    {
      console.error(`Data provided to [object ${this.constructor.name}].fromGOOD(1) does not appear to be in GOOD format:`, goodData);
      this.errors = true;
      return false;
    }
    
    let hasData = false;
    if(goodData.materials)
    {
      try
      {
        hasData |= this.lists.MaterialList.fromGOOD(goodData.materials);
      }
      catch(x)
      {
        console.error("Error when loading materials from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.characters)
    {
      try
      {
        hasData |= this.lists.CharacterList.fromGOOD(goodData.characters);
      }
      catch(x)
      {
        console.error("Error when loading characters from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.weapons)
    {
      try
      {
        hasData |= this.lists.WeaponList.fromGOOD(goodData.weapons);
      }
      catch(x)
      {
        console.error("Error when loading weapons from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.artifacts)
    {
      try
      {
        hasData |= this.lists.ArtifactList.fromGOOD(goodData.artifacts);
        //this.lists.ArtifactList.evaluate(); // Re-add this somewhere so that it can be done sometime other than when the user manually clicks it.
      }
      catch(x)
      {
        console.error("Error when loading artifacts from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.teams)
    {
      try
      {
        hasData |= this.lists.TeamList.fromGOOD(goodData.teams);
      }
      catch(x)
      {
        console.error("Error when loading teams from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.furniture)
    {
      try
      {
        hasData |= this.lists.FurnitureList.fromGOOD(goodData.furniture);
      }
      catch(x)
      {
        console.error("Error when loading furniture from GOOD data.", x);
        this.errors = true;
      }
    }
    if(goodData.furnitureSets)
    {
      try
      {
        hasData |= this.lists.FurnitureSetList.fromGOOD(goodData.furnitureSets);
      }
      catch(x)
      {
        console.error("Error when loading furnitureSets from GOOD data.", x);
        this.errors = true;
      }
    }
    
    return hasData;
  }
  
  toGOOD()
  {
    return {
      format: "GOOD",
      source: "Genshin Manager",
      version: 2,
      materials: this.lists.MaterialList.toGOOD(),
      characters: this.lists.CharacterList.toGOOD(),
      weapons: this.lists.WeaponList.toGOOD(),
      artifacts: this.lists.ArtifactList.toGOOD(),
    };
  }
  
  store()
  {
    if(this.errors)
    {
      console.warn(`Prevented saving of local data due to errors being detected during load, in order to prevent saved data corruption. You must reload the page to clear this. If the problem persist, you may have to report a bug to the developer here: https://github.com/kree-nickm/genshin-manager/issues`);
      return false;
    }
    
    this.settings.account = this.settings.account ?? Object.keys(this.data ?? {})[0] ?? "";
    this.settings.server = this.settings.server ?? Object.keys(this.data?.[this.settings.account] ?? {})[0] ?? "";
    if(!this.data)
      this.data = {};
    if(!this.data[this.settings.account])
      this.data[this.settings.account] = {};
    this.data[this.settings.account][this.settings.server] = this.lists;
    window.localStorage.setItem("goodViewerSettings", JSON.stringify(this.settings));
    window.localStorage.setItem("genshinAccount", JSON.stringify(this.data));
    window.localStorage.setItem("genshinBuilds", JSON.stringify(this.buildData));
    console.log(`Local data saved.`);
  }
  
  retrieve()
  {
    // Load character build preferences.
    try
    {
      let builds = JSON.parse(window.localStorage.getItem("genshinBuilds") ?? "{}") ?? {};
      for(let c in builds)
      {
        if(!this.buildData[c])
          this.buildData[c] = {};
        for(let b in builds[c])
        {
          this.buildData[c][b] = builds[c][b];
        }
      }
    }
    catch(x)
    {
      console.warn("Could not load local build data.", x);
      this.errors = true;
    }
    
    // Load the user data from the new way it's stored.
    let data;
    try
    {
      data = JSON.parse(window.localStorage.getItem("genshinAccount") ?? "null");
      if(data)
      {
        for(let acc in data)
        {
          if(!this.data[acc])
            this.data[acc] = {};
          for(let srv in data[acc])
          {
            if(!this.data[acc][srv])
              this.data[acc][srv] = {};
            this.settings.account = acc;
            this.settings.server = srv;
            for(let list in data[acc][srv])
            {
              this.data[acc][srv][this.listClasses[data[acc][srv][list].__class__].name] = this.listClasses[data[acc][srv][list].__class__].fromJSON(data[acc][srv][list], {viewer:this});
            }
          }
        }
        console.log("Loaded account data from local storage.", data);
      }
      else
      {
        console.log("No account data to load.");
      }
    }
    catch(x)
    {
      console.error("Could not load stored local account data.", x);
      this.errors = true;
    }
    
    // Load site-specific preferences.
    this.settingsFromJSON(window.localStorage.getItem("goodViewerSettings"));
    this.settings.account = this.settings.account ?? Object.keys(this.data ?? {})[0] ?? "";
    this.settings.server = this.settings.server ?? Object.keys(this.data?.[this.settings.account] ?? {})[0] ?? "";
    
    this.activateAccount(this.settings.account, this.settings.server)
    
    if(this.currentView)
      this.view(this.currentView);
  }
  
  async saveToPastebin()
  {
    let response = await fetch("https://themellin.com/genshin/saveToPastebin.php", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(this.toGOOD()),
    });
    let json = await response.json();
    if(json.success)
    {
      return json.code;
    }
    else
    {
      console.warn("Error when trying to save to Pastebin:", json);
      return false;
    }
  }
}