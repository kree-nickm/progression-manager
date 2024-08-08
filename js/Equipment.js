const Equipment = (SuperClass) => class extends SuperClass {
  static dontSerialize = super.dontSerialize.concat(["characterList","character","equipSlots","specialSlots"]);
  
  static setupDisplay(display)
  {
    if(!display.getField("location"))
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
  equipSlots = 0;
  specialSlots = 0;
  
  get equipProperty() {}
  
  afterLoad()
  {
    if(!this.characterList)
      throw new Error(`characterList must be set for any object that extends Equipment.`);
    super.afterLoad();
    return true;
  }
  
  beforeUpdate(field, value, action, options)
  {
    if(field.string == "location" && value && this.equipSlots > 1)
    {
      if(this.characterList)
      {
        let characterKey, slot;
        [characterKey, slot] = value.split(":");
        slot = options.slot ?? slot;
        let newCharacter = this.characterList.get(characterKey);
        if(newCharacter)
        {
          // Determine which echo slot to equip.
          if(isNaN(slot) || slot > this.equipSlots-1 || slot < 0)
          {
            for(slot=this.specialSlots; slot<this.equipSlots; slot++)
              if(!newCharacter[this.equipProperty][slot] || newCharacter[this.equipProperty][slot] == this)
                break;
          }
          if(slot > this.equipSlots-1)
          {
            console.warn(`No more slots left to equip item.`, {character:newCharacter, item:this});
            return field.value;
          }
          else
          {
            return `${characterKey}:${slot}`;
          }
        }
        else
        {
          console.warn(`Cannot equip ${this.name} to non-existent character "${value}".`, {characterKey, slot});
          return field.value;
        }
      }
      else
      {
        console.warn(`Cannot equip ${this.name} to character "${value}" because character list is inaccessible.`);
        return "";
      }
    }
    else
      return super.beforeUpdate(field, value, action, options);
  }
  
  afterUpdate(field, value, action, options)
  {
    if(!super.afterUpdate(field, value, action, options))
      return false;
    if(field.string == "location" && !this.isPreview && field.value !== value)
    {
      if(value)
      {
        if(this.characterList)
        {
          const [characterKey, slot] = value.split(":");
          let newCharacter = this.characterList.get(characterKey);
          if(newCharacter)
            newCharacter.equipItem(this, {slot});
          else
          {
            console.warn(`Cannot equip ${this.name} to non-existent character "${this.location}".`, {characterKey, slot});
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
        {
          const [characterKey, slot] = field.value.split(":");
          this.character.update(this.equipProperty + (slot!==undefined ? `.${slot}` : ``), null, "replace");
        }
        this.character = null;
      }
    }
    return true;
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
