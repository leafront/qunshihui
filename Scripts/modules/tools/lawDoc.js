/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var docClass ="";
    var limit = 15;
    var pageIndex = 1;
    var keyword = "";
    var lawDoc = {
        init: function () {
            this.newsListData();
        },
        newsListData: function () {
            $("#searchImg").click(function () {
                keyword = $.trim($("#searchInput").val());
                if(keyword=="" || keyword==null){
                    common.showToast('请输入搜索关键字');
                    return;
                }
                lawDoc.doSearch();
            });
            $("#moredata").click(function () {
                lawDoc.MoreList();
            });
            api.call('/dict/GetTypeDict', {'dictType': 9, 'parentId': 0}, function (result) {
                if (result.code > 0 && result.data) {
                    var html = template('tpl-lawType', result);
                    $('.wenshuclass').html(html);
                    $(".wenshuclass li").on('click', function () {
                        $('#searchInput').val('');
                        $('#searchInput').attr('placeholder','输入关键字查询');
                        var $this = $(this);
                        $this.addClass("current").siblings().removeClass("current");
                        docClass = $this.data("id");
                        lawDoc.doSearch();
                    });
                    docClass=0;
                    lawDoc.doSearch();
                } else {
                    $("#nodata").show();
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
            api.call('/law/GetLawDocList', {pageIndex: pageIndex, docClass: docClass,regId:0,keyword:keyword}, function (result) {
                if (result.data && result.code > 0) {
                    var html = template("itemTplLaw", result);
                    pageIndex += 1;
                    $("#listContainer").append(html);
                    if (result.data.length < limit) {
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
    lawDoc.init();
})