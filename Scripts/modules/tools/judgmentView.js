/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var judgmentView={
        init:function(){
            this.judgmentViewData();
        },
        judgmentViewData:function(){
            var newsId=common.requestUrl('judgmentId');
            api.call('/law/GetJudgmentInfo',{docId :newsId},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-judgmentView',result);
                    $('#content').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        }
    }
    judgmentView.init();
})