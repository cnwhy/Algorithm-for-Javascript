"use strict";

var runEval = exports.runEval = function(str){
	return eval('('+str+')');
};

(function(){
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
	return code <= 32;
}



var is0to9Char = exports.is0to9Char = function(code){ // 0~9,-
	return (code >= 48 && code <= 57);
}

/**
 * 判断是否为数字表示识 0~9,-  注:json中不能为+号开头 与JSON类保持一至
 * 
 * @param {Int} code 
 * @returns {Boolean}
 */
var isNumberCharFirst = exports.isNumberCharFirst = function(code) { // 0~9,-
	return code === 45 || (code >= 48 && code <= 57);
}

/**
 * 判断是否为数字code (0~9,-,.)
 * 
 * @param {Int} code 
 * @returns {Boolean}
 */
var isNumberChar = exports.isNumberChar = function(code) { // 0~9,+,-,.,E,e
	//43 45 46 69 101
	// return (tool.isNumberCharFirst(code) 
	return ((code === 45 || (code >= 48 && code <= 57))
		|| code === 43
		|| code === 46
		|| code === 69
		|| code === 101
		);
}

//JS 转义表
var strTabChar_JS = {
	"48": "\0",
	"39": "\'",
	"34": "\"",
	"92": "\\",
	"47": "/",
	"110": "\n",
	"114": "\r",
	"118": "\v",
	"116": "\t",
	"98": "\b",
	"102": "\f"
}

//JSON转义表
var strTabChar = JSON.parse(JSON.stringify(strTabChar_JS));
delete strTabChar["48"]  // JSON 标准中没有,移除
delete strTabChar["39"]  // JSON 标准中没有,移除
delete strTabChar["118"] // JSON 标准中没有,移除


function error(type){
	if(type == "max"){
		throw new SyntaxError("JSON意外结束");
	}else if(type == "unexpectedly"){
		throw new SyntaxError('位置 ' + at + ' 出现意外字符 ' + String.fromCharCode(ac));
	}else if(type == "invalid"){
		throw new SyntaxError('位置 ' + at + ' 转义无效');
	}else if(type == "value"){
		throw new SyntaxError('位置 ' + at + ' 值无效');
	}
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

var getString = exports.getString = function(str){
	var nstr = "",
		si=0, //正常字符启始位置
		sl=0; //正常字符长度
	for(var i=0,n=str.length; i<n; i++){
		var c = str.charCodeAt(i) //用code会快一点
		if(c == 92){ // 92 >> \
			var c1   // 下一个字符的code
				,hex_leng // Unicode 待读取16进制编码的长度
				,code // 转义后的字符code
				,char; // 转义后的字符
			if(++i>=n) throw new SyntaxError("Invalid or unexpected token");
			c1 = str.charCodeAt(i);
			hex_leng = c1 == 117 ? 4 : c1 == 120 ? 2 : 0; // 117 >> u , 120 >> x 
			if(hex_leng){
				if(i+hex_leng >= n) throw new SyntaxError("Invalid Unicode escape sequence");
				code = Number("0x"+str.substr(i+1,hex_leng));
				if(isNaN(code)) throw new SyntaxError("Invalid Unicode escape sequence");
				char = String.fromCharCode(code);
				i+=hex_leng;
			}else{
				char = strTabChar[c1] || String.fromCharCode(c1);
			}

			if(sl) nstr += str.substr(si,sl); //拼接之前的正常字符
			nstr += char; //接上转义后的字符
			sl = 0;
			si = i+1;
		}else{
			sl++;
		}
	}
	if(sl) nstr += str.substr(si,sl);
	return nstr;
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
					var re = re_string(path,i,char,true);
					i = re[0];
					// maps.push(path.substring(oi+1,i));
					maps.push(re[1]);
					// maps.push(runEval(path.substring(oi,i+1)));
				}else if(is0to9Char(char)){
					var re = re_number(path,i,true);
					i = re[0];
					maps.push(re[1]);
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

var re_string = exports.re_string = function(json,i,sp,p){
	var val,max = json.length;
	sp = sp || CODE.S; //字符串标识符 默认双引号
	if(p){
		var si=i+1, //正常字符启始位置
			sl=0; //正常字符长度
		val = ""
		while(++i<max){
			var c = json.charCodeAt(i) //用code会快一点
			if(c == sp) {break;}
			if(c == CODE.XG){ // 92 >> \
				var c1   // 下一个字符的code
					,hex_leng // Unicode 待读取16进制编码的长度
					,code // 转义后的字符code
					,char; // 转义后的字符
				if(++i>=max) throw new SyntaxError("Invalid or unexpected token");
				c1 = json.charCodeAt(i);
				hex_leng = c1 == 117 ? 4 : 0; // 117 >> u , 120 >> x 
				if(hex_leng){
					if(i+hex_leng >= max) throw new SyntaxError("Invalid Unicode escape sequence");
					code = Number("0x"+json.substr(i+1,hex_leng));
					if(isNaN(code)) throw new SyntaxError("Invalid Unicode escape sequence");
					char = String.fromCharCode(code);
					i+=hex_leng;
				}else{
					char = strTabChar[c1] || String.fromCharCode(c1);
					if(!char) throw new SyntaxError("Invalid Unicode escape sequence");
				}
				if(sl) val += json.substr(si,sl); //拼接之前的正常字符
				val += char; //接上转义后的字符
				sl = 0;
				si = i+1;
			}else{
				sl++;
			}
		}
		if(sl) val += json.substr(si,sl);
	}else{
		while(++i<max){
			var char = json.charCodeAt(i);
			if(char === CODE.XG){
				i++;
			}else if(char === sp){
				break;
			}
		}
	}
	return [i,val];
}

var re_number = exports.re_number = function(json,i,p){
	var _n = i,val;
	while(++i<json.length){
		var code = json.charCodeAt(i);
		if(!isNumberChar(code)){
			break;
		}
	}
	// return [i,p?runEval(json.substring(_n,i+1)):null]
	if(p){
		val = Number(json.substring(_n,i))
	}
	return [--i,val]
}

var re_other = exports.re_other = function(json,n){
	var v;
	if((v = json.substr(n,4)) === "true") return [n+3,true];
	if(v === "null") return [n+3,null];
	if(json.substr(n,5) === "false") return [n+4,false];
	throw new Error('json string wrong format! at ',n.toString());
}

var re_array = exports.re_array = function re_array(json,i,p){
	var k = 0,mark=0;
	var re_val = p ? [] : undefined;
	while(++i<json.length){
		var code = json.charCodeAt(i);
		if(isEmptChar(code)) continue;
		if(mark === 0 || mark === 1){
			if(code === CODE.A_E) return [i,re_val]; //数组结束;
		}
		if(mark === 0 || mark === 2){
			var re = re_any(json,i,p);
			i = re[0]
			if(p) re_val[k] = re[1];
			mark = 1;
		}else if(mark === 1){
			if(code !== CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			k++;
		}
	}
	throw new Error("意外结束")
}

var re_object = exports.re_object = function re_object(json,n,p){
	var mark = 0,key;
	var re_val = p ? {} : undefined;
	while(++n<json.length){
		var code = json.charCodeAt(n);
		if(isEmptChar(code)) continue;
		if(mark === 0 || mark === 3){
			if(code === CODE.O_E) return [n,re_val]; //对像结束;
		}
		if(mark === 0 || mark === 4){
			if(code !== CODE.S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(code));
			var on = n;
			var restr = re_string(json,n,null,true)
			n = restr[0]
			key = restr[1]
			mark = 1;
		}else if(mark === 1){
			if(code !== CODE.M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(code));
			mark = 2;
		}else if(mark === 2){
			var reany = re_any(json,n,p);
			n = reany[0]
			if(re_val) re_val[key] = reany[1];
			mark = 3;
		}else if(mark === 3){
			if(code !== CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(code));
			mark = 4;
		}
	}
	throw new Error("意外结束");
}

var re_any = exports.re_any = function(json,n,p){
	var on = n;
	var mark_code;
	for(n; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(!isEmptChar(code)){
			mark_code = code;
			break;
		}
	}
	if(mark_code === CODE.S){
		return re_string(json,n,null,p);
	}else if(mark_code === CODE.A_S){
		return re_array(json,n,p)
	}else if(mark_code === CODE.O_S){
		return re_object(json,n,p)
	}else if(isNumberCharFirst(mark_code)){
		return re_number(json,n,p)
	}else{
		return re_other(json,n,p)
	}
}

var parse =  exports.parse = function(json){
	return re_any(json,0,true)[1];
}

})()