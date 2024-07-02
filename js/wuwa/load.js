async function addEventListeners()
{
  // Track viewport scroll for tab changes.
  document.addEventListener("scroll", event => window.viewer.onScroll(event));
  document.addEventListener("scrollend", event => window.viewer.saveScrollY(window.scrollY));

  // Set up JSON loader.
  document.getElementById("loadModal")?.addEventListener("show.bs.modal", showEvent => {
    document.getElementById("loadAllTab").dispatchEvent(new Event("click"));
  });

  document.getElementById("loadAllFile")?.addEventListener("change", changeEvent => {
    let reader = new FileReader();
    let msg = document.getElementById("loadMessage");
    msg.classList.remove("d-none");
    msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Importing...`;
    reader.addEventListener("load", async loadEvent => {
      window.viewer.load(loadEvent.target.result);
      changeEvent.target.value = "";
      msg.classList.add("d-none");
    });
    reader.readAsText(changeEvent.target.files[0]);
  });

  // Set up account editor.
  document.getElementById("editModal")?.addEventListener("show.bs.modal", showEvent => {
    let selectElem = document.getElementById("editAccount");
    selectElem.replaceChildren();
    selectElem.add((()=>{let e=document.createElement("option");e.value="";e.text="Create New...";return e;})());
    for(let acc in window.viewer.accounts)
      if(acc)
        selectElem.add((()=>{let e=document.createElement("option");e.value=acc;e.text=acc;return e;})());
    selectElem.selectedIndex = Array.from(selectElem.options).findIndex(elem => elem.value == window.viewer.settings.server);
    selectElem.dispatchEvent(new Event("change"));
  });

  document.getElementById("editAccount")?.addEventListener("change", changeEvent => {
    if(changeEvent.target.value)
      document.getElementById("editAccountNew").classList.add("d-none");
    else
      document.getElementById("editAccountNew").classList.remove("d-none");
    if(changeEvent.target.options.length > 1)
      changeEvent.target.classList.remove("d-none");
    else
      changeEvent.target.classList.add("d-none");
  });

  document.getElementById("editDoneBtn")?.addEventListener("click", clickEvent => {
    let selectedAccount = document.getElementById("editAccount").value;
    if(!selectedAccount)
      selectedAccount = document.getElementById("editAccountNew").value;
    if(selectedAccount)
    {
      if(window.viewer.switchAccount(selectedAccount))
      {
        bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal")).hide();
        document.getElementById("editError").classList.add("d-none");
      }
    }
    else
    {
      document.getElementById("editError").innerHTML = "Account field cannot be blank.";
      document.getElementById("editError").classList.remove("d-none");
    }
  });

  // Set up JSON saver.
  const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");
    
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    
    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    
    link.dispatchEvent(evt);
    link.remove()
  };

  document.getElementById("saveAllBtn")?.addEventListener("click", event => {
    saveTemplateAsFile("GenshinData.json", window.viewer);
  });

  // Setup "new user" popup.
  document.getElementById("newLoadBtn")?.addEventListener("click", event => {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).hide();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("loadModal")).show();
  });

  document.getElementById("newFreshBtn")?.addEventListener("click", event => {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).hide();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal")).show();
  });

  // Setup prefs popup
  document.getElementById("prefsDoneBtn")?.addEventListener("click", clickEvent => {
    for(let prefElem of document.getElementsByClassName("preference-select"))
    {
      if(prefElem.type == "radio")
      {
        if(prefElem.checked)
          window.viewer.settings.preferences[prefElem.attributes.getNamedItem('name').value] = prefElem.value;
      }
      else if(prefElem.type == "checkbox")
      {
        window.viewer.settings.preferences[prefElem.attributes.getNamedItem('name').value] = prefElem.checked;
      }
      else if(prefElem.type == "number")
      {
        window.viewer.settings.preferences[prefElem.attributes.getNamedItem('name').value] = prefElem.value;
      }
    }
    for(let list in window.viewer.listClasses)
      if(window.viewer.lists[list])
      {
        window.viewer.lists[list].forceNextRender = true;
        window.viewer.lists[list].subsets = {};
      }
    window.viewer.view({pane:window.viewer.currentView});
    window.viewer.queueStore();
  });

  document.getElementById("prefsModal")?.addEventListener("show.bs.modal", showEvent => {
    for(let pref in window.viewer.settings.preferences)
    {
      for(let prefElem of showEvent.target.querySelectorAll(`.preference-select[name="${pref}"]`))
      {
        if(prefElem.type == "radio" || prefElem.type == "checkbox")
        {
          if(prefElem.value == window.viewer.settings.preferences[pref])
            prefElem.checked = true;
          else
            prefElem.checked = false;
        }
        else if(prefElem.type == "number")
        {
          prefElem.value = window.viewer.settings.preferences[pref];
        }
      }
    }
  });
}

async function init()
{
  const {default:WuWaManager} = await import("./WuWaManager.js");
  window.viewer = new WuWaManager();
  window.viewer.retrieve();

  // Set up nav.
  let navClicked = false;
  let navLinks = document.querySelectorAll(".pane-select");
  for(let i=0; i<navLinks.length; i++)
  {
    navLinks[i].addEventListener("click", event => {
      for(let k=0; k<navLinks.length; k++)
      {
        if(event.target == navLinks[k])
          navLinks[k].classList.add("active");
        else
          navLinks[k].classList.remove("active");
      }
      // Do a check to see if this is the user's first visit.
      if(window.viewer.settings.server)
        window.viewer.view({hash:navLinks[i].hash});
      else
        bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).show();
    });
    if(navLinks[i].hash == location.hash)
    {
      navLinks[i].click();
      navClicked = true;
    }
  }
  if(!navClicked)
    navLinks[0].click();

  if(location.search.at(0) == "?")
  {
    let params = location.search.slice(1).split("&").reduce((result,param) => {
      let p = param.split("=");
      result[p[0]] = p[1] ?? true;
      return result;
    }, {});
    /*if(params.pb)
    {
      document.getElementById("loadPastebinCode").value = params.pb;
      document.getElementById("loadPastebinBtn").dispatchEvent(new Event("click"));
      bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).hide();
      bootstrap.Modal.getOrCreateInstance(document.getElementById("loadModal")).show();
      //history.replaceState({}, "", location.pathname + location.hash);
    }*/
  }
}

export { addEventListeners, init };
