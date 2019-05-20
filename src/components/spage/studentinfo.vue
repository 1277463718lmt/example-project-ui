<template lang="pug">
    el-card
        div(style="text-align:left; font-size: 30px")
            p 修改个人信息
        <br/><br/>
        div(style="float:center; width:400px;")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="姓名" prop="name")
                    el-input(v-model="form.name")
                el-form-item(label="年级" prop="grade")
                    el-input(v-model="form.grade")
                el-form-item(label="性别" prop="sex")
                    el-radio-group(v-model="form.sex")
                        el-radio-button(label=1) 男
                        el-radio-button(label=2) 女
                el-form-item(label="邮箱" prop="mail" )
                    el-input(v-model="form.mail")
                el-form-item(label="qq" prop="qq")
                    el-input(v-model="form.qq")
                el-form-item(label="手机" prop="phone" type="number")
                    el-input(v-model="form.phone")
            <br/>
            el-button(type="primary" @click="update('form')" style="float:right") 修改
            <br/>
            <br/>
</template>

<script>
import { get,put } from '@/api/service'
export default {
  name:'form_studentinfo',
  data(){
   return {
       rules:{
            name:[ {required: true, message: '请输入名字', trigger: 'blur'} ],
            grade:[ {required: true, message: '请输入年级', trigger: 'blur'} ],
            mail:[ 
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            qq:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { min: 2, max: 13,message: '请输入正确的QQ号', trigger: ['blur', 'change'] }
            ],
            phone:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { min: 11, max: 11,message: '请输入11位手机号', trigger: ['blur', 'change'] }
            ]
       },
       form:{
           sex: 1
       }
   }
  },
    created() {
        this.getData()
    },
    methods: {
    getData() {
        get('/apis/api/student/studentInfo/query').then(response => {
            this.form = response.data
        })
    },
    async update(formName) {
        const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    this.dialogFormVisible =false
                    put('/apis/api/student/studentInfo/change', this.form).then(() => {
                        this.dialogFormVisible = false
                        this.getData()
                        this.$notify({
                            title: '成功',
                            message: '修改成功',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
    }
}
</script>

<style scoped>

</style>
