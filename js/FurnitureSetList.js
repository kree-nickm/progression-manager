import { Renderer } from "./Renderer.js";
import UIList from "./UIList.js";
import FurnitureSet from "./FurnitureSet.js";

export default class FurnitureSetList extends UIList
{
  static unique = true;
  static name = "furnitureSets";
  
  setupDisplay()
  {
    let nameField = this.display.addField("name", {
      label: "Set Name",
      dynamic: false,
      value: item => item.name,
    });
    
    let learnedField = this.display.addField("learned", {
      label: "?",
      sort: {generic: {type:"boolean",property:"learned"}},
      dynamic: true,
      title: item => "Is Learned?",
      edit: item => ({
        target: {item:item, field:"learned"},
        type: "checkbox",
        value: item.learned,
        trueClasses: ["fa-solid","fa-scroll"],
        falseClasses: [],
      }),
    });
    
    let recipeField = this.display.addField("recipe", {
      label: "Furniture",
      dynamic: true,
      value: item => item.furniture.map((furniture,i) => {
        return {
          tag: "div",
          value: [
            {
              value: `${furniture.count} / ${item.recipe[i].count}`,
              classes: {
                "quantity": true,
                "insufficient": furniture.count < item.recipe[i].count,
              },
            },
            {
              value: furniture.name,
            },
          ], 
          edit: {target: {item:furniture, field:"count"}},
        };
      }),
      dependencies: item => item.furniture.map(furniture => ({item:furniture, field:"count"})),
    });
    
    let charactersField = this.display.addField("characters", {
      label: "Characters",
      dynamic: true,
      value: item => item.characters.map(c => {
        let character = this.viewer.lists.characters.get(c);
        if(character)
          return {
            tag: "div",
            value: character.name,
            classes: {'not-owned':false},
            edit: item.learned ? {
              target: {item:item, field:"settled"},
              type: "checkbox",
              value: c,
              checked: item.settled.indexOf(c) > -1,
              trueClasses: ["fa-solid","fa-house-circle-check"],
              falseClasses: ["fa-regular","fa-circle-xmark"],
            } : null,
          };
        else
          return {tag:"div", value:c, classes:{'not-owned':true}};
      }),
      dependencies: item => [
        {item:item, field:"learned"},
        {item:item, field:"settled"},
        {item:item.list.viewer.lists.characters, field:"list"},
      ]
    });
  }
  
  createItem(goodData)
  {
    let item = new FurnitureSet();
    item.list = this;
    item.fromGOOD(goodData);
    this.update("list", item, "push");
    return item;
  }
  
  clear()
  {
    for(let item of this.list)
    {
      item.update("learned", false);
      item.update("settled", [], "replace");
    }
  }
  
  async render(force=false)
  {
    await Renderer.renderList2(this.constructor.name, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      container: window.viewer.elements[this.constructor.name],
    });
    this.forceNextRender = false;
  }
}
