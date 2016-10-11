/**
 * Created by admin on 2016/3/31.
 */
require.config(config);
define(function(require,exports,module){
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var phone=$('#phone');
    var phoneReg=/^(([0\+]\d{2,3}-)?(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,4})?|(?:13\d|15[012356789]|18[0256789]|147)-?\d{5}(\d{3}|\*{3}))?$/;
    var updatePass={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.updatePass();
            this.sendCode();
        },
        sendCode:function(){
            $("#sendcode").click(function () {
                var str_phone= $.trim(phone.val());
                if(str_phone=="" || str_phone==null){
                    common.showToast('请输入手机号');
                    return;
                }
                if (!phoneReg.test(str_phone)) {
                    common.showToast('手机号不正确');
                    return;
                }
                common.countDown(this);
                api.call("/account/SendCheckCode", { phone: str_phone,type:2}, function (result) {
                    common.showToast(result.msg);
                });
            });
        },
        //修改密码
        updatePass:function(){
            $('#btnsubmit').click(function(){
                var str_phone= $.trim(phone.val());
                var password=$.trim($('#password').val());
                var newPhone=$.trim($('#newPhone').val());
                var code= $.trim($('#code').val());
                if(str_phone=="" || str_phone==null){
                    common.showToast('请输入原始手机号');
                    return;
                }
                if(password=="" || password==null){
                    common.showToast('请输入密码');
                    return;
                }
                if(password.length<6){
                    common.showToast('请输入密码(6-16个字符)');
                    return;
                }
                if(newPhone=="" || newPhone==null){
                    common.showToast('请输入新手机号');
                    return;
                }
                if (!phoneReg.test(str_phone)) {
                    common.showToast('手机号不正确');
                    return false;
                }
                if (!phoneReg.test(newPhone)) {
                    common.showToast('手机号不正确');
                    return false;
                }
                if(code=="" || code==null){
                    common.showToast('请填写验证码');
                    return;
                }
                api.call('/account/updatePhone', {
                    regId : memberId,
                    oldPhone:str_phone,
                    password :password,
                    newPhone:newPhone,
                    code:code
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast('修改手机号成功');
                        setTimeout(function(){
                            window.location.href='/Account/login.html?returnurl='+window.encodeURIComponent('/person/index.html');
                            localStorage.removeItem('user');
                        },200);
                    }else if(result.code==0){
                       common.showToast(result.msg);
                    }else{
                        common.showToast('系统错误');
                    }
                });
            })
        }

    }
    updatePass.init();
})
