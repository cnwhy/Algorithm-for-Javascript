bfjs(9189.57,20,9189.57*20,32,60,4);
bfjs(9189.57,20,9189.57*20,32,60,10);
bfjs(9189.57,20,9189.57*20,32,60,15);

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
 * 保费计算器
 * @param {*} money //年缴费
 * @param {*} pn //缴费周期(年)
 * @param {*} tn //到期退费数
 * @param {*} nl //年龄
 * @param {*} nl_e //合同终止年龄
 * @param {*} ll //年利率(%) 默认 4%
 */
function bfjs(money, pn, tn, nl, nl_e, ll = 4) {
	let bz_y = nl_e - nl; //保障年限
// 	console.log(`
// 参保情况:
//   年缴费: ${money} * ${pn} 年 (共${money * pn})
//   保障期: ${bz_y} 年 (${nl} - ${nl_e}岁)
//   到期退费: ${tn}
// `);
	var n_str = "";
	var all = 0;
	for (var i = 0; i < pn; i++) {
		var _n = flmoney(money,ll,bz_y - i);
		all += _n;
		n_str += '第' + (i + 1) + '年保费到期价值: ' + _n.toFixed(2) + '\n' ;
	}

	var bf_fl = 0;
	//保费每年产生一次
	//    保费*((1+利率)**0 + (1+利率)**1 + ... + (1+利率)**n) = 总保费
	for(var i = 0; i<bz_y; i++){
		bf_fl += (1 + ll/100) ** i;
	}
	console.log(`
保费计算(利率 ${ll}%):
  本金到期总值: ${all.toFixed(2)} (复利)
  到期保费总值: ${(all - money * pn).toFixed(2)} (本金总值-到期退费)
  年均保费: ${((all - money * pn) / bz_y).toFixed(2)} (不复利, 保费总值/保障期)
  年均保费: ${((all - money * pn) / bf_fl).toFixed(2)} (复利, 推荐参考值)
`)

}
