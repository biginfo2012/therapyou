import axios from 'axios'
import app from '../main';
import {getToken} from "@/utils";

const getApiManager = function () {
    console.log(getToken().accessToken);
    const apiManager = axios.create({
        headers: {
            'Accept': 'application/json',
            'Authorization': getToken().accessToken,
            'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
            return status >= 200 && status <= 503;
        },
    });
    apiManager.interceptors.response.use((response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        console.log("getApiManager")
        console.log(response)
        let message = response.data.message;
        switch (message) {
            case 'invalid-token':
                break;
            case 'token-expired':
                break;

            case 'forbidden':
                break;

            default:

        }

        return response;
    }, (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        app.$notify('error', app.$t(`api-call-error-messages.error-title`), app.$t(`api-call-error-messages.network-error`), {
            duration: 3000,
            permanent: false
        });
        return Promise.reject(error);
    });

    return apiManager;
};

const getApiManagerError = function () {

    const apiManager = axios.create({
        headers: {'X-AUTH-TOKEN': 'token'}
    });
    apiManager.interceptors.response.use((response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        let message = response.data.message;


        switch (message) {

            case 'invalid-token':
                break;
            case 'token-expired':
                break;

            case 'forbidden':
                break;

            default:
        }

        return response;
    }, (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    });

    return apiManager;
};

export {getApiManager, getApiManagerError};