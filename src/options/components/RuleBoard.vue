<template>
  <el-card>
    <div class="row-first">
      <h2 class="title ellipsis">
        <rule-status :status="item.enabled"></rule-status>
        {{item.keyword || item.url}}
      </h2>
    </div>
    <el-button
      type="primary"
      icon="el-icon-magic-stick"
      size="mini"
      @click.prevent="sweep(item)"
    >执行清除</el-button>
    <router-link
      :to="{name: 'edit', params: {ID: item.id}}"
      style="display:inline-block;margin: 0 10px;"
    >
      <el-button type="text" icon="el-icon-edit" size="mini">编辑</el-button>
    </router-link>
    <el-button
      type="text"
      icon="el-icon-switch-button"
      size="mini"
      :class="{'disable-btn' : item.enabled}"
      @click.prevent="switchStatus(item)"
    >{{item.enabled ? '停用' : '启用'}}</el-button>
  </el-card>
</template>

<script>
import Vue from 'vue';
import { Card, Button, Tooltip } from 'element-ui';

import Rule from '../../libs/Rule';
import { removeByKeyword } from '../../libs/sweeper';

import RuleStatus from './RuleStatus';

Vue.use(Card);
Vue.use(Button);
Vue.use(Tooltip);

export default {
  name: 'RuleBoard',
  props: ['rule'],
  components: { RuleStatus },
  data: function() {
    return {
      item: {},
    };
  },
  created: function() {
    this.item = new Rule(this.rule);
  },
  methods: {
    sweep(rule) {
      const isRuleEnabled = !!rule.enabled;
      const tips = isRuleEnabled ? '是否立即清除相关浏览记录?' : '该规则未启用，是否启用并清除相关浏览记录?';

      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (isRuleEnabled) return removeByKeyword(rule.keyword, rule.searchArea);
          return this.switchStatus(rule);
        })
        .then(res => {
          if (isRuleEnabled) return res;

          // isSuccess from switchStatus
          if (res === true) {
            return removeByKeyword(rule.keyword, rule.searchArea);
          }

          return false;
        })
        .then(removeCount => {
          if (removeCount === false) return;
          this.$message({
            showClose: true,
            message: `成功清除，清除条数：${removeCount}`,
            type: 'success',
          });
        });
    },
    switchStatus(rule) {
      const _data = new Rule(Object.assign({}, rule, { enabled: !rule.enabled }));
      return this.$store.saveRule(_data, true).then(isSuccess => {
        if (isSuccess === true) {
          rule.enabled = !rule.enabled;
        } else {
          this.$message({
            type: 'warning',
            showClose: true,
            message: `${rule.enabled ? '停用' : '启用'} 规则失败`,
          });
        }
        return isSuccess;
      });
    },
  },
};
</script>

<style scoped>
.row-first {
  display: flex;
  margin-bottom: 7px;
}

.title {
  margin-top: 0;
  padding-right: 10px;
  color: #333;
}
.disable-btn {
  color: #777;
}
</style>