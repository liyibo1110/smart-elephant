<template>
    <div class="bg-white p-3">
        <el-select placeholder="请选择集群" @change="clusterChange"
            v-model="value"
            style="width: 150px;">
            <el-option v-for="(item, index) in clusters" :key="index" 
                :label="item.name" :value="index"></el-option>
        </el-select>
        <el-table border class="mt-3"
            :data="hosts">
            <el-table-column
                prop="name"
                align="center"
                label="主机名称"
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
                prop="database"
                align="center"
                label="数据库名"
                width="180">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { mapState, mapMutations } from "vuex"
    import DB from '@/db'
    export default{
        data() {
            return {
                hosts: [
                    /* {
                        id: 1,
                        name: "001库",
                        host: "192.168.3.25",
                        port: "5432",
                        username: "postgres",
                        password: "dev@yjxd.com_euci",
                        database: "biz_prd_001"
                    },
                    {
                        id: 2,
                        name: "002库",
                        host: "192.168.3.26",
                        port: "5432",
                        username: "postgres",
                        password: "dev@yjxd.com_euci",
                        database: "biz_prd_002"
                    } */
                ],
                currentCluster: {},
                value: ""
            }
        },
        computed: {
            ...mapState({
                clusters: state=>state.cluster.clusters
            })
        },
        mounted() {
            /* console.log('进入mounted了')
            console.log(window) */
        },
        created() {
            // 从localStorage恢复clusters对象
            // this.recoveryClusters()
        },
        methods: {
            // ...mapMutations(['modifyClusterState']),
            clusterChange(index) {
                console.log(index)
                let cluster = this.clusters[index]
                // pg库里叫user
                cluster.user = cluster.username
                this.getHosts(cluster)
            },
            getHosts(cluster) {
                console.log(cluster)
                DB.getHosts(cluster)
                .then((result) => {
                    console.log('查询成功')
                    console.log(result)
                    this.hosts = result
                })
                .catch((err) => {
                    console.log(err.stack)
                })
            }
        }
    }
</script>

<style>

</style>