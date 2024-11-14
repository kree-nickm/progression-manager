const { handlebars, Renderer } = await import(`./Renderer.js?v=${window.versionId}`);
const {default:UIController} = await import(`./UIController.js?v=${window.versionId}`);
const {default:UIItem} = await import(`./UIItem.js?v=${window.versionId}`);
const {default:ListDisplayManager} = await import(`./ListDisplayManager.js?v=${window.versionId}`);

export default class UIList extends UIController {
  static dontSerialize = super.dontSerialize.concat(["display","subsets","forceNextRender"]);
  static unique = false;
  static itemClass = UIItem;
  static subsetDefinitions = {};
  static templateName = "renderListAsTable";
  static templatePartials = ["renderItemAsRow"];
  
  static fromJSON(data, {viewer, addProperties={}}={})
  {
    let list = new this(viewer);
    for(let prop in addProperties)
      list[prop] = addProperties[prop];
    list.startImport();
    list.initialize();
    for(let prop in list)
    {
      if(this.dontSerialize.indexOf(prop) == -1 && data[prop] !== undefined)
      {
        if(prop == "list")
        {
          for(let elem of data[prop])
          {
            let itemClass = (Array.isArray(this.itemClass) ? this.itemClass : [this.itemClass]).find(v => v.name == elem.__class__);
            if(itemClass)
            {
              let item = itemClass.fromJSON(elem, {addProperties:{list}, postLoad:false});
              if(this.unique)
              {
                let existing = list.get(item.getUnique());
                if(existing)
                {
                  for(let itemProp in item)
                    if(item.constructor.dontSerialize.indexOf(itemProp) == -1 && item[itemProp] !== undefined)
                      existing.update(itemProp, item[itemProp], "replace");
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
  
  list;
  listName = this.constructor.name;
  
  display;
  subsets;
  forceNextRender;
  
  constructor(viewer)
  {
    super();
    //if(!window.productionMode) console.debug(`new ${this.constructor.name}`);
    this.list = [];
    this.viewer = viewer;
    this.display = new ListDisplayManager(this);
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  initialize()
  {
    //if(!window.productionMode) console.debug(`${this.constructor.name}.initialize()`);
    this.setupDisplay();
  }
  
  setupDisplay(){}
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "list")
    {
      if(this.constructor.unique)
      {
        let footerParams = this.getFooterParams();
        if(footerParams?.add)
        {
          if(Array.isArray(footerParams.add))
            footerParams.add = {fields:footerParams.add};
          let itemType = Array.isArray(this.constructor.itemClass) ? this.constructor.itemClass[0].name : this.constructor.itemClass.name;
          for(let fld of footerParams.add.fields)
          {
            // TODO: Doesn't actually update the element until pane is changed.
            let select = document.getElementById(`${fld.property}${itemType}Select`);
            if(select)
              select.needsUpdate = true;
          }
        }
      }
      if(action == "remove" || action == "notify" && options?.toggleOwned && !options.toggleOwned.owned)
      {
        this.subsets = {};
        if(!options.skipHTML)
          Renderer.removeElementsOf(options?.toggleOwned??value, this);
      }
      else if(action == "push" || action == "notify" && options?.toggleOwned && options?.toggleOwned.owned)
      {
        this.subsets = {};
        let listElements = this.viewer.elements[this.listName].querySelectorAll(`.list[data-uuid="${this.uuid}"]`);
        for(let listElement of listElements)
        {
          if(listElement.dataset.filter)
            if(!this.constructor.subsetDefinitions[listElement.dataset.filter](options?.toggleOwned??value))
              continue;
          let listTargetElement = listElement.querySelector(`.list-target[data-uuid="${this.uuid}"]`); // TODO: Nested lists of the same UIList object could make this incorrect, but that's weird, so let's just pretend no one is gonna do that for now.
          if(!listTargetElement)
            listTargetElement = listElement;
          let renderData = this.prepareRender(listElement, {}, {});
          Renderer.rerender(null, {
            item: options?.toggleOwned??value,
            groups: renderData.data.groups,
            fields: renderData.data.fields,
            wrapper: "tr", // TODO: Not all lists use tr/td
            fieldWrapper: "td",
          }, {template:(options?.toggleOwned??value).constructor.listTemplateName, parentElement:listTargetElement});
        }
      }
      else if(action == "replace")
      {
        this.subsets = {};
        this.forceNextRender = true;
      }
    }
    return true;
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
  
  createItem(data={}, {itemClass,skipLoad}={})
  {
    let item;
    if(!this.constructor.unique || !this.get(this.getUnique(data)))
    {
      if(itemClass && Array.isArray(this.constructor.itemClass) && !this.constructor.itemClass.includes(itemClass))
      {
        console.warn(`${itemClass} is not a valid item class for ${this.constructor.name}, must be one of ${this.constructor.itemClass}`);
        itemClass = this.constructor.itemClass[0];
      }
      else
        itemClass = Array.isArray(this.constructor.itemClass) ? this.constructor.itemClass[0] : this.constructor.itemClass;
      item = new itemClass();
      item.list = this;
      this.update("list", item, "push");
    }
    else
    {
      item = this.get(this.getUnique(data));
      console.warn(`Creating item in a unique list when the item is already in it; updating existing item instead.`);
    }
    // TODO: It might be useful to set a flag on the object here that it is being initialized. Some of the updates below might trigger things that are redundant when the object is mass-setting all of its properties during initialization.
    for(let property in data)
      item.update(property, data[property], "replace");
    if(!skipLoad)
      item.afterLoad();
    return item;
  }
  
  clear()
  {
    if(this.constructor.unique)
    {
      this.items().forEach(item => item.update("owned", false));
    }
    else
    {
      this.items().forEach(item => item.unlink({skipList:true}));
      this.update("list", [], "replace");
    }
    this.subsets = {};
    this.forceNextRender = true;
  }
  
  getFooterParams()
  {
    /*
    {
      add: {
        fields: [
          {
            property: "<<property of the UIItem that this input is determining>>",
            options: <<array of objects, each with format {value, label}, which determines the attributes of the HTMLOption elements>>,
            onChange: (elements, event) => {
              // code to run when this HTMLSelect is changed
            }
          },
        ],
        onAdd: (event, elements, data) => { // elements 
          // code to create item
          return <<the added item>>;
        },
      },
    }
    */
    return null;
  }
  
  prepareRender(element, data, options)
  {
    data.fields = this.display.getFields({exclude:field => (field.tags??[]).indexOf("detailsOnly") > -1}).map(field => ({field, params:[]}));
    data.groups = this.display.getGroups({fieldDefs: data.fields});
    return {element, data, options};
  }
  
  async render(force=false)
  {
    let {element, data, options} = this.prepareRender(this.viewer.elements[this.listName].querySelector(`.list[data-uuid="${this.uuid}"]`), {
      item: this,
    }, {
      template: this.constructor.templateName,
      partials: this.constructor.templatePartials,
      force: force || this.forceNextRender,
      parentElement: this.viewer.elements[this.listName],
    });
    Array.from(this.viewer.elements[this.listName].querySelectorAll(`.list`)).forEach(elem => elem.classList.add("d-none"));
    element?.classList.remove("d-none");
    let render = await Renderer.rerender(element, data, options);
    this.forceNextRender = false;
    
    let footer = document.getElementById("footer");
    let updateFooter = false;
    let ul;
    let footerParams = this.getFooterParams();
    if(footerParams)
    {
      let itemType = Array.isArray(this.constructor.itemClass) ? this.constructor.itemClass[0].name : this.constructor.itemClass.name;
      footer.classList.remove("d-none");
      if(footer.dataset.list != this.uuid)
      {
        updateFooter = true;
        footer.replaceChildren();
        footer.dataset.list = this.uuid;
        
        let container = footer.appendChild(document.createElement("div"));
        container.classList.add("container-fluid", "navbar-expand");
        
        ul = container.appendChild(document.createElement("ul"));
        ul.classList.add("navbar-nav");
        
        if(footerParams.add)
        {
          if(Array.isArray(footerParams.add))
            footerParams.add = {fields:footerParams.add};
          let li = ul.appendChild(document.createElement("li"));
          li.classList.add("nav-item", "me-2");
          
          let divAdd = li.appendChild(document.createElement("div"));
          divAdd.classList.add("input-group", "mt-2");
          
          let elements = {};
          for(let field of footerParams.add.fields)
          {
            elements[field.property] = divAdd.appendChild(document.createElement("select"));
            elements[field.property].id = `${field.property}${itemType}Select`;
            elements[field.property].classList.add("form-select", "size-to-content");
            elements[field.property].appendChild(document.createElement("option"))
            for(let opt of field.options)
            {
              let option = elements[field.property].appendChild(document.createElement("option"));
              if(typeof(opt) == "object")
              {
                option.value = opt.value;
                option.innerHTML = opt.label;
              }
              else
              {
                option.value = opt;
                option.innerHTML = opt;
              }
            }
            if(field.onChange)
              elements[field.property].addEventListener("change", field.onChange.bind(this, elements));
          }
          let btnAdd = divAdd.appendChild(document.createElement("button"));
          btnAdd.innerHTML = `Add ${itemType}`;
          btnAdd.classList.add("btn", "btn-primary");
          btnAdd.addEventListener("click", async event => {
            let data = {};
            let elements = {};
            for(let field of footerParams.add.fields)
            {
              elements[field.property] = document.getElementById(`${field.property}${itemType}Select`);
              if(elements[field.property]?.value)
                data[field.property] = elements[field.property].value;
              else
              {
                console.warn(`Can't add item, ${field.property} is blank.`);
                data = null;
                break;
              }
            }
            if(data)
            {
              let item;
              if(footerParams.add.onAdd)
              {
                item = footerParams.add.onAdd(event, elements, data);
                if(item?.constructor.name == "Promise")
                  item = await item;
              }
              else
                item = this.createItem(data);
              if(item)
              {
                for(let e in elements)
                  elements[e].value = "";
                console.log(`Item added.`, {item});
              }
              else
              {
                console.log(`Item was not added.`);
              }
            }
            else
            {
              console.log(`Item was not added.`);
            }
          });
        }
        
        if(footerParams.showcase)
        {
          let li = ul.appendChild(document.createElement("li"));
          li.classList.add("nav-item", "me-2");
      
          let showcaseBtn = li.appendChild(document.createElement("button"));
          showcaseBtn.id = `${this.constructor.name}ShowcaseBtn`;
          showcaseBtn.classList.add("btn", "btn-primary", "mt-2");
          //showcaseBtn.title = "Display your characters' stats and gear in a nice window that you can screenshot and show to others.";
          let showcaseIcon = showcaseBtn.appendChild(document.createElement("i"));
          showcaseIcon.classList.add("fa-solid", "fa-camera");
          
          if(!showcaseBtn.onclick)
          {
            showcaseBtn.onclick = async event => {
              let template = await fetch(footerParams.showcase.configTemplate??`templates/renderShowcaseConfigPopup.html?v=${window.versionId}`, {cache:"no-cache"})
              .then(response => response.text())
              .then(src => handlebars.compile(src));
              
              let modalElement = document.body.appendChild(document.createElement("template"));
              let index = Array.from(document.body.children).indexOf(modalElement);
              modalElement.outerHTML = template({items:footerParams.showcase.items??this.items()});
              modalElement = document.body.children.item(index);
              $(modalElement).find(".selectpicker").selectpicker('render');
              
              let modal = new bootstrap.Modal(modalElement);
              modal.show();
              modalElement.addEventListener("hide.bs.modal", async event => {
                if(event.explicitOriginalTarget?.classList.contains("popup-ok-btn"))
                {
                  let items = Array.from(modalElement.querySelector("select.showcase-filter").selectedOptions).map(optionElement => Renderer.controllers.get(optionElement.value));
                  for(let item of items)
                    if(typeof(item?.importDetails) == "function")
                      await item.importDetails();
                  let showcase = window.open("showcase.html", "_blank");
                  showcase.addEventListener("DOMContentLoaded", async event => {
                    document.head.querySelectorAll('link, style').forEach(htmlElement => {
                      showcase.document.head.appendChild(htmlElement.cloneNode(true));
                    });
                    let container = showcase.document.body.appendChild(document.createElement("div"));
                    await Renderer.rerender(container, {item:this, items}, {template: footerParams.showcase.template??`renderShowcase`});
                  });
                  showcase.addEventListener("beforeunload", event => {
                    this.constructor.clearDependencies(showcase.document.body, true);
                  });
                }
                modalElement.remove();
              });
            };
          }
        }
      }
    }
    else
    {
      footer.classList.add("d-none");
    }
    
    return {render, footer, updateFooter, ul};
  }
  
  postRender(element)
  {
    super.postRender(element);
    
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
