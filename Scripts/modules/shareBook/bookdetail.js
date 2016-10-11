/**
 * Created by loogn on 2016/3/11.
 */
require.config(config);
define(function(require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var bookDetail={
        init:function(){
            this.showDetail();
        },
        showDetail:function(){
            api.call('/ShareBook/GetShareBook',{bookId:bookId,regId:regId},function(result){
                if(result.code>0 && result.data){
                    if(result.data.IsTop==true){
                        $('#ckTop').addClass('active');
                    }
                    var user=JSON.parse(localStorage.getItem('user'));
                    user.bookName=result.data.Name;
                    var iBookId=result.data.ID;
                    localStorage.setItem('user',JSON.stringify(user));
                    $('#JsNoteName').html(result.data.Name);
                    api.call('/ShareBook/GetMemberList',{bookId:bookId,regId:regId},function(result){
                        if(result.code>0 && result.data){
                            $('#header-tit').html(result.data.Name);
                            result.data.bookId=iBookId;
                            var html=template('tpl-member',result);
                            $('#member-cont').html(html);
                        }else{
                            common.showToast('系统错误');
                        }
                    });
                }else{
                    common.showToast('系统错误');
                }
            });
            //跳转到修改账本名称
            $('#JsUpateName').click(function(){
                window.location.href='/shareBook/updateName.html?bookId='+bookId;
            })
            $('#JsRootSetting').click(function(){
                window.location.href='/shareBook/rootSetting.html?bookId='+bookId;
            })
            $('#wholeMember').click(function(){
                window.location.href='/shareBook/wholeMember.html?bookId='+bookId;
            })
            //置顶
            $('#ckTop').click(function(){
                var isTop=!($('#ckTop').hasClass('active'));
                api.call('/ShareBook/SetBookTop',{bookId:bookId,regId:regId,isTop:isTop},function(result){
                    if(result.code>0){
                        $('#ckTop').toggleClass('active');
                        common.showToast(result.msg)
                    }else{
                        common.showToast('系统错误');
                    }
                });
            })
            //删除并且退出账本
            $('.member-btn').click(function(){
                common.confirm({
                    huiTit:'删除记账本',
                    huiTxt:'您是否要删除记账本',
                    okTxt:'确定',
                    failTxt:'取消'
                },function(){
                    api.call('/ShareBook/DeleteBook',{bookId:bookId,regId:regId},function(result){
                        if(result.code>0){
                            common.showToast(result.msg);
                            window.location.href='/shareBook/index.html';
                        }else{
                            common.showToast('系统错误');
                        }
                    });
                })
            })
        }
    }
    bookDetail.init();
});