require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var lazyload=require('lazyload');
    var moduleTypeIds="";
    var article={
        init:function(){
            this.showTab();
            this.newsData();
        },
        showTab:function(){
            api.getTypeDict({'dictType':2,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    var html = template('tpl-consultMenu', result);
                    $('#consultList-menu').html(html);
                    $('#consultList-menu li:gt(0)').click(function(){
                        var index=$(this).index();
                        if($(this).data('id')==moduleTypeIds){
                            return;
                        }
                        moduleTypeIds=$(this).data('id');
                        $(this).addClass('active').siblings().removeClass('active');
                        article.newsData();
                    })
                    for(var i=0;i<result.data.length;i++){
                        moduleTypeIds+=result.data[i].ID+',';
                    }
                    moduleTypeIds=moduleTypeIds.slice(0,-1);
                    var moduleIds=moduleTypeIds;
                    $('#consultList-menu li').eq(0).click(function(){
                        var index=$(this).index();
                        moduleTypeIds=moduleIds;
                        $(this).addClass('active').siblings().removeClass('active');
                        article.newsData();
                    })
                    article.newsData();
                }else{
                    common.showToast('系统错误');
                }
            })
        },
        newsData:function(){
            api.call('/news/GetNewsList',{'newsType':moduleTypeIds,'pageIndex':1},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-news',result);
                    $('.home-article-menu').html(html);
                    $('.lazy').lazyload({
                        placeholder : 'images/loading.gif',
                        effect: "fadeIn"
                    })
                }else{
                    common.showToast('系统错误');
                }
            });
        }
    }
    article.init();
})
