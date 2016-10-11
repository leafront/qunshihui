/**
 * Created by Administrator on 2016/3/10.
 * */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var itemId=common.requestUrl('ItemID');
    var LawID=common.requestUrl('LawID');
    var lawDetail={
        init:function(){
            this.lawDetail();
        },
        lawDetail:function(){
            api.call('/law/GetLawItemInfo',{itemId:itemId,LawID:LawID},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-lawDetail',result);
                    $('#lawDetail-cont').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        },
    }
    lawDetail.init();
})