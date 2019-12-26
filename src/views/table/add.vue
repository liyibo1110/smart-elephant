<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" v-model="selectClusterIndex"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-form ref="form" :model="tableForm" :rules="rules" 
            label-width="110px" class="mt-3">
            <el-form-item label="建表语句" prop="fullSql">
                <el-input type="textarea" 
                    autosize
                    v-model="tableForm.fullSql" size="medium" placeholder="直接输入建表SQL语句，没必要做细"
                    style="width: 800px;"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="ml-3"
            @click="addTable"
            :disabled="addButtonDisabled">确认新增</el-button>
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
                    fullText: ""
                },
                rules: {
                    fullText: [
                        { required: true, message: '请输入建表语句', trigger: 'blur' }
                    ]
                },
                addButtonDisabled: false
            }
        },
        computed: {
            ...mapState({
                clusters: state=>state.cluster.clusters
            })
        },
        methods: {
            addTable() {
                // console.log("点击了新增字段按钮")
                // 手动验证是否选择了集群
                // if 
                // console.log(this.selectClusterIndex)
                this.addButtonDisabled = true
                if (this.selectClusterIndex === null) {
                    this.$alert("请选择集群", "新增索引失败", {
                        confirmButtonText: "知道了"
                    })
                    this.addButtonDisabled = false
                    return false
                }
                this.$refs.form.validate((valid)=>{
                    if (valid) {
                        console.log("验证通过")
                        this.runAdd()
                    } else {
                        //console.log("验证失败")
                        this.addButtonDisabled = false
                        return false
                    }
                })
            },
            runAdd() {
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
                    this.$alert("操作成功", "新增表", {
                        confirmButtonText: "知道了"
                    })
                })
                .catch((err) => {
                    console.log(err)
                    this.$alert(err, "新增失败", {
                        confirmButtonText: "啊啊啊"
                    })
                })
                .finally(() => {
                    this.addButtonDisabled = false
                })
            },
            runSingleHost(host) {
                //console.log('处理单个host')
                // 构造CREATE SQL
                let sql = `${this.tableForm.fullSql}`
                console.log('Sql：' + sql)
                return DB.runSql(host, sql)
            }
        }
    }
</script>

<style>

</style>