/**
 * Created by admin on 2016/3/31.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var wx=require('jweixin');
    var selectArea=require('selectArea');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var getAreaId=common.getAreaId();
    var getAddress={};
    var personInfo={
        init:function(){
            common.wxConfig(['chooseImage','uploadImage']);
            this.getBaseInfo();
        },
        selectArea:function(){
            new selectArea($("#provinceId"), $("#cityId"), $("#countyId")).init();
            if(getAddress=="" || getAddress==null){
                getAddress={provinceID:getAreaId.provinceId,cityID:getAreaId.cityId,countyID:getAreaId.countyId};
            }
            $('#provinceId').data('value',getAddress.provinceID);
            $('#cityId').data('value', getAddress.cityID);
            $('#countyId').data('value',getAddress.countyID);
        },
        uploadImage:function(){
            wx.ready(function () {
                // 5 图片接口
                var localId;
                var serverId;
                $('#avatar').click(function () {
                    wx.chooseImage({
                        count:1,
                        sizeType:['original','compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            localId = res.localIds[0];
                            $('#avatar').attr('src',localId);
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            wx.uploadImage({
                                localId: localId,
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    serverId=res.serverId;
                                    api.call("/system/DownloadWXMedia", { serverId:serverId}, function (result) {
                                        if (result.code > 0) {
                                            $('#avatar').data('img',result.data.FileUrl);
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
        getBaseInfo:function(){
            api.call('/member/GetBaseInfo', {
                memberId: memberId,
            }, function (result) {
                if (result.code > 0) {
                    var html = template("tpl-getPersonInfo", result);
                    var data=result.data;
                    getAddress.provinceID=data.ProvinceID;
                    getAddress.cityID=data.CityID;
                    getAddress.countyID=data.CountyID;
                    $("#perInfo-cont").append(html);
                    personInfo.uploadImage();
                    personInfo.selectArea();
                    personInfo.updateBaseInfo();
                }else{
                    common.showToast('系统错误');
                }
            });
        },
        updateBaseInfo:function(){
            $('#person-save').click(function(){
                var avatar= $.trim($('#avatar').attr('src'));
                var nickName=$.trim($('#nickName').val());
                var sex=$.trim($('#sex').val());
                var email=$.trim($('#email').val());
                var idCardUrl=$.trim($('#avatar').data('img'));
                //对电子邮件的验证
                if(sex=='' || sex==null){
                    common.showToast('请填写性别');
                    return;
                }
                if(nickName.length>20){
                    common.showToast('请填写昵称20字以内');
                    return;
                }
                if(sex!=='男' && sex!=='女'){
                    common.showToast('请填写正确的性别');
                    return;
                }
                if(sex==''){
                    sex=0;
                }else if(sex=='男'){
                    sex=1;
                }else if(sex=='女'){
                    sex=2;
                }
                if(email=="" || email==null){
                    common.showToast('请填写邮箱');
                    return;
                }
                var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(!myreg.test(email)) {
                    common.showToast('请输入有效的Email');
                    myreg.focus();
                    return false;
                }
                var phoneReg=/^(([0\+]\d{2,3}-)?(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,4})?|(?:13\d|15[012356789]|18[0256789]|147)-?\d{5}(\d{3}|\*{3}))?$/;
                var phone=$.trim($('#phone').val());
                if (!phoneReg.test(phone)) {
                    common.showToast('手机号不正确');
                    $('#phone').focus();
                    return false;
                }
                var address=[];
                var str_address="";
                $('.person-area option:selected').each(function(){
                    address.push($(this).val());
                    str_address+=$(this).text();
                })
                if(address=="" || address==null){
                    common.showToast('请填写地址');
                    return;
                }
                var Memo= $.trim($('#Memo').val());
                if(Memo=="" || Memo==null){
                    common.showToast('请填写个人简介');
                    return;
                }
                if(Memo.length>300){
                    common.showToast('请填写300字以内');
                    return;
                }
                api.call('/member/UpdateBaseInfo', {
                    memberId: memberId,
                    avatar:idCardUrl,
                    nickName:nickName,
                    sex:sex,
                    email:email,
                    phone:phone,
                    provinceId:address[0],
                    cityId:address[1],
                    countyId:address[2],
                    address:str_address,
                    Memo:Memo
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast('保存成功');
                    }else{
                        common.showToast('系统错误');
                    }
                });
            })
        }

    }
    personInfo.init();
})