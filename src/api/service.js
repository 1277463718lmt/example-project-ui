import request from '@/router/request'

export function fetchList (_url, obj) {
    console.log('LIST请求URL ----->>>  ' + _url)
    console.log(obj)
    return request({
        url: _url,
        method: 'get',
        params: obj
    })
}

export function post (_url, obj) {
    console.log('POST请求URL ----->>>  ' + _url)
    console.log(obj)
    return request({
        url: _url,
        method: 'post',
        data: obj
    })
}

export function post1 (_url) {
    console.log('POST请求URL ----->>>  ' + _url)
    return request({
        url: _url,
        method: 'post'
    })
}

export function post2 (_url) {
    console.log('POST请求URL ----->>>  ' + _url)
    return request({
        url: _url,
        method: 'post',
        responseType: 'arraybuffer'
    })
}

export function add (_url, obj) {
    console.log('ADD请求URL ----->>>  ' + _url)
    console.log(obj)
    return request({
        url: _url,
        method: 'post',
        data: obj
    })
}

export function get (_url) {
    console.log('GET请求URL ----->>>  ' + _url)
    return request({
        url: _url,
        method: 'get'
    })
}

export function _delete (_url) {
    console.log('DELETE请求URL ----->>>  ' + _url)

    return request({
        url: _url,
        method: 'delete'
    })
}

export function deletes (_url, obj) {
    console.log('DELETES 请求URL ----->>>  ' + _url)
    console.log(obj)
    return request({
        url: _url,
        method: 'post',
        data: obj
    })
}

export function put (_url, obj) {
    console.log('PUT请求URL ----->>>  ' + _url)
    console.log(obj)
    return request({
        url: _url,
        method: 'put',
        data: obj
    })
}

export function put1 (_url) {
    console.log('PUT请求URL ----->>>  ' + _url)
    return request({
        url: _url,
        method: 'put'
    })
}
