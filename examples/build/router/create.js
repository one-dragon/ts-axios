

module.exports = function (router) {
    router.post('/create/post', function (req, res) {
        res.json(req.body)
    })
}