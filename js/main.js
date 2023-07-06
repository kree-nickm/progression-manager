import GenshinManager from "./GenshinManager.js";

// Initialize.
if(typeof(Storage) !== "undefined")
  console.log("Web Storage enabled.");
else
  console.error("Your browser does not support Web Storage, and therefore we cannot save your data between sessions (data is too large for standard cookies).");

/************************
* Setup Event Listeners *
************************/

// Track viewport scroll for tab changes.
document.addEventListener("scroll", event => window.viewer.onScroll(event));
document.addEventListener("scrollend", event => window.viewer.saveScrollY(window.scrollY));

// Set up JSON loader.
document.getElementById("loadModal").addEventListener("show.bs.modal", showEvent => {
  document.getElementById("loadGOODTab").dispatchEvent(new Event("click"));
  
  let selectElem = document.getElementById("loadAccount");
  selectElem.replaceChildren();
  selectElem.add((()=>{let e=document.createElement("option");e.value="";e.text="Create New...";return e;})());
  for(let what in window.viewer.data)
    selectElem.add((()=>{let e=document.createElement("option");e.value=what;e.text=what;return e;})());
  selectElem.selectedIndex = Array.from(selectElem.options).findIndex(elem => elem.value == window.viewer.settings.account);
  selectElem.dispatchEvent(new Event("change"));
  
  let selectElem2 = document.getElementById("loadServer");
  if(window.viewer.settings.server)
    selectElem2.selectedIndex = Array.from(selectElem2.options).findIndex(elem => elem.value == window.viewer.settings.server);
  else
    selectElem2.selectedIndex = 0;
  selectElem2.dispatchEvent(new Event("change"));
});

document.getElementById("loadAccount").addEventListener("change", changeEvent => {
  if(changeEvent.target.value)
    document.getElementById("loadAccountNew").classList.add("d-none");
  else
    document.getElementById("loadAccountNew").classList.remove("d-none");
});

document.getElementById("loadGOODFile").addEventListener("change", changeEvent => {
  let reader = new FileReader();
  reader.addEventListener("load", loadEvent => {
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
  });
  reader.readAsText(changeEvent.target.files[0]);
});

document.getElementById("loadAllFile").addEventListener("change", changeEvent => {
  let reader = new FileReader();
  reader.addEventListener("load", loadEvent => {
    window.viewer.load(loadEvent.target.result);
    changeEvent.target.value = "";
  });
  reader.readAsText(changeEvent.target.files[0]);
});

document.getElementById("loadPastebinBtn").addEventListener("click", async clickEvent => {
  let input = document.getElementById("loadPastebinCode");
  if(input.value)
  {
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
  }
  else
  {
    document.getElementById("loadError").innerHTML = "Pastebin code cannot be blank.";
    document.getElementById("loadError").classList.remove("d-none");
  }
});

/*document.getElementById("loadGOODBtn").addEventListener("click", event => {
  let selectedAccount = document.getElementById("loadAccount").value;
  if(!selectedAccount)
    selectedAccount = document.getElementById("loadAccountNew").value;
  let textArea = document.getElementById("loadGOODJSON");
  window.viewer.load(textArea.value, {account: selectedAccount, server: document.getElementById("loadServer").value});
  textArea.value = "";
});*/

// Set up account editor.
document.getElementById("editModal").addEventListener("show.bs.modal", showEvent => {
  let selectElem = document.getElementById("editAccount");
  selectElem.replaceChildren();
  selectElem.add((()=>{let e=document.createElement("option");e.value="";e.text="Create New...";return e;})());
  for(let what in window.viewer.data)
    selectElem.add((()=>{let e=document.createElement("option");e.value=what;e.text=what;return e;})());
  selectElem.selectedIndex = Array.from(selectElem.options).findIndex(elem => elem.value == window.viewer.settings.account);
  selectElem.dispatchEvent(new Event("change"));
  
  let selectElem2 = document.getElementById("editServer");
  if(window.viewer.settings.server)
    selectElem2.selectedIndex = Array.from(selectElem2.options).findIndex(elem => elem.value == window.viewer.settings.server);
  else
    selectElem2.selectedIndex = 0;
  selectElem2.dispatchEvent(new Event("change"));
});

document.getElementById("editAccount").addEventListener("change", changeEvent => {
  if(changeEvent.target.value)
    document.getElementById("editAccountNew").classList.add("d-none");
  else
    document.getElementById("editAccountNew").classList.remove("d-none");
});

document.getElementById("editDoneBtn").addEventListener("click", clickEvent => {
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

document.getElementById("saveGOODBtn").addEventListener("click", event => {
  saveTemplateAsFile("GenshinData.GOOD.json", window.viewer.toGOOD());
});

document.getElementById("saveAllBtn").addEventListener("click", event => {
  saveTemplateAsFile("GenshinData.json", window.viewer);
});

document.getElementById("savePastebinBtn").addEventListener("click", async event => {
  event.target.disabled = true;
  setTimeout(() => event.target.disabled = false, 60000);
  let msg = document.getElementById("saveMessage");
  msg.classList.remove("d-none");
  msg.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Uploading...`;
  let response = await window.viewer.saveToPastebin();
  if(response)
  {
    msg.innerHTML = `Saved to <a href="https://pastebin.com/${response}" target="_blank">Pastebin</a> successfully.<br/><b>Code: <tt>${response}</tt></b><br/>Data will be available for 24 hours.`;
  }
  else
  {
    msg.innerHTML = `An error occured trying to upload data to Pastebin. Check the JavaScript console (F12) for more information.`;
  }
});

// Setup "new user" popup.
document.getElementById("newLoadBtn").addEventListener("click", event => {
  bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).hide();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("loadModal")).show();
});

document.getElementById("newFreshBtn").addEventListener("click", event => {
  bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).hide();
  bootstrap.Modal.getOrCreateInstance(document.getElementById("editModal")).show();
});

/************************
* Begin the Application *
************************/

window.viewer = new GenshinManager();
window.viewer.retrieve();
setInterval(window.viewer.today.bind(window.viewer), 60000);

// Set up nav.
let navClicked = false;
let navLinks = document.querySelectorAll(".nav-link[href]");
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
    {
      if(event.target.hash == "#materials")
        window.viewer.view("MaterialList");
      else if(event.target.hash == "#weapons")
        window.viewer.view("WeaponList");
      else if(event.target.hash == "#artifacts")
        window.viewer.view("ArtifactList");
      else if(event.target.hash == "#furnitureSets")
        window.viewer.view("FurnitureSetList");
      else if(event.target.hash == "#furniture")
        window.viewer.view("FurnitureList");
      else
        window.viewer.view("CharacterList");
    }
    else
    {
      bootstrap.Modal.getOrCreateInstance(document.getElementById("newModal")).show();
    }
  });
  if(navLinks[i].hash == location.hash)
  {
    navLinks[i].click();
    navClicked = true;
  }
}
if(!navClicked)
  navLinks[0].click();
