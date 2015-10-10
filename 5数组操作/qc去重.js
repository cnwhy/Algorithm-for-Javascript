function unique(arr,funab){
	var _arr = arr.slice(0);
	var _fun = typeof funab == "function" ? funab : function(a,b){return a === b;}
	for(var i=0,leng=_arr.length; i<leng-1; i++){
		var _v = _arr[i];
		for(var n=i+1; n<leng;){
			//console.log(_v,_arr[n]);
			if(_fun(_v,_arr[n])){
				_arr.splice(n,1);
				leng--;
			}else{
				n++;
			}
		}
	}
	return _arr;
}

unique([1,"1",true,null,NaN,1,"1",true,null,NaN]) 
// >> [1, "1", true, null, NaN, NaN]

//自定义对比规则
unique([1,"1",true,null,NaN,1,"1",true,null,NaN,NaN],function(a,b){
	var c = a === b;
	if(c) return true;
	if(isNaN(a) && isNaN(b)) return true;
	return false;
})
// >> [1, "1", true, null, NaN]