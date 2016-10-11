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
    var maxBudget;
    var minBudget;
    //诉讼仲裁
    var getAreaId=common.getAreaId();
    var publishCase = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.getCatInfo();
            this.selectArea();
            this.publishCase();
        },
        selectArea:function(){
            new selectArea($("#provinceId"), $("#cityId"), $("#countyId")).init();
            $('#provinceId').data('value',getAreaId.provinceId);
            $('#cityId').data('value', getAreaId.cityId);
            $('#countyId').data('value',getAreaId.countyId);
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
        },
        //诉讼仲裁
        publishCase: function () {
            $('.ques-cost').removeClass('hide');
            $('.ques-protocol').removeClass('hide');
            $('.ques-areaId').show();
            common.moduleName();
            $('#hideName,#hideArea,#needLitigationFund,#needLitigationBond').click(function(){
                $(this).toggleClass('ques-checked');
            })
            $('#minMoney').click(function(){
                $('.publishcase-area').toggleClass('hide');
                $('.mask').toggleClass('hide');
            })
            $('.mask').click(function(){
                $('.publishcase-area').toggleClass('hide');
                $('.mask').toggleClass('hide');
            })
            $('#publishcase-menu li').click(function(){
                var budeget=$(this).html().split('~')
                if($(this).html()=='50000以上'){
                    maxBudget=100000;
                    minBudget=500000;
                }else{
                    minBudget=budeget[0]
                    maxBudget=budeget[1];
                }
                $('#minMoney').html($(this).html());
                $('.publishcase-area').toggleClass('hide');
                $('.mask').toggleClass('hide');
            })
            $('#ques-btn').click(function () {
                var  hideName=$('#hideName').hasClass('ques-checked');
                var  hideArea=$('#hideArea').hasClass('ques-checked');
                var needLitigationFund=$('#needLitigationFund').hasClass('ques-checked');
                var needLitigationBond=$('#needLitigationBond').hasClass('ques-checked');
                var budget=$('#minMoney').html();
                var moduleType;
                var memo =  $.trim($('.ques-txt').val());
                var title =  $.trim($('#header-select-tit').val());
                if (title == "" || title == null) {
                    common.showToast('请填写一下标题');
                    return;
                }
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                if (budget=="" || budget==null) {
                    common.showToast('请选择需要的律师费区间');
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
                api.call('/Demand/PublishCase', {
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    moduleType: moduleType,
                    provinceId: provinceId,
                    cityId: cityId,
                    countyId:countyId,
                    minBudget: minBudget,
                    maxBudget: maxBudget,
                    hideName:hideName,
                    hideArea:hideArea,
                    needLitigationFund:needLitigationFund,
                    needLitigationBond:needLitigationBond
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast(result.msg);
                        window.location.href = '/release/index.html?pid=' + pid + '&listId=' + moduleType;
                    } else {
                        common.showToast(result.msg);
                    }
                });
            })
        }
    }
    publishCase.init();
})
