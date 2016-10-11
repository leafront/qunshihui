/**
 * Created by zwr on 2016/4/20.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    };
    var pageIndex=1;
    var phoneReg=/^(1[34578][0-9])\d{8}$/;
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var activityId=common.requestUrl('id');
    var area=common.requestUrl('area');
    var detail={
        init:function(){
            this.getActivifyList();
            this.apply();
            this.answerData();
            this.review();
        },
        getActivifyList:function(){
            if(area!=='hide'){
                $('.ques-foot').removeClass('hide');
                $('.college-answer').removeClass('hide');
            }
            api.call('/Activity/GetActivityInfo',{
                activityId:activityId
            },function(result){
                if(result.code>0){
                    result.area=area;
                    var html=template('tpl-college-cont',result);
                    $('#collegeDetail-cont').html(html);
                    //点击收藏
                    $('.problem-ico3').click(function(event){
                        event.stopPropagation();
                        var mid=$(this).data('id');
                        if($(this).hasClass('problem-ico3-active')){
                            $(this).toggleClass('problem-ico3-active');
                            detail.cancelLike('取消成功',6,mid);
                            var count=parseInt($(this).next('.collectCount').html())-1;
                            $(this).next('.collectCount').html(count);
                        }else{
                            $(this).toggleClass('problem-ico3-active');
                            detail.clickLike('收藏成功',6,mid);
                            var count=parseInt($(this).next('.collectCount').html())+1;
                            $(this).next('.collectCount').html(count);
                        }
                    })
                    detail.showPopup();
                }else{
                    common.showToast(result.msg);
                }
            })
        },
        showPopup:function(){
            $('#college-entrol-btns').click(function(){
                $('body').addClass('hidden');
                $('.entered-popup').removeClass('hide');
                $('.entered-mask').removeClass('hide');
                $('.entered-mask').css('height',$(document).height());
            })
            $('.entered-mask').click(function(){
                $('body').removeClass('hidden');
                $('.entered-popup').addClass('hide');
                $('.entered-mask').addClass('hide');
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
        apply:function(){
            $('#entered-submit').click(function(){
                var name= $.trim($('#name').val());
                var email= $.trim($('#email').val());
                var phone= $.trim($('#phone').val());
                if(name=="" || name==null){
                    common.showToast('请填写一下姓名');
                    return;
                }
                if(email=="" || email==null){
                    common.showToast('请填写一下邮箱');
                    return;
                }
                if(phone=="" || phone==null){
                    common.showToast('请填写一下手机号');
                    return;
                }
                if(!phoneReg.test(phone)){
                    common.showToast('请填写正确的手机号');
                    return;
                }
                if(!emailReg.test(email)){
                    common.showToast('请填写正确的邮箱');
                    return;
                }
                api.call('/Activity/Apply',{
                    id:activityId,
                    name:name,
                    email:email,
                    phone:phone
                },function(result){
                    if(result.code>0){
                        common.showToast(result.msg);
                        $('.entered-popup').addClass('hide');
                        $('.entered-mask').addClass('hide');
                        $('.college-entrol-btns').html(result.msg);
                    }else{
                        common.showToast(result.msg);
                    }
                })
            })
        },
        //获取评论数据
        answerData:function(){
            api.call('/Comment/GetCommentList',{memberId :memberId,objType:2,objId:activityId,sortType:1,pageIndex:pageIndex},function(result){
                if(result.code>0 && result.data.length>0){
                    result.area=area;
                    var html = template('tpl-answer', result);
                    $('#problem-answer').append(html);
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
                }else{
                   // $('#problem-answer').hide();
                    $('.consult-moreData').hide();
                    $('.no-moreData').hide();
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
                api.call('/Comment/Write',{memberId :memberId,objType:2,objId:activityId,memo:memo},function(result){
                    if(result.code>0){
                        common.showToast(result.msg);
                        $('#qies-review').val("");
                        window.location.reload();
                    }
                });
            })
        },
    }
    detail.init();
})
