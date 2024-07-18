const Equipment = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["character","characterList"]);
  
  static setupDisplay(display)
  {
    display.addField("location", {
      label: "User",
      sort: {generic: {type:"string",property:"location"}},
      dynamic: true,
      value: item => item.character ? {
        value: [
          {
            value: item.character.name,
            edit: {
              target: {item:item, field:"location"},
              type: "select",
              list: item.characterList.items("owned").filter(cha => item.canEquip(cha)),
              valueProperty: "key",
              displayProperty: "name",
            },
          },
          {
            tag: "i",
            classes: {'fa-solid':true, 'fa-eye':true},
            popup: item.character.variants?.length ? item.character.variants[0] : item.character,
          },
        ],
        classes: {
          "user-field": true,
        },
      } : {
        value: "-",
        edit: {
          target: {item:item, field:"location"},
          type: "select",
          list: item.characterList.items("owned").filter(cha => item.canEquip(cha)),
          valueProperty: "key",
          displayProperty: "name",
        },
      },
      dependencies: item => [
        {item:item.characterList, field:"list"},
      ],
    });
    
    super.setupDisplay(display);
  }
  
  location;
  
  characterList;
  character = null;
  
  get equipProperty() {}
  
  afterLoad()
  {
    if(!this.characterList)
      throw new Error(`characterList must be set for any object that extends Equipment.`);
    super.afterLoad();
    return true;
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location" && !this.isPreview)
    {
      if(value)
      {
        if(this.characterList)
        {
          let newCharacter = this.characterList.get(value);
          if(newCharacter)
            newCharacter.equipItem(this);
          else
          {
            console.warn(`Cannot equip ${this.name} to non-existent character "${this.location}".`);
            field.object[field.property] = "";
            this.character = null;
          }
        }
        else
        {
          console.warn(`Cannot equip ${this.name} to character "${this.location}" because character list is inaccessible.`);
          field.object[field.property] = "";
          this.character = null;
        }
      }
      else
      {
        if(this.character)
          this.character.update(this.equipProperty, null, "replace");
        this.character = null;
      }
    }
  }
  
  canEquip(character)
  {
    return true;
  }
  
  unlink(options)
  {
    this.update("location", "");
    super.unlink(options);
  }
};

export default Equipment;
