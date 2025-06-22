const {default:UIItem} = await window.importer.get(`js/UIItem.js`);

export default class MotionValue extends UIItem {
  character;
}
