<template>
  <el-container class="warp">
    <el-header class="header">
      <h1 style="flex: 1;">
        <router-link tag="span" style="cursor:pointer" to="/">Hider</router-link>
      </h1>
      <div class="header-right" v-if="$route.name !== 'vertify'">
        <router-link tag="span" style="cursor:pointer;color: #409eff;" to="/setting">
          <i class="el-icon-setting"></i>
          设置
        </router-link>
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

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 250px;
}

.main {
  background: #eee;
}
</style>
