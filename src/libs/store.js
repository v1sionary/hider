const browser = require('webextension-polyfill');

const STORE_KEY = 'HIDER_RULES';

let rulesMap;

export function saveRule(rule, overwrite) {
  if (rulesMap[rule.id] && !overwrite) return Promise.reject('already existed!');

  rulesMap[rule.id] = rule;
  return browser.storage.local.set({ [STORE_KEY]: rulesMap }).then(() => {
    console.log('rule saved');
  });
}

export function getRuleByID(id) {
  return Promise.resolve(rulesMap[id]);
}

export function getRules() {
  if (rulesMap) {
    console.log('find rules');
    return Promise.resolve(Object.values(rulesMap));
  } else {
    return getStoreRules().then(rulesMap => {
      return Object.values(rulesMap);
    });
  }
}

export function clearStoreRules() {
  return browser.storage.local.clear();
}

function getStoreRules() {
  return browser.storage.local.get(STORE_KEY).then(res => {
    rulesMap = { ...res[STORE_KEY] };
    return rulesMap;
  });
}
