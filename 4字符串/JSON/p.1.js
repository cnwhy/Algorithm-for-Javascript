"use strict";
	var parse = function(json,_reviver){
		var result;
		
		var obj = parse.prototype;
		obj.json = json;
		obj.max = json.length;
		// obj.reviver = _reviver;
		obj.at = -1;
		obj.next();

		result = obj.re_any();
		return result;

		obj.nextUnEmpty();
		if(obj.ac === obj.ac) obj.error("unexpectedly"); //完整解析后还有飞空字符 报错
		return (typeof reviver === "function") ? walk({"": result}, "") : result;
	}

	function walk(holder, key) {
		var k;
		var v;
		var val = holder[key];
		if (val && typeof val === "object") {
			for (k in val) {
				if (Object.prototype.hasOwnProperty.call(val, k)) {
					v = walk(val, k);
					if (v !== undefined) {
						val[k] = v;
					} else {
						delete val[k];
					}
				}
			}
		}
		return reviver.call(holder, key, val);
	}

	var tool = {}
	tool.strTabChar = {
		// "48": "\0", // JSON 标准中没有,移除
		// "39": "\'", // JSON 标准中没有,移除
		"34": "\"",
		"92": "\\",
		"47": "/",
		"110": "\n",
		"114": "\r",
		// "118": "\v", // JSON 标准中没有,移除
		"116": "\t",
		"98": "\b",
		"102": "\f"
	}
	tool.isEmptChar = function(code) {
		return code <= 32;
	}
	tool.isNumberCharFirst = function(code) { // 0~9,-
		return code === 45 || (code >= 48 && code <= 57);
	}
	tool.isNumberChar = function(code) { // 0~9,+,-,.,E,e
		//43 45 46 69 101
		// return (tool.isNumberCharFirst(code) 
		return ((code === 45 || (code >= 48 && code <= 57))
			|| code === 43
			|| code === 46
			|| code === 69
			|| code === 101
			);
	}

	parse.prototype = (function(){

		function next(obj) {
			if (++obj.at >= obj.max) obj.error("max")
			return obj.ac = obj.json.charCodeAt(obj.at);
		}

		function re_string() {
			var self = this;
			var val = "",json = this.json;
			var si = this.at + 1, //正常字符启始位置
				sl = 0; //正常字符长度
			this.next();
			while (this.ac !== 34) {
				if (this.ac == 92) {
					var hex_leng, code, char;
					this.next();
					hex_leng = this.ac == 117 ? 4 : 0;
					if (hex_leng) {
						if (this.at + hex_leng >= this.max) error('max');
						code = Number("0x" + json.substr(this.at + 1, hex_leng));
						if (code !== code) error('invalid');
						char = String.fromCharCode(code);
						this.at += hex_leng;
					} else {
						char = tool.strTabChar[this.ac]
						if (!char) error('invalid');
					}
					if (sl) val += json.substr(si, sl); //拼接之前的正常字符
					val += char; //接上转义后的字符
					sl = 0;
					si = this.at + 1;
				} else {
					sl++;
				}
				this.next();
			}
			if (sl) val += json.substr(si, sl);
			return val;
		}

		function re_string_(){
			var val = "",ac,code,char,
				self = this,
				max = self.max,
				i = self.at,
				si = i+1, //正常字符启始位置
				sl = 0; //正常字符长度
			// var sarr = [];
			while(++i<max){
				ac = self.json.charCodeAt(i) //用code会快一点
				if(ac === 34) {
					if(sl) val += self.json.substr(si,sl);
					self.at = i;
					return val;
				}
				if(ac !== 92){
					sl++;
					continue;
				}
				
				if(++i>=max) self.error("max");
				ac = self.json.charCodeAt(i);

				switch(ac){
					case 34 :
						char = "\""
						break;
					case 47 :
						char = "/"
						break;
					case 92 :
						char = "\\"
						break;
					case 110 :
						char = "\n"
						break;
					case 114 :
						char = "\r"
						break;
					case 116 :
						char = "\t"
						break;
					case 98 :
						char = "\b"
						break;
					case 102 :
						char = "\f"
						break;
					case 117:
						if(i+4 >= max) self.error("max");
						code = Number("0x"+self.json.substr(i+1,4));
						if(isNaN(code)) self.error("invalid");
						char = String.fromCharCode(code);
						i+=4;
						break;
					default:
						self.error("invalid");
				}

				// if(ac === 47){
				// 	char = "/"
				// }else if(ac === 117){
				// 	if(i+4 >= max) self.error("max");
				// 	code = Number("0x"+self.json.substr(i+1,4));
				// 	if(isNaN(code)) self.error("invalid");
				// 	char = String.fromCharCode(code);
				// 	i+=4;
				// }else{
				// 	char = strTabChar[ac];
				// 	if(!char) self.error("invalid");
				// }
				if(sl) val += self.json.substr(si,sl); //拼接之前的正常字符
				val += char; //接上转义后的字符
				sl = 0;
				si = i+1;
			}
			self.error("max");
		}

		function re_number() {
			var val, _n = this.at;
			while (tool.isNumberChar(this.next())) {}
			val = Number(this.json.substring(_n, this.at));
			this.at--;
			// ac = " ";
			return val
		}

		function re_number() {
			var val, _n = this.at;
			while (tool.isNumberChar(this.next())) {}
			val = Number(this.json.substring(_n, this.at));
			this.at--;
			// ac = " ";
			return val
		}

		function re_other() {
			var v, val, sp = 0;
			var json = this.json;
			if ((v = json.substr(this.at, 4)) === "true") {
				this.at += 3;
				return true;
			}
			if (v === "null") {
				this.at += 3;
				return null;
			}
			if (json.substr(this.at, 5) === "false") {
				this.at += 4;
				return false;
			}
			this.error('value');
		}

		function re_array() {
			var val = [];
			this.nextUnEmpty();
			if (this.ac === 93) {
				return val;
			}
			while (this.ac) {
				val.push(this.re_any())
				this.nextUnEmpty();
				if (this.ac === 93) {
					return val;
				}
				if (this.ac !== 44) this.error('unexpectedly');
				this.nextUnEmpty();
			}
			this.error('max')
		}

		function re_object() {
			var mark = 0,
				key;
			var val = {};
			this.nextUnEmpty();
			if (this.ac === 125) {
				return val;
			}
			while (this.ac) {
				if (this.ac !== 34) this.error('unexpectedly');
				key = this.re_string();
				this.nextUnEmpty();
				if (this.ac !== 58) this.error('unexpectedly');
				this.nextUnEmpty();
				val[key] = this.re_any();
				this.nextUnEmpty();
				if (this.ac === 125) {
					return val;
				}
				if (this.ac !== 44) this.error('unexpectedly');
				this.nextUnEmpty();
			}
			this.error('max');
		}

		function re_any() {
			if (tool.isEmptChar(this.ac)) this.nextUnEmpty();
			switch (this.ac) {
				case 34:
					return this.re_string();
				case 91:
					return this.re_array();
				case 123:
					return this.re_object();
				case 45:
					return this.re_number();
				default:
					return tool.isNumberCharFirst(this.ac) ?
						this.re_number() :
						this.re_other();
			}
		}

		return {
			error: function(type){
				if(type == "max"){
					throw new SyntaxError("JSON意外结束");
				}else if(type == "unexpectedly"){
					throw new SyntaxError('位置 ' + this.at + ' 出现意外字符 ' + String.fromCharCode(this.ac));
				}else if(type == "invalid"){
					throw new SyntaxError('位置 ' + this.at + ' 转义无效');
				}else if(type == "value"){
					throw new SyntaxError('位置 ' + this.at + ' 值无效');
				}
			},
			next : function() {
				if (++this.at >= this.max) this.error("max")
				this.ac = this.json.charCodeAt(this.at);
				return this.ac
			},
			nextUnEmpty : function() { //跳过空字符
				var json = this.json;
				do {
					this.ac = json.charCodeAt(++this.at)
				} while (tool.isEmptChar(this.ac))
			},
			re_string:re_string_,
			re_number:re_number,
			re_other:re_other,
			re_array:re_array,
			re_object:re_object,
			re_any:re_any
		}
	}());

module.exports = parse;