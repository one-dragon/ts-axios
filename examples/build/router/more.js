

const atob = require('atob')

module.exports = function (router) {
    // 返回 cookie
    router.get('/more/get', function (req, res) {
        res.json(req.cookies)
    })

    // HTTP 授权 Authorization
    router.post('/more/post', function (req, res) {
        const auth = req.headers.authorization
        const [type, credentials] = auth.split(' ')
        console.log(atob(credentials))
        const [username, password] = atob(credentials).split(':')
        if (type === 'Basic' && username === 'Yee' && password === '123456') {
            res.json(req.body)
        } else {
            res.status(401)
            res.end('UnAuthorization')
        }
    })
}