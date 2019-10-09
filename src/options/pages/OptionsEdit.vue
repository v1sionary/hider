<template>
  <div class="container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider content-position="right">
      <i class="el-icon-edit"></i>
    </el-divider>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="rule-form">
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword"></el-input>
      </el-form-item>
      <el-button plain size="small" @click="save">保存</el-button>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Breadcrumb, BreadcrumbItem, Icon, Divider, Form, FormItem, Input, Button } from 'element-ui';

import Rule from '../../libs/Rule';
import { saveRule, getRules } from '../../libs/store';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Icon);
Vue.use(Divider);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  name: 'OptionsEdit',
  data: function() {
    return {
      ruleForm: {
        keyword: '',
      },
      rules: {
        keyword: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
      },
    };
  },
  created() {},
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const rule = new Rule(this.ruleForm);

          // 本地存储
          saveRule(rule).then(() => {
            // saved
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  background: #ffffff;
  padding: 15px 9px;
}
</style>