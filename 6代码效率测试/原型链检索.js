var classA = function(str,max){
	this.str = str;
	this.max = max
	//this.a(100);
}
classA.prototype.a = function(){
	var str = this.str;
	while(this.max){
		this.str += str;
		this.max--;	
	}
	//console.log(this.str)
}

function concat(str,max){
	var k = str;
	while(max){
		str += k;
		max--;
	}
	//console.log(str)
}


var t;
var str = "a"
var max = 100000;
var c1 = new classA(str,max);

t = Date.now();
concat(str,max)
console.log(Date.now()-t)

t = Date.now();
c1.a()
console.log(Date.now()-t)