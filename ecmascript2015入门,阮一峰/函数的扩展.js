//  函数参数默认值
{
    log = (a = 12) => a++;
    let a = log();
}
//  作用域
{
    //实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错”x 未定义“。
    //  形参自成作用域
    var x = 1;

    function foo(x = x) {
        // ...
    }

    foo(); // ReferenceError: x is not defined
}
//  作用域
{
    let foo = '外';

    function bar(func = ()=> foo) {
        (()=> {
            let foo = '内';
            console.log(func())
        })();
    }

    bar();
}

{
    var x = 1;
    //  y里面的x先指向同级作用域的x
    function foo(x, y = function () {
        x = 2;
    }) {
        let x = 3;
        y();
        console.log(x);
    }

    foo() // 3
    x // 1
}
//  函数参数默认值的应用
{
    function throwIfMissing() {
        throw new Error('Missing parameter');
    }

    function foo(mustBeProvided = throwIfMissing()) {
        return mustBeProvided;
    }

    foo();// Error: Missing paramete
}
//...rest
{
    function sortNumbers() {
        return Array.prototype.slice.call(arguments).sort();
    }

    //相当于
    const mySortNumbers = (...numbers)=> (numbers.sort());
    //numbers是arguments的纯数组形式
}
//  函数的length属性，不包括 rest 参数,rest参数也不能设置默认值
{
    foo = (a = 1, ...b) => {
    };
    foo.length = 0;
}
//  es6函数参数如果使用了扩展运算符rest,解构,默认值,则在函数体内不能使用'use strict';
{
    const doSomething = (function () {
        'use strict';
        return function (value = 42) {
            return value;
        };
    }());
}
//  name指向这个函数的名字,bind返回的函数,name属性前缀为bound
{
    (function () {
    }).bind(null).name;
    (function james() {
    }).bind(null).name;
}
//  箭头函数=>
{

}
//  不需要返回值
{
    let fn = () => void doesNotReturn();
    fn()
}
//  如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
{
    fn = ()=> {
        ;
        ;
        return;
    }
}
/**
 * 箭头函数注意点
 * **/
//  this的指向
{
    function Timer() {
        this.s1 = 0;
        this.s2 = 0;
        // 箭头函数
        setInterval(() => this.s1++, 1000);
        // 普通函数
        setInterval(function () {
            this.s2++;
        }, 1000);
    }

    var timer = new Timer();
    //timer.s1  = 0; 每个1秒以后+1
    //window.s2 = NaN;

    setTimeout(() => console.log('s1: ', timer.s1), 3100);
    setTimeout(() => console.log('s2: ', timer.s2), 3100);
}