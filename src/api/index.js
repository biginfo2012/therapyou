import {getToken} from "@/utils";
import axios from "axios";
import {apiBaseUrl} from "@/constants/config";

let config = {
    headers: {
        'Accept': 'application/json',
        'Authorization': getToken().idToken,
        'Content-Type': 'application/json'
    }
}

export function getAppointmentList(data) {
    return axios.post(apiBaseUrl + 'appointments/list', data, config)
}
export function createAppointment(data) {
    return axios.post(apiBaseUrl + 'appointments/create', data, config)
}
export function getTherapistList(data) {
    return axios.post(apiBaseUrl + 'therapist/list', data, config)
}
export function getUserList(data) {
    return axios.post(apiBaseUrl + 'user/list', data, config)
}
export function deleteUser(data) {
    return axios.post(apiBaseUrl + 'user/delete', data, config)
}
export function updateUser(data) {
    return axios.post(apiBaseUrl + 'user/update', data, config)
}
export function initUser(data) {
    return axios.post(apiBaseUrl + 'user/init-user', data, config)
}
export function getInvoiceList(data) {
    return axios.post(apiBaseUrl + 'invoice/list', data, config)
}
export function deleteInvoice(data) {
    return axios.post(apiBaseUrl + 'invoice/delete', data, config)
}
export function uploadInvoice(data) {
    return axios.post(apiBaseUrl + 'invoice/upload', data, config)
}