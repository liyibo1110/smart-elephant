<template>
    <div class="bg-white p-3">
        <el-button size="default" type="success"
            @click="openClusterModel(false)">增加新集群</el-button>
        <el-table border class="mt-3"
            :data="clusters">
            <el-table-column
                prop="name"
                align="center"
                label="集群名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="host"
                align="center"
                label="主机地址">
            </el-table-column>
            <el-table-column
                prop="port"
                align="center"
                label="主机端口"
                width="180">
            </el-table-column>
            <el-table-column
                prop="tableName"
                align="center"
                label="集群表名"
                width="180">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="180">
                <template slot-scope="scope">
                    <el-button type="primary" plain
                        @click="openClusterModel(scope)">修改</el-button>
                    <el-button type="danger" plain
                        @click="clusterDelete(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 修改|创建集群 -->
        <el-dialog :title="clusterModelTitle" :visible.sync="clusterModel">
            <el-form ref="form" :model="clusterForm" label-width="80px">
                <el-form-item label="集群名称">
                    <el-input v-model="clusterForm.name" size="medium" placeholder="请输入集群名称"></el-input>
                </el-form-item>
                <el-form-item label="集群主机">
                    <el-input v-model="clusterForm.host" size="medium" placeholder="请输入集群主机"></el-input>
                </el-form-item>
                <el-form-item label="集群端口">
                    <el-input v-model="clusterForm.port" size="medium" placeholder="请输入集群端口"></el-input>
                </el-form-item>
                <el-form-item label="集群表名">
                    <el-input v-model="clusterForm.tableName" size="medium" placeholder="请输入集群表名"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clusterModel = false">取 消</el-button>
                <el-button type="primary" @click="comfirmClusterModel">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapMutations } from "vuex"
    export default{
        data() {
            return {
                /* clusters: [
                    {
                        name: "电商集群",
                        host: "192.168.3.23",
                        port: "5432",
                        tableName: "elc_clusters"
                    },
                    {
                        name: "舆情集群",
                        host: "192.168.3.28",
                        port: "15432",
                        tableName: "vs_clusters"
                    }
                ], */
                clusterModel: false,
                clusterEditIndex: -1,
                clusterForm: {
                    name: "",
                    host: "",
                    port: "",
                    tableName: ""
                },
                
            }
        },
        computed: {
            ...mapState({
                clusters: state=>state.cluster.clusters
            }),
            clusterModelTitle() {
                return this.clusterEditIndex > -1 ? '修改集群' : '创建集群'
            }
        },
        mounted() {
            console.log('进入mounted了')
            console.log(window)
        },
        created() {
            // 从localStorage恢复clusters对象
            this.recoveryClusters()
        },
        methods: {
            ...mapMutations(['modifyClusterState']),
            recoveryClusters() {
                console.log('开始恢复')
                let clusters = window.localStorage.getItem("clusters")
                let list = []
                if (clusters != null && clusters !== '') {
                    list = JSON.parse(clusters)
                }
                console.log('长度为：' + list.length)
                modifyClusterState(list)
                console.log('恢复完成')
            },
            openClusterModel(obj) {
                if (obj) {
                    console.log(obj)
                    const { row, $index } = obj
                    // 初始化表单
                    this.clusterForm.name = row.name
                    this.clusterForm.host = row.host
                    this.clusterForm.port = row.port
                    this.clusterForm.tableName = row.tableName
                    this.clusterEditIndex = $index
                    return this.clusterModel = true
                }
                // 创建新集群
                this.clusterFormReset()
                this.clusterModel = true
            },
            clusterFormReset() {
                this.clusterForm = {
                    name: "",
                    host: "",
                    port: "",
                    tableName: ""
                }
                this.clusterEditIndex = -1
            },
            comfirmClusterModel() {
                // 是否为修改
                if (this.clusterEditIndex > -1) {
                    this.clusterEdit()
                    return this.clusterModel = false
                }
                // 新增则追加
              /*   this.clusters.unshift({
                    name: this.clusterForm.name,
                    host: this.clusterForm.host,
                    port: this.clusterForm.port,
                    tableName: this.clusterForm.tableName,
                }) */
                let list = []
                list.push({
                    name: this.clusterForm.name,
                    host: this.clusterForm.host,
                    port: this.clusterForm.port,
                    tableName: this.clusterForm.tableName,
                })
                list = [...list, ...this.clusters]
                console.log('list长度为：' + list.length)
                // 写回去
                this.modifyClusterState(list)
                window.localStorage.setItem("clusters", JSON.stringify(list))
                return this.clusterModel = false
            },
            // 修改集群
            clusterEdit() {
                let list = [...this.clusters]
                list[this.clusterEditIndex].name = this.clusterForm.name
                list[this.clusterEditIndex].host = this.clusterForm.host
                list[this.clusterEditIndex].port = this.clusterForm.port
                list[this.clusterEditIndex].tableName = this.clusterForm.tableName
                // 写回去
                this.modifyClusterState(list)
                window.localStorage.setItem("clusters", JSON.stringify(list))
                /* this.clusters[this.clusterEditIndex].name = this.clusterForm.name
                this.clusters[this.clusterEditIndex].host = this.clusterForm.host
                this.clusters[this.clusterEditIndex].port = this.clusterForm.port
                this.clusters[this.clusterEditIndex].tableName = this.clusterForm.tableName */
            },
            // 删除集群
            clusterDelete(index) {
                this.$confirm('是否删除该集群', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                }).then(() => {
                    let list = [...this.clusters]
                    //this.clusters.splice(index, 1)
                    list.splice(index, 1)
                    // 写回去
                    this.modifyClusterState(list)
                    window.localStorage.setItem("clusters", JSON.stringify(list))
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                }).catch(() => {
                    /* this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })   */      
                })
            }
        }
    }
</script>

<style>

</style>