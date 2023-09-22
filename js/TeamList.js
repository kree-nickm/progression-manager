import { handlebars, Renderer } from "./Renderer.js";
import GenshinList from "./GenshinList.js";
import Team from "./Team.js";
import Character from "./Character.js";

export default class TeamList extends GenshinList {
  //static dontSerialize = GenshinList.dontSerialize.concat([]);
  static itemClass = Team;
  //static subsetDefinitions = {};
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Name",
      dynamic: true,
      //popup: item => item,
      value: item => item.name,
      edit: item => ({type:"string", target: {item, field:"name"}}),
    });
    
    let memberField = this.display.addField("member", {
      label: (item,num) => `Character`,
      dynamic: true,
      value: (item,num) => {
        if(item.characters[num])
        {
          return item.characters[num].display.getField("icon").get("value", item.characters[num], "sm", 1, 0);
        }
        else
          return "No one.";
      },
      edit: (item,num) => ({
        target: {item, field:["memberKeys",item.characters.length>num?num:item.characters.length]},
        type: "select",
        list: item.list.viewer.lists.CharacterList.items("listable").filter(cha => cha.key==item.memberKeys[num] || item.memberKeys.indexOf(cha.key)==-1),
        valueProperty: "key",
        displayProperty: "name",
      }),
    });
    
    let deleteField = this.display.addField("delete", {
      label: "D",
      dynamic: true,
      button: item => ({
        icon: "fa-solid fa-trash-can",
        action: event => {
          event.stopPropagation();
          item.unlink();
          item.list.viewer.store();
        },
      }),
    });
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [
      {field:this.display.getField("name"), params:[]},
      {field:this.display.getField("member"), params:[0]},
      {field:this.display.getField("member"), params:[1]},
      {field:this.display.getField("member"), params:[2]},
      {field:this.display.getField("member"), params:[3]},
      {field:this.display.getField("delete"), params:[]},
    ];
    return {element, data, options};
  }
  
  async render(force=false)
  {
    await super.render(force);
    
    let footer = document.getElementById("footer");
    footer.classList.remove("d-none");
    if(footer.dataset.list != this.uuid)
    {
      footer.replaceChildren();
      footer.dataset.list = this.uuid;
      
      let container = footer.appendChild(document.createElement("div"));
      container.classList.add("container-fluid", "navbar-expand");
      
      let ul = container.appendChild(document.createElement("ul"));
      ul.classList.add("navbar-nav");
      
      // Add
      let li1 = ul.appendChild(document.createElement("li"));
      li1.classList.add("nav-item", "me-2");
      
      let divAdd = li1.appendChild(document.createElement("div"));
      divAdd.classList.add("input-group");
      
      let btnAdd = divAdd.appendChild(document.createElement("button"));
      btnAdd.innerHTML = "Add Team";
      btnAdd.classList.add("btn", "btn-primary");
      btnAdd.addEventListener("click", async event => {
        let item = this.addGOOD({});
        
        let listElement = this.viewer.elements[this.constructor.name].querySelector(`.list[data-uuid="${this.uuid}"]`);
        let listTargetElement = listElement.querySelector(".list-target");
        if(!listTargetElement)
          listTargetElement = listElement;
        Renderer.rerender(null, {
          item,
          groups: this.display.getGroups({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}),
          fields: this.prepareRender(null, {}, {}).data.fields,
          wrapper: "tr",
          fieldWrapper: "td",
        }, {template:"renderItem", parentElement:listTargetElement});
      });
    }
  }
}
