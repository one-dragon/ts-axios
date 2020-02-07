

module.exports = function (router) {
    // 上次
    router.post('/progress/upload', function (req, res) {
        console.log(req.body, req.files)
        res.end('upload success!')
    })
}