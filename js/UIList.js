import { Renderer } from "./Renderer.js";
import UIController from "./UIController.js";
import UIItem from "./UIItem.js";
import ListDisplayManager from "./ListDisplayManager.js";

export default class UIList extends UIController {
  static dontSerialize = UIController.dontSerialize.concat(["viewer","display","subsets","forceNextRender"]);
  static unique = false;
  static itemClass = UIItem;
  static subsetDefinitions = {};
  
  static fromJSON(data, {viewer, addProperties={}}={})
  {
    let list = new this(viewer);
    list.startImport("GenshinManager");
    for(let prop in addProperties)
      list[prop] = addProperties[prop];
    //if(this.name == "CharacterList") console.log(`Constructed CharacterList:`, list, list.list.length);
    for(let prop in list)
    {
      if(this.dontSerialize.indexOf(prop) == -1 && data[prop] !== undefined)
      {
        //console.log(`Handling property ${prop}...`);
        if(prop == "list")
        {
          for(let elem of data[prop])
          {
            let itemClass = (Array.isArray(this.itemClass) ? this.itemClass : [this.itemClass]).find(v => v.name == elem.__class__);
            if(itemClass)
            {
              let item = itemClass.fromJSON(elem, {addProperties:{list}, postLoad:false});
              //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Constructed Traveler:`, item);
              if(this.unique)
              {
                let existing = list.get(item.getUnique());
                if(existing)
                {
                  //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Existing Traveler:`, existing);
                  for(let itemProp in item)
                    if(item.constructor.dontSerialize.indexOf(itemProp) == -1 && item[itemProp] !== undefined)
                      existing.update(itemProp, item[itemProp], "replace");
                  //if(this.name == "CharacterList" && item.constructor.name == "Traveler") console.log(`Updated Traveler:`, existing);
                  item.unlink();
                }
                else
                {
                  item.afterLoad();
                  list.update(prop, item, "push");
                }
              }
              else
              {
                item.afterLoad();
                list.update(prop, item, "push");
              }
            }
            else
            {
              console.error(`Tried to add an item of invalid class '${elem.__class__}' to new '${this.name}' list ; only accepts class(es):`, this.itemClass);
            }
          }
        }
        else
          list.update(prop, data[prop], "replace");
      }
    }
    list.finishImport();
    return list;
  }
  
  viewer;
  display;
  subsets = {};
  forceNextRender = true;
  list = [];
  
  constructor(viewer)
  {
    super();
    this.viewer = viewer;
    this.display = new ListDisplayManager(this);
    this.initialize();
    this.setupDisplay();
  }
  
  initialize(){}
  
