/**
 * Created by admin on 2016/4/20.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pageIndex=1;
    var title="";
    var moduleType="0";
    var orderId=common.requestUrl('orderId');
    var market={
        init:function(){
            this.switchList();
            this.getMarketList();
        },
        switchList:function(){
            api.getTypeDict({
                dictType:151,parentId:0
            },function(result){
                if(result.code>0&&result.data.length>0){
                    var html=template('tpl-market-menu',result);
                    $('#market-menu').html(html);
                    $('#market-menu li').click(function(){
                        moduleType=$(this).data('id');
                        $('#market-list-menu').html('');
                        pageIndex=1;
                        market.getMarketList();
                    })
                }else{
                    common.showToast(result.msg);
                }
            });
            $('.consult-moreData').click(function(){
                pageIndex+=1;
                market.getMarketList();
            });
            $('.consult-search').focus(function(){
                $('#market-cont').hide();
            });
            $('.consult-search').blur(function(){
                title=$.trim($(this).val());
                pageIndex=1;
                $('#market-cont').show();
                if(title.length==0){
                    moduleType = 0;
                };
                $('#market-list-menu').html('');
                market.getMarketList();
            });
        },
        getMarketList:function(){
            api.call('/Activity/GetMarketList', {
                title:title,
                moduleType:moduleType,
                pageIndex:pageIndex,
            }, function (result) {
                /*console.log(title);
                console.log(moduleType);
                console.log(pageIndex);*/
                if (result.code>0&&(result.data.length>0)) {
                    var html=template('tpl-market-list-menu',result);
                    $('#market-list-menu').append(html);
                    $('.consult-moreData').show();
                    $('.no-moreData').hide();
                }else{
                    common.showToast('暂无数据');
                    $('.consult-moreData').hide();
                    $('.no-moreData').show();
                }
            });
        }
    }
    market.init();
})
