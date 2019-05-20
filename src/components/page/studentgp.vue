<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="0")
                el-col( :span="16")
                    el-input(@keyup.enter.native="search" placeholder="请输入学号" size="small" v-model="query.keyword" type="text" clearable style="width:200px")
                    el-input(@keyup.enter.native="search" placeholder="请输入教工号" size="small" v-model="query.keyword1" type="text" clearable style="width:200px")
                    el-input(@keyup.enter.native="search" placeholder="请输入题目" size="small" v-model="query.keyword2" type="text" clearable style="width:200px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="2")
                    el-button(round @click="handleSave" size="small" icon="el-icon-s-claim" type="warning" style="float:right") 保存到题库
                el-col(:span="2.5")
                    el-button( round @click="handleGraduate" size="small" icon="el-icon-key" type="warning" style="float:right") 毕业
                el-col(:span="2.5")
                    el-button( round @click="handleOutput" size="small" icon="el-icon-key" type="primary" style="float:right") 导出excel表            
                el-col(:span="2.5")
                     el-button(round @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 删除所有
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="sid" label="学号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.sid }}
            el-table-column(align="center" prop="tid" label="教工号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.tid }}        
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="score" label="管理员评分" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.score }}
            el-table-column(align="center" prop="score1" label="指导老师评分" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.score1 }}
            el-table-column(align="center" prop="score2" label="中期答辩老师评分" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.score2 }}
            el-table-column(align="center" prop="status" label="是否毕业" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.status | biye }}                    
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
        el-pagination.f-fr.f-mb16.f-mt16.f-mr16s(
            style="float:right"
            v-show="!listLoading"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="query.currentPage"
            :page-sizes="[10,20,30,40]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total")

        el-dialog(title="编辑" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="学号" prop="sid")
                    el-input(v-model="form.sid" clearable placeholder="学号" :disabled="true")
                el-form-item(label="教工号" prop="tid")
                    el-input(v-model="form.tid" clearable placeholder="教工号" :disabled="true")
                el-form-item(label="题目" prop="title")
                    el-input(v-model="form.title" clearable placeholder="题目" :disabled="true")
                el-form-item(label="管理员评分" prop="score")
                    el-input-number(v-model="form.score" clearable placeholder="管理员评分" :min="0" :max="80")
                el-form-item(label="毕业" prop="status")
                    el-radio-group(v-model="form.status")
                        el-radio-button(label=1) 已毕业
                        el-radio-button(label=0) 未毕业

            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 修改
        
</template>           
<script>
import { put, post ,_delete,put1,get,post2} from '@/api/service'
var fileDownload = require('js-file-download')
export default {
  name: 'table_studentgp',
  data() {
  return {
      tableData: [
      ],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: '',
            keyword1: '',
            keyword2: ''
        },
      listLoading:false,
      total: 0,
      form:{
        sid: '',
        tid: '',
        title: '',
        score: 0,
        status: 0
      },
      textMap: {
          update: '编辑',
          create: '创建',
      },
      dialogFormVisible: false,
      rules: {
			sid: [ { required: true,message: "学号不能为空!",trigger: "blur"}],
			tid: [ { required: true,message: "姓名不能为空!",trigger: "blur"}],
			title: [ { required: true,message: "年级不能为空!",trigger: "blur"}],
			score: [ { required: true,message: "分数不能为空!",trigger: "blur"}],
      }
    }
  },
    filters:{
        biye(type) {
        const typeMap = {
            0: "未毕业",
            1: "已毕业"
            };
            return typeMap[type];
        }
    },
    created() {
        this.getData()
    },
    methods: {
        cancel () {
            this.dialogFormVisible = false
        },
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        search(){
            this.query.currentPage = 1
            this.getData()
        },
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword,
                keyword1: this.query.keyword1,
                keyword2: this.query.keyword2
            }
            post('/apis/api/admin/studentGP/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        sizeChange(size) {
            this.query.pageSize = size
            this.getData()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData()
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
                    put('/apis/api/admin/studentGP/change/' + this.form.sid, this.form).then(() => {
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
    handleGraduate() {
        this.$confirm(
        "此操作将所有大于60分的未毕业学生变为已毕业状态, 是否继续?",
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
        ).then(() => {
            get('/apis/api/admin/studentGP/graduate').then(response => {
                this.$notify({
                    title: "成功",
                    message: "毕业学生人数为:" + response.data+"个",
                    type: "success",
                    duration: 2000
                })
                this.getData()
            })
            })
    },
    handleSave() {
        this.$confirm(
        "此操作将所有已经毕业学生课题题目保存到历年题目中, 是否继续?",
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
        ).then(() => {
            put1('/apis/api/admin/studentGP/save').then(response => {
                this.$notify({
                    title: "成功",
                    message: "成功导入:" + response.data+"个",
                    type: "success",
                    duration: 2000
                })
            })
            })
    },
    handleDeletes() {
        this.$confirm(
        "此操作将永久删除所有记录, 是否继续?",
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
        ).then(() => {
            _delete('/apis/api/admin/studentGP/deletes')
            .then(() => {
                this.getData()
                this.$notify({
                    title: "成功",
                    message: "清空成功",
                    type: "success",
                    duration: 2000
                })
                this.getData()
            })
        })
    },
    handleOutput() {
        post2('/apis/api/admin/excelOut/studentGP').then((res) => {      
            fileDownload(res.data, '学生毕业设计信息表.xlsx')
    　　}).catch(function (res) {}); 
    }
}
}
</script>

<style scoped>

</style>
