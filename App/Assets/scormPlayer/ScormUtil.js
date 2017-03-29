
var SCORM_TRUE = "true";
var SCORM_FALSE = "false";
var SCORM_NO_ERROR = "0";

var lastErr = SCORM_NO_ERROR;
var lastErrString = "";

// SCORM 진도현황
var cmi_data;
//SCORM 진도 업데이트 여부 비교 건수
var SCORM_UPD_NM = 0;
//SCORM 진도 업데이트 여부 반환 비교 건수
var SCORM_UPD_RE_NM = 0;

/**
 * SCORM API 로그
 * @param s
 */
function logwrite(s) {
  try {
    if($.browser.msie){
//      alert(s);
    }
    else{
      //console.log(s);
    }
  } catch (e) {}
}

function SCORMAPI() {}

/**
 * SCORM 뷰어 종료
 */
function playFinish(){
//  window.close();
}


/**
 * SCORM 진도 현황 초기화
 *
 * @param txt : API
 */
function initCMIMap(txt) {
  //logwrite("API : " + txt);

  // CMI 초기화
  cmi_data = new Array();

  var param = {
      chNid : _PLAYER_FRM.chNid.value,
      cntsNid : _PLAYER_FRM.cntsNid.value,
      scrmTocNid : currentCntsTocId
    };

return;
  $.ajax({
    url : ctxPath + _URL_PRGS_STATE_LIST + "?cntsNid="+cntsNid+"&chNid="+chNid,
    type : "GET",
    dataType : "json",
    data : param,
    async : false,
    success : function(data) {
      cmiList = data;
      if(cmiList.length > 0){
        for(var i=0; i<cmiList.length; i++){
          //logwrite("initCMIMap : "+cmiList[i].cmiId + " = " + cmiList[i].cmiVal);
          cmi_data[cmiList[i].cmiId] = cmiList[i].cmiVal;
        }
      }
    },
    error : function(xhr, status, e) {
      alert(e);
    }
  });

}

/**
 * SCORM 진도 현황 저장
 *
 * crsId : 과정ID - default : 0
 * chNid : 차수순번 - default : 0
 * cntsNid : 컨텐츠ID
 * scrmTocNid : 컨텐츠목차ID
 *
 * @param key
 * @param val
 */


function setCMIMap(key, val) {
  SCORM_UPD_NM++;
  var prgsCont = "";
  //기존 swf는 슬라이드별 진도율 체크 불가
  if (typeof(storyPlayer) != "undefined"){
    if (storyPlayer.totalViewSlides > 0){
      var prgsParam = {
          chNid : _PLAYER_FRM.chNid.value,
           cntsNid : _PLAYER_FRM.cntsNid.value
      };
      //진도율 조회
      selectPrgs(prgsParam);
      //진도내용(prgsCont) 셋팅
      makePrgCont();
    }
  }

  var param = {
    chNid : _PLAYER_FRM.chNid.value,
    cntsNid : _PLAYER_FRM.cntsNid.value,
    scrmTocNid : currentCntsTocId,
    cmiId : key,
    cmiVal : val,
    prgsCont : prgData.prgCont
  };

  fnAjaxJsonParamFun(_URL_PRGS_STATE_SAVE, param, function(data){
    if (data.resultCode == "SUCCESS")
      SCORM_UPD_RE_NM++;
  });

  if(!cmi_data) {
    cmi_data = new Array();
  }
  cmi_data[key] = val;

  // 컨텐츠 장/절 이동
  if(key == "adl.nav.request"){
    if(val == "continue"){
      fnScormNext();
    }
    else if(val == "previous"){
      fnScormPre();
    }
  }
}

/**
 * SCORM 진도 현황 조회
 *
 * chNid : 채널 NID - default : 0
 * cntsNid : 컨텐츠NID
 * scrmTocNid : 컨텐츠목차ID
 *
 * @param key
 * @returns
 */
function getCMIMap(key) {

  if(cmi_data){
    var val = cmi_data[key];

    if (key == "cmi.core._children") {
      var fnc = new Array();
      fnc.push(" cmi.core.lesson_location");
      fnc.push("cmi.core.lesson_status");
      fnc.push("cmi.core.session_time");
      fnc.push("cmi.objectives.id");
      fnc.push("cmi.objectives.status");
      fnc.push("cmi.objectives.score");
      fnc.push(" ");
      val=  fnc.join(' ');
    }
    // SkillSoft
    else if (key == "cmi.objectives._children") {
      var fnc = new Array();
      fnc.push("cmi.objectives.id");
      fnc.push("cmi.objectives.status");
      fnc.push("cmi.objectives.score");
      fnc.push(" ");
      val=  fnc.join(' ');
    }
    else{
      if(key == "cmi._version"){
        val = "1.0";
      } else if(key.indexOf("completion_status") > -1 && !val){
        val = "not attempted";
      } else if(key == "cmi.learner_name" && !val){
        val = "";
      } else if(key == "cmi.learner_id" && !val){
        val = "";
      } else if(key == "Commit"){
        val = "true";
      }else if(key == "cmi.scaled_passing_score" && !val){
        val = "";
      } else if(key == "cmi.success_status" && !val){
        val = "";
      } else if(key == "cmi.location" && !val){
        val = 0;
      } else if(key == "cmi.entry"){
        if(cmi_data["cmi.completion_status"]){
          val = "resume";
        } else {
          val = "ab-inito";
        }
      } else if(key == "cmi.core.score.raw" && !val){
        val = 0;
      }else if(key == "cmi.score.raw" && !val){
        val = 0;
      }else if(!key){
        val = "unknown";
      }
    }
    return val == undefined ? "": val;
  }
  return "";
}

