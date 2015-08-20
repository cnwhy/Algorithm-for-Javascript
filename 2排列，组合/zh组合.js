//组合实现
function zuhe(arr,n,sarr){
    log(sarr + ' | ' + arr);
    var zh = []
    var sarr = sarr || ''
    var pass = [];
    arr.sort();
    if(n==1){
        for(var i=0; i<arr.length; i++){
            var v = arr[i];
            if(pass.indexOf(v) !== -1) continue; //去重
            pass.push(v)
            zh.push(sarr + '' + v)
        }
        return zh;
    }
    for(var i=0; i<=arr.length-n; i++){
        var s = sarr + '' + arr[i];
        if(pass.indexOf(s) !== -1) continue;  //去重
        pass.push(s);
        zh = zh.concat(zuhe(arr.slice(i+1),n-1,s))
    }
    return zh;
}

var arr1 = [1, 2, 3, 4]
    ,arr2 = [4,2,2,2,3,3,1]
console.log(arr1,3)
console.log(zuhe(arr1, 3));
console.log(zuhe(arr2, 3));

