

var types = [];

var W = 10000;
var R = 0.01;
Array.prototype.MySum = function() {
    var arr = this;
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

String.prototype.format = function(args) {
    var result = this;
    var reg;
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] !== undefined) {
                reg = new RegExp("({)" + i + "(})", "g");
                result = result.replace(reg, arguments[i]);
            }
        }
    }
    return result;
}


var LegalFeeNextType = {
    CanDo: 1,
    Select: 2,
    Money: 3,
    OptionMoney: 4
};

function LegalFeeResult() {
    this.Result = "";
    this.Formula = "";
}



function GetPropertyCaseFees(money) {
    if (money <= 0) {
        return 0;
    }

    var addItems = [];

    if (money > 2000 * W) {
        addItems.push((money - 2000 * W) * 0.5 * R);
        money -= 2000 * W;
    }
    if (money > 1000 * W) {
        addItems.push((money - 1000 * W) * 0.6 * R);
        money -= 1000 * W;
    }

    if (money > 500 * W) {
        addItems.push((money - 500 * W) * 0.7 * R);
        money -= 500 * W;
    }

    if (money > 200 * W) {
        addItems.push((money - 200 * W) * 0.8 * R);
        money -= 200 * W;
    }
    if (money > 100 * W) {
        addItems.push((money - 100 * W) * 0.9 * R);
        money -= 100 * W;
    }
    if (money > 50 * W) {
        addItems.push((money - 50 * W) * 1 * R);
        money -= 50 * W;
    }
    if (money > 20 * W) {
        addItems.push((money - 20 * W) * 1.5 * R);
        money -= 20 * W;
    }
    if (money > 10 * W) {
        addItems.push((money - 10 * W) * 2 * R);
        money -= 10 * W;
    }
    if (money > 1 * W) {
        addItems.push((money - 1 * W) * 2.5 * R);
        money -= 1 * W;
    }
    if (money > 0) {
        addItems.push(50);
    }

    var sum = addItems.MySum();

    return sum;
}



var PropertyCaseFees = "不超过1万元的部分，每件交纳50元；\n" +
    "1万元至10万元的部分，按照2.5％交纳；\n" +
    "10万元至20万元的部分，按照2％交纳；\n" +
    "20万元至50万元的部分，20万元至50万元的部分；\n" +
    "50万元至100万元的部分，按照1％交纳；\n" +
    "100万元至200万元的部分，按照0.9％交纳；\n" +
    "200万元至500万元的部分，按照0.8％交纳；\n" +
    "500万元至1000万元的部分，按照0.7％交纳；\n" +
    "1000万元至2000万元的部分，按照0.6％交纳；\n" +
    "超过2000万元的部分，按照0.5％交纳；";


types.push({ ID: 1, Name: "案件受理费", OrderNum: 1, ParentID: 0 });
types.push({ ID: 2, Name: "申请费", OrderNum: 2, ParentID: 0 });

types.push({
    ID: 101,
    Name: "离婚案件",
    OrderNum: 1,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.OptionMoney, OptionMoneyTitle: "是否涉及财产分割", MoneyTitle: "财产总额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();

        result.Formula = "每件50元至300元\n" +
            "涉及财产分割，财产总额不超过20万元的，不另行交纳；超过20万元的部分按照0.5%交纳";

        if (money <= 200000) {
            result.Result = "50元 ~ 300元";
        }
        else {
            var addNum = 0.5 / 100 * (money - 200000);
            result.Result = "{0}元 ~ {1}元".format(50 + addNum, 300 + addNum);
        }
        return result;
    }

});


