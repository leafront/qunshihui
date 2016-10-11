/**
 * Created by loogn on 2016/3/28.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pid=common.requestUrl('pid');
    var getAreaId=common.getAreaId();
    common.moduleName();
    if(pid==144){
        $('.header-ques-txt').html('提问')
    }
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var moduleTypeIds="";
    var list={
        init:function(){
            common.checkLogin(common.getRelativePath());
           this.newsData();
        },
        newsData:function(){
            $('#header-ques-btn').click(function(){
                if(pid==149){
                    //诉讼金融
                    if(common.checkLogin('/release/question1.html?pid='+pid)==true){
                        window.location.href='/release/question1.html?pid='+pid;
                    };
                }
                if(pid==144 || pid==145 ||pid==146 ||pid==147 || pid==148 || pid==173 || pid==174){ //148 高端非诉
                    if(common.checkLogin('/release/question.html?pid='+pid)==true){
                        window.location.href='/release/question.html?pid='+pid;
                    };
                }
            })
            var keyword= $.trim($('.consult-search').val());
            api.call('/Demand/GetDemandList',{
                memberId :memberId,
                keyword:keyword,
                moduleTypeIds:moduleTypeIds,
                provinceId: 0,
                cityId: 0,
                countyId: 0,
                pageIndex:1
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html = template('tpl-consultTab', result);
                    $('#consultTab').html(html);
                    $('.consultList-item').click(function(){
                        var id=$(this).data('id');
                        window.location.href='/release/detail.html?pid='+pid+'&detailId='+id;
                    })
                }else{
                    common.showToast('暂无数据');
                }
            });
        }
    }
    list.init();
})