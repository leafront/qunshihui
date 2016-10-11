
require.config(config);
define(function(require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var date=require('date');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var date=new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var data;
    var money;
    var json={
        TotalIncome:0,
        TotalExpenses:0
    }
    var book={
        init:function(){
            this.showDetail();
            this.bookNote();
        },
        showDetail:function(){
            api.call('/ShareBook/GetShareBook',{bookId:bookId,regId:regId},function(result){
                if(result.code>0 && result.data){
                    money=result.data;
                    var html=template('tpl-bookDetail',result);
                    $('#bookDetail').html(html);
                    $('.books-times').val(year+'-'+month+'-'+day);
                    $('.books-times').date({},function(datestr){
                        if(datestr!==$('.books-times').val()){
                            $('.books-times').val(datestr);
                            var date=datestr.split('-');
                            year=date[0];
                            month=date[1];
                            book.lineDetail();
                        }
                    });
                    book.lineDetail();
                }else if(result.data.length==0){
                    result.data=json;
                    var html=template('tpl-bookDetail',result);
                    $('#bookDetail').html(html);
                }
            });
        },
        lineDetail:function(){
            api.call('/ShareBook/GetRecordList',{year:year,month:month,bookId:bookId,regId:regId},function(result){
                if(result.code>0 && result.data.length>0){
                    result.money=money;
                    var html=template('tpl-lineDetail',result);
                    $('#booksDetail-cont').html(html);
                    $('#js_totalExpenses').html(money.TotalIncome-money.TotalExpenses);
                }else if(result.data.length==0){
                    result.money=json;
                    $('#js_totalExpenses').html(0);
                    var html=template('tpl-lineDetail',result);
                    $('#booksDetail-cont').html(html);
                }
            });
        },
        //点击按钮记一笔
        bookNote:function(){
            $('#bookNote').click(function(){
                window.location.href='/shareBook/record.html?bookId='+bookId;
            })
            $('#JsDetail').click(function(){
                window.location.href='/shareBook/bookDetail.html?bookId='+bookId;
            })
            $('#JsChart').click(function(){
                window.location.href='/shareBook/chart.html?bookId='+bookId;
            })
        }
    }
    book.init();
});