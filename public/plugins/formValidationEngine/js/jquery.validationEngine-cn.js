function getContextPath() {  
  var pathName = document.location.pathname;  
  var index = pathName.substr(1).indexOf("/");  
  var result = pathName.substr(0,index+1);  
  return result;  
}

(function($) {
	$.fn.validationEngineLanguage = function() {
	};
	$.validationEngineLanguage = {
		newLang : function() {
			$.validationEngineLanguage.allRules = {
				"required" : { // Add your regex rules here, you can take telephone as an example
					"regex" : "none",
					"alertText" : "* 字段必填.",
					"alertTextCheckboxMultiple" : "* 请选择一个单选框.",
					"alertTextCheckboxe" : "* 请选择一个复选框."
				},
				"length" : {
					"regex" : "none",
					"alertText" : "* 长度必须在 ",
					"alertText2" : " 至 ",
					"alertText3" : " 之间."
				},
				// bluespring添加 区间效验
				"region" : {
					"regex" : "none",
					"alertText" : "* 取值必须在 ",
					"alertText2" : " 至 ",
					"alertText3" : " 之间."
				},
				"maxCheckbox" : {
					"regex" : "none",
					"alertText" : "* 最多选择 ",
					"alertText2" : " 项."
				},
				"minCheckbox" : {
					"regex" : "none",
					"alertText" : "* 至少选择 ",
					"alertText2" : " 项."
				},
				"confirm" : {
					"regex" : "none",
					"alertText" : "* 两次输入不一致,请重新输入."
				},
				"telephone" : {
					"regex" : /^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{4}-\d{8}$/,
					"alertText" : "* 请输入有效的电话号码,如:010-29292929."
				},
				"mobilephone" : {
					"regex" : /^1[3-9]\d{9}$/,
					"alertText" : "* 请输入有效的手机号码."
				},
				"phonevalid" : {
					"regex" : /^[0-9-]{11,30}$/,
					"alertText" : "* 请输入有效的固话或手机号码.例如：024-88888888或13866668888"
				},
				"email" : {
					"regex" : /^[a-z\d][a-z0-9._-]*@(([a-z\d][a-z0-9-]*)\.)+[a-z]{2,}$/,
					"alertText" : "* 请输入有效的邮件地址."
				},
				"date" : {
					"regex" : /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
					"alertText" : "* 请输入有效的日期,如:2016-01-01."
				},
				"datetime" : {
					"regex" : /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31) ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
					"alertText" : "* 请输入有效的日期时间,如:2016-01-01 12:12:01."
				},
				"ip" : {
					"regex" : /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
					"alertText" : "* 请输入有效的IP."
				},
				"macvalid" : {
					"regex" : /^[0-9A-F]{2}$/,
					"alertText" : "* 请输入有效的MAC."
				},
				"chinese" : {
					"regex" : /^[\u4e00-\u9fa5]+$/,
					"alertText" : "* 请输入中文."
				},
				"exceChinese" : {
					"regex" : /^((?![\u4e00-\u9fa5]).)*$/,
					"alertText" : "* 请不要输入中文."
				},
				"url" : {
					"regex" : "/^[a-zA-z]:\\/\\/[^s]$/",
					"alertText" : "* 请输入有效的网址."
				},
				"zipcode" : {
					"regex" : /^[1-9]\d{5}$/,
					"alertText" : "* 请输入有效的邮政编码."
				},
				"onlyNumber" : {
					"regex" : /^[0-9]+$/,
					"alertText" : "* 请输入数字."
				},
				"onlyLetter" : {
					"regex" : /^[a-zA-Z]+$/,
					"alertText" : "* 请输入英文字母."
				},
				"noSpecialCaracters" : {
					"regex" : /^[0-9a-zA-Z]+$/,
					"alertText" : "* 请输入英文字母和数字."
				},
				"ajaxFunc" : {
					"file" : getContextPath() + "/valid/ajaxFunc",
					"alertTextOk" : "* ajax调用成功.",
					"alertTextLoad" : "* ajax调用中, 请稍候...",
					"alertText" : "* ajax验证不通过."
				},
				"ajaxFuncWithExtraData" : {
					"file" : getContextPath() + "/valid/ajaxFuncWithExtraData",
					"extraData" : "extraData", 
					"alertTextOk" : "* extraData验证成功",
					"alertTextLoad" : "* ajax调用中, 请稍候...",
					"alertText" : "* extraData已存在"
				},
				"validate2fields" : {
					"nname" : "validate2fields",
					"alertText" : "* 自定义验证函数失败"
				},
				"validatUserLoginName" : {
					"nname" : "validatUserLoginName",
					"alertText" : "* 登录名已存在"
				},"duplicateIp" : {
					"nname" : "duplicateIp",
					"alertText" : "* IP已存在"
				},"idCard" : {
					"regex" : /^\d{15}$|^\d{17}([0-9]|X|x)$/,
					"alertText" : "* 请输入身份证号."
				},"yanzhengAccount" : {
					"nname" : "yanzhengAccount",
					"alertText" : "* 该账户可能已经被使用或不是爱辽宁用户."
				},"price":{
					"regex":/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/,
					"alertText":"请输入正确价格",
				},"idCardNull" : {
					"regex" : /^\d{15}$|^\d{17}([0-9]|X|x)|^$/,
					"alertText" : "* 请输入身份证号."
				}
			};
		}
	};
})(jQuery);

$(document).ready(function() {
	$.validationEngineLanguage.newLang();
});