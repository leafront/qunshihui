/**
 * Created by loogn on 2016/3/21.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pid=common.requestUrl('pid');
    var getAreaId=common.getAreaId();
    common.moduleName();
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var keyword=common.requestUrl('search') || "";
    var lawList={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.clickBtns();
            this.listData();
        },
        listData:function(){
            $('#release-pid').val(pid);
            var value=common.requestUrl('search') || "";
            $('.consult-search').val(value)
            api.call('/Demand/GetDemandList',{
                memberId :memberId,
                keyword:keyword,
                moduleTypeIds:pid,
                provinceId:0,
                cityId:0,
                countyId:0,
                pageIndex:1
            },function(result){
                if(result.code>0 && result.data.length>0){
                    result.data.pid=pid;
                    var html = template('tpl-lawList', result);
                    $('#lawList-menu').html(html);
                    $('.lawList-item').click(function(){
                        var id=$(this).data('id');
                        window.location.href='/release/lawDetail.html?pid='+pid+'&detailId='+id;
                    })
                }else{
                    common.showToast('暂无数据');
                }
            });
        },
        clickBtns:function(){
            //1、诉讼金融2、普惠金融、3债权转让4、债务危机
            $('#header-ques-btn').click(function(){
                if(pid==149) {
                    //诉讼金融
                    window.location.href = '/release/litigationFinance.html?pid=' + pid;
                }else if(pid==170){
                    //普惠金融
                    window.location.href = '/release/inclusiveFinance.html?pid=' + pid;
                }else if(pid==171){
                    //债权转让发布
                    window.location.href='/release/creditAssignment.html?pid='+pid;
                }else if(pid==172){
                    //债务危机发布
                    window.location.href='/release/debtCrisis.html?pid='+pid;
                }
            })
            $('.consult-search').focus(function(){
                $('#lawList-cont').hide();
            })
            $('.consult-search').blur(function(){
                keyword= $.trim($('.consult-search').val());
                lawList.listData();
                $('#lawList-cont').show();
            })
        }
    }
    lawList.init();
})
