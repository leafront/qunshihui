/**
 * Created by zhaowenrui on 2016/4/5.
*/
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var iScroll=require('iScroll');
    var date=require('date');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var money={
        init:function(){
            this.showActive();
            this.dateTimer();
            //��ҩ���ѵ����ӿ����л�
            this.showCurrent();
        },
        showActive:function(){
            $('.coupon_genre li').click(function(){
                var index = $(this).index();
                $(this).addClass('current').siblings('li').removeClass('current');
                if(index == 0){
                    $('.coupon').css({'display':'block'});
                }else if(index == 1){
                    $('.coupon').css({'display':'none'});
                    $('.coupon_used').css({'display':'block'});
                }else if(index == 2){
                    $('.coupon').css({'display':'none'});
                    $('.coupon_notused').css({'display':'block'});
                }
            });
        },
        dateTimer: function () {
            $('.dateTime1').date({ theme: "datetime" },function(datestr){
                var datestr=datestr.slice(-5);
                $('.dateTime1').html(datestr);
            });
            $('.dateTime2').date({ theme: "datetime" },function(datestr){
                var datestr=datestr.slice(-5);
                $('.dateTime2').html(datestr);
            });
            $('.dateTime3').date({ theme: "datetime" },function(datestr){
                var datestr=datestr.slice(-5);
                $('.dateTime3').html(datestr);
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        },
        showCurrent:function(){
            $('.druggery_alarm strong').click(function(){
                $(this).toggleClass('current');
            });
        }

    }
    money.init();
})