/**
 * Created by Administrator on 2016/2/21.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var Chart=require('Chart');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var Income=[]; //月收入
    var Expenses=[]; //月支出
    var Balance=[]; //月结余
    var Month=[];  //月份
    Array.max=function(array){
        return Math.max.apply(Math,array);
    }
    Array.min=function(array){
        return Math.min.apply(Math,array);
    }
    var chart={
        init:function(){
            if (/Mobile/i.test(navigator.userAgent)) {

                //针对手机，性能做一些降级，看起来就不会那么卡了

                Chart.defaults.global.animationSteps = Chart.defaults.global.animationSteps / 6

                Chart.defaults.global.animationEasing = "linear"

            }
            this.columnLine();
            this.selectTimes();
            this.showChart();

        },
        uploadFile:function(){
            api.call('/attachment/save',{memberId:regId,attachmentId:0,objType:0,objId:0},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-shareBook',result);
                    $('#booksContMenu').html(html);
                }else{
                    common.showToast('系统错误');
                }
            });
        },
        showChart:function(year){
            var date=new Date();
            var year=year || date.getFullYear();
            api.call('/ShareBook/GetTotal',{year:year,bookId:bookId},function(result){
                if(result.code>0 && result.data.length>0){
                    $('#maspaint-cont').show();
                    Income=[]; //月收入
                    Expenses=[]; //月支出
                    Balance=[]; //月结余
                    Month=[];  //月份
                    var data=result.data;
                    for(var i=0;i<data.length;i++){
                        Income.push(data[i].Income);
                        Expenses.push(data[i].Expenses);
                        Balance.push(data[i].Balance);
                        Month.push(data[i].Month);
                        chart.lineChart();
                        chart.columnLine();
                    }
                }else{
                    $('#maspaint-cont').hide();
                    common.showToast('没有数据加载');
                }
            });
        },
        selectTimes:function(){
            var year;
            $('.maspaint-menu li').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                year=$(this).text();
                $('.maspaint-year').hide();
                $('.books-mask').hide();
                $('.header-tit').html(year);
                chart.showChart(year);
            })
            //点击确定
            //点击年份显示弹出层
            $('.header-tit').click(function(){
                $('.maspaint-year').show();
                $('.books-mask').show();
                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            })
        },
        lineChart:function() {
            var ctx = document.getElementById('chartLine').getContext("2d");
            var data = {
                labels: Month,
                scaleFontSize : 12,
                datasets: [
                    {
                        label: "收入",

                        fillColor: "rgba(245,245,245,0)",

                        strokeColor: "#88cc44",

                        pointColor: "#88cc44",

                        pointStrokeColor: "#88cc44",

                        pointHighlightFill: "#88cc44",

                        pointHighlightStroke: "rgba(220,220,220,1)",

                        data:Income
                    },
                    {
                        label: "支出",

                        fillColor: "rgba(245,245,245,0)",

                        strokeColor: "#ff6600",

                        pointColor: "#ff6600",

                        pointStrokeColor: "#ff6600",

                        pointHighlightFill: "#ff6600",

                        pointHighlightStroke: "rgba(220,220,220,1)",

                        data: Expenses
                    },
                ]

            };

            // var salesVolumeChart = new Chart(ctx).Line(data);
            var max=[];
            for(var i=0;i<data.datasets.length;i++){
                max.push(Array.max(data.datasets[i].data));
            }
            var maxNumber=Math.ceil(Array.max(max)/(Array.max(max)*0.1));
            var salesVolumeChart = new Chart(ctx).Line(data, {
                responsive: true,

                // 小提示的圆角

                // tooltipCornerRadius: 0,

                // 折线的曲线过渡，0是直线，默认0.4是曲线

                bezierCurveTension: 0,

                // bezierCurveTension: 0.4,

                // 关闭曲线功能

                bezierCurve: false,

                // 背景表格显示

                // scaleShowGridLines : false,

                // 点击的小提示

                //自定义背景小方格、y轴每个格子的单位、起始坐标

                scaleOverride: true,

                scaleSteps:maxNumber,
                // scaleStepWidth: Math.ceil(Math.max.apply(null,data.datasets[0].data) / 0.1),

                scaleStepWidth:Math.ceil(Array.max(max)/1000)*1000*0.1,

                scaleStartValue: 0

            });

        },
            columnLine:function(){
                var ctx = document.getElementById('columnLine').getContext("2d");
                var data = {
                    labels: Month,
                    scaleFontSize : 12,
                    datasets: [
                        {
                            label: "月结余",

                            fillColor: "#4dbbd4",

                            strokeColor: "#4dbbd4",

                            pointColor: "#4dbbd4",

                            pointStrokeColor: "#4dbbd4",

                            pointHighlightFill: "#4dbbd4",

                            pointHighlightStroke: "#4dbbd4",

                            data: Balance
                        }
                    ]

                };
                var max=[];
                var min=[];
                max.push(Array.max(data.datasets[0].data));
                min.push(Array.max(data.datasets[0].data));
                var maxNumber;
                for(var i=0;i<min.length;i++){
                    if(min[i]<0){
                        maxNumber= Math.ceil(Array.max(max)/(Array.max(max)*0.1))+Math.floor(Array.min(min)/(Array.min(max)*0.1));
                    }else{
                        maxNumber=Math.ceil(Array.max(max)/(Array.max(max)*0.15));
                    }
                }
                var salesVolumeChart = new Chart(ctx).Bar(data, {
                    responsive: true,

                    // 小提示的圆角

                    // tooltipCornerRadius: 0,

                    // 折线的曲线过渡，0是直线，默认0.4是曲线

                    bezierCurveTension: 0,

                    // bezierCurveTension: 0.4,

                    // 关闭曲线功能

                    bezierCurve: false,

                    // 背景表格显示

                    // scaleShowGridLines : false,

                    // 点击的小提示
                    scaleShowGridLines:true,
                    datasetFill : true,
                    //自定义背景小方格、y轴每个格子的单位、起始坐标

                    scaleOverride: true,

                    scaleSteps:maxNumber,
                    // scaleStepWidth: Math.ceil(Math.max.apply(null,data.datasets[0].data) / 0.1),

                    scaleStepWidth: Math.ceil(Array.max(max)/1000)*1000*0.1,

                    scaleStartValue:Math.floor(Math.min.apply(Math,data.datasets[0].data)/1000)*1000

                });

            }

    }
    return chart.init();
})
