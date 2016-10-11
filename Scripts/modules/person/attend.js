/**
 * Created by admin on 2016/4/11.
 */
require.config(config);
define(function(require,exports,module){
    var api=require('api');
    var template=require('template');
    var common=require('common');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var pageIndex=1;
    var attend={
        init:function(){
            this.showList();
            this.attendList();
        },
        attendList:function(){
            api.call('/Comment/GetMyCommentList',{
                memberId:memberId,
                sortType:1,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html=template('tpl-attend-tab',result);
                    $('#attend-tab').append(html);
                }else{
                     $('#attend-tab').html('');
                    $('.consult-moreData').hide();
                    $('.no-moreData').hide();
                }
            })
        },
        showList:function(){
            $(".consult-moreData").click(function () {
                pageIndex+=1;
                attend.getMyDemand();
            });
        },
        moreAttendList:function(){
            $("#attend-tab").html("");
            $("#moredata,#nodata").hide();
            this.attendList();
        }
    }
    return attend.init();
})