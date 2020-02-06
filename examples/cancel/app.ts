

import axios, { Canceler } from '../../src/index'

// 第一种方式
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/cancel/get', {
    cancelToken: source.token
}).catch(function (e) {
    if (axios.isCancel(e)) {
        console.log(111)
        console.log('Request canceled', e.message)
    }
})

setTimeout(() => {
    source.cancel('Operation canceled by the user.')

    setTimeout(() => {
        // token 已经被使用过，所以 post 请求不会发送
        axios.post('/cancel/post', { a: 1 }, { cancelToken: source.token }).catch(function (e) {
            if (axios.isCancel(e)) {
                console.log(222)
                console.log(e.message)
            }
        })
        
    }, 100);
}, 100)


// 第二种方式
let cancel: Canceler

axios.get('/cancel/get', {
    cancelToken: new CancelToken(c => {
        cancel = c
    })
}).catch(function (e) {
    if (axios.isCancel(e)) {
        console.log('Request canceled')
    }
})

setTimeout(() => {
    cancel()
}, 1500)