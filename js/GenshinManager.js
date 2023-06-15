import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm';

import GenshinLootData from "./gamedata/GenshinLootData.js";
import GenshinCharacterData from "./gamedata/GenshinCharacterData.js";
import GenshinFurnitureData from "./gamedata/GenshinFurnitureData.js";
import GiftSets from "./gamedata/GiftSets.js";
import GenshinBuilds from "./gamedata/GenshinBuilds.js";

import DataManager from "./DataManager.js";
import MaterialList from "./MaterialList.js";
import CharacterList from "./CharacterList.js";
import WeaponList from "./WeaponList.js";
import ArtifactList from "./ArtifactList.js";
import FurnitureList from "./FurnitureList.js";
import FurnitureSetList from "./FurnitureSetList.js";
import Material from "./Material.js";
import Artifact from "./Artifact.js";
import FurnitureSet from "./FurnitureSet.js";

export default class GenshinManager extends DataManager
{
  static dontSerialize = DataManager.dontSerialize.concat(["lastDay"]);
  
  lastDay = DateTime.now().setZone("UTC-9").weekdayLong;
  accountData;
  buildData = GenshinBuilds;
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadGOODModal");
    this.elements['loadError'] = document.getElementById("loadGOODError");
    this.settings.account = "";
    this.settings.server = "";
  }
  
  createLists()
  {
    this.lists[MaterialList.name] = new MaterialList(this);
    this.elements[MaterialList.name] = document.getElementById(MaterialList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[MaterialList.name].classList.add("viewer-pane");
    this.settings.paneMemory[MaterialList.name] = this.settings.paneMemory[MaterialList.name] ?? {};
    
    // Enemy mats
    for(let e in GenshinLootData.enemy)
      Material.setupTiers([4,3,2,1].map(q => GenshinLootData.enemy[e][q] ? this.lists.materials.addGOOD({goodKey:GenshinLootData.enemy[e][q], goodValue:0}).update("source", GenshinLootData.enemy[e].source ?? e).update("quality", q).update("shorthand", e) : null));
    
    // Trounce mats
    for(let domain of GenshinLootData.trounce)
      for(let itemName of domain.loot)
        this.lists.materials.addGOOD({goodKey:itemName, goodValue:0}).update("source", domain.boss).update("quality", 5);
      
    // Boss mats
    for(let b in GenshinLootData.boss)
      this.lists.materials.addGOOD({goodKey:GenshinLootData.boss[b]['4'], goodValue:0}).update("source", GenshinLootData.boss[b].name).update("quality", 4).update("shorthand", b);
    
    // Gemstone mats
    Material.setupTiers([5,4,3,2].map(q => this.lists.materials.addGOOD({goodKey:"Brilliant Diamond" + Material.gemQualities[q], goodValue:0}).update("quality", q).update("shorthand", "Diamond" + Material.gemQualities[q])));
    for(let elem in GenshinLootData.gemstone)
      Material.setupTiers([5,4,3,2].map(q => this.lists.materials.addGOOD({goodKey:GenshinLootData.gemstone[elem].prefix + Material.gemQualities[q], goodValue:0}).update("quality", q).update("shorthand", elem + Material.gemQualities[q])));
    
    // Mastery mats
    for(let suffix in GenshinLootData.mastery)
      Material.setupTiers([4,3,2].map(q => this.lists.materials.addGOOD({goodKey:Material.masteryQualities[q] + suffix, goodValue:0}).update("source", GenshinLootData.mastery[suffix].source).update("days", GenshinLootData.mastery[suffix].days, "replace").update("quality", q).update("shorthand", suffix)));
    this.lists.materials.addGOOD({goodKey:"Crown Of Insight", goodValue:0}).update("quality", 5);
    
    // Forgery mats
    for(let suffix in GenshinLootData.forgery)
      Material.setupTiers([5,4,3,2].map(q => this.lists.materials.addGOOD({goodKey:GenshinLootData.forgery[suffix][q], goodValue:0}).update("source", GenshinLootData.forgery[suffix].source).update("days", GenshinLootData.forgery[suffix].days, "replace").update("quality", q).update("shorthand", suffix)));
    
    // Flora mats
    for(let c in GenshinCharacterData)
      this.lists.materials.addGOOD({goodKey:GenshinCharacterData[c].matFlower, goodValue:0}).update("quality", 1);
    
    this.lists[CharacterList.name] = new CharacterList(this);
    this.elements[CharacterList.name] = document.getElementById(CharacterList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[CharacterList.name].classList.add("viewer-pane");
    this.settings.paneMemory[CharacterList.name] = this.settings.paneMemory[CharacterList.name] ?? {};
    
    this.lists[WeaponList.name] = new WeaponList(this);
    this.elements[WeaponList.name] = document.getElementById(WeaponList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[WeaponList.name].classList.add("viewer-pane");
    this.settings.paneMemory[WeaponList.name] = this.settings.paneMemory[WeaponList.name] ?? {};
    
    this.lists[ArtifactList.name] = new ArtifactList(this);
    this.elements[ArtifactList.name] = document.getElementById(ArtifactList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[ArtifactList.name].classList.add("viewer-pane");
    this.settings.paneMemory[ArtifactList.name] = this.settings.paneMemory[ArtifactList.name] ?? {};
    
    this.lists[FurnitureList.name] = new FurnitureList(this);
    this.elements[FurnitureList.name] = document.getElementById(FurnitureList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[FurnitureList.name].classList.add("viewer-pane");
    this.settings.paneMemory[FurnitureList.name] = this.settings.paneMemory[FurnitureList.name] ?? {};
    for(let k in GenshinFurnitureData)
    {
      this.lists.furniture.addGOOD({key:k, learned:false, count:0});
    }
    
    this.lists[FurnitureSetList.name] = new FurnitureSetList(this);
    this.elements[FurnitureSetList.name] = document.getElementById(FurnitureSetList.name) ?? this.elements.content.appendChild(document.createElement("div"));
    this.elements[FurnitureSetList.name].classList.add("viewer-pane");
    this.settings.paneMemory[FurnitureSetList.name] = this.settings.paneMemory[FurnitureSetList.name] ?? {};
    for(let s in GiftSets)
    {
      this.lists.furnitureSets.addGOOD({key:s, learned:false, settled:[]});
    }
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
  
  postLoad(data, options)
  {
    let hasData = this.fromGOOD(data);
    
    // Check if data was in GOOD format.
    if(!hasData)
    {
      this.elements.loadError.classList.remove("d-none");
      this.elements.loadError.innerHTML = "Your input did not contain any valid GOOD data.";
      return false;
    }
    return super.postLoad(data, options);
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
        hasData |= this.lists.materials.fromGOOD(goodData.materials);
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
        hasData |= this.lists.characters.fromGOOD(goodData.characters);
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
        hasData |= this.lists.weapons.fromGOOD(goodData.weapons);
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
        hasData |= this.lists.artifacts.fromGOOD(goodData.artifacts);
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
        hasData |= this.lists.furniture.fromGOOD(goodData.furniture);
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
        hasData |= this.lists.furnitureSets.fromGOOD(goodData.furnitureSets);
      }
      catch(x)
      {
        console.error("Error when loading furnitureSets from GOOD data.", x);
        this.errors = true;
      }
    }
    
    this.lists.artifacts.evaluate();
    return hasData;
  }
  
  toGOOD()
  {
    return {
      format: "GOOD",
      source: "Genshin Manager",
      version: 2,
      materials: this.lists.materials.toGOOD(),
      characters: this.lists.characters.toGOOD(),
      weapons: this.lists.weapons.toGOOD(),
      artifacts: this.lists.artifacts.toGOOD(),
      furniture: this.lists.furniture.toGOOD(),
      furnitureSets: this.lists.furnitureSets.toGOOD(),
    };
  }
  
  store()
  {
    if(this.errors)
    {
      console.warn(`Prevented saving of local data due to errors being detected during load, in order to prevent saved data corruption. You must reload the page to clear this. If the problem persist, you may have to report a bug to the developer.`);
      return false;
    }
    
    this.settings.account = this.settings.account ?? Object.keys(this.accountData ?? {})[0] ?? "";
    this.settings.server = this.settings.server ?? Object.keys(this.accountData?.[this.settings.account] ?? {})[0] ?? "";
    if(!this.accountData)
      this.accountData = {};
    if(!this.accountData[this.settings.account])
      this.accountData[this.settings.account] = {};
    this.accountData[this.settings.account][this.settings.server] = this.toGOOD();
    window.localStorage.setItem("goodViewerSettings", JSON.stringify(this.settings));
    window.localStorage.setItem("genshinAccount", JSON.stringify(this.accountData));
    //if(!this.accountData)
    //  window.localStorage.setItem("goodViewerLists", JSON.stringify(this.toGOOD()));
    window.localStorage.setItem("genshinBuilds", JSON.stringify(this.buildData));
    console.log(`Local data saved.`);
  }
  
  retrieve()
  {
    // Load site-specific preferences.
    this.settingsFromJSON(window.localStorage.getItem("goodViewerSettings") ?? "{}");
    
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
    
    // Initialize data lists before loading stored data into them.
    this.createLists();
    
    // Load the user data from the new way it's stored.
    let accountData;
    try
    {
      accountData = JSON.parse(window.localStorage.getItem("genshinAccount") ?? "null");
      if(accountData)
      {
        console.log("Loaded account data from local storage.", accountData);
        if(accountData?.[this.settings.account]?.[this.settings.server])
          if(this.fromGOOD(accountData[this.settings.account][this.settings.server]))
            console.log(`Loaded data from local storage for '${this.settings.account}' on '${this.settings.server}'.`);
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
    if(!accountData)
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
    
    if(this.currentView)
      this.view(this.currentView);
  }
}