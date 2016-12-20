/**
 * Created by Administrator on 2016/9/6.
 */
+function($) {
    'use strict';

    $('#pagepiling').pagepiling({
        menu: '#play',
        anchors: ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7', 'page8'],
        sectionsColor: ['#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff','#ffffff'],
        loopTop: true,
        loopBottom: true
    });

// 设置背景全屏高度
    var hh = $(window).height();
    $(".item").height(hh);
// 循环轮播
    $('#myCarousel').carousel({
        interval: 1000
    });

    $(function(){
        $(".ewm").hover(function() {
            $(this).find(".sidebox").stop().animate({"width":"124px","height":"124px"}, 200).css({"opacity":"1","filter":"Alpha(opacity=100)"});
        }, function() {
            $(this).find(".sidebox").stop().animate({"width":"54px","height":"54px"}, 200).css({"opacity":"0.8","filter":"Alpha(opacity=80)",});
        });
    });

//回到顶部函数
    function goTop(){
        $('html,body').animate({'scrollTop':0}, 300);
    }

//成功案例弹出相应内容
    var oP = document.getElementsByClassName("mingpian");
    var aDiv = document.getElementsByClassName("mp");
    for(var i = 0; i < oP.length; i++) {
        oP[i].index = i;
        //点击菜单
        oP[i].onclick = function() {
            for (var j = 0; j < aDiv.length; j++) {
                //将所有容器隐藏
                aDiv[j].style.display = "none";
            }
            //点击对应的菜单容器显示
            aDiv[this.index].style.display = "block";
        };
    }

//让产品图片背景等比例显示
    $(document).ready(function() {  
    	var zoomTimes;  
        $("#pro-logo a").each(function() {             
        	var curWidth  = $(this).width();  
            var curHeight = $(this).height(); 
    		zoomTimes = 4/5;  
    		$(this).height(curWidth/zoomTimes);                       
        });
    });

    $(function(){

    	$(document).keydown(function(event) {
    		if (event.keyCode == 13) {
    			return false;
    		}
    	});
    	
    	$("#searchInfo").click(function(){
    		if($(this).val()=="") {
    			$(this).val("佳商云");
    		}
    	});
    	
    	$("#searchBtn").click(function(){
            window.location="./product/product_list";
        });
/*
        initData();

        function initData() {

            $.ajax({
                url : '${base.contextPath}/product/getHomePageProduct',
                type : 'POST',
                data : {
                    displayNum : 0,
                    pageNum : 0
                },
                async : false,
                dataType : 'json',
                success : function(data) {

                    $('#productSum').val(data.productSum);
                    $('#pageTotal').val(Math.ceil(data.productSum / 6));

                    if (data.productList.length > 0) {
                        $.each(data.productList, function(i) {
                            if (data.productList[i].productId == "lncmcc_000000001_00000001") {
                                $('#a_' + data.productList[i].productId).attr("href", "${base.contextPath}/product/showProduct?orgId=&productId=" + data.productList[i].productId);
                            }
                            if (data.productList[i].productId == "112001010461") {
                                $('#a_' + data.productList[i].productId).attr("href", "${base.contextPath}/product/showProduct?orgId=&productId=" + data.productList[i].productId);
                            }
                            if (data.productList[i].productId == "112012241010") {
                                $('#a_' + data.productList[i].productId).attr("href", "${base.contextPath}/product/showProduct?orgId=&productId=" + data.productList[i].productId);
                            }
                        });
                    } else {
                        $('#productUl').hide();
                    }
                },
                complete : function(XMLHttpRequest,status) {
                    //请求完成后最终执行参数
                    if (status == 'timeout') {
                        //超时,status还有success,error等值的情况
                        $('#productUl').hide();
                    }
                },
                error : function(data) {
                    $('#productUl').hide();
                }
            });
        }

        $("#searchBtn").click(function(){
            window.location="${base.contextPath}/product/searchProduct?searchInfo=" + $('#searchInfo').val();
        });*/

    });

    function showTip(obj) {
        $('#' + obj + '').css("display","block");
    }

    function hideTip(obj) {
        $('#' + obj + '').css("display", "none");
    }
}(jQuery);