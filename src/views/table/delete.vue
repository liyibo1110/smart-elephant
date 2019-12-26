<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" v-model="selectClusterIndex"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-form ref="form" :model="tableForm" :rules="rules" 
            label-width="110px" class="mt-3">
            <el-form-item label="表空间" prop="namespace">
                <el-input v-model="tableForm.namespace" size="medium" placeholder="请输入表空间"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="表名称" prop="name">
                <el-input v-model="tableForm.name" size="medium" placeholder="请输入表名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="删除/截断" prop="trancate">
                <el-switch v-model="tableForm.trancate" active-text="截断" inactive-text="删除">
                </el-switch>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="ml-3"
            @click="deleteTable"
            :disabled="deleteButtonDisabled">确认操作</el-button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import DB from '@/db'
    export default{
        data() {
            return {
                selectClusterIndex: null,
                tableForm: {
                    namespace: "public",
                    name: "",
                    trancate: false
                },
                rules: {
                    namespace: [
                        { required: true, message: '请输入表空间', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入表名', trigger: 'blur' }
                    ],
                    trancate: [
                        { required: true, message: '请选择删除还是截断', trigger: 'change' }
                    ],
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
            deleteTable() {
                this.deleteButtonDisabled = true
                if (this.selectClusterIndex === null) {
                    this.$alert("请选择集群", "删除表失败", {
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
                    this.$alert("操作成功", this.tableForm.trancate ? "截断表" : "删除表", {
                        confirmButtonText: "知道了"
                    })
                })
                .catch((err) => {
                    console.log(err)
                    this.$alert(err, this.tableForm.trancate ? "截断失败" : "删除失败", {
                        confirmButtonText: "啊啊啊"
                    })
                })
                .finally(() => {
                    this.deleteButtonDisabled = false
                })
            },
            runSingleHost(host) {
                //console.log('处理单个host')
                let sql = ""
                if (this.tableForm.trancate) {
                    sql = `TRUNCATE ${this.tableForm.namespace}.${this.tableForm.name};`
                } else {
                    sql = `DROP TABLE ${this.tableForm.namespace}.${this.tableForm.name};`
                }
                
                console.log('Sql：' + sql)
                return DB.runSql(host, sql)
            }
        }
    }
</script>

<style>

</style>