/**
 * Created by admin on 2016/3/31.
 */
require.config(config);
define(function(require,exports,module){
    var common=require('common');
    var setting={
        init:function(){
            this.logout();
        },
        //退出当前账号
        logout:function(){
            var id=common.requestUrl('memberId');
            console.log(id)
            if(id>0){
                $('.setting-btns').removeClass('hide');
            }
            $('.setting-btns').click(function(){
                localStorage.removeItem('user');
                window.location.href='/person/index.html';
            })
        }

    }
    setting.init();
})