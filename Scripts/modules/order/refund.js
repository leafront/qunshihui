/**
 * Created by admin on 2016/4/22.
 */
/**
 * Created by admin on 2016/4/20.
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
    var orderId=common.requestUrl('orderId');
    var refund={
        init:function(){
            this.OfferApplyArbitration();
        },
        //4、悬赏 申请平台仲裁
        OfferApplyArbitration:function(){
            $('#refund-btn').click(function(){
                api.call('/order/OfferApplyArbitration', {
                    orderId:orderId,
                }, function (result) {
                    if (result.code>0) {
                    }else{
                    }
                });
            })
        }
    }
    refund.init();
})
