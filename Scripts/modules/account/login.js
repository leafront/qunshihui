
require.config(config);
define(function(require,exports,module) {
    var api=require('api');
    var common=require('common');
    var returnUrl=common.requestUrl('returnurl');
    var phone = $("#loginname");
    var phoneReg=/^(1[34578][0-9])\d{8}$/;
    var login={
        init:function(){
            var u= common.getUser();
            this.submitLogin();
        },
        checkPhone:function() {
            var str_phone = $.trim(phone.val());
            if (str_phone.length == 0) {
                common.showToast('请填写手机号');
                phone.focus();
                return false;
            }
            if (!phoneReg.test(str_phone)) {
                common.showToast('手机号不正确');
                phone.focus();
                return false;
            }
            return str_phone;
        },
        submitLogin:function(){
            $("#btnsubmit").click(function () {
                var str_phone = login.checkPhone();
                var password= $.trim($('#password').val());
                if (!str_phone) {
                    return;
                }
                if(password=="" || password==null){
                    common.showToast('请填写登录密码');
                    password.focus();
                    return;
                }
                if(password.length<6){
                    common.showToast('请输入密码(6-16个字符)');
                    return;
                }
                var loginName=$('#loginname').val();//18538315194
                var password=$('#password').val();
                api.call('/account/Login',{loginName:loginName,password:password}, function (result) {
                    if(result.code>0){
                        common.showToast(result.msg);
                        common.setUser(result.data);
                        setTimeout(function(){
                            location.href=returnUrl;
                        },300);
                    }else{
                        common.showToast(result.msg);
                    }
                });
            })
            $('.login-reg').click(function(){
                location.href='/account/register.html?returnurl='+window.encodeURIComponent(returnUrl);
            })
        }
    }
    login.init();
})
