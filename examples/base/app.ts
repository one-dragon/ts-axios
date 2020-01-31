
import axios from '../../src/index'

// url 参数测试
// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: ['bar', 'baz']
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: {
//             bar: 'baz'
//         }
//     }
// })

// const date = new Date()
// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         date
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: '@:$, '
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get',
//     params: {
//         foo: 'bar',
//         baz: null
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get#hash',
//     params: {
//         foo: 'bar'
//     }
// })

// axios({
//     method: 'get',
//     url: '/base/get?foo=bar',
//     params: {
//         bar: 'baz'
//     }
// })



// 请求 body 数据测试
axios({ // 普通对象
    method: 'post',
    url: '/base/post',
    data: {
        a: 1,
        b: 2
    }
}).then((res) => {
    console.log(res)
})

axios({ // 设置content-type
    method: 'post',
    url: '/base/post',
    headers: {
        'content-type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    },
    responseType: 'text',
    data: {
        a: 1,
        b: 2
    }
}).then((res) => {
    console.log(res)
})

const paramsString = 'q=URLUtils.searchParams&topic=api'
const searchParams = new URLSearchParams(paramsString)
axios({
    method: 'post',
    url: '/base/post',
    data: searchParams
})

const formData = new FormData()
formData.append('c', '3')
formData.append('d', '4')
axios({
    method: 'post',
    url: '/base/post',
    data: formData
})

const arr = new Int32Array([21, 31])
axios({
    method: 'post',
    url: '/base/buffer',
    data: arr
})