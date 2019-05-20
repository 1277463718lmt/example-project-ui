<template lang="pug">
    el-card
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="id" label="编号" min-width="20")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="sid" label="学号" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.sid }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(align="center" prop="filename" label="文件名" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.filename }}
            el-table-column(align="center" prop="created" label="提交时间" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.created.replace("T"," ").substring(0,19) }}
            el-table-column(label="操作" align="center" min-width="200" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="download(scope.row)") 下载
                    el-button( size="mini" type="danger" @click="handleDelete(scope.row)") 删除文件
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
import { put, post ,_delete} from '@/api/service'
export default {
  name:'table_allgp',
  data(){
   return {
       query: {
            currentPage: 1,
            pageSize: 10
        },
       total: 0,
       tableData: [
       ],
       listLoading: false
   }
  },
  created() {
      this.getData()
  },
  methods: {
    header({ row, column, rowIndex, columnIndex }) {
        return 'primary-row'
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
            size: this.query.pageSize
        }
        post('/apis/api/teacher/file/search',param).then(response => {
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
    download(row) {
        window.location.href = row.fileurl
    },
    handleDelete(row) {
        this.$confirm(
        "此操作将永久删除该条数据和文件, 是否继续?",
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
        ).then(() => {
        _delete('/apis/api/teacher/file/delete/' + row.id)
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
  }
}
</script>
<style scoped>
</style>