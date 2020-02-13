import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/utils'

// 定义 配置属性 指向 合并策略 Map
const strats = Object.create(null)

// 合并策略 -- 默认合并策略
// 优先取 val2
function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

// 合并策略 -- 只接受自定义配置合并策略
// 忽略 val1，判断只取 val2（对于一些属性如 url、params、data）
function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 合并策略 -- 复杂对象合并策略
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    return val1
  }
  // else if(typeof val1 !== 'undefined') { // 可以和 else 分支做合并
  //     return val1
  // }
}

// 自定义配置的一些属性 指向 fromVal2Strat合并策略
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

// 自定义配置的一些属性 指向 deepMergeStrat合并策略
const stratKeysDeepMerge = ['headers', 'auth']
stratKeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 合并配置
// config1为默认配置，config2为自定义配置（优先取config2配置覆盖config1）
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  // 定义最终合并配置
  const config = Object.create(null)

  // 优先循环 config2 进行配置合并
  for (let key in config2) {
    mergeField(key)
  }

  // 其次循环 config1 进行配置合并(判断config2没有的配置属性)
  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
