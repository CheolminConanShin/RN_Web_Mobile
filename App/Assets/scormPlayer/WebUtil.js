/*********************************************************
 * checkbox 전체 선택/해지
 *
 * 전체 선택 checkbox name, id 값은 _checkCheckbox
 * 선택 checkbox name, id 값은 _selectCheckbox
 *
 *********************************************************/
function fnSelectedAllCheckbox(_checkCheckbox, _selectCheckbox) {
	if($("input:checkbox[name="+_checkCheckbox+"]").is(":checked")) {
		$("input:checkbox[name="+_selectCheckbox+"]").prop("checked", true);
	} else {
		$("input:checkbox[name="+_selectCheckbox+"]").prop("checked", false);
	}
}

/*********************************************************
 * checkbox 전체 선택/해지
 *
 * 전체 선택 checkbox name, id 값은 _checkCheckbox
 * 선택 checkbox name, id 값은 _selectCheckbox
 * Disabled 된 checkbox 는 제외
 *
 *********************************************************/
function fnCheckboxNotDisabled(_checkCheckbox, _selectCheckbox) {
	if($("input:checkbox[name="+_checkCheckbox+"]").is(":checked")){
		$("input:checkbox[name="+_selectCheckbox+"]").each(function(index){
			if(!$(this).attr("disabled")){
				$(this).attr("checked", true);
			}
		});
	}
	else{
		$("input:checkbox[name="+_selectCheckbox+"]").removeAttr("checked");
	}
}

/*********************************************************
 * 체크박스 목록에서 하나 이상 체크 여부
 *
 * @param objName : 오브젝트 이름
 * @returns : 하나 이상 체크시 true , 아닐경우 false
 * fnIsChecked('checkValue')
 *
 *********************************************************/
function fnIsChecked(objName) {
	var obj = document.getElementsByName(objName);
	for (var i = 0; i < obj.length; i++)
		if (obj[i].checked == true)
			return true;
	return false;
}

/*********************************************************
 * 라디오, 체크박스의 체크된 컨트롤 수 얻기
 *
 * @param objName : 오브젝트 이름
 * @returns : 체크상태의 컨트롤 수
 *
 *********************************************************/
function getCheckedCount(objName) {
	var obj = new Array();
	var objCnt;
	var checkedCnt = 0;

	obj = document.getElementsByName(objName);
	objCnt = obj.length;

	for (var i = 0; i < objCnt; i++)
		if (obj[i].checked == true)
			checkedCnt = checkedCnt + 1;

	return checkedCnt;
}

/*********************************************************
 * dialog message 출력
 *
 * @param msg
 * @param url
*********************************************************/
function fnMessage(msg, url) {
	$(function() {
		$( "#dialog-message:ui-dialog" ).dialog( "destroy" );
		$("#dialog-message-text").text(msg.replace(/<br \/([^>]*)>/ig,"\n"));
		$( "#dialog-message" ).dialog({
			modal: true
			, closeText: 'hide'
			, buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
					location.href = url;
				}
			}
			, open: function() {
				$(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar").hide();
	       }
		});
	});
}

/*********************************************************
 * Properties Message Arguments Replace
 *
 * @param msg
 * @param args
 * @returns
 *********************************************************/
function fnMessageArguments(msg, args){
    if(args) {
        if (typeof args == "object" && args.length) {
            for (var i = 0; i < args.length; i++) {
                var pattern = new RegExp("\\{" + i + "\\}", "g");
                msg = msg.replace(pattern, args[i]);
            }
        } else {
        	msg = msg.replace(/\{0\}/g, args);
        }
    }
    return msg;
}

/*********************************************************
 * Window Center Move
 *
*********************************************************/
function fnSetWindowCenter() {
	var x = 0, y =0;
	if (self.innerHeight) { // IE 외 모든 브라우저
		x = (screen.availWidth - self.innerWidth) / 2;
		y = (screen.availHeight - self.innerHeight) / 2;
	}else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict 모드
		x = (screen.availWidth - document.documentElement.clientWidth) / 2;
		y = (screen.availHeight - document.documentElement.clientHeight) / 2;
	}else if (document.body) { // 다른 IE 브라우저( IE < 6)
		x = (screen.availWidth - document.body.clientWidth) / 2;
		y = (screen.availHeight - document.body.clientHeight) / 2;
	}
	window.moveTo(x, y);
}

/*********************************************************
 * 다중 사용자 검색 팝업
 *
 * @param param
 * @param callback
 *
 *********************************************************/
