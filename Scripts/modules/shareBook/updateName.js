/**
 * Created by loogn on 2016/3/14.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var updateName={
        init:function(){
            this.showUserMsg();
        },
        showUserMsg:function(){
            var data=JSON.parse(localStorage.getItem('user'));
            $('#addMember-tel').val(data.bookName);
            $('.noteName-ico1').click(function(){
                $('.addUser-tel').val("");
            })
            $('.member-btn').click(function(){
                var upateName= $.trim($('#addMember-tel').val());
                if(upateName=="" || upateName==null){
                    common.showToast('账本名不能为空');
                    return;
                }
                api.call('/sharebook/SaveShareBook', { name: upateName, bookId: bookId,regId:regId}, function (result) {
                    if (result.code <= 0) {
                        common.showToast(result.msg);
                    } else {
                        location.href = '/sharebook/bookDetail.html?bookId='+bookId;
                    }

                })
            })
        },
    }
    updateName.init();
});