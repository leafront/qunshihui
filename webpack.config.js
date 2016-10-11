var path = require('path');
var webpack=require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');
var config = {
    entry: path.resolve(__dirname, 'scripts/modules/home/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {   test: /lazyload\/jquery\..+\.js$/,
                loader: 'imports?jQuery=jquery,$=jquery,this=>window'
            },
        ]
    },
    resolve: {
        //查找module的话从这里开始查找
        root: __dirname,
        modulesDirectories: ['node_modules', 'scripts'],
        extensions: ['', '.js'],
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            template:'lib/template.js',//后续直接 require('AppStore') 即可
            swipe:'component/swipe.js',
            jquery:'lib/jquery-2.2.1.min',
            api:'modules/api/api.js',
            user:'modules/account/user.js',
            moduleName:'data/moduleName.js',
            common:'modules/common/common.js',
            lazyload:'component/jquery.lazyload.min',
        },
        plugins:[
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            }),
        ]
    }
};
module.exports = config;