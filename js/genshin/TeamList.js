import { handlebars, Renderer } from "../Renderer.js";
import GenshinList from "./GenshinList.js";
import Team from "./Team.js";
import Character from "./Character.js";

export default class TeamList extends GenshinList {
  //static dontSerialize = super.dontSerialize.concat([]);
  static itemClass = Team;
  //static subsetDefinitions = {};
  
  setupDisplay()
  {
    this.display.addField("name", {
      label: "Name",
      sort: {generic: {type:"string",property:"name"}},
      dynamic: true,
      value: item => item.name,
      edit: item => ({
        type: "string",
        ignoreBlank: true,
        target: {item, field:"name"},
      }),
    });
    
    this.display.addField("memberText", {
      label: (item,num) => `Character`,
      dynamic: true,
      value: (item,num) => {
        if(item.characters[num])
          return {
            value: [
              {
                value: item.characters[num].name,
              },
              {
                tag: "i",
                classes: {'fa-solid':true, 'fa-eye':true},
                popup: item.characters[num],
              },
            ],
            classes: {
              "user-field": true,
            },
          };
        else
          return "-";
      },
      edit: (item,num) => ({
        target: {item, field:["memberKeys",item.characters.length>num?num:item.characters.length]},
        type: "select",
        list: item.list.viewer.lists.CharacterList.items("listable").filter(cha => cha.key==item.memberKeys[num] || item.memberKeys.indexOf(cha.key)==-1),
        valueProperty: "key",
        displayProperty: "name",
        value: item.characters[num] ? item.characters[num].name : "-",
      }),
    });
    
    this.display.addField("memberIcon", {
      label: (item,num) => `Character`,
      dynamic: true,
      value: (item,num) => {
        if(item.characters[num])
          return item.characters[num].display.getField("icon").get("value", item.characters[num], "sm", 1, 0);
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
    
    Team.setupDisplay(this.display);
  }
  
  getFooterParams()
  {
    return {
      add: {
        fields: [],
        onAdd: (event, elements, data) => this.addGOOD({}),
      },
    };
  }
  
  prepareRender(element, data, options)
  {
    data.fields = [
      {field:this.display.getField("name"), params:[]},
      {field:this.display.getField("memberText"), params:[0]},
      {field:this.display.getField("memberText"), params:[1]},
      {field:this.display.getField("memberText"), params:[2]},
      {field:this.display.getField("memberText"), params:[3]},
      {field:this.display.getField("deleteBtn"), params:[]},
    ];
    return {element, data, options};
  }
}
