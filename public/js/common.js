
/*****************************************************************
 jQuery Ajax封装通用类 (longzitianya)
 *****************************************************************/
;(function($, window,document ){
    'use strict';
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     * 注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
     * successfn 成功回调函数
     * errorfn 失败回调函数
     */
   App.init();
    $.ax=function(url, data, async, type, dataType, successfn) {
        async = (async===null || async==="" || typeof(async)==="undefined")? "true" : async;
        type = (type===null || type==="" || typeof(type)==="undefined")? "post" : type;
        dataType = (dataType===null || dataType==="" || typeof(dataType)==="undefined")? "json" : dataType;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            dataType: dataType,
            success: function(d){
                successfn(d);
            },
            error: function(e){
                //errorfn(e);
            }
        });
    };
 
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"state": 1}
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * divId  加载loading区域的id
     * successfn 成功回调函数
     */
    $.axse=function(url, data, divId,type,successfn) {
        data = (data===null || data==="" || typeof(data)==="undefined")? "" : data;
        type = (type===null || type==="" || typeof(type)==="undefined")? "GET" : type;
        $.ajax({
            type: type,
            data: data,
            url: url,
            timeout: 10000, //超时时间：10秒
            dataType: "json",
            beforeSend: function(xhr) {
            	$("#"+divId +" .loader").remove();
            	$("#"+divId).loader('show','<img src="../public/img/loading-spinner-blue.gif" border="0">',"20px","20px");
            	//$("#"+divId).loader('show','<i class="fa fa-2x fa-refresh fa-spin"></i>');
            },
            complete: function(XMLHttpRequest,status){
            	$("#"+divId +" .loader").remove();
        		if(status==="timeout"){
   		   			$("#"+divId).loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+divId+'Action()">点击重试</a>！</span></div>');
        		}
        		if (status==="error") {
		   			$("#"+divId).loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+divId+'Action()">点击重试</a>！</span></div>');
        		}
            },
            success: function(d) {
            	successfn(d);
            	$("#"+divId).loader('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	$("#"+divId).loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+divId+'Action()">点击重试</a>！</span></div>');
            }
        });
    };
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"state": 1}
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * divId  加载loading区域的id
     * successfn 成功回调函数
     */
    $.axseToAlert=function(url, data, divId,type,successfn) {
        data = (data===null || data==="" || typeof(data)==="undefined")? "" : data;
        type = (type===null || type==="" || typeof(type)==="undefined")? "GET" : type;
        $.ajax({
            type: type,
            data: data,
            url: url,
            timeout: 10000, //超时时间：10秒
            dataType: "json",
            beforeSend: function(xhr) {
            	toastr.clear();
            	//$("#"+divId +" .loader").remove();
            	//$("#"+divId).loader('show','<img src="../public/img/loading-spinner-blue.gif"  border="0">',"20px","20px");
            	 App.blockUI({
                     target:$("#"+divId),
                     boxed: true,
                     message: '正在跳转中请稍等...'
                 });
            },
            complete: function(XMLHttpRequest,status){
            	//$("#"+divId +" .loader").remove();
            	App.unblockUI($("#"+divId));
        		if(status==="timeout"){
        			toastr.info("请求已超时请重试");
        		}
        		if (status==="error") {
        			toastr.error("请求出错");
        		}
            },
            success: function(d) {
            	successfn(d);
            	App.unblockUI($("#"+divId));
            	//$("#"+divId).loader('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	toastr.error("请求出错");
            }
        });
    };
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"state": 1}
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * divId  加载loading区域的id
     * successfn 成功回调函数
     */
    $.axsesync = function(url, data, async, divId, type, successfn) {
    	async = (async===null || async==="" || typeof(async)==="undefined")? "true" : async;
        data = (data===null || data==="" || typeof(data)==="undefined")? "" : data;
        type = (type===null || type==="" || typeof(type)==="undefined")? "GET" : type;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            timeout: 10000, //超时时间：10秒
            dataType: "json",
            beforeSend: function(xhr) {
            	$("#"+divId +" .loader").remove();
                $("#"+divId).loader('show','<img src="../public/img/loading.gif" border="0">',"20px","20px");
            	//$("#"+divId).loader('show','<i class="fa fa-2x fa-refresh fa-spin"></i>');
            },
            complete: function(XMLHttpRequest,status) {
        	    $("#"+divId +" .loader").remove();
        	    if(status==="timeout"){
   		   			$("#"+divId).loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+divId+'Action()">点击重试</a>！</span></div>');
        	    }
            },
            success: function(d) {
        	    successfn(d);
        	    $("#"+divId).loader('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	$("#"+divId +" .loader").remove();
            	if (divId === "priceTag") {
            		$("#"+divId).loader('show','<span><a onclick="window.'+divId+'Action()">重试</a></span>');
            		$("#"+divId).find('.loader').css("top","-2px");
            	} else {
            		$("#"+divId).loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+divId+'Action()">点击重试</a>！</span></div>');
            	}
            }
        });
    };
    
    /**
     * ajax封装
     * url 发送请求的地址
     * data 发送到服务器的数据，数组存储，如：{"state": 1}
     * async 默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
     * type 请求方式("POST" 或 "GET")， 默认为 "GET"
     * name 加载loading区域的name
     * successfn 成功回调函数
     */
    $.axsename = function(url, data, async, name, type, successfn) {
    	async = (async===null || async==="" || typeof(async)==="undefined")? "true" : async;
        data = (data===null || data==="" || typeof(data)==="undefined")? "" : data;
        type = (type===null || type==="" || typeof(type)==="undefined")? "GET" : type;
        $.ajax({
            type: type,
            async: async,
            data: data,
            url: url,
            timeout: 10000, //超时时间：10秒
            dataType: "json",
            beforeSend: function(xhr) {
            	$("[name='"+name +"'] .loader").remove();
            	$("[name='"+name +"']").loader('show','<img src="../public/img/loading-spinner-blue.gif" border="0">',"20px","20px");
            	//$("."+name).loader('show','<i class="fa fa-2x fa-refresh fa-spin"></i>');
            },
            complete: function(XMLHttpRequest,status) {
        	    //$("[name='"+name +"'] .loader").remove();
        	    if(status==="timeout"){
        	    	$("[name='"+name +"'] .loader").remove();
        	    	$("[name='"+name +"']").loader('show','<div class="loadbox"><span>该区域加载失败，请<a onclick="window.'+name+'Action()">点击重试</a>！</span></div>');
        	    }
            },
            success: function(d) {
        	    successfn(d);
        	    $("[name='"+name +"']").loader('hide');
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
            	$("[name='"+name +"'] .loader").remove();
            	if (name === "priceTag") {
            		$("[name='"+name +"']").html('<span><a style="cursor:pointer;" onclick="window.'+name+'Action()">重试</a></span>');
            	} else {
            		$("[name='"+name +"']").loader('show','<div class="loadbox"><span>该区域加载失败，请<a style="cursor:pointer;" onclick="window.'+name+'Action()">点击重试</a>！</span></div>');
            	}
            }
        });
    };
    function unescapeEntity(str) {
        var reg = /&(?:nbsp|#160|lt|#60|gt|62|amp|#38|quot|#34|cent|#162|pound|#163|yen|#165|euro|#8364|sect|#167|copy|#169|reg|#174|trade|#8482|times|#215|divide|#247);/g,
            entity = {
                ' '   : ' ',
                ' '   : ' ',
                '<'     : '<',
                '<'    : '<',
                '>'     : '>',
                '&62;'     : '>',
                '&'    : '&',
                '&'    : '&',
                '"'   : '"',
                '"'    : '"',
                '?'   : '￠',
                '?'   : '￠',
                '?'  : '?',
                '?'   : '?',
                '?'    : '?',
                '?'   : '?',
                '€'   : '€',
                '€'  : '€',
                '§'   : '§',
                '§'   : '§',
                '?'   : '?',
                '?'   : '?',
                '?'    : '?',
                '?'   : '?',
                '?'  : '?',
                '?'  : '?',
                '×'  : '×',
                '×'   : '×',
                '÷' : '÷',
                '÷'   : '÷'
            };
        if (str === null) {
            return '';
        }
        str = str.toString();
        return str.indexOf(';') < 0 ? str : str.replace(reg, function(chars) {
            return entity[chars];
        });
    }
    // 转换html的实体
    $.ajaxSetup({
        global     : true,
        cache      : false,
        converters : {
            'text json' : function(response){
                return jQuery.parseJSON(unescapeEntity(response));
            }
        }
    });
    /**
     *Ajax 请求权限异常
     *   用户权限错误跳转登陆页
     *   404错误跳转404页面
     */
    $(document).ajaxComplete(function(evt, req, settings){
        if(req && req.responseJSON){
            var json = req.responseJSON;
            /*if(json.code === 403 && json.info === 'perm error' && !json.success){
                window.location.href = location.protocol + '//' + location.hostname;
                return;
            }*/
            if(json.code === 405 && !json.success) {
                window.location.href =  '../error/405';
            }
            if(json.code === 404 && !json.success) {
                window.location.href =  '../error/404';
            }
            if(json.code === 400 && !json.success) {
                window.location.href =  '../error/400';
            }
        }
    });
    /**
     *Ajax 请求错误提示
     *例如：500错误
     *返回错误信息格式
     *{
     *   code: 500,
     *   info: 系统发生异常
     *}
     */
    $(document).ajaxError(function(evt, req, settings){
        if(req && (req.status === 200||req.status === 0)){ return false; }
        if(req.status === 500){
                window.location.href =  '../error/500';
        }else if(req.status === 503){
        	window.location.href = '../error/503';
        }
    });
    //浏览器活跃窗口监听
    (function () {
    	  var title = document.title ;// 保存网页当前的标题
    	  // 各种浏览器兼容
    	  var hidden, visibilityChange;
    	  if (typeof document.hidden !== 'undefined') {
    	    hidden = 'hidden';
    	    visibilityChange = 'visibilitychange';
    	  } else if (typeof document.webkitHidden !== 'undefined') {
    	    hidden = 'webkitHidden';
    	    visibilityChange = 'webkitvisibilitychange';
    	  } else if (typeof document.mozHidden !== 'undefined') {
    	    hidden = 'mozHidden';
    	    visibilityChange = 'mozvisibilitychange';
    	  } else if (typeof document.msHidden !== 'undefined') {
    	    hidden = 'msHidden';
    	    visibilityChange = 'msvisibilitychange';
    	  }
    	  // 添加监听器，在title里显示状态变化
    	  document.addEventListener(visibilityChange, function () {
    	    if (document[hidden]) {
    	      document.title = '老师您去哪儿？';
    	    } else {
    	      document.title = title;
    	    }
    	  }, false);
    	})();
})(jQuery, window, document);
function showTip(obj) {
    $('#' + obj + '').css("display","block");
}

function hideTip(obj) {
	$('#' + obj + '').css("display", "none");
}
