'use strict';

//  函数参数默认值
{
    log = function log() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;
        return a++;
    };
    var a = log();
}
//  作用域
{

    //function foo(x = x) {
    var _foo = function _foo() {
        // ...

        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    };

    //实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错”x 未定义“。
    //  形参自成作用域
    var x = 1;

    _foo(); // ReferenceError: x is not defined
}
//  作用域
{
    var bar = function bar() {
        var func = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
            return _foo2;
        };

        (function () {
            var foo = '内';
            console.log(func());
        })();
    };

    var _foo2 = '外';

    bar();
}

{
    //  y里面的x先指向同级作用域的x
    var _foo3 = function _foo3(x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
            x = 2;
        };

        //let x = 3;
        var x = 3;
        y();
        console.log(x);
    };

    var x = 1;

    _foo3(); // 3
    x; // 1
}
//  函数参数默认值的应用
{
    var throwIfMissing = function throwIfMissing() {
        throw new Error('Missing parameter');
    };

    var _foo4 = function _foo4() {
        var mustBeProvided = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : throwIfMissing();

        return mustBeProvided;
    };

    _foo4(1); // Error: Missing paramete
}
//...rest
{
    var sortNumbers = function sortNumbers() {
        return Array.prototype.slice.call(arguments).sort();
    };

    //相当于


    var mySortNumbers = function mySortNumbers() {
        for (var _len = arguments.length, numbers = Array(_len), _key = 0; _key < _len; _key++) {
            numbers[_key] = arguments[_key];
        }

        return numbers.sort();
    };
    //numbers是arguments的纯数组形式
}
//  函数的length属性，不包括 rest 参数,rest参数也不能设置默认值
{
    foo = function foo() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    };
    foo.length = 0;
}
//  es6函数参数如果使用了扩展运算符rest,解构,默认值,则在函数体内不能使用'use strict';
{
    var doSomething = function () {
        'use strict';

        return function () {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 42;

            return value;
        };
    }();
}
//  name指向这个函数的名字,bind返回的函数,name属性前缀为bound
{
    (function () {}).bind(null).name;
    (function james() {}).bind(null).name;
}
//  箭头函数=>
{}
//  不需要返回值
{}
//let fn = () => void doesNotReturn();
//fn()

//  如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
{
    var fn = function fn() {
        ;
        ;
        return;
    };
}
/**
 * 箭头函数注意点
 * **/
//  this的指向
{
    var Timer = function Timer() {
        var _this2 = this;

        this.s1 = 0;
        this.s2 = 0;
        // 箭头函数
        setTimeout(function () {
            _this2.s1++;
            console.log(_this2);
        }, 9);
        // 普通函数
        setTimeout(function () {
            console.log(this);
            this.s2++;
        }, 9);
    };

    var timer = new Timer();
    //timer.s1  = 0; 每个1秒以后+1
    //window.s2 = NaN;

    setTimeout(function () {
        return console.log('s1: ', timer.s1);
    }, 10);
    setTimeout(function () {
        return console.log('s2: ', timer.s2);
    }, 10);
}
//  例子  只有真正的function才能绑定this,箭头函数没有自己的this,他永远指向定义该函数时的函数作用域
//  除了this,arguments、super、new.target也指向外层函数的对应变量.
{
    var _foo5 = function _foo5() {
        var _this3 = this;

        var _this = this;
        return function () {
            console.log(_this3);
            return function () {
                return function () {
                    console.log('id:', _this3.id);
                    console.log(_this === _this3);
                };
            };
        };
    };

    var f = _foo5.call({ id: 1 });
    var t0 = f()()();
    var t1 = f.call({ id: 2 })()(); //  箭头函数没有自己的this,所以这个call的object没法绑定,所以this指向最外层的foo函数的this
    var t2 = f().call({ id: 3 })();
    var t3 = f()().call({ id: 4 });
}
//  call,apply,bind等无法改变箭头函数中this的指向
{
    var _foo6 = function _foo6() {
        var _this4 = this;

        //  这个箭头函数里的this是函数foo里的this,相当于window,而且无法并bind绑定
        return function () {
            return _this4.alert;
        }.bind({
            alert: function alert() {
                return 'alert';
            }
        });
    };

    var fooo = function fooo() {
        return function () {
            return this.alert;
        }.bind({
            alert: function alert() {
                return 'alert';
            }
        });
    };

    var _f = _foo6();
    //f()();
}

