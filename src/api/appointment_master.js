import request from '@/utils/request'

export function getAppointmentList(data) {
    return request({
        url: 'appointments/list',
        method: 'get',
        data: data
    })
}

export function getUserList(data) {
    return request({
        url: 'user/list',
        method: 'get',
        data: data
    })
}

