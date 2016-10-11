/**
 * Created by admin on 2016/3/24.
*/
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var selectArea=require('selectArea1');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
   var provinceId=0;
   var cityId=0;
   var countyId=0;
    var specialtyIds=0;
    var specialty;
    var keyword="";
    var pageIndex=1;
    var name="";
    var getAreaId=common.getAreaId();
    var category={
        init:function(){
            this.listData();
            this.selectArea();
        },
        selectArea:function(){
            new selectArea($("#mapProvinceId"), $("#mapCityId"), $("#mapCountyId")).init();
            $('.consult-moreData').click(function(){
                pageIndex+=1;
                category.userInfo();
            })
            $('.consult-search').blur(function(){
                name=$(this).val();
                category.searchMaster();
            })
            $('#mapCountyId').change(function(){
                provinceId=$('#mapProvinceId').val();
                cityId=$('#mapCityId').val();
                countyId=$(this).val();
                category.searchMaster();
            })
        },
        listData:function(){
          api.getTypeDict({'dictType':13,parentId:0},function(result){
              var html = template('tpl-list-menu', result);
              $('#map-aside-menu').html(html);
              $('#map-aside-menu li').click(function(){
                    var index=$(this).index();
                    $(this).addClass('active').siblings().removeClass('active');
                    if($(this).data('id')==specialtyIds){
                        return;
                    }
                    specialtyIds=$(this).data('id');
                    category.searchMaster();
              })
              category.userInfo();
          })
        },
        searchMaster:function(){
            $('#map-list').html('');
            $('.consult-moreData,.no-moreData').hide();
            pageIndex=1;
            this.userInfo();
        },
        userInfo:function(){
            api.call('/member/SearchMaster',{
                name:name,
                provinceId :provinceId,
                cityId:cityId,
                countyId:countyId,
                identityType:specialtyIds,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html=template('tpl-map-list',result);
                    $('#map-list').append(html);
                    $('.consult-moreData').show();
                    $('.no-moreData').hide();
                }else{
                    $('.consult-moreData').hide();
                    $('.no-moreData').show();
                }
            });
        }
    }
    category.init();
})