types.push({
    ID: 102,
    Name: "侵害人格权案件",
    OrderNum: 2,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.OptionMoney, OptionMoneyTitle: "是否涉及损害赔偿", MoneyTitle: "赔偿金额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件100元至500元\n" +
            "涉及损害赔偿，赔偿金额不超过5万元的，不另行交纳；超过5万元至10万元的部分，按照1％交纳；超过10万元的部分，按照0.5％交纳。";

        if (money <= 50000) {
            result.Result = "100元 ~ 500元";
        }
        else {
            var addItems = [];
            if (money > 100000) {
                addItems.push((money - 100000) * 0.5 / 100);
            }
            if (money > 50000) {
                addItems.push((Math.min(money, 100000) - 50000) * 1 / 100);
            }
            var addNum = addItems.MySum();
            result.Result = "{0}元 ~ {1}元".format(100 + addNum, 500 + addNum);
        }
        return result;
    }
});


types.push({

    ID: 103,
    Name: "非财产案件",
    OrderNum: 3,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件50元至100元";
        result.Result = "50元 ~ 100元";

        return result;
    }

});

types.push({
    ID: 104,
    Name: "劳动争议案件",
    OrderNum: 4,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件10元";
        result.Result = "10元";
        return result;
    }
});

types.push({
    ID: 105,
    Name: "知识产权民事案件",
    OrderNum: 5,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.OptionMoney, OptionMoneyTitle: "是否有争议金额", MoneyTitle: "争议金额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件500元至1000元\n" +
            "有争议金额的按财产案件收费标准交纳：\n" + PropertyCaseFees;
        if (money <= 0) {
            result.Result = "500元 ~ 1000元";
        }
        else {
            var n = GetPropertyCaseFees(money);
            result.Result = n + "元";
        }
        return result;
    }
});

types.push({
    ID: 106,
    Name: "商标、专利、海事行政案件",
    OrderNum: 6,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳100元";
        result.Result = "100元";
        return result;
    }
});

types.push({
    ID: 107,
    Name: "其他行政案件",
    OrderNum: 7,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳50元";
        result.Result = "50元";
        return result;
    }
});

types.push({
    ID: 108,
    Name: "管辖权异议不成立",
    OrderNum: 8,
    ParentID: 1
    ,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳50元至100元";
        result.Result = "50元 ~ 100元";
        return result;
    }
});

types.push({
    ID: 109,
    Name: "财产案件",
    OrderNum: 9,
    ParentID: 1,
    GetNext: function() {
        return { Type: LegalFeeNextType.Money, MoneyTitle: "金额或价额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = PropertyCaseFees;
        if (money >= 0) {
            var num = GetPropertyCaseFees(money);
            result.Result = num + "元";
        }
        else {
            result.Result = "请输入金额再计算";
        }
        return result;
    }
});

types.push({
    ID: 201,
    Name: "申请执行",
    OrderNum: 1,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.OptionMoney, OptionMoneyTitle: "是否有执行金额或价额", MoneyTitle: "执行金额或价额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "没有执行金额或者价额的，每件交纳50元至500元；\n" +
            "执行金额或者价额不超过1万元的，每件交纳50元；\n" +
            "超过1万元至50万元的部分，按照1.5％交纳；\n" +
            "超过50万元至500万元的部分，按照1％交纳；\n" +
            "超过500万元至1000万元的部分，按照0.5％交纳；\n" +
            "超过1000万元的部分，按照0.1％交纳。\n" +
            "符合民事诉讼法第五十五条第四款规定，未参加登记的权利人向人民法院提起诉讼的，按照本项规定的标准交纳申请费，不再交纳案件受理费。\n";

        if (money <= 0) {
            result.Result = "50元 ~ 500元";
        }
        else {

            var addItems = [];
            if (money > 1000 * W) {
                addItems.push((money - 1000 * W) * 0.1 * R);
                money -= 1000 * W;
            }
            if (money > 500 * W) {
                addItems.push((money - 500 * W) * 0.5 * R);
                money -= 500 * W;
            }
            if (money > 50 * W) {
                addItems.push((money - 50 * W) * 1 * R);
                money -= 50 * W;
            }

            if (money > 1 * W) {
                addItems.push((money - 1 * W) * 1.5 * R);
                money -= 1 * W;
            }
            addItems.push(50);

            var num = addItems.MySum();
            result.Result = num + "元";
        }
        return result;
    }
});


