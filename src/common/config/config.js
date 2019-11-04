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
                    }
                ]
            },
            {
                name: "字段管理",
                subActive: 0,
                subMenu: [
                    {
                        icon: 'el-icon-s-home',
                        name: '字段列表',
                        pathName: 'column_list'
                    },
                    {
                        icon: 'el-icon-s-home',
                        name: '字段列表2',
                        pathName: 'column_list'
                    }
                ]
            }
        ]
    }
}