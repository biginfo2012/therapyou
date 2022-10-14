import request from '@/utils/request'

export function getClientList(data) {
    return request({
        url: 'user/list',
        method: 'get',
        data: data
    })
}

export function getClient(data) {
    return request({
        url: 'user/list',
        method: 'get',
        data: data
    })
}

export function saveClient(data) {
    return request({
        url: 'user/init-user',
        method: 'post',
        data: data
    })
}