require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var newsList={
        init:function(){
            this.newsListData();
        },
        newsListData:function(){
            var newsId=common.requestUrl('newsId');
            api.call('/news/GetNewsInfo',{'newsId':newsId,'regId':0},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-news',result);
                    $('#news-cont').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        },
    }
    newsList.init();
})