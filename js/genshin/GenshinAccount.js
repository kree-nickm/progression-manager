const {default:Account} = await window.importer.get(`js/Account.js`);
const {default:Setting} = await window.importer.get(`js/Setting.js`);

export default class GenshinAccount extends Account
{
  setup()
  {
    this.addSetting(new Setting({
      values: this.settings,
      key: "region",
      initial: "na",
      tags: ["account"],
      label: "Region",
      type: 'select',
      description: "The region/server of this account.",
      attributes: {options:[
        {value:'na', label:'America'},
        {value:'eu', label:'Europe'},
        {value:'as', label:'Asia'},
        {value:'tw', label:'Taiwan'},
      ]},
      onChange: event => {
        if(this.viewer?.today)
          this.viewer.today();
      },
    }));
    
    /*this.addSetting(new Setting({
      values: this.settings,
      key: "showLeaks",
      initial: false,
      tags: ["account"],
      label: "Show Leaks",
      type: 'boolean',
      description: "Whether to show or hide upcoming content that has not been officially announced.",
      //attributes: {},
      //onChange: event => {},
    }));*/
  }
}
