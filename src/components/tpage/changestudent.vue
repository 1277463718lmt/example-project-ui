<template lang="pug">
    el-card
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="sid" label="学号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.sid }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="handleAdd(scope.row)") 接受
                    el-button( size="mini" type="warning" @click="handleDelete(scope.row)") 拒绝  
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
</template>
<script>
import { put, post ,_delete,get} from '@/api/service'
export default {
  name:'table_xuanze',
  data(){
   return {
        listLoading: false,
        query: {
            currentPage: 1,
            pageSize: 10
        },
        total: 0,
        tableData: [
       ]
   }
  },
  created() {
    this.getData()
  },
  methods: {
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
    getData() {
        this.listLoading = true
        const param = {
            page: this.query.currentPage,
            size: this.query.pageSize,
        }
        post('/apis/api/teacher/applyinfo/search',param).then(response => {
            this.tableData = response.data.content
            this.total = response.data.totalElements
            this.listLoading = false
        })
    },
    handleAdd(row) {
        post('/apis/api/teacher/applyinfo/add',row).then(response => {
            this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
            })
        })
    },
    handleDelete(row) {
        _delete('/apis/api/teacher/applyinfo/delete/' + row.sid)
        .then(response =>  {
            this.getData()
            this.$notify({
                title: "成功",
                message: "拒绝成功",
                type: "success",
                duration: 2000
            })
        })
    }
  }
}
</script>
<style scoped>
</style>