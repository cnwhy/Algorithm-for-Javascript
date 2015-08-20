// 斐波那契数列
// f(0) = 0 ; f(1) = 1
// f(n) = f(n-1) + f(n-2)
function bfnq(n){
	if(n <= 1) return n;
	return bfnq(n-1) + f(n-2);
}


// 兔子家族
// f(1) = 1 ;   -- 1对小兔子
// f(2) = 1 ;   -- 1对成年兔子
// f(3) = f(2) + f(1);
// f(n) = f(n-1) + f(n-2)
function tu(n){
	if(n <= 2) return 1;
	return tu(n-1) + f(n-2);
}