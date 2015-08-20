/*
┌┬name1
│├┬name4
││├─name10
││├─name11
││└─name12
│└┬name6
│ └─name9
├┬name2
│└─name5
└┬name3
 └┬name7
  └┬name8
   └─name13
*/

var data = [
	{id:1,pid:0,name:"name1"},
	{id:2,pid:0,name:"name2"},
	{id:3,pid:0,name:"name3"},
	{id:4,pid:1,name:"name4"},
	{id:5,pid:2,name:"name5"},
	{id:6,pid:1,name:"name6"},
	{id:7,pid:3,name:"name7"},
	{id:8,pid:7,name:"name8"},
	{id:9,pid:6,name:"name9"},
	{id:10,pid:4,name:"name10"},
	{id:11,pid:4,name:"name11"},
	{id:12,pid:4,name:"name12"},
	{id:11,pid:8,name:"name13"},
]
var tree = {}

tree.config = {
	id : 'id',
	pid : 'pid',
	placeholders : ['┌','│','├','└','─',' ','┬']
}

tree.showtree = function(data,pid,temp){
	var S = this.config.placeholders; //某些情况 适用全角空格
	var k_id = this.config.id 
		,k_pid = this.config.pid;
	var arr = [],str = '';
	pid = pid || 0;
	temp = temp || '';
	for(var k in data){
		if(data[k][k_pid] == pid) arr.push(data[k]);
	}
	for(var i = 0 , n = arr.length; i<n ; i++){
		var tr = arr[i];
        var zwf = ''
        if(i == 0){
        	if(temp == ''){
        		zwf += i == n-1 ? S[4] : S[0];
        	}else{
        		zwf = temp.replace(/.$/,function(a){return a != S[3] && a != S[4] ? S[1] : S[5];});
            	zwf += i == n-1 ? S[3]:S[2];
        	}
        }else {
        	if(temp !== ''){
        		zwf = temp.replace(/.$/,function(a){return a != S[3] && a != S[4] ? S[1] : S[5];});
        	}
        	zwf += i == n-1 ? S[3] : i == 0 ? S[0] : S[2];
        }
        var z_str = this.showtree(data,tr[k_id],zwf);
        str += zwf + (z_str ?  S[6] : S[4]) + tr.name + "\n"
        str += z_str;
	}
	return str;
}

console.log(tree.showtree(data,0))
console.log(tree.showtree(data,1))
console.log(tree.showtree(data,3))