  setupDisplay(){}
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "list" && (field.value.length != value.length || options.force))
    {
      // TODO: Theoretically we can check the elements that were added/removed and only clear the subsets that would include them.
      this.subsets = {};
    }
  }
  
  getUnique(item)
  {
    return (this.constructor.unique ? this.getHash(item) : item.uuid) ?? this.getHash(item);
  }
  
  getHash(item)
  {
    let json = JSON.stringify(item);
    let hash = 0, i, chr;
    if(json.length === 0)
      return hash;
    for(i=0; i<json.length; i++)
    {
      chr = json.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  
  get(unique)
  {
    return this.list.find(item => unique === this.getUnique(item));
  }
  
  items(a, b)
  {
    let func, subset;
    if(typeof(a) == "function")
    {
      func = a;
      subset = b;
    }
    else
    {
      subset = a;
      if(typeof(b) == "function")
        func = b;
    }
    
    if(subset)
    {
      if(!this.subsets[subset])
      {
        if(func)
          this.subsets[subset] = this.list.filter(func);
        else if(this.constructor.subsetDefinitions[subset])
          this.subsets[subset] = this.list.filter(this.constructor.subsetDefinitions[subset]);
        else
        {
          console.warn(`Unknown subset '${subset}' given for ${this.constructor.name}.items() with no function.`);
          console.trace();
          return this.list.slice();
        }
      }
      return this.subsets[subset].slice();
    }
    else if(func)
      return this.list.filter(func).slice();
    else
      return this.list.slice();
  }
  
  createItem(data={})
  {
    // TODO: itemClass can be an array if the UIList supports multiple UIItem subclasses. At the moment, those are handled by custom code within the UIList subclass, but it could probably be done here.
    let item = new this.constructor.itemClass();
    item.list = this;
    this.update("list", item, "push");
    // TODO: It might be useful to set a flag on the object here that it is being initialized. Some of the updates below might trigger things that are redundant when the object is mass-setting all of its properties during initialization.
    for(let property in data)
      item.update(property, data[property], "replace");
    return item;
  }
  
  clear()
  {
    this.list.forEach(item => item.unlink());
    this.update("list", [], "replace");
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  prepareRender(element, data, options)
  {
    return {element, data, options};
  }
  
  async render(force=false)
  {
    let {element, data, options} = this.prepareRender(this.viewer.elements[this.constructor.name].querySelector(`.list[data-uuid="${this.uuid}"]`), {
      item: this,
      groups: this.display.getGroups({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}),
      fields: this.display.getFields({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}).map(field => ({field, params:[]})),
    }, {
      template: "renderListAsTable",
      force: force || this.forceNextRender,
      parentElement: this.viewer.elements[this.constructor.name],
    });
    Array.from(this.viewer.elements[this.constructor.name].querySelectorAll(`.list`)).forEach(elem => elem.classList.add("d-none"));
    element?.classList.remove("d-none");
    let render = await Renderer.rerender(element, data, options);
    this.forceNextRender = false;
    
    let footer = document.getElementById("footer");
    let updateFooter = false;
    let ul;
    /*footer.classList.add("d-none");
    if(footer.dataset.list != this.uuid)
    {
      updateFooter = true;
      footer.replaceChildren();
      footer.dataset.list = this.uuid;
      
      let container = footer.appendChild(document.createElement("div"));
      container.classList.add("container-fluid", "navbar-expand");
      
      ul = container.appendChild(document.createElement("ul"));
      ul.classList.add("navbar-nav");
    }*/
    
    return {render, footer, updateFooter, ul};
  }
  
  onRender(element)
  {
    super.onRender(element);
    
    // Add event handlers for collapsing groups.
    element.querySelectorAll(".group-header").forEach(groupElem => {
      if(!groupElem.onclick)
        groupElem.onclick = event => {
          let groupName = groupElem.attributes.getNamedItem('name')?.value ?? "???";
          groupElem.collapsed = !groupElem.collapsed;
          let groupMembers = element.querySelectorAll(`[data-group-name="${groupName}"]`);
          if(groupElem.collapsed)
          {
            groupElem.firstElementChild.innerHTML = "-";
            groupMembers.forEach(member => member.classList.add("group-collapsed"));
          }
          else
          {
            groupElem.firstElementChild.innerHTML = "+ "+ groupName +" +";
            groupMembers.forEach(member => member.classList.remove("group-collapsed"));
          }
        };
    });
    
    // Add event handlers for sorting.
    let sortables = element.querySelectorAll(".sortable");
    sortables.forEach(sortElem => {
      if(!sortElem.onclick)
        sortElem.onclick = event => {
          let fieldName = sortElem.attributes.getNamedItem('name')?.value;
          let field = this.display.getField(fieldName);
          if(field)
          {
            // Determine sort order.
            let order;
            if(sortElem.classList.contains("sorted"))
            {
              sortables.forEach(elem => elem.classList.remove("sorted") & elem.classList.remove("sorted-r"));
              sortElem.classList.add("sorted-r");
              order = -1;
            }
            else
            {
              sortables.forEach(elem => elem.classList.remove("sorted") & elem.classList.remove("sorted-r"));
              sortElem.classList.add("sorted");
              order = 1;
            }
            
            // Sort the items array.
            if(field.sort.func)
              this.list.sort(field.sort.func.bind(this, order));
            else if(field.sort.generic)
              this.list.sort(Renderer.genericSorters[field.sort.generic.type].bind(this, field.sort.generic.property, order));
            else
            {
              console.warn(`No sort algorithm given for field '${fieldName}'.`);
              return;
            }
            // If the list is using a filter, clear the respective subset to force it to rebuild (faster than sorting both).
            if(element.dataset.filter)
              this.subsets[element.dataset.filter] = null;
            // Note: I don't know if we want to sort the base list if it's using a filter, but for now the only use case does want that. In the future maybe add an option for it.
            
            this.update("list", null, "notify", {reason:"sort"});
            // Reorder the HTML elements.
            Renderer.sortItems(element);
          }
          else
            console.error(`Unable to find field '${fieldName}'.`);
        };
    });
  }
}
