
export type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'

// 配置 config 接口定义
export interface AxiosRequestConfig {
    url?: string // axios.get(url, config?) 中 url 必传，所以 config.url 可以选传
    method?: Method
    data?: any
    params?: any
    headers?: any
    // 指定响应的数据类型
    // type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";
    responseType?: XMLHttpRequestResponseType
    timeout?: number
    // 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 put、post 和 patch，
    // 如果值是数组，则数组中的最后一个函数必须返回一个字符串或 FormData、URLSearchParams、Blob 等类型作为 xhr.send 方法的参数，
    // 而且在 transform 过程中可以修改 headers 对象。
    transformRequest?: AxiosTransformer | AxiosTransformer[]
    // 而 transformResponse 允许你在把响应数据传递给 then 或者 catch 之前对它们进行修改。
    // 当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。
    transformResponse?: AxiosTransformer | AxiosTransformer[]

    [propName: string]: any
}

// transformRequest 和 transformResponse 的类型接口定义
export interface AxiosTransformer {
    (data: any, headers?: any): any
}

// 响应数据 res 接口定义
// 响应数据支持泛型
export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any // XMLHttpRequest
}

// axios 函数返回的是一个 Promise 对象
// 那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

// 错误信息 error 接口定义
export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any // XMLHttpRequest
    response?: AxiosResponse
}

// 类 Axios 接口定义
export interface Axios {
    defaults: AxiosRequestConfig

    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }

    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 继承 Axios 的 AxiosInstance 混合接口定义
export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    // 支持传入 url和config
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 静态方法 接口定义
export interface AxiosStatic extends AxiosInstance {
    create(config?: AxiosRequestConfig): AxiosInstance
}

// 拦截器管理 接口定义
// 给外部使用
export interface AxiosInterceptorManager<T> {
    // 返回一个 id 用于删除，给 eject 使用
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

    eject(id: number): void
}
// 请求拦截器是 AxiosRequestConfig 类型的，而响应拦截器是 AxiosResponse 类型的
export interface ResolvedFn<T> {
    (val: T): T | Promise<T>
}
// 请求拦截器、响应拦截器的参数类型是 any 类型的
export interface RejectedFn {
    (error: any): any
}