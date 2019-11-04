import Vue from "vue"
import Router from "vue-router"

import routes from "@/common/config/router.js" 
Vue.use(Router)

export default new Router({ routes })

/* const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router */
