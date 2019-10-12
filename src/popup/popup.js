import Vue from 'vue';
import App from './App';
import 'normalize.css';

const browser = require('webextension-polyfill');
Vue.prototype.$browser = browser;

browser.runtime.getBackgroundPage().then(bg => {
  setTimeout(() => {
    Vue.prototype.$store = bg.$store;

    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      render: h => h(App),
    });
  }, 100);
});
