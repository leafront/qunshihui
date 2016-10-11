/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pageIndex = 1;
    var keyword = "fsdf";
    var judgment={
        init:function(){
            this.judgmentList();
        },
        MoreList:function() {
            if (keyword.length <= 0) {
                $("#listContainer").html("");
                $("#moredata,#nodata").hide();
                pageIndex = 1;
                return;
            }
            api.call('/law/GetJudgmentList', { pageIndex: pageIndex, keyword: keyword}, function (result) {
                if (result.data&& result.code>0) {
                    var html=template('itemTpl',result);
                    pageIndex += 1;
                    $("#listContainer").append(html);
                    $("#moredata").show();
                    $("#nodata").hide();
                } else {
                    $("#moredata").hide();
                    $("#nodata").show();
                }
            });
        },
        search:function () {
            $("#listContainer").html("");
            $("#moredata,#nodata").hide();
            pageIndex = 1;
            this.MoreList();
        },
        judgmentList:function(){
            $("#searchImg").click(function () {
                keyword = $.trim($("#searchInput").val());
                var lawData=localStorage.getItem('lawData');
                if(lawData!==null){
                    lawData=JSON.parse(lawData);
                    lawData.searchWord=keyword;
                }else{
                    lawData={};
                    lawData.searchWord=keyword;
                }
                localStorage.setItem('lawData',JSON.stringify(lawData));
                if(keyword=="" || keyword==null){
                    common.showToast('请输入搜索关键字');
                    return;
                }
                judgment.search();
            })
            var lawData=localStorage.getItem('lawData');
            if(lawData!=="" || lawData!==null){
                try{
                    if(JSON.parse(lawData).searchWord!==""){
                        keyword = JSON.parse(lawData).searchWord;
                        judgment.search();
                    }
                }catch(err){
                }
            }
            $("#moredata").click(function () {
                judgment.MoreList();
            })
        }
    }
    judgment.init();
})