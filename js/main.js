import GenshinManager from "./GenshinManager.js";

// Initialize.
if(typeof(Storage) !== "undefined")
  console.log("Web Storage enabled.");
else
  console.error("Your browser does not support Web Storage, and therefore we cannot save your data between sessions (data is too large for standard cookies).");

window.viewer = new GenshinManager();
window.viewer.retrieve();
setInterval(window.viewer.today.bind(window.viewer), 60000);

// Set up nav.
let navClicked = false;
let navLinks = document.getElementsByClassName("nav-link");
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
  });
  if(navLinks[i].hash == location.hash)
  {
    navLinks[i].click();
    navClicked = true;
  }
}
if(!navClicked)
  navLinks[0].click();

// Track viewport scroll for tab changes.
document.addEventListener("scroll", window.viewer.onScroll.bind(window.viewer));
document.addEventListener("scrollend", event => window.viewer.saveScrollY(window.scrollY));

// Set up JSON loader.
document.getElementById("loadGOODBtn").addEventListener("click", event => {
  let textArea = document.getElementById("loadGOODJSON");
  window.viewer.load(textArea.value, document.getElementById("loadGOODAccount").value, document.getElementById("loadGOODServer").value);
  textArea.value = "";
});

document.getElementById("loadGOODFile").addEventListener("change", changeEvent => {
  let reader = new FileReader();
  reader.addEventListener("load", loadEvent => {
    window.viewer.load(loadEvent.target.result, document.getElementById("loadGOODAccount").value, document.getElementById("loadGOODServer").value);
    changeEvent.target.value = "";
  });
  reader.readAsText(changeEvent.target.files[0]);
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
