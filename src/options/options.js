import Vue from 'vue';
import VueRouter from 'vue-router';
import 'normalize.css';
import App from './App';

import { Button } from 'element-ui';

import './common.css';

// page
import OptionsMain from './pages/OptionsMain';
import OptionsEdit from './pages/OptionsEdit';

global.browser = require('webextension-polyfill');

Vue.use(VueRouter);
Vue.use(Button);

const routes = [
  {
    name: 'main',
    path: '/',
    component: OptionsMain,
  },
  {
    name: 'edit',
    path: '/edit/:ID?',
    component: OptionsEdit,
  },
];
const router = new VueRouter({
  routes,
});

browser.runtime.getBackgroundPage().then(bg => {
  setTimeout(() => {
    Vue.prototype.$store = bg.$store;

    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      render: h => h(App),
    });
  }, 100);
});
