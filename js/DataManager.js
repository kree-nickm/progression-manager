import { Renderer } from "./Renderer.js";
import UIController from "./UIController.js";

export default class DataManager extends UIController
{
  static Renderer = Renderer; // Only here so the browser console can access it.
  static dontSerialize = UIController.dontSerialize.concat(["listClasses","navigation","elements","stickyElements","errors","storeTimeout"]);
  
  dataVersion = 1;
  currentView;
  navigation = {};
  settings = {};
  listClasses = {};
  data = {};
  elements = {};
  stickyElements = [];
  errors;
  storeTimeout;
  
  constructor()
  {
    super();
    this.elements['nav'] = document.getElementById("navigation");
    this.elements['nav'].replaceChildren();
    this.elements['content'] = document.getElementById("content");
    this.elements['popup'] = document.getElementById("popup");
    this.elements['popup'].addEventListener('hidden.bs.modal', event => UIController.clearDependencies(event.target, true));
    this.settings.paneMemory = {};
    this.settings.preferences = {};
    this.settings.server = null;
  }
  
  registerList(listClass, {listName}={})
  {
    this.listClasses[listName ?? listClass.name] = listClass;
  }
  
  registerNavItem(label, hash, {list, isDefault}={})
  {
    let tempNav = Object.values(this.navigation);
    if(list)
    {
      this.elements[this.listClasses[list].name] = document.getElementById(this.listClasses[list].name) ?? this.elements.content.appendChild(document.createElement("div"));
      this.elements[this.listClasses[list].name].id = this.listClasses[list].name;
      this.elements[this.listClasses[list].name].classList.add("viewer-pane");
      this.settings.paneMemory[this.listClasses[list].name] = this.settings.paneMemory[this.listClasses[list].name] ?? {};
      if(this.navigation[`#${hash}`])
        console.warn(`#${hash} is already used as a navigation link, overwriting this data:`, this.navigation[`#${hash}`]);
      this.navigation[`#${hash}`] = {list};
    }
    else
    {
      console.error(`Navigation link (${label}, ${hash}) must specify list.`);
      return false;
    }
    if(isDefault)
    {
      if(this.navigation[''])
        console.warn(`Default navigation link is already set, overwriting this data:`, this.navigation['']);
      this.navigation[''] = this.navigation[`#${hash}`];
    }
    this.navigation[`#${hash}`].element = this.elements['nav'].insertBefore(document.createElement("li"), tempNav.length ? tempNav[tempNav.length-1].element.nextSibling : this.elements['nav'].firstChild);
    this.navigation[`#${hash}`].element.classList.add("nav-item");
    let link = this.navigation[`#${hash}`].element.appendChild(document.createElement("a"));
    link.classList.add("nav-link");
    link.classList.add("pane-select");
    link.href = `#${hash}`;
    link.innerHTML = label;
  }
  
  get lists()
  {
    return this.data?.[this.settings.server] ?? {};
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
    this.view({pane:this.currentView});
    console.log(`Switching to account '${this.settings.server}'.`);
    return true;
  }
  
  get controllers()
  {
    return Renderer.controllers;
  }
  
  paneFromHash(hash)
  {
    if(this.navigation[hash ?? location.hash])
      return this.navigation[hash ?? location.hash].list;
    else if(this.navigation[''])
      return this.navigation[''].list;
    else
    {
      console.error(`Navigation has not been set up.`);
      return "";
    }
  }
  
  async view({hash,pane}={})
  {
    pane = pane ?? this.paneFromHash(hash);
    if(this.lists[pane])
    {
      await this.lists[pane].render();
      this.stickyElements = document.querySelectorAll(".sticky-js");
      window.scrollTo({left:0, top:this.settings.paneMemory[pane]?.scrollY ?? 0, behavior:"instant"});
      this.currentView = pane;
    }
    for(let l in this.lists)
    {
      if(l == pane)
        this.elements[l].classList.add("current-view");
      else
        this.elements[l].classList.remove("current-view");
    }
  }
  
