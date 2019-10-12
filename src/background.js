const browser = (global.browser = require('webextension-polyfill'));

import Store from './libs/store';
import { sweepByRuleList } from './libs/sweeper';

// todo
// find & remove history which are match the rules
// on the regular time

const store = new Store();
window.$store = store;

browser.windows.onCreated.addListener(() => {
  // find & remove history which are match the keyword
  // when open a browser
  setTimeout(() => {
    store.getEnabledRules().then(rules => {
      sweepByRuleList(rules);
    });
  }, 1000);
});
