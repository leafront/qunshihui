/**
 * Created by admin on 2016/4/22.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var pageIndex=1;
    var title="";
    var moduleType="0";
    var id=common.requestUrl('id');
    var memberId=common.getUser();
    var identityType="";
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
        identityType=common.getUser().IdentityType;
    }
    var name="";
    var getAreaId=common.getAreaId();
    var list={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.getEnterpriseList();
            this.searchList();
        },
       getEnterpriseList:function(){
            api.call('/member/GetEnterpriseList',{
                name:name,
                bigModuleType:174,
                moduleType:id,
                countyId:getAreaId.countyId,
                identityType:identityType,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0){
                    var html=template('tpl-operate-cont',result);
                    $('#operateList-cont').html(html);
                }else{
                    common.showToast(result.msg)
                }
            })
        },
        searchList:function(){
            $('.consult-search').blur(function(){
                name=$(this).val();
                list.getEnterpriseList();
            })
        }
    }
    list.init();
})