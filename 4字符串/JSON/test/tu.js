var utils = require("../utils");

var parse = function(json){
	return utils.re_any(json,0,true)[1];
}
// console.log(utils.re_string('"1\\"\\x22\\u0022"',0,null,0))
// console.log(["data","config_data","base",10,"cname"])
// console.log(utils.pathFormat('data["config_data"].base[10][\'cname\']'))
// console.log(utils.re_number('a',0,1))
//console.log(parse('{  "a"   :   {"b":[{"c":"hello","d":"word"},123,"123"],"e":null,"f":true,"g":false}}'))

var max = 1000000
var tool = {}
var plus = tool.plus = function(s){
	return s+"1";
}

function f1(){
	var k = "";
	function fn(a){
		for(var i =0; i<max; i++){
			a = plus(a);
		}
		return a;
	}
	k = fn(k);
};

function f2(){
	var k = "",k1 = "";
	function fn(a,tool){
		for(var i =0; i<max; i++){
			a = tool.plus(a);
		}
		return a;
	}
	k = fn(k,tool);
};

if(1){
	var tb = Date.now();
	f1();
	console.log(Date.now() - tb);
}
if(1){
	var tb = Date.now();
	f2();
	console.log(Date.now() - tb);
}