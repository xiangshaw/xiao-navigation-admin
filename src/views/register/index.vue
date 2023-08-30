<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">标签导航 - 注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="Unique username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="confirmPassword"
          v-model="registerForm.confirmPassword"
          placeholder="Confirm Password"
          name="confirmPassword"
          :type="confirmPasswordType"
          tabindex="3"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showConfirmPassword">
          <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="form" />
        </span>
        <el-input
          ref="phone"
          v-model="registerForm.phone"
          placeholder="Phone"
          name="phone"
          type="text"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container">
          <i class="el-icon-circle-check" />
        </span>
        <el-input
          ref="code"
          v-model="registerForm.code"
          placeholder="Code"
          name="username"
          type="text"
          tabindex="3"
          auto-complete="on"
          style="width:63%"
        />
        <img :src="code" alt="" style="height:52px;width:20%;float:right" @click="getCode()">
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >register
      </el-button>
      <div class="register-button-container">
        <el-button type="text" @click="$router.push('/login')">已有账号？前往登录 >></el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getCode, register } from '@/api/user'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('确认密码与密码不匹配'))
      } else if (value.length < 1) {
        callback(new Error('确认密码不能为空'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
        callback(new Error('请输入有效的手机号'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        code: '',
        uuid: ''
      },
      // 添加确认密码字段的显示/隐藏状态
      confirmPasswordType: 'password',
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone },
          { pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/, message: '请输入有效的手机号', trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      code: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    // 获取验证码
    getCode() {
      getCode().then(response => {
        this.code = 'data:image/png;base64,' + response.data.code
        this.registerForm.uuid = response.data.uuid
      })
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
    showConfirmPassword() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = 'text' // 切换为文本显示
      } else {
        this.confirmPasswordType = 'password' // 切换为密码显示
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.registerForm.phone)) {
            this.$message.error('请输入有效的手机号')
            return
          }
          if (this.registerForm.password !== this.registerForm.confirmPassword) {
            this.$message.error('确认密码与密码不匹配')
            return
          }
          this.loading = true
          register(this.registerForm).then(response => {
            if (response.code === 200) {
              // 注册成功，显示成功消息
              this.$message.success('注册成功')
              // 注册成功后，将用户名存储到本地存储中
              localStorage.setItem('registeredUsername', this.registerForm.username)
              this.$router.push({ path: this.redirect || '/' })
            } else {
              // 注册失败，显示错误消息
              this.$message.error(response.message || '注册失败')
            }
            this.loading = false
          }).catch(error => {
            // 请求失败，显示通用错误消息
            console.error('Registration error:', error)
            // this.$message.error('注册失败，请稍后重试')
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
      margin: 0 auto 40px auto;
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
}
</style>
