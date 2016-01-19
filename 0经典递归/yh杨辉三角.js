//输出杨辉三角;
function yhsj(n){
	var arr = [[1]];
	for(var i=1;i<n;i++){
		var arr_p = arr[i-1];
		var _arr = arr[i] = [];
		_arr.push(1);
		for(var k=0; k<arr_p.length-1;k++){
			_arr.push(arr_p[k]+arr_p[k+1]);
		}
		_arr.push(1);
	}

	var maxleng = 1 + arr[arr.length-1].join(' ').length>>1;

	arr.forEach(function(v){
		var str = v.join(' ');
		console.log(new Array(maxleng - (str.length>>1)).join(" ") + str)
	})
	//return arr;
}



//杨辉三角递归算法; (溢出)
function yhsj_dg(x,y){
	if(x<0 || y>x) return NaN;
	if(y == 0) return 1;
	if(x == y) return 1;
	return yhsj_dg(x-1,y-1) + yhsj_dg(x-1,y);
}

//杨辉三角迭代算法,输出层;
function yhsj_dd(x){
	var arr=[]
		,temparr = [1];
	for(var i=0;i<x;i++){
		arr = [];
		for(var y=0; y<=i; y++){
			arr.push((temparr[y] ||0) + (temparr[y-1] ||0))
		}
		temparr = arr.slice(0);
	}
	return arr;
}

//杨辉三角迭代算法,输出值;
function yhsj_dd(x,y){
	var arr=[]
		,temparr = [1];
	y = y > Math.ceil(x/2) ? x-y+1 : y;
	//console.log(y);
	var _temp = y - x;
	for(var i=0;i<x;i++){
		if(i == x-1) return temparr[y-2] + temparr[y-1];
		arr = _temp + i > 0 ? new Array(_temp + i) : []; //去掉左边不需要参与计算的项;
		//console.log(arr.length);
		for(var _y=arr.length; _y<=i; _y++){
			if(_y > y) break;
			arr.push((temparr[_y] ||0) + (temparr[_y-1] ||0))
		}
		temparr = arr.slice(0);
	}
}