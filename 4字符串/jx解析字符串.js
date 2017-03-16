//用正则会比较简单
function getString_reg(str){
	var strTab = {
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
	var reg = /\\([\\0'"nrvtbf]|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2})/g
	return str.replace(reg,function(v){
		if(v.length<=2){
			return strTab[v.substr(1)] || v;
		}else{
			return String.fromCharCode(parseInt(v.substr(2),16));
		}
	})
}

//遍历一次解析速度快,支持错误判断
function getString_code(str){
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
	var nstr = "",
		si=0, //正常字符启始位置
		sl=0; //正常字符长度
		
	for(var i=0,n=str.length; i<n; i++){
		var c = str.charCodeAt(i) //用code会快一点
		if(c == 92){ // 92 >> \
			var c1   // 下一个字符的code
				,hex_leng // Unicode 待读取16进制编码的长度
				,code // 转义后的字符code
				,char // 转义后的字符
			if(sl) nstr += str.substr(si,sl);
			if(++i>=n) throw new SyntaxError("Invalid or unexpected token");
			c1 = str.charCodeAt(i);
			hex_leng = c1 == 117 ? 4 : c1 == 120 ? 2 : 0; // 117 >> u , 120 >> x 
			if(hex_leng){
				if(i+hex_leng >= n) throw new SyntaxError("Invalid Unicode escape sequence");
				code = Number("0x"+str.substr(i+1,hex_leng));
				// console.log(str.substr(i+1,hex_leng),code);
				if(isNaN(code)) throw new SyntaxError("Invalid Unicode escape sequence");
				char = String.fromCharCode(code);
				i+=hex_leng;
			}else{
				char = strTabChar[c1] || String.fromCharCode(c1);
			}
			nstr += char;
			sl = 0;
			si = i+1;
		}else{
			sl++;
		}
	}
	if(sl) nstr += str.substring(si);
	return nstr;
}
var str = '1\\"\\x22\\u0022'
console.log(getString_reg(str))
console.log(getString_code(str))