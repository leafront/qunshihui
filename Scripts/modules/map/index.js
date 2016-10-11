/**
 * Created by admin on 2016/4/13.
 */
/**
 * Created by admin on 2016/3/24.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var selectArea=require('selectArea1');
    var specialtyIds=0;
    var specialty;
    var keyword="律师事务所";
    var pageIndex=1;
    var centerLng;
    var centerLat;
    var width;
    var iCenterLng;
    var height;
    var map;
    var getAreaId=common.getAreaId();
    var iStop=false;
    var resultId=[];
    var mapList={
        init:function(){
            this.showList();
            this.apiMap();
        },
        searchMap:function(){
            api.call('/LegalMap/GetOfficeList',{
                type:0,
                keyword:keyword,
                centerLng:centerLng,
                centerLat:centerLat,
                width:width,
                height:height
            },function(result){
                if(result.code>0){
                    var i;
                    var len=result.data.length;
                    var data=result.data;
                    for(i=0;i<len;i++){
                        resultId.push(data[i].ID);
                        if(iStop){
                            if(data[i].ID=resultId[i]){
                                continue;
                            }
                            var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                                offset: new BMap.Size(10, 25), // 指定定位位置
                                imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                            });
                            //设置标注的经纬度
                            var marker= new BMap.Marker(new BMap.Point(data[i].Lng,data[i].Lat),{icon:myIcon});
                            //把标注添加到地图上
                            map.addOverlay(marker);
                            addInfoWindow(marker, data[i]);
                        }
                        var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                            offset: new BMap.Size(10, 25), // 指定定位位置
                            imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                        });
                        //设置标注的经纬度
                        var marker= new BMap.Marker(new BMap.Point(data[i].Lng,data[i].Lat),{icon:myIcon});
                        //把标注添加到地图上
                        map.addOverlay(marker);
                        addInfoWindow(marker, data[i]);

                    }
                    function addInfoWindow(marker,data){
                        var content="";
                        content= "<table>";
                        content=  content + "<tr><td style='vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all'>名称：&nbsp;</td><td style='line-height:20px;width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'>"+data.Name+"&nbsp;</td></tr>";
                        content=  content + "<tr><td style='vertical-align:top;width:38px;white-space:nowrap;word-break:keep-all'>地址：&nbsp;</td><td style='line-height:20px'>"+data.Address+"&nbsp;</td></tr>";
                        content+= "</table>";
                        var infoWindow= new BMap.InfoWindow(content);
                        var openInfoWinFun = function () {
                            marker.openInfoWindow(infoWindow);
                        };
                        marker.addEventListener("click",openInfoWinFun);
                        //return openInfoWinFun;
                    }
                }else{
                    common.showToast(result.msg);
                }
            })
        },
        apiMap:function(){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    map = new BMap.Map("map-photo");
                    centerLng=r.point.lng;
                    centerLat=r.point.lat;
                    iCenterLng=centerLng;
                    var point = new BMap.Point(r.point.lng,r.point.lat);
                    map.centerAndZoom(point,15);
                    //添加缩略图控件
                    map.addControl(new BMap.OverviewMapControl({isOpen:false,anchor:BMAP_ANCHOR_BOTTOM_RIGHT}));
                    //添加缩放平移控件
                    map.addControl(new BMap.NavigationControl());
                    //添加比例尺控件
                    map.addControl(new BMap.ScaleControl());
                    map.enablePinchToZoom();
                    setTimeout(function(){
                        map.setZoom(14);
                    }, 2000);  //2秒后放大到14级
                    map.enableScrollWheelZoom(true);
                    var bounds = map.getBounds();
                    width=Math.abs(centerLng-bounds.getSouthWest().lng);
                    height=Math.abs(centerLat-bounds.getNorthEast().lat);
                    //rightBottomLng=bounds.getNorthEast().lng;
                    //rightBottomLat=bounds.getSouthWest().lat;
                    mapList.searchMap();
                    map.ontouchend=function(e){
                        point = new BMap.Point(e.point.lng,e.point.lat);
                        map.centerAndZoom(point,15);
                        centerLng=point.lng;
                        centerLat=point.lat;
                        bounds = map.getBounds();
                        width=Math.abs(centerLng-bounds.getSouthWest().lng);
                        height=Math.abs(centerLat-bounds.getNorthEast().lat);
                        console.log(Math.abs(centerLng-iCenterLng)+','+width)
                        if(Math.abs(centerLng-iCenterLng)>width){
                            iCenterLng=centerLng;
                            mapList.searchMap();
                        }
                        iStop=true;
                    };
                }else {
                    common.showToast('定位失败');
                }
            },{enableHighAccuracy: true})
        },
        showList:function(){
            $('#map-search').focus(function(){
                $(this).attr('placeholder','');
                $(this).val('');
            })
            $('#map-search').blur(function(){
                keyword= $.trim($(this).val());
                if(keyword=="" || keyword==null){
                    keyword='律所';
                }
                mapList.apiMap();
            })
        }
    }
    mapList.init();
})