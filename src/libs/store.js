import Rule from '../libs/Rule';
const browser = require('webextension-polyfill');

const STORE_KEY = 'HIDER_RULES';

let singleton;

export default class Store {
  constructor() {
    if (!singleton) singleton = this;
    return singleton || this;
  }

  getStoreRules() {
    return browser.storage.local.get(STORE_KEY).then(res => {
      this.rulesMap = { ...res[STORE_KEY] };
      return { ...res[STORE_KEY] };
    });
  }

  getRules() {
    return Promise.resolve(Object.values(this.rulesMap));
  }

  getRuleByID(id) {
    return Promise.resolve(new Rule(this.rulesMap[id]));
  }

  saveRule(rule, overwrite) {
    if (this.rulesMap[rule.id] && !overwrite) return Promise.reject('already existed!');

    this.rulesMap[rule.id] = rule.getProperties();
    return browser.storage.local.set({ [STORE_KEY]: this.rulesMap }).then(() => {
      // isSuccess = true
      return true;
    });
  }

  removeByID(id) {
    if (!this.rulesMap[id]) return Promise.reject('no such rule');

    delete this.rulesMap[id];
    return browser.storage.local.set({ [STORE_KEY]: this.rulesMap }).then(() => {
      // isSuccess = true
      return true;
    });
  }

  clearStoreRules() {
    this.rulesMap = {};
    return browser.storage.local.clear();
  }
}
