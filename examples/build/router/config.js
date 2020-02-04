

module.exports = function (router) {
    router.post('/config/post', function (req, res) {
        res.json(req.body)
    })
}