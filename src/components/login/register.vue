<template>
  <div>
    <el-form :rules="registerRules" :model="formData" class="register-form" ref="registerform">
        <el-form-item prop="username">
          <el-input v-model="formData.username" @keyup.enter.native="register" size="medium" placeholder="请输入用户名">
            <i slot="prefix" class="my-iconfont my-iconyonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" @keyup.enter.native="register" size="medium" show-password placeholder="请输入密码">
            <i slot="prefix" class="my-iconfont my-iconmima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password2">
          <el-input v-model="formData.password2" @keyup.enter.native="register" size="medium" show-password placeholder="请再次输入密码">
            <i slot="prefix" class="my-iconfont my-iconmima"></i>
          </el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="register" class="register-submit">注册</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { post } from '@/api/service'
export default {
  name: 'register',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formData.password2 !== '') {
          this.$refs.registerform.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        username: '',
        password: '',
        password2: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        password2: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    register () {
      const tempdata = {
        username: this.formData.username,
        password: this.formData.password
      }
      post('/user/user/create', tempdata).then(response => {
        if (response.data !== null) {
          this.$notify({
            title: '成功',
            message: '注册成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: response.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style>

</style>
