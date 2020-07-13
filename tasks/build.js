/**
 * webpack分为四部分
 * 1，入口 2，出口 3，loader 4,插件
 */



//需要调用系统命令，所以引用shelljs
 require("shelljs/global");
//引入webpack
 const webpack = require('webpack')
//引入fs
const fs = require('fs')
//引入工具函数包
const _ = require('lodash')
const { resolve } = require('path')
//引入当前脚本的工作目录的路径
const r = url => resolve(process.cwd(),url)
//拿出webpack的配置文件
const webpackConf = require("./webpack.conf")
//拿到需要部署的文件夹的目录,把所有编译后的文件都放到mina里面去
const assetsPath = r('./mina')
//拿到所有的page
const config = require(r('./mina-config'))

//删除编译目录
rm('-rf',assetsPath)
//新建编译目录
mkdir(assetsPath)


var renderConf = webpackConf

//指定入口文件
var entry = () =>_.reduce(config.json.pages,(en,i)=>{
    //遍历逐个拿到mina文件夹下面文件的路径
    en[i] = resolve(process.cwd(),'./',`${i}.mina`)
    return en
},{})
renderConf.entry = entry()
renderConf.entry.app = config.app
//输出
renderConf.output = {
    path: r('./mina'),
    filename: '[name].js'
}


//声明一个编译器
var compiler = webpack(renderConf)

fs.writeFile(r('./mina/app.json'),JSON.stringify(config.json),'utf8',()=>{})



//监听整个文件的变化
 compiler.watch({
     aggregateTimeout :300,
     poll:true
 },(err,stats)=>{
     process.stdout.write(stats.toString({
         colors:true,
         modules:false,
         children:true,
         chunks:true,
         chunkModules:true
     }) + '\n\n')
 })