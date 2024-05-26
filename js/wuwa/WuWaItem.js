import UIItem from "../UIItem.js";

export default class WuWaItem extends UIItem
{
  get releaseTimestamp(){ return 0; }
  get isLeakHidden(){ return this.releaseTimestamp > Date.now(); }
}
