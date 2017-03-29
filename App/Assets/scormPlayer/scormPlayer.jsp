<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="msg" uri="/WEB-INF/tlds/msgTag.tld"%>
<%@ taglib prefix="common" uri="/WEB-INF/tlds/commonTag.tld"%>

<c:set var="ctxPath" value="${pageContext.request.contextPath}" scope="page" />
<c:set var="jsPath" value="${ctxPath}/js/cms/eco/ply/epub" />
<c:set var="imgPath" value="${ctxPath}/img/cms/epub" />
<c:set var="resData" value="${result}" />

<html lang="ko" class="no-js">
<!--<![endif]-->
<head>
<title>Scorm Viewer</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

<link rel="stylesheet" type="text/css" href="${ctxPath}/css/cmm/eco/jquery-ui-custom.css" />
<link rel="stylesheet" type="text/css" href="${ctxPath}/css/cms/scorm/nanoscroller2.css" />
<link rel="stylesheet" type="text/css" href="${ctxPath}/css/cms/scorm/scorm_jtree.css" />
<link rel="stylesheet" type="text/css" href="${ctxPath}/css/cms/plyr_common.css" />

<script type="text/javascript">
  var cmiList = JSON.parse('<common:script value="${resData.cmiList}" />');
  cmi_data = new Array();

  for ( var x in cmiList){
    cmi_data[cmiList[x].cmiId] = cmiList[x].cmiVal;
  }   
  var cntsPath = '<common:script value="${resData.cntsFilePathNm}" />';
  var ctxPath = '<common:script value="${ctxPath}" />';
  var osType =  '<common:script value="${resData.osType}" />';
  console.log("osType : "+osType);
</script>

<script type="text/javascript" src="${ctxPath}/js/act/qpp/lib/jquery-1.8.3.min.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/act/qpp/lib/jquery-ui-custom.min.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/jquery.jstree.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/jquery.nanoscroller.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/util.jstree.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/WebUtil.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/ScormUtil.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/Scorm1.2APIImp.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/scorm/Scorm2004APIImp.js" charset="utf-8"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/prg/prg_common.js"></script>
<script type="text/javascript" src="${ctxPath}/js/cms/eco/ply/plyr_common.js"></script>
<script type="text/javascript" src="${jsPath}/vo/epubPrgData.js"></script>

<script type="text/javascript">
  var storyPlayer;
  var notExistContentMsg = '<msg:message code="msg.cms.eco.ply.001" javaScriptEscape="true"/>';
  var closeBeforeMsg = '<msg:message code="msg.cms.eco.ply.069" javaScriptEscape="true"/>';
  
  var _PLAYER_FRM;
  var prgData = new EpubPrgData();
  
  var _URL_PRGS_STATE_SAVE = ctxPath + '<common:script value="/cms/eco/scm/scorm/updateScormPrgs.do"/>';
  var _URL_PRGS_STATE_LIST = ctxPath + '<common:script value="/cms/eco/scm/scorm/selectScormPrgs.do"/>';
  var _URL_MEDIA = ctxPath + '<common:script value="/lpm/cms/cnts/selectScormMediaUrl.do"/>';

