<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" v-model="selectClusterIndex"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-form ref="form" :model="indexForm" :rules="rules" 
            label-width="110px" class="mt-3">
            <el-form-item label="表空间名" prop="namespace">
                <el-input v-model="indexForm.namespace" size="medium" placeholder="请输入表空间名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="索引表名" prop="tableName">
                <el-input v-model="indexForm.tableName" size="medium" placeholder="请输入加索引的表名"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label=" 索引名称" prop="name">
                <el-input v-model="indexForm.name" size="medium" placeholder="请输入索引名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="索引类型" prop="type">
                <el-select placeholder="请选择类型" @change="indexTypeChange"
                    v-model="indexForm.type"
                    style="width: 300px;">
                <el-option v-for="(item, index) in indexType" :key="index" 
                    :label="item.name" :value="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否唯一" prop="unique">
                <el-switch v-model="indexForm.unique" active-text="唯一" inactive-text="不唯一">
                </el-switch>
            </el-form-item>
            <el-form-item label="涉及字段" prop="columns">
                <el-input v-model="indexForm.columns" size="medium" placeholder="可多个字段，用小写逗号分隔"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="indexForm.comment" size="medium" placeholder="请输入注释说明"
                    style="width: 300px;"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="ml-3"
            @click="addIndex"
            :disabled="addButtonDisabled">确认新增</el-button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import DB from '@/db'
    export default{
        data() {
            return {
                indexType: this.$conf.indexType,
                selectClusterIndex: null,
                indexForm: {
                    namespace: "public",
                    tableName: "",
                    name: "",
                    type: "",
                    unique: false,
                    columns: "",
                    comment: ""
                },
                rules: {
                    namespace: [
                        { required: true, message: '请输入表空间名', trigger: 'blur' }
                    ],
                    tableName: [
                        { required: true, message: '请输入表名', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入索引名', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择索引类型', trigger: 'change' }
                    ],
                    unique: [
                        { required: true, message: '请选择是否唯一', trigger: 'change' }
                    ],
                    columns: [
                        { required: true, message: '请输入涉及字段', trigger: 'blur' }
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
            indexTypeChange(index) {
                // console.log(index)
                // let currentIndex = this.indexType[index]
                // 什么都不用做
            },
            addIndex() {
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
                    this.$alert("操作成功", "新增索引", {
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
                let typeSql = this.indexType[this.indexForm.type].name
                // console.log("typeSql:" + typeSql)
                // console.log("typeSql:" + typeSql)
                let uniqueSql = this.indexForm.unique ? " UNIQUE" : ""
                //let defaultValueSql = this.columnForm.defaultValue !== "" ? " DEFAULT " + this.columnForm.defaultValue : ""
                let sql = `CREATE${uniqueSql} INDEX ${this.indexForm.name} ON ${this.indexForm.namespace}.${this.indexForm.tableName} USING ${typeSql} (${this.indexForm.columns});`
                
                // 额外判断有没有注释
                let comment = this.indexForm.comment
                // console.log("comment:" + comment)
                if (comment !== undefined && comment !== "") {
                    let commentSql = `COMMENT ON INDEX ${this.indexForm.namespace}.${this.indexForm.name} IS '${comment}';`
                    sql += commentSql
                }
                console.log('Sql：' + sql)
                return DB.runSql(host, sql)
            }
        }
    }
</script>

<style>

</style>