//生成一组指定平均值的数

var _c1=0,_c2=0;

function randomInt_(a,b){
	_c1++;
	return Math.min(a,b) + Math.round(Math.abs(a-b) * Math.random())
}

function randomInt(a,b){
	_c2++;
	return Math.min(a,b) + Math.round(Math.abs(a-b) * Math.random())
}

function sum(a,b){
	return a + b;
}

function randomInts1(min,max,length,average){
    var rfn = randomInt_.bind(null,min,max);
    var arr = [];
    while(arr.length < length){
        arr.push(rfn());
    }
    while(arr.reduce(sum)/length != average){
        arr.shift();
        arr.push(rfn());
    }
    return arr;
}

function randomInts2(min,max,length,average){
	var arr = [];
	var k = 0; //与平均数的偏移值
	// var _sum = 0;
	if(average>max || average<min) throw '参数错误!';
	function _autoRandom(){
		if(k > 0){
			return randomInt(min,average)
		}else if(k < 0){
			return randomInt(average,max);
		}else{
			return randomInt(min,max);
		}
	}
	function add(){
		var _n = _autoRandom();
		k += _n - average;
		// _sum += _n;
		arr.push(_n);
		
	}
    while(arr.length < length){
		add();
	}
	while(k != 0){
		var _s = arr.shift();
		// _sum -= _s;
		k -= _s - average;
		add();
	}
	return arr;
}

function test(a,b,c,d){
	console.log(`--取${c}个值,平均数为${d}--`);
	var arr1 = randomInts1(a,b,c,d);
	console.log('arr1 平均值:', arr1.reduce(sum)/c, ' 随机次数:',_c1);
	_c1 = 0;
	
	var arr2 = randomInts2(a,b,c,d);
	console.log('arr2 平均值:', arr2.reduce(sum)/c, ' 随机次数:',_c2);
	_c2 = 0;
}

test(40,75,40, 63);
// test(40,75,40, 50);