function fnMultiSearchUserPopup(param, callback){
	if(param && param.searchWord){
		param["pageOffset"] = 0;
		param["pageSize"] = 2;
		if(param.searchWord){
			param["_searchUserWord"] = param.searchWord;
		}
		fnAjaxJsonParamFun(__URL_SEARCH_USER_GRID, param, function(data){
			if(data && data.result.resultCount == 1){
				callback(data.result.list);
				return;
			}
			else{
				_fnSearchUserPopup(param, callback, "m");
			}
		});
	}
	else{
		_fnSearchUserPopup(param, callback, "m");
	}
}
/*********************************************************
 * 단일 사용자 검색 팝업
 *
 * @param param
 * @param callback
 *
 *********************************************************/
function fnSearchUserPopup(param, callback){
	if(param && param.searchWord){
		param["pageOffset"] = 0;
		param["pageSize"] = 2;
		if(param.searchWord){
			param["_searchUserWord"] = param.searchWord;
		}

		// 2014.05.14 - 단일 사용자 검색 관련 주석함.
//		fnAjaxJsonParamFun(__URL_SEARCH_USER_GRID, param, function(data){
//			if(data && data.result.resultCount == 1){
//				callback(data.result.list[0]);
//				return;
//			}
//			else{
				_fnSearchUserPopup(param, callback, "s");
//			}
//		});
	}
	else{
		_fnSearchUserPopup(param, callback, "s");
	}
}
/*********************************************************
 * 사용자 검색 팝업 - 내장함수 (private function)
 *
 * @param param
 * @param callback
 * @param type - default : 싱글 검색 , m : 다중 검색
 *
 * 1. 추후 사용자 검색 팝업 div target 받기로 함.
 *********************************************************/
function _fnSearchUserPopup(param, callback, type){
	var defaults = {type:type};
	if(param != null){
		$.extend(defaults, param);
	}
	fnLoadPopup("searchUserPopup", __URL_SEARCH_USER, defaults, callback);
}

/*********************************************************
 * 사용자 검색 팝업 Callback 함수 - 내장함수 (private function)
 *
 * [사용자 정보 구성]
 * 1. userObject.userId
 * 2. userObject.userNm
 * 3. userObject.deptNm
 * 4. userObject.rankNm
 *********************************************************/
function _fnSearchUserPopupCallback(obj){
	fnLoadPopupCallback("searchUserPopup", true, obj);
}

var _callBackMap = null;
/*********************************************************
 * 팝업 Load
 *
 * 1. 부모창에서 호출
 * 2. Close 할경우 Callback 함수를 호출하지 않음.
 *
 * @param targetId
 * @param url
 * @param param
 * @param callback
 *********************************************************/
function fnLoadPopup(targetId, url, param, callback){
	return _fnLoadPopup(targetId, url, param, callback, false);
}
/*********************************************************
 * 팝업 Load
 *
 * 1. 부모창에서 호출
 * 2. Close 할경우도 Callback 함수를 호출함.
 *
 * @param targetId
 * @param url
 * @param param
 * @param callback
 *********************************************************/
function fnLoadPopupClose(targetId, url, param, callback){
	return _fnLoadPopup(targetId, url, param, callback, true);
}
/*********************************************************
 * 팝업 Load - 내장함수 (private function)
 *
 * @param targetId
 * @param url
 * @param param
 * @param callback
 *********************************************************/
function _fnLoadPopup(targetId, url, param, callback, closeCallback){
	// Modal Window Open
	var $modalWindow = $('#mw').show();

	var $popupDiv = $('#'+targetId);

	// 신규 div 생성
	if($popupDiv.length == 0){
		$popupDiv = $("<div>").prop({"id":targetId,"class":"popup"});
		$popupDiv.appendTo($modalWindow);
	}
	else{
		// 초기화
		$popupDiv.empty();
	}

	// Callback 정보 저장
	if(_callBackMap == null) _callBackMap = new Map();
	_callBackMap[targetId] = {"targetDiv":$popupDiv, "callback":callback};

	// 페이지 로드 옵션
	var option = {'lv_url':url, 'lv_param':param, 'lv_targetDiv':targetId};

	// 팝업 Dim 처리 z-index 처리
	_fnPopupBgZindex($popupDiv);

	// 팝업 load - scroll top 막기위해 returnValue : false 처리함.
	event.returnValue = false;

	// 페이지 로드
	fn_comPageLoad(option, function(){

		//
		event.returnValue = true;

		// 팝업 가운데 정렬
		$popupDiv.center();

		// 닫기 버튼 Event
		$popupDiv.find(".btn-popClose").bind('click',function(){
			// 팝업 닫을시 Callback 호출을 허용한 경우.
			if(closeCallback){
				var callbackInfo = _callBackMap[targetId];
				// Parent Callback 함수 호출
				if(callbackInfo != null && callbackInfo.callback != null){
					callbackInfo.callback();
				}
			}

			// 팝업 닫기
			_fnLoadPopupClose($popupDiv);
			// 사용이 끝난 Callback 정보는 삭제함.
			_fnLoadPopupCallbackRemove(targetId);
			return false;
		});
	});
	return $popupDiv;
}