types.push({
    ID: 202,
    Name: "申请保全",
    OrderNum: 2,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.OptionMoney, OptionMoneyTitle: "是否涉及财产数额", MoneyTitle: "财产数额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "财产数额不超过1000元或者不涉及财产数额的，每件交纳30元；\n" +
            "超过1000元至10万元的部分，按照1%交纳；\n" +
            "超过10万元的部分，按照0.5％交纳；\n" +
            "但是，当事人申请保全措施交纳的费用最多不超过5000元。\n";
        if (money <= 1000) {
            result.Result = "30元";
        }
        else {
            var addItems = [];
            if (money > 10 * W) {
                addItems.push((money - 10 * W) * 0.5 * R);
                money -= 10 * W;
            }
            addItems.push((money - 1000) * 1 * R);

            var num = Math.min(5000, addItems.MySum());
            result.Result = num + "元";
        }
        return result;
    }
});

types.push({
    ID: 203,
    Name: "申请支付令",
    OrderNum: 3,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.Money, MoneyTitle: "金额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "比照财产案件受理费标准的1/3交纳。\n" +
            "财产案件受理费标准：\n" + PropertyCaseFees;
        if (money >= 0) {
            var num = GetPropertyCaseFees(money) / 3;
            result.Result = num + "元";
        }
        else {
            result.Result = "请输入金额再计算";
        }
        return result;
    }
});

types.push({
    ID: 204,
    Name: "申请公示催告",
    OrderNum: 4,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳100元";
        result.Result = "100元";
        return result;
    }
});

types.push({
    ID: 205,
    Name: "申请撤销仲裁裁决",
    OrderNum: 5,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳400元";
        result.Result = "400元";
        return result;
    }
});

types.push({
    ID: 206,
    Name: "申请认定仲裁协议效力",
    OrderNum: 6,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.CanDo };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "每件交纳400元";
        result.Result = "400元";
        return result;
    }
});

types.push({
    ID: 207,
    Name: "破产案件",
    OrderNum: 7,
    ParentID: 2,
    GetNext: function() {
        return { Type: LegalFeeNextType.Money, MoneyTitle: "破产财产总额" };
    },
    GetResult: function(money, subid) {
        var result = new LegalFeeResult();
        result.Formula = "依据破产财产总额计算，按照财产案件受理费标准减半交纳\n" +
            "但是，最高不超过30万元。\n" +
            "财产案件受理费标准：\n" + PropertyCaseFees;

        if (money >= 0) {
            var num = Math.min(30 * W, GetPropertyCaseFees(money) / 2);
            result.Result = num + "元";
        }
        else {
            result.Result = "请输入金额再计算";
        }

        return result;
    }
});

types.push({
    ID: 208,
    Name: "海事案件",
    OrderNum: 8,
    ParentID: 2,
    GetNext: function() {
        return {
            Type: LegalFeeNextType.Select,
            SelectItems: [
                { SubID: 1, Name: "申请设立海事赔偿责任限制基金" },
                { SubID: 2, Name: "申请海事强制令" },
                { SubID: 3, Name: "申请船舶优先权催告" },
                { SubID: 4, Name: "申请海事债权登记" },
                { SubID: 5, Name: "申请共同海损理算" },
            ]
        };
    },
    GetResult: function(money, subid) {

        var result = new LegalFeeResult();
        switch (subid) {
            case '1':
                result.Formula = "每件交纳1000元至1万元";
                result.Result = "1000元 ~ 1万元";
                break;
            case '2':
            case '3':
                result.Formula = "每件交纳1000元至5000元";
                result.Result = "1000元 ~ 5000元";
                break;
            case '4':
            case '5':
                result.Formula = "每件交纳1000元";
                result.Result = "1000元";
                break;
            default:
                result.Formula = "信息不完整，请选择分类";
                result.Result = "信息不完整";
                break;
        }
        return result;
    }
});

