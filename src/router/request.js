import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import ElementUI from 'element-ui'
import router from '../router'
Vue.use(ElementUI, { size: 'small' })

const service = axios.create({
    timeout: 15000,
    withCredentials: true
})
// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.uid) {
        config.headers['Authorization'] = store.getters.token
    }
    return config
}, error => {
    return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const headers = response.headers
        if (headers['content-type'] === 'application/vnd.ms-excel;charset=UTF-8') { 
            return response
        }
        if (response.data.message === 'success') {
            return response.data
        } else if (response.data.message !== '' || response.data.message != null) {
            Vue.prototype.$message({
                type: 'error',
                message: response.data.message,
                duration: 3000
            })
            return Promise.reject(response)
        } else {
            Vue.prototype.$message({
                type: 'error',
                message: '未知错误',
                duration: 2000
            })
            return Promise.reject(response)
        }
    },
    error => {
        if (error.response.status === 401) {
            Vue.prototype.$message({
                type: 'error',
                message: '您没有权限，请重新登录',
                duration: 3000
            })
            router.push({ path: '/login' })
            return Promise.reject(error)
        }
    }
)
export default service
