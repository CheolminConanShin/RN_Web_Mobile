//VIDOE_PLAYER_TYPE_01 = "flash";
//VIDOE_PLAYER_TYPE_02 = "html";

var CntsType = {
  VIDEO : "CNT01",
  AUDIO : "CNT02",
  TEXTBOOK : "CNT03",
  SYNCBOOK : "CNT04",
  SCORM : "CNT05",
  EPUB : "CNT06",
  SKILLSOFT : "CNT07"
}

var PlyrConstants = {
  popupViewerName : "viewerComp"
}

var commonPlayer = {
  openClip : function(obj) {
    var url = ctxPath + "/cms/eco/clp/clip/selectClip.view";
    obj.isPopup = false;
    commonPlayer.openPopup(obj, url);
  },
  openPlayer : function(obj) {
    var url = ctxPath + "/cms/eco/ply/player/selectPlayer.view";
    obj.isPopup = true;
    commonPlayer.openPopup(obj, url);
  },
  openLivePlayer : function(obj) {
    var url = ctxPath + "/cms/eco/ply/player/selectLivePlayer.view";
    obj.isPopup = true;
    commonPlayer.openPopup(obj, url);
  },
  openWebcam : function(obj) {
    var url = ctxPath + "/lms/sbj/lch/LiveChannel/broadcasterWebcamPopup.view";
    obj.isPopup = true;
    commonPlayer.openPopup(obj, url);
  },
  openStreamPopup : function(obj) {
    var url = ctxPath + "/lms/sbj/lch/LiveChannel/broadcasterStreamPopup.view";
    obj.isPopup = true;
    commonPlayer.openPopup(obj, url);
  },
  openPopup : function(obj, url) {

    var viewerName = PlyrConstants.popupViewerName == window.name ? viewerName = "viewerCompChild" : PlyrConstants.popupViewerName;
    var sendForm = document.createElement("form");

    sendForm.target = viewerName;
    obj.isExplorer = commonPlayer.isExplorer();

    for ( var name in obj) {
      sendForm.appendChild(commonPlayer.makeElement(name, obj[name]));
    }
    sendForm.appendChild(commonPlayer.makeElement("popType", "win"));

    sendForm.appendChild(commonPlayer.makeElement("playerType", commonPlayer.setDefaultVal(obj.playerType, "html")));
    document.body.appendChild(sendForm);
    

    var sizeObj = commonPlayer.getSizeObjByType(obj);
    // 라이브채널 채팅 있을 경우 사이즈 변경
    if(obj.chatSupYn == "Y"){
      sizeObj.width = 1080,
      sizeObj.height = 545;
    }
    
    var left = Math.ceil((window.screen.width / 2) - (sizeObj.width / 2));
    var top = Math.ceil((window.screen.height / 2) - (sizeObj.height / 2));

    var resizable = (commonPlayer.setDefaultVal(obj.resizable, true) == "N") ? "no" : "yes";
    var option = "location=no, directories=no, resizable=" + resizable + ", status=no, toolbar=no, menubar=no, width=" + sizeObj.width + ", height="
        + sizeObj.height + " , left=" + left + ", top=" + top + ",scrollbars=yes";
    var viewerObj = window.open("", viewerName, option);
    sendForm.method = "post";
    sendForm.action = url;
    sendForm.submit();
    viewerObj.focus();

    return viewerObj;
  },
  isExplorer : function() {
    var result = "N";
    if (navigator.userAgent.toLowerCase().indexOf("windows")) {
      var agent = navigator.userAgent;
      var regExp = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
      result = -1 != agent.toLowerCase().indexOf("msie") || regExp.exec(agent) ? "Y" : "N"
    }
    return result;
  },
  makeElement : function(name, val) {
    var element = document.createElement("input");
    element.name = name;
    element.type = "hidden";
    if (name == "callbackFn")
      val = commonPlayer.setDefaultVal(val, "");
    element.value = val;

    return element;
  },
  setDefaultVal : function(val, defaultVal) {
    val = (val && val != '' && val != 'undefined' && isNaN(val)) ? val : defaultVal;
    return val;
  },
  getSizeObjByType : function(obj) {
    var result = {};
    switch (obj.cntsTypCd) {
    case CntsType.VIDEO:
      result.width = 791, result.height = 527;
      break;
    case CntsType.AUDIO:
      result.width = 1145, result.height = 578;
      break;
    case CntsType.TEXTBOOK:
      result.width = 791, result.height = 527;
      break;
    case CntsType.SYNCBOOK:
      result.width = 1050, result.height = 528;
      break;
    case CntsType.SCORM:
      result.width = 1350, result.height = 830;
      break;
    case CntsType.EPUB:
      result.width = 1335, result.height = 830;
      break;
    case CntsType.SKILLSOFT:
      result.width = 1350, result.height = 790;
      break;
    default:
      result.width = 1080, result.height = 700
    }
    return result;
  }
}

$.fn.splusLoader = function(option) {
  if($(this).size() == 0) {
    return $(this) ;
  }
  
  if ($(this)[0].splusLoader !== undefined || (option || '') == 'destroy') {
    clearInterval($(this)[0].splusLoader);
    $(this).find('.plyrsplus_loader').remove();
    $(this).find('#plyrloaderBg').remove();
    $(this).hide();
    $(this)[0].splusLoader = undefined;
    return $(this);
  }

  $(this)[0].splusLoader = undefined;

  var totalFrame = 8;
  var frameTime = parseInt(800 / totalFrame);
  var template = '<div class="plyrsplus_loader"><span id="plyrloader_graphic" class="graphic_01"/></div><div id="plyrloaderBg"></div>';
  $(this).append(template);

  var $loader = $(this).find('.plyrsplus_loader');
  var $imgObj = $loader.find('#plyrloader_graphic');

  if ($(this)[0].nodeName === 'BODY') {
    $loader.addClass('fixed');
  }

  var animateLoader = function() {
    var imgClass = $imgObj.attr('class');
    var classPrefix = imgClass.substring(0, imgClass.indexOf('_') + 1);
    var frameIdx = parseInt(imgClass.substring(imgClass.indexOf('_') + 1, imgClass.indexOf('_') + 3));
    if (frameIdx < totalFrame) {
      frameIdx++;
      if (frameIdx < 10)
        frameIdx = '0' + frameIdx;
    } else {
      frameIdx = '01';
    }
    $imgObj.attr('class', classPrefix + frameIdx);
  };

  $(this)[0].splusLoader = setInterval(animateLoader, frameTime);
  $(this).show();
  
  return $(this);
}