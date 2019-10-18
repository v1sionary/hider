import Vue from 'vue';
import VueRouter from 'vue-router';
import 'normalize.css';
import App from './App';

import { Button } from 'element-ui';

import './common.css';
import { isAuth, initGuard } from '../libs/guard';

// page
import OptionsMain from './pages/OptionsMain';
import OptionsEdit from './pages/OptionsEdit';
import OptionsVertify from './pages/OptionsVertify';
import OptionsSetting from './pages/OptionsSetting';

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
    name: 'setting',
    path: '/setting',
    component: OptionsSetting,
  },
  {
    name: 'vertify',
    path: '/vertify',
    meta: { public: true },
    component: OptionsVertify,
    beforeEnter: (to, from, next) => {
      if (!isAuth()) {
        next();
        return;
      }
      next('/');
    },
  },
  {
    path: '*',
    redirect: {
      name: 'main',
    },
  },
];
const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.meta || !to.meta.public) {
    if (!isAuth()) {
      next({ name: 'vertify' });
      return;
    }
  }
  next();
});

browser.runtime
  .getBackgroundPage()
  .then(bg => {
    Vue.prototype.$store = bg.$store;
    return initGuard();
  })
  .then(() => {
    setTimeout(() => {
      /* eslint-disable no-new */
      new Vue({
        el: '#app',
        router,
        render: h => h(App),
      });
    }, 100);
  });