//  箭头函数使this从动态指向变成静态指向,下面的场合不应该使用this
{
    var cat = {
        lives: 9,
        jumps: function jumps() {
            undefined.lives--;
        }
    };
}

//  箭头函数的嵌套函数
{
    var insert = function insert(value) {
        return {
            into: function into(array) {
                return {
                    after: function after(afterValue) {
                        array.splice(array.indexOf(afterValue) + 1, 0, value);
                        return array;
                    }
                };
            }
        };
    };

    insert(2).into([1, 3]).after(1);
}
{
    var _insert = function _insert(value) {
        return {
            into: function into(array) {
                return {
                    after: function after(afterValue) {
                        array.splice(array.indexOf(afterValue) + 1, 0, value);
                        return array;
                    }
                };
            }
        };
    };
    _insert(2).into([1, 3]).after(1);
}

//  箭头函数的嵌套
{
    var pipeline = function pipeline() {
        for (var _len2 = arguments.length, funcs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            funcs[_key2] = arguments[_key2];
        }

        return function (val) {
            return funcs.reduce(function (a, b) {
                return b(a);
            }, val);
        };
    };
    var plus1 = function plus1(a) {
        return a + 1;
    };
    var mult2 = function mult2(a) {
        return a * 2;
    };
    var addThenMult = pipeline(plus1, mult2);
    addThenMult(5);
}
{
    var _pipeline = function _pipeline() {
        for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            funcs[_key3] = arguments[_key3];
        }

        return function (val) {
            return funcs.reduce(function (a, b) {
                return b(a);
            }, val);
        };
    };
    var _plus = function _plus(a) {
        return a + 1;
    };
    var _mult = function _mult(a) {
        return a * 2;
    };
    var _addThenMult = _pipeline(_plus, _mult);
    var res = _addThenMult(5);
    console.log(res);
}
{
    var _pipeline2 = function _pipeline2() {
        for (var _len4 = arguments.length, funcs = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            funcs[_key4] = arguments[_key4];
        }

        return function (value) {
            return funcs.reduce(function (a, b) {
                return b(a);
            }, value);
        };
    };
    var _fn = _pipeline2(function (a) {
        return a + 1;
    }, function (a) {
        return a * 2;
    }, function (a) {
        return a - 3;
    }, function (a) {
        return a / 4;
    });
    var _res = _fn(10);
    console.log(_res);
}
{
    var _pipeline3 = function _pipeline3() {
        for (var _len5 = arguments.length, funcs = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            funcs[_key5] = arguments[_key5];
        }

        return function (value) {
            return funcs.reduce(function (a, b) {
                return b(a);
            }, value);
        };
    };
    var _fn2 = _pipeline3(function (a) {
        return a + 1;
    }, function (a) {
        return a * 2;
    }, function (a) {
        return a - 3;
    }, function (a) {
        return a / 4;
    });
    var _res2 = _fn2(10);
    console.log(_res2);
}
//  双冒号运算符
{
    var _bar = {};
    var _foo7 = function _foo7() {};
    //bar::foo;
}

//  尾调用优化
//  尾递归可以只保留一个调用帧,而非尾递归的递归需要保留无数调用帧
//  非尾递归形式
{
    var factorial = function factorial(a) {
        if (a < 1) {
            return 0;
        }
        return a + factorial(a - 1);
    };
    factorial(5);
}
//  尾递归形式
{
    var _factorial = function _factorial(a) {
        var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (a < 1) {
            return b;
        }
        return _factorial(a - 1, b + a);
    };
    _factorial(10);
}
//  非尾递归形式
{
    var fibonacci = function fibonacci(x) {
        if (x < 1) {
            return 1;
        }
        return fibonacci(x - 2) + fibonacci(x - 1);
    };
    fibonacci(5);
}
//  尾递归形式
{
    var _fibonacci = function _fibonacci(x) {
        var a = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        if (x < 3) {
            return b;
        }
        return _fibonacci(x - 1, b, a + b);
    };
    _fibonacci(12);
}
//  柯里化阶乘
{
    var jie = function jie(fn, n) {
        return function (val) {
            return fn(val, n);
        };
    };
    var _fn3 = function _fn3(val, n) {
        if (val < 1) {
            return n;
        }
        return _fn3(val - 1, n * val);
    };
    var ff = jie(_fn3, 1);
    ff(7);
}