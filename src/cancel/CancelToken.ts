

import { CancelExecutor, CancelTokenSource, Canceler } from "../types"
import Cancel from './Cancel'

interface ResolvePromise {
    (reason?: Cancel): void
}

// 实例化一个 pending 状态的 Promise 对象，
// 然后用一个 resolvePromise 变量指向 resolve 函数
// 执行 executor 函数，传入一个 cancel 函数，
// 在 cancel 函数内部，会调用 resolvePromise 把 Promise 对象从 pending 状态变为 resolved 状态。
export default class CancelToken {
    promise: Promise<Cancel>
    reason?: Cancel

    constructor(executor: CancelExecutor) {
        let resolvePromise: ResolvePromise
        this.promise = new Promise<Cancel>(resolve => {
            resolvePromise = resolve
        })
        executor(message => {
            if(this.reason) {
                return
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })
    }

    // 判断 token 是否已经被使用过
    throwIfRequested() {
        if(this.reason) {
            throw this.reason
        }
    }

    static source(): CancelTokenSource {
        let cancel!: Canceler
        const token = new CancelToken(c => {
            cancel = c
        })
        return {
            cancel,
            token
        }
    }
}

/*方式一
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (e) {
  if (axios.isCancel(e)) {
    console.log('Request canceled', e.message);
  } else {
    // 处理错误
  }
});

// 取消请求 (请求原因是可选的)
source.cancel('Operation canceled by the user.');
*/

/*方式二
const CancelToken = axios.CancelToken;
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c;
  })
});

// 取消请求
cancel();
*/