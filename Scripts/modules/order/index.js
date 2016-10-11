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
    var status=common.requestUrl('state');
    var pageIndex=1;
    var keyword="";
    var menuLi;
    var order={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.switchSelect();
            if (history.pushState) {
                window.addEventListener("popstate", function() {
                    order.fnHashTrigger();
                });
                // 默认载入
                order.fnHashTrigger();
            }
        },
        switchSelect:function(){
            menuLi=$('#consultList-menu li').on('click',function(){
                var query =$(this).data('href').split("?")[1];;
                if (history.pushState && query && !$(this).hasClass('active')) {
                    menuLi && menuLi.removeClass("active");
                    menuLi = $(this).addClass("active");
                    status=$(this).data('type');
                    order.searchList();
                    // history处理
                    document.title ='我的订单';
                    var title='我的订单';
                    if (event && /\d/.test(event.button)) {
                        history.pushState({ title: title }, title, location.href.split("?")[0] + "?" + query);
                    }
                }
            })
            $('.consult-moreData').click(function(){
                pageIndex+=1;
                order.getOrder();
            })
            $('.consult-search').blur(function(){
                order.searchList();
            })
        },
        fnHashTrigger:function(target) {
            var query = location.href.split("?")[1], eleTarget = target || null;
            if (typeof query == "undefined") {
                if (eleTarget = menuLi.eq(0)) {
                    history.replaceState(null, document.title, location.href.split("#")[0] + "?" + eleTarget.data('href').split("?")[1]);
                    order.fnHashTrigger(eleTarget);
                }
            } else {
                menuLi.each(function() {
                    if (eleTarget === null && $(this).data('href').split("?")[1] === query) {
                        eleTarget = this;
                    }
                });
                if (!eleTarget) {
                    history.replaceState(null, document.title, location.href.split("?")[0]);
                    order.fnHashTrigger();
                } else {
                    $(eleTarget).trigger("click");
                }
            }
        },
        getOperation:function(url,id,callBack){
            api.call(url,{
                orderId:id,
            }, function (result) {
                if (result.code>0) {
                    common.showToast(result.msg);
                    if(callBack){
                        callBack();
                    }
                }
            });
        },
        offerReceipt:function(){
            //悬赏确认收货
            $('.order-receipt1').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                order.getOperation('/order/OfferReceipt',id,function(){
                    window.location.reload();
                });
            })
            //诉讼仲裁确认收货
            $('.order-arbitrate').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                order.getOperation('/order/LegalReceipt',id,function(){
                    window.location.reload();
                });
            })
            //喊Ta收货
            $('.order-receipt2').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                order.getOperation('/Notification/HurryReceive',id);
            })
            //支付
            $('.order-pay1').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                api.call('/Order/GetPayInfo',{
                    OrderId:id
                },function(result){
                    if (result.code>0) {
                        var release ={};
                        result.data.returnUrl =location.href;
                        release.payData = result.data;
                        localStorage.setItem('release', JSON.stringify(release));
                        window.location.href = '/release/pay.html';
                    } else {
                        common.showToast(result.msg);
                    }
                })
            })
            //喊Ta支付
            $('.order-pay2').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                order.getOperation('/Notification/HurryPay',id);
            })
            //喊Ta去评价
            $('.order-evaluate').click(function(event){
                event.stopPropagation();
                var id=$(this).data('id');
                order.getOperation('/Notification/HurryEvaluate',id);
            })
        },
        searchList:function(){
            keyword = $.trim($(".consult-search").val());
            $("#consultTab").html("");
            $('.consult-moreData,.no-moreData').hide();
            pageIndex = 1;
            this.getOrder();
        },
        getOrder:function(){
            api.call('/order/GetMyOrder', {
                memberId: memberId,
                keyword:keyword,
                type:status,
                pageIndex:pageIndex
            }, function (result) {
                if (result.code > 0 && result.data.length>0) {
                    var data=result.data;
                    result.memberId=memberId;
                   $('.consult-moreData').show();
                   $('.no-moreData').hide();
                   var html=template('tpl-order-tab',result);
                   $('#consultTab').append(html);
                    order.offerReceipt();
                   $('.order-item').click(function(){
                        var id=$(this).data('id');
                        var moduleId=$(this).data('moduleid');
                        window.location.href='/release/detail.html?pid='+moduleId+'&detailId='+id;
                   })
                }else{
                    $('.consult-moreData').hide();
                    $('.no-moreData').show();
                }
            });
        }
    }
    order.init();
})
