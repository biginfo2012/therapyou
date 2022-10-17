import request from '@/utils/request'
//import axios from "axios";

export function getAppointmentList(data) {
    // return axios.post({
    //
    // })
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

