require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var Swiper=require('swiper');
    var home={
        init:function(){
            //this.firstLoading();
            //this.bannerData();
            this.recommendData();
            this.banner();
            setTimeout(function(){
                common.h5Location();
            },3000);
        },
        recommend:function(){
            new Swiper('#swiper2',{
                paginationClickable: true,
                slidesPerView:3,
                loop: true,
                speed:500
            })
        },
        banner:function(){
            new Swiper('#swiper1',{
                pagination: '.pagination',
                loop:true,
                grabCursor: true,
                autoplay: 3000,
                paginationClickable: true
            })
        },
        recommendData:function(){
            api.call('/system/GetADList',{'position':'推荐律师'},function(result){
                if(result.code>0 && result.data.length>0){
                    var html=template('tpl-recommed-list',result);
                    $('#recommed-list').html(html);
                    home.recommend();
                }
            });
        }
    }
    home.init();
})