/*********************************************************
 * 팝업 Load Callback 함수
 *
 * 1. 자식창에서 호출
 *
 * @param targetId
 * @param blColse
 * @param obj
 *********************************************************/
function fnLoadPopupCallback(targetId, blColse, obj){
	try{
		var callbackInfo = _callBackMap[targetId];
		if(callbackInfo != null){
			// Parent Callback 함수 호출
			if(callbackInfo.callback != null){
				callbackInfo.callback(obj);
			}
			if(blColse != false){
				// 사용이 끝난 Callback 정보는 삭제함.
				_fnLoadPopupCallbackRemove(targetId);
				// 팝업 닫기
				_fnLoadPopupClose(callbackInfo.targetDiv);
			}
		}
	}
	catch(e){
		alert(e);
	}
}

/*********************************************************
 * 팝업 닫기 - 내장함수 (private function)
 * @param $popupDiv
 *********************************************************/
function _fnLoadPopupClose($popupDiv){
	$popupDiv.remove();
	var $modalWindow = $('#mw');
	if($modalWindow.find(".popup").length == 0){
		$modalWindow.hide();
	}
	_fnPopupBgZindex('');
	return false;
}

/*********************************************************
 * 팝업 Load Callback 함수 제거 - 내장함수 (private function)
 *
 * @param targetId
 **********************************************************/
function _fnLoadPopupCallbackRemove(targetId){
	try{
		if(_callBackMap != null){
			var callbackInfo = _callBackMap[targetId];
			if(callbackInfo != null){
				_callBackMap.remove(targetId);
			}
		}
	}
	catch(e){
		alert(e);
	}
}

/**********************************************************
 * 팝업 z-index 설정 - 내장함수 (private function)
 * @param view
 **********************************************************/
function _fnPopupBgZindex(view){
	// Modal Window
	var modal  = $("#mw");
	if(view){
		var maxIndex = view.zIndex();
		if(isEmpty(maxIndex) || maxIndex < 1000){
			maxIndex = 1000;
		}
		modal.find(".popup").each(function(index){
			var zIndex = $(this).zIndex();
			if(maxIndex < zIndex){
				maxIndex = zIndex;
			}
		});
		view.zIndex(maxIndex+1);
		$(".pop-bg").zIndex(maxIndex+1);
	}
	else{
		// 팝업 Layer
		var zIndex = modal.find(".popup").last().zIndex();
		if(zIndex){
			$(".pop-bg").zIndex(zIndex);
		}
		else{
			$(".pop-bg").zIndex('');
		}
	}
}

/*********************************************************
 * Load Form Submit
 *
 * @param formObj
 * @param targetId
 *********************************************************/
function fnLoadFormSubmit(formObj, targetId){
	var url = null , param = null;
	if(formObj instanceof jQuery){
		url = formObj.prop("action");
		param = formObj.serializeArray();
	}
	else {
		if(typeof formObj == "string"){
			var frm = $("form[name='"+formObj+"']");
			url = frm.prop("action");
			param = frm.serializeArray();
		}
		else{
			url = formObj.action;
			param = $("form[name='"+formObj.name+"']").serializeArray();
		}
	}

	var option = {
		lv_url : url,
		lv_targetDiv : (isNotEmpty(targetId))? targetId : "lay-contents",
		lv_param : param
	};

	// office_common 함수
	fn_comPageLoad(option, null);
}

/*********************************************************
 * Load Form Submit
 *
 * @param formObj
 * @param targetId
 * @param callbackgetId
 *********************************************************/
function fnLoadFormSubmitFun(formObj, targetId, callback){
	var url = null , param = null;
	if(formObj instanceof jQuery){
		url = formObj.prop("action");
		param = formObj.serializeArray();
	}
	else {
		if(typeof formObj == "string"){
			var frm = $("form[name='"+formObj+"']");
			url = frm.prop("action");
			param = frm.serializeArray();
		}
		else{
			url = formObj.action;
			param = $("form[name='"+formObj.name+"']").serializeArray();
		}
	}

	var option = {
		lv_url : url,
		lv_targetDiv : (isNotEmpty(targetId))? targetId : "lay-contents",
		lv_param : param
	};

	// office_common 함수
	fn_comPageLoad(option, callback);
}

/**
 * 첨부파일 Form Submit
 * @param url
 * @param formName
 * @param callback
 */
