<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="17")
                    el-input(@keyup.enter.native="search" placeholder="请输入学号" size="small" v-model="query.keyword" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="sid" label="学号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.sid }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.name }}        
            el-table-column(align="center" prop="grade" label="年级" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.grade }}
            el-table-column(align="center" prop="sex" label="性别" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.sex | sexchange }}
            el-table-column(align="center" prop="mail" label="邮箱" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.mail }}
            el-table-column(align="center" prop="qq" label="QQ" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.qq }}
            el-table-column(align="center" prop="phone" label="手机号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.phone }}				
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
        el-pagination.f-fr.f-mb16.f-mt16.f-mr16s(
            style="float:right"
            v-show="!listLoading"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="query.currentPage"
            :page-sizes="[10,20,30,40,50]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total")
        
        el-dialog(title="修改" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="学号" prop="sid")
                    el-input(v-model="form.sid" clearable placeholder="学号")
                el-form-item(label="姓名" prop="name")
                    el-input(v-model="form.name" clearable placeholder="姓名")
                el-form-item(label="年级" prop="grade")
                    el-input(v-model="form.grade" clearable placeholder="年级")
                el-form-item(label="性别" prop="sex")
                    el-radio-group(v-model="form.sex")
                        el-radio-button(label=1) 男
                        el-radio-button(label=2) 女
                el-form-item(label="邮箱" prop="mail")
                    el-input(v-model="form.mail" clearable placeholder="邮箱")
                el-form-item(label="QQ" prop="qq")
                    el-input(v-model="form.qq" clearable placeholder="QQ")
                el-form-item(label="手机号" prop="phone")
                    el-input(v-model="form.phone" clearable placeholder="手机号")

            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 修改
</template>           
<script>
import { put, post ,_delete} from '@/api/service'
export default {
  name: 'table_studentinfo',
  data() {
  return {
      tableData: [
      ],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: ''
        },
      total: 0,
      form: {
        sid: '',
        grade:'',
        name: '',
        sex: 1,
        mail: '',
        qq: '',
        phone: ''
      },
      textMap: {
          update: '编辑',
          create: '创建'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      listLoading: false,
      rules: {
			sid: [ { required: true,message: "学号不能为空!",trigger: "blur"}],
			name: [ { required: true,message: "姓名不能为空!",trigger: "blur"}],
			grade: [ { required: true,message: "年级不能为空!",trigger: "blur"}],
			sex: [ { required: true,message: "性别不能为空!",trigger: "blur"}],            
      }
    }
    },
    filters:{
        sexchange(type) {
            const typeMap = {
                1: "男",
                2: "女"
                };
                return typeMap[type];
        }
    },
    created() {
        this.getData()
    },
    methods: {
        cancel() {
            this.dialogFormVisible = false
        },
        search(){
            this.query.currentPage = 1
            this.getData()
        },
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword
            }
            post('/apis/api/admin/studentInfo/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        handleUpdate(row){
            this.form = row
            this.dialogFormVisible = true
        },
        sizeChange(size) {
                this.query.pageSize = size
                this.getData()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData()
        },
        async update(formName) {
            const set = this.$refs
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/admin/studentInfo/change/' + this.form.sid, this.form).then(() => {
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
        }
  }
}
</script>

<style scoped>

</style>
