
import axios from '../../src/index'
import qs from 'qs'
import { AxiosTransformer } from '../../src/types'

axios({
    transformRequest: [(function (data) {
        return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
        if (typeof data === 'object') {
            data.b = 2
        }
        return data
    }],
    url: '/transform/post',
    method: 'post',
    data: {
        a: 1
    }
}).then((res) => {
    console.log(res.data)
})