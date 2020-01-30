
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const { EXAMPLES_PATH, OUTPUT_PATH, MAIN_TS_NAME } = require('./const')

module.exports = {
    mode: 'development',

    /**
     * 在 examples 目录下建多个子目录
     * 把不同章节的 demo 放到不同的子目录中
     * 每个子目录的下会创建一个 app.ts
     * app.ts 作为 webpack 构建的入口文件
     * entries 收集了多目录个入口文件，并且每个入口还引入了一个用于热更新的文件
     * entries 是一个对象，key 为目录名
     */
    entry: fs.readdirSync(EXAMPLES_PATH).reduce((entries, dir) => {
        const fullDir = path.join(EXAMPLES_PATH, dir)
        const entry = path.join(fullDir, MAIN_TS_NAME)
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries[dir] = ['webpack-hot-middleware/client', entry]
        }

        return entries
    }, {}),

    /**
     * 根据不同的目录名称，打包生成目标 js，名称和目录名一致
     */
    output: {
        path: path.join(EXAMPLES_PATH, OUTPUT_PATH),
        filename: '[name].js',
        publicPath: `/${OUTPUT_PATH}/`
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader'
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}