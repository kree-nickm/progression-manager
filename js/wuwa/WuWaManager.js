const { Renderer } = await window.importer.get(`js/Renderer.js`);

const {default:DataManager} = await window.importer.get(`js/DataManager.js`);
const {default:CharacterList} = await window.importer.get(`js/wuwa/CharacterList.js`);
const {default:WeaponList} = await window.importer.get(`js/wuwa/WeaponList.js`);
const {default:EchoList} = await window.importer.get(`js/wuwa/EchoList.js`);
const {default:MaterialList} = await window.importer.get(`js/wuwa/MaterialList.js`);

export default class WuWaManager extends DataManager
{
  //static dontSerialize = super.dontSerialize.concat([]);
  
  constructor()
  {
    super();
    this.elements['loadModal'] = document.getElementById("loadModal");
    this.elements['loadError'] = document.getElementById("loadError");
    
    this.registerList(MaterialList);
    this.registerList(CharacterList);
    this.registerList(WeaponList);
    this.registerList(EchoList);
    
    this.registerNavItem("Characters", "characters", {listName:"CharacterList", isDefault:true});
    this.registerNavItem("Weapons", "weapons", {listName:"WeaponList"});
    this.registerNavItem("Echoes", "echoes", {listName:"EchoList"});
    this.registerNavItem("Materials", "materials", {listName:"MaterialList"});
  }
  
  postLoad(data, options)
  {
    if("server" in options)
    {
      this.activateAccount(options.server);
    }
    else
    {
      if(!this.fromJSON(data))
      {
        this.elements.loadError.classList.remove("d-none");
        this.elements.loadError.innerHTML = "Your input did not contain valid Manager data.";
        return false;
      }
    }
    return super.postLoad(data, options);
  }
}