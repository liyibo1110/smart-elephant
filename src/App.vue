<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapMutations } from "vuex"
export default {
    components: {

    },
    // 依赖注入
    provide() {
        return {
            app: this
        }
    },
    created() {
        // 从localStorage恢复clusters对象
        console.log('开始恢复')
        let clusters = window.localStorage.getItem("clusters")
        let list = []
        if (clusters != null && clusters !== '') {
            list = JSON.parse(clusters)
        }
        console.log('长度为：' + list.length)
        this.modifyClusterState(list)
        console.log('恢复完成')
    },
    methods: {
        ...mapMutations(['modifyClusterState'])
    }
}
</script>

<style>
    ::-webkit-scrollbar-track{
      background: rgba(0,0,0,.1);
      border-radius: 0;
    }
    ::-webkit-scrollbar{
      -webkit-appearance: none;
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb{
        cursor: pointer;
        border-radius: 5px;
        background: rgba(0,0,0,.25);
        transition: color .2s ease;
    }
</style>
