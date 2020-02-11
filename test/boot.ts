// 表示每次跑具体测试代码之前会先运行 <rootDir>/test/boot.ts 中的代码

// 这里为了让 jasmine-ajax 插件运行成功，我们需要手动添加全局的 getJasmineRequireObj 方法
const JasmineCore = require('jasmine-core')
// @ts-ignore 取消文件下一行的 @ts-check 错误提示
global.getJasmineRequireObj = function() {
  return JasmineCore
}
require('jasmine-ajax')
