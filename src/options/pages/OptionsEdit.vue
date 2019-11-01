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
    </el-form>

    <el-divider content-position="center">
      <i class="el-icon-alarm-clock"></i>
    </el-divider>

    <el-form :model="ruleTask" :rules="taskRules" ref="ruleTask" label-width="80px" class="rule-form">
      <el-form-item label="定时任务" prop="taskEnabled">
        <el-radio-group v-model="taskEnabled" size="mini">
          <el-radio-button label="close" name="taskEnabled">关闭</el-radio-button>
          <el-radio-button label="periodic" name="taskEnabled">间隔</el-radio-button>
          <el-radio-button label="regular" name="taskEnabled">定时</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="间隔" prop="period" v-if="taskEnabled === 'periodic'">
        <el-radio-group v-model="ruleTask.period" size="mini">
          <el-radio label="15min" name="period">15分钟</el-radio>
          <el-radio label="30min" name="period">30分钟</el-radio>
          <el-radio label="1h" name="period">1小时</el-radio>
          <el-radio label="12h" name="period">12小时</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="定期" prop="timings" v-if="taskEnabled === 'regular'">
        <div class="regular-warp">
          <el-radio-group v-model="ruleTask.timeUnit" size="mini" style="line-height:40px;" @change="resetTimings">
            <el-radio-button label="hour" name="timeUnit">每天</el-radio-button>
            <el-radio-button label="day" name="timeUnit">每周</el-radio-button>
            <el-radio-button label="date" name="timeUnit">每月</el-radio-button>
          </el-radio-group>

          <el-checkbox-group v-model="ruleTask.timings" size="mini" style="padding-left:10px;">
            <el-checkbox v-for="t in timingList" :label="t.v" :key="t.k" name="timings" required>{{ t.k }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>

    <el-button plain size="small" @click="save">保存</el-button>
    <el-button plain size="small" type="danger" @click.prevent="removeRule(ruleForm.id)" v-if="pid">删除</el-button>
  </div>
</template>

<script>
import Vue from 'vue';
import { Breadcrumb, BreadcrumbItem, Icon, Divider, Form, FormItem, Input, Radio, RadioGroup, RadioButton, Switch, Checkbox, CheckboxGroup } from 'element-ui';

import Rule from '../../libs/Rule';
import { PERIODS_MILLSECOND } from '../../libs/TimingTask';

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
      taskEnabled: 'close',
      ruleForm: {
        keyword: '',
      },
      ruleTask: {
        period: '1h',
        timeUnit: 'hour',
        timings: [0],
      },
      rules: {
        keyword: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        searchArea: [{ required: true, message: '请选择检索范围', trigger: 'blur' }],
      },
      taskRules: {
        timings: [{ required: true, message: '请选择时间点', trigger: 'blur' }],
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
        this.setTaskForm(this.ruleForm);
        console.log(this.ruleForm);
      });
    } else {
      this.ruleForm = new Rule(this.ruleForm);
      this.setTaskForm(this.ruleForm);
    }
  },
  methods: {
    _validate(...formRef) {
      const promises = [];

      formRef.forEach(ref => {
        promises.push(
          new Promise((resolve, reject) => {
            this.$refs[ref].validate(valid => {
              if (valid) resolve();
            });
          })
        );
      });

      return Promise.all(promises);
    },

    save() {
      this._validate('ruleForm', 'ruleTask').then(res => {
        if (this.taskEnabled) {
          this.ruleForm.ticking = true;
          this.ruleForm.timingTask = Object.assign({ type: this.taskEnabled }, this.ruleTask);
        }

        this.$store.saveRule(this.ruleForm, !!this.pid).then(() => {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success',
            duration: 1000,
          });
          this.$router.push('/');
        });
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

    // 设置表单项
    setTaskForm(rule) {
      const _task = rule.timingTask || {};

      this.taskEnabled = (rule.ticking && _task && _task.type) || 'close';

      debugger;
      this.ruleTask.period = PERIODS_MILLSECOND[_task.period] || _task.period || '1h';
      this.ruleTask.timeUnit = _task.timeUnit || 'hour';
      this.ruleTask.timings = _task.timings || [0];
    },

    resetTimings() {
      const formUnit = this.ruleTask.timeUnit;
      if (formUnit === this.ruleForm.timingTask.timeUnit) {
        this.ruleTask.timings = this.ruleForm.timingTask.timings;
      } else {
        this.ruleTask.timings = formUnit === 'hour' ? [0] : [1];
      }
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