function fnMultipartSubmit(url, formName, callback){
	var frm = $("form[name='"+formName+"']");
	var options = {
			url : url,
			type:"POST",
			// IE9 이하에서 JSON 이 다운로드 되는 현상
			data : {contentType: 'text/html'},
			dataType : "json",
			beforeSerialize : function(){
			},
			beforeSubmit : function(arr, $form, options){
			},
    		success: function(data, textStatus, jqXHR ) {
    			if (data != null) {
    				if(data.errorCode != "system.success" || data.result.errorCode == "ERROR"){
    					_fnAjaxSuccessMsg(data);
    				}
    				else{
    					if(isEmpty(data.result.errorMessage)){
    						if(callback != null){
	    						if($.isFunction(callback)){
	    							callback(data);
	    						}
	    						else{
	    							eval(callback + '(data);');
	    						}
    						}
    					}
    					else{
	    					fnMessage(data.result.errorMessage,function(){
	    						if(callback != null){
		    						if($.isFunction(callback)){
		    							callback(data);
		    						}
		    						else{
		    							eval(callback + '(data);');
		    						}
	    						}
	    					});
    					}
    				}
    			}
    		},
    		complete : function(jqXHR, textStatus ){

    		},
    		error : function(jqXHR, textStatus, errorThrown ){
    			if(textStatus=="timeout"){
    				alert(lpe_cmm_message_500);
    			}
    		}
		};
	frm.ajaxSubmit(options);
}

/*********************************************************
 * Ajax Json Form
 *
 * @param url
 * @param callback
 * @param formName
 *********************************************************/
function fnAjaxFormSubmit(url, callback, formName){
	jQuery.ajax({
		type: 'post'
		, url: url
		, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		, dataType: 'json'
		, async:false
		, data: $("form[name='"+formName+"']").serializeArray()
		, traditional : true
		, success: function(data) {
			if (data != null) {
				if(data.errorCode != "system.success" || data.result.errorCode == "ERROR"){
					_fnAjaxSuccessMsg(data);
				}
				else{
					if(isEmpty(data.result.errorMessage)){
						if(callback != null){
    						if($.isFunction(callback)){
    							callback(data);
    						}
    						else{
    							eval(callback + '(data);');
    						}
						}
					}
					else{
    					fnMessage(data.result.errorMessage,function(){
    						if(callback != null){
	    						if($.isFunction(callback)){
	    							callback(data);
	    						}
	    						else{
	    							eval(callback + '(data);');
	    						}
    						}
    					});
					}
				}
			}
		}
		, error: function(data, textStatus, errorThrown) {
			alert(lpe_cmm_message_435);
		}
	});
}

/*********************************************************
 * Ajax Json Param
 *
 * @param url
 * @param callback
 * @param obj
 * @param param {name1:value1, name2:value2}
 *********************************************************/
function fnAjaxJsonParam(url, callback, obj, param) {
	jQuery.ajax({
		type: 'post'
		, url: url
		, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		, dataType: 'json'
		, data: param
		, async:false
		, traditional : true
		, success: function(data) {
			if (data != null) {
				if(callback != null){
					if($.isFunction(callback)){
						callback(data, obj, param);
					}
					else{
						eval(callback + '(data, obj, param);');
					}
				}
			} else {
				return false;
			}
		}
		, error: function(data, textStatus, errorThrown) {
			alert(lpe_cmm_message_435);
		}
	});
}

/*********************************************************
 * Ajax Json Param Function
 *
 * @param url
 * @param param {name1:value1, name2:value2}
 * @param callback - function(data){}
 *********************************************************/
function fnAjaxJsonParamFun(url, param, callback, async) {
	return;
  if (!sessionOutFlg){  //세션이 종료되었으면 더이상 서비스 실행하지 않도록 수정=> 스콤은 플레이어 닫을때도 update 서비스를 호출하므로 안내 메시지가 계속 보여져 수정.
  	jQuery.ajax({
  		type: 'get'
  		, url: ctxPath +url
  		, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
  		, dataType: 'jsonp'
  		, data: param
  		, async: (async === false || $.trim(async) === 'false') ? false : true
  		, traditional : true
  		, success: function(data) {
  		  sessionOutFlg = false;
  			if (data != null) {
  				if(callback != null){
  					if($.isFunction(callback)){
  						callback(data);
  					}
  					else{
  						eval(callback + '(data);');
  					}
  				}
  			} else {
  				return false;
  			}
  		}
  		, error: function(data, textStatus, errorThrown) {
  		  var result = jQuery.parseJSON(data.responseText);

  		  switch (data.status) {
  		  case 401:
  		    if (typeof result.resultCode != undefined && result.resultCode == "ESCM018") {
  		      sessionOutFlg = true;
  		      //PC일때
  		      if (!isMobile){
    		      alert(result.resultMsg);
    		      opener.eval("clipCallBack")();
    		      window.close();
  		      }else if (isMobile && osType== "Android"){
  		        window.MyApp.scrmSessionOut(result.resultMsg);
  		      }else if (isMobile && osType == "Ios"){
  		        window.location="jscall://scrmSessionOut"+encodeURIComponent(result.resultMsg);
  		      }
  		    }
  		    break;
  		  default:
  		    break;
  		  }
  			//alert(lpe_cmm_message_435);
  		}
  	});
  }
}

