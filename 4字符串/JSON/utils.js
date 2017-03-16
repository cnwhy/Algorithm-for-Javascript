"use strict";

var runEval = exports.runEval = function(str){
	return eval('('+str+')');
};


var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;



(function(){
	console.log(runEval);
/**
 * 常用字符的Code值
 */
var CODE = exports.CODE = {
	S : 34 // "
	,S_D : 39 // '
	,A_S : 91 // [
	,A_E : 93 // ]
	,O_S : 123 // {
	,O_E : 125 // }
	,SP : 44 // ,
	,XG : 92 // \
	,M : 58 // :
	,D : 46 // .
}

/**
 * 判断是否为空字符的code
 * 
 * @param {Int} code 
 * @returns {Boolean}
 */
var isEmptChar = exports.isEmptChar = function(code){
	if(code == 32 || (code <= 13 && code >= 9)) return true;
	return false;
}
/**
 * 判断是否为0到9的code
 * 
 * @param {Int} code 
 * @returns {Boolean}
 */
var is0to9Char = exports.is0to9Char = function(code){ // 0~9
	return (code >= 48 && code <= 57);
}

/**
 * 判断是否为数字code (0~9,-,.)
 * 
 * @param {Int} code 
 * @returns {Boolean}
 */
var isNumberChar = exports.isNumberChar = function(code){ // 0~9,-,.
	return (code >= 45 && code <= 57);
}

var strTabChar = {
	"0" : "\0",
	"'" : "\'",
	"\"" : "\"",
	"\\" : "\\",
	"n" : "\n",
	"r" : "\r",
	"v" : "\v",
	"t" : "\t",
	"b" : "\b",
	"f" : "\f"
}
var strTabChar = {
	"48" : "\0",
	"39" : "\'",
	"34" : "\"",
	"92" : "\\",
	"10" : "\n",
	"13" : "\r",
	"11" : "\v",
	"9" : "\t",
	"8" : "\b",
	"12" : "\f"
}

var getString = exports.getString = function getString(str){
	var nstr = "",si=0,sl=0;
	for(var i=0,n=str.length; i<n; i++){
		var s = str.charCodeAt(i);
		if(s == 92){ // \ >> 92
			if(sl) nstr += str.substr(si,sl);
			if(++i>=n) throw new SyntaxError("Invalid or unexpected token");
			var ns = str.charCodeAt(i),char,hex_leng;
			hex_leng = ns == 117 ? 4 : ns == 120 ? 2 : 0; // u >> 117  x >> 120
			if(hex_leng){
				if(i+hex_leng >= n) throw new SyntaxError("Invalid Unicode escape sequence");
				var code = Number("0x"+str.substr(i+1,hex_leng));
				// var code = +("0x"+str.substr(i+1,hex_leng));
				console.log(str.substr(i+1,hex_leng),code);
				if(isNaN(code)) throw new SyntaxError("Invalid Unicode escape sequence");
				char = String.fromCharCode(code);
				i+=hex_leng;
			}else{
				char = strTabChar[ns] || String.fromCharCode(ns);
			}
			// nstr += str.substring(si,ei) + char;
			nstr += char;
			sl = 0;
			si = i+1;
		}else{
			sl++;
		}
	}
	if(sl) nstr += str.substring(si);
	return nstr;
	// var arg = /\\([\\0'"nrvtbf]|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})/g
	// return str.replace(arg,function(v){
	// 	return v;
	// 	// console.log(v);
	// 	if(v.length<=2){
	// 		return strTab[v.substr(1)] || v;
	// 	}else{
	// 		return String.fromCharCode(parseInt(v.substr(2),16));
	// 	}
	// })
}


//没什么用,存一下写的几个正则
function pathFormat_old(path){
	// var REG_SPL = /\.|(?=\[)/,
	var REG_SPL = /["']?\]\[["']?|\.\[["']?|["']?\]\.|\.|\[["']?|["']?\]/,
		REG_I = /^\[(\d+)\]$/,
		REG_KEY = /^\[(['"])(([^\\]|\\.)*?)\1\]$/
	var maps = path ? path.split(REG_SPL) : [];
	if(maps[0] == "") maps.sift();
	if(maps[maps.length-1] == "") maps.pop();
	return maps;
	// // DEBUG && console.log(maps);
	// for(var i = 0; i<maps.length; i++){
	// 	var key = maps[i];
	// 	var exec;
	// 	if(exec = REG_I.exec(key)){
	// 		n = search(json,n,+exec[1]);
	// 	}else if(exec = REG_KEY.exec(key)){
	// 		n = search(json,n,exec[2]);
	// 	}else{
	// 		n = search(json,n,key);
	// 	}
	// 	if(n == -1) break;
	// }
}

/**
 * 把json值的路径转成数组
 * 
 * @param {String} path 
 * @returns {Array}
 */
var pathFormat = exports.pathFormat = function(path){
	var maps = [];
	if(!path) return maps;
	function getsp(n,cb){
		for(n;n<path.length;n++){
			var char = path.charCodeAt(n);
			if(char === CODE.D || char === CODE.A_S) return n-1;
		}
		return n-1;
	}
	var S=0;
	for(var i=0; i<path.length; i++){
		var char = path.charCodeAt(i);
		if(S === 0){
			if(char === CODE.D) throw Error("path wrong format!");
		}
		if(S === 0 || S === 2){
			if(char === CODE.A_S){
				var oi = ++i;
				char = path.charCodeAt(i);
				if(char === CODE.S || char === CODE.S_D){
					i = re_string(path,i,char);
					// maps.push(path.substring(oi+1,i));
					maps.push(getString(path.substring(oi+1,i)));
					// maps.push(runEval(path.substring(oi,i+1)));
				}else if(is0to9Char(char)){
					i = re_number(path,i);
					maps.push(+path.substring(oi,i+1));
					// maps.push(runEval(path.substring(oi,i+1)));
				}else{
					throw new Error("path wrong format!");
				}
				S = 1;
				continue;
			}else if(char === CODE.D){
				var oi = ++i;
				i = getsp(i);
				maps.push(path.substring(oi,i+1));
				S = 2;
				continue;
			}
		}
		if(S === 0){
			var oi = i;
			i = getsp(i);
			maps.push(path.substring(oi,i+1));
			S = 2;
		}
		if(S === 1){
			if(char === CODE.A_E){
				S = 2
			}
		}
	}
	return maps;
}

var re_string = exports.re_string = function(json,n,sp){
	sp = sp || CODE.S;
	for(var i = n+1; i<json.length; i++){
		var char = json.charCodeAt(i);
		if(char === CODE.XG){
			i++;
		}else if(char === sp){
			return i;
		}
	}
}

var re_number = exports.re_number = function(json,n){
	var mark_f,mark_s,mark_d;
	for(var i = n+1; i<json.length; i++){
		var code = json.charCodeAt(i);
		if(!isNumberChar(code)) return i-1;
	}
}

var re_other = exports.re_other = function(json,n){
	var v,k;
	if((v = json.substr(n,4)) === "true" || v === "null") return n+3;
	if((k = json.substr(n,5)) === "false") return n+4;
	throw new Error('json string wrong format! at ',n.toString());
}
})()