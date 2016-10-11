require.config(config);
define(function (require,exports,module) {
    var api=require('api');
    var common=require('common');
    var phone = $("#phone");
    var code = $("#code");
    var nickname = $("#nickname");
    var password = $("#password");
    var phoneReg=/^(1[34578][0-9])\d{8}$/;
    var returnUrl=common.requestUrl('returnurl');
    //check phone
    var register={
        init:function(){
            this.sendCode();
            this.submitReg();
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
        sendCode:function(){
            //sned code
            $("#sendcode").click(function () {
                var $this=this;
               register.checkPhoneReg(function(val){
                  if(val==true){
                      common.countDown($this);
                  }
               })
                var str_phone = register.checkPhone();
                if (!str_phone) {
                    return;
                }
                api.call("/account/SendCheckCode", { phone: str_phone,type:1}, function (result) {
                    common.showToast(result.msg);
                });
            });
        },
        checkPhoneReg:function(callBack){
            api.call("/account/CheckRepeat", { checkType:1,checkData: $.trim(phone.val()),regId:0}, function (result) {
               if(result.data==true){
                   common.showToast('用户已被注册');
                   if(callBack)callBack(false)
               }else{
                   if(callBack)callBack(true)
               }
            });
        },
        submitReg:function(){
            $('#phone').blur(function(){
                register.checkPhoneReg();
            })
            //注册
            $("#btnsubmit").click(function () {
                if (!register.checkPhone()) {
                    return;
                }
                if ($.trim(code.val()).length == 0) {
                    common.showToast('请填写验证码');
                    code.focus();
                    return;
                }

                if ($.trim(nickname.val()).length == 0) {
                    common.showToast('请填写昵称');
                    nickname.focus();
                    return;
                }
                if ($.trim(password.val())=="" || $.trim(password.val())==null) {
                    common.showToast('请填写登录密码');
                    password.focus();
                    return;
                }
                if ($.trim(password.val()).length<6) {
                    common.showToast('请输入密码(6-16个字符)');
                    return;
                }
                if($('.login-checked').is(':checked')==false){
                    common.showToast('请勾选同意群师慧注册协议');
                    return;
                }
                api.call('/account/register',{'phone':phone.val(),'code':code.val(),'nickname':nickname.val(),'password':password.val(),'source':2}, function (result) {
                    if (result.code > 0) {
                        common.showToast(result.msg);
                        setTimeout(function(){
                            location.href = '/account/login.html?returnurl='+window.encodeURIComponent(returnUrl);
                        },300)
                    }else{
                        common.showToast(result.msg)
                    }
                });
            })
            //登录
            $('.login-reg').click(function(){
               location.href = '/account/login.html?returnurl='+window.encodeURIComponent(returnUrl);
            })
        }
    }
    register.init();
})
