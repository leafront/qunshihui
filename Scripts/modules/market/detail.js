/**
 * Created by admin on 2016/4/20.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pageIndex=1;
    var title="";
    var moduleType="0";
    var marketId=common.requestUrl('id');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var phoneReg=/^(1[34578][0-9])\d{8}$/;
    var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var market={
        init:function(){
            this.getMarketList();
            this.apply();
        },
        getMarketList:function(){
            api.call('/Activity/GetMarketInfo', {
                marketId:marketId,
            }, function (result) {
                if (result.code>0 && (result.data)) {
                    var html=template('tpl-market-detail',result);
                    $('body').append(html);
                    //点击收藏
                    $('#click-like').click(function(event){
                        event.stopPropagation();
                        var mid=$(this).data('id');
                        if($(this).hasClass('click-like')){
                            $(this).toggleClass('click-like');
                            market.cancelLike('取消成功',6,mid);
                            var count=parseInt($(this).next('#collectCount').html())-1;
                            $('#collectCount').html(count);
                        }else{
                            $(this).toggleClass('click-like');
                            market.clickLike('收藏成功',6,mid);
                            var count=parseInt($(this).next('#collectCount').html())+1;
                            $('#collectCount').html(count);
                        }
                    })
                    market.showPopup();
                }else{
                    common.showToast(result.msg)
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
        cancelLike:function(msg,relationship,mid){
            api.call('/Relationship/UnBinding',{relationship:relationship,mid:mid,nid:memberId},function(result){
                if(result.code>0){
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
                    id:marketId,
                    name:name,
                    email:email,
                    phone:phone
                },function(result){
                    if(result.code>0){
                        common.showToast(result.msg);
                        $('.entered-popup').addClass('hide');
                        $('.entered-mask').addClass('hide');
                        $('#college-entrol-btns').html(result.msg);
                        $('#college-entrol-btns').unbind('click');
                    }else{
                        common.showToast(result.msg);
                    }
                })
            })
        },
        showPopup:function(){
            $('#college-entrol-btns').click(function(event){
                event.stopPropagation();
                $('.entered-popup').removeClass('hide');
                $('.entered-mask').removeClass('hide');
                $('.entered-mask').css('height',$(document).height());
            })
            $('.entered-mask').click(function(){
                $('.entered-popup').addClass('hide');
                $('.entered-mask').addClass('hide');
            })
        },
        switchList:function(){
            $('#market-menu li').click(function(){
                moduleType=$(this).data('id');
                market.getMarketList();
            })
        }
    }
    market.init();
})
