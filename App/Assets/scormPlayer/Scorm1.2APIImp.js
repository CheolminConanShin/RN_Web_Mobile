//SCORM interface instance
/**
 * SCORM 1.2
 */
var API = new SCORMAPI();

SCORMAPI.prototype.LMSInitialize = function(param) {
	logwrite("-----------------------------------------------");
	logwrite("LMSInitialize : " + param);
	initCMIMap('Scorm1.2API');
	return SCORM_TRUE;
};

SCORMAPI.prototype.LMSFinish = function(param) {
	logwrite("LMSFinish : " + param);
	logwrite("-----------------------------------------------");
	playFinish();
	return SCORM_TRUE;
};

SCORMAPI.prototype.LMSGetValue = function(key) {
	var val = getCMIMap(key);
	logwrite("LMSGetValue : "+key+" = "+ val);
	return val;
};

SCORMAPI.prototype.LMSSetValue = function(key, val) {
	setCMIMap(key, val);
	return SCORM_TRUE;
};

SCORMAPI.prototype.setSCOID = function(val) {
	setCMIMap("scoId", val);
	return SCORM_TRUE;
};

SCORMAPI.prototype.LMSGetLastError = function() {
//	logwrite("LMSGetLastError : OK");
	return lastErr;
};

SCORMAPI.prototype.LMSGetErrorString = function(param) {
	logwrite("LMSGetErrorString : " + param);
	return lastErrString;
};

SCORMAPI.prototype.LMSGetDiagnostic = function(param) {
	logwrite("LMSGetDiagnostic : " + param);
	return "";
};

SCORMAPI.prototype.LMSCommit = function(param) {
	logwrite("LMSCommit : " + param);
	return SCORM_TRUE;
};
