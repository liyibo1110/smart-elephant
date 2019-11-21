export default {
    logo: "Smart-Elephant",
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
                        pathName: 'column_add'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '索引删除',
                        pathName: 'column_delete'
                    }
                ]
            }
        ]
    }
}