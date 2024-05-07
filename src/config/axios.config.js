import {ElMessage} from 'element-plus'
import axios from "axios";

axios.defaults.retry = 3;
axios.defaults.retryDelay = 1000;
axios.defaults.timeout = 60000;
axios.defaults.baseURL = "/v1/admin"

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 请求前
    config.headers.set("token", localStorage.getItem("otpAdminToken"))
    return config;
}, function (error) {
    // 请求失败
    ElMessage.error(error);
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    return response;
}, function (error) {
    if (error.response.status === 401) {
        window.location.href = "#/login"
        return Promise.reject(error);
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    if (error.response) {
        ElMessage.error(error.response.data.msg);
    }
    return Promise.reject(error);
});
export default axios;