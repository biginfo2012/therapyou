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
export function getTherapist(cognitoId) {
    return axios.get(apiBaseUrl + 'therapist/get?cognitoId=' + cognitoId)
}
export function getAppointmentList(data) {
    return axios.post(apiBaseUrl + 'appointments/list', data, config)
}
export function getPaidAppointmentList(data) {
    return axios.post(apiBaseUrl + 'appointments/list-paid', data, config)
}
export function createAppointment(data) {
    return axios.post(apiBaseUrl + 'appointments/create', data, config)
}
export function deleteAppointment(id) {
    return axios.get(apiBaseUrl + 'appointments/delete/' + id)
}
export function singleAppointment(appointmentId) {
    return axios.get(apiBaseUrl + 'appointments/single?appointmentId=' + appointmentId)
}
export function createMeetingId(data) {
    return axios.post(apiBaseUrl + 'appointments/create-meeting-link', data, config)
}
export function getTherapistList(data) {
    return axios.post(apiBaseUrl + 'therapist/list', data, config)
}
export function deleteTherapist(data) {
    return axios.post(apiBaseUrl + 'therapist/delete', data, config)
}
export function saveTherapist(data) {
    return axios.post(apiBaseUrl + 'therapist/save', data, config)
}
export function updateTherapist(data) {
    return axios.post(apiBaseUrl + 'therapist/update', data, config)
}
export function signUpTherapist(data) {
    return axios.post(apiBaseUrl + 'therapist/sign-up', data, config)
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
export function getNotiList(data) {
    return axios.post(apiBaseUrl + 'notification/list', data, config)
}
export function confirmNoti(data) {
    return axios.post(apiBaseUrl + 'notification/set-notified', data, config)
}
export function getMessageList(data) {
    return axios.post(apiBaseUrl + 'message/list-all', data, config)
}
export function getMessageListByUser(data) {
    return axios.post(apiBaseUrl + 'message/list-by-user', data, config)
}
export function deleteMessage(data) {
    return axios.post(apiBaseUrl + 'message/delete', data, config)
}
export function getListUsers(data) {
    return axios.post(apiBaseUrl + 'message/list-users', data, config)
}
export function replyMessage(data) {
    return axios.post(apiBaseUrl + 'message/reply', data, config)
}
export function decreaseCredits(data) {
    return axios.post(apiBaseUrl + 'user/decrease-credits', data, config)
}