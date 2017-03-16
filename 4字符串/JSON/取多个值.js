"use strict";
var utils = require('./utils');

function jsonGet(json,paths){
	var n = 0;
	var maps = [];
	if(Array.isArray(paths)){
		paths.forEach(function(v){
			maps.push({
				map:utils.pathFormat(v),
				val:undefined
			});
		})
	}else{
		maps.push({
			map:utils.pathFormat(paths),
			val:undefined
		});
	}
	re_any(json,n,maps.slice(0));
	var reval = [];
	if(Array.isArray(paths)){
		maps.forEach(function(v){
			reval.push(v.val)
		})
		return reval;
	}else{
		return maps[0].val;
	}
}

function fn_filterKey(maps){
	if(!maps || maps.length <=0) return function(){return {maps:null,mark:0};}
	var M = [],mark = 0;
	function sM(key){
		for(var i=M.length; i--;){
			var m = M[i];
			if(m.key == key) return m;
		}
	}
	maps.forEach(function(map){
		var key = map.map[0];
		var vM = sM(key);
		if(vM){
			vM.val.push(map);
		}else{
			mark++;
			M.push({key:key,val:[map]})
			// M[key] = [map]
		}
	})
	return function(key){
		var obj = sM(key);
		if(obj){
			obj.val.forEach(function(v){
				v.map.shift();
			})
			mark--;
			return {maps:obj.val,mark:mark};
		}else{
			return {maps:null,mark:mark};
		}
	}
}

/**
 * 搜寻任意类型
 * 
 * @param {any} json 
 * @param {any} n 
 * @param {any} maps 
 * @param {any} p 反回模式 0:无要求 1:要i 2:要val
 * @returns 
* */

function re_any(json,n,maps,p){
	var re;
	var maps_nonext,nonext,isnomext,ismap;
	if(maps){
		maps_nonext = []; //取一层path的对像
		for(var i=0; i<maps.length;){
			var map = maps[i];
			if(map.map.length === 0){
				maps_nonext.push(map)
				maps.splice(i,1);
			}else{
				i++;
			}
		}
		ismap = maps.length > 0; //是否还有下一层
		isnomext = maps_nonext.length > 0; //这一层是否要取值
		if(!ismap && !isnomext && !p){
			return;
		}
		nonext = (function(on){
			if(!isnomext) return function(){};
			return function(re){
				maps_nonext.forEach(function(v){
					v.val = re[1];
				})
			}
		})(n)
	}
	var nextp;  //下一层的取值模式情况
	if(p >= 2 || isnomext){
		nextp = 2;
	}else{
		nextp = p ? 1 : 0;
	}
	
	var on = n;
	var mark_code;
	for(n; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(!utils.isEmptChar(code)){
			mark_code = code;
			break;
		}
	}
	if(mark_code === utils.CODE.S){
		re = utils.re_string(json,n,null,nextp == 2);
	}else if(mark_code === utils.CODE.A_S){
		re = re_array(json,n,maps,nextp)
		// n = re_array(json,n,maps)
	}else if(mark_code === utils.CODE.O_S){
		re = re_object(json,n,maps,nextp)
		// n = re_object(json,n,maps)
	}else if(utils.isNumberCharFirst(mark_code)){
		re = utils.re_number(json,n,nextp == 2)
	}else{
		re = utils.re_other(json,n,nextp == 2)
	}
	nonext && nonext(re);
	// global.MK += 1;
	return re;
}

function re_object(json,n,maps,p){
	var mark = 0,key;
	var re_val = p == 2 ? {} : undefined;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(utils.isEmptChar(code)) continue;
		if(mark === 0 || mark === 3){
			if(code === utils.CODE.O_E) return [n,re_val]; //对像结束;
		}
		if(mark === 0 || mark === 4){
			if(code !== utils.CODE.S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(code));
			var on = n;
			var restr = utils.re_string(json,n,null,true)
			n = restr[0]
			key = restr[1]
			// n = utils.re_string(json,n)[0];
			// key = json.substring(on+1,n);
			// key = utils.getString(json.substring(on+1,n));
			// key = utils.runEval(json.substring(on,n+1));
			mark = 1;
		}else if(mark === 1){
			if(code !== utils.CODE.M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(code));
			mark = 2;
		}else if(mark === 2){
			// var _maps = filterKey(key);
			var _obj = filterKey(key);
			var nextp = p == 2 ? 2 : _obj.mark ? 1 : p;
			var reany = re_any(json,n,_obj.maps,nextp);
			n = reany[0]
			if(!_obj.mark && !p) return [];
			if(re_val) re_val[key] = reany[1];
			mark = 3;
		}else if(mark === 3){
			if(code !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(code));
			mark = 4;
		}
	}
}

function re_array(json,n,maps,p){
	var i = 0,mark=0;
	var re_val = p == 2 ? [] : undefined;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(utils.isEmptChar(code)) continue;
		if(mark === 0 || mark === 1){
			if(code === utils.CODE.A_E) return [n,re_val]; //数组结束;
		}
		if(mark === 0 || mark === 2){
			var _obj = filterKey(i);
			var nextp = p == 2 ? 2 : _obj.mark ? 1 : p;
			var re = re_any(json,n,_obj.maps,nextp);
			// if(!re) console.log(n,_obj.maps,nextp);
			n = re[0]
			if(!_obj.mark && !p) return [];
			if(re_val) re_val.push(re[1]);
			mark = 1;
		}else if(mark === 1){
			if(code !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}
	}
}

module.exports = jsonGet;