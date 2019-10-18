<template>
  <el-card style="width:480px;margin: 0 auto;">
    <div slot="header" class="clearfix">
      <span>身份验证</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="50px">
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password @keydown.enter.native.prevent="verify"></el-input>
      </el-form-item>
      <el-button type="primary" plain size="mini" @click.prevent="verify">登录</el-button>
    </el-form>
  </el-card>
</template>

<script>
import Vue from 'vue';
import { Card, Form, FormItem, Input, Button } from 'element-ui';

import { verifyPassword } from '../../libs/guard';

Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  name: 'OptionsVertify',
  data: function() {
    return {
      form: {
        password: '',
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '长度至少6个字符', trigger: 'blur' }],
      },
    };
  },
  methods: {
    verify() {
      this.$refs['form'].validate(isvaild => {
        if (isvaild) {
          verifyPassword(this.form.password).then(isEqual => {
            if (!isEqual) {
              return this.$message({
                type: 'error',
                message: '密码错误',
                showClose: true,
              });
            } else {
              this.$router.push('/');
            }
          });
        }
      });
    },
  },
};
</script>

<style></style>
