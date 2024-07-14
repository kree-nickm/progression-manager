import UIList from "./UIList.js";
import Setting from "./Setting.js";

export default class SettingList extends UIList {
  static dontSerialize = super.dontSerialize.concat([]);
  static unique = true;
  static itemClass = Setting;
}
