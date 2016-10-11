define(function (require,exports,module) {
    var $=require('jquery');
    var baseUrl=location.hostname=='127.0.0.1'?'http://192.168.2.254:82':'http://api.qunshihui.net.cn';
    var api={
        call:function (url, params, callback,error) {
            var cb;
            if(callback){
                cb=function(result){
                    if(result.code==0 && result.msg=="nologin"){
                        var strUrl=document.location.toString();
                        var arrObj=strUrl.split('//');
                        var start=arrObj[1].indexOf('/');
                        var returnUrl=arrObj[1].substring(start);
                        location.href='/Account/login.html?returnurl='+window.encodeURIComponent(returnUrl);
                    }else{
                        callback(result);
                    }
                }
            }
            var data = params || {};
            data.api_client = "js";
            var u=api.getUser();
            if(u && u.token){
                data.token= u.token;
            }
            $.ajax({
                url: baseUrl + url,
                data: data,
                type: "POST",
                dataType:'json',
                success: cb || function (result) {
                },
                error:function(){
                    api.showToast('网络服务器错误')
                }
            })
        },
        getTypeDict:function (params, callback) {
            api.call('/dict/GetTypeDict', params, function (result) {
                callback(result);
            });
        },
        showToast:function(value){
            var tpl='<div class="mask"></div> <div class="mask-ui"><span>'+value+'</span></div>';
            $('body').append(tpl);
            $('.mask-ui').css({'left':($(window).width()-$('.mask-ui').outerWidth(true))/2,'top':($(window).height()-$('.mask-ui').outerHeight(true))/2});
            $('.mask').css('height',document.body.clientHeight);
            setTimeout(function(){
                $('.mask-ui').remove();
                $('.mask').remove();
            },500);
        },
        getUser:function(){
            var userJson=localStorage.getItem('user');
            if(userJson){
                var userData=JSON.parse(userJson);
                //是否过期
                if(Math.round(new Date().getTime()/1000)>userData.expirse) {
                    return null;
                }
                return userData;
            }
            return null;
        }
    }
    module.exports=api;
})

