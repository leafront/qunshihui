/**
 * Created by admin on 2016/4/7.
 */
/**
 * Created by zhaowenrui on 2016/4/5.
 */
require.config(config);
define(function(require,exports,module){
    var str1 = '';
    var str2 = '';
    var common=require('common');
    var template=require('template');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var schedule_con={
        init:function(){
            this.popUp();//增加分类弹出窗
            this.showActive();//分类点击变色
            this.AcquisitionTime();//设置编辑时间
            this.saveInfo();//获取当前参数
        },
        popUp:function(){
            $('.edit_con dt em').click(function(){
                $('.cover,.add_event').show();
            });
            $('.add_event span').click(function(){
                var eventStr =  $.trim($('.add_event input').val());
                if(eventStr.length==0){
                    $('.cover,.add_event').hide();
                }else if(eventStr.length>2){
                    common.showToast('不能超出两个字符');
                }else{
                    $('.add_event input').val('');
                    var ddStr = '<dd><em><b>'+eventStr+'</b></em></dd>'
                    $('.edit_con dl').prepend(ddStr);
                    schedule_con.showActive();
                    $('.cover,.add_event').hide();
                };
                $('.add_event input').val('');
            });
        },
        showActive:function(){
            $('.edit_con dd').find('em').on('click',function(){
                $(this).addClass('active').parent('dd').siblings('dd').children('em').removeClass('active');
            });
        },
        AcquisitionTime:function(){
            var date=common.requestUrl('date');
            str1 = date.substr(0,4)+'-'+date.substr(4,2)+'-'+date.substr(6,2);
            str2 = date.substr(8,2)+':'+date.substr(10,2);
            $('.edit_con span').html(str1);
            $('.edit_con strong').html(str2);
        },
        saveInfo:function(){
            $('#save_info').click(function(){
                var str3 = $('.edit_con textarea').val();
                var str4 = $('.edit_con .active b').html();
                if(str3==''){
                    common.showToast('请填写记录内容');
                }else{
                    window.location.href='index.html?'+encodeURI(encodeURI('dateOne='+str1+'&&dateTwo='+str2+'&&txta='+str3+'&&genre='+str4));
                };
            });
        }
    }
    schedule_con.init();
})