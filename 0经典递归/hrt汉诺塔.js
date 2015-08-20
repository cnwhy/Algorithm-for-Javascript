// 汉诺塔
// f(1) = 1
// f(n) = f(n)*2 + 1
function hrt(n){
	if(n == 1) return 1;
	return hrt(n-1)*2+1;
}