/*********************************************************
 * Ajax Json Msg Param
 *
 * @param url
 * @param callback
 * @param obj
 * @param param {name1:value1, name2:value2}
 *********************************************************/
function fnAjaxJsonMsgParam(url, callback, obj, param) {
	jQuery.ajax({
		type: 'post'
			, url: url
			, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
			, dataType: 'json'
			, data: param
			, async:false
			, traditional : true
			, success: function(data) {
				if (data != null) {
					if(data.errorCode != "system.success" ||  data.result.errorCode == "ERROR"){
						_fnAjaxSuccessMsg(data);
					}
					else{
						if(isEmpty(data.result.errorMessage)){
							if(callback != null){
	    						if($.isFunction(callback)){
	    							callback(data, obj, param);
	    						}
	    						else{
	    							eval(callback + '(data, obj, param);');
	    						}
							}
						}
						else{
	    					fnMessage(data.result.errorMessage,function(){
	    						if(callback != null){
		    						if($.isFunction(callback)){
		    							callback(data, obj, param);
		    						}
		    						else{
		    							eval(callback + '(data, obj, param);');
		    						}
	    						}
	    					});
						}
					}
				} else {
					return false;
				}
			}
		, error: function(data, textStatus, errorThrown) {
			alert(lpe_cmm_message_435);
		}
	});
}

/*********************************************************
 * Ajax
 *
 * @param url
 * @param callback
 * @param obj
 *********************************************************/
function fnAjax(url, callback, obj) {
	jQuery.ajax({
		type: 'post'
		, url: url
		, contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		, dataType: 'json'
		, success: function(data) {
			if (data != null) {
				if(callback != null){
					if($.isFunction(callback)){
						callback(data, obj);
					}
					else{
						eval(callback + '(data, obj);');
					}
				}
			} else {
				return false;
			}
		}
		, error: function(data, textStatus, errorThrown) {
			alert(lpe_cmm_message_435);
		}
	});
}

/*********************************************************
 * Ajax Message Call && Focus
 *
 * @param data
 *********************************************************/
function _fnAjaxSuccessMsg(data){
	var message = (data.errorCode != "system.success") ? data.errorMessage : data.result.errorMessage;
	fnError({message: message, callback : function(){
		if(data.errorArguments != null && data.errorArguments.length > 0){
			try{
				if(data.errorField){
					var field = data.errorField.split("^");
					if(field.length > 1){
						$("[name='"+field[0]+"'").eq(field[1]).focus();
					}
					else{
						$("[name='"+field[0]+"'").focus();
					}
				}
				else if(data.result.errorField){
					$("[name='"+data.result.errorField+"'").focus();
				}
			}
			catch(e){
				alert(e);
			}
		}
	}});
}

/*********************************************************
 * Select Tag Option Reset
 *
 * @param json
 * @param $target - jquery target
 * @param nameCode
 * @param valueCode
 * @param selectedVal
 *********************************************************/
function fnSelectReset(json, $target, nameCode, valueCode, selectedVal){
	// Delete option other than the default
	$target.find('option').filter( "[value!='']" ).remove();
	// Create a new option tag
	if(json != null && json.length > 0){
		for(var index = 0 ; index < json.length ; index++){
			var option = $('<option value="'+json[index][valueCode]+'">').text(json[index][nameCode]);
			if(selectedVal == json[index][valueCode]){
				option.prop({'selected':'selected'});
			}
			$target.append(option);
		}
	}
}

/*********************************************************
 * Window 팝업창 열기
 *
 * @param url
 * @param name
 * @param width
 * @param height
 *********************************************************/
function fnOpenWindow(url, name, width, height){
	try {
		var style = "toolbar=no,status=no,directories=no,scrollbars=yes,location=no,resizable=no,border=0,menubar=no";
		var xpos = (screen.availWidth - width ) / 2;
		var ypos = (screen.availHeight- height ) / 2;
		style = style + ',top=' + ypos + ',left=' + xpos + ',width=' + width + ', height=' + height;
		window.open(url, name , style);
		return true;
	}
	catch (e){
		alert(e);
	}
	return false;
}
/*********************************************************
 * Window 팝업창 열기[]
 *
 * @param url
 * @param name
 * @param width
 * @param height
 *********************************************************/
