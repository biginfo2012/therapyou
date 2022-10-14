import {apiBaseUrl} from '@/constants/config'
import axios from 'axios';
import router from "@/router/router";

export const isLoggedIn = () => {
    let loginInfo = getLoginInfo();
    if (loginInfo) {
        return true;
    } else {
        return false;
    }
};
export const isLoggedInAsAdmin = () => {
    let loginInfo = getLoginInfo();
    if (loginInfo.role == 2) {
        return true;
    }
    return false;
};

export const isLoggedInAsUser = () => {
    let loginInfo = getLoginInfo();

    if (loginInfo.role != 2) {
        return true;
    }
    return false;
};

export const getLoginInfo = () => {
    let loginInfo = sessionStorage.getItem('userData');
    try {
        loginInfo = JSON.parse(loginInfo);
        if (loginInfo) {
            return loginInfo
        }
        // eslint-disable-next-line no-empty
    } catch (e) {
        return false
    }

    return false;
};
export const getToken = () => {
    let token = sessionStorage.getItem('token');
    try {
        token = JSON.parse(token);
        if (token) {
            return token
        }
        // eslint-disable-next-line no-empty
    } catch (e) {
        return false
    }

    return false;
};

export const getLoggedUserInfo = (cognitoId) => {
    axios.get(apiBaseUrl + 'therapist/get?cognitoId=' + cognitoId).then((response) => {
        let userData = response.data.data.therapist[0];
        sessionStorage.setItem('userData', JSON.stringify(userData));
        if(userData.role == 2){
            router.push('/admin/dashboard')
        }
        else{
            router.push('/user/dashboard')
        }
    }).catch(error => {
        alert(error)
    });
};