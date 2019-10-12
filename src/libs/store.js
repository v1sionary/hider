import Rule from '../libs/Rule';
const browser = require('webextension-polyfill');

const RULE_STORE_KEY = 'HIDER_RULES';
const LAST_EXECUTED_KEY = 'LAST_EXECUTED';

let singleton;

export default class Store {
  constructor() {
    if (!singleton) {
      this.getStoreRules();
      singleton = this;
    }

    return singleton || this;
  }

  getStoreRules() {
    return browser.storage.local.get(RULE_STORE_KEY).then(res => {
      this.rulesMap = { ...res[RULE_STORE_KEY] };
      return { ...res[RULE_STORE_KEY] };
    });
  }

  getRules() {
    return Promise.resolve(Object.values(this.rulesMap).map(r => new Rule(r)));
  }

  getEnabledRules() {
    const _enabledRules = Object.values(this.rulesMap)
      .filter(r => {
        return r.enabled === true;
      })
      .map(r => new Rule(r));
    return Promise.resolve(_enabledRules);
  }

  getRuleByID(id) {
    return Promise.resolve(new Rule(this.rulesMap[id]));
  }

  saveRule(rule, overwrite) {
    if (this.rulesMap[rule.id] && !overwrite) return Promise.reject('already existed!');

    this.rulesMap[rule.id] = rule.getProperties();
    return browser.storage.local.set({ [RULE_STORE_KEY]: this.rulesMap }).then(() => {
      // isSuccess = true
      return true;
    });
  }

  removeRuleByID(id) {
    if (!this.rulesMap[id]) return Promise.reject('no such rule');

    delete this.rulesMap[id];
    return browser.storage.local.set({ [RULE_STORE_KEY]: this.rulesMap }).then(() => {
      // isSuccess = true
      return true;
    });
  }

  clearStoreRules() {
    this.rulesMap = {};
    return browser.storage.local.clear();
  }

  getLastExecuted() {
    return browser.storage.local.get(LAST_EXECUTED_KEY).then(res => {
      return { ...res[LAST_EXECUTED_KEY] };
    });
  }

  saveLastExecuted(dateStr) {
    return browser.storage.local.set({ [LAST_EXECUTED_KEY]: { time: dateStr } });
  }
}
