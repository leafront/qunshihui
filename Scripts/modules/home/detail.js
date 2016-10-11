/**
 * Created by loogn on 2016/3/17.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var detailId=common.requestUrl('detailId');
    var user=common.getUser();
    var memberId;
    var pid=common.requestUrl('pid');
    var userId;
    var BidCount;
    var pageIndex=1;
    common.moduleName('详情');
    if(user=="" || user==null){
        memberId=0;
    }else{
        memberId=user.ID;
    }
    var detail={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.newsData();
            this.review();
        },
        getDemandBidg:function(){
            api.call('/Solution/GetDemandBid',{demandId:detailId,pageIndex:1},function(result){
                if(result.code>0){
                    $('#BidCount').html('已有'+BidCount+'人报名')
                    var source = '<% for(var i=0;i<data.length;i++){%><img src="<%=data[i].SolutionMember.Avatar%>"/><%}%>';
                    var html = template.compile(source)({data:result.data,BidCount:BidCount});
                    $('#GetDemandBid').html(html)

                }else{

                }
            });
        },
        solution:function(){
            $('#entered').click(function(){
                common.confirm({
                    huiTit:'提示',
                    huiTxt:'是否要报名抢单?',
                    okTxt:'是',
                    failTxt:'否'
                },function(){
                    api.call('/Solution/Bid',{demandId:detailId,demandMemberId:memberId},function(result){
                        if(result.code>0){
                            $('#entered').html('已报名');
                            common.confirm({
                                huiTit:'提示',
                                huiTxt:'报名成功，等待用户将您选择为中标用户，请近期注意我的—我的订单-处理中',
                                okTxt:'转到我的',
                                failTxt:'稍后再说'
                            },function(){
                                window.location.href='/person/index.html'
                            })
                        }else{
                            common.showToast(result.msg);
                        }
                    })
                });
            })
        },
        newsData:function(){
            $('.consult-moreData').click(function(){
                pageIndex+=1;
                detail.answerData();
            })
            //获取详情信息
            api.call('/Demand/GetGeneralDemand',{memberId:memberId,demandId:detailId},function(result){
                if(result.code>0){
                    var data=result.data;
                    data.userID=memberId;
                    data.pid=pid;
                    data.detailId=detailId;
                    data.href=window.encodeURIComponent(location.href);
                    BidCount=data.BidCount;
                    userId=data.MemberID;
                    var html = template('tpl-detailCont', result);
                    if(result.data.IsCollected==true){
                        $('#header-Collect').addClass('header-ui-like-active');
                    }
                    $('#problem-txt').html(html);
                    detail.answerData();
                    detail.solution();
                    if(userId==memberId){
                        detail.getDemandBidg();
                    }
                    if(pid==146 || pid==147){
                        $('.problem-people').show();
                    }
                    //点击收藏
                    $('#detail-click').click(function(){
                        if($(this).hasClass('problem-ico3-active')){
                            $(this).toggleClass('problem-ico3-active');
                            detail.cancelLike('取消成功',6,detailId);
                            var count=parseInt($('#collectCount').html())-1;
                            $('#collectCount').html(count);
                        }else{
                            $(this).toggleClass('problem-ico3-active');
                            detail.clickLike('收藏成功',6,detailId);
                            var count=parseInt($('#collectCount').html())+1;
                            $('#collectCount').html(count);
                        }
                    })
                    $('#problem-cont').removeClass('hide');
                }else{
                    common.showToast('数据加载失败');
                }
            });
        },
        //设置最佳答案
        setAnswer:function(){
            $('.set-answer').click(function(){
                var commentId=$(this).data('id');
                var parentItem=$(this).parent().parent().html();
                api.call('/Comment/SetBest',{memberId :memberId,commentId :commentId},function(result){
                    if(result.code>0){
                        common.showToast('设置成功');
                        window.location.reload();
                    }else{
                        common.showToast('已操作');
                    }
                });
            })
        },
        cancelLike:function(msg,relationship,mid){
            api.call('/Relationship/UnBinding',{relationship:relationship,mid:mid,nid:memberId},function(result){
                if(result.code>0){
                    common.showToast(msg);
                }
            });
        },
        //点赞收藏
        clickLike:function(msg,relationship,mid){
            api.call('/Relationship/Binding',{relationship:relationship,mid:mid,nid:memberId},function(result){
                if(result.code>0) {
                    common.showToast(msg);
                }
            });
        },
        //回答评论
        review:function(){
            $('#ques-answer').click(function(){
                var memo= $.trim($('#qies-review').val());
                if(memo=="" || memo==null){
                    common.showToast('请填写评论');
                    return;
                }
                api.call('/Comment/Write',{memberId :memberId,objType:2,objId:detailId,memo:memo},function(result){
                    if(result.code>0){
                        common.showToast(result.msg);
                        $('#qies-review').val("");
                        window.location.reload();
                    }
                });
            })
        },
        //获取评论数据
        answerData:function(){
            api.call('/Comment/GetCommentList',{memberId :memberId,objType:2,objId:detailId,sortType:1,pageIndex:pageIndex},function(result){
                if(result.code>0 && result.data.length>0){
                    var data=result.data;
                    data.ID=userId;
                    data.pid=pid;
                    data.memberId=memberId;
                    var html = template('tpl-answer', result);
                    $('#answer-cont').append(html);
                    //$('.consult-moreData').show();
                    //点赞
                    $('.problem-like').click(function(){
                        var mid=$(this).data('id');
                        var clickCount;
                        if($(this).find('i').hasClass('problem-like-ico1-active')){
                            clickCount=$(this).find('.clickCount').html();
                            detail.cancelLike('取消成功',4,mid);
                            $(this).find('i').removeClass('problem-like-ico1-active')
                            var clickCount=parseInt(clickCount)-1;
                            $(this).find('.clickCount').html(clickCount);
                        }else{
                            clickCount=$(this).find('.clickCount').html();
                            detail.clickLike('点赞成功',4,mid);
                            $(this).find('i').addClass('problem-like-ico1-active')
                            var clickCount=parseInt(clickCount)+1;
                            $(this).find('.clickCount').html(clickCount);
                        }
                    })
                    detail.setAnswer();
                }else{
                    $('#good-answer').hide();
                    $('#problem-answer').hide();
                    $('.consult-moreData').hide();
                    $('.no-moreData').hide();
                }
            });
        }
    }
    detail.init();
})
