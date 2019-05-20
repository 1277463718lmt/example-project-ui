<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="17")
                    el-input(@keyup.enter.native="search" placeholder="请输入标题" size="small" v-model="query.keyword" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="2")
                    el-button( @click="handleCreate" size="small" icon="el-icon-plus" type="primary" style="float:right") 新增
                el-col(:span="2")
                     el-button( @click="handleCache" size="small" icon="el-icon-plus" type="success" style="float:right") 导入缓存
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="id" label="编号" min-width="40")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="filename" label="文件名" min-width="70" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.filename }}  
            el-table-column(align="center" prop="fileurl" label="文件链接" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.fileurl }}
            el-table-column(align="center" prop="comment" label="备注" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="created" label="创建时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.created }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="download(scope.row)") 下载
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
        
        el-dialog(title="编辑" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="备注" prop="comment")
                    el-input(v-model="form.comment"  placeholder="备注")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button( @click="update('form')") 修改

        el-dialog(title="创建" :visible.sync="dialogFormVisible1")
            el-form(:model="newform" :rules="rules" ref="newform" label-width="100px")
                el-form-item(label="文件" prop="file")
                    el-upload(v-model="form.file"
                    ref="upload"
                    :auto-upload="false"
                    action="/apis/api/admin/filemould/upload"
                    :data="newform"
                    :headers="headers"
                    :on-success="onSuccess"
                    )
                el-form-item(label="备注" prop="comment")
                    el-input(v-model="newform.comment" placeholder="备注")
            .dialog-footer(slot="footer")
                el-button(@click="cancel") 取消
                el-button(@click="create") 上传文件
</template>           
<script>
import { put, post ,_delete ,get } from '@/api/service'
import { thisExpression } from 'babel-types';
export default {
  name: 'table_filemould',
  data() {
  return {
        tableData: [
        ],
        listLoading: false,
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: ''
        },
        total: 0,
        form:{
            comment:''
        },
        headers: { Authorization: this.$store.getters.token},
        newform:{
            file: null,
            comment: ''
        },
        dialogFormVisible: false,
        dialogFormVisible1: false,
        rules: {
            comment: [ { required: true,message: "备注不能为空!",trigger: "blur"}],
        }
        }
    },
    filters:{
        changestatus(type) {
            const typeMap = {
            1: "正常",
            0: "禁用"
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
            this.dialogFormVisible1 =false
        },
        sizeChange(size) {
            this.query.pageSize = size
            this.getData()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData()
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
                keyword: this.query.keyword
            }
            post('/apis/api/admin/filemould/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        create() {
            this.$refs.upload.submit()
        },
        download(row) {
            window.location.href = row.fileurl
        },
        onSuccess(response, file, fileList) {
            this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success",
                duration: 2000
            })
            this.dialogFormVisible1 = false
            this.getData()
        },
        handleCache() {
            this.$confirm(
            "此操作将所有文件模板导入缓存, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
                get('/apis/api/admin/filemould/cache/')
                .then(() => {
                    this.getData()
                    this.$notify({
                        title: "成功",
                        message: "导入缓存成功",
                        type: "success",
                        duration: 2000
                    })
                })
            })
        },
        handleCreate() {
            this.dialogFormVisible1 = true
        },
        handleUpdate(row){
            this.form = row
            this.dialogFormVisible = true
        },
        handleDelete(row) {
            this.$confirm(
            "此操作将永久删除你这条记录, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
                _delete('/apis/api/admin/filemould/delete/'+ row.id)
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
        }
    }
}
</script>

<style scoped>

</style>
