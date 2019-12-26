<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" v-model="selectClusterIndex"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-form ref="form" :model="columnForm" :rules="rules" 
            label-width="110px" class="mt-3">
            <el-form-item label="字段表空间" prop="namespace">
                <el-input v-model="columnForm.namespace" size="medium" placeholder="请输入删字段的表空间"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="字段表名" prop="tableName">
                <el-input v-model="columnForm.tableName" size="medium" placeholder="请输入删字段的表名"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="字段名称" prop="name">
                <el-input v-model="columnForm.name" size="medium" placeholder="请输入字段名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="ml-3"
            @click="deleteColumn"
            :disabled="deleteButtonDisabled">确认删除</el-button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import DB from '@/db'
    export default{
        data() {
            return {
                selectClusterIndex: null,
                columnForm: {
                    namespace: "public",
                    tableName: "",
                    name: ""
                },
                rules: {
                    namespace: [
                        { required: true, message: '请输入表空间', trigger: 'blur' }
                    ],
                    tableName: [
                        { required: true, message: '请输入表名', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入字段名', trigger: 'blur' }
                    ]
                },
                deleteButtonDisabled: false
            }
        },
        computed: {
            ...mapState({
                clusters: state=>state.cluster.clusters
            })
        },
        methods: {
            deleteColumn() {
                this.deleteButtonDisabled = true
                if (this.selectClusterIndex === null) {
                    this.$alert("请选择集群", "删除字段失败", {
                        confirmButtonText: "知道了"
                    })
                    this.deleteButtonDisabled = false
                    return false
                }
                this.$refs.form.validate((valid)=>{
                    if (valid) {
                        console.log("验证通过")
                        this.runDelete()
                    } else {
                        //console.log("验证失败")
                        this.deleteButtonDisabled = false
                        return false
                    }
                })
            },
            runDelete() {
                // console.log('开始提交新增请求')
                // 遍历集群，只能逐个请求
                let cluster = this.clusters[this.selectClusterIndex]
                // console.log(cluster)
                DB.getHosts(cluster)
                .then((result) => {
                    // console.log(result)
                    let runSingleHostResults = []
                    result.forEach(host=>{
                        host.user = host.username
                        runSingleHostResults.push(this.runSingleHost({...host}))
                    })
                    return Promise.all(runSingleHostResults)
                })
                .then(results=>{
                    console.log(results)
                    this.$alert("操作成功", "删除字段", {
                        confirmButtonText: "知道了"
                    })
                })
                .catch((err) => {
                    console.log(err)
                    this.$alert(err, "删除失败", {
                        confirmButtonText: "啊啊啊"
                    })
                })
                .finally(() => {
                    this.deleteButtonDisabled = false
                })
            },
            runSingleHost(host) {
                //console.log('处理单个host')
                let sql = `ALTER TABLE ${this.columnForm.namespace}.${this.columnForm.tableName} DROP COLUMN ${this.columnForm.name};`
                console.log('Sql：' + sql)
                return DB.runSql(host, sql)
            }
        }
    }
</script>

<style>

</style>