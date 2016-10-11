/**
 * Created by admin on 2016/3/22.
 */
/**
 * Created by loogn on 2016/3/17.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var detailId=common.requestUrl('detailId');
    var numberDetail={
        init:function(){
            this.getDemandBid();
        },
        getDemandBid:function(){
            api.call('/Solution/GetDemandBid',{demandId:detailId,pageIndex:1},function(result){
                if(result.code>0){
                    var html=template('tpl-numberDetail',result);
                    $('#number-cont').append(html);
                    numberDetail.selectEntered();
                }else{

                }
            });
        },
        selectEntered:function(){
            $('.selectEntered').click(function(){
                var $this=$(this);
                var solutionId=$(this).data('id');
                common.confirm({
                    huiTit:'提示',
                    huiTxt:'一旦选择后无法更改，是否继续选择该报名者中标',
                    okTxt:'是',
                    failTxt:'否'
                },function(){
                    api.call('/Solution/ChooseBid',{demandId:detailId,solutionId:solutionId},function(result){
                        if(result.code>0){
                            $this.html('已选择');
                            common.confirm({
                                huiTit:'提示',
                                huiTxt:'您已选择中标用户 请查看我的—我的订单—处理中',
                                okTxt:'转到我的',
                                failTxt:'稍后再说'
                            },function(){
                                window.location.href='/person/index.html'
                            })
                        }else{
                            common.showToast(result.msg);
                        }
                    });
                })
            })
        }
    }
    numberDetail.init();
})