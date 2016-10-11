/**
 * Created by loogn on 2016/3/15.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pid=common.requestUrl('pid');
    var getAreaId=common.getAreaId();
    if(pid==144){
        $('.header-ques-txt').html('提问');
    }
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var moduleTypeIds="";
    var keyword="";
    var pageIndex=1;
    var list={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.showTab();
        },
        showTab:function(){
            $('#release-pid').val(pid);
            var value=common.requestUrl('search') || "";
            $('.consult-search').val(value)
            $('#header-ques-btn').click(function(){
                if(pid==144){
                    window.location.href='/release/publishQuestion.html?pid='+pid;
                }else if(pid==145){
                    window.location.href='/release/publishWelfare.html?pid='+pid;
                }else if(pid==146){
                    window.location.href='/release/offerPublish.html?pid='+pid;
                }else if(pid==147){
                    window.location.href='/release/publishCase.html?pid='+pid;
                }
            })
            $('.consult-moreData').click(function(){
                pageIndex+=1;
                list.moreList();
            })
            $('.consult-search').focus(function(){
                $('#consult-cont').hide();
                $('.header-search').addClass('absolute');
                return false;
            })
            $('.consult-search').blur(function(){
                list.searchList();
                $('.header-search').removeClass('absolute');
                $('#consult-cont').show();
            })
            api.getTypeDict({'dictType':pid,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    var html = template('tpl-consultMenu', result);
                    $('#consultList-menu').html(html);
                    $('#consultList-menu li:gt(0)').click(function(){
                        var index=$(this).index();
                        moduleTypeIds=$(this).data('id');
                        $(this).addClass('active').siblings().removeClass('active');
                        list.searchList();
                    })
                    for(var i=0;i<result.data.length;i++){
                        moduleTypeIds+=result.data[i].ID+',';
                    }
                    moduleTypeIds=moduleTypeIds.slice(0,-1);
                    var moduleIds=moduleTypeIds;
                    $('#consultList-menu li').eq(0).click(function(){
                        moduleTypeIds=moduleIds;
                        $(this).addClass('active').siblings().removeClass('active');
                        list.searchList();
                    })
                    list.searchList();
                }else{
                    common.showToast('系统错误');
                }
            })
        },
        searchList:function(){
            keyword =common.requestUrl('search') || $.trim($(".consult-search").val());
            $("#consultTab").html("");
            $('.consult-moreData,.no-moreData').hide();
            pageIndex = 1;
            this.moreList();
        },
        //点赞收藏
        clickLike:function(msg,relationship,mid){
            api.call('/Relationship/Binding',{relationship:relationship,mid:mid,nid:memberId},function(result){
                if(result.code>0) {
                    common.showToast(msg);
                }
            });
        },
        cancelLike:function(msg,relationship,mid){
            api.call('/Relationship/UnBinding',{relationship:relationship,mid:mid,nid:memberId},function(result){
                if(result.code>0){
                    common.showToast(msg);
                }
            });
        },
        moreList:function(){
            //1费咨询2、社会公益 3、悬赏求助4、诉讼仲裁5、诉讼金融6、普惠金融、7、债权转让 8、债务危机
            api.call('/Demand/GetDemandList',{
                memberId :memberId,
                keyword:keyword,
                moduleTypeIds:moduleTypeIds,
                provinceId:0,
                cityId:0,
                countyId:0,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html = template('tpl-consultTab', result);
                    $('#consultTab').append(html);
                    $('.consult-moreData').show();
                    $('.consultList-item').click(function(){
                        var id=$(this).data('id');
                        window.location.href='/release/detail.html?pid='+pid+'&detailId='+id;
                    })
                    //点击收藏
                    $('.ico2').click(function(event){
                        event.stopPropagation();
                        var mid=$(this).data('id');
                        if($(this).hasClass('ico2-active')){
                            $(this).toggleClass('ico2-active');
                            list.cancelLike('取消成功',6,mid);
                            var count=parseInt($(this).next('.collectCount').html())-1;
                            $(this).next('.collectCount').html(count);
                        }else{
                            $(this).toggleClass('ico2-active');
                            list.clickLike('收藏成功',6,mid);
                            var count=parseInt($(this).next('.collectCount').html())+1;
                            $(this).next('.collectCount').html(count);
                        }
                    })
                }else{
                    $('.consult-moreData').hide();
                    $('.no-moreData').show();
                }
            });
        }
    }
    list.init();
})