require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var moduleTypeIds='2433';
    var insurance={
        init:function(){
            this.showTab();
            this.newsData();
        },
        showTab:function(){
            $('.market-menu_list').click(function(){
                var id=$(this).data('id');
                api.call('/news/GetNewsList',{'newsType':moduleTypeIds,'pageIndex':1},function(result){
                    if(result.code>0 && result.data){
                        var data=result.data;
                        var json=[];
                        for(var i=0;i<data.length;i++){
                            if(id==data[i].NewsID){
                                json.push(data[i]);
                            }
                        }
                        result.data=json;
                        var html=template('tpl-insurance-list',result);
                        $('#insurance-list').html(html);
                    }else{
                        common.showToast('系统错误');
                    }
                });
            });
        },
        newsData:function(){
            api.call('/news/GetNewsList',{'newsType':moduleTypeIds,'pageIndex':1},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-insurance-list',result);
                    $('#insurance-list').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        }
    }
    insurance.init();
})
