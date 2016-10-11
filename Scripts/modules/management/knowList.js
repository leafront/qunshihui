/**
 * Created by admin on 2016/4/7.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId = common.getUser();
    if (memberId == "" || memberId == null) {
        memberId = 0;
    } else {
        memberId = common.getUser().ID;
    }
    var knowList = {
        init: function () {
            this.showMenu();
        },
        showMenu:function(){
            $('.knowledge-list-parent>li').each(function(){
                $(this).find('.knowledge-one').click(function(){
                    $(this).parent().toggleClass('active');
                    $(this).siblings('.knowledge-list-child').slideToggle();
                })
            })
            $('.knowledge-list-child>dd').each(function(){
                $(this).find('.knowledge-two').click(function(){
                    $(this).parent().toggleClass('active');
                    $(this).siblings('.knowledge-list-catChild').slideToggle();
                })
            })
        }
    }
    knowList.init();
})
