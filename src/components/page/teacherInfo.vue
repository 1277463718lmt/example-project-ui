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
            el-table-column(align="center" prop="tid" label="教工号" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.tid }}
            el-table-column(align="center" prop="name" label="姓名" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.name }}
            el-table-column(align="center" prop="address" label="办公室" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.address }}
            el-table-column(align="center" prop="num" label="名额" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.num }}
            el-table-column(align="center" prop="mail" label="邮箱" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.mail }}
            el-table-column(align="center" prop="qq" label="QQ" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.qq }}
            el-table-column(align="center" prop="phone" label="手机号" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.phone }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
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

        el-dialog(title="编辑" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="教工号" prop="tid")
                    el-input(v-model="form.tid" clearable placeholder="教工号")
                el-form-item(label="姓名" prop="name")
                    el-input(v-model="form.name" clearable placeholder="姓名")
                el-form-item(label="办公室" prop="address")
                    el-input(v-model="form.address" clearable placeholder="办公室")
                el-form-item(label="名额" prop="num")
                    el-input-number(v-model="form.num" :min="0" :max="20" clearable placeholder="名额")
                el-form-item(label="邮箱" prop="mail")
                    el-input(v-model="form.mail" clearable placeholder="邮箱")

            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(type="primary" @click="update('form')") 确定
</template>           
<script>
import { put, post ,_delete} from '@/api/service'
export default {
  name: 'table_teacher_info',
  data() {
  return {
		tableData: [
		],
        query: {
            currentPage: 1,
            pageSize: 10,
            keyword: ''
        },
		total: 0,
		form:{

		},
		textMap: {
			update: '编辑',
			create: '创建',
			delete: '删除',
			search: '搜索'
		},
		dialogFormVisible: false,
		rules: {
            tid: [ { required: true,message: "教工号号不能为空!",trigger: "blur"}],
            name: [ { required: true,message: "姓名不能为空!",trigger: "blur"}],
            num: [ { required: true,message: "名额不能为空!",trigger: "blur"}],
		}
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
        getData() {
            this.listLoading = true
            const param = {
                page: this.query.currentPage,
                size: this.query.pageSize,
                keyword: this.query.keyword
            }
            post('/apis/api/admin/teacherInfo/search',param).then(response => {
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
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
		handleUpdate(row){
            this.form = row
			this.dialogFormVisible = true
        },
        cancel () {
            this.dialogFormVisible = false
        },
        async update(formName) {
            const set = this.$refs
                set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/admin/teacherInfo/change/' + this.form.tid, this.form).then(() => {
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
        }
	}
}
</script>

<style scoped>

</style>
