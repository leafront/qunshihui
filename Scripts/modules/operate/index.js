/**
 * Created by admin on 2016/4/22.
 */
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
    var orderId=common.requestUrl('orderId');
    var operate={
        init:function(){
            this.getDirType();
        },
        getDirType:function(){
            api.getTypeDict({
                dictType:174,parentId:0
            },function(result){
                if(result.code>0){
                    var html=template('tpl-operate-cont',result);
                    $('#operate-cont').html(html);
                }else{
                    common.showToast(result.msg)
                }
            })
        }
    }
    operate.init();
})
