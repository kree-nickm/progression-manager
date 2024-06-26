async function addEventListeners()
{
  // Track viewport scroll for tab changes.
  document.addEventListener("scroll", event => window.viewer.onScroll(event));
  document.addEventListener("scrollend", event => window.viewer.saveScrollY(window.scrollY));

  // Set up JSON loader.
  document.getElementById("loadModal")?.addEventListener("show.bs.modal", showEvent => {
    document.getElementById("loadGOODTab").dispatchEvent(new Event("click"));
    document.getElementById("loadHoyos").classList.add("d-none");
    document.getElementById("loadError").classList.add("d-none");
    
    let selectElem = document.getElementById("loadAccount");
    selectElem.replaceChildren();
    selectElem.add((()=>{let e=document.createElement("option");e.value="";e.text="Create New...";return e;})());
    for(let acc in window.viewer.data)
      if(acc)
        selectElem.add((()=>{let e=document.createElement("option");e.value=acc;e.text=acc;return e;})());
    selectElem.selectedIndex = Array.from(selectElem.options).findIndex(elem => elem.value == window.viewer.settings.account);
    selectElem.dispatchEvent(new Event("change"));
    
    let selectElem2 = document.getElementById("loadServer");
    if(window.viewer.settings.server)
      selectElem2.selectedIndex = Array.from(selectElem2.options).findIndex(elem => elem.value == window.viewer.settings.server);
    else
      selectElem2.selectedIndex = 0;
    selectElem2.dispatchEvent(new Event("change"));
  });

  document.getElementById("loadAccount")?.addEventListener("change", changeEvent => {
    if(changeEvent.target.value)
    {
      document.getElementById("loadAccountNew").classList.add("d-none");
      document.getElementById("loadAccountNote").classList.remove("d-none");
    }
    else
    {
      document.getElementById("loadAccountNew").classList.remove("d-none");
      document.getElementById("loadAccountNote").classList.add("d-none");
    }
    if(changeEvent.target.options.length > 1)
      changeEvent.target.classList.remove("d-none");
    else
      changeEvent.target.classList.add("d-none");
  });

  document.getElementById("loadGOODFile")?.addEventListener("change", changeEvent => {
    document.getElementById("loadError").classList.add("d-none");
    let reader = new FileReader();
    // TODO: This doesn't seem to be working here even though it works in loadAllFile...
    let msg = document.getElementById("loadMessage");
    msg.classList.remove("d-none");
    msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Importing...`;
    reader.addEventListener("load", async loadEvent => {
      let selectedAccount = document.getElementById("loadAccount").value;
      if(!selectedAccount)
        selectedAccount = document.getElementById("loadAccountNew").value;
      if(selectedAccount)
      {
        window.viewer.load(loadEvent.target.result, {account: selectedAccount, server: document.getElementById("loadServer").value});
        changeEvent.target.value = "";
      }
      else
      {
        document.getElementById("loadError").innerHTML = "Account field cannot be blank.";
        document.getElementById("loadError").classList.remove("d-none");
      }
      msg.classList.add("d-none");
    });
    reader.readAsText(changeEvent.target.files[0]);
  });

  document.getElementById("loadAllFile")?.addEventListener("change", changeEvent => {
    document.getElementById("loadError").classList.add("d-none");
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

  document.getElementById("loadPastebinBtn")?.addEventListener("click", async clickEvent => {
    document.getElementById("loadError").classList.add("d-none");
    let input = document.getElementById("loadPastebinCode");
    if(input.value)
    {
      let msg = document.getElementById("loadMessage");
      msg.classList.remove("d-none");
      msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Importing...`;
      let response = await fetch("https://corsproxy.io/?https://pastebin.com/raw/"+input.value, {
        method: "GET",
      });
      let json = await response.json();
      if(json.format == "GOOD")
      {
        let selectedAccount = document.getElementById("loadAccount").value;
        if(!selectedAccount)
          selectedAccount = document.getElementById("loadAccountNew").value;
        if(selectedAccount)
        {
          window.viewer.load(json, {account: selectedAccount, server: document.getElementById("loadServer").value});
          input.value = "";
        }
        else
        {
          document.getElementById("loadError").innerHTML = "Account field cannot be blank.";
          document.getElementById("loadError").classList.remove("d-none");
        }
      }
      else
      {
        document.getElementById("loadError").innerHTML = "Code does not match a Pastebin post with valid GOOD data.";
        document.getElementById("loadError").classList.remove("d-none");
        console.error(`Code does not match a Pastebin post with valid GOOD data.`, json);
      }
      msg.classList.add("d-none");
    }
    else
    {
      document.getElementById("loadError").innerHTML = "Pastebin code cannot be blank.";
      document.getElementById("loadError").classList.remove("d-none");
    }
  });

  document.getElementById("loadEnkaBtn")?.addEventListener("click", async clickEvent => {
    document.getElementById("loadError").classList.add("d-none");
    let selectedAccount = document.getElementById("loadAccount").value;
    if(!selectedAccount)
      selectedAccount = document.getElementById("loadAccountNew").value;
    if(!selectedAccount)
    {
      document.getElementById("loadError").innerHTML = "Account field cannot be blank.";
      document.getElementById("loadError").classList.remove("d-none");
      return;
    }
    
    let input = document.getElementById("loadEnka");
    if(!input.value)
    {
      document.getElementById("loadError").innerHTML = "Enka field cannot be blank.";
      document.getElementById("loadError").classList.remove("d-none");
      return;
    }
    
    let msg = document.getElementById("loadMessage");
    msg.classList.remove("d-none");
    msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Importing...`;
    const {default:EnkaQuery} = await import("./genshin/EnkaQuery.js");
    let query = new EnkaQuery(input.value);
    let type = await query.request();
    if(type == "builds" || type == "showcase")
    {
      window.viewer.load({
        format: "GOOD",
        source: "Genshin Manager/EnkaQuery",
        version: 2,
        characters: query.characterData,
        artifacts: query.artifactData,
        weapons: query.weaponData,
      }, {account: selectedAccount, server: document.getElementById("loadServer").value});
      input.value = "";
    }
    else if(type == "hoyos")
    {
      let hoyosElement = document.getElementById("loadHoyos");
      hoyosElement.classList.remove("d-none");
      hoyosElement.replaceChildren();
      if(query.hoyos.length)
      {
        let hoyoCaption = hoyosElement.appendChild(document.createElement("b"));
        //hoyoCaption.classList.add("");
        hoyoCaption.innerHTML = `Select account from Enka (${input.value}):`;
        for(let hoyo of query.hoyos)
        {
          let hoyoElem = hoyosElement.appendChild(document.createElement("div"));
          hoyoElem.classList.add("row", "choose-hoyo");
          let hoyoRegion = hoyoElem.appendChild(document.createElement("div"));
          hoyoRegion.classList.add("col-1");
          hoyoRegion.innerHTML = hoyo.region ?? "";
          let hoyoUID = hoyoElem.appendChild(document.createElement("div"));
          hoyoUID.classList.add("col-3");
          hoyoUID.innerHTML = hoyo.uid ?? "UID hidden";
          let hoyoNick = hoyoElem.appendChild(document.createElement("div"));
          hoyoNick.classList.add("col-4");
          hoyoNick.innerHTML = hoyo.nickname ?? "Nickname hidden";
          let hoyoAR = hoyoElem.appendChild(document.createElement("div"));
          hoyoAR.classList.add("col-2");
          hoyoAR.innerHTML = "AR"+hoyo.ar;
          let hoyoWL = hoyoElem.appendChild(document.createElement("div"));
          hoyoWL.classList.add("col-2");
          hoyoWL.innerHTML = "WL"+hoyo.worldLevel;
          let hoyoSig = hoyoElem.appendChild(document.createElement("div"));
          hoyoSig.classList.add("col-12");
          hoyoSig.innerHTML = hoyo.signature;
          hoyoElem.addEventListener("click", async event => {
            let msg = document.getElementById("loadMessage");
            msg.classList.remove("d-none");
            msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Importing...`;
            query.selectHoyo(hoyo.hash);
            let type = await query.request();
            if(type == "builds")
            {
              window.viewer.load({
                format: "GOOD",
                source: "Genshin Manager/EnkaQuery",
                version: 2,
                characters: query.characterData,
                artifacts: query.artifactData,
                weapons: query.weaponData,
              }, {account: selectedAccount, server: document.getElementById("loadServer").value});
              input.value = "";
            }
            msg.classList.add("d-none");
          });
        }
      }
      else
      {
        let hoyoCaption = hoyosElement.appendChild(document.createElement("b"));
        //hoyoCaption.classList.add("");
        hoyoCaption.innerHTML = `That username has no valid, public, Genshin Impact accounts listed on Enka.network.`;
      }
      input.value = "";
    }
    else
    {
      document.getElementById("loadError").innerHTML = "Failed to fetch data from Enka.network. Ensure that your characters are loaded into <a href='https://enka.network/' target='_blank'>Enka.network</a> when you search for your UID.";
      document.getElementById("loadError").classList.remove("d-none");
      console.error(`Failed to fetch data from Enka.network.`, {input:input.value});
    }
    msg.classList.add("d-none");
  });

  /*document.getElementById("loadGOODBtn")?.addEventListener("click", event => {
    document.getElementById("loadError").classList.add("d-none");
    let selectedAccount = document.getElementById("loadAccount").value;
    if(!selectedAccount)
      selectedAccount = document.getElementById("loadAccountNew").value;
    let textArea = document.getElementById("loadGOODJSON");
    window.viewer.load(textArea.value, {account: selectedAccount, server: document.getElementById("loadServer").value});
    textArea.value = "";
  });*/

  // Set up account editor.
  document.getElementById("editModal")?.addEventListener("show.bs.modal", showEvent => {
    let selectElem = document.getElementById("editAccount");
    selectElem.replaceChildren();
    selectElem.add((()=>{let e=document.createElement("option");e.value="";e.text="Create New...";return e;})());
    for(let acc in window.viewer.data)
      if(acc)
        selectElem.add((()=>{let e=document.createElement("option");e.value=acc;e.text=acc;return e;})());
    selectElem.selectedIndex = Array.from(selectElem.options).findIndex(elem => elem.value == window.viewer.settings.account);
    selectElem.dispatchEvent(new Event("change"));
    
    let selectElem2 = document.getElementById("editServer");
    if(window.viewer.settings.server)
      selectElem2.selectedIndex = Array.from(selectElem2.options).findIndex(elem => elem.value == window.viewer.settings.server);
    else
      selectElem2.selectedIndex = 0;
    selectElem2.dispatchEvent(new Event("change"));
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
      if(window.viewer.switchAccount(selectedAccount, document.getElementById("editServer").value))
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

  document.getElementById("saveGOODBtn")?.addEventListener("click", event => {
    saveTemplateAsFile("GenshinData.GOOD.json", window.viewer.toGOOD());
  });

  document.getElementById("saveAllBtn")?.addEventListener("click", event => {
    saveTemplateAsFile("GenshinData.json", window.viewer);
  });

  document.getElementById("savePastebinBtn")?.addEventListener("click", async event => {
    event.target.disabled = true;
    setTimeout(() => event.target.disabled = false, 60000);
    let msg = document.getElementById("saveMessage");
    msg.classList.remove("d-none");
    msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Uploading...`;
    let response = await window.viewer.saveToPastebin();
    if(response)
    {
      msg.innerHTML = `Saved to <a href="https://pastebin.com/${response}" target="_blank">Pastebin</a> successfully.<br/><b>Code: <tt>${response}</tt></b><br/>Data will be available for 1 week.`;
    }
    else
    {
      msg.innerHTML = `An error occured trying to upload data to Pastebin. Check the JavaScript console (F12) for more information.`;
    }
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
  const {default:GenshinManager} = await import("./GenshinManager.js");
  window.viewer = new GenshinManager();
  window.viewer.retrieve();
  setInterval(window.viewer.today.bind(window.viewer), 60000);

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
      if(window.viewer.settings.account && window.viewer.settings.server)
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

  // TODO: Back/forward browser buttons don't work.

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
