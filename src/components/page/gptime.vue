<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="2")
                el-col(:span="19")
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 清空
                el-col(:span="2")
                     el-button( @click="handleCreate" size="small" icon="el-icon-plus" type="primary" style="float:right") 新增
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%") 
            el-table-column(align="center" prop="comment" label="名称" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="type" label="类型" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.type | changeType}}
            el-table-column(align="center" prop="start" label="开始时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.start }}
            el-table-column(align="center" prop="end" label="结束时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.end }}
            el-table-column(align="center" prop="status" label="状态" min-width="80")
                template(slot-scope="scope")
                    el-tag(:type="scope.row.status==0?'danger':'success'") {{ scope.row.status | changestatus }}   				
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
            :page-sizes="[10,20,30,40,50]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total")
        
        el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="名称" prop="comment")
                    el-input(v-model="form.comment" clearable placeholder="名称")
                el-form-item(label="开始时间" prop="start")
                    el-date-picker(v-model="form.start"
                    value-format=" yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期"
                    )
                el-form-item(label="结束时间" prop="end")
                    el-date-picker(v-model="form.end"
                    value-format=" yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期"
                    )
                el-form-item(label="类型" prop="type")
                    el-radio-group(v-model="form.type")
                        el-radio-button(label=1) 普通
                        el-radio-button(label=2) 文件
                el-form-item(label="状态" prop="status")
                    el-radio-group(v-model="form.status")
                        el-radio-button(label=1) 正常
                        el-radio-button(label=0) 禁用
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(v-if="dialogStatus=='create'" type="primary" @click="create('form')") 确定
                el-button(v-else type="primary" @click="update('form')") 修改
</template>           
<script>
import { put, post ,_delete} from '@/api/service'
export default {
  name: 'table_gptime',
  data() {
  return {
        listLoading: false,
        tableData: [
        ],
        query: {
            currentPage: 1,
            pageSize: 10
        },
        total: 0,
        form:{
            status: 1,
            type: 1
        },
        textMap: {
            update: '编辑',
            create: '创建',
            delete: '删除',
            search: '搜索'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        rules: {
            comment: [ { required: true,message: "名称不能为空!",trigger: "blur"}],
            start: [ { required: true,message: "开始时间不能为空!",trigger: "blur"}],
            end: [ { required: true,message: "结束不能为空!",trigger: "blur"}],
            status: [ { required: true,message: "状态不能为空!",trigger: "blur"}],
        }
    }
},
    filters:{
        changestatus(type) {
        const typeMap = {
            1: "正常",
            0: "禁用"
            };
            return typeMap[type]
        },
        changeType(type) {
        const typeMap = {
            1: "普通",
            2: "文件"
            };
            return typeMap[type]
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
            }
            post('/apis/api/admin/gpTime/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        cancel () {
            this.dialogFormVisible = false
        },
        handleCreate() {
            this.form = { status: 1, type: 1 },
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleUpdate(row){
        this.dialogStatus = 'update'
        this.form = row
        this.dialogFormVisible = true
        },
        async update(formName) {
            const set = this.$refs
                        set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/admin/gpTime/change/'+this.form.id, this.form).then(() => {
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
                    post('/apis/api/admin/gpTime/add', this.form)
                            .then(() => {
                                this.dialogFormVisible = false
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
            _delete('/apis/api/admin/gpTime/delete/' + row.id)
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
                _delete('/apis/api/admin/gpTime/deletes')
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
        },
    }
}
</script>
<style scoped>
</style>
