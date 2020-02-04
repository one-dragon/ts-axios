
import { AxiosTransformer } from "../types";

// 可能会编写多个转换函数，处理这些转换函数的调用逻辑
export default function transform(data: any, headers: any, fns?: AxiosTransformer | AxiosTransformer[]): any {
    if(!fns) {
        return data
    }
    if(!Array.isArray(fns)) {
        fns = [fns]
    }
    fns.forEach(fn => {
        data = fn(data, headers)
    })
    return data
}