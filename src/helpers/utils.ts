
const toString = Object.prototype.toString

export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]'
}

export function isObject(val: any): val is Object {
    return val !== null && typeof val === 'object'
}

// 普通对象判断
export function isPlainObject(val: any): val is Object {
    return toString.call(val) === '[object Object]'
}

// FormData 判断
export function isFormData(val: any): val is FormData {
    return typeof val !== 'undefined' && val instanceof FormData
}

// URLSearchParams 判断
export function isURLSearchParams(val: any): val is URLSearchParams {
    return val !== undefined && val instanceof URLSearchParams
}

// 混合对象：把 from 里的属性扩展到 to 中
export function extend<T, U>(to: T, from: U): T & U {
    for(const key in from) {
        ;(to as T & U)[key] = from[key] as any
    }
    return to as T & U
}

// 递归深拷贝多个对象
export function deepMerge(...objs: any[]): any {
    const result = Object.create(null)

    objs.forEach(obj => {
        if(obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key]
                if(isPlainObject(val)) {
                    if(isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val)
                    }else {
                        result[key] = deepMerge(val)
                    }
                }else {
                    result[key] = val
                }
            })
        }
    })

    return result
}