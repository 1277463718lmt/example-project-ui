import { login } from '@/api/login'

const user = {
    state: {
        token: '' || sessionStorage.getItem('token'),
        uid: '' || sessionStorage.getItem('uid'),
        majors: '' || sessionStorage.getItem('majors'),
        type: '' || sessionStorage.getItem('type')
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
            sessionStorage.setItem('token', token)
        },
        SET_UID: (state, uid) => {
            state.uid = uid
            sessionStorage.setItem('uid', uid)
        },
        SET_TYPE: (state, type) => {
            state.type = type
            sessionStorage.setItem('type', type)
        },
        SET_MAJORS: (state, majors) => {
            state.majors = majors
            sessionStorage.setItem('majors', majors)
        },
        RM_TOKEN: (state) => {
            state.token = null
            sessionStorage.removeItem('token')
        },
        RM_UID: (state) => {
            state.uid = null
            sessionStorage.removeItem('uid')
        },
        RM_TYPE: (state) => {
            state.type = null
            sessionStorage.removeItem('type')
        },
        RM_MAJORS: (state) => {
            state.majors = null
            sessionStorage.removeItem('majors')
        }
    },
    actions: {
        Login ({ commit }, logindata) {
            return new Promise((resolve, reject) => {
                login(logindata).then(response => {
                    if (response.message !== 'success') {
                        resolve(response)
                    } else {
                        const uidstr = response.data.uid
                        const tokenstr = response.data.token
                        const majorsstr = response.data.majors
                        const typestr = response.data.type
                        commit('SET_TOKEN', tokenstr)
                        commit('SET_UID', uidstr)
                        commit('SET_TYPE', typestr)
                        commit('SET_MAJORS', majorsstr)
                        resolve(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        Loginout ({ commit }) {
            commit('RM_TOKEN')
            commit('RM_UID')
            commit('RM_TYPE')
            commit('RM_MAJORS')
        }
    }
}

export default user
