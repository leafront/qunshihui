/**
 * Created by admin on 2016/4/7.
 */
/**
 * Created by zhaowenrui on 2016/4/5.
 */
require.config(config);
define(function(require,exports,module){
    var activeStr = '';
    var common=require('common');
    var template=require('template');
    var api=require('api');
    var iScroll=require('iScroll');
    var date=require('date');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var schedule={
        init:function(){
            this.gainInfo();//获取参数
            this.eachColor();//时间日程管理的li颜色循环
            this.showTimes();//选择行程时间
            this.showActive();//日历点击变色
            this.txtHide();//文字超出隐藏
        },
        showTimes:function(){
            $('.dateTime1').date({ theme: "datetime" },function(datestr){
                activeStr =  datestr.replace(/[^0-9]/ig,"");
                var datestr = activeStr.substr(0,4)+'年'+activeStr.substr(4,2)+'月'+activeStr.substr(6,2)+'日'+'▼';
                $('.dateTime1').html(datestr);
            });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            $('.add_travel').click(function(){
                if($('.dateTime1').html()==='今天▼'){
                    common.showToast('请先选择时间');
                }else{
                    location.href="editStroke.html?date="+activeStr;
                };
            });
        },
        gainInfo:function(){
            var dateOne = decodeURI(common.requestUrl('dateOne'));
            var dateTwo = decodeURI(common.requestUrl('dateTwo'));
            var txta = decodeURI(common.requestUrl('txta'));
            var genre = decodeURI(common.requestUrl('genre'));
            var templetStr = '<li><em>'+genre+'</em> <div><strong>'+txta+'</strong><br/><span>'+dateOne+'&nbsp;'+dateTwo+'</span></div><b></b></li>';
            if(dateOne==='null'){
                $('.sked').append('<p>快来记录事件吧!</p>');
            }else{
                $('.sked').append(templetStr);
            };
         },
        showActive:function(){
            /*$('.timetable tbody').find('td').click(function(){
             $(this).addClass('active').siblings('td').removeClass('active').parent('tr').siblings('tr').children('td').removeClass('active');
             });*/
            $('.sked').find('b').click(function(){
                $(this).parent('li').addClass('active').siblings('li').removeClass('active');
            });
        },
        eachColor:function(){
            var arr = ['sked_list1','sked_list2','sked_list3'];
            for (var i = 0; i < $('.sked li').length; i++) {
                $('.sked li').eq(i).addClass(arr[i%3]);
            };
        },
        txtHide:function(){
            common.ellipsis('.sked strong',10);
        }
    }
    schedule.init();
})