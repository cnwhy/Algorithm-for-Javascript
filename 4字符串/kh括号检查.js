//栈 方法 检查 括号对的完整性
function khedit(str){
	var khs = {
		')':"(",
		']':"[",
		'}':"{"
	}
	var allk = str.match(/[\(\)\[\]\{\}]/g)
	console.log(allk)
	if(allk){
		var arrv = [];
		for(var i=0,n=allk.length;i<n;i++){
			var kh = allk[i],c;
			if(c = khs[kh]){
				console.log(c)
				if(arrv.pop() === c) continue
				else return false;
			}else{
				arrv.push(kh);
			}
			console.log(arrv)
		}
		return arrv.length == 0;
	}else{
		return true;
	}
}