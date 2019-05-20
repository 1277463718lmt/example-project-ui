<template>
  <div>
    <el-form :label-position="labelPosition" :rules="loginRules" ref="loginForm" :model="formData" class="login-form" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="formData.username" @keyup.enter.native="login" size="medium" placeholder="请输入用户名">
            <i slot="prefix" class="my-iconfont my-iconyonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" @keyup.enter.native="login" size="medium" show-password placeholder="请输入密码">
            <i slot="prefix" class="my-iconfont my-iconmima"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="8">
            <el-col :span="14"><div>
              <el-input v-model="formData.code" maxlength="4"  @keyup.enter.native="login" size="medium" prefix-icon="" placeholder="请输入验证码">
               <i slot="prefix" class="my-iconfont my-iconyanzhengma"></i>
              </el-input></div>
            </el-col>
            <el-col :span="3"><div>
              </div>
            </el-col>
            <el-col :span="8"><div @click="refreshcode">
              <img :src="code.src"></div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
           <el-button type="primary" :loading="loading" @click="login" class="login-submit">登录</el-button>
          </el-row>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { post } from '@/api/service'
import { randomLenNum } from '@/common/index'
export default {
  name: 'loginform',
  data () {
    return {
      loading: false,
      labelPosition: 'right',
      formData: {
        username: '',
        password: '',
        code: '',
        randomstr: '',
        type: 'teacher'
      },
      code: {
        src: ''
      },
      loginRules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.refreshcode()
  },
  methods: {
    refreshcode () {
      this.formData.code = ''
      this.formData.randomstr = randomLenNum(4, true)
      this.code.src = '/apis/code/' + this.formData.randomstr
    },
    login () {
        this.$refs.loginForm.validate(valid => {
        if (valid) {
            this.loading = true
            this.$store.dispatch('Login', this.formData).then(
            res => {
                this.loading = false
                if(res.data.type === 'student')
                    this.$router.push({ path: '/student' })
                else if(res.data.type === 'teacher')
                    this.$router.push({ path: '/teacher' })
                else if(res.data.type === 'admin')
                    this.$router.push({ path: '/admin' })
                else 
                    this.$router.push({ path: '/' })
                this.$notify({
                    title: '登录成功',
                    message: '登录成功',
                    type: 'success',
                    duration: 4000
                })
            }).catch(() => {
                this.refreshcode()
                this.loading = false
            })
        }
      })
    }
  }
}
</script>
<style>

</style>
