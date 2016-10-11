define([],function(){
    var config={
        baseUrl: '/scripts',
        urlArgs: 'v=${version}',
        paths: {
            jquery: 'lib/jquery-2.2.1.min',
            swipe: 'component/swipe',
            common: 'modules/common/common',
            selectArea:'modules/common/selectArea',
            date: 'component/date',
            IScroll: 'lib/iscroll-lite',
            iScroll:'lib/iscroll',
            Chart: 'lib/Chart.min',
            template:'lib/template',
            touch:'component/touch.min',
            api:'modules/api/api',
            user:'modules/account/user',
            lazyload:'component/jquery.lazyload.min',
            FastClick:'lib/fastclick',
            TouchSlider:'component/touchSlider',
            moduleName:'data/moduleName',
            jweixin:'http://res.wx.qq.com/open/js/jweixin-1.0.0'
        },
        shim: {
            'jquery': {
                'exports': '$'
            },
            "date": {
                "deps": ['jquery','iScroll']
            },
            'lazyload':{
                'deps':['jquery']
            }
        }
    }
    return config;
})
