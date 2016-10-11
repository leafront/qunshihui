/**
 * Created by admin on 2016/4/7.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var health={
        init:function(){
            this.showTab();
            this.showCurrent();
        },
        showCurrent:function(){
            $('.druggery_alarm strong').click(function(){
                $(this).toggleClass('current');
            });
        },
        showTab:function(){
            $('.step_number').click(function(){
                $(this).parent().css({'display':'none'}).siblings('.health_tab').css({'display':'block'});
            });
        }

    }
    health.init();
})