const routes = [
    {
        path: "/",
        redirect: { name: "index" },
        component: "layout",
        children: [
            {
                meta: { title: '首页'},
                component: 'index/index'
            },
            {
                meta: { title: '集群列表'},
                component: 'cluster/list'
            },
            {
                meta: { title: '主机列表'},
                component: 'host/list'
            },
            {
                meta: { title: '字段新增'},
                component: 'column/add'
            },
            {
                meta: { title: '字段删除'},
                component: 'column/delete'
            },
            {
                meta: { title: '索引新增'},
                component: 'key/add'
            },
            {
                meta: { title: '索引删除'},
                component: 'key/delete'
            },
            {
                meta: { title: '表新增'},
                component: 'table/add'
            },
            {
                meta: { title: '表删除/截断'},
                component: 'table/delete'
            }
        ]
    },
    {
        path: '*',
        redirect: { name: 'index'}
    }
]

const getRoutes = () => {
    createRoute(routes)
    return routes
}

function createRoute(arr){
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].component) return
        // 去除冗余的index
        const val = trimLastIndex(arr[i].component)
        // 自动生成path
        arr[i].path = arr[i].path || `/${val}`
        // 自动生成name
        arr[i].name = arr[i].name || val.replace(/\//g, '_')
        // 自动生成component
        const componentFunc = import(`../../views/${arr[i].component}.vue`)
        arr[i].component = () => componentFunc
        if (arr[i].children && arr[i].children.length > 0) {
            createRoute(arr[i].children)
        }
    }
}

function trimLastIndex(str) {
    const index = str.lastIndexOf('/')
    const val = str.substring(index+1, str.length)
    if (val === 'index') {
        return str.substring(index, -1)
    }else{
        return str
    }
}

export default getRoutes()