function fnWindowPopup(viewerName, url, param, callback) {
	var style = "toolbar=no,status=no,directories=no,scrollbars=yes,location=no,resizable=no,border=0,menubar=no";
	var width = '1000';
	var height = '768';
	var xpos = (screen.availWidth - width ) / 2;
	var ypos = (screen.availHeight- height ) / 2;
	style = style + ',top=' + ypos + ',left=' + xpos + ',width=' + width + ', height=' + height;

    var _hiddenFrm  = $("#_popupComFrm");

    if(_hiddenFrm.attr("action")) {
    	_hiddenFrm.attr("action", url);
    	_hiddenFrm.attr("method", "post");
    	_hiddenFrm.attr("target", viewerName);
    	_hiddenFrm.empty();
    } else {
    	_hiddenFrm  = $("<form>").attr({id:"_popupComFrm",action:url, method:"post", target:viewerName});
    	_hiddenFrm.appendTo('body');
    }

    $.each(param, function(key, value){
    	_hiddenFrm.append($("<input>").attr({type:"hidden", name:key, value:value}));
    });

	var viewerObj = window.open("", viewerName, style);
	_hiddenFrm.submit();
	viewerObj.focus();
	return viewerObj;
}

/*********************************************************
 * TAG LIBRARY
 * checkbox
 * 전체를 선택하면 같은 element는 선택해지
 * 하위를 선택하면 전체 element 선택해지
 *********************************************************/
function fnSearchCheckboxStatus(checkedVal, currentElId) {
	if (checkedVal != null && checkedVal != "") {
		// 선택값이 있을 경우 전체 항목의 선택 해지
		if($("#"+currentElId+"0").is(':checked')) {
			$("#"+currentElId+"0").removeAttr('checked');
		}
	} else {
		// 선택값이 없을 경우 전체를 제외한 나머지 항목 선택 해지
		if($("#"+currentElId+"0").is(':checked')) {
			$("#"+currentElId+"0").prop('checked', true);
			$('input:checkbox[name='+currentElId+']').each(function() {
            	$(this).prop("checked", true);
			});
		}
		else {
			$('input:checkbox[name='+currentElId+']:checked').each(function() {
				$(this).removeAttr('checked');
			});
		}
	}
}

/*********************************************************
 * 모든 HTML 태그를 제거함.
 * @param txt
 * @returns
 *********************************************************/
function fnHtmlRemove(obj){
	var text = obj.val();
	obj.val(text.replace(/(<([^>]+)>)/ig,""));
}

/*********************************************************
 * 해당 태그 안에 있는 모든 이미지를 너비를 조정함.
 *
 * 1. 자신보다 너비가 큰 사이즈의 이미지만.
 * @param txt
 * @returns
 *********************************************************/
function fnInnerImgResize($parent){
	$parent.find('img').each(function(){
		$(this).load(function(){
			if($(this).width() > $parent.width()){
				$(this).width($parent.width());
			}
		});
	});
}

/*********************************************************
 * 빈값 체크
 * @param str
 * @returns {Boolean}
 *********************************************************/
function isEmpty(str){
	var obj = String(str);
	obj = $.trim(obj);
	if(obj == null || obj == undefined || obj == 'null' || obj == 'undefined' || obj == '' || obj.length == 0){
		return true;
	}
	else{
		false;
	}
}

/*********************************************************
 * 빈값 체크
 * @param str
 * @returns {Boolean}
 *********************************************************/
function isNotEmpty(str){
	return (isEmpty(str)) ? false : true ;
}

/*********************************************************
 * 부동소수점 숫자인지 음수부호도 포함하여 검사
 * @param str
 * @returns {Boolean}
 *********************************************************/
function isNumber(str){
   var reg = /^[-|+]?\d+\.?\d*$/;
   return reg.test(str);
}

/*********************************************************
 * 타임라인 좌우측 간격 조절
 * @param startTop
 *********************************************************/
function timeLinePostion(startTop){

	var objMargin = 15;
	$('.timeline-listContainer .timeline-list').each(function(index){
		if(index==0){//0번째
			$(this).css('top', '0');
		} else if(index==1){//1번째
			var objTop = objMargin + 35 +"px";
			$(this).css('top', objTop);
		} else if((index%2)==0) {//홀수번째
			var oldPosition1 = $(this).prev().prev().position();
			var oldPosition2 = $(this).prev().position();
			var objTop1 = (oldPosition1.top)+($(this).prev().prev().height())+objMargin;//index-2번째 top값 + index-2번째 height값 + 여백
			var objTop2 = oldPosition2.top+objMargin+35;//index-1번째 top값 + 여백 + 35;
			if(objTop1>objTop2) {
				$(this).css('top',objTop1+'px');
			} else {
				$(this).css('top',objTop2+'px');
			}
		} else if((index%2)==1) {//짝수번째
			var oldPosition1 = $(this).prev().prev().position();
			var oldPosition2 = $(this).prev().position();
			var objTop1 = (oldPosition1.top+$(this).prev().prev().height())+objMargin;//index-2번재 top값 + index-2번째 height값 + 여백
			var objTop2 = oldPosition2.top+objMargin+35;//index-1번째 top값 + 여백 + 35;
			if(objTop1>objTop2) {
				$(this).css('top',objTop1+'px');
			} else {
				$(this).css('top',objTop2+'px');
			}
		}
	});

	if( $('.timeline-list:last-child').length > 0){
		var boxHeight = $('.timeline-list:last-child').position().top+$('.timeline-list:last-child').height();
		$('.timeline-listContainer').css('height', boxHeight+'px');
	}
}

