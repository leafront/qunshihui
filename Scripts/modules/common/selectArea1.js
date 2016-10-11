/**
 * Created by admin on 2016/4/13.
 */
define(function(require,exports,module){
    var baseUrl=location.hostname=='localhost'?'http://192.168.2.249:88':'http://api.qunshihui.net.cn';
    function selectArea($province, $city, $county) {
        this.province = $province;
        this.city = $city;
        this.county = $county;
    }
    selectArea.prototype.init = function () {

        function getOption(value, name) {
            return '<option value="' + value + '">' + name + '</option>';
        }
        var $this = this;
        var isFirst = {
            province: true, city: true, county: true
        };
        $this.province.change(function () {
            var provinceId = $this.province.val();
            if (provinceId > 0) {
                $.get(baseUrl+'/area/GetCityList', { provinceId: provinceId,api_client:'js'}, function (list) {
                    var html = getOption("0", "-- 市 --");
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        html += getOption(item.ID, item.Name);
                    }
                    $this.city.html(html);
                    if ($this.city.data('value') > 0 && isFirst.city) {
                        isFirst.city = false;
                        $this.city.val($this.city.data('value'));
                    }
                    $this.city.change();
                });
            } else {
                var html = getOption("0", "-- 市 --");
                $this.city.html(html).change();
            }
        });

        $this.city.change(function () {
            var cityId = $this.city.val();
            if (cityId > 0) {
                $.get(baseUrl+'/area/GetCountyList', { cityId: cityId,api_client:'js'}, function (list) {
                    var html = getOption("0", "-- 县 --");
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];
                        html += getOption(item.ID, item.Name);
                    }
                    $this.county.html(html);
                    if ($this.county.data('value') && $this.county.data('value') > 0 && isFirst.county) {
                        isFirst.county = false;
                        $this.county.val($this.county.data('value'));
                    }
                });
            } else {
                var html = getOption("0", "-- 县 --");
                $this.county.html(html);
            }
        });
        $this.county.change(function () {
            $this.county.data('value', 0);
        });

        $.get(baseUrl+"/area/GetProvinceList",{api_client:'js'}, function (list) {
            var html = getOption("0", "-- 省 --");
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                html += getOption(item.ID, item.Name);
            }
            $this.province.html(html);

            if ($this.province.data('value') && $this.province.data('value') > 0 && isFirst.province) {
                isFirst.province = false;
                $this.province.val($this.province.data('value')).change();
            }

        });
    }
    module.exports=selectArea;
})