import handlebars from 'https://cdn.jsdelivr.net/npm/handlebars@4.7.7/+esm';

handlebars.registerHelper("itemField", (item, field, property, context) => {
  let params = context.hash.params ? (Array.isArray(context.hash.params) ? context.hash.params : [context.hash.params]) : [];
  return field.get(property, item, ...params);
});

handlebars.registerHelper("itemChildren", (item, field, context) => {
  let params = context.hash.params ? (Array.isArray(context.hash.params) ? context.hash.params : [context.hash.params]) : [];
  let result = Renderer.contentToHTML(field.get('value', item, ...params));
  
  let button = field.get('button',item,...params);
  if(!Array.isArray(button))
    button = [button];
  for(let btn of button)
  {
    if(btn)
    {
      let classes = [];
      if(btn.classes)
      {
        for(let cls in btn.classes)
          if(btn.classes[cls])
            classes.push(cls);
      }
      let inner = "";
      if(btn.text)
        inner = inner + handlebars.escapeExpression(btn.text);
      if(btn.icon)
        inner = inner + "<i class=\""+ handlebars.escapeExpression(btn.icon) +"\"></i>";
      result = result + "<button class=\"list-button "+ handlebars.escapeExpression(classes.join(" ")) +"\""+ (btn.action ? "" : " disabled=\"disabled\"") +" name=\""+ (btn.name??"") +"\">"+ inner +"</button>";
    }
  }
  
  return new handlebars.SafeString(result);
});

handlebars.registerHelper("itemClasses", (item, field, context) => {
  let params = context.hash.params ? (Array.isArray(context.hash.params) ? context.hash.params : [context.hash.params]) : [];
  let result = [];
  if(!item)
  {
    console.error(`item passed to itemClasses helper is invalid`, item, field, context);
    return "";
  }
  if(!field)
  {
    console.error(`field passed to itemClasses helper is invalid`, item, field, context);
    return "";
  }
  let classes = field.get('classes', item, ...params);
  for(let cls in classes)
    if(classes[cls])
      result.push(cls);
  return result.join(" ");
});

handlebars.registerHelper("fieldClasses", (field, context) => field.columnClasses.join(" "));

handlebars.registerHelper("lower", (str, context) => str.toLowerCase());

handlebars.registerHelper("concat", function() {
  let result = "";
  for(let i=0; i<arguments.length-1; i++)
    result += String(arguments[i]);
  return result;
});

handlebars.registerHelper('times', function(n, options) {
  n = parseInt(n);
  let data = handlebars.createFrame(options.data);
  let accum = "";
  let start = options.hash?.start ?? 0;
  let num = n + start;
  for(let i=start; i<num; ++i)
  {
    data.index = i;
    data.first = (i === start);
    data.last = (i === num-1);
    accum += options.fn(this, {data});
  }
  return accum;
});

handlebars.registerHelper('ifeq', function(first, second, options) {
  if(first == second)
    return options.fn(this);
  else
    return options.inverse(this);
});

handlebars.registerHelper('array', function(...params) {
  let context = params.pop();
  return params;
});

class Renderer
{
  static genericSorters = {
    'string': (prop,o,a,b) => {
      let A = String(a.get(prop));
      let B = String(b.get(prop));
      if(!A && B)
        return 1;
      else if(A && !B)
        return -1;
      else if(!A && !B)
        return 0;
      else
        return o*A.localeCompare(B);
    },
    'number': (prop,o,a,b) => {
      let A = parseFloat(a.get(prop));
      let B = parseFloat(b.get(prop));
      if(isNaN(A) && !isNaN(B))
        return 1;
      else if(!isNaN(A) && isNaN(B))
        return -1;
      else if(isNaN(A) && isNaN(B))
        return 0;
      else
        return o*(B-A);
    },
    'boolean': (prop,o,a,b) => {
      let A = a.get(prop);
      let B = b.get(prop);
      if(!A && B)
        return 1*o;
      else if(A && !B)
        return -1*o;
      else
        return 0;
    },
  };
  
  static partialsUsed = {
    'renderListAsTable': ["renderItem"],
    'renderCharacterAsPopup': ["renderCharacterBuild","renderArtifactStatSlider","renderListAsColumn","renderArtifactAsCard"],
  };
  
  static needsUpdate = new Set();
  static #templates = {};
  
