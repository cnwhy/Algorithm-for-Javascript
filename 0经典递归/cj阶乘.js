//阶乘 
// f(0) = 1
// f(n) = f(n-1)*n

function cj(n){
	if(n == 0) return 1;
	return cj(n-1)*n;
}
