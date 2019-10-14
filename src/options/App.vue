<template>
  <el-container class="warp">
    <el-header class="header">
      <h1 style="flex: 1;">
        <router-link tag="span" style="cursor:pointer" to="/">Hider</router-link>
      </h1>
      <div style="width:150px;line-height:60px;text-align:right">
        <router-link v-if="$route.name === 'main'" to="/edit/">
          <el-button type="primary" plain size="small" icon="el-icon-plus">新增</el-button>
        </router-link>
        <el-button plain size="small" icon="el-icon-s-tools">设置</el-button>
      </div>
    </el-header>
    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import Vue from 'vue';
import { Container, Header, Main, MessageBox, Message } from 'element-ui';
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

Vue.use(Container);
Vue.use(Header);
Vue.use(Main);

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
