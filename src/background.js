import { removeByKeywordInRange } from './libs/sweeper';

const browser = (global.browser = require('webextension-polyfill'));

// todo
// find & remove history which are match the rules
// when open & close the browser

// todo
// find & remove history which are match the rules
// on the regular time

removeByKeywordInRange('google', new Date('2019-10-7 0:00:00').getTime(), '2019-10-7 23:00:00').then(count => {
  console.log(`removed ${count} visited items`);
});

browser.windows.onCreated.addListener(() => {});
