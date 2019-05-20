<template lang="pug">
    el-card
        p 背景颜色为黄色是你学生，粉色是中期答辩的学生
        <br/>
        <br/>
        el-table(:data="tableData"
                :row-style="rowClass"
                v-loading="listLoading"
                fit highlight-current-row
                style="width: 100%")          
            el-table-column(align="center" prop="sid" label="学号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.sid }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(align="center" prop="grade" label="年级" min-width="40")
                template(slot-scope="scope")
                    span {{ scope.row.grade }}
            el-table-column(align="center" prop="sex" label="性别" min-width="30")
                template(slot-scope="scope")
                    span {{ scope.row.sex | sexchange }}
            el-table-column(align="center" prop="mail" label="邮箱" min-width="70" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.mail }}
            el-table-column(align="center" prop="qq" label="QQ" min-width="70" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.qq }}
            el-table-column(align="center" prop="phone" label="手机号" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.phone }}
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="score1" label="指导老师评分" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.score1 }}
            el-table-column(align="center" prop="score2" label="中期答辩分数" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.score2 }}
            el-table-column(label="操作" align="center" min-width="100" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
        
        el-dialog(title="修改" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="标题" prop="title")
                    el-input(v-model="form.title" clearable placeholder="标题" disabled)
                el-form-item(label="分数" prop="score")
                    el-input-number(v-model="form.score" clearable placeholder="分数" :min="0" :max="10")
            .dialog-footer(slot="footer")
                el-button(@click="cancel") 取消
                el-button(@click="update('form')") 修改
</template>           
<script>
import { mapGetters } from 'vuex'
import { put, post ,_delete,get} from '@/api/service'
import { react } from 'babel-types';
export default {
  name: 'table_mystudent',
  data() {
  return {
      listLoading: false,
      tableData: [
      ],
      total: 0,
      form:{
        title: '',
        score: 0,
      },
      textMap: {
          update: '编辑',
          create: '创建',
          delete: '删除',
          search: '搜索'
      },
      dialogFormVisible: false,
      rules: {
			title: [ { required: true,message: "标题不能为空!",trigger: "blur"}],
			score: [ { required: true,message: "分数不能为空!",trigger: "blur"}],       
      }
    }
  },
    computed: {
        ...mapGetters(['uid'])
    },
    filters:{
        sexchange(type) {
            const typeMap = {
                1: "男",
                2: "女"
                }
        return typeMap[type];
        }
  },
  created() {
    this.getData()
  },
  methods: {
    rowClass(row, rowIndex) {
        if(this.$store.getters.uid !== row.row.tid)
            return 'background-color: pink'
        else return 'background-color: yellow'
    },
    cancel() {
        this.dialogFormVisible = false
    },
    getData() {
        get('/apis/api/teacher/myStudent/query').then(response => {
            this.tableData = response.data
            this.listLoading = false
        })
    },
    handleUpdate(row){
        this.form = row
        this.dialogFormVisible = true
    },
    async update(formName) {
        const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    this.dialogFormVisible =false
                    put('/apis/api/teacher/myStudent/change', this.form).then(() => {
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