  static async getTemplates(...templates)
  {
    for(let templateFile of templates)
    {
      if(templateFile && !Renderer.#templates[templateFile])
      {
        try
        {
          Renderer.#templates[templateFile] = await fetch(`templates/${templateFile}.html`)
          .catch(err => console.error(`Template file not found 'templates/${templateFile}.html'.`, err))
          .then(response => response.text())
          .then(src => {
            handlebars.registerPartial(templateFile, src);
            return handlebars.compile(src);
          });
        }
        catch(x)
        {
          console.error(x);
        }
      }
      else if(!templateFile)
      {
        console.warn(`Tried to load invalid template file '${templateFile}'.`);
        console.trace();
      }
    }
    return Renderer.#templates;
  }
  
  static contentToHTML(content, path=[])
  {
    if(Array.isArray(content))
    {
      let result = "";
      for(let i in content)
        result = result + Renderer.contentToHTML(content[i], path.concat([i]));
      return result;
    }
    else if(content !== undefined && content !== null)
    {
      let tag = content.tag ?? "span";
      let text = "";
      if(typeof(content) == "object")
      {
        if(typeof(content.value) == "object")
        {
          text = Renderer.contentToHTML(content.value);
        }
        else if(content.value)
        {
          text = "<span class='value'>"+ handlebars.escapeExpression(content.value) +"</span>";
        }
      }
      else if(typeof(content) == "number" || content)
      {
        text = "<span class='value'>"+ handlebars.escapeExpression(content) +"</span>";
      }
      let attrs = [];
      
      let classes = [];
      for(let cls in content.classes ?? [])
        if(content.classes[cls])
          classes.push(cls);
      if(path.length)
        classes.push("sub-"+ path.join("-"));
      if(classes.length)
        attrs.push(`class="${handlebars.escapeExpression(classes.join(' '))}"`);
      
      if(content.src)
        attrs.push(`src="${content.src}"`);
      
      if(content.title)
        attrs.push(`title="${content.title}"`);
      
      return `<${tag} ${attrs.join(' ')}` + (text ? `>${text}</${tag}>` : `/>`);
    }
    else
      return "";
  }
  
  static async renderList2(listKey, {template, items, parent, filter, include=[], exclude=[], fields, container=document, force=false}={})
  {
    let listElements = container.querySelectorAll(`.list[name='${listKey}']`);
    if(listElements.length)
    {
      for(let element of listElements)
        await Renderer.renderListElement(element, listKey, template, items, parent, filter, include, exclude, fields, force);
    }
    else
    {
      let element = container.appendChild(document.createElement("template"));
      await Renderer.renderListElement(element, listKey, template, items, parent, filter, include, exclude, fields, true)
    }
    
    // Iterate through all item fields.
    let fieldElements = document.querySelectorAll(".list-item-field");
    fieldElements.forEach(Renderer.renderItemField);
  }
  
  static async renderListElement(element, listKey, template, items, parent, filter, include, exclude, fields, force)
  {
    let listKeys = listKey.split("/");
    let list = window.viewer.lists[listKeys[0]];
    if(force)
    {
      let parentElement = element.parentNode;
      if(!template)
        template = element.dataset.template ?? "renderListAsTable";
      let templates = await Renderer.getTemplates(template, ...(Renderer.partialsUsed[template] ?? []), "renderItemField");
      element.outerHTML = templates[template]({
        name: listKey,
        parent: parent,
        groups: list.display.getGroups({include, exclude}),
        fields: fields ?? list.display.getFields({include, exclude}),
        items: items ?? (typeof(filter) == "function" ? list.items(filter) : (listKeys[1] ? (list.items(listKeys[1]) ?? list.items()) : list.items())),
      });
      // Note: Won't work if the parent has multiple lists of the same elements, but that probably shouldn't happen.
      element = parentElement.querySelector(`.list[name='${listKey}']`);
    }
    if(parent)
      parent.addPopupEventHandlers(element);
      
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
          let field = list.display.getField(fieldName);
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
              list.list.sort(field.sort.func.bind(list, order));
            else if(field.sort.generic)
              list.list.sort(Renderer.genericSorters[field.sort.generic.type].bind(list, field.sort.generic.property, order));
            else
            {
              console.warn(`No sort algorithm given for field '${fieldName}'.`);
              return;
            }
            
            // Reorder the HTML elements.
            let listElement = element.querySelector(".list-target");
            if(!listElement)
              listElement = element;
            for(let item of list.list)
            {
              let itemElement = listElement.children.namedItem(item.getUnique());
              if(itemElement)
                listElement.appendChild(itemElement);
              else
                console.error(`Unable to find item element for item '${item.getUnique()}' while sorting by '${fieldName}'.`);
            }
            
            list.viewer.store();
          }
          else
            console.error(`Unable to find field '${fieldName}'.`);
        };
    });
  }
  
  static async removeItem(item)
  {
    Array.from(document.querySelectorAll(`.list-item[name="${item.getUnique()}"]`)).forEach(element => element.remove())
  }
  
  static async renderNewItem(item, {include=[], exclude=[]}={})
  {
    // TODO: Currently only supports adding rows to tables.
    let templates = await Renderer.getTemplates("renderItem");
    let element = document.querySelector(`.list[name='${item.list.constructor.name}']`); // TODO: Could match multiple.
    {
      let listElement = element.querySelector(".list-target");
      if(!listElement)
        listElement = element;
      let newElement = listElement.appendChild(document.createElement("template"));
      newElement.outerHTML = templates["renderItem"]({
        item,
        fields: item.list.display.getFields({include, exclude}),
        wrapper: "tr",
        fieldWrapper: "td",
      });
      // Changing outerHTML breaks DOM references, so we need to reacquire the reference to this element.
      newElement = listElement.querySelector(`.list-item[name="${item.getUnique()}"]`);
      
      let fieldElements = newElement.querySelectorAll(".list-item-field");
      fieldElements.forEach(Renderer.renderItemField);
    }
  }
  
  static async renderItemDetails(item)
  {
    Renderer.popup = bootstrap.Modal.getOrCreateInstance(window.viewer.elements.popup);
    Renderer.popup.item = item;
    
    let popupTitle = window.viewer.elements.popup.querySelector(".modal-title");
    if(item.constructor.templateTitleName)
    {
      let templatesTitle = await Renderer.getTemplates(item.constructor.templateTitleName, ...(Renderer.partialsUsed[item.constructor.templateTitleName] ?? []), "renderItemField");
      popupTitle.innerHTML = templatesTitle[item.constructor.templateTitleName]({
        fields: item.list.display.fields,
        item,
      });
    }
    else
      popupTitle.innerHTML = item.name;
    
    let popupBody = window.viewer.elements.popup.querySelector(".modal-body");
    let templateName = item.constructor.templateName ?? "renderItem";
    let templates = await Renderer.getTemplates(templateName, ...(Renderer.partialsUsed[templateName] ?? []), "renderItemField");
    popupBody.innerHTML = templates[templateName]({
      fields: item.list.display.fields,
      item,
      relatedItems: item.getRelatedItems(),
      wrapper: "div",
      fieldWrapper: "div",
    }, {allowProtoMethodsByDefault:true, allowProtoPropertiesByDefault:true});
    $('.selectpicker').selectpicker();
    
    Renderer.updatePopup();
    item.addPopupEventHandlers(popupBody);
    Renderer.popup.show();
  }
  
  static async updatePopup()
  {
    let itemElements = Renderer.popup._dialog.querySelectorAll(".list-item-field");
    itemElements.forEach(Renderer.renderItemField);
  }
  
  static async renderItemField(element)
  {
    if(element.needsUpdate === false)
      return;
    
    // Get the field name first for reference.
    let fieldName = element.attributes.getNamedItem('name')?.value;
    
    // Determine the item for the field.
    let itemElement = element.parentElement;
    while(itemElement && !itemElement.classList.contains("list-item"))
      itemElement = itemElement.parentElement;
    if(!itemElement)
    {
      console.error(`Item field '${fieldName}' element has no ancestor with the 'list-item' class.`, element);
      return false;
    }
    let itemName = itemElement.attributes.getNamedItem('name')?.value;
    
    // Determine the list, if specified.
    let list;
    if(itemElement.dataset.list)
    {
      list = window.viewer.lists[itemElement.dataset.list];
    }
    if(!list)
    {
      let listElement = itemElement.parentElement;
      while(listElement && !listElement.classList.contains("list"))
        listElement = listElement.parentElement;
      if(listElement)
      {
        let listKey = listElement.attributes.getNamedItem('name')?.value;
        if(listKey)
        {
          list = window.viewer.lists[listKey.split("/")[0]];
        }
      }
      else
      {
        console.error(`Item '${itemName}' field '${fieldName}' element has no ancestor with the 'list' class.`, element);
        return false;
      }
    }
    if(!list)
    {
      console.error(`List element for item '${itemName}' field '${fieldName}' has an invalid name.`);
      return false;
    }
    
    // Verify that item and field are found.
    let item = list.get(itemName);
    if(!item)
    {
      console.error(`Unable to determine '${itemName}' item of this ${list.constructor.name} element (field '${fieldName}'):`, itemElement);
      return false;
    }
    
    let field = list.display.getField(fieldName);
    if(!field)
    {
      console.error(`Unable to determine '${fieldName}' field of this ${list.constructor.name} element (item '${itemName}'):`, element);
      return false;
    }
    
    // Parse out the parameters for the item field.
    let params = [];
    let p;
    let i = 0;
    while((p = element.dataset['param'+i]) !== undefined)
    {
      let param = p.split("##");
      if(param.length == 2)
        params.push(window.viewer.lists[param[0]].get(param[1]));
      else
        params.push(p);
      i++;
    }
    
    // Fetch some fields we need.
    let value = field.get("value", item, ...params);
    let dependencies = field.get("dependencies", item, ...params) ?? [];
    let button = field.get("button", item, ...params);
    if(!Array.isArray(button))
      button = [button];
    let edit = field.get("edit", item, ...params);
    
    // Render the Handlebars template if the field has changed.
    if(element.needsUpdate)
    {
      // Remove old dependency definitions.
      if(element.dependencies)
      {
        for(let dep of element.dependencies)
        {
          if(dep?.item && dep?.field)
            dep.item.removeDependent(dep.field, element);
        }
      }
      
      // Remember specific classes that the element might have that are not a part of the template.
      let readdClasses = { // I'm not a fan of this implementation (hard-coding the classes), but it's the first one I thought of.
        'group-collapsed': element.classList.contains("group-collapsed"),
      };
      
      // Load the template, set the outerHTML, and reacquire the element reference.
      let templates = await Renderer.getTemplates("renderItemField");
      element.outerHTML = templates["renderItemField"]({
        item,
        field,
        wrapper: element.tagName,
        params: params,
      });
      element = itemElement.querySelector(`.list-item-field[name="${field.id}"]`);
      
      // Re-add the classes that we remembered.
      for(let cls in readdClasses)
        if(readdClasses[cls])
          element.classList.add(cls);
    }
    element.needsUpdate = false;
    
    // Check for button event handlers. TODO: Replace this with an "onclick" check.
    for(let b in button)
    {
      let btn = button[b];
      if(btn)
      {
        let buttonElement = element.querySelector("button[name=\""+(btn.name??"")+"\"]");
        if(btn.action && buttonElement && !buttonElement.onclick)
          buttonElement.onclick = btn.action;
      }
    }
    
    // Setup the functionality for an editable field if this is a newly-created cell.
    let popup = field.get("popup", item, ...params);
    if(edit)
    {
      if(edit.target)
        dependencies.push(edit.target);
      Renderer.addFieldEventListeners(element, {value, edit}, list, item, field);
    }
    else if(popup)
    {
      if(!element.onclick)
      {
        element.onclick = event => Renderer.renderItemDetails(popup);
        element.classList.add("popup");
      }
    }
    
    let handleSubEdit = (valueArr=[],parents=[]) => {
      for(let iContent in valueArr)
      {
        if(!valueArr[iContent])
          continue;
        let newParents = [...parents, ".sub-"+ iContent];
        let subElement = element.querySelector(":scope > "+ newParents.join(" > "));
        if(valueArr[iContent].edit)
        {
          if(valueArr[iContent].edit.target)
            dependencies.push(valueArr[iContent].edit.target);
          Renderer.addFieldEventListeners(subElement, valueArr[iContent], list, item, field);
        }
        else if(valueArr[iContent].popup)
        {
          if(!subElement.onclick)
          {
            subElement.onclick = event => Renderer.renderItemDetails(valueArr[iContent].popup);
            subElement.classList.add("popup");
          }
        }
        if(Array.isArray(valueArr[iContent].value))
        {
          handleSubEdit(valueArr[iContent].value, newParents);
        }
      }
    };
    
    if(Array.isArray(value))
      handleSubEdit(value);
    
    // If this cell's data is dependent on other fields, set up a trigger to update this cell when those fields are changed.
    if(!element.dependencies)
    {
      element.dependencies = dependencies;
      for(let dep of element.dependencies)
      {
        if(dep?.item && dep?.field)
          dep.item.addDependent(dep.field, element);
      }
    }
  }
  
  static addFieldEventListeners(fieldElement, content, list, item, field)
  {
    fieldElement.editValue = content.edit.value ?? content.value ?? "";
    fieldElement.editTarget = content.edit.target;
    fieldElement.editFunc = content.edit.func;
    let editElement = fieldElement.querySelector(".edit-element");
    if(!editElement)
    {
      // Create the input element for editing.
      if(content.edit.type == "checkbox")
      {
        // Add icon to indicate status.
        if(content.edit.prepend)
          editElement = fieldElement.insertBefore(document.createElement("i"), fieldElement.childNodes[0] ?? null);
        else
          editElement = fieldElement.appendChild(document.createElement("i"));
        fieldElement.editChecked = !!(content.edit.checked ?? content.edit.value ?? false);
      }
      else if(content.edit.type == "select")
      {
        // Add select element.
        editElement = fieldElement.appendChild(document.createElement("select"));
        editElement.appendChild(document.createElement("option"));
        for(let opt of content.edit.list)
        {
          let option = editElement.appendChild(document.createElement("option"));
          option.value = opt[content.edit.valueProperty];
          option.innerHTML = opt[content.edit.displayProperty];
        }
      }
      else
      {
        // Add input element.
        editElement = fieldElement.appendChild(document.createElement("input"));
        editElement.type = content.edit.type ?? "number";
        editElement.classList.add("edit-box", "size-to-content");
      }
      editElement.classList.add("edit-element");
    }
    
    // Add event listeners.
    if(content.edit.type == "checkbox")
    {
      if(!fieldElement.onclick)
      {
        if(fieldElement.editTarget)
          fieldElement.onclick = event => {
            let fieldData = fieldElement.editTarget.item.parseField(fieldElement.editTarget.field);
            if(Array.isArray(fieldData.value))
            {
              fieldElement.editTarget.item.update(fieldElement.editTarget.field, fieldElement.editValue, fieldElement.editChecked ? "remove" : "push");
            }
            else
              fieldElement.editTarget.item.update(fieldElement.editTarget.field, !fieldElement.editChecked);
            //fieldElement.editTarget.item.list.viewer.updated();
            list.viewer.store();
            list.render();
          };
        else if(fieldElement.editFunc)
          fieldElement.onclick = fieldElement.editFunc;
        fieldElement.classList.add("editable");
      }
    }
    else
    {
      // Event to begin editing when the plain field is clicked.
      if(!fieldElement.onclick)
      {
        fieldElement.onclick = event => {
          if(fieldElement.classList.contains("editing") || event.target.nodeName == "OPTION")
            return;
          fieldElement.classList.add("editing");
          if(content.edit.type == "select")
          {
            for(let opt of editElement.options)
            {
              if(opt.innerHTML == fieldElement.editValue)
              {
                editElement.selectedIndex = opt.index;
              }
            }
          }
          else
          {
            editElement.value = "";
            editElement.placeholder = (fieldElement.editTarget?.item?.get(fieldElement.editTarget?.field) ?? 0);
          }
          editElement.focus();
        };
        fieldElement.classList.add("editable");
      }
      
      // Event to save the edit.
      if(!editElement.onchange || !editElement.onblur || !editElement.onkeydown)
      {
        let saveEdit = event => {
          if((event.type == "keydown" && event.which != 13 && event.which != 27) || !fieldElement.classList.contains("editing"))
            return true;
          event.stopPropagation();
          fieldElement.classList.remove("editing");
          if(event.type != "keydown" || event.which != 27)
          {
            let val = (editElement.type == "number" ? parseFloat(editElement.value) : editElement.value);
            if(!isNaN(val) || editElement.type != "number")
            {
              if(fieldElement.editTarget)
              {
                fieldElement.editTarget.item.update(fieldElement.editTarget.field, val);
              }
              else if(fieldElement.editFunc)
                fieldElement.editFunc(val);
              else
                throw new Error(`Neither fieldElement.editTarget nor fieldElement.editFunc were specifed.`);
              //fieldElement.editTarget?.item.list.viewer.updated();
              list.viewer.store();
              list.render();
            }
          }
        };
        editElement.onchange = saveEdit;
        editElement.onblur = saveEdit;
        editElement.onkeydown = saveEdit;
      }
    }
    
    // Update values of the edit element.
    if(content.edit.type == "checkbox")
    {
      if(!fieldElement.editChecked)
      {
        if(content.edit.trueClasses)
          editElement.classList.remove(...content.edit.trueClasses);
        if(content.edit.falseClasses)
          editElement.classList.add(...content.edit.falseClasses);
      }
      else
      {
        if(content.edit.falseClasses)
          editElement.classList.remove(...content.edit.falseClasses);
        if(content.edit.trueClasses)
          editElement.classList.add(...content.edit.trueClasses);
      }
    }
  }
}

export { handlebars, Renderer };
