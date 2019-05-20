<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="18")
                    el-input(@keyup.enter.native="search" placeholder="请输入姓名" size="small" v-model="query.keyword" type="text" clearable style="width:200px")
                    el-input(@keyup.enter.native="search" placeholder="请输入题目" size="small" v-model="query.keyword1" type="text" clearable style="width:200px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="2")
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 清空
                el-col(:span="2")
                     el-button( @click="handleCache" size="small" icon="el-icon-plus" type="warning" style="float:right") 导入缓存
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="id" label="编号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.name }}  
            el-table-column(align="center" prop="majors" label="专业" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.majors }}
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="grade" label="年级" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.grade }}				
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
        
        el-dialog(title="修改" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="姓名" prop="name")
                    el-input(v-model="form.name" clearable placeholder="姓名")
                el-form-item(label="题目" prop="title")
                    el-input(v-model="form.title" clearable placeholder="题目")
                el-form-item(label="年级" prop="grade")
                    el-input(v-model="form.grade" clearable placeholder="年级")

            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 修改
</template>           
<script>
import { put, post ,_delete, put1,get} from '@/api/service'
export default {
  name: 'table_allgp',
  data() {
  return {
      tableData: [
      ],
      listLoading: false,
      query: {
        currentPage: 1,
        pageSize: 10,
        keyword: '',
        keyword1: '',
      },
      total: 0,
      form:{
        name: '',
        title: '',
        grade: ''
      },
      textMap: {
          update: '编辑',
          create: '创建',
          delete: '删除',
          search: '搜索'
      },
      dialogFormVisible: false,
      rules: {
			name: [ { required: true,message: "姓名不能为空!",trigger: "blur"}],
			grade: [ { required: true,message: "年级不能为空!",trigger: "blur"}],
			title: [ { required: true,message: "标题不能为空!",trigger: "blur"}],
      }
    }
  },
    filters:{
    
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
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword,
                keyword1: this.query.keyword1
            }
            post('/apis/api/admin/allOldGP/search',param).then(response => {
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
        cancel () {
            this.dialogFormVisible = false
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
            _delete('/apis/api/admin/allOldGP/delete/' + row.id)
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
                _delete('/apis/api/admin/allOldGP/deletes')
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
        async update(formName) {
            const set = this.$refs
                        set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/admin/allOldGP/change/'+this.form.id, this.form).then(() => {
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
        handleCache() {
            this.$confirm(
            "此操作将所有您所在专业所有历年毕业题目导入缓存, 是否继续?",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
            ).then(() => {
                get('/apis/api/admin/allOldGP/cache/')
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
    }
}
</script>

<style scoped>

</style>
