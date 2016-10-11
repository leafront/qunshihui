/**
 * Created by admin on 2016/4/7.
 */
/**
 * Created by zhaowenrui on 2016/4/5.
 */
require.config(config);
define(function(require,exports,module){
    var common=require('common');
    var template=require('template');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var schedule={
        init:function(){
            this.showActive();
            this.eachColor();//时间日程管理的li颜色循环
            this.popUp();//时间日程管理添加事件弹窗
            this.showTimes();
        },
        showTimes:function(){
            var currYear = (new Date()).getFullYear();
            var opt={};
            opt.date = {preset : 'date'};
            opt.datetime = {preset : 'datetime'};
            opt.time = {preset : 'time'};
            opt.default = {
                theme: 'android-ics light', //皮肤样式
                display: 'modal', //显示方式
                mode: 'scroller', //日期选择模式
                dateFormat: 'yyyy-mm-dd',
                lang: 'zh',
                showNow: true,
                nowText: "今天",
                startYear: currYear - 10, //开始年份
                endYear: currYear + 10 //结束年份
            };

            $("#appDate").mobiscroll($.extend(opt['date'], opt['default']));
            var optDateTime = $.extend(opt['datetime'], opt['default']);
            var optTime = $.extend(opt['time'], opt['default']);
            $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
            $("#appTime").mobiscroll(optTime).time(optTime);

        },
        showActive:function(){
            $('.timetable tbody').find('td').click(function(){
                $(this).addClass('active').siblings('td').removeClass('active').parent('tr').siblings('tr').children('td').removeClass('active');
            });
            $('.sked').find('b').click(function(){
                $(this).parent('li').addClass('active').siblings('li').removeClass('active');
            });
            $('.edit_con dd').find('em').click(function(){
                $(this).addClass('active').parent('dd').siblings('dd').children('em').removeClass('active');
            });
        },
        eachColor:function(){
            var arr = ['sked_list1','sked_list2','sked_list3'];
            for (var i = 0; i < $('.sked li').length; i++) {
                $('.sked li').eq(i).addClass(arr[i%3]);
            };
        },
        popUp:function(){
            $('.edit_con dt em').click(function(){
                $('.cover,.add_event').show();
            });
            $('.add_event span').click(function(){
                $('.cover,.add_event').hide();
            });
        }
    }
    schedule.init();
})