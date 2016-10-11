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
    var number=/^[1-9]\d{0,2}$/;
    var phoneReg = /^(1[34578][0-9])\d{8}$/;
    var question = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            //债权转让
            if(pid==171){
                this.debtCess();
            }else if(pid==172){
                this.debtCrisis();
            }
        },
        debtCess:function(){
            //1、债权转让 //可以走通
            common.moduleName();
            $('.hasSponsor').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasMortgage').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasSponType').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('#ques-btn').click(function () {
                var rateRange= $.trim($('#rateRange').val());
                var memo =  $.trim($('.ques-txt').val());
                var title =  $.trim($('#header-select-tit').val());
                var money = parseInt( $.trim($('#money').val()*1));
                var totalFee=parseInt( $.trim($('#totalFee').val())*1);
                var transferMoney= $.trim($('#borrowPeriod').val());
                var validDays =  $.trim($('.ques-day').val());
                var guaranteeType;
                $('.hasSponType').each(function(){
                    if($(this).hasClass('ques-checked')){
                        guaranteeType=$(this).data('id');
                    }
                })
                var creditorType;
                $('.hasMortgage').each(function(){
                    if($(this).hasClass('ques-checked')){
                        creditorType=$(this).data('id');//债权人类型
                    }
                })
                var creditorName= $.trim($('#creditorName').val()); //债权人姓名
                var creditorTel= $.trim($('#creditorTel').val());
                var guarantee=$('.hasRecommand').hasClass('ques-checked');//是否有担保
                var creditorAdress=$.trim($('#creditorAdress').val());
                var creditorID= $.trim($('#creditorID').val());
                var obligorName= $.trim($('#obligorName').val());
                var obligorTel= $.trim($('#obligorTel').val());
                var obligorAdress= $.trim($('#obligorAdress').val());
                var obligorID= $.trim($('#obligorID').val());
                if(title=="" || title==null){
                    common.showToast('请填写标题');
                    return;
                }
                if(money=="" || money==null){
                    common.showToast('请填写债权金额');
                    return;
                }
                if(number.test(money)==false){
                    common.showToast('请填写正确的三位数以内债权金额');
                    return;
                }
                if(creditorName=="" || creditorName==null){
                    common.showToast('请填写债权人名称');
                    return;
                }
                if (!phoneReg.test(creditorTel)) {
                    common.showToast('债权人联系电话不正确');
                    return;
                }
                if(creditorAdress=="" || creditorAdress==null){
                    common.showToast('请填写债权人地址');
                    return;
                }
                if(creditorID=="" || creditorID==null){
                    common.showToast('请填写债权人证件号');
                    return;
                }
                if(/^[1-9]\d{0,20}$/.test(creditorID)==false){
                    common.showToast('请填写正确债权人证件号');
                    return;
                }
                if(obligorName=="" || obligorName==null){
                    common.showToast('请填写债务人名称');
                    return;
                }
                if(obligorTel=="" || obligorTel==null){
                    common.showToast('请填写债务人联系电话');
                    return;
                }
                if (!phoneReg.test(obligorTel)) {
                    common.showToast('债务人联系电话不正确');
                    return;
                }
                if(obligorAdress=="" || obligorAdress==null){
                    common.showToast('请填写债务人地址');
                    return;
                }
                if(obligorID=="" || obligorID==null){
                    common.showToast('请填写债务人证件号');
                    return;
                }
                if(/^[1-9]\d{0,20}$/.test(obligorID)==false){
                    common.showToast('请填写正确债务人证件号');
                    return;
                }
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                if (isNaN(totalFee) && totalFee!=="") {
                    common.showToast('请填写所属金额数字');
                    return;
                }
                if(number.test(totalFee)==false){
                    common.showToast('请填写正确的三位数以内所属金额数字');
                    return;
                }
                if (validDays=="" || validDays==null) {
                    common.showToast('请输入所属金额数字');
                    return;
                }
                if(number.test(validDays)==false){
                    common.showToast('请输入正确的三位数以内有效天数字');
                    return;
                }
                api.call('/Demand/PublishCreditort',{
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    moduleType:pid,//类型
                    totalFee: totalFee,//  所需金额
                    validDays: validDays,
                    money:money,//债权金额
                    transferMoney:transferMoney,//转让金额
                    guaranteeType :guaranteeType,//0无担保，1他人担保，2抵押担保，3质押担保，4其他担保
                    creditorType : creditorType,//债权人类型 1个人，2企业--int,
                    creditorName : creditorName,//债权人姓名
                    creditorPhone : creditorTel,//债权人联系电话
                    creditorAddress :creditorAdress,//债权人联系地址
                    creditorCardNO :creditorID,//债权人联系地址
                    debtorType : 1,//债务人类型 1个人，2企业
                    debtorName :obligorName,//债务人姓名
                    debtorPhone :obligorTel,//债务人联系电话
                    debtorAddress :obligorAdress,// 债务人联系地址
                    debtorCardNO :obligorID,//债务人证件号
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
        debtCrisis:function(){
            //1、债务危机可以走通
            common.moduleName();
            $('.hasSponsor').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasMortgage').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('.hasSponType').click(function(){
                $(this).addClass('ques-checked').siblings().removeClass('ques-checked');
            })
            $('#ques-btn').click(function (){
                var rateRange= $.trim($('#rateRange').val());
                var memo =  $.trim($('.ques-txt').val());
                var title =  $.trim($('#header-select-tit').val());
                var money = parseFloat($.trim($('#money').val()));
                var totalFee= $.trim($('#totalFee').val());
                var returnRate= $.trim($('#borrowPeriod').val());
                var validDays =  $.trim($('.ques-day').val());
                var guaranteeType;
                $('.hasSponType').each(function(){
                    if($(this).hasClass('ques-checked')){
                        guaranteeType=$(this).data('id');
                    }
                })
                var creditorType;
                $('.hasMortgage').each(function(){
                    if($(this).hasClass('ques-checked')){
                        creditorType=$(this).data('id');//债权人类型
                    }
                })
                var creditorName= $.trim($('#creditorName').val()); //债权人姓名
                var creditorTel= $.trim($('#creditorTel').val());
                var creditorAdress= $.trim($('#creditorAdress').val());
                var creditorID= $.trim($('#creditorID').val());
                var obligorName= $.trim($('#obligorName').val());
                var obligorTel= $.trim($('#obligorTel').val());
                var obligorAdress= $.trim($('#obligorAdress').val());
                var obligorID= $.trim($('#obligorID').val());
                if(title=="" || title==null){
                    common.showToast('请填写标题');
                    return;
                }
                if(money=="" || money==null){
                    common.showToast('请输入债务金额');
                    return;
                }
                if(number.test(money)==false){
                    common.showToast('请输入正确的三位数以内债务金额');
                    return;
                }
                if(returnRate=="" || returnRate==null){
                    common.showToast('请输入回报率');
                    return;
                }
                if(/^[1-9]\d{0,1}$/.test(returnRate)==false){
                    common.showToast('请输入正确两位数以内的回报率');
                }
                if(creditorName=="" || creditorName==null){
                    common.showToast('请输入债权人名称');
                    return;
                }
                if(creditorTel=="" || creditorTel==null){
                    common.showToast('请输入债权人联系电话');
                    return;
                }
                if (!phoneReg.test(creditorTel)) {
                    common.showToast('债权人联系电话不正确');
                    return;
                }
                if(creditorAdress=="" || creditorAdress==null){
                    common.showToast('请输入债权人地址');
                    return;
                }
                if(creditorID=="" || creditorID==null){
                    common.showToast('请输入债权人证件号');
                    return;
                }
                if(/^[1-9]\d{0,20}$/.test(creditorID)==false){
                    common.showToast('请填写正确债权人证件号');
                    return;
                }
                if(obligorName=="" || obligorName==null){
                    common.showToast('请输入债务人名称');
                    return;
                }
                if(obligorTel=="" || obligorTel==null){
                    common.showToast('请输入债务人联系电话');
                    return;
                }
                if (!phoneReg.test(obligorTel)) {
                    common.showToast('债务人联系电话电话不正确');
                    return;
                }
                if(obligorAdress=="" || obligorAdress==null){
                    common.showToast('请输入填写债务人地址');
                    return;
                }
                if(obligorID=="" || obligorID==null){
                    common.showToast('请输入债务人证件号');
                    return;
                }
                if(/^[1-9]\d{0,20}$/.test(creditorID)==false){
                    common.showToast('请填写正确债务人证件号');
                    return;
                }
                if (memo == "" || memo == null) {
                    common.showToast('请输入简单描述一下您的需求');
                    return;
                }
                if (totalFee=="" || totalFee==null) {
                    common.showToast('请输入所属金额数字');
                    return;
                }
                if(number.test(totalFee)==false){
                    common.showToast('请输入正确的三位数以内所属金额数字');
                    return;
                }
                if (validDays=="" || validDays==null) {
                    common.showToast('请输入所属金额数字');
                    return;
                }
                if(number.test(validDays)==false){
                    common.showToast('请输入正确的三位数以内有效天数字');
                    return;
                }
                api.call('/Demand/PublishDebt',{
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    moduleType:pid,//类型
                    totalFee: totalFee,//  所需金额
                    validDays: validDays,
                    money:money,//债权金额
                    returnRate:returnRate,//转让金额
                    guaranteeType :guaranteeType,//0无担保，1他人担保，2抵押担保，3质押担保，4其他担保
                    creditorType : creditorType,//债权人类型 1个人，2企业--int,
                    creditorName : creditorName,//债权人姓名
                    creditorPhone : creditorTel,//债权人联系电话
                    creditorAddress :creditorAdress,//债权人联系地址
                    creditorCardNO :creditorID,//债权人联系地址
                    debtorType : 1,//债务人类型 1个人，2企业
                    debtorName :obligorName,//债务人姓名
                    debtorPhone :obligorTel,//债务人联系电话
                    debtorAddress :obligorAdress,// 债务人联系地址
                    debtorCardNO :obligorID,//债务人证件号
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