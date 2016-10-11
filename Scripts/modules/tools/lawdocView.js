
/**
 * Created by Administrator on 2016/3/10.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var user=common.getUser();
    var memberId;
    if(user=="" || user==null){
        memberId=0;
    }else{
        memberId=user.ID;
    }
    var mid=common.requestUrl('DocID');
    var lawdocView={
        init:function(){
            this.lawDocViewData();
        },
        lawDocViewData:function(){
            var docId=common.requestUrl('DocID');
            api.call('/law/GetLawDocInfo',{docId :docId,'regId':0},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-lawDocView',result);
                    $('#lawDoc-cont').html(html);
                    lawdocView.clickLike();
                }else{
                    common.showToast('系统错误');
                }
            });
        },
        clickLike:function(){
            $('#lawDoc-like').click(function(){
                api.call('/Relationship/Binding',{relationship:9,mid:mid,nid:memberId},function(result){
                    if(result.code>0) {
                        if(result.code==0){
                            common.showToast(result.msg);
                            return;
                        }
                        common.showToast('收藏成功');
                        clickCount=$('#viewCount').html();
                        var clickCount=parseInt(clickCount)+1;
                        $('#viewCount').html(clickCount);
                    }
                });
            })
        }
    }
    lawdocView.init();
})