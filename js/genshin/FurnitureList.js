const {default:GenshinFurnitureData} = await window.importer.get(`js/genshin/gamedata/GenshinFurnitureData.js`);

const { Renderer } = await window.importer.get(`js/Renderer.js`);
const {default:GenshinList} = await window.importer.get(`js/genshin/GenshinList.js`);
const {default:Furniture} = await window.importer.get(`js/genshin/Furniture.js`);

export default class FurnitureList extends GenshinList
{
  static unique = true;
  static itemClass = Furniture;
  
  initialize()
  {
    super.initialize();
    for(let k in GenshinFurnitureData)
    {
      this.addGOOD({key:k, learned:false, count:0});
    }
  }
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      sort: {generic: {type:"string",property:"name"}},
      dynamic: false,
      value: item => item.name,
    });
    
    let learnedField = this.display.addField("learned", {
      label: "Learned",
      sort: {generic: {type:"boolean",property:"learned"}},
      dynamic: true,
      edit: item => ({
        target: {item:item, field:"learned"},
        type: "checkbox",
        value: item.learned,
        trueClasses: ["fa-solid","fa-scroll"],
        falseClasses: [],
      }),
    });
    
    let countField = this.display.addField("count", {
      label: "Count",
      dynamic: true,
      value: item => item.count,
      edit: item => ({
        target: {item:item, field:"count"},
      }),
    });
    
    Furniture.setupDisplay(this.display);
  }
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("learned", false);
      item.update("count", 0);
    }
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [
      {field:this.display.getField("name"), params:[]},
      {field:this.display.getField("learned"), params:[]},
      {field:this.display.getField("count"), params:[]},
    ];
    return {element, data, options};
  }
}
