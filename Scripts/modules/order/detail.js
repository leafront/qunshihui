/**
 * Created by admin on 2016/4/15.
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
    var detail={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.getOrder();
        },
        getOperation:function(url,id){
            api.call(url,{
                orderId:id,
            }, function (result) {
                if (result.code>0) {
                    common.showToast(result.msg);
                }
            });
        },
        offerReceipt:function(){
            //确认收货
            $('.order-receipt1').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                detail.getOperation('/order/OfferReceipt',id);
            })
            //喊Ta收货
            $('.order-receipt2').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                detail.getOperation('/Notification/HurryReceive',id);
            })
            //喊Ta支付
            $('.order-pay2').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                detail.getOperation('/Notification/HurryPay',id);
            })
            //喊Ta去评价
            $('.order-evaluate').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                detail.getOperation('/Notification/HurryEvaluate',id);
            })
        },
        getOrder:function(){
            api.call('/order/GetOrderInfo', {
                orderId:orderId,
            }, function (result) {
                if (result.code>0) {
                    result.memberId=memberId;
                    var html=template('tpl-order-detail',result);
                    $('#orderDetail-cont').html(html);
                    detail.offerReceipt();
                }else{
                }
            });
        }
    }
    detail.init();
})
