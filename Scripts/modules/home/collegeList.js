/**
 * Created by zwr on 2016/4/20.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pid=common.requestUrl('pid');
    /*var getAreaId=common.getAreaId();*/
    /*common.moduleName();*/
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    };

    var moduleTypeIds=0;
    var keyword ='';
    var pageIndex=1;

    var collegeList={
        init:function(){
            this.showTab();
        },
        showTab:function(){
            $('.consult-search').focus(function(){
                $('#college-cont').hide();
            });
            $('.consult-search').blur(function(){
                collegeList.searchList();
                $('#college-cont').show();
            });
            api.getTypeDict({'dictType':pid,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    var html = template('tpl-consultList-menu', result);
                    $('#consultList-menu').append(html);
                    $('#consultList-menu li').click(function(){
                        moduleTypeIds=$(this).data('id');
                        $(this).addClass('active').siblings().removeClass('active');
                        collegeList.searchList();
                    });
                }else{
                    common.showToast('系统错误');
                };
            });
        },
        searchList:function(){
            keyword = $.trim($(".consult-search").val());
            $(".college-tab-list").html("");
            $('.consult-moreData,.no-moreData').hide();
            collegeList.moreList();
        },
        moreList:function(){
            console.log(moduleTypeIds);
            api.call('/Activity/GetActivifyList',{
                title:keyword,
                moduleType:moduleTypeIds,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html = template('tpl-college-tab-list',result);
                    $('.college-tab-list').append(html);
                    console.log(result.data[0].IsComing)
                }else{
                    common.showToast('暂无数据');
                }
            });
        }

    }
    collegeList.init();
})