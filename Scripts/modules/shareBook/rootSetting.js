/**
 * Created by loogn on 2016/3/14.
 */
require.config(config);
define(function(require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var userIds=[];
    var userId="";
    var rootSetting={
        init:function(){
            this.getMember();
        },
        showRoot:function(){
            $('.jsRoot').click(function(){
                if($(this).data('role')!==1){
                    $(this).toggleClass('active');
                }
            })
            $('.header-ui-btns').click(function(){
                userIds=[];
                $('.jsRoot').each(function(){
                   if($(this).hasClass('active') && $(this).data('role')!==1){
                       userIds.push($(this).data('id'));
                   }
               })
                userId=userIds.join(',');
                if(userId!=="" || userId!==null){
                    api.call('/ShareBook/SetRecorder', {
                        bookId: bookId,
                        regId: regId,
                        userIds: userId
                    }, function (result) {
                        if (result.code > 0) {
                            common.showToast(result.msg);
                            return;
                            window.location.href = '/shareBook/bookDetail.html?bookId=' + bookId;
                        } else {
                            common.showToast('您无权操作');
                        }
                    });
                }else{
                    api.call('/ShareBook/SetRecorder', {
                        bookId: bookId,
                        regId: regId,
                        userIds: ''
                    }, function (result) {
                        if (result.code > 0) {
                            common.showToast(result.msg);
                            return;
                            window.location.href = '/shareBook/bookDetail.html?bookId=' + bookId;
                        } else {
                            common.showToast('您无权操作');
                        }
                    });
                }
            })
        },
        getMember:function(){
            api.call('/ShareBook/GetMemberList',{bookId:bookId,regId:regId},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-rootSetting',result);
                    $('#member-cont').html(html);
                    rootSetting.showRoot();
                }else{
                    common.showToast('系统错误');
                }
            });
        }
    }
    rootSetting.init();
});