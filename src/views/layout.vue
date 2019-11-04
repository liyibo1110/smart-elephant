<template>
    <div>
        <el-container style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: hidden;">
            <el-header class="d-flex align-items-center" 
                style="background: #545C64;">
                <a class="h5 text-light mb-0 mr-auto">
                    {{ $conf.logo }}
                </a>
                <el-menu
                    :default-active="navBar.active|numToString"
                    mode="horizontal"
                    background-color="#545C64"
                    text-color="#FFFFFF"
                    active-text-color="#FFD04B"
                    @select="handleSelect">
                    <el-menu-item v-for="(item, index) in navBar.list" :key="index"
                        :index="index | numToString">
                        {{ item.name }}
                    </el-menu-item>
                </el-menu>
            </el-header>
            <el-container style="height: 100%;">
                <!-- 侧边 -->
                <el-aside width="200px">
                    <el-menu :default-active="slideMenuActive | numToString" @select="slideSelect"
                        style="height: 100%;">
                        <el-menu-item v-for="(item, index) in slideMenus" :key="index"
                            :index="index | numToString">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.name }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <!-- 内容界面 -->
                <el-main class="bg-light" style="position: relative;">
                    <!-- 面包屑导航 -->
                    <div v-if="bread.length" class="border-bottom bg-white p-4">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="(item, index) in bread" :key="index"
                                :to="{ path: item.path }">
                                {{ item.title }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <!-- 主内容 -->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import common from '@/common/mixins/common.js'
    export default {
        mixins: [
            common
        ],
        data() {
            return {
                navBar: {},
                bread: []
            }
        },
        created() {
            // 注册全局路由守卫
            this.$router.afterEach((to, from)=>{
                // console.log(to)
                // console.log(from)
                this.getRouterBread()
            })

            // 初始化菜单
            // console.log(this.$conf.navBar)
            this.navBar = this.$conf.navBar
            // 获取面包屑导航
            this.getRouterBread()
            // 初始化选中菜单
            this.initNavBar()
        },
        computed: {
            slideMenuActive: {
                get() {
                    return this.navBar.list[this.navBar.active].subActive || 0
                },
                set(val) {
                    // console.log('val:' + val)
                    // console.log(this.navBar.active)
                    /* console.log(this.navBar.list[this.navBar.active])
                     */
                    this.navBar.list[this.navBar.active].subActive = val
                }
            },
            slideMenus() {
                return this.navBar.list[this.navBar.active].subMenu || []
            }
        },
        methods: {
            initNavBar() {
                let r = localStorage.getItem("navActive")
                if (r) {
                    r = JSON.parse(r)
                    this.navBar.active = r.top
                    this.slideMenuActive = r.left
                }
            },
            // 获取面包屑导航
            getRouterBread() {
                // console.log(this.$route)
                const b = this.$route.matched.filter(v=>v.name)
                // console.log(b)
                let arr = []
                b.forEach((v, k)=>{
                    // 过滤掉layout和index这2个路由，不加入面包屑
                    if (v.name === "index" || v.name === "layout") return
                    arr.push({
                        name: v.name,
                        path: v.path,
                        title: v.meta.title
                    })
                })
                if (arr.length > 0) {
                    arr.unshift({
                        name: "index",
                        path: "/index",
                        title: "首页"
                    })
                }
                // console.log(arr)
                this.bread = arr
            },
            // 点击一级菜单间接跳转
            handleSelect(key, keyPath) {
                // console.log(key, keyPath)
                this.navBar.active = key
                // 默认跳转二级第一个
                this.slideMenuActive = 0
                if (this.slideMenus.length > 0) {
                    this.$router.push({
                        name: this.slideMenus[this.slideMenuActive].pathName
                    })
                }
            },
            // 点击二级菜单直接跳转
            slideSelect(key, keyPath) {
                this.slideMenuActive = key
                this.$router.push({
                    name: this.slideMenus[key].pathName
                })
            }
        }
    }
</script>

<style scoped>
    .el-main{
        padding: 0;
    }
</style>