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
    var getAreaId=common.getAreaId();
    var question = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.getCatInfo();
            this.freePublish();
            this.offerPublish();
            this.publishCase();
        },
        freePublish: function () {
            if(pid==144 || pid==145){
                $('.ques-areaId').hide();
            }else{
                this.selectArea();
            }
            if (pid == 146) {
                $('#quesReward').html('悬赏金额');
                $('#ques-money').show();
                $('.ques-areaId').show();
            }
            if(pid==144){
                $('.ques-select-tit').hide();
            }
            //免费发布1、免费咨询2、社会公益 3、海外市场4、安全保障
            common.moduleName();
            $('#ques-btn').click(function () {
                var moduleType;
                var memo = $.trim($('.ques-txt').val());
                var title = $.trim($('#header-select-tit').val()) || "";
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                if(parseInt(pid)!==144){
                    if(title == "" || title == null){
                        common.showToast('请填写一下标题');
                        return;
                    }
                }
                $('.quesCat-menu li').each(function () {
                    if ($(this).hasClass('active')) {
                        moduleType = $(this).data('id');
                    }
                })
                if(pid==144){
                    //免费咨询
                    api.call('/Demand/PublishQuestion', {
                        memberId: memberId,
                        memo: memo,
                        bigModuleType:pid,
                        moduleType: moduleType,
                    }, function (result) {
                        if (result.code > 0) {
                            common.showToast(result.msg);
                            window.location.href = '/release/index.html?pid=' + pid + '&listId=' + moduleType;
                        } else {
                            common.showToast(result.msg);
                        }
                    });
                }else if(pid==145){
                    //社会公益
                    api.call('/Demand/PublishWelfare', {
                        memberId: memberId,
                        title: title,
                        memo: memo,
                        bigModuleType:pid,
                        moduleType: moduleType,
                    }, function (result) {
                        if (result.code > 0) {
                            common.showToast(result.msg);
                            window.location.href = '/release/index.html?pid=' + pid + '&listId=' + moduleType;
                        } else {
                            common.showToast(result.msg);
                        }
                    });
                }
            })
        },
        selectArea:function(){
            new selectArea($("#provinceId"), $("#cityId"), $("#countyId")).init();
            $('#provinceId').data('value',getAreaId.provinceId);
            $('#cityId').data('value', getAreaId.cityId);
            $('#countyId').data('value',getAreaId.countyId);
        },
        offerPublish: function () {
            //悬赏发布 1、悬赏求助
            if (pid == 146) {
                common.moduleName();
                $('.ques-money').removeClass('hide');
                $('#ques-btn').click(function () {
                    var moduleType=pid;
                    var memo = $.trim($('.ques-txt').val());
                    var title = $.trim($('#header-select-tit').val());
                    var totalFee = parseFloat($.trim($('.quesMoney-txt').val()));
                    var validDays =  $.trim($('.ques-day').val());
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
                        validDays: validDays
                    }, function (result) {
                        if (result.code > 1) {
                            var release ={};
                            result.data.returnUrl ='http://m.qunshihui.net.cn/release/index.html?pid='+pid;;
                            release.payData = result.data;
                            localStorage.setItem('release', JSON.stringify(release));
                            window.location.href = '/release/pay.html';
                        } else {
                            common.showToast(result.msg);
                        }
                    });
                })
            }
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
            if (pid == 147) {
                $('.ques-cost').removeClass('hide');
                $('.ques-protocol').removeClass('hide');
                $('.ques-areaId').show();
                common.moduleName();
                $('#hideName,#hideArea,#needLitigationFund,#needLitigationBond').click(function(){
                    $(this).toggleClass('ques-checked');
                })
                $('#ques-btn').click(function () {
                    var  miniBudget= $.trim($('#minMoney').val());
                    var  maxBudget= $.trim($('#maxMoney').val());
                    var  hideName=$('#hideName').hasClass('ques-checked');
                    var  hideArea=$('#hideArea').hasClass('ques-checked');
                    var needLitigationFund=$('#needLitigationFund').hasClass('ques-checked');
                    var needLitigationBond=$('#needLitigationBond').hasClass('ques-checked');
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
                    if (miniBudget=="" || maxBudget=="") {
                        common.showToast('请选择需要的律师费区间');
                        return;
                    }
                    if ((isNaN(miniBudget)) || isNaN(maxBudget)) {
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
                        provinceId: getAreaId.provinceId,
                        cityId: getAreaId.provinceId,
                        countyId: getAreaId.provinceId,
                        miniBudget: miniBudget,
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
    }
    question.init();
})