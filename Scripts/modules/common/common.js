/**
 * Created by Administrator on 2016/2/17.
 */
define(function(require,exports,module){
    var FastClick=require('FastClick');
    var api=require('api');
    var wx=require('jweixin');
    FastClick.attach(document.body);
    var common={
        requestUrl:function(strParame){
            var args = new Object();
            var query = location.search.substring(1).toLowerCase(); // Get query string
            var pairs = query.split("&"); // Break at ampersand
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf('='); // Look for "name=value"
                if (pos == -1) continue; // If not found, skip
                var argname = pairs[i].substring(0, pos); // Extract the name
                var value = pairs[i].substring(pos + 1); // Extract the value
                value=decodeURIComponent(value); // Decode it, if needed
                args[argname] = value; // Store as a property
            }
            return args[strParame.toLowerCase()]; // Return the object
        },
        getUser:function(){
            var userJson=localStorage.getItem('user');
            if(userJson){
                var userData=JSON.parse(userJson);
                //是否过期
                if(Math.round(new Date().getTime()/1000)>userData.expirse) {
                    return null;
                }
                return userData;
            }
            return null;
        },
        countDown:function(val){
            var countdown=60;
            (function settime() {
                if (countdown == 0) {
                    val.removeAttribute("disabled");
                    val.value="发送验证码";
                    countdown = 60;
                    $(val).removeClass('login-code-active');
                    return;
                } else {
                    $(val).addClass('login-code-active');
                    val.setAttribute("disabled", true);
                    val.value="重新发送(" + countdown + ")";
                    countdown--;
                }
                setTimeout(function() {
                    settime(val);
                },1000);
            })();
        },
        setUser:function(obj){
            var userJson=JSON.stringify(obj);
            localStorage.setItem('user',userJson);
        },
        moduleName:function(desName){
            var moduleName=[
                {
                    id:144,
                    name:'免费咨询'
                },{
                    id:145,
                    name:'社会公益'
                },{
                    id:146,
                    name:'悬赏求助'
                },{
                    id:147,
                    name:'诉讼仲裁'
                },{
                    id:148,
                    name:'高端非诉'
                },{
                    id:149,
                    name:'诉讼金融'
                },{
                    id:150,
                    name:'法商学院'
                },{
                    id:151,
                    name:'海外市场'
                },{
                    id:152,
                    name:'安全保障'
                },{
                    id:170,
                    name:'普惠金融'
                },{
                    id:171,
                    name:'债权转让'
                },{
                    id:172,
                    name:'债务危机'
                },{
                    id:173,
                    name:'财税服务'
                },{
                    id:174,
                    name:'企业运营'
                }
            ];
            var pid=common.requestUrl('pid');
            var desName=desName||"";
            for(var i=0;i<moduleName.length;i++){
                if(pid==moduleName[i].id){
                    document.title=moduleName[i].name+desName;
                    $('#header-tit').html(moduleName[i].name+desName);
                }
            }
        },
        showToast:function(value){
            var tpl='<div class="mask"></div> <div class="mask-ui"><span>'+value+'</span></div>';
            $('body').append(tpl);
            $('.mask-ui').css({'left':($(window).width()-$('.mask-ui').outerWidth(true))/2,'top':($(window).height()-$('.mask-ui').outerHeight(true))/2});
            $('.mask').css('height',document.body.clientHeight);
            setTimeout(function(){
                $('.mask-ui').remove();
                $('.mask').remove();
            },1500)
        },
        getRelativePath:function(){
            var strUrl=document.location.toString();
            var arrObj=strUrl.split('//');
            var start=arrObj[1].indexOf('/');
            return arrObj[1].substring(start);
        },
        checkLogin:function(url){
            var u= common.getUser();
            if(u==null){
                localStorage.removeItem('user');
                common.showToast('请先登录');
                setTimeout(function(){
                    location.href='/account/login.html?returnurl='+window.encodeURIComponent(url);
                },300)
            }
        },
        confirm:function(obj,callBack){
            var huiTit=obj.huiTit ||"";
            var huiTxt=obj.huiTxt;
            var okTxt=obj.okTxt;
            var failTxt=obj.failTxt;
            var tpl='<div class="mui-popup mui-popup-in" style="display: block;"><div class="mui-popup-inner"><div class="mui-popup-title">'+huiTit+'</div> <div class="mui-popup-text">'+huiTxt+'</div></div><div class="mui-popup-buttons"><span class="mui-popup-button" id="hui-confirm">'+okTxt+'</span><span class="mui-popup-button" id="hui-cancel">'+failTxt+'</span></div></div><div class="mui-popup-backdrop mui-active" style="display: block;"></div>';
            $('body').append(tpl);
            $('#hui-cancel').click(function(){
                $('.mui-popup').remove();
                $('.mui-popup-backdrop').remove();
            })
            $('#hui-confirm').click(function(){
                $('.mui-popup').remove();
                $('.mui-popup-backdrop').remove();
                callBack();
            })
        },
        getAreaId:function(){
            var getAreaId=localStorage.getItem('userArea');
            if(getAreaId=="" || getAreaId==null){
                var getAreaId={};
                getAreaId.provinceId=310000;
                getAreaId.cityId=310100;
                getAreaId.countyId=310104;
                return getAreaId;
            }else{
                return JSON.parse(getAreaId);
            }
        },
        uploadImage:function(obj,oImg){
            var oImg=oImg ||'.CertImage';
            var obj=obj || '#chooseImage';
            wx.ready(function () {
                // 5 图片接口
                var localId;
                var serverId;
                $(obj).click(function () {
                    wx.chooseImage({
                        count:1,
                        sizeType:['original','compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            localId = res.localIds[0];
                            var img=document.createElement('img');
                            img.src=localId;
                            $(oImg).html(img);
                            common.showToast('已选择 ' + res.localIds.length + ' 张图片');
                            wx.uploadImage({
                                localId: localId,
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    serverId=res.serverId;
                                    api.call("/system/DownloadWXMedia", {serverId:serverId}, function (result) {
                                        if (result.code > 0) {
                                            $(oImg).data('img',result.data.FileUrl);
                                        }else{
                                            common.showToast(result.msg);
                                        }
                                    })
                                },
                                fail: function (res) {
                                    common.showToast('上传失败');
                                }
                            });
                        }
                    });
                });
            })
        },
        //身份证验证
        isIdCardNo:function (num){
            var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
            var error;
            var varArray = new Array();
            var intValue;
            var lngProduct = 0;
            var intCheckDigit;
            var intStrLen = num.length;
            var idNumber = num;
            // initialize
            if ((intStrLen != 15) && (intStrLen != 18)) {
                error = "输入身份证号码长度不对！";
                common.showToast(error);
                //frmAddUser.txtIDCard.focus();
                return false;
            }
            // check and set value
            for(i=0;i<intStrLen;i++) {
                varArray[i] = idNumber.charAt(i);
                if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
                    error = "错误的身份证号码！.";
                    common.showToast(error);
                    //frmAddUser.txtIDCard.focus();
                    return false;
                } else if (i < 17) {
                    varArray[i] = varArray[i]*factorArr[i];
                }
            }
            if (intStrLen == 18) {
                //check date
                var date8 = idNumber.substring(6,14);
                if (checkDate(date8) == false) {
                    error = "身份证中日期信息不正确！.";
                    common.showToast(error);
                    return false;
                }
                // calculate the sum of the products
                for(i=0;i<17;i++) {
                    lngProduct = lngProduct + varArray[i];
                }
                // calculate the check digit
                intCheckDigit = 12 - lngProduct % 11;
                switch (intCheckDigit) {
                    case 10:
                        intCheckDigit = 'X';
                        break;
                    case 11:
                        intCheckDigit = 0;
                        break;
                    case 12:
                        intCheckDigit = 1;
                        break;
                }
                // check last digit
                if (varArray[17].toUpperCase() != intCheckDigit) {
                    error = "身份证效验位错误!";
                    common.showToast(error);
                    return false;
                }
            }
            else{        //length is 15
                //check date
                var date6 = idNumber.substring(6,12);
                if (checkDate(date6) == false) {
                    common.showToast("身份证日期信息有误！.");
                    return false;
                }
            }
            return true;
            function checkDate(date){
                return true;
            }
        },
        isWeiXin:function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
        },
        wxConfig:function(array){
            api.call('/system/getwxjsconfig', {
                url:location.href
            }, function (result) {
                if (result.code > 0){
                    var wxConfig=result.data;
                    wxConfig.jsApiList=array;
                    wxConfig.debug=false;
                    wx.config(wxConfig);
                }else{
                   common.showToast('系统错误');
                }
            });
        },
        apiMap:function(latlon){
            var  province="";
            var  city="";
            var  district="";
            var userData={};
            var url ="http://api.map.baidu.com/geocoder/v2/?ak=9AWtGZf6km6qVSXSykNLGrBGHxiyfrU5&callback=renderReverse&location="+latlon+"&output=json&pois=0";
            $.ajax({
                type: "GET",
                dataType: "jsonp",
                url: url,
                success: function (data) {
                    if(data.status==0){
                        var res=data.result.addressComponent;
                        province=res.province;
                        city=res.city;
                        district=res.district;
                        api.call('/dict/GetAreaID',{province:province,city:city,county:district},function(result){
                            if(result.code>0 && result.data){
                                userData.provinceId=result.data.ProvinceID;
                                userData.cityId=result.data.CityID;
                                userData.countyId=result.data.CountyID;
                            }else{
                                userData.provinceId=310000;
                                userData.cityId=310100;
                                userData.countyId=310104;
                            }
                            localStorage.setItem('userArea',JSON.stringify(userData));
                        });
                    }
                },
            });
        },
        h5Location:function(callback){
            if(common.isWeiXin()==true){
                common.wxConfig(['getLocation']);
                wx.ready(function () {
                    wx.getLocation({
                        success: function (res) {
                            var latlon= res.latitude+','+res.longitude;
                            common.apiMap(latlon);
                        },
                        cancel: function (res) {
                            common.showToast('用户拒绝授权获取地理位置');
                        }
                    });
                });
            }else{
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(function(poistion){
                        var latlon = poistion.coords.latitude+','+poistion.coords.longitude;
                        common.apiMap(latlon);
                    });
                }else{
                    common.showToast("浏览器不支持地理定位。");
                }
            }
        },
        //字符超出显示省略号
        ellipsis:function(dom, num){
            var s1 = $.trim($(dom).html());
            var s2 = '';
            if (s1.length > num) {
                s2 = s1.substring(0, num);
                $(dom).html(s2 + '...');
            };
        }
    }
    return common;
})