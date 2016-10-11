/**
 * Created by admin on 2016/3/23.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var person={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.getBaseInfo();
            this.logout();
        },
        getBaseInfo:function(){
            api.call('/member/GetBaseInfo', {
                memberId: memberId
            }, function (result) {
                if (result.code > 0) {
                    result.memberId=memberId;
                    var html = template("tpl-getInfo", result);
                    $("#header-person").append(html);
                } else if(result.code==0) {
                    result.data={};
                    result.memberId=memberId;
                    result.data.NickName="";
                    result.data.Money="0"
                    result.data.Integral="0";
                    result.data.Avatar="http://res.qunshihui.net.cn/image/avatar.png";
                    var html = template("tpl-getInfo", result);
                    $("#header-person").append(html)
                }else{
                    common.showToast('系统错误');
                }
                $('#person-member').click(function(){
                    if(memberId!==0){
                        window.location.href='/person/personInfo.html'
                    }else{
                        window.location.href='/Account/login.html?returnurl='+window.encodeURIComponent(common.getRelativePath());
                    }
                })
            });
        },
        //退出当前账号
        logout:function(){
            var id=common.requestUrl('memberId');
            if(id!==0){
                $('.setting-btns').removeClass('hide');
            }
            $('.setting-btns').click(function(){
                localStorage.removeItem('user');
                window.location.href='/person/index.html';
            })
        }

    }
    person.init();
})