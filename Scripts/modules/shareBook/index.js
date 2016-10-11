require.config(config);
define(function(requie,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var regId=common.getUser();
    if(regId=="" || regId==null){
        regId=0;
    }else{
        regId=common.getUser().ID;
    }
    var shareBook={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.closeMask();
            this.newsNote();
            this.getNote();
        },
        closeMask:function(){
            // 打开对话框
            $("#books-new").click(function () {
                $(".books-mask,#books-mask-cont").show();
            });
            // 关闭对话框
            $(".books-mask-close").click(function () {
                $(".books-mask,#books-mask-cont").hide();
            })
        },
        getNote:function(){
            api.call('/ShareBook/GetShareBookList',{regId:regId},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-shareBook',result);
                    var bookId=result.data.ID;
                    $('#booksContMenu').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        },
        //新建账本
        newsNote:function(){
            $("#btnCreate").click(function () {
                var name = $.trim($("#newbookname").val());
                var regId=common.getUser().ID;
                if (name!=="") {
                  api.call('/ShareBook/SaveShareBook', { name: name, bookId: 0,regId:regId }, function (result) {
                        common.showToast(result.msg);
                        if (result.code > 0) {
                            window.location.reload();
                        }
                    });
                } else {
                    common.showToast('请填写账本名称');
                }
            });
        }
    }
    shareBook.init();
})