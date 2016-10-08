function e2ten(num){
	var reg = /^([+-])?0*(\d+)(\.(\d+))?e(([+-])?(\d+))$/i;
    var result = reg.exec(num.toString());
    if(!result) return num;
    var zs = result[2]
        ,xs = result[4] || ""
        ,e = result[5] ? +result[5] : 0;
    // zs,xs,e
    var zs_a = zs.split("");
    var xs_a = xs.split("");
    if(e > 0){
        if(xs_a.length<=e){
            xs_a.push((new Array(e-xs_a.length+1)).join("0"));
            zs_a = zs_a.concat(xs_a);
            xs_a = [];
        }else{
            zs_a = zs_a.concat(xs_a.splice(0,e));
        }
    }else{
        if(zs_a.length <= -e){
            zs_a.unshift((new Array(-e-zs_a.length+1)).join("0"));
            xs_a = zs_a.concat(xs_a);
            zs_a = [];
        }else{
            xs_a = zs_a.splice(zs_a.length+e).concat(xs_a);
        }
    }
    zs = zs_a.length ? zs_a.join("") : "0";
    xs = xs_a.length ? xs_a.join("") : "";
    return (result[1] == "-" ? "-": "") + zs + (xs ? "." + xs : "");
}
var str = "10.234e2";
console.log(str , "=" ,e2ten(str));