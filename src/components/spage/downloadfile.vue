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
            el-table-column(align="center" prop="filename" label="文件名" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.filename }}
            el-table-column(align="center" prop="filename" label="备注" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="download(scope.row.fileurl)") 下载             
</template>
<script>
import { get } from '@/api/service'
export default {
  name:'table_allgp',
  data(){
   return {
       tableData: [
       ],
       listLoading:false,
   }
  },
  created() {
      this.getData()
  },
    methods: {
        download(row){
            window.location.href = row
        },
        getData(){
            this.listLoading=true
            get('/apis/api/student/fileMould/all').then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        }
    }
}
</script>
<style scoped>
</style>