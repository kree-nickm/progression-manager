const {default:UIItem} = await import(`./UIItem.js?v=${window.versionId}`);

export default class Setting extends UIItem {
  static dontSerialize = super.dontSerialize.concat([]);
  static TYPE_BOOLEAN = 1;
  static TYPE_FLOAT = 2;
  static TYPE_INT = 4;
  static TYPE_SELECT = 8;
  static TYPE_STRING = 16;
  
  category = "";
  label = "";
  type = 0;
  description = "";
  attributes = {
    max: null,
    min: null,
    step: null,
  };
  onChange = null;
}
