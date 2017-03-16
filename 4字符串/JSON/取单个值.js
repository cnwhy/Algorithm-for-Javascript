"use strict";
var utils = require('./utils');
function jsonGet(json,path){
	var n = 0;
	var maps = utils.pathFormat(path);
	// console.log(maps);
	for(var i = 0; i<maps.length; i++){
		var key = maps[i];
		n = search(json,n,key);
		if(n == -1) return undefined;
	}
	return value_any(json,n);
}

function search(json,start,map){
	var mark;
	var type_mark;
	for(var i=start; i<json.length; i++){
		var char = json.charCodeAt(i);
		if(!utils.isEmptChar(char)){
			type_mark = char;
			break;
		}
	}
	if(char === utils.CODE.O_S){
		re_json(json,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}else if(char === utils.CODE.A_S){
		re_array(json,i,function(key,last){
			if(key == map){
				mark = last;
				return true;
			}
		})
	}
	return mark || -1;
}

function re_any(json,n){
	var type_mark;
	for(n; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(!utils.isEmptChar(char)){
			type_mark = char;
			break;
		}
	}
	if(type_mark === utils.CODE.S){
		n = utils.re_string(json,n)[0];
	}else if(type_mark === utils.CODE.A_S){
		n = re_array(json,n)
	}else if(type_mark === utils.CODE.O_S){
		n = re_json(json,n)
	}else if(utils.isNumberChar(type_mark)){
		n = utils.re_number(json,n)[0]
	}else{
		n = utils.re_other(json,n)[0]
	}
	return n;
}

function value_any(json,n){
	var str = json.substring(n,re_any(json,n)+1);
	// return str;
	return eval('('+str+')')
}

function re_json(json,n,cb){
	cb = typeof(cb) == "function" ? cb : null;
	var isKey = 0;
	var key;
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(utils.isEmptChar(char)) continue;
		if(isKey === 0 || isKey === 3){
			if(char === utils.CODE.O_E) return n; //对像结束;
		}
		if(isKey === 0 || isKey === 4){
			if(char !== utils.CODE.S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(char));
			var on = n;
			n = utils.re_string(json,n)[0];
			// key = json.substring(on+1,n);
			key = utils.getString(json.substring(on+1,n));
			// key = utils.runEval(json.substring(on,n+1));
			isKey = 1;
		}else if(isKey === 1){
			if(char !== utils.CODE.M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(char));
			isKey = 2;
		}else if(isKey === 2){
			if(cb && cb(key,n)){
				return n;
			}
			n = re_any(json,n);
			isKey = 3;
		}else if(isKey === 3){
			if(char !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(char));
			isKey = 4;
		}
	}
}

function re_array(json,n,cb){
	var i = 0,mark=0;
	cb = typeof(cb) == "function" ? cb : null;
	for(n++; n<json.length; n++){
		var char = json.charCodeAt(n);
		if(utils.isEmptChar(char)) continue;
		if(mark === 0 || mark === 1){
			if(char === utils.CODE.A_E)return n; //数组结束;
		}
		if(mark === 0 || mark === 2){
			if(cb && cb(i,n)){
				return n;
			}
			n = re_any(json,n);
			mark = 1;
		}else if(mark === 1){
			if(char !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}
	}
}
module.exports = jsonGet;
