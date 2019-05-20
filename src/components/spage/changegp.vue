<template lang="pug">
    el-card
        div(style="text-align: left")
            h4 你的申请
        <br/><hr/><br/><br/>
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="name" label="教师" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.tid }}
            el-table-column(align="center" prop="title" label="题目" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="created" label="申请时间" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.created }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="danger" @click="handleDelete(scope.row)") 撤销
        <br/>
        div(style="text-align: left")
            h4 请选择毕业指导老师及题目
            <br/><hr/><br/><br/>
        el-row(:gutter="1")
            el-col(:span="17")
                el-input(@keyup.enter.native="search" placeholder="请输入标题" size="small" v-model="query.keyword" type="text" clearable style="width:290px")
                    el-button(slot="append" type="primary" icon='el-icon-search' @click="search")
            el-col(:span="4")
                el-button( @click="setapply" size="small" icon="el-icon-plus" type="primary" style="float:right") 申请其他题目
        el-table(:header-cell-class-name="header"
                    :data="tableData2"
                    v-loading="listLoading2"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="title" label="题目" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="comment" label="备注" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="name" label="教师" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="success" @click="handleSelect(scope.row)") 选择
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

        el-dialog(title="自定义申请" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="教师" prop="tid")
                    el-select(v-model="form.tid" placeholder="请选择")
                        el-option(v-for="item in options"
                                :key="item.tid"
                                :label="item.name"
                                :value="item.tid")
                el-form-item(label="课题名称" prop="title")
                    el-input(v-model="form.title" placeholder="请输入课题名称")
            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="create('form')") 确定
</template>
<script>
import { get,put, post ,_delete} from '@/api/service'
export default {
  name:'table_changegp',
  data(){
   return {
         listLoading :false,
        listLoading2 :false,
       total:0,
       form:{
           name: ''
       },
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: ''
        },
       tableData:[],
       tableData2: [
       ],
       dialogFormVisible: false,
        options: [
        ],
        rules: {
			name: [ { required: true,message: "请选择教师!",trigger: "blur"}],
			title: [ { required: true,message: "课题名称不能为空!",trigger: "blur"}],
        }
   }
  },
    created() {
        this.getData()
        this.getData2()
        this.getData3()
    },
    methods: {
        getData() {
            this.listLoading = true
            get('/apis/api/student/selectGP/my').then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        },
        getData2() {
            this.listLoading2 = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword
            }
            post('/apis/api/student/selectGP/search',param).then(response => {
                this.tableData2 = response.data.content
                this.total = response.data.totalElements
                this.listLoading2 = false
            })
        },
        getData3() {
            get('/apis/api/student/selectGP/tList').then(response => {
                this.options = response.data
                this.listLoading = false
            })
        },
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        cancel() {
            this.dialogFormVisible = false
        },
        search(){
            this.query.currentPage = 1
            this.getData2()
        },
        sizeChange(size) {
            this.query.pageSize = size
            this.getData2()
        },
        currentChange(currentPage) {
            this.query.currentPage = currentPage
            this.getData2()
        },
        setapply(){
            this.dialogFormVisible =true
        },
        handleDelete(row){
            _delete('/apis/api/student/selectGP/delete')
            .then(() => {
                this.getData()
                this.$notify({
                    title: "成功",
                    message: "撤销成功",
                    type: "success",
                    duration: 2000
                })
            })
        },
        async create(formName) {
            const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    post('/apis/api/student/selectGP/add', this.form)
                            .then(() => {
                                this.dialogFormVisible = false
                                this.getData()
                                this.$notify({
                                    title: '成功',
                                    message: '申请成功',
                                    type: 'success',
                                    duration: 2000
                                })
                            })
                } else {
                    return false
                }
            })
        },
        handleSelect(row) {
            post('/apis/api/student/selectGP/add', row).then(() => {
                this.dialogFormVisible = false
                this.getData()
                this.$notify({
                    title: '成功',
                    message: '申请成功',
                    type: 'success',
                    duration: 2000
                })
            })
        }
    }
}
</script>

<style scoped>

</style>
