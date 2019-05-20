<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="19")
                    el-input(@keyup.enter.native="search" placeholder="请输标题" size="small" v-model="query.searchText" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="2")
                    el-button( @click="handleCreate" size="small" icon="el-icon-plus" type="primary" style="float:right") 教师通知
                el-col(:span="2")
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 记录清空
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="aid" label="创建者" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.aid }}
            el-table-column(align="center" prop="title" label="标题" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}        
            el-table-column(align="center" prop="content" label="内容" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.content }}
            el-table-column(align="center" prop="created" label="创建时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.created }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
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
        
        el-dialog(title="发送邮件" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="自选模板" prop="mouldId")
                    el-select(v-model="form.mouldId" placeholder="请选择模板" @change="changeMould")
                        el-option(
                            v-for="item in mouldOptions"
                            :key="item.title"
                            :label="item.title"
                            :value="item"
                        )
                el-form-item(label="标题" prop="title")
                    el-input(v-model="form.title" clearable placeholder="标题")
                el-form-item(label="内容" prop="content")
                    el-input(v-model="form.content" clearable placeholder="内容")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="create('form')") 发送
</template>           
<script>
import { get, put, post ,_delete} from '@/api/service'
export default {
  name: 'table_teachermail',
  data() {
  return {
      tableData: [
      ],
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: ''
      },
      mouldOptions: [],
      total: 0,
      form:{
            mouldId: '',
            title: '',
            content: ''
        },
      textMap: {
          update: '编辑',
          create: '创建'
      },
      dialogFormVisible: false,
      rules: {
          title: [
            {
              required: true,
              message: "标题不能为空!",
              trigger: "blur"
            }
          ],
          content: [
            {
              required: true,
              message: "内容不能为空1",
              trigger: "blur"
            }
          ],
      }
    }
  },
    created() {
        this.getMould()
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
            this.form.title = row.title
            this.form.content = row.content
            this.dialogFormVisible = true
        },
        getMould() {
            get('/apis/api/admin/mould/all').then(response => {
                this.mouldOptions = response.data
            })
        },
        changeMould(row) {
            this.form.title = row.title
            this.form.content = row.content
        },
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword
            }
            post('/apis/api/admin/mail/teacher',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
        })
        },
        async create(formName) {
            const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    post('/apis/api/admin/sendMail/teacher', this.form)
                            .then(() => {
                                this.dialogFormVisible = false
                                this.getData()
                                this.$notify({
                                    title: '成功',
                                    message: '发送成功',
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
            _delete('/apis/api/admin/mail/delete/' + row.id)
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
                _delete('/apis/api/admin/mail/deletes/2')
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
