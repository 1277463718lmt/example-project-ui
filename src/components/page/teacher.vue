<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="19")
                    el-input(@keyup.enter.native="search" placeholder="请输入教工号" size="small" v-model="query.keyword" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="1")
                    el-button( @click="handleCreate" size="small" icon="el-icon-plus" type="primary" style="float:right") 新增
                el-col(:span="2")
                     el-button( @click="open_upload" size="small" icon="el-icon-plus" type="success" style="float:right") 导入
                el-col(:span="2")
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 清空
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="id" label="编号" min-width="30")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="teacherid" label="教工号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.teacherid }}        
            el-table-column(align="center" prop="password" label="密码" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.password }}
            el-table-column(align="center" prop="majors" label="专业" min-width="90" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.majors }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
                    el-button( size="mini" type="danger" @click="handleDelete(scope.row)") 删除
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
                el-form-item(label="教工号" prop="teacherid")
                    el-input(v-model="form.teacherid" clearable placeholder="教工号")
                el-form-item(label="密码" prop="password")
                    el-input(v-model="form.password" clearable placeholder="密码")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 修改
    
        el-dialog(title="创建" :visible.sync="dialogFormVisible3")
            el-form(:model="newform" :rules="rules" ref="newform" label-width="100px")
                el-form-item(label="教工号" prop="teacherid")
                    el-input(v-model="newform.teacherid" clearable placeholder="教工号")
                el-form-item(label="密码" prop="password")
                    el-input(v-model="newform.password" clearable placeholder="密码")
                el-form-item(label="姓名" prop="name")
                    el-input(v-model="newform.name" clearable placeholder="姓名")
                el-form-item(label="名额" prop="num")
                    el-input-number(v-model="newform.num" :min="1" :max="10" placeholder="名额")
                el-form-item(label="中期互查教工号" prop="tid2")
                    el-input(v-model="newform.tid2" clearable placeholder="中期互查教工号")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="create('form')") 创建

        el-dialog(title="选择文件" :visible.sync="dialogFormVisible1")
            p 备注: excel文件从左到右每列为教工号、密码、姓名、名额、互查教师的教工号
            <br/><br/><br/>
            el-upload(class="upload-class"
                        name="file"
                        drag
                        action="/apis/api/admin/excel/addTeachers"
                        :headers="headers"
                        accept=".xls,.xlsx"
                        :before-upload="onBeforeUpload"
                        :on-success="onSuccess"
                        )
                i(class="el-icon-upload")
                div(class="el-upload__text") 将文件拖到此处，或
                    em 点击上传
            .dialog-footer(slot="footer")
                el-button(@click="cancel") 离开
</template>           
<script>
import { put, post ,_delete} from '@/api/service'
export default {
  name: 'table_teacher',
  data() {
  return {
    tableData: [
    ],
    query: {
        currentPage: 1,
        pageSize: 10,
        keyword: ''
    },
    listLoading: false,
    headers: { Authorization: this.$store.getters.token},
    total: 0,
    form:{
        teacherid: '',
        password: '',
    },
    newform: {
        teacherid: '',
        num:1,
        password: '',
        name:'',
        tid2:''
    },
    dialogFormVisible1: false,
    dialogFormVisible3: false,
    textMap: {
        update: '编辑',
        create: '创建',
    },
    dialogFormVisible: false,
    rules: {
        teacherid: [
        {
            required: true,
            message: "教工号不能为空!",
            trigger: "blur"
        }
        ],
        password: [
        {
            required: true,
            message: "密码不能为空！",
            trigger: "blur"
        }
        ],
        name: [
        {
            required: true,
            message: "名字不能为空！",
            trigger: "blur"
        }
        ],
    }
    }
},
    created() {
        this.getData()
    },
    methods: {
        sizeChange(size) {
            this.query.pageSize = size
            this.getData()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData()
        },
        onBeforeUpload(file) {
            const laststring = file.name.substring(file.name.lastIndexOf('.')+1)
            if (laststring != 'xlsx' && laststring != 'xls'){
                this.$notify({
                    title: '导入失败',
                    message: '只允许导入.xlsx或者.xls文件',
                    type: 'warning',
                    duration: 3000
                })
                return false
            }
        },
        onSuccess(response, file, fileList) {
            this.getData()
            this.dialogFormVisible1 = false
            this.$message({
                    message: '成功导入教师账号:'+response.data.teacherCount + '个，' + '教师信息:' +response.data.teacherCountInfoCount +'个,' + '互查教师:'+response.data.mutualCount+'个',
                    type: 'success',
                    duration: 6000
            })
        },
        search() {
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
            post('/apis/api/admin/teacher/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        cancel () {
            this.dialogFormVisible = false
            this.dialogFormVisible1 =false
            this.dialogFormVisible3 =false
        },
        open_upload () {
            this.dialogFormVisible1 = true
        },
        handleCreate() {
            this.form =
            this.dialogFormVisible3 = true
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
                        put('/apis/api/admin/teacher/update/'+this.form.id, this.form).then(() => {
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
        async create(formName) {
            const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    post('/apis/api/admin/teacher/add', this.newform)
                            .then(() => {
                                this.dialogFormVisible3 = false
                                this.getData()
                                this.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 2000
                                })
                            })
                } else {
                    return false
                }
            })
        },
        handleDelete(row) {
            this.$confirm(
            "此操作将永久删除该条数据, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
            _delete('/apis/api/admin/teacher/delete/' + row.id)
                .then(() => {
                this.getData()
                this.$notify({
                    title: "成功",
                    message: "删除成功",
                    type: "success",
                    duration: 2000
                })
                })
            })
        },
        handleDeletes() {
            this.$confirm(
            "此操作将永久删除你管理的所有教师账号及信息, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
                _delete('/apis/api/admin/teacher/deletes')
                .then(() => {
                    this.getData()
                    this.$notify({
                        title: "成功",
                        message: "清空成功",
                        type: "success",
                        duration: 2000
                    })
                })
            })
    }
  }
}
</script>

<style scoped>

</style>
