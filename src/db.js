const { Client } = require('electron').remote.require('pg')

export default class DB {
    /* static createConnectUrl(params) {
        return `postgres://${params.user}:${params.password}@${params.address}:${params.port}/${params.database}`
    } */

    /* static connect(connObj, callback) {
        const client = new Client(connObj)
        return this.connectDB(client, callback)
    } */

    /* static connect(connObj) {
        const client = new Client(connObj)
        return this.connectDB(client)
    }

    static connectDB(client) {
        return new Promise((resolve, reject) => {
            client.connect()
                .then(()=>{
                    console.log('连接成功!')
                    resolve(client)
                })
                .catch(err => {
                    console.log('连接失败')
                    reject(err)
                })
        })
    } */

    static connectDB(connObj) {
        // console.log('打印connObj')
        // console.log(connObj)
        const client = new Client(connObj)
        return new Promise((resolve, reject) => {
            client.connect()
                .then(()=>{
                    // console.log('连接成功!')
                    resolve(client)
                })
                .catch(err => {
                    // console.log('连接失败')
                    reject(err)
                })
        })
    }

    static getHosts(cluster) {
        return new Promise((resolve, reject) => {
            let localClient = null
            this.connectDB(cluster)
                .then((client)=>{
                    localClient = client
                    const hostQuery = `
                    SELECT id, name, host, port, username, 
                    password, database FROM ${cluster.tableName}
                    ORDER BY id ASC`
                    return localClient.query(hostQuery)
                })
                .then(result => resolve(result.rows))
                .catch(err => reject(err))
                .finally(() => {
                    localClient.end()
                    console.log('getHosts连接已成功清理')
                })
        })
    }

    static runSql(host, sql) {
        // console.log("进入runSql")
        // console.log(host)
        return new Promise((resolve, reject) => {
            let localClient = null
            this.connectDB(host)
                .then((client)=>{
                    localClient = client
                    /* const hostQuery = `
                    SELECT id, name, host, port, username, 
                    password, database FROM ${cluster.tableName}
                    ORDER BY id ASC` */
                    return localClient.query(sql)
                })
                .then(result => resolve(result.rows))
                .catch(err => reject(err))
                .finally(() => {
                    localClient.end()
                    console.log('runSql连接已成功清理')
                })
        })
    }

    /* static getTableStructure(tableName) {
        return new Promise((resolve, reject) => {
            let localClient = null
            this.connectDB()
                .then((client)=>{
                    localClient = client
                    const structureQuery = `
                    SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
                    CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = '${tableName}'`
                    return localClient.query(structureQuery)
                })
                .then(result => resolve(result))
                .catch(err => reject(err))
                .finally(() => {
                    localClient.end()
                    console.log('连接已成功清理')
                })
        })
    } */
        
        /* return new Promise((resolve, reject) => {
            const structureQuery = `
                SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
                CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${tableName}'`
            client.query(structureQuery)
                .then(result => resolve(result))
                .catch(err => reject(err))
                .finally(() => client.end())
        }) */
    
    

    // 内部函数
    /* static connectDB(client, callback) {
        client.connect()
            .then(()=>{
                console.log('连接成功!')
                this.localClient = client
                // console.log(typeof callback)
                callback.call(null)
            })
            .catch(err => {
                console.error('连接失败！', err.stack)
            })
        // pg.defaults.ssl = useSSL
        client.connect(connectUrl, (err, client, done)=>{
            console.log('连接成功!, done为：' + done)
            let errorMessage = ''
            this.client = client
            this.done = done
            let isConnected = true
            this.handleError(err)
            if (err) {
                isConnected = false
                errorMessage = err.message
            }
            callback.apply(null, [isConnected, errorMessage, false])
        })
    }  */

    /* static disconnectDB() {
        if (this.localClient) {
            this.localClient.end()
        }
    } */

    /* static handleError(err) {
        if (err && this.localClient) {
            this.localClient.end()
        }
    } */

    /* static getTableStructure(tableName) {
        return new Promise((resolve) => {
            const structureQuery = `
                SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
                CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${tableName}'`;
            this.localClient.query(structureQuery, (titleError, resStructure) => {
                this.handleError(titleError)
                resolve(resStructure.rows)
            })
        })
    } */
    /* static getTableStructure(client, tableName) {
        return new Promise((resolve, reject) => {
            const structureQuery = `
                SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
                CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${tableName}'`
            client.query(structureQuery)
                .then(result => resolve(result))
                .catch(err => reject(err))
                .finally(() => client.end())
        })
    } */
}