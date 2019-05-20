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
            el-table-column(align="center" prop="title" label="题目" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}  
            el-table-column(align="center" prop="grade" label="年级" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.grade }}
</template>
<script>
import { post } from '@/api/service'
export default {
  name:'table_allgp',
  data(){
   return {
       listLoading: false,
       tableData: [
       ],
       query:{
           currentPage:1,
           pageSize:10,
       }
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
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize
            }
            post('/apis/api/teacher/oldTitle/all',param).then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        },
    }
}
</script>
<style scoped>
</style>