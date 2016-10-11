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
    var evaluate={
        init:function(){
            this.writeEvaslution();
        },
        writeEvaslution:function(){
            $('.evaluate-des').focus(function(){
                $(this).attr('placeholder','');
            })
            $('.evaluate-item').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
            })
            $('#evaluate-btn').click(function(){
                var score;
                $('.evaluate-item').each(function(){
                    if($(this).hasClass('active')){
                        score=$(this).data('score');
                    }
                })
                var memo= $.trim($('.evaluate-des').val());
                if(memo==null || memo==""){
                    common.showToast('请填写评价内容');
                    return;
                }
                api.call('/order/WriteEvalution', {
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
    evaluate.init();
})
