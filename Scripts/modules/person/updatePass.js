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
    var updatePass={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.updatePass();
        },
        //修改密码
        updatePass:function(){
            $('#btnsubmit').click(function(){
                var oldPassword= $.trim($('#oldPassword').val());
                var newPassword=$.trim($('#newPassword').val());
                var confirmPassword=$.trim($('#confirmPassword').val());
                if(oldPassword=="" || oldPassword==null){
                    common.showToast('请输入原始密码');
                    return;
                }
                if(oldPassword.length<6){
                    common.showToast('请输入原始密码(6-16个字符)');
                    return;
                }
                if(newPassword=="" || newPassword==null){
                    common.showToast('请输入新密码');
                    return;
                }
                if(newPassword.length<6){
                    common.showToast('请输入新密码(6-16个字符)');
                    return;
                }
                if(confirmPassword.length<6){
                    common.showToast('请输入确认密码(6-16个字符)');
                    return;
                }
                if(confirmPassword!==newPassword){
                    common.showToast('两次输入新密码不一致');
                    return;
                }
                api.call('/account/updatePassword', {
                    regId : memberId,
                    oldPassword :oldPassword ,
                    newPassword :newPassword ,
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast('修改密码成功');
                        setTimeout(function(){
                            window.location.href='/Account/login.html?returnurl='+window.encodeURIComponent('/person/index.html');
                            localStorage.removeItem('user');
                        },200)
                    }else{
                        common.showToast(result.msg);
                    }
                });
            })
        }

    }
    updatePass.init();
})