//세션 종료 여부
  var sessionOutFlg = false;
  
  // 진행중인 컨텐츠 목차 ID
  var currentCntsTocId = '<common:script value="${resData.doingCntsTocNid}" />';
  
  //  강의계획서 트리
  var jsonData = '';
  if('${resData.cmsCntsTocList}'!=''){
    jsonData = JSON.parse('<common:script value="${resData.cmsCntsTocList}" />');
  }else{
    alert(notExistContentMsg);
    window.open("", "_self").close();
  }   

  //닫을때 리프레시
  var callbackFn = '${callbackFn}';
  window.onunload = playerCloseForCallBackCnts;
  function playerCloseForCallBackCnts() {
    try {
      if (callbackFn != null && callbackFn != "") {
        opener.eval(callbackFn)();
      }
    } catch (e) {
    }
  }
  
  var cntsWdth = '<common:script value="${resData.width}" />';
  var cntsHeight = '<common:script value="${resData.height}" />';
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  $(window).load(function () {
    
    if (!isMobile && cntsWdth != null && cntsHeight != null && cntsWdth != "" && cntsHeight != "" && cntsWdth > 0 && cntsHeight > 0){
      var mw;
      var mh;
      mw = window.outerWidth - window.innerWidth;
      mh = window.outerHeight - window.innerHeight;
      window.resizeTo(parseInt(cntsWdth)+mw, parseInt(cntsHeight)+mh);
    }
  });
  //윈도우창 닫힐때
  //스콤 진도율 비동기화 방식으로 인해 진도율 완료되기 전에 창 닫히지 못하도록 수정
  if (!isMobile){
   $(window).bind("beforeunload", function(e){
    if (!sessionOutFlg && SCORM_UPD_NM != SCORM_UPD_RE_NM){
      return closeBeforeMsg;
    }
  }); 
  }
  
  $(document).ready(function() {
    _PLAYER_FRM = document.cntsPlayerForm;

    var viewHeight = $(window).height();
    var menuHeight = viewHeight - $(".menu_tit").outerHeight() - 30;

    $(".menu_wrap .meun_list").css("height", menuHeight + "px");
    $(".btn_menu").css("top", ((viewHeight - $(".btn_menu").height()) / 2) + "px");
    //$("#contentFrame").css("height", viewHeight + "px");
    if (jsonData == null || jsonData == "") {
      alert(notExistContentMsg);
      window.open("", "_self").close();
      return;
    }
    _TREE = new UtilTree("cntsPlayerForm", "treeDiv", null, 3, null, null, jsonData);
    _TREE.init(null, null, "fnSelect", "fnLoaded");

    $(".btn_close").bind('click', function() {
      $(".btn_menu").show();
      $(".menu_wrap").toggle("slide", {
        direction : 'left'
      });
    });

    $(".btn_menu").bind('click', function() {
      $(".menu_wrap").toggle("slide", {
        direction : 'left'
      }, function() {
        $(".btn_menu").hide();
      });
    });

    // 노드 Text가 개행될 경우 전체 영역이 선택 되도록 수정.

    var css_string = "";
    css_string += ".jstree a { height:auto; color:white; line-height: 25px; max-width: 200px; white-space: normal !important; word-wrap: break-word;}";

    $.vakata.css.add_sheet({
      str : css_string,
      title : "jstree"
    });
    
    //loading Bar
    $(".plyrloadingbox").splusLoader().show() ;
  });

  // jstree load complete call function
  function fnLoaded(data) {
    $("#treeDiv").find("ul:first-child").addClass("nano-content");
    $("ul.nano-content").css({
      "margin" : "10px 0 10px 10px",
      "padding-right" : "10px"
    });

    $('.nano').nanoScroller({
      preventPageScrolling : true
    });

    if (currentCntsTocId > 0) {
      $("#treeDiv").jstree("select_node", "#" + currentCntsTocId);
    } else {

      var startNode;
      $("#treeDiv").find("a").each(function() {
        var cntsUrl = _TREE.getJson($(this), "cntsUrl");
        if (isNotEmpty(cntsUrl)) {
          startNode = $(this);
          currentCntsTocId = $(this).attr("id");
          return false;
        }
      });
      $("#treeDiv").jstree("select_node", startNode);
    }
  }

  // 장/절 선택
  function fnSelect(data) {
    var cntsUrl = _TREE.getData(data, "cntsUrl");
    if (isNotEmpty(cntsUrl)) {
      currentCntsTocId = _TREE.getData(data, "scrmTocNid");
      $(".btn_menu").show();
      if ($(".menu_wrap").is(':visible')) {
        $(".menu_wrap").toggle("slide", {
          direction : 'left'
        });
      }
      cntsUrl = encodeURI(cntsPath + cntsUrl);
      $(".plyrloadingbox").splusLoader('destroy').empty().hide();
      $("#contentFrame").attr('src', cntsUrl);
    }
    return;
  }

  // 이전 장/절 이동
  function fnScormPre() {
    var preCntsTocId = "";
    $("#treeDiv").find("a").each(function() {
      var cntsUrl = _TREE.getJson($(this), "cntsUrl");
      if (isNotEmpty(cntsUrl)) {
        if (currentCntsTocId == $(this).attr("id")) {
          return false;
        }
        preCntsTocId = $(this).attr("id");
      }
    });
    //첫장 체크
    if (preCntsTocId > 0) {
     // alert('첫장?');
    }
    if (preCntsTocId > 0) {
      $("#treeDiv").jstree("deselect_node", "#" + currentCntsTocId);
      $("#treeDiv").jstree("select_node", "#" + preCntsTocId);
    }
    return false;
  }

  // 다음 장/절 이동
  function fnScormNext() {
    var isNextCntsTocId = false;
    var nextCntsTocId = "";
    $("#treeDiv").find("a").each(function() {
      var cntsUrl = _TREE.getJson($(this), "cntsUrl");
      if (isNotEmpty(cntsUrl)) {
        if (isNextCntsTocId) {
          nextCntsTocId = $(this).attr("id");
          return false;
        }
        if (currentCntsTocId == $(this).attr("id")) {
          isNextCntsTocId = true;
        }
      }
    });
    //마지막 장 체크
    if (nextCntsTocId > 0) {
     // alert("마지막장?")
    }
    if (nextCntsTocId > 0) {
      $("#treeDiv").jstree("deselect_node", "#" + currentCntsTocId);
      $("#treeDiv").jstree("select_node", "#" + nextCntsTocId);
    }
    return false;
  }
  
  $(function(){
    $("#contentFrame").load(function(){
      if ($.isFunction($("#contentFrame").get(0).contentWindow.GetPlayer)){
        storyPlayer = $("#contentFrame").get(0).contentWindow.GetPlayer();
      }
    });
  });
  
