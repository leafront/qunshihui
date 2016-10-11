/**
 * Created by admin on 2016/4/5.
 */
    require.config(config);
    require(['template','common','api'],function(template,common,api){
        var memberId=common.getUser();
        if(memberId=="" || memberId==null){
            memberId=0;
        }else{
            memberId=common.getUser().ID;
        }
        var type=common.requestUrl('state');
        var pageIndex=1;
        var keyword="";
        var personCard={
            init:function(){
                this.getOrder();
            },
            getOrder:function(){
                api.call('/order/GetMyOrder', {
                    memberId: memberId,
                    keyword:keyword,
                    type:type,
                    pageIndex:pageIndex
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast('保存成功');
                    }else{
                        common.showToast('系统错误');
                    }
                });
            }

        }
        personCard.init();
    })