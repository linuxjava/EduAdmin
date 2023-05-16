<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎{{isLogin ? '登录' : '注册'}}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLoginOrReg"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-tooltip v-if="!isLogin" v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="repassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="repasswordType"
            ref="repassword"
            v-model="loginForm.repassword"
            :type="repasswordType"
            placeholder="请输入确认密码"
            name="repassword"
            tabindex="2"
            autocomplete="on"
            @keyup.enter.native="handleLoginOrReg"/>
          <span class="show-pwd" @click="showRePwd">
            <svg-icon :icon-class="repasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:15px;margin-top: 10px" @click.native.prevent="handleLoginOrReg">{{isLogin ? '登 录' : '注 册'}}</el-button>
      <el-button type="text" style="margin-left: 0;width: 100%;text-align: right;color: white" @click="change">{{isLogin ? '注 册' : '登 录'}}</el-button>

<!--      <div style="position:relative">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">Username : editor</span>
          <span>Password : any</span>
        </div>
      </div>-->
    </el-form>
  </div>
</template>

<script>

import {login, register} from "@/api/user";
import { Message } from 'element-ui'

export default {
  name: 'Login',
  computed: {
    loginRules() {
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.loginForm.repassword !== '') {
            this.$refs.loginForm.validateField('repassword');
          }
          callback();
        }
      }
      let validateRePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.loginForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      let rules = {
        username: [{ required: true, trigger: 'blur', message: "请输入用户名" }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }

      if(!this.isLogin) {
        rules['repassword'] = [{ required: true, trigger: 'blur', validator: validateRePassword }]
      }

      return rules
    }
  },
  data() {
    return {
      isLogin: true,
      loginForm: {
        username: '',
        password: '',
        repassword: '',
      },
      passwordType: 'password',
      repasswordType: 'password',
      capsTooltip: false,
      loading: false,
      regLoading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        //解析地址http://localhost:9527/#/login?redirect=/marketing/splashsale&key=value
        //redirect未跳转地址，其它为跳转地址的参数
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showRePwd(){
      if (this.repasswordType === 'password') {
        this.repasswordType = ''
      } else {
        this.repasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.repassword.focus()
      })
    },
    handleLoginOrReg() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if(this.isLogin) {
            this.login()
          }else {
            this.register()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$store.dispatch('user/login', this.loginForm)
        .then(() => {
          //前面解析得到的数据在这里进行目标地址跳转，我们这里暂时用不到
          // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          Message.success('登录成功')
          this.$router.push({ path: '/' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    register() {
      this.$store.dispatch('user/register', this.loginForm)
        .then(() => {
          Message.success('注册成功')
          this.isLogin = true
          this.resetForm()
          this.$router.push({ path: '/login' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    change() {
      this.isLogin = !this.isLogin
      this.resetForm()
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate()
      })
    },
    resetForm() {
      this.loginForm.username = ''
      this.loginForm.password = ''
      this.loginForm.repassword = ''
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
