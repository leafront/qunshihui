/**
 * Created by admin on 2016/3/25.
 */
require.config(config);
define(function(require,exports,module){
    var template=require('template');
    var common=require('common');
    var api=require('api');
    var memberId=common.getUser();
    if(memberId=="" || memberId==null){
        memberId=0;
    }else{
        memberId=common.getUser().ID;
    }
    var moduleType="";
    var pageIndex=1;
    var collection={
        init:function(){
            common.checkLogin(common.getRelativePath());
            this.showTab();
            this.getCollectionNews();
            this.getCollectionLawDoc();
            this.getCollectionJudgment();
        },
        showTab:function(){
            $('.collect-btns').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                $('.collect-list').addClass('hide');
            })
            $('#collect-article').click(function(){
                collection.getCollectionNews();
            })
            $('#collect-project').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                $('.collect-list').toggleClass('hide');
                api.call('/Relationship/GetCollectionDemand',{
                    moduleType:0,
                    pageIndex:pageIndex
                },function(result){
                    if(result.code>0 && result.data.length>0){
                        var data=result.data;
                        var linkUrl=[];
                            for(var i=0;i<data.length;i++) {
                                moduleType=data[i].DemandInfo.BigModuleType;
                                if(moduleType==144 || moduleType==145 || moduleType==146 || moduleType==147){
                                    linkUrl.push('/release/detail.html?pid==' + moduleType + '&detailId=' + data[i].MID);
                                }else if(moduleType==149 || moduleType==170 || moduleType==171 || moduleType==172){
                                    linkUrl.push('/release/lawDetail.html?pid==' + moduleType + '&detailId=' + data[i].MID);

                                }else if(moduleType==174){
                                    linkUrl.push('/operate/list.html?id=' + data[i].MID);

                                }else if(moduleType==150){
                                    linkUrl.push('/college/detail.html?id=' + data[i].MID);
                                }else if(moduleType==151){
                                    linkUrl.push('/market/detail.html?id='+data[i].MID);
                                }else if(moduleType==152){
                                    linkUrl.push('/release/insuranceDetail.html?newsId='+data[i].MID);
                                }
                        }
                        result.data.linkUrl=linkUrl;
                        var html=template('tpl-consultList',result);
                        $('#collectTab').html(html);
                    }else{
                        $('#collectTab').html('');
                        common.showToast('暂无收藏');
                    }
                });
            })
            $('.collect-menu dd').click(function(){
                $(this).addClass('active').siblings().removeClass('active');
                moduleType=$(this).data('id');
                $('.collect-list').toggleClass('hide');
                collection.getCollectionDemand();
            })
        },
        //我收藏的新闻
        getCollectionNews:function(){
            api.call('/Relationship/GetCollectionNews',{
                memberId :memberId,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var html=template('tpl-consultList',result);
                    $('#collectTab').html(html);
                }else{
                    $('#collectTab').html("");
                }
            });
        },
        //法律文书
        getCollectionLawDoc:function(){
            $('#collect-contract').click(function(){
                api.call('/Relationship/GetCollectionLawDoc',{
                    memberId :memberId,
                    pageIndex:pageIndex
                },function(result){
                    if(result.code>0 && result.data.length>0){
                        var html=template('tpl-consultList',result);
                        var source='\
                                <% for(var i=0;i<data.length;i++){%>\
                                    <a href="/Tools/lawdocView.html?DocID=<%=data[i].MID%>">\
                                    <div class="consultList-item">\
                                        <%if(data[i].LawDocInfo.Title!==""){%><h3><%=data[i].LawDocInfo.Title%></h3><%}%>\
                                        <p><%=data[i].LawDocInfo.Memo%></p>\
                                        <div class="collect-txt clearfix">\
                                            <i>￥50000</i>\
                                            <time><%=data[i].AddTime%>截止</time>\
                                            <button>详情</button>\
                                        </div>\
                                        <span class="consulte-ques hide">已解决</span>\
                                    </div>\
                                    </a>\
                                <%}%>';
                        var render = template.compile(source);
                        var html = render({
                            data:result.data
                        });
                        $('#collectTab').html(html);
                    }else{
                        $('#collectTab').html("");
                        common.showToast('暂无数据');
                    }
                });
            })
        },
        //裁判文书
        getCollectionJudgment:function(){
            $('#collect-award').click(function(){
                api.call('/Relationship/GetCollectionJudgment',{
                    memberId :memberId,
                    pageIndex:pageIndex
                },function(result){
                    if(result.code>0 && result.data.length>0){
                        var html=template('tpl-consultList',result);
                        var source='\
                                <% for(var i=0;i<data.length;i++){%>\
                                    <a href="/Tools/judgmentView.html?judgmentId=<%=data[i].MID%>">\
                                    <div class="consultList-item">\
                                        <%if(data[i].JudgmentInfo.Executor!==""){%><h3><%=data[i].JudgmentInfo.Executor%></h3><%}%>\
                                        <p><%=data[i].JudgmentInfo.UnitName%></p>\
                                        <div class="collect-txt clearfix">\
                                            <i>￥50000</i>\
                                            <time><%=data[i].AddTime%>截止</time>\
                                            <button>详情</button>\
                                        </div>\
                                        <span class="consulte-ques hide">已解决</span>\
                                    </div>\
                                    </a>\
                                <%}%>';
                        var render = template.compile(source);
                        var html = render({
                            data:result.data
                        });
                        $('#collectTab').html(html);
                    }else{
                        $('#collectTab').html("");
                        common.showToast('暂无数据');
                    }
                });
            })
        },
        //我的收藏发布
        getCollectionDemand:function(){
            api.call('/Relationship/GetCollectionDemand',{
                moduleType:moduleType,
                pageIndex:pageIndex
            },function(result){
                if(result.code>0 && result.data.length>0){
                    var data=result.data;
                    var linkUrl=[];
                    if(moduleType==144 || moduleType==145 || moduleType==146 || moduleType==147){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/release/detail.html?pid==' + moduleType + '&detailId=' + data[i].MID);
                        }
                    }else if(moduleType==149 || moduleType==170 || moduleType==171 || moduleType==172){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/release/lawDetail.html?pid==' + moduleType + '&detailId=' + data[i].MID);
                        }
                    }else if(moduleType==174){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/operate/list.html?id=' + data[i].MID);
                        }
                    }else if(moduleType==150){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/college/detail.html?id=' + data[i].MID);
                        }
                    }else if(moduleType==151){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/market/detail.html?id='+data[i].MID);
                        }
                    }else if(moduleType==152){
                        for(var i=0;i<data.length;i++) {
                            linkUrl.push('/release/insuranceDetail.html?newsId='+data[i].MID);
                        }
                    }
                    result.data.linkUrl=linkUrl;
                    var html=template('tpl-consultList',result);
                    $('#collectTab').html(html);
                }else{
                    $('#collectTab').html('');
                    common.showToast('暂无收藏');
                }
            });
        }
    }
    collection.init();
})
