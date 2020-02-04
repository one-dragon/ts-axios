

module.exports = function (router) {
    router.post('/transform/post', function (req, res) {
        res.json(req.body)
    })
}