const {default:UIList} = await window.importer.get(`js/UIList.js`);
const {default:Setting} = await window.importer.get(`js/Setting.js`);

export default class SettingList extends UIList {
  static dontSerialize = super.dontSerialize.concat([]);
  static unique = true;
  static itemClass = Setting;
}
