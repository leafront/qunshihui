/**
 * Created by loogn on 2016/3/14.
 */
require.config(config);
define(function (require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var iScroll=require('iScroll');
    var date=require('date');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var addMember={
        init:function(){
            this.showAddMember();
        },
        showAddMember:function(){
            var phone;
            var data=JSON.parse(localStorage.getItem('addUserMsg'));
            $('.addMember-tel').attr('placeholder',data.phone);
            var userId=data.userId;
            var html=template('tpl-addMember',data);
            $('.addUser-info').html(html);
            $('.addUser-addBtn').click(function(){
                api.call('/ShareBook/AddMember',{bookId:bookId,regId:regId,userId:userId},function(data){
                    if(data.code>0){
                        window.location.href='/shareBook/bookDetail.html?bookId='+bookId;
                    }else{
                        common.showToast(data.msg);
                    }
                });
            })
            $('.noteName-ico1').click(function(){
                window.history.back();
                $('.addMember-tel').attr("placeholder","");
            })
        },
    }
    addMember.init();
});