
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
}

function getMatrix3d(m){
	m[0].push(0);
	m[1].push(0);
	m[2].push(0);
	m[3]=[0,0,0,1];
	return m;
}
