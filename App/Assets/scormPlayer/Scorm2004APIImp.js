//SCORM interface instance
/**
 * SCORM 2004
 */
var API_1484_11 = new SCORMAPI();

SCORMAPI.prototype.Initialize = function(param) {
	logwrite("-----------------------------------------------");
	logwrite("Initialize : " + param);
	initCMIMap('Scorm2004API');
	return SCORM_TRUE;
};

SCORMAPI.prototype.Terminate = function(param) {
	logwrite("Terminate : " + param);
	logwrite("-----------------------------------------------");
	playFinish();
	return SCORM_TRUE;
};

SCORMAPI.prototype.GetValue = function(key) {
	var val = getCMIMap(key);
	logwrite("GetValue : "+key+" = "+ val);
	return val;
};

SCORMAPI.prototype.SetValue = function(key, val) {
	setCMIMap(key, val);
	return SCORM_TRUE;
};

SCORMAPI.prototype.GetLastError = function() {
//	logwrite("GetLastError : OK");
	return lastErr;
};

SCORMAPI.prototype.GetErrorString = function(param) {
	logwrite("GetErrorString : " + param);
	return lastErrString;
};

SCORMAPI.prototype.GetDiagnostic = function(param) {
	logwrite("GetDiagnostic : " + param);
	return "";
};

SCORMAPI.prototype.Commit = function(param) {
	logwrite("Commit : " + param);
	return SCORM_TRUE;
};
