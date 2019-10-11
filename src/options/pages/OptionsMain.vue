<template>
  <el-row>
    <el-col class="rule-container" :span="24" v-if="rules.length === 0">暂无数据</el-col>
    <el-col
      :xs="12"
      :sm="12"
      :md="12"
      :lg="8"
      class="rule-container"
      v-for="rule in rules"
      :key="rule.id"
    >
      <rule-board :rule="rule"></rule-board>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue';
import { Row, Col } from 'element-ui';
import RuleBoard from '../components/RuleBoard';

Vue.use(Row);
Vue.use(Col);

export default {
  name: 'OptionsMain',
  components: { RuleBoard },
  data: function() {
    return {
      rules: [],
    };
  },
  created() {
    this.$store.getRules().then(rules => {
      this.rules = rules;
    });
  },
};
</script>

<style scoped>
.rule-container {
  padding: 3px;
}
</style>