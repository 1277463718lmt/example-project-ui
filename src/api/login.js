import request from '@/router/request'

export function login (obj) {
    return request({
        url: '/apis/user/login',
        method: 'post',
        data: obj,
        timeout: 1000
    })
}
