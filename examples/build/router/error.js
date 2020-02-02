

module.exports = function(router) {
    // 返回错误码
    router.get('/error/get', function (req, res) {
        if (Math.random() > 0.5) {
            res.json({
                msg: `hello world`
            })
        } else {
            res.status(500)
            res.end()
        }
    })
    // 超时返回
    router.get('/error/timeout', function (req, res) {
        setTimeout(() => {
            res.json({
                msg: `hello world`
            })
        }, 3000)
    })
}