//  Object.is
{
    console.log(Object.is(NaN, NaN));       //  相等
    console.log(Object.is(+0, -0));         //  不等
    Object.isEqual = function (a, b) {
        if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
        }
        return a !== a && b !== b;
    }
}

//  Object.assign,只拷贝【自身可枚举属性以及symbol】,复制到目标对象[第一个参数]
{
    //第一个参数是null,或undefined的时候报错
    let obj = Object.assign({name: 1}, undefined, [3]);
    console.log(obj);
    //只有字符串的包装对象，会产生可枚举属性,字符串会转成数组
    var str = Object('abc');
    console.log(str);
    Object.assign(obj, 'str');
    console.log(obj);
    //  如果非字符串的基本数据类型作为target
    let num = 2;
    Object.assign(num); //  表达式的返回值是 Number{2},num === 2
    //  assign只能进行值赋值,如果值是一个取值函数,则取出其值
    const o = {
        get f() {
            return 1
        }
    };
    Object.assign(obj, o);
    console.log(obj);
}
//  作用
{
    //1.指定默认值
    const Default = {a: 1, b: 1};
    const obj1 = Object.assign({}, Default, {b: 2});
    console.log(obj1);
    //2.克隆对象
    const obj2 = Object.assign({}, Default, Object.getPrototypeOf(Default));
    console.log(obj2);
}

//  Object.getOwnPropertyDescriptors , 返回指定对象所有自身属性（非继承属性）的描述对象。
{
    const obj1 = {name: 1, getOwn: 'getOwnPropertyDescriptors'};
    const des1 = Object.getOwnPropertyDescriptors(obj1);
    console.log(des1);
}
//  Object.getOwnPropertyDescriptor实现Object.getOwnPropertyDescriptors
//  主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。
{
    function getOwnPropertyDescriptors(obj) {
        var _obj = {};
        Reflect.ownKeys(obj).forEach(function (t, i) {
            _obj[t] = Object.getOwnPropertyDescriptor(obj, t);
        });
        return _obj;
    }

    const a = {name: 1};
    Object.defineProperty(a, 'n', {
        enumerable: true, get () {
            return this.name
        }, set  (x) {
            this.name = x
        }
    });
    const b = getOwnPropertyDescriptors(a);
    console.log(a);
    console.log(b);
}
//  实现对属性的完全拷贝
{
    function copy(origin) {
        const obj = {};
        Reflect.ownKeys(origin).map(function (t, i) {
            Object.defineProperty(obj, t, Object.getOwnPropertyDescriptor(origin, t));
        });
        return obj;
    }

    const a = Object.defineProperty({}, 'name', {
        get (){
            "use strict";
            return this.n;
        }, set (x){
            "use strict";
            this.n = x;
        }
    });
    a.name = 12;
    const b = copy(a);
    console.log(b);
    console.log(Object.getOwnPropertyDescriptor(b, 'name'));

    //  简单实现
    copy1 = (origin) => Object.defineProperties({}, Object.getOwnPropertyDescriptors(origin));

    const c = copy1(b);
    console.log(c);
}

//  Object.setPrototypeOf,Object.getPrototypeOf
{
    //   ES6 正式推荐的设置原型对象的方法
    const proto = {name: 1};
    const obj = Object.setPrototypeOf({}, proto);
    console.log(obj);
}

//  Object.keys,Object.values,Object.entries
{
    //  Object.keys, 返回自身所有可枚举属性,不含symbol,不含继承
    //  遍历顺序即 数字,字母加入的顺序
    const {keys,values,entries} = Object;
    const obj = {a: 1, c: 3, b: 2, [Symbol()]: 'symbol', "1": 'james'};
    for (let key of keys(obj)) {
        console.log(key);
    }
    for (let value of values(obj)) {
        console.log(value);
    }
    for (let [key,value] of entries(obj)) {
        console.log(key, value);
    }
    console.log(keys('123456'));
    console.log(values('123456'));
    console.log(entries('123456'));
}

//  Object.fromEntries 是 Object.entries的逆运算
{
    Object.fromEntries = Object.fromEntries || function (arr) {
            const obj = {};
            arr.forEach(function (t, i) {
                obj[t[0]] = t[1]
            });
            return obj;
        };
    let obj = Object.fromEntries([['foo', 'bar'], ['baz', 42]]);
    console.log(obj);
}
