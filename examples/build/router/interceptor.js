

module.exports = function (router) {
    router.get('/interceptor/get', function (req, res) {
        res.end('hello')
    })
}