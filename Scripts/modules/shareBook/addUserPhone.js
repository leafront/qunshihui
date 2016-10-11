/**
 * Created by loogn on 2016/3/14.
 */
require.config(config);
define(function (require,exports,module) {
    var common=require('common');
    var api=require('api');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var phoneReg=/^(1[34578][0-9])\d{8}$/;
    var addUserPhone={
        init:function(){
            this.showAddMember();
        },
        showAddMember:function(){
            $('.member-btn').click(function(){
                var phone=$('.addUser-tel').val();
               if(!phoneReg.test(phone)){
                   common.showToast('请输入账号');
                   return;
               }
                api.call('/member/GetInfoByPhone',{phone:phone},function(result){
                    var json={};
                    if(result.code>0 && result.data){
                        json.phone=phone;
                        var data=result.data;
                        json.NickName=data.NickName;
                        json.IdentityName=data.IdentityName;
                        json.userId=data.ID;
                        json.Avatar=data.Avatar;
                        localStorage.addUserMsg=JSON.stringify(json);
                        window.location.href='/shareBook/addMember.html?bookId='+bookId;
                    }else{
                        //common.showToast('ϵͳ����');
                        json.noRgePhone=phone;
                        localStorage.addUserMsg=JSON.stringify(json);
                        window.location.href='/shareBook/addUserMsg.html?bookId='+bookId;
                    }
                });
            })
            $('.noteName-ico1').click(function(){
                $('.addUser-tel').val("");
            })
        },
    }
    addUserPhone.init();
});