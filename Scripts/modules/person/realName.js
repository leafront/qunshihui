/**
 * Created by admin on 2016/4/7.
 */
require.config(config);
define(function(requie,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId = common.getUser();
    if (memberId == "" || memberId == null) {
        memberId = 0;
    } else {
        memberId = common.getUser().ID;
    }
    var realName = {
        init: function () {
            common.wxConfig(['chooseImage','uploadImage']);
            common.uploadImage();
            this.getRealnameInfo();
        },
        CertifiedMember: function () {
            $('.perInfo-btn').click(function () {
                var realName = $.trim($('#name').val());
                var idCard = $.trim($('#id').val());
                if(realName=="" || realName==null){
                    common.showToast('请输入真实姓名');
                    return;
                }
                if(common.isIdCardNo(idCard)==false){
                    return;
                };
                var idCardUrl=$('.CertImage').data('img');
                if(idCardUrl=='' || idCardUrl==null){
                    common.showToast('请输入手持身份证照片');
                    return;
                }
                api.call("/Member/CertifiedRealname", {
                    realName: realName,
                    idCard: idCard,
                    idCardUrl: idCardUrl
                }, function (result) {
                    if(result.code>0){
                        common.showToast(result.msg);
                        window.location.href='/person/index.html';
                    }else{
                        var msg='您已提交认证，工作人员将在3-5个工作日内进行审核，审核期间您不能进行任何修改操作，请耐心等待。'
                        if(result.msg="您目前的状态不能申请认证"){
                            common.showToast(msg);
                        }
                    }
                });
            })
        },
        getRealnameInfo:function(){
            api.call('/Member/GetRealnameInfo', {
            }, function (result) {
                if(result.code>0){
                   var html=template('tpl-real-list',result);
                    $('#real-cont').html(html);
                    realName.CertifiedMember();
                }
            });
        }
    }
    realName.init();
})