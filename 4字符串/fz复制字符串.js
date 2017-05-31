/**
 * 
 * 
 * @param {any} 原字符串 
 * @param {any} 要复制的次数
 * @returns 
 */
function cpstr(str,n){
	var s = str;
	if(n <= 0) return "";
	if(n === 1) return str;
	var k = 1;
	do{
		s += s;
		k *= 2;
	}while(k*2<n)
	return s + cpstr(str,n-k);
}

/**
 * 
 * 
 * @param {string} 原字符串 
 * @param {number} 要复制的次数
 * @returns 
 */
function cpstr1(str,n){
	if(n <= 0) return "";
	if(n === 1) return str;
	var s = cpstr1(str,Math.floor(n/2)); //递归 + 2分法 , 比cpstr的效率高
	s += s;
	if(n%2) s += str;
	return s;
}



    String.prototype.times = function(n) {
      if( n == 1 ) {
        return this;
      }
      var s= this.times(Math.floor(n/2));
      s+= s;
      if ( n % 2 ) {
        s+= this;
      }
      return s;
    };
    var s = "a",a;
    var start = new Date();
    //a = s.times(100000000);
	for(var i=0; i<100000; i++){
		a = cpstr1(s,100000000)
	}
    var end = new Date();
    console.log("所耗时间 "  + (end-start));