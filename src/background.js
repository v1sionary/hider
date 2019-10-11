const browser = (global.browser = require('webextension-polyfill'));

import Store from './libs/store';
import { removeByKeyword } from './libs/sweeper';

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
      rules.forEach(rule => {
        removeByKeyword(rule.keyword, rule.searchArea);
      });
    });
  }, 1000);
});
