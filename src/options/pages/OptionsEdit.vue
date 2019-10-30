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
      <el-form-item label="启用" prop="enabled" size="small">
        <el-switch v-model="ruleForm.enabled"></el-switch>
      </el-form-item>
      <el-form-item label="关键字" prop="keyword" size="small">
        <el-input v-model="ruleForm.keyword"></el-input>
      </el-form-item>
      <el-form-item label="检索范围" prop="searchArea" size="small">
        <el-radio v-model="ruleForm.searchArea" label="ALL">URL和标题</el-radio>
        <el-radio v-model="ruleForm.searchArea" label="URL">URL</el-radio>
        <el-radio v-model="ruleForm.searchArea" label="TITLE">标题</el-radio>
      </el-form-item>

      <el-divider content-position="center">
        <i class="el-icon-alarm-clock"></i>
      </el-divider>

      <el-form-item label="定时任务" prop="taskEnabled">
        <el-radio-group v-model="ruleTask.taskEnabled" size="mini">
          <el-radio-button label="close" name="taskEnabled">关闭</el-radio-button>
          <el-radio-button label="periodic" name="taskEnabled">间隔</el-radio-button>
          <el-radio-button label="regular" name="taskEnabled">定时</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="间隔" prop="period" v-if="ruleTask.taskEnabled === 'periodic'">
        <el-radio-group v-model="ruleTask.period" size="mini">
          <el-radio label="15min" name="period">15分钟</el-radio>
          <el-radio label="30min" name="period">30分钟</el-radio>
          <el-radio label="1h" name="period">1小时</el-radio>
          <el-radio label="12h" name="period">12小时</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="定期" prop="regular" v-if="ruleTask.taskEnabled === 'regular'">
        <div class="regular-warp">
          <el-radio-group v-model="ruleTask.timeUnit" size="mini" style="line-height:40px;">
            <el-radio-button label="hour" name="timeUnit">每天</el-radio-button>
            <el-radio-button label="day" name="timeUnit">每周</el-radio-button>
            <el-radio-button label="date" name="timeUnit">每月</el-radio-button>
          </el-radio-group>
          <el-checkbox-group v-model="ruleTask.timings" size="mini" style="padding-left:10px;">
            <el-checkbox :label="0" name="timings">0点</el-checkbox>
            <el-checkbox :label="8" name="timings">8点</el-checkbox>
            <el-checkbox :label="17" name="timings">17点</el-checkbox>
            <el-checkbox :label="21" name="timings">21点</el-checkbox>
            <el-checkbox :label="23" name="timings">23点</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>

      <el-button plain size="small" @click="save">保存</el-button>
      <el-button plain size="small" type="danger" @click.prevent="removeRule(ruleForm.id)" v-if="pid">删除</el-button>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue';
import { Breadcrumb, BreadcrumbItem, Icon, Divider, Form, FormItem, Input, Radio, RadioGroup, RadioButton, Switch, Checkbox, CheckboxGroup } from 'element-ui';

import Rule from '../../libs/Rule';

Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Icon);
Vue.use(Divider);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

export default {
  name: 'OptionsEdit',
  data: function() {
    return {
      ruleForm: {
        keyword: '',
      },
      ruleTask: {
        taskEnabled: 'close',
        period: '1h',
        timeUnit: 'hour',
        timings: [0],
      },
      rules: {
        keyword: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        searchArea: [{ required: true, message: '请选择检索范围', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.pid = this.$route.params.ID;
    if (this.pid) {
      this.$store.getRuleByID(this.pid).then(rule => {
        this.ruleForm = rule;
      });
    } else {
      this.ruleForm = new Rule({ ticking: true });
    }
    this.ruleTask.taskEnabled = (this.ruleForm.ticking && this.ruleForm.timingTask && this.ruleForm.timingTask.type) || 'close';
  },
  methods: {
    save() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 本地存储
          this.$store.saveRule(this.ruleForm, !!this.pid).then(() => {
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
      }).then(() => {
        return this.$store.removeRuleByID(id).then(
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
.rule-form {
  width: 680px;
}
.regular-warp {
  display: flex;
}

.regular-warp .el-radio {
  line-height: 40px;
}
</style>
