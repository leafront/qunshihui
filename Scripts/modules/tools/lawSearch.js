/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pageIndex=1;
    var lawSearch={
        init:function(){
            this.searchList();
            $(".consult-moreData").click(function () {
                pageIndex+=1;
                lawSearch.moreList();
            });
        },
        searchList:function(){
            $('.consult-moreData,.no-moreData').hide();
            pageIndex = 1;
            this.moreList();
        },
        moreList:function(){
            var keyword =JSON.parse(localStorage.getItem('lawData')).keyword;
            api.call('/law/GetLawItemList',{'keyword':keyword,'pageIndex':pageIndex},function(result){
                if(result.code>0 && result.data){
                    if(result.data==0){
                        common.showToast('没有搜索到有关的数据');
                        return;
                    }
                    $('.consult-moreData').show();
                    var html=template('itemTplItem',result);
                    $("#listContainer").append(html);
                }else{
                    $('.consult-moreData').hide();
                    $('.no-moreData').show();
                    common.showToast('暂无数据')
                }
            });
        }
    }
    lawSearch.init();
})