/**
 * Created by admin on 2016/4/1.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.requestUrl('memberId');
    var personCard={
        init:function(){
           common.checkLogin(common.getRelativePath());
           this.getCardInfo();
        },
        getCardInfo:function(){
            api.call('/member/GetCardInfo', {
                memberId:memberId,
            }, function (result) {
                if (result.code > 0) {
                    var html=template('tpl-personCard',result);
                    $('#personCard-cont').html(html);
                }else{
                    common.showToast('网络服务器错误');
                }
            });
        }

    }
    personCard.init();
})
