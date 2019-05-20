<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="1")
                el-col( :span="2")
                    el-select(v-model="query.keyword" placeholder="请选择" style="width:100px !important;")
                        el-option(
                            v-for="item in stateArr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value")
                el-col( :span="19")
                    el-input(@keyup.enter.native="search" placeholder="请输入教工号" size="small" v-model="query.keyword1" type="text" clearable style="width:290px")
                        el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="id" label="编号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.id }}
            el-table-column(align="center" prop="title" label="标题" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.title }}        
            el-table-column(align="center" prop="comment" label="备注" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="tid" label="教工号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.tid }}
            el-table-column(align="center" prop="status" label="状态" min-width="80")
                template(slot-scope="scope")
                    el-tag(:type="scope.row.status==0?'danger':'success'") {{ scope.row.status | statuschange }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="handleSuccess(scope.row)") 通过
                    el-button( size="mini" type="danger" @click="handleDelete(scope.row)") 拒绝&删除
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
</template>           
<script>
import { put, post ,_delete, post1} from '@/api/service'
export default {
    name: 'table_gp_title',
    data() {
    return {
        tableData: [
        ],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: 0,
            keyword1: ''
        },
        total: 0,
        stateArr: [
            { 
                value: '', 
                label: '全部' 
            }, 
            {
                value: 1,
                label: '已审核'
            }, 
            {
                value: 0,
                label: '未审核'
            }],
            listLoading: false
        }
    },
    filters:{
        statuschange(type) {
            const typeMap = {
                1: "已通过",
                0: "未通过"
                };
                return typeMap[type];
        }
    },
    created() {
        this.getData()
    },
    methods: {
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
                keyword: this.query.keyword,
                keyword1: this.query.keyword1,
            }
            post('/apis/api/admin/gpTitle/search',param).then(response => {
                this.tableData = response.data.content
                this.total = response.data.totalElements
                this.listLoading = false
            })
        },
        handleSuccess(row) {
            post1('/apis/api/admin/gpTitle/change/'+ row.id).then(response => {
                this.getData()
                this.$notify({
                    title: '成功',
                    message: '已通过审核！',
                    type: 'success',
                    duration: 2000
                })
            })
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
                _delete('/apis/api/admin/gpTitle/delete/'+ row.id)
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
