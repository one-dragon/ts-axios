
import { isPlainObject } from './utils'

// 处理请求 data（传入 data 为普通对象时，转化成 JSON 字符串）
// send 方法的参数支持 Document 和 BodyInit 类型，
// BodyInit 包括了 Blob, BufferSource, FormData, URLSearchParams, ReadableStream、USVString，
// 当没有数据的时候，我们还可以传入 null。
export function transformRequest(data: any): any {
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

// 处理响应 data（传入 data 为字符串时，尝试转化成 JSON）
export function transformResponse(data: any): any {
    if(typeof data === 'string') {
        try {
            data = JSON.parse(data)
        } catch (error) {
            // do nothing
        }
    }
    return data
}