</script>
</head>
<body oncontextmenu='return false' style="overflow: hidden;">
  <form name="cntsPlayerForm" method="post">
    <input type="hidden" name="cntsNid" value="<c:out value="${param.cntsNid}"/>" /> <input type="hidden" name="chNid" value="<c:out value="${param.chNid}" default="0"/>" />
  </form>

  <%-- SCORM 컨텐츠 목차 JSTREE --%>
  <c:set var="twrap_style" value="visibility: hidden;"></c:set>
  <div class="wrap" style="<c:out value="${twrap_style}"/>">
    <!-- 
        <a href="#" class="btn_menu">open</a>
         -->
    <div class="menu_wrap" style="display: none;">
      <div class="menu_bg"></div>
      <div class="menu">
        <p class="menu_tit">
          <c:out value="${resData.cntsTitle}" />
        </p>
        <div id="treeDiv" class="meun_list nano tree_menu btntype jstree">
          <div class="nano-pane">
            <div class="nano-slider" style="height: 20px; -webkit-transform: translate(0px, 0px);"></div>
          </div>
        </div>
      </div>
      <a href="#" class="btn_close">닫기</a>
    </div>
  </div>

  <div id="plyrloading" class='plyrloadingbox' >
  </div>
  
  <%-- 컨텐츠 뷰어 --%>
  <div>
    <%--<iframe id="contentFrame" name="contentFrame" marginwidth="0" marginheight="0" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>--%>
    <iframe id="contentFrame" name="contentFrame" marginwidth="0" marginheight="0" frameborder="0" style="width:100%; height:100%; position: absolute;" scrolling="no"></iframe>
  </div>
</body>
</html>