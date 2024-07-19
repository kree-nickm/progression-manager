async function addEventListeners()
{
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
}

async function init()
{
  const {default:WuWaManager} = await import("./WuWaManager.js");
  window.viewer = new WuWaManager();
  window.viewer.retrieve();
}

export { addEventListeners, init };
