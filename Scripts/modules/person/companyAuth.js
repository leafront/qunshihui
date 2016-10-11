/**
 * Created by zhaowenrui on 2016/4/19.
 */
/**
 * Created by admin on 2016/4/11.
 */
require.config(config);
define(function(require,exports,module){
    var api=require('api');
    var template=require('template');
    var common=require('common');
    var wx=require('jweixin');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var id="174";
    var TagsId="";
    var phoneReg=/^(([0\+]\d{2,3}-)?(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,4})?|(?:13\d|15[012356789]|18[0256789]|147)-?\d{5}(\d{3}|\*{3}))?$/;
    var companyAuth={
        init:function(){
            common.wxConfig(['chooseImage','uploadImage']);
            this.uploadImage();
            this.getEnterpriseInfo();
            common.uploadImage('#businessUrl','.CertImage1');
            common.uploadImage('#certificateUrl','.CertImage2');
            common.uploadImage('#BankAccountUrl','.CertImage3');
            common.uploadImage('#registrationUrl','.CertImage4');
            common.uploadImage('#legalIDCardUrl1','.CertImage5');
            common.uploadImage('#legalIDCardUrl2','.CertImage6');
            common.uploadImage('#chooseImage','.CertImage7');
            //zwr
        },
        uploadImage:function(){
            wx.ready(function () {
                // 5 图片接口
                var localId;
                var serverId;
                $('#logoUrl').click(function () {
                    wx.chooseImage({
                        count:1,
                        sizeType:['original','compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            localId = res.localIds[0];
                            $('#logoUrl').attr('src',localId);
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            wx.uploadImage({
                                localId: localId,
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    serverId=res.serverId;
                                    api.call("/system/DownloadWXMedia", { serverId:serverId}, function (result) {
                                        if (result.code > 0) {
                                            $('#logoUrl').data('img',result.data.FileUrl);
                                        }else{
                                            common.showToast(result.msg);
                                        }
                                    })
                                },
                                fail: function (res) {
                                    common.showToast('上传失败');
                                }
                            });
                        }
                    });
                });
            })
        },
        getEnterpriseInfo:function(){
            api.call("/Member/GetEnterpriseInfo",{
            }, function (result) {
               if(result.code>0){
                   var data=result.data;
                   TagsId=data.TagsStr.split(',');
                   var html=template('tpl-company-cont',result);
                   $('#companyAuth-cont').html(html);
                   if(data.BigModuleType!==0){
                       id=data.BigModuleType;
                   }
                   companyAuth.getParentId();
                   companyAuth.certifiedEnterprise();
               }
            });
        },
        certifiedEnterprise:function(){
            $('#person-save').click(function(){
                var logoUrl=$.trim($('#logoUrl').data('img'));
                var enterpriseName=$.trim($('#enterpriseName').val());
                var bigModuleType=174;
                var tagsStr='';
                $('.company-tag dd').each(function(){
                    if($(this).hasClass('active')){
                        tagsStr+=$(this).data('id')+',';
                    }
                })
                tagsStr=tagsStr.slice(0,-1);
                var businessUrl=$('.CertImage1').data('img');
                var certificateUrl=$('.CertImage2').data('img');
                var BankAccountUrl=$('.CertImage3').data('img');
                var registrationUrl=$('.CertImage4').data('img');
                var legalIDCardUrl1=$('.CertImage5').data('img');
                var legalIDCardUrl2=$('.CertImage6').data('img');
                var legalMobile=$.trim($('#legalMobile').val());
                var email=$.trim($('#email').val());
                var phone=$.trim($('#phone').val());
                var address=$.trim($('#address').val());
                var intro=$.trim($('#intro').val());
                if(logoUrl=="" || logoUrl==null){
                    common.showToast('企业logo不能为空');
                    return;
                }
                if(enterpriseName=="" || enterpriseName==null){
                    common.showToast('企业名称不能为空');
                    return;
                }
                if(tagsStr=="" || tagsStr==null){
                    common.showToast('领域标签不能为空');
                    return;
                }
                if(businessUrl=="" || businessUrl==null){
                    common.showToast('营业执照图片不能为空');
                    return;
                }
                if(certificateUrl=="" || certificateUrl==null){
                    common.showToast('组织机构代码证图片不能为空');
                    return;
                }
                if(BankAccountUrl=="" || BankAccountUrl==null){
                    common.showToast('银行开户许可证图片不能为空');
                    return;
                }
                if(registrationUrl=="" || registrationUrl==null){
                    common.showToast('税务登记证图片不能为空');
                    return;
                }
                if(legalIDCardUrl1=="" || legalIDCardUrl1==null){
                    common.showToast('法人身份证正面图片不能为空');
                    return;
                }
                if(legalIDCardUrl2=="" || legalIDCardUrl2==null){
                    common.showToast('法人身份证反面图片不能为空');
                    return;
                }
                if(legalMobile=="" || legalMobile==null){
                    common.showToast('请输入法人联系号码');
                    return;
                }
                var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (!phoneReg.test(legalMobile)) {
                    common.showToast('法人联系号码不正确例如座机号码:021-4213550(或)\n手机号码：13635456878');
                    return;
                }
                if(!myreg.test(email)) {
                    common.showToast('请输入有效的Email');
                    return;
                }
                if (!phoneReg.test(phone)) {
                    common.showToast('企业联系电话不正确例如座机号码:021-4213550(或)\n手机号码：13635456878');
                   return;
                }
                if (phone=="" || phone==null) {
                    common.showToast('请输入企业联系电话');
                    return;
                }
                if(intro=="" || intro==null){
                    common.showToast('公司简介不能为空');
                    return;
                }
                if(intro.length>300){
                    common.showToast('公司简介不能超过300字');
                    return;
                }
                api.call("/Member/CertifiedEnterprise", {
                    logoUrl:logoUrl,
                    enterpriseName:enterpriseName,
                    bigModuleType:bigModuleType,
                    tagsStr:tagsStr,
                    businessUrl:businessUrl,
                    certificateUrl:certificateUrl,
                    BankAccountUrl:BankAccountUrl,
                    registrationUrl:registrationUrl,
                    legalIDCardUrl:legalIDCardUrl1,
                    legalIDCardUrl2:legalIDCardUrl2,
                    legalMobile:legalMobile,
                    email:email,
                    phone:phone,
                    address:address,
                    intro:intro
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
        showTab:function(){
            $('#company-tag dd').click(function(){
                $(this).toggleClass('active');
            })
            $('.company-module-menu dd').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
            })
        },
        //zwr
        getParentId:function(){
            api.getTypeDict({'dictType':174,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    result.TagsId=TagsId;
                    var html=template('tpl-company-tag',result);
                    $('#company-tag').html(html);
                    companyAuth.showTab();
                }else{
                    common.showToast('系统错误');
                }
            })
        }
    }
    companyAuth.init();
})