import { handlebars, Renderer } from "./Renderer.js";

window.DEBUGLOG = {
  queueUpdate: false,
  renderItemField: false,
  addFieldEventListeners: false,
  getRelatedItems: false,
  contentToHTML: false,
  sortItems: false,
  StatModifier_create: false,
  
  enableAll: () => { for(let method in window.DEBUGLOG) window.DEBUGLOG[method] = true; },
};

// Initialize.
if(typeof(Storage) !== "undefined")
{
  console.log(`Web Storage enabled.`);
  let game;
  for(let selectBtn of document.querySelectorAll(".select-game"))
  {
    selectBtn.addEventListener("click", async (event) => {
      console.log(`Loading game '${selectBtn.dataset.game}'.`);
      window.localStorage.setItem("game", selectBtn.dataset.game);
      if(window.viewer)
      {
        console.log(`A manager is already loaded. Reloading the page into the new manager to conserve memory.`);
        location.reload();
      }
      else
      {
        document.getElementById("gameIcon").innerHTML = `<img src="img/gameIcons/${selectBtn.dataset.game}.png"/>`;
        const { addEventListeners, init } = await import(`./${selectBtn.dataset.game}/load.js`);
        
        let modalsResp = await fetch(`templates/${selectBtn.dataset.game}/menuModals.html`, {cache:"no-cache"});
        let modalsHTML = await modalsResp.text();
        let modalsTemplate = handlebars.compile(modalsHTML);
        document.getElementById("menuModalContainer").innerHTML = modalsTemplate();
        
        let buttonsResp = await fetch(`templates/${selectBtn.dataset.game}/menuButtons.html`, {cache:"no-cache"});
        let buttonsHTML = await buttonsResp.text();
        let buttonsTemplate = handlebars.compile(buttonsHTML);
        document.getElementById("menuButtonContainer").innerHTML = buttonsTemplate();
        
        await addEventListeners();
        await init();
      }
    });
    if(window.localStorage.getItem("game") == selectBtn.dataset.game)
    {
      game = selectBtn.dataset.game;
      setTimeout(()=>selectBtn.dispatchEvent(new Event("click")), 1);
    }
  }
  if(!game)
  {
    // Make user pick a game.
  }
}
else
{
  document.getElementById('content').innerHTML = "Your browser does not support Web Storage, and therefore we cannot save your data.";
  throw new Exception("Your browser does not support Web Storage, and therefore we cannot save your data.");
}
