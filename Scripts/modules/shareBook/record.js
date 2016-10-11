
require.config(config);
define(function(require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var iScroll=require('iScroll');
    var date=require('date');
    var bookId=common.requestUrl('bookId');
    var regId=common.getUser().ID;
    var record={
        init:function(){
            //this.getRecord();
            this.getTypeDir(15);
            this.selectType();
            this.switchType();
            this.dateTimer();
            this.getRecord();
        },
        selectType:function(){
            $('#note-income').click(function(){
                record.getTypeDir(15);
            })
            $('#note-expenses').click(function(){
                record.getTypeDir(16);
            })
            document.getElementsByClassName('note-money')[0].oninput=function(){
                var dayValue=$.trim($(this).val());
                if(dayValue.length>8){
                    $(this).val(dayValue.slice(0,8));
                }
            }
        },
        dateTimer: function () {
            $('.note-times').date({ theme: "datetime" });
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        },
        switchType: function () {
            $(".note-menu li").click(function () {
                var $this = $(this);
                var type = $this.data('type');
                $this.addClass('active').siblings().removeClass('active');
                $("#type").val($this.data('typeid'));
            });
        },
        getRecord:function(){
            $("#btnDo").click(function () {
                var money = $.trim($("#money").val());
                if (isNaN(money) || money <= 0) {
                    common.showToast('请输入金额');
                    return;
                };
                var recordType = $('#recordType').val();
                if (!recordType) {
                    common.showToast('请输入分类信息');
                    return;
                }
                var recordTime = $('#recordTime').val();
                if (!recordTime) {
                    common.showToast('请输入记录的时间');
                    return;
                }
                var remark = $("#remark").val();
                var type = $("#type").val();
                api.call('/ShareBook/record',
                    { money: money,recordType:recordType,regId:regId,bookId:bookId,recordTime:recordTime,remark:remark,type:type},
                    function (result) {
                        common.showToast(result.msg);
                        if (result.code > 0) {
                            location.href = '/shareBook/book.html?bookId='+bookId;
                        }
                    });
            })
        },
        getTypeDir:function(dictType){
            api.getTypeDict({'dictType':dictType,'parentId':0},function(result){
                if(result.code>0 && result.data){
                    var html=template('tpl-noteType',result);
                    $('#noteType').html(html);
                }else{
                    common.showToast('系统错误');
                }
            })
        }
    }
    record.init();
})