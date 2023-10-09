import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestHeaders,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios'
import qs from 'qs'
import { config } from '@/requset/config'

const { base_url, request_timeout } = config
// 创建axios实例
const service: AxiosInstance = axios.create({
    baseURL: base_url,
    timeout: request_timeout,
    withCredentials: true,// 异步请求携带cookie
    // headers: {
    //     // 'Content-Type': 'application/json',
    //     // 'token': x-auth-token',//一开始就要token
    //     // 'X-Requested-With': 'XMLHttpRequest',
    //     'tenant-id': 1
    // },
})

// request拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // let token = localStorage.getItem("x-auth-token");
        // if (token) {
        //添加请求头
        //config.headers["Authorization"]="Bearer "+ token
        // }
        // 是否需要设置 token
        // let isToken = (config!.headers || {}).isToken === false
        // whiteList.some((v) => {
        //     if (config.url) {
        //         return (isToken = config.url.indexOf(v) > -1)
        //     }
        // })
        // if (getAccessToken() && !isToken) {
        //     ; (config as Recordable).headers.Authorization = 'Bearer ' + getAccessToken() // 让每个请求携带自定义token
        // }
        const params = config.params || {}
        const data = config.data || false
        if (
            config.method?.toUpperCase() === 'POST' &&
            (config.headers as AxiosRequestHeaders)['Content-Type'] ===
            'application/x-www-form-urlencoded'
        ) {
            config.data = qs.stringify(data)
        }
        // get参数编码
        if (config.method?.toUpperCase() === 'GET' && params) {
            let url = config.url + '?'
            for (const propName of Object.keys(params)) {
                const value = params[propName]
                if (value !== void 0 && value !== null && typeof value !== 'undefined') {
                    if (typeof value === 'object') {
                        for (const val of Object.keys(value)) {
                            const params = propName + '[' + val + ']'
                            const subPart = encodeURIComponent(params) + '='
                            url += subPart + encodeURIComponent(value[val]) + '&'
                        }
                    } else {
                        url += `${propName}=${encodeURIComponent(value)}&`
                    }
                }
            }
            // 给 get 请求加上时间戳参数，避免从缓存中拿数据
            // const now = new Date().getTime()
            // params = params.substring(0, url.length - 1) + `?_t=${now}`
            url = url.slice(0, -1)
            config.params = {}
            config.url = url
        }
        return config
    },
    (error: AxiosError) => {
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)


export default service