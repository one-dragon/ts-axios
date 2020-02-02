

module.exports = function(router) {
    // 返回入参内容
    router.get('/base/get', function (req, res) {
        res.json(req.query)
    })
    // 传入json，并返回
    router.post('/base/post', function (req, res) {
        console.log('req.body========')
        console.log(req.body)
        res.json(req.body)
    })
    // 传入buffer，并返回
    router.post('/base/buffer', function (req, res) {
        let msg = []
        req.on('data', (chunk) => {
            if (chunk) {
                msg.push(chunk)
            }
        })
        req.on('end', () => {
            let buf = Buffer.concat(msg)
            res.json(buf.toJSON())
        })
    })
}