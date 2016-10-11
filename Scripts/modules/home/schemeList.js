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
    var detailId = common.requestUrl('detailId');
    var pageIndex=1;
    //方案列表
    var schemeList = {
        init: function () {
            this.getDemandBid();
        },
        getDemandBid:function(){
            api.call('/Solution/GetDemandBid',{demandId:detailId,pageIndex:pageIndex},function(result){
                if(result.code>0){
                    var html=template('tpl-schemeList-cont',result);
                    $('#schemeList-cont').html(html);
                    schemeList.selectEntered();
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
                    api.call('/Solution/ChooseSolution',{demandId:detailId,solutionId:solutionId},function(result){
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
    schemeList.init();
})
