import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm';

import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import DataManager from "./DataManager.js";
import MaterialList from "./MaterialList.js";
import CharacterList from "./CharacterList.js";
import WeaponList from "./WeaponList.js";
import ArtifactList from "./ArtifactList.js";
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
    this.listClasses.FurnitureList = FurnitureList;
    this.listClasses.FurnitureSetList = FurnitureSetList;
    this.listClasses.materials = MaterialList;
    this.listClasses.characters = CharacterList;
    this.listClasses.weapons = WeaponList;
    this.listClasses.artifacts = ArtifactList;
    this.listClasses.furniture = FurnitureList;
    this.listClasses.furnitureSets = FurnitureSetList;
    
    this.elements[MaterialList.name] = document.getElementById(MaterialList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[MaterialList.name].classList.add("viewer-pane");
    this.settings.paneMemory[MaterialList.name] = this.settings.paneMemory[MaterialList.name] ?? {};
    
    this.elements[CharacterList.name] = document.getElementById(CharacterList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[CharacterList.name].classList.add("viewer-pane");
    this.settings.paneMemory[CharacterList.name] = this.settings.paneMemory[CharacterList.name] ?? {};
    
    this.elements[WeaponList.name] = document.getElementById(WeaponList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[WeaponList.name].classList.add("viewer-pane");
    this.settings.paneMemory[WeaponList.name] = this.settings.paneMemory[WeaponList.name] ?? {};
    
    this.elements[ArtifactList.name] = document.getElementById(ArtifactList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[ArtifactList.name].classList.add("viewer-pane");
    this.settings.paneMemory[ArtifactList.name] = this.settings.paneMemory[ArtifactList.name] ?? {};
    
    this.elements[FurnitureList.name] = document.getElementById(FurnitureList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[FurnitureList.name].classList.add("viewer-pane");
    this.settings.paneMemory[FurnitureList.name] = this.settings.paneMemory[FurnitureList.name] ?? {};
    
    this.elements[FurnitureSetList.name] = document.getElementById(FurnitureSetList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[FurnitureSetList.name].classList.add("viewer-pane");
    this.settings.paneMemory[FurnitureSetList.name] = this.settings.paneMemory[FurnitureSetList.name] ?? {};
  }
  
  get lists()
  {
    return this.data?.[this.settings.account]?.[this.settings.server] ?? {};
  }
  
  today()
  {
    let today = DateTime.now().setZone("UTC-9").weekdayLong;
    if(this.lastDay != today)
    {
      this.update("today", today, "notify");
      this.renderAll();
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
    {
      this.data[this.settings.account][this.settings.server] = {};
      this.lists[MaterialList.name] = new MaterialList(this);
      this.lists[CharacterList.name] = new CharacterList(this);
      this.lists[WeaponList.name] = new WeaponList(this);
      this.lists[ArtifactList.name] = new ArtifactList(this);
      this.lists[FurnitureList.name] = new FurnitureList(this);
      this.lists[FurnitureSetList.name] = new FurnitureSetList(this);
    }
    else if(changed)
    {
      this.lists[MaterialList.name].forceNextRender = true;
      this.lists[CharacterList.name].forceNextRender = true;
      this.lists[WeaponList.name].forceNextRender = true;
      this.lists[ArtifactList.name].forceNextRender = true;
      this.lists[FurnitureList.name].forceNextRender = true;
      this.lists[FurnitureSetList.name].forceNextRender = true;
    }
    return true;
  }
  
  switchAccount(account, server)
  {
    this.activateAccount(account, server);
    this.view(this.currentView);
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
      return false;
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
      }
      catch(x)
      {
        console.error("Error when loading artifacts from GOOD data.", x);
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
    
    this.lists.ArtifactList.evaluate();
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
      console.warn(`Prevented saving of local data due to errors being detected during load, in order to prevent saved data corruption. You must reload the page to clear this. If the problem persist, you may have to report a bug to the developer.`);
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
    //if(!this.data)
    //  window.localStorage.setItem("goodViewerLists", JSON.stringify(this.toGOOD()));
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
    
    // Load the user data from the old way it's stored.
    if(!data)
    {
      try
      {
        if(this.fromGOOD(JSON.parse(window.localStorage.getItem("goodViewerLists") ?? "null")))
          console.log("Loaded old data from local storage.", this.lists);
      }
      catch(x)
      {
        console.error("Could not load old stored local data.", x);
        this.errors = true;
      }
    }
    
    // Load site-specific preferences.
    this.settingsFromJSON(window.localStorage.getItem("goodViewerSettings"));
    this.settings.account = this.settings.account ?? Object.keys(this.data ?? {})[0] ?? "";
    this.settings.server = this.settings.server ?? Object.keys(this.data?.[this.settings.account] ?? {})[0] ?? "";
    
    if(this.currentView)
      this.view(this.currentView);
  }
}