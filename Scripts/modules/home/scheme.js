/**
 * Created by admin on 2016/4/21.
 */
/**
 * Created by loogn on 2016/3/15.
 */
require.config(config);
define(function (require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var id = common.requestUrl('id');
    var returnurl=common.requestUrl('returnurl');
    //提交方案
    var scheme = {
        init: function () {
            this.submitSolution();
        },
        submitSolution:function(){
            $('#scheme-submit').click(function(){
                var memo= $.trim($('.scheme-des').val());
                var price=parseFloat($.trim($('#price').val())*100);
                var prepaidRatio= $.trim($('#prepaidRatio').val());
                if(memo=="" || memo==null){
                    common.showToast('请输入方案详情');
                    return;
                }
                if(price=="" || price==null){
                    common.showToast('请输入报价');
                    return;
                }
                if(prepaidRatio=="" || prepaidRatio==null){
                    common.showToast('请输入预支比例');
                    return;
                }
                if(!(prepaidRatio>0 && prepaidRatio<1)){
                    common.showToast('请输入预支比例（0~1）');
                    return;
                }
                api.call('/Solution/SubmitSolution',{
                    demandId:id,
                    memo:memo,
                    price:price,
                    prepaidRatio:prepaidRatio
                },function(result){
                    if(result.code>0){
                        common.showToast(result.msg);
                        window.location.href=returnurl;
                    }else{
                        common.showToast(result.msg);
                    }
                })
            })
        }
    }
    scheme.init();
})
