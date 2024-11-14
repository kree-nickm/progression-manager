const {default:UIList} = await import(`./UIList.js?v=${window.versionId}`);
const {default:Setting} = await import(`./Setting.js?v=${window.versionId}`);

export default class SettingList extends UIList {
  static dontSerialize = super.dontSerialize.concat([]);
  static unique = true;
  static itemClass = Setting;
}
