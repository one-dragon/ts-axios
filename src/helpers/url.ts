
import { isDate, isPlainObject, isURLSearchParams } from './utils'

interface URLOrigin {
    protocol: string
    host: string
}

// encode 编码
function encode(val: string): string {
    // 对于字符 @ : $ ,   [ ] 不encode
    // 并把'空格'转换成 '+'
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/ig, ',')
        .replace(/%20/g, '+') // 把'空格'转换成 '+'
        .replace(/%5B/ig, '[')
        .replace(/%5D/ig, ']')
}

// 处理请求 url 参数，最终生成如：/base/get?foo=bar
/*  默认
    params: {
        foo: ['bar', 'baz'], // ?foo[]=bar&foo[]=baz
        bar: { foo: 'foo' }, // ?bar=%7B%22foo%22:%22foo%22%7D，bar 后面拼接的是 { foo: 'foo' } encode 后的结果
        date: new Date(), // ?date=2019-04-01T05:55:39.030Z，date 后面拼接的是 date.toISOString() 的结果
        str: '@:$, ', // ?str=@:$,+，注意我们会把空格 转换成 +，对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode
        str1: null // 对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的
    }
    丢弃 url 中的哈希标记，如: url: '/base/get#hash' => '/base/get'
    保留 url 中已存在的参数，如: url: '/base/get?foo=bar' => '/base/get?foo=bar'
*/
// paramsSerializer: 自定义参数序列化规则
export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if(!params) {
        return url
    }

    let serializedParams
    
    if(paramsSerializer) {
        serializedParams = paramsSerializer(params)
    } else if (isURLSearchParams(params)) { // 判断 URLSearchParams 对象实例
        serializedParams = params.toString()
    } else {
        // 创建键值对数组
        const parts: string[] = []

        Object.keys(params).forEach(key => {
            const val = params[key]
            // 入参值为 null、undefined 忽略并跳到下个循环
            if (val === null || val === undefined) {
                return
            }
            let values = []
            // 处理入参值，最终变成数组，进行统一处理
            // 处理key，入参值为数组，则 key = 'key[]'
            if (Array.isArray(val)) {
                values = val
                key += '[]'
            } else {
                values = [val]
            }
            // 循环处理值，并存入 parts => ['key=val']
            values.forEach((val) => {
                if (isDate(val)) { // 日期类型处理
                    val = val.toISOString()
                } else if (isPlainObject(val)) { // 对象类型处理
                    val = JSON.stringify(val)
                }
                parts.push(`${encode(key)}=${encode(val)}`)
            })
        })

        // 如 parts: ['a=1', 'b={b:1}'] => 'a=1&b={b:1}'
        serializedParams = parts.join('&')
    }

    if(serializedParams) {
        const markIndex = url.indexOf('#')
        if(markIndex !== -1) { // 处理 hash
            url = url.slice(0, markIndex)
        }
        // 判断 url 是否已拼接参数
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
}


// 判断 请求url和当前页面地址url 是否为同源
export function isURLSameOrigin(requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL)
    return (parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host)
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href) // 获取当前页面的协议、主机名和端口

// 利用a标签特性解析地址
function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { protocol, host } = urlParsingNode

    return {
        protocol,
        host
    }
}