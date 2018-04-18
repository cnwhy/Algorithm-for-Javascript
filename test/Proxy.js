var fn = function(){
    console.log('run fn');
    return 111111;
}

fn.prototype.name = 'fn';
fn.prototype.getname = function(){
    console.log(this.name);
}

var proxyLog = console.log.bind(console,"[Proxy %s]")
var handler = {
    //target为函数时，直接执行（包括call,apply）Proxy对像时触发
    apply: function(target, thisArg, argumentsList){
        proxyLog('run|call|apply');
        return Reflect.apply(target, thisArg, argumentsList);
        //return target.apply(thisArg, argumentsList);
    },
    //target为函数时，实例化时触发
    construct: function(target, argumentsList, newTarget) {
        proxyLog('new');
        return Reflect.construct(target, argumentsList, newTarget)
        /*
        var obj = {};
        obj.__proto__ = newTarget.prototype; //注意，这里是 newTarget
        target.apply(obj,argumentsList);
        return obj;
        */
    },
    //用Object.defineProperty方法为Proxy对像添加属性时触发
    defineProperty: function(target, property, descriptor) {
        proxyLog('defineProperty', property, descriptor);
        return Reflect.defineProperty(target, property, descriptor)
        /*
        try{
            Object.defineProperty(target, property, descriptor)
            return true;
        }catch(e){
            return false;
        }
        */
    },
    //获取Proxy对像属性描述符时触发
    getOwnPropertyDescriptor: function(target, property) {
        proxyLog('getOwnPropertyDescriptor',property)
        return Reflect.getOwnPropertyDescriptor(target, property);
    },
    //delete 删除Proxy对像属性时触发
    deleteProperty: function(target, property) {
        proxyLog('delete', property);
        return Reflect.deleteProperty(target, property);
        //return delete target[property]; 
    },
    //获取Proxy对像属性值时触发
    get: function(target, property, receiver) {
        proxyLog('get',property);
        return Reflect.get(target, property, receiver)
        //return target[property];
    },
    //设置Proxy对像属性值时触发
    set: function(target, property, value, receiver) {
        proxyLog('set', property);
        return Reflect.set(target, property, value, receiver)
        /*
        try{
            target[property] = value;
            return true;
        }catch(e){
            return false;
        }
        */
    },
    //Object.getPrototypeOf() 获取Proxy对象的原型时触发
    getPrototypeOf: function(target) {
        proxyLog('getPrototypeOf');
        return Reflect.getPrototypeOf(target);
    },
    //Object.setPrototypeOf() 设置Proxy对象的原型时触发
    setPrototypeOf: function(target, prototype) {
        proxyLog('setPrototypeOf', prototype);
        return Reflect.setPrototypeOf(target, prototype);
    },
    // in 操作符号 检查Proxy对象是否存在此属性时触发
    has: function(target, prop){
        proxyLog('has',prop);
        return Reflect.has(target, prop);
        //return prop in target;
    },
    //Object.isExtensible() Reflect.isExtensible() 判断Proxy对象是否可扩展时触发
    isExtensible: function(target){
        proxyLog('isExtensible')
        return Reflect.isExtensible(target);
    },
    // Object.getOwnPropertyNames() //获取对像所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）
    // Object.getOwnPropertySymbols() //获取对象自身的所有 symbol 属性键
    // Object.keys() //获取对像自身属性的属性名(不包括不可枚举)
    // Reflect.ownKeys() //Object.getOwnPropertyNames() + Object.getOwnPropertySymbols()
    // 以上操作将触发;
    ownKeys: function(target){
        proxyLog('ownKeys');
        return Reflect.ownKeys(target);
    },
    //Object.preventExtensions() Reflect.preventExtensions() 禁止Proxy对像扩展时触发
    preventExtensions: function(target) {
        proxyLog('preventExtensions');
        return Reflect.preventExtensions(target);
    }
    
}


// var fn_ = new Proxy(fn,handler);

// console.log(fn_());
// fn_.abc = 'abc';
// console.log(fn_.abc);
// fn_.abc = '123'
//console.log(fn_.prototype.abc);
//console.log('abc' in fn_);
//console.log('aaa' in fn_);
//for(var k in fn_){console.log(k)}

// var f1 = new fn();
// f1.getname();

// var f2 = new fn_();
// f2.getname();
//Object.defineProperty(fn_,'def',{value:'def'});
//console.log(fn_.def)

var arr_ = [1,2,3]
var arr = new Proxy(arr_,handler);

console.log(arr.length)

console.log('--set--')
arr[3] = 0
console.log('--set end--')
return;

console.log('--push--')
arr.push(0);
console.log('--push end--')

console.log('--set--')
arr.length = 0
console.log('--set end--')

console.log('------------')
console.log(arr_);