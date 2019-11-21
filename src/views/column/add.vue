<template>
    <div class="bg-white p-3">
        <el-form ref="form" :model="columnForm" label-width="100px">
            <el-form-item label="字段表名">
                <el-input v-model="columnForm.tableName" size="medium" placeholder="请输入加字段的表名"></el-input>
            </el-form-item>
            <el-form-item label="字段名称">
                <el-input v-model="columnForm.name" size="medium" placeholder="请输入字段名称"></el-input>
            </el-form-item>
            <el-form-item label="不允许为Null">
                <el-input v-model="columnForm.notNull" size="medium" placeholder="请输入是否不允许为Null"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                columnForm: {
                    tableName: "",
                    name: "",
                    notNull: false
                }
            }
        }
    }
</script>

<style>

</style>