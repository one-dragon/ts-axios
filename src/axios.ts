

import { AxiosInstance, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './default'

// 创建一个 axios 混合对象
// 可以直接调用 axios，或 axios.request、axios.get、axios.post 等方法
function createInstance(config: AxiosRequestConfig): AxiosInstance {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context) // 绑定上下文实例
    
    // 把 context 中的原型方法和实例方法全部拷贝到 instance 上
    extend(instance, context)
    
    return instance as AxiosInstance
}

const axios = createInstance(defaults) // 传入定义的默认配置

export default axios

