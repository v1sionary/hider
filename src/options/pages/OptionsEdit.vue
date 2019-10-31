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
            <el-checkbox v-for="t in timingList" :label="t.v" :key="t.k" name="timings">{{ t.k }}</el-checkbox>
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

const [hour_opts, day_opts, date_opts] = [
  [{ v: 0, k: '0点' }, { v: 8, k: '8点' }, { v: 12, k: '12点' }, { v: 17, k: '17点' }, { v: 21, k: '21点' }, { v: 23, k: '23点' }],
  [{ v: 1, k: '一' }, { v: 2, k: '二' }, { v: 3, k: '三' }, { v: 4, k: '四' }, { v: 5, k: '五' }, { v: 6, k: '六' }, { v: 7, k: '七' }],
  [{ v: 1, k: '1日' }, { v: 10, k: '10日' }, { v: 15, k: '15日' }, { v: 20, k: '20日' }],
];

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
  computed: {
    timingList: function() {
      return this.ruleTask.timeUnit === 'hour' ? hour_opts : this.ruleTask.timeUnit === 'day' ? day_opts : date_opts;
    },
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
  width: 780px;
}
.regular-warp {
  display: flex;
}

.regular-warp .el-radio {
  line-height: 40px;
}
</style>
