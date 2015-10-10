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
	{id:1,pid:0,name:"name1",status:1},
	{id:2,pid:0,name:"name2",status:1},
	{id:3,pid:0,name:"name3",status:1},
	{id:4,pid:1,name:"name4",status:1},
	{id:5,pid:2,name:"name5",status:1},
	{id:6,pid:1,name:"name6",status:1},
	{id:7,pid:3,name:"name7",status:1},
	{id:8,pid:7,name:"name8",status:1},
	{id:9,pid:6,name:"name9",status:1},
	{id:10,pid:4,name:"name10",status:1},
	{id:11,pid:4,name:"name11",status:1},
	{id:12,pid:4,name:"name12",status:1},
	{id:13,pid:8,name:"name13",status:1},
]

var tree = {}
tree.config = {
	id : 'id',
	pid : 'pid',
	status : 'status',
	placeholders : ['┌','│','├','└','─',' ','┬'],
	pType : 1 //父级联动模式0：偏向0（子项有0则为0），1：偏向1（子项有1则为1）；
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
        str += zwf + (z_str ?  S[6] : S[4]) + (tr.name + " " + tr.status) + "\n"
        str += z_str;
	}
	return str;
}

tree.allStatusIs = function(arr,status){
	var k_status = this.config.status;
	status = status ? 1 : 0;
    for(var i=arr.length; i--;){
        if(arr[i][k_status] != status){
            return false;
        }
    }
    return true;
}

tree.get = function(id){
	var k_id = this.config.id;
	for(var i=0; i< data.length; i++){
        if(id == data[i][k_id]){
            return data[i];
        }
    }
}

tree.getZ = function(pid,all){
	var k_id = this.config.id 
		,k_pid = this.config.pid;
	var arr = [];
    for(var i=0; i < data.length; i++){
        var _o = data[i]
        if(_o[k_pid] == pid){
        	arr.push(_o)	
        	if(all){
            	arr = arr.concat(this.getZ(_o[k_id],all))
        	}
        }
    }
    return arr;
}

tree.getallZ = function(pid){
	return this.getZ(pid,true)
}

tree.changeStatus = function(id,status,z){
	//console.log(arguments)
	var k_id = this.config.id 
		,k_pid = this.config.pid
		,k_status = this.config.status;
	status = status ? 1 : 0;
	var o = this.get(id);
	if(!o) return;
    o[k_status] = status;
    
    //设置子类
    if(!z){
        var zlist = this.getallZ(o[k_id]) //全部子孙元素
        for(var i = 0; i< zlist.length; i++){
			zlist[i][k_status] = status;
        }
    }
    
    //设置父节点
    var pid = o[k_pid];
    if(status){
        if(this.config.pType){
        	this.changeStatus(pid,status,true)
        }else{
        	var blist = this.getZ(pid);　
        	if(this.allStatusIs(blist,status)){
        		this.changeStatus(pid,status,true)
        	}
        }
    }else{
    	if(this.config.pType){
    		var blist = this.getZ(pid);
        	if(this.allStatusIs(blist,status)){
        		this.changeStatus(pid,status,true)
        	}
        }else{
        	this.changeStatus(pid,status,true)
        }
    }
}


console.log(tree.showtree(data,0))
tree.changeStatus(4,0)
console.log(tree.showtree(data,0))
tree.changeStatus(9,0)
console.log(tree.showtree(data,0))
tree.changeStatus(11,1)
console.log(tree.showtree(data,0))
tree.changeStatus(3,0)
console.log(tree.showtree(data,0))

