/**
 * Created by admin on 2016/3/21.
 */
/**
 * Created by loogn on 2016/3/15.
 */
require.config(config);
define(function(require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pid = common.requestUrl('pid');
    var getAreaId=common.getAreaId();
    var memberId = common.getUser();
    if (memberId == "" || memberId == null) {
        memberId = 0;
    } else {
        memberId = common.getUser().ID;
    }
    var question = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.offerPublish();
            this.inclusiveFinance();
        },
        offerPublish: function () {
            //诉讼金融
            common.moduleName();
            $('.hasSponsor').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasMortgage').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('#totalFee').blur(function(){
                $('.quesMoney-txt').val( $.trim($('#totalFee').val()));
            })
            $('#ques-btn').click(function () {
                var rateRange= $.trim($('#rateRange').val());
                var borrowPeriod= $.trim($('#borrowPeriod').val());
                var memo =  $.trim($('.ques-txt').val());
                var title = $('#header-select-tit').html() || "";
                var totalFee = parseInt($.trim($('#totalFee').val())*10000);
                var validDays =  $.trim($('.ques-day').val());
                var borrowPeriod= $.trim($('#borrowPeriod').val());
                var hasRecommand=$('.hasRecommand').hasClass('ques-checked');
                var hasSponsor=$('.hasSponsor').hasClass('ques-checked');
                var hasMortgage=$('.hasMortgage').hasClass('ques-checked');
                var borrowerName= $.trim($('.quwsLaw-Name').val());
                var borrowerCardNO= $.trim($('.quwsLaw-ID').val());
                var borrowerInfo= $.trim($('.quwsLaw-info').val()) || "";
                if(title=="" || title==null){
                    common.showToast('请填写标题');
                }
                if(totalFee=="" || totalFee==null){
                    common.showToast('请填写借款金额');
                    return;
                }
                if(borrowPeriod=="" || borrowPeriod==null){
                    common.showToast('请填写借款期限');
                    return;
                }
                if(rateRange=="" || rateRange==null){
                    common.showToast('请填写利率范围');
                    return;
                }
                if(borrowerName=="" || borrowerName==null){
                    common.showToast('请填写姓名');
                    return;
                }
                if(borrowerCardNO=="" || borrowerCardNO==null){
                    common.showToast('请填写证件号');
                    return;
                }
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                if (isNaN(totalFee)) {
                    common.showToast('请输入数字');
                    return;
                }
                if (isNaN(validDays)) {
                    common.showToast('请输入数字');
                    return;
                }
                if (validDays == "" || validDays == null || validDays == 0) {
                    common.showToast('请输入有效期天数');
                    return;
                }
                api.call('/Demand/PublishLitigationFinance',{
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    totalFee: totalFee,
                    validDays: validDays,
                    rateRange:rateRange,
                    borrowPeriod:borrowPeriod,
                    hasSponsor:hasSponsor,
                    hasMortgage:hasMortgage,
                    borrowerName:borrowerName,
                    borrowerCardNO:borrowerCardNO,
                    borrowerInfo:borrowerInfo,
                    provinceId:getAreaId.provinceId,
                    cityId:getAreaId.cityId,
                    countyId:getAreaId.countyId
                }, function (result) {
                    if (result.code > 0) {
                        question.locationUrl(result);
                    } else {
                        common.showToast('系统错误');
                    }
                });
            })
        },
        locationUrl:function(result){
            var release ={};
            result.data.returnUrl = 'http://m.qunshihui.net.cn/release/lawList.html?pid='+pid;
            release.payData = result.data;
            localStorage.setItem('release', JSON.stringify(release));
            window.location.href = '/release/pay.html';
        },
        //普惠金融
        inclusiveFinance:function(){
            common.moduleName();
            $('.hasSponsor').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasMortgage').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasRecommand').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('#totalFee').blur(function(){
                $('.quesMoney-txt').val( $.trim($('#totalFee').val()));
            })
            $('#ques-btn').click(function () {
                var rateRange= $.trim($('#rateRange').val());
                var borrowPeriod= $.trim($('#borrowPeriod').val());
                var memo =  $.trim($('.ques-txt').val());
                var title =  $.trim($('#header-select-tit').val());
                var totalFee = parseInt( $.trim($('#totalFee').val())*10000);
                var validDays =  $.trim($('.ques-day').val());
                var borrowPeriod= $.trim($('#borrowPeriod').val());
                var hasSponsor=$('.hasSponsor').hasClass('ques-checked');
                var hasMortgage=$('.hasMortgage').hasClass('ques-checked');
                var hasRecommand=$('.hasRecommand').hasClass('ques-checked');
                var borrowerCardNO= $.trim($('.quwsLaw-ID').val());
                var borrowerInfo= $.trim($('.quwsLaw-info').val()) || "";
                if(totalFee=="" || totalFee==null){
                    common.showToast('请填写借款金额');
                    return;
                }
                if(borrowPeriod=="" || borrowPeriod==null){
                    common.showToast('请填写借款期限');
                    return;
                }
                if(rateRange=="" || rateRange==null){
                    common.showToast('请填写利率范围');
                    return;
                }
                if(borrowerCardNO=="" || borrowerCardNO==null){
                    common.showToast('请填写证件号');
                    return;
                }
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                if (isNaN(totalFee)) {
                    common.showToast('请输入数字');
                    return;
                }
                if (isNaN(validDays)) {
                    common.showToast('请输入数字');
                    return;
                }
                if (validDays == "" || validDays == null || validDays == 0) {
                    common.showToast('请输入有效期天数');
                    return;
                }
                api.call('/Demand/PublishInclusiveFinance',{
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    totalFee: totalFee,
                    validDays: validDays,
                    rateRange:rateRange,
                    borrowPeriod:borrowPeriod,
                    hasSponsor:hasSponsor,
                    hasMortgage:hasMortgage,
                    hasRecommand:hasRecommand,
                    borrowerCardNO:borrowerCardNO,
                    borrowerInfo:borrowerInfo,
                    provinceId:getAreaId.provinceId,
                    cityId:getAreaId.cityId,
                    countyId:getAreaId.countyId
                }, function (result) {
                    if (result.code > 0) {
                        question.locationUrl(result);
                    } else {
                        common.showToast('系统错误');
                    }
                });
            })
        }
    }
    question.init();
})