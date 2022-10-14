import request from '@/utils/request'

export function getTherapistList(data) {
    return request({
        url: 'therapist/list',
        method: 'get',
        data: data
    })
}
export function saveTherapist(data) {
    return request({
        url: 'therapist/list',
        method: 'get',
        data: data
    })
}
export function getTherapist(data) {
    return request({
        url: 'therapist/list',
        method: 'get',
        data: data
    })
}