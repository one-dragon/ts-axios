
// 文件名首字母大写代表是个类

import { ResolvedFn, RejectedFn } from '../types'

interface Interceptor<T> {
    // 请求拦截器是 AxiosRequestConfig 类型的，而响应拦截器是 AxiosResponse 类型的
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

// 拦截器管理类实现
export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = []
    }

    // 添加拦截器到 interceptors 中，并返回一个 id 用于删除
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        return this.interceptors.length - 1
    }

    // 遍历 interceptors 用的，它支持传入一个函数，遍历过程中会调用该函数，并把每一个 interceptor 作为该函数的参数传入
    // 给拦截器内部类使用
    forEach(fn: (interceptor: Interceptor<T>) => void) {
        this.interceptors.forEach(interceptor => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }

    // 删除一个拦截器，通过传入拦截器的 id 删除
    eject(id: number): void {
        if(this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }
}