var fs = require('fs');
var utils = require('../utils');
var myparse = require('../parse');
var json_parse = require('../json_parse');
var p = require('../p');
var jsonGet = require('../取单个值')
var jsonGet1 = require('../取多个值')
//var jsonGet2 = require('../myJs/getJsonForFile')

var myjson = '{"a":{"b":[1,2,3]}}';
var str1 = fs.readFileSync(__dirname + '/package.json').toString();
var str2 = fs.readFileSync(__dirname + '/test.json').toString();
var str3 = fs.readFileSync(__dirname + '/big1.json').toString();

var str0 = '[{"a":{"b":[123:}'
global.MK = 0;

var cb = function(k,v){
	console.log(arguments);
	console.log(JSON.stringify(this));
	return k;
}

// JSON.parse(myjson,cb)
// console.log('----------------')
// myparse(str0,cb,function(err){
// 	console.log(err);
// })
// return;

//jsonGet2('./k.js');
// console.log(p(str3))
// console.log(jsonGet(str1,""))

// console.log(cmp(JSON.parse(str3),jsonGet(str3,"")));
// console.log(cmp({a:null},{a:null}));

// return ;

//console.log(str1.toString());
// console.log(jsonGet('{"a":{}}',"a"));
// console.log(jsonGet1('{"a\\u0022":"a","b\\"":"b"}',['["a\\""]','["b\\u0022"]']));
// console.log(jsonGet(str1,"name"));
// console.log(jsonGet(str1,"devDependencies.rimraf"));
// console.log(jsonGet(str1,"keywords[1]"));

// console.log(jsonGet1('[{},{"a":123,',["[1].a"]));

// console.log(jsonGet1(str2,['data["config_data"].base[10]["cname"]','code']));
// console.log(jsonGet(str2,'data["config_data"].base[10][\'cname\']'));
// console.log(jsonGet1(str1,['main','repository.url']));
// console.log(global.MK);
// console.log(str1.length);
// return;


var max = 100000;

// var teststr = str0;
// var jpath = '[0].a.b[0]';

// var teststr = str1;
// var jpath = 'data.folder_config_num';

// var teststr = str2;
// var jpath = 'data["config_data"].base["50"]["cname"]';
// var jpath = 'code';
// var jpath = 'repository.url';


// var teststr = '"\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/\\/"';
var teststr = '"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"';
// var teststr = '"aaa"'
// var teststr = str1;
var jpath = '[300].friends[150].name';

// console.log(jsonGet(teststr,jpath));
// console.log(jsonGet1(teststr,jpath));
// console.log(eval('('+'JSON.parse(teststr)' + jpath +')'));
// console.log(jsonGet1(str1,"name"));
// return;

// console.log(JSON.parse(teststr)[101].tags.length)
// console.log(myparse(teststr)[101].tags.length)
// console.log(utils.parse(teststr)[101].tags.length)

// console.log(JSON.parse(teststr))
// console.log(myparse(teststr))
// console.log(utils.parse(teststr))
// console.log(json_parse(teststr))
// return;
if (1) {
	var t3 = Date.now();
	for (var k = 0; k < max; k++) {
		// JSON.parse(teststr)
		JSON.parse(teststr);
	}
	console.log("JSON", Date.now() - t3)
}

if (1) {
	var ts = Date.now();
	for (var k = 0; k < max; k++) {
		// JSON.parse(teststr)
		myparse(teststr);
	}
	console.log("myparse", Date.now() - ts)
}

if (1) {
	var ts = Date.now();
	for (var k = 0; k < max; k++) {
		// JSON.parse(teststr)
		p(teststr);
	}
	console.log("p", Date.now() - ts)
}

if (1) {
	var ts = Date.now();
	for (var k = 0; k < max; k++) {
		utils.parse(teststr);
	}
	console.log("utils.parse", Date.now() - ts)
}

if (1) {
	var ts = Date.now();
	for (var k = 0; k < max; k++) {
		utils.runEval(teststr);
	}
	console.log("eval", Date.now() - ts)
}

if (1) {
	var t1 = Date.now();
	for (var i = 0; i < max; i++) {
		jsonGet(teststr, "");
	}
	console.log('jsonGet', Date.now() - t1)
}

return;
if (1) {
	var t1 = Date.now();
	for (var i = 0; i < max; i++) {
		jsonGet(teststr, jpath);
	}
	console.log('jsonGet', Date.now() - t1)
}

if (1) {
	// jpath = ['main','repository.url']
	// jpath = [
	// 		'data["config_data"].base[10][\'cname\']'
	// 		,'code'
	// 		,'data.theme_id'
	// 		,'data.config_data.validate.num_icon.range'
	// 	]
	// console.log(jsonGet1(teststr,jpath));
	var t2 = Date.now();
	for (var k = 0; k < max; k++) {
		// jsonGet1(teststr,['code']);
		jsonGet1(teststr, jpath);
		// jsonGet1(teststr,jpath);
	}
	console.log("jsonGet1", Date.now() - t2)
}



