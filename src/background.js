const browser = (global.browser = require('webextension-polyfill'));

import Store from './libs/store';
import Rule from './libs/Rule';

// todo
// find & remove history which are match the rules
// when open & close the browser

// todo
// find & remove history which are match the rules
// on the regular time

const store = new Store();
window.$store = store;

let tabsCount = 0;

store.getStoreRules().then(() => {
  browser.windows.onRemoved.addListener(() => {});

  browser.tabs.getAllInWindow(null, tabs => {
    tabsCount = tabs.length;
  });

  browser.tabs.onCreated.addListener(() => {
    tabsCount += 1;
  });

  browser.tabs.onRemoved.addListener(() => {
    tabsCount -= 1;
    if (tabsCount === 0) {
      // do sweep on last tab closed
    }
  });
});
