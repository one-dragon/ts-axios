

import axios, { AxiosError } from '../../src/index'

/*
    验证跨域请求时，携带cookie
*/
/*
document.cookie = 'a=b'
axios.get('/more/get').then(res => {
    console.log(res)
})
axios.post('http://127.0.0.1:8088/more/server2', {}, {
    withCredentials: true
}).then(res => {
    console.log(res)
})
*/

// const formData = new FormData()
// formData.append('a', 'aa')
// formData.append('b', 'bb')
// axios.post('/more/post', formData, {
//     headers: {
//         // 'Content-Type': 'application/json'
//         'Content-Type': 'multipart/form-data'
//     }
// }).then(res => {
//     console.log(res)
// })



/*
    验证 XSRF 防御功能
*/
/*
const instance = axios.create({
    xsrfCookieName: 'XSRF-TOKEN-D',
    xsrfHeaderName: 'X-XSRF-TOKEN-D'
})
instance.get('/more/get').then(res => {
    console.log(res)
})
*/



/*
    HTTP 授权 Authorization
*/
/*
axios.post('/more/post', {
    a: 1
}, {
    auth: {
        username: 'Yee',
        password: '123456'
    }
}).then(res => {
    console.log(res)
})
*/



/*
    自定义合法状态码规则
*/
axios.get('/more/304').then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
})
axios.get('/more/304', {
    validateStatus(status) {
        return status >= 200 && status < 400
    }
}).then(res => {
    console.log(res)
}).catch((e: AxiosError) => {
    console.log(e.message)
})