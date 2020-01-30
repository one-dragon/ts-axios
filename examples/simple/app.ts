import axios from '../../src/index'

axios({
    method: 'get',
    // 丢弃 url 中的哈希标记
    // 保留 url 中已存在的参数
    url: '/simple/get#hash?str2=str2',
    params: {
        a: 1,
        b: 2,
        foo: ['bar'],
        bar: {
            foo: 'foo'
        },
        date: new Date(),
        // 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode
        // 把空格 转换成 +
        sstr: '@:$, ',
        // 对于值为 null 或者 undefined 的属性，我们是不会添加到 url 参数中的
        str1: null
    }
})