/*********************************************************
 * ArrayList
 *
 * @method length
 * @method get
 * @method add
 * @method addAll - Array, ArrayList
 * @method remove
 * @method clear
 *********************************************************/
function ArrayList(){
	this.array = new Array();
	this.length = function (){
		return this.array.length;
	};
	this.get = function (index){
		return this.array[index];
	};
	this.add = function(obj){
		this.array[this.array.length] = obj;
	};
	this.addAll = function (obj){
		if (obj instanceof Array){
			for (var i=0;i<obj.length;i++){
				this.add(obj[i]);
			}
		}
		else if (obj instanceof ArrayList){
			for (var i=0;i<obj.length();i++){
				this.add(obj.get(i));
			}
		}
	};
	this.remove = function(index){
		this.array = (index<0 || index > this.array.length) ? this.array : this.array.slice(0, index).concat(this.array.slice(index+1, this.array.length));
	};
	this.change = function(oldIndex, newIndex){
		var newArray = new Array();
		for (var i = 0; i< this.array.length; i++){
			if(oldIndex == i){ continue; }
			if( i < newIndex){
				if(oldIndex < i ){
					newArray[i-1] = this.array[i];
				}
				else{
					newArray[i] = this.array[i];
				}
			}
			else {
				if(oldIndex > i ){
					newArray[i+1] = this.array[i];
				}
				else{
					newArray[i] = this.array[i];
				}
			}
		}
		newArray[newIndex] = this.array[oldIndex];
		this.array = newArray;
	};
	this.clear = function(){
		this.array = new Array();
	};
}

/*********************************************************
 * Map
 * Java 에서 사용하던 Map을 Script에서 사용하도록 구현.
 *
 * @method put
 * @method get
 * @method containsKey
 * @method containsValue
 * @method isEmpty
 * @method clear
 * @method remove
 * @method keys
 * @method values
 * @method size
 *********************************************************/
Map = function(){
	 this.map = new Object();
};
Map.prototype = {
	put : function(key, value){
		this.map[key] = value;
	},
	get : function(key){
		if(this.size() == 0)
		return '';
		return this.map[key];
	},
	containsKey : function(key){
		return key in this.map;
	},
	containsValue : function(value){
		for(var prop in this.map){
			if(this.map[prop] == value) return true;
		}
		return false;
	},
	isEmpty : function(){
		return (this.size() == 0);
	},
	clear : function(){
		for(var prop in this.map){
			delete this.map[prop];
		}
	},
	remove : function(key){
		delete this.map[key];
	},
	keys : function(){
		var keys = new Array();
		for(var prop in this.map){
			keys.push(prop);
		}
		return keys;
	},
	values : function(){
		var values = new Array();
		for(var prop in this.map){
			values.push(this.map[prop]);
		}
		return values;
	},
	size : function(){
		var count = 0;
		for (var prop in this.map) {
			count++;
		}
		return count;
	}
};

/*********************************************************
 * 자바스크립트에서 replaceAll효과를 갖는다
 *
 * ex) string.replaceAll(대상문자열, 치환문자)
 *********************************************************/
String.prototype.replaceAll = function (regex,replacement) {
	var r = this; var a = r.split(regex); for(var i=0;i<a.length;i++){r = r.replace(regex,replacement);} return r;
};

/*********************************************************
 * serializeObject
 * @param form
 * @returns json
 *********************************************************/
$.fn.serializeObject = function () {
	var result = {};
	var extend = function (i, element) {
		result[element.name] = element.value;
	};
	$.each(this.serializeArray(), extend);
	return result;
};

/*********************************************************
 * jquery function EnterKey Event
 *
 * @param fnc
 *********************************************************/
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
            	fnc();
                return false;
            }
        });
    });
};

/*********************************************************
 * rowspan
 * USEAGE: $("#테이블ID").rowspan(컬럼순서); //병합하고자 하는 column index를 인자로 넘겨준다.
 * 참조 : http://willifirulais.blogspot.kr/2007/07/jquery-table-column-break.html
 *********************************************************/
