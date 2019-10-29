<template>
  <div>
    <div class="hider-panel">
      <router-link to="/edit/">
        <el-button type="primary" plain size="small" icon="el-icon-plus">新增</el-button>
      </router-link>
      <el-button class="sweep-all" type="text" size="small" icon="el-icon-magic-stick" @click="sweepAll">执行所有任务</el-button>
    </div>
    <el-row>
      <el-col class="rule-container" :span="24" v-if="rules.length === 0">暂无数据</el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="8" class="rule-container" v-for="rule in rules" :key="rule.id">
        <rule-board :rule="rule" @delete-rule="onDeleteItem"></rule-board>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { Row, Col } from 'element-ui';
import RuleBoard from '../components/RuleBoard';
import { sweepByRule } from '../../libs/sweeper';

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
    this.fetchRules();
  },
  methods: {
    fetchRules() {
      this.$store.getRules().then(rules => {
        this.rules = rules;
      });
    },
    onDeleteItem(id) {
      const index = this.rules.findIndex(rule => rule.id === id);
      this.rules.splice(index, 1);
    },
    sweepAll() {
      this.$confirm('确定执行所有清除任务吗？', '警告！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.rules
            .filter(r => r.enabled)
            .forEach(r => {
              sweepByRule(r).then(
                removeCount => {
                  this.$message({
                    showClose: true,
                    message: `成功清除 - ${r.keyword}，清除条数：${removeCount}`,
                    type: 'success',
                    duration: 1500,
                  });
                },
                e => {
                  setTimeout(() => {
                    this.$message({
                      showClose: true,
                      message: `清除失败 - ${r.keyword}，${e}`,
                      type: 'error',
                      duration: 0,
                    });
                  });
                }
              );
            });
        })
        .catch(e => {});
    },
  },
};
</script>

<style scoped>
.rule-container {
  padding: 3px;
}

.sweep-all {
  margin-left: 7px;
}
</style>
