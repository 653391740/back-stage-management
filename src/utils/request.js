import axios from "axios";
import { Message } from 'element-ui'
const service = axios.create({
    baseURL: "http://43.138.15.137:7000/api/private/v1",
    timeout: 3000
});

//请求拦截器
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = JSON.parse(token);
    }
    return config;
}, error => {
    return Promise.reject(error)
});

//响应拦截器
service.interceptors.response.use(response => {
    const { data, meta: { status, msg } } = response.data
    if (status >= 200 && status < 300) {
        Message.success(msg)
        return data;
    } else if (status === 401) {
        Message.error('登录过期，请重新登录')
        localStorage.removeItem('token')
        this.$router.push('/login')
        return Promise.reject(msg)
    } else {
        Message.error(msg)
        return Promise.reject(msg)
    }
}, error => {
    // 处理请求超时逻辑
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        Message.error('请求超时，请检查网络连接后重试')
    }
    console.log('err' + error)
    return Promise.reject(error)
});

export default service
