
var getModifiedText = function (templateStr, replacementJSON) {
    return outsideToken(templateStr, "", 0, replacementJSON);
};

exports.getModifiedText = getModifiedText;

var outsideToken = function(str, newStr, index, replacement) {
    chr = str.charAt(index);
    while(chr != '!' && index < str.length) {
	newStr += chr;
	chr = str.charAt(++index);
    }
    if(index >= str.length) return newStr;
    result = tokenCandidate(str, newStr, index + 1, replacement);
    return outsideToken(str, result.str, result.index + 1, replacement);
};

var tokenCandidate = function(str, newStr, index, replacement) {
    if(index >= str.length) return;
    chr = str.charAt(index);
    if(chr == '!')  {
	return insideToken(str, newStr, index + 1, replacement);
    }
    newStr += "!" + chr;
    return {'str': newStr, 'index': index};
    

};

var insideToken = function(str, newStr, index, replacement) {
    if(index >= str.length) return;
    chr = str.charAt(index);
    token = "";
    while(chr != '!') {
	token += chr;
	chr = str.charAt(++index);
    }
    // TODO: Errorhandling
    token = replacement[token];
    return {'str': newStr + token, 'index': index};
};