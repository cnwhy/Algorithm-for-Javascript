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
 * @param {any} p 
 * @returns 
* */
function re_any(json,n,maps,p){
	var maps_nonext,nonext,isnomext,ismap;

	var mark_code;
	for(n; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(!utils.isEmptChar(code)){
			mark_code = code;
			break;
		}
	}
	
	if(maps){
		maps_nonext = [];
		for(var i=0; i<maps.length;){
			var map = maps[i];
			if(map.map.length === 0){
				maps_nonext.push(map)
				maps.splice(i,1);
			}else{
				i++;
			}
		}
		ismap = maps && maps.length >0;
		isnomext = maps_nonext && maps_nonext.length > 0;
		if(!ismap && !isnomext && !p){
			return -1;
		}
		nonext = (function(on){
			if(!isnomext) return function(){};
			return function(n){
				var str = json.substring(on,n+1);
				// var val = str;
				var val = utils.runEval(str);
				// var val = JSON.parse(str);
				maps_nonext.forEach(function(v){
					v.val = val;
				})
			}
		})(n)
	}
	var nextp = p || isnomext;
	var on = n;
	if(mark_code === utils.CODE.S){
		n = utils.re_string(json,n);
	}else if(mark_code === utils.CODE.A_S){
		n = re_array(json,n,maps,nextp)
		// n = re_array(json,n,maps)
	}else if(mark_code === utils.CODE.O_S){
		n = re_json(json,n,maps,nextp)
		// n = re_json(json,n,maps)
	}else if(utils.isNumberChar(mark_code)){
		n = utils.re_number(json,n)
	}else{
		n = utils.re_other(json,n)
	}
	nonext && nonext(n);
	// global.MK += 1;
	return n;
}

function re_json(json,n,maps,p){
	var mark = 0,key;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(utils.isEmptChar(code)) continue;
		if(mark === 0 || mark === 3){
			if(code === utils.CODE.O_E) return n; //对像结束;
		}
		if(mark === 0 || mark === 4){
			if(code !== utils.CODE.S) throw new Error("JSON 格式错误,"+n+"字符期望`\"`结果为:",String.fromCharCode(code));
			var on = n;
			n = utils.re_string(json,n);
			// key = json.substring(on+1,n);
			key = utils.getString(json.substring(on+1,n));
			// key = utils.runEval(json.substring(on,n+1));
			mark = 1;
		}else if(mark === 1){
			if(code !== utils.CODE.M) throw new Error("JSON 格式错误,"+n+"字符期望`:`结果为:",String.fromCharCode(code));
			mark = 2;
		}else if(mark === 2){
			// var _maps = filterKey(key);
			var _obj = filterKey(key);
			n = re_any(json,n,_obj.maps,p || _obj.mark);
			if(!_obj.mark && !p) return;
			mark = 3;
		}else if(mark === 3){
			if(code !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",String.fromCharCode(code));
			mark = 4;
		}
	}
}

function re_array(json,n,maps,p){
	var i = 0,mark=0;
	var filterKey = fn_filterKey(maps);
	for(n++; n<json.length; n++){
		var code = json.charCodeAt(n);
		if(utils.isEmptChar(code)) continue;
		if(mark === 0 || mark === 1){
			if(code === utils.CODE.A_E) return n; //数组结束;
		}
		if(mark === 0 || mark === 2){
			var _obj = filterKey(i);
			n = re_any(json,n,_obj.maps,p || _obj.mark);
			if(!_obj.mark && !p) return;
			mark = 1;
		}else if(mark === 1){
			if(code !== utils.CODE.SP) throw new Error("JSON 格式错误,"+n+"字符期望`,`结果为:",char);
			mark = 2;
			i++;
		}
	}
}

module.exports = jsonGet;