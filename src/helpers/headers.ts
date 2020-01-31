
import { isPlainObject } from './utils'

// headers 属性 小写转化成首字母大写
function normalizeHeaderName(headers: any, normalizeName: string): void {
    if(!headers) {
        return
    }
    Object.keys(headers).forEach(name => {
        if(name !== normalizeName && name.toUpperCase() === normalizeName.toUpperCase()) {
            headers[normalizeName] = headers[name]
            delete headers[name]
        }
    })
}

// 处理 headers
// 传入 data 为普通对象时，设置 Content-Type 为 application/json
export function processHeaders(headers: any, data: any): any {
    normalizeHeaderName(headers, 'Content-Type')
    if(isPlainObject(data)) {
        if (headers && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json;charset=utf-8'
        }
    }
    return headers
}

// 解析 headers 生成对象
// headers: 'date: Fri, 31 Jan 2020 10:44:01 GMT↵etag: W/"d-Ssxx4FRxEutDLwo2+xkkxKc4y0k"↵connection: keep-alive↵x-powered-by: Express↵content-length: 13↵content-type: application/json; charset=utf-8↵'
export function parseHeaders(headers: string): any {
    let parsed = Object.create(null)
    if(!headers) {
        return parsed
    }
    headers.split('\r\n').forEach(line => {
        let [key, val] = line.split(':')
        key = key.trim().toLowerCase()
        if(!key) {
            return
        }
        if(val) {
            val = val.trim()
        }
        parsed[key] = val
    })
    return parsed
}