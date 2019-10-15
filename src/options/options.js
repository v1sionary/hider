import Vue from 'vue';
import VueRouter from 'vue-router';
import 'normalize.css';
import App from './App';

import { Button } from 'element-ui';

import './common.css';
import { isVerified } from '../libs/guard';

// page
import OptionsMain from './pages/OptionsMain';
import OptionsEdit from './pages/OptionsEdit';
import OptionsVertify from './pages/OptionsVertify';

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
  {
    name: 'vertify',
    path: '/vertify',
    meta: { public: true },
    component: OptionsVertify,
  },
  {
    path: '*',
    redirect: {
      name: 'vertify',
    },
  },
];
const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta || !to.meta.public) {
    if (!isVerified()) {
      next({ name: 'vertify' });
      return;
    }
  }
  next();
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
