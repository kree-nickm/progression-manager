export default class Setting {
  key;
  initial;
  tags;
  label;
  type;
  description;
  attributes = {
    max: null,
    min: null,
    step: null,
  };
  onChange;
  values;
  
  constructor({key, initial, tags, label, type, description, attributes, onChange, values}={})
  {
    this.key = key;
    this.initial = initial;
    this.tags = tags ?? [];
    this.label = label ?? "";
    this.type = type ?? "string";
    this.description = description ?? "";
    this.attributes = attributes ?? {
      max: null,
      min: null,
      step: null,
    };
    this.onChange = onChange;
    this.values = values;
  }
  
  get value()
  {
    return this.validate(this.values?.[this.key] ?? this.initial);
  }
  
  set value(value)
  {
    if(this.values)
      this.values[this.key] = this.validate(value);
    else
      console.error(`Tried to set value of setting '${this.key}', but it has no reference to a values object.`);
  }
  
  validate(value)
  {
    if(this.type === 'boolean')
      return !!value;
    
    if(this.type === 'float')
      return parseFloat(value) || 0;
    
    if(this.type === 'int')
      return parseInt(value) || 0;
    
    if(this.type === 'string')
      return String(value);
    
    if(this.type === 'select')
    {
      if(this.attributes?.options?.some(opt => String(opt.value) === String(value)))
        return String(value);
      else
        return "";
    }
    
    console.warn(`Couldn't properly validate value for setting:`, {setting:this, value});
    return value;
  }
}
