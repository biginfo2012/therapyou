import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store/store'
// import {getToken} from '@/utils/auth'
import {getToken} from "@/utils/index";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {apiBaseUrl} from "@/constants/config";

// 创建axios实例
const service = axios.create({
    baseURL: apiBaseUrl, // api的base_url
    timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    NProgress.start()
    if (getToken()) {
        config.headers['Authorization'] = getToken().accessToken
        config.headers['Accept'] = 'application/json';
        config.headers['Content-Type'] = 'application/json';
    }
    return config
}, error => {
    NProgress.done()
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        try {
            if (typeof (response.data) == 'string') {
                response.data = eval('(' + response.data + ')');
            }
            // eslint-disable-next-line no-empty
        } catch (e) {

        }
        if (response.data.status == 'error') {
            Message({
                message: response.data.message,
                type: 'error',
                duration: 5 * 1000,
                customClass:'zZindex'
            })
        }
        NProgress.done()
        return response
    },
    error => {
        NProgress.done()
        if (error.response.status === 401) {
            store.dispatch('signOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
            })
        }// for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000,
            customClass:'zZindex'
        })

        return Promise.reject(error)
    }
)

export default service