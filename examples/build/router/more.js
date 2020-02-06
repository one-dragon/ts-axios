

module.exports = function (router) {
    router.get('/more/get', function (req, res) {
        res.json(req.cookies)
    })
}