import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import '../static/css/icon.css'
import store from './store'

Vue.use(ElementUI, { size: 'small' })

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (store.getters.type === to.meta.user) {
            next()
        } else {
            next({ path: '/login' })
            Vue.prototype.$message({
                type: 'error',
                message: '您没有权限访问，请登录！！！！',
                duration: 2000
            })
        }
    } else {
        next()
    }
})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
