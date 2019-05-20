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
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 清空                
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}  
            el-table-column(align="center" prop="content" label="内容" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.content }}
            el-table-column(align="center" prop="status" label="状态" min-width="30")
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
                el-form-item(label="题目" prop="title")
                    el-input(v-model="form.title" clearable placeholder="题目")
                el-form-item(label="内容" prop="content")
                    el-input(v-model="form.content" clearable placeholder="内容")
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
  name: 'table_mould',
  data() {
  return {
      listLoading: false,
      tableData: [
      ],
      query: {
            currentPage: 1,
            pageSize: 10,
            keyword: ''
        },
      total: 0,
      form:{
          title:'',
          content: '',
          status: 1
      },
      textMap: {
          update: '编辑',
          create: '创建',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
			title: [ { required: true,message: "标题不能为空!",trigger: "blur"}],
            content: [ { required: true,message: "内容不能为空!",trigger: "blur"}],
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
            return typeMap[type];
        }
  },
    created() {
        this.getData()
    },
    methods: {
        search(){
            this.query.currentPage = 1
            this.getData()
        },
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        sizeChange(size) {
            this.query.pageSize = size
            this.getData()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData()
        },
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleUpdate(row){
            this.dialogStatus = 'update'
            this.form = row
            this.dialogFormVisible = true
        },
        cancel() {
            this.dialogFormVisible = false
        },
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword
            }
            post('/apis/api/admin/mould/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        async create(formName) {
            const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    post('/apis/api/admin/mould/add', this.form)
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
        } ,
        async update(formName) {
            const set = this.$refs
                        set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/admin/mould/change/'+this.form.id, this.form).then(() => {
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
            _delete('/apis/api/admin/mould/delete/' + row.id)
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
            "此操作将永久删除所有记录, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
                _delete('/apis/api/admin/mould/deletes')
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
