
// 文件名首字母大写代表是个类

import { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method, ResolvedFn, RejectedFn } from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './interceptorManager'

// 拦截器 接口定义
interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

// 拦截器链 接口定义
interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default class Axios {
    interceptors: Interceptors // 拦截器定义

    constructor() {
        // 初始化拦截器
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }

    // request(config: AxiosRequestConfig): AxiosPromise {
    //     return dispatchRequest(config)
    // }
    // 支持传入 url和config
    // 重载
    request(url: any, config?: any): AxiosPromise {
        if(typeof url === 'string') {
            config = config || {}
            config.url = url
        }else {
            config = url
        }

        /*  添加拦截器链式调用的逻辑
            ... (config)=> request-interceptor2 (config)=> request-interceptor1 (config)=>
            send-request (response)=>
            response-interceptor1 (response)=> ... (response)=> handle-response
        */
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }]
        // 请求拦截器，后添加的先执行
        // forEach 为类中内部实现的函数
        this.interceptors.request.forEach(interceptor => {
            chain.unshift(interceptor)
        })
        // 响应拦截器，先添加的先执行
        // forEach 为类中内部实现的函数
        this.interceptors.response.forEach(interceptor => {
            chain.push(interceptor)
        })
        // 定义一个已经 resolve 的 promise，来循环依次执行拦截器链
        let promise = Promise.resolve(config)
        while(chain.length) {
            const { resolved, rejected } = chain.shift()! // 类型断言不为空，否则报错
            promise = promise.then(resolved, rejected)
        }
        return promise
        // return dispatchRequest(config)
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('get', url, config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('delete', url, config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('head', url, config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithoutData('options', url, config)
    }
    _requestMethodWithoutData(method: Method, url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }))
    }


    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('post', url, data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this._requestMethodWithData('patch', url, data, config)
    }
    _requestMethodWithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url,
            data
        }))
    }
}