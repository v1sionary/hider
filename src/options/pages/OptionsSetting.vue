<template>
  <div>
    <div class="hider-panel">
      <span class="hider-panel-title">密码验证</span>
      <el-divider></el-divider>
      <el-form class="form" ref="guarding" :model="guarding" :rules="rules.guarding" label-width="80px">
        <el-form-item label="启用" prop="enabled" size="small">
          <el-switch v-model="guarding._enabled" @change="toggleGuarding"></el-switch>
        </el-form-item>
        <transition name="fade">
          <div v-if="guarding.enabled">
            <el-form-item label="旧密码" prop="oldPassword" v-if="guarding.setPassword && passwordEditable">
              <el-input placeholder="请输入旧密码" v-model="guarding.oldPassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-button type="text" v-if="guarding.setPassword && !passwordEditable" @click.prevent="passwordEditable = !passwordEditable">修改</el-button>
              <el-input placeholder="请输入密码" v-model="guarding.password" show-password v-if="passwordEditable"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" v-if="passwordEditable">
              <el-input placeholder="请确认密码" v-model="guarding.confirmPassword" show-password></el-input>
            </el-form-item>

            <el-button plain size="mini" @click="saveGuarding" v-if="passwordEditable">保存</el-button>
          </div>
        </transition>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Divider, Form, FormItem, Input, Switch, Button } from 'element-ui';

import { getGuardingInfo, setGuarding, setPassword, verifyPassword, isPasswordVaild, resetPassword } from '../../libs/guard';

Vue.use(Divider);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Button);

export default {
  name: 'OptionsSetting',
  data: function() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入旧密码'));
      verifyPassword(value).then(equal => {
        if (equal) {
          callback();
        } else {
          callback(new Error('密码不正确'));
        }
      });
    };
    const checkPassword = (rule, value, callback) => {
      if (!value || isPasswordVaild(value)) return callback();
      callback('密码至少包含6个字符');
    };
    const confirmPassword = (rule, value, callback) => {
      if (!!this.guarding.password && value !== this.guarding.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      toggleTimer: void 0,
      passwordEditable: false,
      guarding: {
        password: '',
        _enabled: false,
        enabled: false,
        setPassword: false,
      },
      rules: {
        guarding: {
          oldPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }, { validator: checkOldPassword, trigger: 'blur' }],
          password: [{ validator: checkPassword, trigger: 'blur' }],
          confirmPassword: [{ validator: confirmPassword, trigger: 'blur' }],
        },
      },
    };
  },
  created() {
    getGuardingInfo().then(info => {
      this.guarding.enabled = this.guarding._enabled = info.enabled;
      this.guarding.setPassword = info.password;
      this.passwordEditable = !this.guarding.setPassword;
    });
  },
  methods: {
    saveGuarding() {
      this.$refs['guarding'].validate(
        vaild => {
          if (vaild) {
            const enabled = this.guarding.enabled;
            setGuarding(enabled)
              .then(() => {
                if (enabled) {
                  if (!this.guarding.password) {
                    return this.$confirm('确定要把密码设置为空吗？', '警告！', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                    }).then(() => {
                      return resetPassword().then(() => {
                        return 'RESET';
                      });
                    });
                  }

                  return setPassword(this.guarding.password);
                }
                return true;
              })
              .then(success => {
                if (success) {
                  this.$message({
                    type: 'success',
                    message: '保存成功',
                  });
                  this.guarding.setPassword = success !== 'RESET';
                  this.passwordEditable = success === 'RESET';
                } else {
                  this.$message({
                    type: 'error',
                    message: '保存失败',
                  });
                }
              });
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    toggleGuarding() {
      if (this.toggleTimer) clearTimeout(this.toggleTimer);
      this.toggleTimer = setTimeout(() => {
        const v = this.guarding._enabled;
        setGuarding(v).then(() => {
          this.guarding.enabled = v;
          if (v && !this.guarding.setPassword) {
            this.passwordEditable = true;
          } else {
            this.passwordEditable = false;
          }
          this.oldPassword = this.guarding.password = this.guarding.confirmPassword = '';
        });
      }, 300);
    },
  },
};
</script>

<style scoped>
.form {
  width: 680px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