$.fn.rowspan = function(colIdx) {
	return this.each(function(){
		var that = null;
		$('tr', this).each(function(row) {
			$('td,th',this).eq(colIdx).each(function(col) {
				if ($(this).html() == $(that).html()) {
					rowspan = $(that).attr("rowSpan");
					if (rowspan == undefined) {
						$(that).attr("rowSpan",1);
						rowspan = $(that).attr("rowSpan");
					}
					rowspan = Number(rowspan)+1;
					$(that).attr("rowSpan",rowspan); // do your action for the colspan cell here
					$(this).hide(); // .remove(); // do your action for the old cell here
				} else {
					that = this;
				}
				that = (that == null) ? this : that; // set the that if not already set
			});
		});
	});
};

/*********************************************************
 * colspan
 * USEAGE:
 * $('table tbody tr:visible').each(function(row) {
 *    $('#table1').colspan(row);
 *     })
 * 참조 : http://willifirulais.blogspot.kr/2007/07/jquery-table-column-break.html
 *********************************************************/
$.fn.colspan = function(rowIdx) {
	return this.each(function(){
		var that=null;
		$('tr', this).filter(":eq("+rowIdx+")").each(function(row) {
			$(this).find('th').filter(':visible').each(function(col) {
				if ($(this).html() == $(that).html()) {
					colspan = $(that).attr("colSpan");
					if (colspan == undefined) {
						$(that).attr("colSpan",1);
						colspan = $(that).attr("colSpan");
					}
					colspan = Number(colspan)+1;
					$(that).attr("colSpan",colspan);
					$(this).hide(); // .remove();
				} else {
					that = this;
				}
				that = (that == null) ? this : that; // set the that if not already set
			});
		});
	});
};

/**
 * Date Formatter
 * @param pattern
 * @returns
 */
Date.prototype.format = function(pattern) {
    if (!this.valueOf()) return "";
    var d = this;
    return pattern.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
 * 금액 표시
 * @returns {String}
 */
Number.prototype.toPrice = function() {
	return String(this).toPrice();
};

/**
 * 문자열 byte 길이
 * @returns
 */
String.prototype.byteLength = function() {
	return this.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
};

/**
 * 금액 표시
 * @returns {String}
 */
String.prototype.toPrice = function() {
	try{
		var str = this.replaceAll(",","");
		if(isNumber(str)){
			// 음수 체크
			var minus = false;
			if(Number(str) < 0 ){
				minus = true;
			}
			// 문자로 변환
			var constant = "";
			var decimal = "";
			var index = str.indexOf(".");
			if(index < 0){
				constant = str.substring(0, str.length).replace(/[^0-9]/gi, '');
			}
			else{
				constant = str.substring(0, index).replace(/[^0-9]/gi, '');
				decimal = str.substring(index, str.length);
			}
			// 상수 포맷
			constant = constant.replace(/./g, function(c, i, a) {
			    return i && c !== "." && !((a.length - i) % 3) ? ',' + c : c;
			});
			return ((minus)?"-":"")+constant+decimal;
		}
		else{
			return "";
		}
	}
	catch(e){
		//alert(e);
	}
};

String.prototype.date = function(pattern){
	try{
		var value = this;
		if(isEmpty(value)){
			return "";
		}
		// 숫자이외 문자제거
		value = value.replace(/[^0-9]/gi, '');
		if(this.length == 14){
			var year = value.substring(0, 4);
			var month = value.substring(4, 6);
			var day = value.substring(6, 8);
			var hours = value.substring(8, 10);
			var minutes = value.substring(10, 12);
			var seconds = value.substring(12, 14);
			var date = new Date(year, Number(month)-1, day, hours, minutes, seconds);
			if(pattern){
				return date.format(pattern);
			}
			else{
				return date.format("yyyy-MM-dd HH:mm:ss");
			}
		} else if(this.length == 8){
			var year = value.substring(0, 4);
			var month = value.substring(4, 6);
			var day = value.substring(6, 8);
			var date = new Date(year, Number(month)-1, day);
			if(pattern){
				return date.format(pattern);
			}
			else{
				return date.format("yyyy-MM-dd");
			}
		}
		return value;
	}
	catch(e){
//		alert(e);
	}
};

/*********************************************************
 * 로그아웃
function fnLogout(){
	fnAjaxJsonParamFun(_CONTEXT_PATH+'/lpm/cmm/login/executeLogout.do', null, function(data){
		fnMessage(lpe_cmm_message_432,function(){
			location.href = _CONTEXT_PATH+'/lpm/cmm/login/login.do?siteId=ST00000001';
		});
	});
}
 *********************************************************/
function fnLogout(){
	fnAjaxJsonParamFun(_CONTEXT_PATH+'/lpm/cmm/login/executeLogout.do', null, function(data){
		fnMessage("로그아웃 되었습니다.", function(){
			location.href = _CONTEXT_PATH+'/lpe/main.do';
		});
	});
}
