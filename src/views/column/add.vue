<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" v-model="selectClusterIndex"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-form ref="form" :model="columnForm" :rules="rules" 
            label-width="110px" class="mt-3">
            <el-form-item label="表空间名" prop="namespace">
                <el-input v-model="columnForm.namespace" size="medium" placeholder="请输入表空间名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="字段表名" prop="tableName">
                <el-input v-model="columnForm.tableName" size="medium" placeholder="请输入加字段的表名"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="字段名称" prop="name">
                <el-input v-model="columnForm.name" size="medium" placeholder="请输入字段名称"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="字段类型" prop="type">
                <el-select placeholder="请选择类型" @change="columnTypeChange"
                    v-model="columnForm.type"
                    style="width: 300px;">
                <el-option v-for="(item, index) in columnType" :key="index" 
                    :label="item.name" :value="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="不允许为Null" prop="notNull">
                <el-switch v-model="columnForm.notNull" active-text="不允许" inactive-text="允许">
                </el-switch>
            </el-form-item>
            <el-form-item label="默认值">
                <el-input v-model="columnForm.defaultValue" size="medium" placeholder="请输入默认值，没有就不填"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="注释">
                <el-input v-model="columnForm.comment" size="medium" placeholder="请输入注释说明"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="长度" prop="length" v-if="formLengthDisplay">
                <el-input v-model="columnForm.length" size="medium" placeholder="请输入长度"
                    style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item label="小数点精度" prop="radixPoint" v-if="formRadixPointDisplay">
                <el-input v-model="columnForm.radixPoint" size="medium" placeholder="请输入小数点精度"
                    style="width: 300px;"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" class="ml-3"
            @click="addColumn"
            :disabled="addButtonDisabled">确认新增</el-button>
    </div>
</template>

<script>
    import { mapState } from "vuex"
    import DB from '@/db'
    export default{
        data() {
            return {
                columnType: this.$conf.columnType,
                selectClusterIndex: null,
                columnForm: {
                    namespace: "public",
                    tableName: "",
                    name: "",
                    type: "",
                    notNull: false,
                    defaultValue: "",
                    comment: "",
                    length: 0,
                    radixPoint: 0
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
                    ],
                    type: [
                        { required: true, message: '请选择字段类型', trigger: 'change' }
                    ],
                    notNull: [
                        { required: true, message: '请选择是否允许为Null', trigger: 'change' }
                    ],
                    length: [
                        { required: true, message: '请输入长度', trigger: 'blur' }
                    ],
                    radixPoint: [
                        { required: true, message: '请输入小数点精度', trigger: 'blur' }
                    ]
                },
                formLengthDisplay: true,
                formRadixPointDisplay: true,
                addButtonDisabled: false
            }
        },
        computed: {
            ...mapState({
                clusters: state=>state.cluster.clusters
            })
        },
        methods: {
            columnTypeChange(index) {
                // console.log(index)
                let type = this.columnType[index]
                console.log(type)
                // 控制长度和精度的显示
                this.formLengthDisplay = type.needLength
                this.formRadixPointDisplay = type.needRadixPoint 
            },
            addColumn() {
                // console.log("点击了新增字段按钮")
                // 手动验证是否选择了集群
                // if 
                // console.log(this.selectClusterIndex)
                this.addButtonDisabled = true
                if (!this.selectClusterIndex) {
                    this.$alert("请选择集群", "新增字段失败", {
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
                    this.$alert("操作成功", "新增字段", {
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
                // 构造ALTER SQL
                let typeSql = this.columnType[this.columnForm.type].name
                // console.log("typeSql:" + typeSql)
                if (typeSql === "timestamp") {
                    typeSql += `(${this.columnForm.length})`
                } else if (typeSql === "numeric") {
                    typeSql += `(${this.columnForm.length},${this.columnForm.radixPoint})`
                }
                // console.log("typeSql:" + typeSql)
                let notNullSql = this.columnForm.notNull ? " NOT NULL" : ""
                let defaultValue = ""
                if (this.columnType[this.columnForm.type].name === "varchar" || this.columnType[this.columnForm.type].name === "text") {
                    defaultValue = this.columnForm.defaultValue !== "" ? " DEFAULT '" + this.columnForm.defaultValue + "'" : ""
                } else {
                    defaultValue = this.columnForm.defaultValue !== "" ? " DEFAULT " + this.columnForm.defaultValue : ""
                }
                let defaultValueSql = defaultValue
                //let defaultValueSql = this.columnForm.defaultValue !== "" ? " DEFAULT " + this.columnForm.defaultValue : ""
                let sql = `ALTER TABLE ${this.columnForm.namespace}.${this.columnForm.tableName} ADD COLUMN ${this.columnForm.name} ${typeSql}${notNullSql}${defaultValueSql};`
                
                // 额外判断有没有注释
                let comment = this.columnForm.comment
                // console.log("comment:" + comment)
                if (comment !== undefined && comment !== "") {
                    let commentSql = `COMMENT ON COLUMN ${this.columnForm.namespace}.${this.columnForm.tableName}.${this.columnForm.name} IS '${comment}';`
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