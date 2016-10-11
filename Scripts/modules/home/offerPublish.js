/**
 * Created by admin on 2016/4/21.
 */
/**
 * Created by loogn on 2016/3/15.
 */
require.config(config);
define(function (require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var selectArea=require('selectArea');
    var pid = common.requestUrl('pid');
    var memberId = common.getUser();
    if (memberId == "" || memberId == null) {
        memberId = 0;
    } else {
        memberId = common.getUser().ID;
    }
    //悬赏求助
    var getAreaId=common.getAreaId();
    var offerPublish = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.getCatInfo();
            this.offerPublish();
            this.selectArea();
        },
        selectArea:function(){
            new selectArea($("#provinceId"), $("#cityId"), $("#countyId")).init();
            $('#provinceId').data('value',getAreaId.provinceId);
            $('#cityId').data('value', getAreaId.cityId);
            $('#countyId').data('value',getAreaId.countyId);
        },
        offerPublish: function () {
            //悬赏发布 1、悬赏求助
             document.getElementsByClassName('ques-day')[0].oninput=function(){
                var dayValue=$(this).val();
                if(dayValue.length>3){
                    $(this).val(dayValue.slice(0,3));
                }
            }
            $('.ques-day').blur(function(){
                var dayValue=parseInt($(this).val());
                $(this).val(dayValue);
            })
            document.getElementsByClassName('quesMoney-txt')[0].oninput=function(){
                var dayValue=$.trim($(this).val());
                if(dayValue.length>7){
                    $(this).val(dayValue.slice(0,7));
                }
            }
            $('#ques-btn').click(function () {
                var moduleType=pid;
                var memo = $.trim($('.ques-txt').val());
                var title = $.trim($('#header-select-tit').val());
                var totalFee = parseInt($.trim($('.quesMoney-txt').val()*100));
                var validDays = parseInt($.trim($('.ques-day').val()));
                if(validDays.length>3){
                    validDays=$('.ques-day').val(validDays.slice(0,3));
                }
                if(title == "" || title == null){
                    common.showToast('请填写一下标题');
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
                if (totalFee == "" || totalFee == null || totalFee == 0) {
                    common.showToast('请输入悬赏金额');
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
                $('.quesCat-menu li').each(function () {
                    if ($(this).hasClass('active')) {
                        moduleType = $(this).data('id');
                    }
                })
                var provinceId=$('#provinceId').val();
                var cityId=$('#cityId').val();
                var countyId=$('#countyId').val();
                if(provinceId==0){
                    common.showToast('请输入省份');
                    return;
                }
                if(cityId==0){
                    common.showToast('请输入城市');
                    return;
                }
                if(countyId==0){
                    common.showToast('请输入地区');
                    return;
                }
                api.call('/Demand/OfferPublish', {
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    moduleType: moduleType,
                    totalFee: totalFee,
                    validDays: validDays,
                    provinceId: provinceId,
                    cityId: cityId,
                    countyId:countyId
                }, function (result) {
                    if (result.code > 1) {
                        var release ={};
                        result.data.returnUrl ='http://m.qunshihui.net.cn/release/index.html?pid='+pid;;
                        release.payData = result.data;
                        localStorage.setItem('release', JSON.stringify(release));
                        window.location.href='http://www.qunshihui.net.cn/weixin/TransferCode?state=mpay';
                    } else {
                        common.showToast(result.msg);
                    }
                });
            })
        },
        getCatInfo: function () {
            api.getTypeDict({'dictType':pid, 'parentId':0}, function (result) {
                if (result.code > 0 && result.data) {
                    result.data.pid = pid;
                    var html = template('tpl-quesCat', result);
                    $('#ques-cat').html(html);
                    $('.quesCat-menu li').click(function () {
                        $(this).addClass('active').siblings().removeClass('active');
                    })
                } else {
                    common.showToast(result.msg);
                }
            })
        }
    }
    offerPublish.init();
})