
import axios from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123
axios.defaults.headers.post['test3'] = 'post'

axios({
    url: '/config/post',
    method: 'post',
    data: qs.stringify({ // 变成 Form Data 形式提交
        a: 1
    }),
    headers: {
        test: '321'
    }
}).then((res) => {
    console.log(res.data)
})