  onScroll(event)
  {
    for(let element of this.stickyElements)
    {
      element.style.top = window.scrollY+"px";
    }
  }
  
  saveScrollX(px)
  {
    if(this.settings.paneMemory[this.currentView])
      this.settings.paneMemory[this.currentView].scrollX = px;
    //console.log(this.settings.paneMemory[this.currentView].scrollX, this.settings.paneMemory[this.currentView].scrollY);
  }
  
  saveScrollY(px)
  {
    if(this.settings.paneMemory[this.currentView])
      this.settings.paneMemory[this.currentView].scrollY = px;
    //console.log(this.settings.paneMemory[this.currentView].scrollX, this.settings.paneMemory[this.currentView].scrollY);
  }
  
  load(data, options={})
  {
    // Check for valid JSON.
    if(typeof(data) != "object")
    {
      try
      {
        data = JSON.parse(data);
        console.log(`Loaded JSON data:`, data);
      }
      catch
      {
        this.elements.loadError.classList.remove("d-none");
        this.elements.loadError.innerHTML = "Your input did not contain valid JSON.";
        this.errors = true;
        return false;
      }
    }
    return this.postLoad(data, options);
  }
  
  postLoad(data, options)
  {
    this.queueStore();
    bootstrap.Modal.getOrCreateInstance(this.elements.loadModal).hide();
    this.elements.loadError.classList.add("d-none");
    this.view({pane:this.currentView});
    return true;
  }
  
  fromJSON(data, {merge=false}={})
  {
    let hasData = false;
    if(data.__class__ != this.constructor.name)
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
  
  settingsFromJSON(json)
  {
    try
    {
      let settings = JSON.parse(json);
      if(settings)
      {
        for(let s in this.settings)
          if(s in settings)
            this.settings[s] = settings[s];
        for(let s in settings)
          this.settings[s] = settings[s];
        console.log("Loaded settings from local storage.", this.settings);
      }
      else
      {
        console.log("No settings to load.");
      }
    }
    catch(x)
    {
      console.error("Could not load stored settings.", x);
      this.errors = true;
    }
  }
  
  queueStore()
  {
    if(this.storeTimeout)
      clearTimeout(this.storeTimeout);
    this.storeTimeout = setTimeout(() => {
      this.store();
    }, 200);
  }
  
  store()
  {
    if(this.errors)
    {
      console.warn(`Prevented saving of local data due to errors being detected during load, in order to prevent saved data corruption. You must reload the page to clear this. If the problem persist, you may have to report a bug to the developer here: https://github.com/kree-nickm/genshin-manager/issues`);
      return false;
    }
    
    this.settings.server = this.settings.server ?? Object.keys(this.data ?? {})[0] ?? "";
    if(!this.data)
      this.data = {};
    this.data[this.settings.server] = this.lists;
    window.localStorage.setItem(`${this.constructor.name}Data`, JSON.stringify(this.data));
    window.localStorage.setItem(`${this.constructor.name}Settings`, JSON.stringify(this.settings));
    console.log(`Local data saved.`);
  }
  
  retrieve()
  {
    let data;
    try
    {
      data = JSON.parse(window.localStorage.getItem(`${this.constructor.name}Data`) ?? "null");
      if(data)
      {
        for(let srv in data)
        {
          if(!this.data[srv])
            this.data[srv] = {};
          this.settings.server = srv;
          for(let list in this.listClasses)
            this.data[srv][list] = this.listClasses[list].fromJSON(data[srv][list] ?? {}, {viewer:this});
          for(let list in data[srv])
            if(!this.listClasses[list])
              console.warn(`Stored data contained unregistered list class: ${list}`, {registeredLists: this.listClasses});
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
    this.settingsFromJSON(window.localStorage.getItem(`${this.constructor.name}Settings`));
    this.settings.server = this.settings.server ?? Object.keys(this.data ?? {})[0] ?? "";
    
    this.activateAccount(this.settings.server)
    
    if(this.currentView)
      this.view({pane:this.currentView});
  }
}