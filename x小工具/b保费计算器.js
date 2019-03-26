var ll = 2;
console.log(" == 平安 福满分 ==")
bfjs(9189.57,20,181440,32,60,ll);
console.log(" == 达尔文1号 ==")
bfjs(2774.56,20,0,32,60,ll);
console.log(" == 康惠保旗舰版 ==")
bfjs(3626,20,0,32,60,ll);
console.log(" == 瑞和定期寿险 ==")
bfjs(1200,20,0,32,60,ll);
console.log(" == 定惠保定期寿险 ==")
bfjs(1044,20,0,32,60,ll);
console.log(" == 小安定期寿险 ==")
bfjs(1356,20,0,32,62,ll);

console.log(9189.57 - 181440/dqfl(20,28,3));
console.log(140743.97/dqfl(20,28,3));
// bfjs(9189.57,20,9189.57*20,32,60,10);
// bfjs(9189.57,20,9189.57*20,32,60,15);

/**
 * 复利计算
 * @param {*} money 金额
 * @param {*} rate 利率(%)
 * @param {*} years 年限
 */
function flmoney(money,rate=4,years){
	return money * ((1+rate/100) ** years)
}

/**
 * 连续多期复利因子
 * @param {*} y_jf 缴费年 
 * @param {*} y_all 总年
 * @param {*} ll 年利率
 */
function dqfl(y_jf,y_all,ll){
	var k = 0;
	var _y = y_all - y_jf;
	for(var i = 0; i<y_jf; i++){
		//从最后一期网前算
		k += (1 + ll/100) ** (_y+i);
	}
	return k;
}

/**
 * 保费计算器
 * @param {*} money 年缴费
 * @param {*} pn 缴费周期(年)
 * @param {*} tn 到期退费数
 * @param {*} nl 年龄
 * @param {*} nl_e 合同终止年龄
 * @param {*} ll 年利率(%) 默认 4%
 * @param {*} fy 返佣金额
 */
function bfjs(money, pn, tn, nl, nl_e, ll = 4, fy = 0) {
	let bz_y = nl_e - nl; //保障年限
	console.log(`
参保情况:
  年缴费: ${money} * ${pn} 年 (共${money * pn})
  保障期: ${bz_y} 年 (${nl} - ${nl_e}岁)
  到期退费: ${tn}
`);
	var n_str = "";
	var all = 0;
	for (var i = 0; i < pn; i++) {
		var _n = flmoney(money,ll,bz_y - i);
		all += _n;
		n_str += '第' + (i + 1) + '年保费到期价值: ' + _n.toFixed(2) + '\n' ;
	}

	var bf_fl = dqfl(bz_y,bz_y,ll);
	//保费每年产生一次
	//    保费*((1+利率)**0 + (1+利率)**1 + ... + (1+利率)**n) = 总保费
	// for(var i = 0; i<bz_y; i++){
	// 	bf_fl += (1 + ll/100) ** i;
	// }
	console.log(`
保费计算(利率 ${ll}%):
  本金到期总值: ${all.toFixed(2)} (复利)
  到期保费总值: ${(all - tn).toFixed(2)} (本金总值-到期退费)
  年均保费: ${((all - tn) / bz_y).toFixed(2)} (不复利, 保费总值/保障期)
  年均保费: ${((all - tn) / bf_fl).toFixed(2)} (复利, 推荐参考值)
`)

}

function test(money,y,ll){
	var all = 0;
	for(var i = 0; i<y; i++){
		var _n = flmoney(money,ll,y - i);
		all += _n;
	}
	return all;
}

// console.log(test(8236.47,20,3))
// console.log(test(6692.91,30,3))
// console.log(test(8236.47-6692.91,30,3))
