/**
 * Created by admin on 2016/4/21.
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
    var service={
        init:function(){
            this.offerApplyArbitration();
        },
        offerApplyArbitration:function(){
            $('#service-submit').click(function(){
                api.call('/order/OfferApplyArbitration', {
                    orderId:orderId,
                    score:score,
                    memo:memo,
                }, function (result) {
                    if (result.code>0) {
                        $('#orderDetail-cont').html(html);
                    }else{
                    }
                });
            })
        }
    }
    service.init();
})
