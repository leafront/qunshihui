
/**
 * Created by loogn on 2016/3/11.
 */
require.config(config);
define(function(require,exports,module) {
    var common=require('common');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var addUserMsg={
        init:function(){
            this.showUserMsg();
        },
        showUserMsg:function(){
            var data=JSON.parse(localStorage.getItem('addUserMsg'));
            $('.addUser-tel').attr('placeholder',data.noRgePhone);
            $('.noteName-ico1').click(function(){
                $('.addUser-tel').val("");
            })
        },
    }
    addUserMsg.init();
});