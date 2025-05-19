import axios, { AxiosError, AxiosResponse } from 'axios';
import { URL } from './DefaultURL';

export const api = axios.create();
api.defaults.baseURL = URL.Web_url;
api.defaults.headers.post['Content-Type'] = 'multipart/form-data';
api.defaults.headers.post['Accept'] = 'application/json';

api.interceptors.request.use(
    request => {
        console.log(request.url, "----- request ----->", request)
        return request
    },
)
api.interceptors.response.use(
    response => {
        console.log(response.config.url, "+++++ response +++++>", response.data);
        return response
    },
)
function onError(response: any) {//@ts-ignore
    return response.response?.data;
}

function onSuccess(response: AxiosResponse) {
    
    return response.data;
}

export const Services = {
    signUp: (data: any) => api.post("/api/users/sign-in", data).then(onSuccess, onError),
    verifyOtp: (data: any) => api.post("/api/users/verify-otp", data).then(onSuccess, onError),
    logoutApp: (data: any) => api.post("/auth/logoutApp", data).then(onSuccess, onError),
}

//Logs