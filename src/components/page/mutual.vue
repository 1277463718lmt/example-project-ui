<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="17")
                    el-input(@keyup.enter.native="search" placeholder="请输入教工号" size="small" v-model="query.keyword" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                  
            el-table-column(align="center" prop="tid1" label="教工号1" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.tid1 }}
            el-table-column(align="center" prop="tid2" label="教工号2" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.tid2 }}    
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
        
        el-dialog(title="编辑" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="教工号1" prop="tid1")
                    el-input(v-model="form.tid1" clearable placeholder="教工号1" :disabled="true")
                el-form-item(label="教工号2" prop="tid2")
                    el-input(v-model="form.tid2" clearable placeholder="教工号2")

            .dialog-footer(slot="footer")
                el-button(@click="cancel") 取消
                el-button(type="primary" @click="update('form')") 修改
</template>           
<script>
import { put, post } from '@/api/service'
export default {
  name: 'table_mutual',
  data() {
  return {
      tableData: [
      ],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: '',
        },
      total: 0,
      form:{
        tid1:'',
        tid2: ''
      },
      dialogFormVisible: false,
      rules: {
			tid1: [ { required: true,message: "教工号不能为空!",trigger: "blur"}],
			tid2: [ { required: true,message: "教工号不能为空!",trigger: "blur"}]
      }
    }
  },
    filters:{
    },
    created() {
        this.getData()
    },
    methods: {
        cancel() {
            this.dialogFormVisible = false
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
            post('/apis/api/admin/mutual/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
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
                    put('/apis/api/admin/mutual/change/' + this.form.tid1, this.form).then(() => {
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
