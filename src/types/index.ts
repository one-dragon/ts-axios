
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
    // axios.CancelToken 是一个类，直接把它实例化的对象传给请求配置中的 cancelToken 属性，来取消请求
    cancelToken?: CancelToken
    withCredentials?: boolean
    xsrfCookieName?: string // 表示存储 token 的 cookie 名称
    xsrfHeaderName?: string // 表示请求 headers 中 token 对应的 header 名称
    onDownloadProgress?: (e: ProgressEvent) => void // 下载进度
    onUploadProgress?: (e: ProgressEvent) => void // 上传进度
    // 往 HTTP 的请求 header 中添加 Authorization 属性，它的值为 Basic 加密串
    // 这里的加密串是 username:password base64 加密后的结果
    auth?: AxiosBasicCredentials
    // 自定义合法状态码规则
    validateStatus?: (status: number) => boolean

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

    CancelToken: CancelTokenStatic
    Cancel: CancelStatic
    isCancel: (value: any) =>boolean
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


// 实例类型的接口定义
// 构造函数参数支持传入一个 executor 方法，该方法的参数是一个取消函数 c，我们可以在 executor 方法执行的内部拿到这个取消函数 c，赋值给我们外部定义的 cancel 变量，之后我们可以通过调用这个 cancel 方法来取消请求。
export interface CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    throwIfRequested(): void
}
// 取消方法的接口定义
export interface Canceler {
    (message?: string): void
}
// 是 CancelToken 类构造函数参数的接口定义
export interface CancelExecutor {
    (cancel: Canceler): void
}
// 是 CancelToken 类静态方法 source 函数的返回值类型
export interface CancelTokenSource {
    token: CancelToken,
    cancel: Canceler
}
// 是 CancelToken 类的类类型
export interface CancelTokenStatic {
    new(executor: CancelExecutor): CancelToken

    source(): CancelTokenSource
}

// 是实例类型的接口定义
export interface Cancel {
    message?: string
}
// 是类类型的接口定义，并且给 axios 扩展了多个静态方法
export interface CancelStatic {
    new(message?: string): Cancel
}

// 认证接口定义
export interface AxiosBasicCredentials {
    username: string
    password: string
}