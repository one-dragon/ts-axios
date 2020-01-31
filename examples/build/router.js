
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const { EXAMPLES_PATH, MAIN_TS_NAME } = require('./const')

// 渲染首页，获取所有测试目录(目录中带有app.ts文件)并渲染列表
router.get('/', function (req, res) {
    const dirList = fs.readdirSync(EXAMPLES_PATH).reduce((entries, dir) => {
        const fullDir = path.join(EXAMPLES_PATH, dir)
        const entry = path.join(fullDir, MAIN_TS_NAME)
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries.push(dir)
        }
        return entries
    }, [])
    res.render('index', {
        dirList
    })
})


/*=====================接口=====================*/
router.get('/simple/get', function (req, res) {
    res.json({
        msg: `hello world`
    })
})

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

module.exports = router