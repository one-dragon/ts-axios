
import { AxiosRequestConfig, AxiosResponse } from '../types'

// 错误信息类
export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any // XMLHttpRequest
    response?: AxiosResponse

    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)
        this.isAxiosError = true
        this.config = config
        this.code = code
        this.request = request
        this.response = response

        // 当继承一些内置对象，如：Error、Array、Map 时
        // 实例化后，访问不到原型方法，并 instanceof 也为 false（构造函数的属性、方法能访问到）
        // 使用 setPrototypeOf 能修复以上问题
        Object.setPrototypeOf(this, AxiosError.prototype)
    }
}

// 错误信息工厂方法
export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
) {
    const error = new AxiosError(message, config, code, request, response)
    return error
}