/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var docClass = "";
    var limit = 15;
    var pageIndex = 1;
    var keyword = "";
    var law = {
        init: function () {
            this.newsListData();
            this.doSearch();
        },
        newsListData: function () {
            $("#searchImg").click(function () {
                keyword = $.trim($("#searchInput").val());
                if(keyword=="" || keyword==null){
                    common.showToast('请输入搜索关键字');
                    return;
                }
                var lawData=localStorage.getItem('lawData');
                if(lawData!==null){
                    lawData=JSON.parse(lawData);
                    lawData.keyword=keyword;
                }else{
                    lawData={};
                    lawData.keyword=keyword;
                }
                localStorage.setItem('lawData',JSON.stringify(lawData));
                window.location.href = "/tools/lawSearch.html";
            });
            $("#moredata").click(function () {
                law.MoreList();
            });
            api.call('/dict/GetTypeDict', {'dictType': 4, 'parentId': 0}, function (result) {
                if (result.code > 0 && result.data) {
                    var html = template('tpl-lawType', result);
                    $('.wenshuclass').html(html);
                    $(".wenshuclass li").on('click', function () {
                        var $this = $(this);
                        $this.addClass("current").siblings().removeClass("current");
                        docClass = $this.data("id");
                        law.doSearch();
                    });
                } else {
                    common.showToast('系统错误')
                }
            });
        },
        doSearch: function () {
            keyword = $.trim($("#searchInput").val());
            $("#listContainer").html("");
            $("#moredata,#nodata").hide();
            pageIndex = 1;
            this.MoreList();
        },
        MoreList: function () {
            api.call('/law/GetLawList', {pageIndex: pageIndex, classId: docClass}, function (result) {
                if (result.data && result.code > 0) {
                    var html = template("itemTplLaw", result);
                    pageIndex += 1;
                    $("#listContainer").append(html);
                    if (result.length < limit) {
                        $("#moredata").hide();
                        $("#nodata").show();
                    } else {
                        $("#moredata").show();
                        $("#nodata").hide();
                    }

                } else {
                    $("#moredata").hide();
                    $("#nodata").show();
                }
            });
        }
    }
    law.init();
})