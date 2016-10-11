/**
 * Created by admin on 2016/4/21.
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
    //普惠金融
    var inclusiveFinance = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.release();
        },
        locationUrl:function(result){
            var release ={};
            result.data.returnUrl = 'http://m.qunshihui.net.cn/release/lawList.html?pid='+pid;
            release.payData = result.data;
            localStorage.setItem('release', JSON.stringify(release));
            window.location.href='http://www.qunshihui.net.cn/weixin/TransferCode?state=mpay';
        },
        //普惠金融可以走通
        release:function(){
            document.getElementById('totalFee').oninput=function(){
                var dayValue=$(this).val();
                if(dayValue.length>4){
                    $(this).val(dayValue.slice(0,4));
                }
            }
            document.getElementById('borrowPeriod').oninput=function(){
                var dayValue=$(this).val();
                if(dayValue.length>4){
                    $(this).val(dayValue.slice(0,4));
                }
            }
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
                var totalFee = parseInt( $.trim($('#totalFee').val())*100);
                var validDays =  $.trim($('.ques-day').val());
                var borrowPeriod= $.trim($('#borrowPeriod').val());
                var hasRecommend;
                $('.hasRecommand').each(function(){
                    if($(this).hasClass('ques-checked')){
                        hasRecommend=$(this).data('statue');
                    }
                })
                var hasSponsor;
                $('.hasSponsor').each(function(){
                    if($(this).hasClass('ques-checked')){
                        hasSponsor=$(this).data('statue');
                    }
                })
                var hasMortgage;
                $('.hasMortgage').each(function(){
                  if($(this).hasClass('ques-checked')){
                      hasMortgage=$(this).data('statue');
                  }
                })
                var uses=$('#purpose').val();
                var provinceId=$('#provinceId').val();
                var cityId=$('#cityId').val();
                var countyId=$('#countyId').val();
                if(title=="" || title==null){
                    common.showToast('请填写标题');
                    return;
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
                if(uses=="" || uses==null){
                    common.showToast('请填借款用途');
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
                    hasRecommend:hasRecommend,
                    uses:uses,
                    provinceId:provinceId,
                    cityId:cityId,
                    countyId:countyId
                }, function (result) {
                    if (result.code > 0) {
                        inclusiveFinance.locationUrl(result);
                    } else {
                        common.showToast('系统错误');
                    }
                });
            })
        }
    }
    inclusiveFinance.init();
})