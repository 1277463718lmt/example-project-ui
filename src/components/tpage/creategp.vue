<template lang="pug">
    el-card
        .clearfix(slot="header")
            el-row(:gutter="5")
                    el-button( @click="handleCreate" size="small" icon="el-icon-plus" type="primary" style="float:left") 新增
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")                    
            el-table-column(align="center" prop="title" label="题目" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.title }}
            el-table-column(align="center" prop="comment" label="备注" min-width="80")
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="status" label="状态" min-width="80")
                template(slot-scope="scope")
                    el-tag(:type="scope.row.status==0?'danger':'success'") {{ scope.row.status | statuschange }}                   
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( v-if="scope.row.status!=1"  size="mini" type="primary" @click="handleUpdate(scope.row)") 编辑
                    el-button( v-if="scope.row.status!=1" size="mini" type="danger" @click="handleDelete(scope.row)") 撤销
        
        el-dialog(:title="textMap[dialogStatus]" :visible.sync="dialogFormVisible")
            el-form(:model="form" :rules="rules" ref="form" label-width="100px")
                el-form-item(label="标题" prop="title")
                    el-input(v-model="form.title" clearable placeholder="标题")
                el-form-item(label="备注" prop="comment")
                    el-input(v-model="form.comment" clearable placeholder="备注")

            .dialog-footer(slot="footer")
                el-button(@click="cancel('form')") 取消
                el-button(v-if="dialogStatus=='create'" type="primary" @click="create('form')") 确定
                el-button(v-else type="primary" @click="update('form')") 修改
</template>           
<script>
import { get,put, post ,_delete} from '@/api/service'
export default {
  name: 'table_studentinfo',
  data() {
  return {
      tableData: [
      ],
      form:{
      },
      textMap: {
          update: '编辑',
          create: '创建',
          delete: '删除',
          search: '搜索'
      },
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
			title: [ { required: true,message: "标题不能为空!",trigger: "blur"}],
			comment: [ { required: true,message: "备注不能为空!",trigger: "blur"}],        
      }
    }
  },
    filters:{
        statuschange(type) {
            const typeMap = {
                0: "正在审核",
                1: "已通过审核"
                };
            return typeMap[type]
        }
    },
    created() {
        this.getData()
    },
    methods: {
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        getData() {
            get('/apis/api/teacher/gptitle/search').then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        },
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleUpdate(row){
            this.dialogStatus = 'update'
            this.form = row
            this.dialogFormVisible = true
        },
        async create(formName) {
            const set = this.$refs
                    set[formName].validate(valid => {
                if (valid) {
                    post('/apis/api/teacher/gptitle/add', this.form)
                        .then(() => {
                            this.dialogFormVisible = false
                            this.getData()
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                } else {
                    return false
                }
            })
        },
        async update(formName) {
            const set = this.$refs
                        set[formName].validate(valid => {
                    if (valid) {
                        this.dialogFormVisible =false
                        put('/apis/api/teacher/gptitle/change/'+this.form.id, this.form).then(() => {
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
            _delete('/apis/api/teacher/gptitle/delete/' + row.id)
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
