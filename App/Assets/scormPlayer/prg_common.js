// 진도율 공통
/**
 * dgyu.kim 14.11.12
 * 
 */
var prgsUpdateUrl = "/cms/eco/prg/prgsMng/updatePrgs.do";

/**
 * public 기본 진도율 String값 생성 (ex: NNNNNNNNNN)
 */
function makeDefalultPrgs(totalTime, offsetTime) {
  totalTime = parseInt(Math.floor(totalTime));
  var prgsStr = "";
  var len = Math.ceil(totalTime / offsetTime);
  var i = 0;
  while (i < len) {
    i++;
    prgsStr += "N";
  }
  return prgsStr;
}

/**
 * public 진도율 업데이트
 */
function updatePrgs(cntsNid, chNid, prgsDataCont, time, offsetTime) {
  var index = Math.floor(time);
  if (index % offsetTime == 0 && index != 0) {
    index = index / offsetTime;
    var prgsChar = prgsDataCont.charAt(index - 1);
    if (prgsChar != 'Y') {
      prgsDataCont = prgsDataCont.substr(0, index - 1) + 'Y' + prgsDataCont.slice(index);
    }
    callUpdatePrgs(cntsNid, chNid, prgsDataCont, time);
  }
  return prgsDataCont;
}

/**
 * public 이어보기 Index 값 조회
 */
function getResumeIndex(playCmptYn, fstNotPlayTime, offsetTime) {
  var resumeTime;
  if (playCmptYn == "Y" || playCmptYn == null) { // 끝까지 다봤음
    resumeTime = 0;
  } else {
    resumeTime = fstNotPlayTime * offsetTime;
  }
  return resumeTime;
}

/**
 * public 진도율 조회
 */
function callSelectPrgs(cntsNid, chNid, callbackFunc, prgsSaveYn) {
  $.ajax({
    url : ctxPath + prgsSelectUrl + "?" + "cntsNid="+cntsNid+"&chNid="+chNid,
    type : "GET",
    data : {
      cntsNid : cntsNid,
      chNid : chNid,
      prgsSaveYn : prgsSaveYn
    }, // 무조건 '0'으로 전달
    dataType : "jsonp",
    async : false,
    success : function(data) {
      if (data == null) {
        rslt = {};
      }
      callbackFunc(data);
    }
  });
}

/**
 * private 진도율 데이타 서버 전송
 */
function callUpdatePrgs(cntsNid, chNid, prgsCont, lastPlayLocFgr, strLocFgr, endLocFgr) {
  var sendParam = {};
  sendParam.cntsNid = cntsNid;
  sendParam.prgsCont = prgsCont;
  sendParam.chNid = chNid;
  sendParam.lastPlayLocFgr = lastPlayLocFgr;
  sendParam.strLocFgr = strLocFgr;
  sendParam.endLocFgr = endLocFgr;
  $.ajax({
    url : "http://localhost:8080" + prgsUpdateUrl,
    type : "get",
    data : sendParam,
    dataType : "jsonp",
    async : false,
    success : function(json) {
      if (json.resultCode == 'system.success') {

      } else {

      }
    }
  });
}