<template>
    <div id="tester">
        测试内容
    </div>
</template>

<script>
import DB from '@/db'
export default {
    props: {

    },
    mounted() {
        console.log("准备尝试查询数据库")
        /* const connObj = {
            user: "postgres",
            password: "dev@yjxd.com_euci",
            host: "192.168.3.23",
            port: "5432",
            database: "postgres"
        } */
        /* DB.connect(connObj, () => {
            console.log('Tester的callback已被执行!')
            DB.getTableStructure('domain_db_mapping')
                .then((result) => {
                    console.log('查询成功')
                    console.log(result)
                })
                .catch((err) => {
                    console.log('查询失败')
                    console.log(err)
                })
        }) */
        /* DB.connect(connObj)
            .then((client) => {
                console.log('获取连接对象成功，开始查询')
                console.log(client)
                return DB.getTableStructure(client, 'domain_db_mapping')
            })
            .then((result) => {
                console.log('查询成功')
                console.log(result)
            })
            .catch((err) => {
                console.log(err.stack)
            }) */
        DB.getTableStructure('domain_db_mapping')
            .then((result) => {
                console.log('查询成功')
                console.log(result)
            })
            .catch((err) => {
                console.log(err.stack)
            })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
