/**
 * Created by admin on 2016/4/5.
 */

require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var pageIndex=1;
    var status=1;
    var menuLi;
    var release={
        init:function(){
            this.showTab();
            if (history.pushState) {
                window.addEventListener("popstate", function() {
                    release.fnHashTrigger();
                });
                // 默认载入
                release.fnHashTrigger();
            }
        },
        showTab:function(){
            menuLi=$('#consultList-menu li').on('click',function(){
                pageIndex=1;
                status=$(this).data('status');
                var query =$(this).attr('href').split("?")[1];;
                if (history.pushState && query && !$(this).hasClass('active')) {
                    menuLi && menuLi.removeClass("active");
                    menuLi = $(this).addClass("active");
                    release.moreList();
                    // history处理
                    document.title ='我的发布';
                    var title='我的发布';
                    if (event && /\d/.test(event.button)) {
                        history.pushState({ title: title }, title, location.href.split("?")[0] + "?" + query);
                    }
                }
            })
            $(".consult-moreData").click(function () {
                pageIndex+=1;
                release.getMyDemand();
            });

        },
        moreList:function(){
            $("#consultTab").html("");
            $("#moredata,#nodata").hide();
            this.getMyDemand();
        },
        fnHashTrigger:function(target) {
            var query = location.href.split("?")[1], eleTarget = target || null;
            if (typeof query == "undefined") {
                if (eleTarget = menuLi.eq(0)) {
                    history.replaceState(null, document.title, location.href.split("#")[0] + "?" + eleTarget.attr('href').split("?")[1]);
                    release.fnHashTrigger(eleTarget);
                }
            } else {
                menuLi.each(function() {
                    if (eleTarget === null && $(this).attr('href').split("?")[1] === query) {
                        eleTarget = this;
                    }
                });
                if (!eleTarget) {
                    history.replaceState(null, document.title, location.href.split("?")[0]);
                    release.fnHashTrigger();
                } else {
                    $(eleTarget).trigger("click");
                }
            }
        },
        cancelRelease:function(){
            $('.cancelRelease').click(function(){
                var $this=$(this);
                var id=$(this).data('id');
                api.call('/Demand/CancelPublish', {
                    demandId:id,
                }, function (result) {
                    if(result.code>0){
                        common.showToast(result.msg);
                        $this.parents('.release-item').remove();
                    }else {
                        common.showToast(result.msg);
                    }
                });
            })
        },
        getPayInfo:function(){
            $('.goPay').click(function(){
                var id=$(this).data('id');
                api.call('/Demand/GetPayInfo', {
                    demandId:id
                }, function (result) {
                    if(result.code>0){
                        var release ={};
                        result.data.returnUrl ='http://m.qunshihui.net.cn/person/myRelease.html';
                        release.payData = result.data;
                        localStorage.setItem('release', JSON.stringify(release));
                        window.location.href = '/release/pay.html';
                    }else {
                        common.showToast(result.msg);
                    }
                });
            })
        },
        getMyDemand:function(){
            api.call('/Demand/GetMyDemand', {
                memberId: memberId,
                status:status,
                pageIndex:pageIndex,
            }, function (result) {
                if (result.code > 0) {
                    $('.consult-moreData').show();
                    $('.no-moreData').hide();
                    var html=template('tpl-release-tab',result);
                    $('#consultTab').append(html);
                    release.cancelRelease();
                    release.getPayInfo();
                    if(result.data.length==0){
                        $('.consult-moreData').hide();
                        $('.no-moreData').show();
                    }
                }else{
                    $('.consult-moreData').hide();
                    $('.no-moreData').hide();
                }
            });
        }
    }
    release.init();
})