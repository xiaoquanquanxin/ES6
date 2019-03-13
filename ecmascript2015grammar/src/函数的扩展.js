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

    //function foo(x = x) {
    function foo(x = 1) {
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
        //let x = 3;
        var x = 3;
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

    foo(1);// Error: Missing paramete
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
    //let fn = () => void doesNotReturn();
    //fn()
}
//  如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
{
    const fn = ()=> {
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
        setTimeout(() => {
            this.s1++;
            console.log(this);
        }, 9);
        // 普通函数
        setTimeout(function () {
            console.log(this)
            this.s2++;
        }, 9);
    }

    var timer = new Timer();
    //timer.s1  = 0; 每个1秒以后+1
    //window.s2 = NaN;

    setTimeout(() => console.log('s1: ', timer.s1), 10);
    setTimeout(() => console.log('s2: ', timer.s2), 10);
}
//  例子  只有真正的function才能绑定this,箭头函数没有自己的this,他永远指向定义该函数时的函数作用域
//  除了this,arguments、super、new.target也指向外层函数的对应变量.
{
    function foo() {
        var _this = this;
        return () => {
            console.log(this);
            return () => {
                return () => {
                    console.log('id:', this.id);
                    console.log(_this === this);
                };
            };
        };
    }

    var f = foo.call({id: 1});
    var t0 = f()()();
    var t1 = f.call({id: 2})()();       //  箭头函数没有自己的this,所以这个call的object没法绑定,所以this指向最外层的foo函数的this
    var t2 = f().call({id: 3})();
    var t3 = f()().call({id: 4});
}
//  call,apply,bind等无法改变箭头函数中this的指向
{
    function foo() {
        //  这个箭头函数里的this是函数foo里的this,相当于window,而且无法并bind绑定
        return (()=>this.alert).bind({
            alert: function () {
                return 'alert'
            }
        });
    }

    function fooo() {
        return (function () {
            return this.alert
        }).bind({
            alert: function () {
                return 'alert'
            }
        });
    }

    let f = foo();
    //f()();
}

//  箭头函数使this从动态指向变成静态指向,下面的场合不应该使用this
{
    const cat = {
        lives: 9,
        jumps: () => {
            this.lives--;
        }
    }
}

//  箭头函数的嵌套函数
{
    function insert(value) {
        return {
            into: function (array) {
                return {
                    after: function (afterValue) {
                        array.splice(array.indexOf(afterValue) + 1, 0, value);
                        return array;
                    }
                };
            }
        };
    }

    insert(2).into([1, 3]).after(1);
}
{
    let insert = (value) => ({
        into: (array)=>({
            after: (afterValue)=> {
                array.splice(array.indexOf(afterValue) + 1, 0, value);
                return array
            }
        })
    })
    insert(2).into([1, 3]).after(1);
}

//  箭头函数的嵌套
{
    const pipeline = (...funcs) => val => funcs.reduce((a, b) => b(a), val);
    const plus1 = a => a + 1;
    const mult2 = a => a * 2;
    const addThenMult = pipeline(plus1, mult2);
    addThenMult(5)
}
{
    const pipeline = function (...funcs) {
        return function (val) {
            return funcs.reduce(function (a, b) {
                return b(a)
            }, val);
        }
    };
    const plus1 = function (a) {
        return a + 1;
    };
    const mult2 = function (a) {
        return a * 2;
    };
    const addThenMult = pipeline(plus1, mult2);
    let res = addThenMult(5);
    console.log(res);
}
{
    const pipeline = function (...funcs) {
        return function (value) {
            return funcs.reduce(function (a, b) {
                return b(a);
            }, value)
        }
    };
    const fn = pipeline(function (a) {
        return a + 1;
    }, function (a) {
        return a * 2;
    }, function (a) {
        return a - 3;
    }, function (a) {
        return a / 4;
    });
    let res = fn(10);
    console.log(res);
}
{
    const pipeline = (...funcs) => (value) => funcs.reduce((a, b) => b(a), value);
    const fn = pipeline(function (a) {
        return a + 1;
    }, function (a) {
        return a * 2;
    }, function (a) {
        return a - 3;
    }, function (a) {
        return a / 4;
    });
    let res = fn(10);
    console.log(res);
}
//  双冒号运算符
{
    let bar = {};
    let foo = ()=> {

    };
    //bar::foo;
}

//  尾调用优化
//  尾递归可以只保留一个调用帧,而非尾递归的递归需要保留无数调用帧
//  非尾递归形式
{
    const factorial = (a)=> {
        if (a < 1) {
            return 0
        }
        return a + factorial(a - 1);
    };
    factorial(5)
}
//  尾递归形式
{
    const factorial = (a, b = 0)=> {
        if (a < 1) {
            return b;
        }
        return factorial(a - 1, b + a);
    };
    factorial(10);
}
//  非尾递归形式
{
    const fibonacci = (x)=> {
        if (x < 1) {
            return 1;
        }
        return fibonacci(x - 2) + fibonacci(x - 1);
    };
    fibonacci(5);
}
//  尾递归形式
{
    const fibonacci = (x, a = 1, b = 1)=> {
        if (x < 3) {
            return b;
        }
        return fibonacci(x - 1, b, a + b);
    };
    fibonacci(12);
}
//  柯里化阶乘
{
    const jie = (fn, n)=> {
        return (val)=> {
            return fn(val, n);
        }
    };
    const fn = (val, n)=> {
        if (val < 1) {
            return n;
        }
        return fn(val - 1, n * val)
    };
    const ff = jie(fn, 1);
    ff(7);
}
