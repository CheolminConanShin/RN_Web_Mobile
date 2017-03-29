/*---------------------------------------
epub Progress Data Vo
페이지에 대한 기본정보

@author dgyu.kim
@since 2.0.0
-----------------------------------------*/

function EpubPrgData(){
  this.prgCont = "";
  this.prgOffsetTime = 1;
  this.playCmptYn = "N";
  this.fstNotPlayTime = 0;
}
function getCurrentPrgs(page){
  var prgs;
  
  if (prgData.prgCont != null && prgData.prgCont != "") {
    prgs = prgData.prgCont.substr(page - 1, 1);
  }
  return prgs;
}
