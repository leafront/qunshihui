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
    var getAreaId=common.getAreaId();
    //社会公益
    var publishQuestion = {
        init: function () {
            common.checkLogin(common.getRelativePath());
            this.getCatInfo();
            this.freePublish();
        },
        freePublish: function () {
            $('#ques-btn').click(function () {
                var moduleType;
                var memo = $.trim($('.ques-txt').val());
                if (memo == "" || memo == null) {
                    common.showToast('请简单描述一下您的需求');
                    return;
                }
                $('.quesCat-menu li').each(function () {
                    if ($(this).hasClass('active')) {
                        moduleType = $(this).data('id');
                    }
                })
                //免费咨询
                api.call('/Demand/PublishQuestion', {
                    memberId: memberId,
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
    publishQuestion.init();
})
