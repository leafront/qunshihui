/**
 * Created by admin on 2016/4/21.
 */
/**
 * Created by loogn on 2016/3/15.
 */
require.config(config);
define(function (require,exports,module) {
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var selectArea=require('selectArea');
    var pid = common.requestUrl('pid');
    var memberId = common.getUser();
    if (memberId == "" || memberId == null) {
        memberId = 0;
    } else {
        memberId = common.getUser().ID;
    }
    //社会公益
    var getAreaId=common.getAreaId();
    var publishWelfare = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.getCatInfo();
            this.freePublish();
        },
        freePublish: function () {
            if(pid==144){
                $('.ques-select-tit').hide();
            }
            //免费发布1、免费咨询2、社会公益 3、海外市场4、安全保障
            common.moduleName();
            $('#ques-btn').click(function () {
                var moduleType;
                var memo = $.trim($('.ques-txt').val());
                var title = $.trim($('#header-select-tit').val()) || "";
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                $('.quesCat-menu li').each(function () {
                    if ($(this).hasClass('active')) {
                        moduleType = $(this).data('id');
                    }
                })
                //社会公益
                api.call('/Demand/PublishWelfare', {
                    memberId: memberId,
                    title: title,
                    memo: memo,
                    bigModuleType:pid,
                    moduleType: moduleType,
                }, function (result) {
                    if (result.code > 0) {
                        common.showToast(result.msg);
                        window.location.href = '/release/index.html?pid=' + pid + '&listId=' + moduleType;
                    } else {
                        common.showToast(result.msg);
                    }
                });
            })
        },
        getCatInfo: function () {
            api.getTypeDict({'dictType':pid, 'parentId':0}, function (result) {
                if (result.code > 0 && result.data) {
                    result.data.pid = pid;
                    var html = template('tpl-quesCat', result);
                    $('#ques-cat').html(html);
                    $('.quesCat-menu li').click(function () {
                        $(this).addClass('active').siblings().removeClass('active');
                    })
                } else {
                    common.showToast(result.msg);
                }
            })
        }
    }
    publishWelfare.init();
})
