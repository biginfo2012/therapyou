import {apiBaseUrl} from '@/constants/config'
import axios from 'axios';
import router from "@/router/router";
import {AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY, AWS_REGION, AWS_BUCKET} from "@/constants/config";

const aws = require('aws-sdk')
aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY,
})
export const s3 = new aws.S3({
    signatureVersion: 'v4',
    region: AWS_REGION,
})

export const singleUpload = (file, folder) => {
    const key = folder + '/' + Date.now() + '-' + file.name.replace(/\s/g, '-')
    console.log(key);
    const params = {
        Bucket: AWS_BUCKET,
        Key: key,
        Expires: 10,
        ContentType: file.type,
    }
    const url = s3.getSignedUrl('putObject', params)
    return axios
        .put(url, file, {
            headers: {
                'Content-Type': file.type,
            },
        })
        .then(result => {
            console.log(result);
            const bucketUrl = decodeURIComponent(result.request.responseURL).split(
                key
            )[0]
            result.key = key
            result.fullPath = bucketUrl + key
            return result
        })
        .catch(err => {
            // TODO: error handling
            console.log(err)
        })
}

export const deleteObjectByKey = key => {
    const params = {
        Bucket: AWS_BUCKET,
        Key: key,
    }
    const data = s3.deleteObject(params).promise()

    return data
}

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