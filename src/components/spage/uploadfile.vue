<template lang="pug">
    el-card
        el-table(:header-cell-class-name="header"
                    :data="tableData"
                    v-loading="listLoading"
                    fit highlight-current-row
                    style="width: 100%")
            el-table-column(align="center" prop="comment" label="备注" min-width="50")
                template(slot-scope="scope")
                    span {{ scope.row.comment }}
            el-table-column(align="center" prop="start" label="开启时间" min-width="80" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.start }}  
            el-table-column(align="center" prop="end" label="结束时间" min-width="120" show-overflow-tooltip)
                template(slot-scope="scope")
                    span {{ scope.row.end }}
            el-table-column(label="操作" align="center" min-width="170" fixed="right")
                template(slot-scope="scope")
                    el-button( :disabled="isTrue(scope.row)" size="mini" type="primary" @click="uploadfile(scope.row)")  提交

        el-dialog(:title="newTitle" :visible.sync="dialogFormVisible")
            el-form(:model="newform"  ref="newform" label-width="100px")
                el-form-item(label="文件" prop="file")
                    el-upload(v-model="form.file"
                    ref="upload"
                    :auto-upload="false"
                    action="/apis/api/student/uploadFile/upload"
                    :data="newform"
                    :headers="headers"
                    :on-success="onSuccess"
                    )
            .dialog-footer(slot="footer")
                el-button(@click="cancel") 取消
                el-button(@click="create") 上传文件
</template>

<script>
import { get } from '@/api/service'
export default {
  name:'',
  data(){
    return {
        tableData: [],
        listLoading:false,
        form:{
            file: null,
        },
        newform:{},
        newTitle:'提交文件',
        dialogFormVisible: false,
        headers: { Authorization: this.$store.getters.token},
    }
    },
    created(){
        this.getData()
    },
    methods: {
        header({ row, column, rowIndex, columnIndex }) {
            return 'primary-row'
        },
        isTrue(row) {
            var myDate = new Date()
            if(new Date(row.start).getTime() < myDate.getTime()  && new Date(row.end).getTime() < myDate.getTime() ) {
                return true
            }
            else 
            return false
        },
        uploadfile(row) {
            this.newform = row
            this.newTitle = '提交'+row.comment
            this.dialogFormVisible = true
        },
        cancel() {
            this.dialogFormVisible = false
        },
        create() {
            this.$refs.upload.submit()
        },
        getData() {
            get('/apis/api/student/gptime/fileList').then(response => {
                this.tableData = response.data
                this.listLoading = false
            })
        },
        onSuccess(response, file, fileList) {
            this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success",
                duration: 2000
            })
            this.dialogFormVisible = false
            this.getData()
        },
    }
}
</script>
<style scoped>
</style>