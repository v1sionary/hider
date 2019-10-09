<template>
  <el-card>
    <h3 class="title ellipsis">{{item.keyword || item.url}}</h3>
    <el-button
      type="primary"
      icon="el-icon-magic-stick"
      circle
      size="mini"
      @click.prevent="del(item)"
    ></el-button>
  </el-card>
</template>

<script>
import Vue from 'vue';
import { Card, Button } from 'element-ui';
import Rule from '../../libs/Rule';

import { removeByKeyword } from '../../libs/sweeper';

Vue.use(Card);
Vue.use(Button);

export default {
  name: 'RuleBoard',
  props: ['rule'],
  data: function() {
    return {
      item: {},
    };
  },
  created: function() {
    this.item = new Rule(this.rule);
  },
  methods: {
    del(rule) {
      this.$confirm('是否立刻删除相关浏览记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        removeByKeyword(rule.keyword);
      });
    },
  },
};
</script>

<style scoped>
.title {
  color: #409eff;
}
</style>