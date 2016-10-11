/**
 * Created by admin on 2016/3/31.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var iScroll=require('iScroll');
    var date=require('date');
    var wx=require('jweixin');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var goodField=[];
    var DegreeId='';
    var IdentityType='';
    var id='';
    var identity={
        init:function(){
            common.wxConfig(['chooseImage','uploadImage']);
            this.getIdentityInfo();
        },
        getType:function(){
            api.getTypeDict({'dictType':13,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    result.IdentityType=IdentityType;
                    var html=template('tpl-person-identity',result);
                    $('#person-identity').html(html);
                    if(IdentityType!==0){
                        id=IdentityType;
                        identity.getIdentifyType();
                    }else{
                        id=$('#person-identity').val();
                        identity.getIdentifyType();
                    }
                    $('#person-identity').change(function(){
                        id=$(this).val();
                        identity.getIdentifyType();
                    })
                }else{
                    common.showToast('系统错误');
                }
            })
            //获取学历
            api.getTypeDict({'dictType':17,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    result.DegreeId=DegreeId;
                    var html=template('tpl-identity-degree',result);
                    $('#Degree').html(html);
                }else{
                    common.showToast('系统错误');
                }
            })
        },
        dateTimer: function () {
            $('#CertBeginTime').date();
            $('#CertEndTime').date();
            $('#CertBeginTime,#CertEndTime').focus(function(){
                document.addEventListener('touchmove',eventDefault,false);
            })
            function eventDefault(e) {
                e.preventDefault();
            }
            $('#datePlugin').on('click','#dateconfirm,#datecancle',function(){
                document.removeEventListener('touchmove',eventDefault,false);
            })
        },
        getIdentifyType:function(){
            api.getTypeDict({'dictType':20,'parentId':id},function(result){
                if(result.code>0 && result.data){
                    result.goodFieldStr=goodField;
                    var html=template('tpl-person-GoodField',result);
                    $('#GoodField').html(html);
                    var i=1;
                    $('#GoodField dd').click(function(){
                        if(!$(this).hasClass('active')){
                            i=$('#GoodField').find('.active').length+1;
                        }
                        if($(this).hasClass('active')){
                            i-=1;
                        }
                        if(i<=5){
                            $(this).toggleClass('active');
                        }else if(i==6){
                            $(this).removeClass('active');
                            common.showToast('擅长领域最多选择5个');
                        }
                    })
                }else{
                    common.showToast('系统错误');
                }
            })
        },
        getIdentityInfo:function(){
            api.call('/member/GetIdentityInfo', {
                memberId: memberId,
            }, function (result) {
                if (result.code > 0) {
                    var data=result.data;
                    var html = template("tpl-identity-cont", result);
                    if(data.GoodFieldStr!==null){
                        goodField=data.GoodFieldStr.split(',');
                    }
                    DegreeId=data.Degree;
                    IdentityType=data.IdentityType;
                    $("#identity-cont").append(html);
                    common.uploadImage();
                    identity.getType();
                    identity.updateInfo();
                    identity.dateTimer();
                }else{
                    common.showToast('系统错误');
                }
            });
        },
        //身份认证
        updateInfo:function(){
            $('#identity-save').click(function(){
                var identityType= $.trim($('#person-identity').val());
                var CertNO= $.trim($('#CertNO').val());
                var CertImage=$.trim($('.CertImage').data('img'));
                var CertBeginTime=$.trim($('#CertBeginTime').val());
                var goodFieldStr='';
                var goodFieldStr='';
                $('.company-tag dd').each(function(){
                    if($(this).hasClass('active')){
                        goodFieldStr+=$(this).data('id')+',';
                    }
                });
                goodFieldStr=goodFieldStr.slice(0,-1);
                var UnitName= $.trim($('#UnitName').val());
                var UnitPhone= $.trim($('#UnitPhone').val());
                var School=$.trim($('#School').val());
                var Degree= $.trim($('#Degree').val());
                var Major= $.trim($('#Major').val());
                var Video= $.trim($('#Video').val());
                if(identityType=="" || identityType==null){
                    common.showToast('请输入身份类型');
                    return;
                }
                if(CertNO=="" || CertNO==null){
                    common.showToast('请输入职业证号');
                    return;
                }
                if(CertBeginTime=="" || CertBeginTime==null){
                    common.showToast('请输入发证日期');
                    return;
                }
                if(CertImage=="" || CertImage=="null"){
                    common.showToast('请输入证件照片');
                    return;
                }
                if(goodFieldStr=="" || goodFieldStr==null){
                    common.showToast('请选择擅长领域');
                    return;
                }
                if($('.person-checkbox:checked').length>5){
                    common.showToast('擅长领域不能多于5个');
                    return;
                }
                if(UnitName=="" || UnitName==null){
                    common.showToast('请输入工作单位');
                    return;
                }
                if(UnitPhone=="" || UnitPhone==null){
                    common.showToast('请输入单位电话');
                    return;
                }
                var phoneReg=/^(([0\+]\d{2,3}-)?(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,4})?|(?:13\d|15[012356789]|18[0256789]|147)-?\d{5}(\d{3}|\*{3}))?$/;
                if (!phoneReg.test(UnitPhone)) {
                    common.showToast('单位电话不正确例如座机号码:021-4213550(或)\n手机号码：13635456878');
                    return;
                }
                if(School=="" || School==null){
                    common.showToast('请输入毕业院校');
                    return;
                }
                if(Degree=="" || Degree==null){
                    common.showToast('请输入学历');
                    return;
                }
                if(Major=="" || Major==null){
                    common.showToast('请输入专业');
                    return;
                }
                api.call('/member/UpdateIdentityInfo', {
                    ID: memberId,
                    identityType: identityType ,//身份编号—string,
                    CertNO:CertNO, //证件编号—string,
                    CertImage:CertImage, //证件图片---string,
                    CertBeginTime:CertBeginTime, //有效期开始时间---string,
                    CertEndTime:'', //有效期结束时间—string,
                    goodFieldStr :goodFieldStr, //擅长领域—string,
                    UnitName: UnitName,//工作单位—string,
                    UnitPhone:UnitPhone, //单位电话—string,
                    School: School,//毕业院校—string,
                    Degree: Degree,//学历(TypeDict数据字典17)—int,
                    Major:Major, //专业—string,
                    Video:Video, //视频地址—string
                }, function (result) {
                    if (result.code > 0) {
                        $('#identity-save').data('save',1);
                        common.showToast(result.msg);
                        window.location.href='/person/index.html';
                    }else{
                        var msg='您已提交认证，工作人员将在3-5个工作日内进行审核，审核期间您不能进行任何修改操作，请耐心等待。'
                        if(result.msg="您目前的状态不能申请认证"){
                            common.showToast(msg);
                        }
                    }
                });
            })
        }

    }
    identity.init();
})