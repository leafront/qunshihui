
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
    var resetPass={
        init:function(){
            this.updatePass();
            this.sendCode();
        },
        sendCode:function(){
            //sned code
            $("#sendcode").click(function () {
                var str_phone=$.trim($('#phone').val());
                if(str_phone=="" || str_phone==null){
                    common.showToast('请输入手机号');
                    return;
                }
                if (!phoneReg.test(str_phone)) {
                    common.showToast('手机号不正确');
                    return;
                }
                common.countDown(this);
                api.call("/account/SendCheckCode", { phone: str_phone,type:3}, function (result) {
                    common.showToast(result.msg);
                });
            });
        },
        //重置密码
        updatePass:function(){
            $('#btnsubmit').click(function(){
                var password=$.trim($('#password').val());
                var code= $.trim($('#code').val());
                var str_phone=$.trim(phone.val());
                if(str_phone=="" || str_phone==null){
                    common.showToast('请输入手机号');
                    return;
                }
                if(password=="" || password==null){
                    common.showToast('请输入重置密码');
                    return;
                }
                if(password.length<6){
                    common.showToast('请输入重置密码(6-16个字符)');
                    return;
                }
                if(code=="" || code==null){
                    common.showToast('请填写验证码');
                    return;
                }
                api.call('/account/ResetPassword', {
                    regId : memberId,
                    phone:str_phone,
                    password :password,
                    code:code
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast('重置密码成功');
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
    resetPass.init();
})
