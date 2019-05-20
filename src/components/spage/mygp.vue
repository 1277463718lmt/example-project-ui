<template lang="pug">
    el-card
        div(style="text-align:left; font-size: 30px")
            p 我的毕设信息
        <br/><br/>
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="name" label="教师" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(align="center" prop="title" label="题目" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="title" label="指导教师评分" min-width="70")
                template(slot-scope="scope")
                    span {{ scope.row.score1 }}
            el-table-column(align="center" prop="title" label="中期答辩教师评分" min-width="70")
                template(slot-scope="scope")
                    span {{ scope.row.score2 }}
            el-table-column(align="center" prop="title" label="教务人员评分" min-width="70")
                template(slot-scope="scope")
                    span {{ scope.row.score }}
            el-table-column(align="center" prop="title" label="题目" min-width="70")
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="warning" @click="newDialg") 申请修改

        el-dialog(title="修改毕设题目" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="题目" prop="title")
                    el-input(v-model="form.title" clearable placeholder="题目")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 修改
</template>
<script>
import { get } from '@/api/service'
export default {
  name:'form_mygp',
  data(){
   return {
        tableData:[],
        listLoading:false,
        dialogFormVisible: false,
        form:{

        },
        tableData: [ 
        ],
        rules: {
			title: [ { required: true,message: "标题不能为空!",trigger: "blur"}]
        }
   }
  },
  created() {
      this.getData()
  },
  methods:{
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        newDialg(){
            this.form.title = this.tableData[0].title
            this.dialogFormVisible = true
        },
        getData() {
            get('/apis/api/student/myGP/query').then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        }
  }
}
</script>

<style scoped>

</style>
