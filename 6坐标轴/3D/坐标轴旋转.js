
/**
 * 角度制转弧度制
 * 
 * @param {number} angle 
 * @returns 
 */
var a2r = function angle2radian(angle){
	return angle*Math.PI/180
}


/**
 * X轴旋转;
 * 
 * @param {any} angle 
 * @returns 
 */
function rotateX(angle){
	var r = a2r(angle);
	var sinv = Math.sin(r)
		,cosv = Math.cos(r)
	return [
		[1,0,0],
		[0,cosv,sinv],
		[0,-sinv,cosv]
	]
	/*
	[
		[1,0,0],
		[0,cosv,-sinv],
		[0,sinv,cosv]
	]
	*/
}

/**
 * Y轴旋转;
 * 
 * @param {any} angle 
 * @returns 
 */
function rotateY(angle){
	var r = a2r(angle);
	var sinv = Math.sin(r)
		,cosv = Math.cos(r)
	return [
		[cosv,0,-sinv],
		[0,1,0],
		[sinv,0,cosv]
	]
	/*
	[
		[cosv,0,sinv],
		[0,1,0],
		[-sinv,0,cosv]
	]
	*/
}

/**
 * Z轴旋转;
 * 
 * @param {any} angle 
 * @returns 
 */
function rotateZ(angle){
	var r = a2r(angle);
	var sinv = Math.sin(r)
		,cosv = Math.cos(r)
	return [
		[cosv,sinv,0],
		[-sinv,cosv,0],
		[0,0,1]
	]
	/*
	[
		[cosv,-sinv,0],
		[sinv,cosv,0],
		[0,0,1]
	]
	*/
}

function getMatrix3d(m){
	var args = [];
	for(var n=0; n<4; n++){
		if(n == 3){
			if(m[3] == undefined){
				m[3]=[0,0,0,1];
			}
			if(m[3][4] == undefined) m[3][4] = 1;
		}else if(m[n][4] == undefined){
			m[n][4] = 0;
		}
	}
	for(var i=0; i<4; i++){
		for(var k=0; k<4; i++){
			args.push(m[k][i]);
		}
	}
	return args;
}
