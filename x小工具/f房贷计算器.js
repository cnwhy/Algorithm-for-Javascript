//等额本金


/**
 * 
 * @param {number} dk 贷款总额
 * @param {number} q 分期(月)
 * @param {number} ll 年利率(%)
 */
function debj(dk,q,ll){
	var _dk = dk;
	var hb = dk/q;
	var log = [];
	var yll = ll/100/12;
	for(var i=0; i<q; i++){
		log.push({
			hb: hb,             //还本
			hx: (dk-hb*i)*yll,  //付息
			whbj: dk-hb*(i+1)   //未还本金
		})
	}
	console.log(log);
}

//等额本息
function debx(dk,q,ll){
	// var _dk = dk;
	// var log = [];
	// var yll = ll/100/12;
	// for(var i=0; i<q; i++){
	// 	log.push({
	// 		hb : dk*(yll*(1+yll)**i)/((1+yll)**(i-1))
	// 	})
	// }
}


