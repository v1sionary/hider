<template>
  <div class="panel">
    <div class="row" @click="sweepAll()">
      <i :class="executing ? 'el-icon-loading':'el-icon-s-promotion'"></i>
      立刻执行
    </div>
    <div class="row executed-info disabled divider">上次执行：{{lastExecutedTime}}</div>
    <div class="row" @click="openOptionPage">
      <i class="el-icon-setting"></i>
      管理面板
    </div>
    <div class="row disabled">
      <i class="el-icon-info"></i>
      帮助
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Icon } from 'element-ui';

import { sweepByRuleList } from '../libs/sweeper';

Vue.use(Icon);

export default {
  data() {
    return {
      executing: false,
      lastExecutedTime: '--',
    };
  },
  mounted() {
    this.$store.getLastExecuted().then(info => {
      if (info && info.time) this.lastExecutedTime = info.time;
    });
  },
  methods: {
    openOptionPage() {
      this.$browser.runtime.openOptionsPage();
    },
    sweepAll() {
      this.executing = true;
      this.$store.getEnabledRules().then(rules => {
        sweepByRuleList(rules)
          .then(count => {
            this.lastExecutedTime = new Date().toLocaleString('zh-Hans-CN', { hour12: false });
            this.$store.saveLastExecuted(this.lastExecutedTime);
          })
          .finally(() => {
            this.executing = false;
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  width: 248px;
}

.row {
  padding: 0 7px;
  line-height: 36px;
  font-size: 16px;
  cursor: pointer;

  &.divider {
    border-bottom: 1px solid #e1e1e1;
  }

  &.disabled {
    cursor: default;
  }

  &:not(.disabled) {
    user-select: none; /* Likely future */
  }

  &:hover {
    background: #eeeeee;
  }

  > i {
    margin-right: 5px;
    &.el-icon-s-promotion {
      color: #409eff;
    }
  }
}
.executed-info {
  text-indent: 24px;
  font-size: 14px;
  color: #b2b2b2;
}
</style>
