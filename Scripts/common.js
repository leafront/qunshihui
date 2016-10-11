var kindEditorItems = [
'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'cut', 'copy', 'paste',
'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
'anchor', 'link', 'unlink', '|', 'about'
];

var kindEditorSystemUpload = function (K, imgId, valueId, buttonId) {
    kindEditorUpload(K, "system", imgId, valueId, buttonId);
}
var kindEditorFactoryUpload = function (K, imgId, valueId, buttonId) {
    kindEditorUpload(K, "factory", imgId, valueId, buttonId);
}

var kindEditorUpload = function (K, type, imgId, valueId, buttonId) {
    var uploadbutton = K.uploadbutton({
        button: K('#' + buttonId)[0],
        fieldName: 'imgFile',
        url: '/KindEditor/' + type + 'UploadJson?dir=image',
        afterUpload: function (data) {
            if (data.error === 0) {
                var url = K.formatUrl(data.url, 'absolute');
                $("#" + imgId).attr("src", url);
                $("#" + valueId).val(url);
            } else {
                alert(data.message);
            }
        },
        afterError: function (str) {
            alert('自定义错误信息: ' + str);
        }
    });
    uploadbutton.fileBox.change(function (e) {
        uploadbutton.submit();
    });
};


var kindEditorSystemUploadVideo = function (K, valueId, buttonId) {
    kindEditorUploadVideo(K, "System", valueId, buttonId);
}
var kindEditorFactoryUploadVideo = function (K, valueId, buttonId) {
    kindEditorUploadVideo(K, "factory", valueId, buttonId);
}

var kindEditorUploadVideo = function (K, type, valueId, buttonId) {

    var uploadbutton = K.uploadbutton({
        button: K('#' + buttonId)[0],
        fieldName: 'imgFile',
        url: '/KindEditor/' + type + 'UploadJson?dir=media',
        afterUpload: function (data) {
            if (data.error === 0) {
                var url = K.formatUrl(data.url, 'absolute');
                $("#" + valueId).val(url);
            } else {
                alert(data.message);
            }
        },
        afterError: function (str) {
            alert('自定义错误信息: ' + str);
        }
    });
    uploadbutton.fileBox.change(function (e) {
        uploadbutton.submit();
    });
}
//自定义上传文件
var kindEditorUploadFile = function (K, valueId, buttonId, arg) {

    var uploadbutton = K.uploadbutton({
        button: K('#' + buttonId)[0],
        fieldName: 'upfile',
        url: '/KindEditor/UploadFile?arg=' + arg,
        afterUpload: function (data) {
            if (data.error === 0) {
                var url = K.formatUrl(data.url, 'absolute');
                $("#" + valueId).val(url);
            } else {
                alert(data.message);
            }
        },
        afterError: function (str) {
            alert('自定义错误信息: ' + str);
        }
    });
    uploadbutton.fileBox.change(function (e) {
        uploadbutton.submit();
    });

}



//得到元素对象
var $$ = function (id) {
    return document.getElementById(id);
};

if (!window.console) {
    var emptyfun = function () { };
    window.console = {
        log: emptyfun,
        debug: emptyfun,
        warn: emptyfun
    };
}
//var result1=format("我是{0}，今年{1}了","loogn",26);
//var result2 =format("我是{name}，今年{age}了",{ name: "loogn", age: 26 });
function format(str, args) {
    var result = str;
    var reg;
    if (arguments.length > 1) {
        if (arguments.length === 2 && typeof (args) === "object") {
            for (var key in args) {
                if (args[key] !== undefined) {
                    reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined) {
                    reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

function trim(str) {
    return str ? str.replace(/(^\s*)|(\s*$)/g, "") : "";
};

function trimLeft(str) {
    return str ? str.replace(/(^\s*)/g, "") : "";
};
function trimRight(str) {
    return str ? str.replace(/(\s*$)/g, "") : "";
}

//得到url里的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null)
        return unescape(r[2]);
    return null;
}

function cutstring(str, number, ending) {
    if (!str || str.length == 0 || number <= 0) return '';
    if (str.length <= number) {
        return str;
    } else {
        return str.substr(0, number) + (ending || "…");
    }
}

var phoneReg = /^(1[34578][0-9])\d{8}$/;


/** 
 * 对日期进行格式化， 
 * @param date 要格式化的日期 
 * @param format 进行格式化的模式字符串
 *     支持的模式字母有： 
 *     y:年, 
 *     M:年中的月份(1-12), 
 *     d:月份中的天(1-31), 
 *     h:小时(0-23), 
 *     m:分(0-59), 
 *     s:秒(0-59), 
 *     S:毫秒(0-999),
 *     q:季度(1-4)
 * @return String
 * @author yanis.wang@gmail.com
 */
function dateFormat(date, format) {
    var birthdayMilliseconds = parseInt(date.replace(/\D/igm, ""));
    //实例化一个新的日期格式，使用1970 年 1 月 1 日至今的毫秒数为参数
    var date = new Date(birthdayMilliseconds);

    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}