function GetTypeById(id) {
    var type = null;
    for (var i = 0; i < types.length; i++) {
        var item = types[i];
        if (item.ID == id) {
            type = item;
            break;
        }
    }
    return type;
}

function GetLegalFeeNext(id) {
    if (id < 100) {
        return { code: 0, msg: "编号不正确" };
    }
    var type = GetTypeById(id);
    if (type == null || type.GetNext == null) {
        return { code: 0, msg: "查询类型不存在" };
    }
    return { code: 1, data: type.GetNext() };

}


function GetLegalFeeResult(id, money, subId) {
    if (id < 100) {
        return { code: 0, msg: "编号不正确" };
    }
    var type = GetTypeById(id);
    if (type == null || type.GetResult == null) {
        return { code: 0, msg: "查询类型不存在" };
    }
    var result = type.GetResult(money, subId);
    return {
        code: 1,
        data: result
    };
}

//dom javascript

function bindType($select, parentId) {
    var html = '';
    if (parentId == 0 && parentId !== '') {
        html += '<option value="">请选择费用类型</option>';
    } else {
        html += '<option value="">请选择类型</option>';
    }
    if (parentId !== '') {
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            if (type.ParentID == parentId) {
                html += '<option value="' + type.ID + '">' + type.Name + '</option>';
            }
        }
    }
    $select.html(html);
}

bindType($('#bigType'), 0);

$('#bigType').change(function() {
    bindType($('#smallType'), $(this).val());

    $("#result").hide();
    $("#subItem,#moneyItem,#result").hide()

});

$('#smallType').change(function() {
    var id = $(this).val();
    $("#result").hide();
    if (id !== '') {
        var result = GetLegalFeeNext(id);
        if (result.code <= 0) {
            alert(result.msg);
            return;
        }
        showNext(result.data);
    }
});

function showNext(obj) {

    if (obj.Type == 1) {
        $("#moneyItem").hide().find("input").val("0");
        $("#subItem").hide();
    }
    else if (obj.Type == 2) {
        $("#moneyItem").hide().find("input").val("0");
        var selector = $("#subItem").show().find("select");
        var html = '<option value="">请选择具体类型</option>';
        for (var i = 0; i < obj.SelectItems.length; i++) {
            var sub = obj.SelectItems[i];
            html += '<option value="' + sub.SubID + '">' + sub.Name + '</option>';
        }
        selector.html(html);
    }
    else if (obj.Type == 3) {
        $("#subItem").hide().find("select").val('');
        var item = $("#moneyItem").show();
        item.find('p').hide();
        $("#money").val('').attr("placeholder", obj.MoneyTitle).removeAttr("disabled");
    } else if (obj.Type == 4) {
        $("#subItem").hide().find("select").val('');
        var item = $("#moneyItem").show();
        item.find('p input').prop('checked', false);
        item.find("p").show().find('span').text(obj.OptionMoneyTitle);
        $("#money").val('').attr("placeholder", obj.MoneyTitle).attr("disabled", true);
    }
}

$("#enableMoney").click(function() {
    var cked = $(this).prop('checked');
    if (cked) {
        $("#money").removeAttr("disabled");
    } else {
        $("#money").val('').attr("disabled", true);
    }
});

$("#dealBtn").click(function() {
    var id = $("#smallType").val();
    if (id == '') {
        alert('请选择类型');
        return;
    }

    var money = $("#money").val();
    if (isNaN(money)) {
        money = 0;
    }
    var subId = $("#subType").val();

    if (!$("#subType").is(":hidden") && subId =='') {
        alert('请选择具体类型');
        return;
    }


    var result = GetLegalFeeResult(id, money, subId);
    if (result.code <= 0) {
        alert(result.msg);
        return;
    }
    $("#result").show();
    $("#c_result").html(result.data.Result);
    $("#c_desc").html(result.data.Formula.replace(/\n/g, '<br/>'));

})