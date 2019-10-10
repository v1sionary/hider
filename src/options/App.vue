<template>
  <el-container class="warp">
    <el-header class="header">
      <h1 style="flex: 1">Hider</h1>
      <div style="width:150px;line-height:60px;text-align:right">
        <router-link
          v-show="$route.name !== 'edit'"
          to="/edit/"
          tag="el-button"
          type="primary"
          plain
          round
          size="small"
        >新增</router-link>
      </div>
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Vue from 'vue';
import { Container, Header, Main, Button, MessageBox, Message } from 'element-ui';
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Button);

export default {
  name: 'App',
};
</script>

<style scoped>
.warp {
  min-width: 990px;
  background: #fff;
}
.header {
  display: flex;
}
.main {
  background: #eee;
}
</style>
