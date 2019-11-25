export default {
    logo: "Smart-Elephant",
    indexType: [
        {
            name: "btree"
        },
        {
            name: "gin"
        },
        {
            name: "gist"
        }
    ],
    columnType: [
        {
            name: "int4",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "int8",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "varchar",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "text",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "bool",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "numeric",
            needLength: true,
            needRadixPoint: true
        },
        {
            name: "date",
            needLength: false,
            needRadixPoint: false
        },
        {
            name: "timestamp",
            needLength: true,
            needRadixPoint: false
        }
    ],
    navBar: {
        active: 0,
        list: [
            {
                name: "集群管理",
                subActive: 0,
                subMenu: [
                    {
                        icon: 'el-icon-s-home',
                        name: '集群列表',
                        pathName: 'cluster_list'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '主机列表',
                        pathName: 'host_list'
                    }
                ]
            },
            {
                name: "字段管理",
                subActive: 0,
                subMenu: [
                    {
                        icon: 'el-icon-s-home',
                        name: '字段新增',
                        pathName: 'column_add'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '字段删除',
                        pathName: 'column_delete'
                    }
                ]
            },
            {
                name: "索引管理",
                subActive: 0,
                subMenu: [
                    {
                        icon: 'el-icon-s-home',
                        name: '索引新增',
                        pathName: 'key_add'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '索引删除',
                        pathName: 'key_delete'
                    }
                ]
            },
            {
                name: "表管理",
                subActive: 0,
                subMenu: [
                    {
                        icon: 'el-icon-s-home',
                        name: '表新增',
                        pathName: 'table_add'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '表删除/截断',
                        pathName: 'table_delete'
                    }
                ]
            }
        ]
    }
}