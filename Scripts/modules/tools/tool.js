/**
 * Created by loogn on 2016/3/11.
 */
require.config(config);
define(function (require, exports, module) {
    var template = require('template');
    var common = require('common');
    var api = require('api');
    var tool = {
        init: function () {
            this.isLogin();
        },
        isLogin: function () {
            $('#tools-notes').click(function () {
                window.location.href = '/shareBook/index.html';
            })
        }
    }
    tool.init();
})