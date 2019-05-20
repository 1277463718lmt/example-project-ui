<template lang="pug">
    el-card()
        div(style="text-align:left; font-size: 24px")
            p 修改密码
        <br/><br/>
        <br/><br/>
        el-form(:rules="Rules" :model="formData" class="form" ref="formData" style="width:40%")
            el-form-item(prop="password")
                el-input(v-model="formData.password"  size="medium" show-password placeholder="请输入密码")
            el-form-item(prop="password2")
                el-input(v-model="formData.password2"  size="medium" show-password placeholder="请再次输入密码")
            el-form-item(align="center")
                el-button(type="primary" @click="changePsw" class="register-submit" style="width=20%") 确定修改
</template>
<script>
import { put } from '@/api/service'
export default {
  name:'',
  data(){
     var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.formData.password2 !== '') {
          this.$refs.formData.validateField('password2')
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
        password: '',
        password2: ''
      },
       Rules: {
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
        changePsw() {
            this.$refs.formData.validate(valid => {
            if (valid) {
                const param = {
                    password: this.formData.password
                }
                put('/apis/api/student/user/changePSW',param).then(response => {
                        this.$notify({
                        title: '成功',
                        message: '密码修改成功，请重新登录！',
                        type: 'success',
                        duration: 2000
                    })
                })
                //this.$store.dispatch('Loginout')
                this.$router.push('/login')
            }
            })
        }
    }
}
</script>

<style scoped>

</style>