/**
 * SCORM 미디어 URL
 *
 * @param key
 * @returns
 */
function getScoMediaURL(key){
  var xmlhttp = null;
  var xmlDoc = null;

  // code for IE7+, Firefox, Chrome, Opera, Safari
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  }
  // code for IE6, IE5
  else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      xmlDoc = xmlhttp.responseXML;
    }
  };
  xmlhttp.open("GET", $.trim(cntsPath) + "cicmanifest.xml", false);
  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xmlhttp.send();

  xmlDoc = xmlhttp.responseXML;

  // IE8에서 responseXML 정상적으로 처리 되지 않음.
  if(!xmlDoc.hasChildNodes()){
    xmlDoc = getXmlDoc(xmlhttp);
  }

  var fileList = xmlDoc.getElementsByTagName("file");
  var result = "";

  for(var i = 0 ; i < fileList.length ; i++){
    var file = fileList.item(i);

    var attrId = -1;
    var attrType = -1;
    var attrHref = -1;

    for(var j = 0 ; j < file.attributes.length ; j++){
      if(file.attributes[j].name == "identifier"){
        attrId = j;
      }
      else if(file.attributes[j].name == "type"){
        attrType = j;
      }
      else if(file.attributes[j].name == "href"){
        attrHref = j;
      }
    }

    if(attrId > -1 && attrHref > -1){
      if(file.attributes[attrId].name == "identifier" && file.attributes[attrId].value == key){
        if(attrType > -1){
          if(file.attributes[attrType].value == "cic"){
            result = getContentsMediaURL($.trim(file.attributes[attrHref].value));
          }
          else if(file.attributes[attrType].value == "url"){
            result = file.attributes[attrHref].value;
          }
        }
        else {
          result = getContentsMediaURL($.trim(file.attributes[attrHref].value));
        }
      }
    }

    if(isNotEmpty(result)){
      break;
    }
  }
  return result;
}

/**
 *
 * @param xmlhttp
 * @returns
 */
function getXmlDoc(xmlhttp){
  var txt = xmlhttp.responseText;
  if (window.DOMParser) {
      xmlDoc = new DOMParser().parseFromString(txt,"text/xml");
  }
  else // Internet Explorer
  {
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(txt);
  }
  return xmlDoc;
}

/**
 * CMS 미디어 URL
 *
 * @param cntsNid
 * @returns {String} data.result.mediaServerFullUrl
 */
function getContentsMediaURL(cntsNid){
  var result = "";
  fnAjaxJsonParamFun(_URL_MEDIA, {cntsNid:cntsNid}, function(data){
    if(data.errorCode == "system.success"){
      result = data.result.mediaServerFullUrl;
    }
    else{
      alert(data.errorMessage);
    }
  });
  return result;
}

/*
 * 진도율 조회
 * */
function selectPrgs(param){
  callSelectPrgs(param.cntsNid, param.chNid, function(data) { // 진도율 조회
    setPrgs(data);
  }, "Y");
}

function setPrgs(data){
  var totalSlides = storyPlayer.totalViewSlides;
  var compSlides = storyPlayer.completeSlidesViewed;

  if (data == null) {
    prgData.prgCont = makeDefalultPrgs(totalSlides, prgData.prgOffsetTime);
  } else {
    if (data.prgsCont == null) {
      prgData.prgCont = makeDefalultPrgs(totalSlides, prgData.prgOffsetTime);
    } else {
      prgData.prgCont = data.prgsCont;
    }
  }
}

function makePrgCont() {
  var rst = "";
  var cont = prgData.prgCont;
  var index = storyPlayer.completeSlidesViewed;

  for(var x = 1 ; x <= index; x++){
    if (cont.charAt(x - 1) != 'Y') {
      rst = cont.substr(0, x - 1) + 'Y';
      if (x < cont.length) {
        rst += cont.slice(x);
      }
      cont= rst;
    } else {
      rst = cont;
    }
  }

  for(var i = rst.length; i < storyPlayer.totalViewSlides; i++) {
    rst += 'N';
  }

  prgData.prgCont = rst;

}
