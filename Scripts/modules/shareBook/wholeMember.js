
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
    var userIds='';
    var wholeMember={
        init:function(){
            this.getMember();
            this.delMember();
        },
        delMember:function(){
            $('.header-ui-btns').click(function(){
                $('.jsRoot').each(function(){
                    if($(this).hasClass('active')){
                        api.call('/ShareBook/RemoveMembers',{bookId:bookId,regId:regId,userIds:userIds},function(result){
                            if(result.code>0){
                                common.showToast(result.msg);
                                window.location.href='/shareBook/bookDetail.html?bookId='+bookId;
                            }else{
                                common.showToast('您无权操作');
                            }
                        });
                    }
                })
            })
        },
        getMember:function(){
            api.call('/ShareBook/GetMemberList',{bookId:bookId,regId:regId},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-wholeMember',result);
                    $('#member-cont').html(html);
                    $('.jsRoot').click(function(){
                        if($(this).data('id')!==regId){
                            $(this).toggleClass('active');
                        }
                        if($(this).hasClass('active')){
                            userIds+=$(this).data('id')+',';
                        }
                        userIds=userIds.slice(0,-1);
                    })
                    $('.member-item-more').click(function(){
                        window.location.href='/shareBook/cateMember.html?bookId='+bookId;
                    })
                }else{
                    common.showToast('系统错误');
                }
            });
        }
    }
    wholeMember.init();
});
