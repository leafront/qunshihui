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
    var delBookNote={
        init:function(){
            this.getNote();
        },
        delNote:function(){
           $('.book-del').click(function(){
               var bookId=$(this).parent().data('id');
               common.confirm({
                   huiTit:'删除记账本',
                   huiTxt:'您是否要删除记账本',
                   okTxt:'确定',
                   failTxt:'取消'
               },function(){
                   api.call('/ShareBook/DeleteBook',{bookId:bookId,regId:regId},function(result){
                       if(result.code>0){
                           window.location.reload();
                       }else{
                           common.showToast('系统错误');
                       }
                   });
               })
            })
        },
        getNote:function(){
            var regId=common.getUser().ID;
            api.call('/ShareBook/GetShareBookList',{regId:regId},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-getBook',result);
                    $('#books-cont').html(html);
                    delBookNote.delNote();
                }else{
                    common.showToast('系统错误');
                }
            });
        },
    }
    delBookNote.init();
});