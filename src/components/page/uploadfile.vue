<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="20")
                    el-input(@keyup.enter.native="search" placeholder="请输入学号" size="small" v-model="query.keyword" type="text" clearable style="width:150px")
                    el-input(@keyup.enter.native="search" placeholder="请输入教工号" size="small" v-model="query.keyword1" type="text" clearable style="width:200px")
                    el-input(@keyup.enter.native="search" placeholder="请输入文件名" size="small" v-model="query.keyword2" type="text" clearable style="width:200px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
                el-col(:span="3")
                    el-button( @click="handleDeletes" size="small" icon="el-icon-delete" type="danger" style="float:right") 清空文件
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="id" label="编号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="sid" label="学号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.sid }}        
            el-table-column(align="center" prop="tid" label="教工号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.tid }}
            el-table-column(align="center" prop="fileurl" label="文件链接" min-width="140")
                template(slot-scope="scope")
                    span {{ scope.row.fileurl }}
            el-table-column(align="center" prop="filename" label="文件名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.filename }}
            el-table-column(align="center" prop="created" label="创建时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.created }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="download(scope.row)") 下载
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
        
</template>           
<script>
import { put, post ,_delete} from '@/api/service'
export default {
  name: 'table_uploadfile',
  data() {
  return {
      tableData: [
      ],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: '',
            keyword1: '',
            keyword2: '',
        },
      total: 0,
      listLoading: false
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
            size: this.query.pageSize,
            keyword: this.query.keyword,
            keyword1: this.query.keyword1,
            keyword2: this.query.keyword2
        }
        post('/apis/api/admin/upload/search',param).then(response => {
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
        "此操作将永久删除该条数据, 是否继续?",
        "提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
        ).then(() => {
        _delete('/apis/api/admin/upload/delete/' + row.id)
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
            _delete('/apis/api/admin/upload/deletes')
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
    }
  }
}
</script>

<style scoped>

</style>
