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
      <el-form-item label="启用" prop="enabled">
        <el-switch v-model="ruleForm.enabled"></el-switch>
      </el-form-item>
      <el-button plain size="small" @click="save">保存</el-button>
      <el-button
        plain
        size="small"
        type="danger"
        @click.prevent="removeRule(ruleForm.id)"
        v-if="ruleForm.id"
      >删除</el-button>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Breadcrumb, BreadcrumbItem, Icon, Divider, Form, FormItem, Input, Button, Switch } from 'element-ui';

import Rule from '../../libs/Rule';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Icon);
Vue.use(Divider);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Switch);

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
  created() {
    const id = this.$route.params.ID;
    if (id) {
      this.$store.getRuleByID(id).then(rule => {
        this.ruleForm = rule;
      });
    }
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 本地存储
          this.$store.saveRule(new Rule(this.ruleForm), !!this.ruleForm.id).then(() => {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success',
              duration: 1000,
            });
            this.$router.push('/');
          });
        } else {
          return false;
        }
      });
    },

    removeRule(id) {
      this.$confirm('是否删除该规则', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return this.$store.removeByID(id);
        })
        .then(
          isSuccess => {
            this.$message({
              type: 'success',
              showClose: true,
              message: '删除成功',
              duration: 1000,
            });
            this.$router.push('/');
          },
          () => {
            this.$message({
              type: 'warning',
              showClose: true,
              message: '删除失败',
            });
          }
        );
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