/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var LawID=common.requestUrl('LawID');
    var lawInfo={
        init:function(){
            this.newsListData();
        },
        newsListData:function(){
            api.call('/law/GetLawInfo',{LawID:LawID},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-lawInfo',result);
                    $('.container').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        },
    }
    lawInfo.init();
})