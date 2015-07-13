// 约瑟夫环
// f(1) = 0
// f(n) = (f(n-1) + M)%n  (参与人数n , 排除基数M)

function ysf(n,M){
	if(n == 1) return 0;
	return (ysf(n-1) + M) % n
}