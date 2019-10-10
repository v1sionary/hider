<template>
  <el-tooltip :content="status ? '启用' : '停用'" placement="right">
    <span class="status" :class="{'enabled': status}"></span>
  </el-tooltip>
</template>

<script>
import Vue from 'vue';
import { Tooltip } from 'element-ui';

Vue.use(Tooltip);

export default {
  name: 'RuleStatus',
  props: {
    status: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.status {
  display: inline-block;
  line-height: 15px;
  vertical-align: middle;
}
.status::before {
  content: '';
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #bbbbbb;
}

.status.enabled::before {
  background: #409eff;
}
</style>