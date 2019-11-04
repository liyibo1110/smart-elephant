import Vue from 'vue'
import Vuex from 'vuex'

import cluster from "./modules/cluster.js"

Vue.use(Vuex)

export default new Vuex.Store({  
    modules: {
        cluster
    }
})
