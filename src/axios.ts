

import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/utils'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'

// 创建一个 axios 混合对象
// 可以直接调用 axios，或 axios.request、axios.get、axios.post 等方法
function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config)
    const instance = Axios.prototype.request.bind(context) // 绑定上下文实例
    
    // 把 context 中的原型方法和实例方法全部拷贝到 instance 上
    extend(instance, context)
    
    return instance as AxiosStatic
}

const axios = createInstance(defaults) // 传入定义的默认配置

// 静态方法
axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config))
}

axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios

