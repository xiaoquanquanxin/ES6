'use strict';

{
    //const asFn = async function () {
    //    const f1 = await Promise(function (resolve, reject) {
    //        resolve()
    //    });
    //    const f2 = await function () {
    //        return 2;
    //    };
    //};
    //let a = asFn();
    //a.then(function (resolve) {
    //    console.log(resolve)
    //});
}

{
    //  async实现异步编程,强!无敌!
    var timeout = function timeout(ms) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve('???');
            }, ms);
        });
    };

    var asyncPrint = async function asyncPrint(value, ms) {
        var a = await timeout(ms).then(function (res) {
            console.log(res);
            return 'then已经执行完了';
        });
        //console.log(a);
        await timeout(ms);
        console.log(a, value);
    };

    ;
    ;
    //asyncPrint('james', 300);
}
{
    var _timeout = async function _timeout(ms) {
        var p = await new Promise(function (resolve) {
            setTimeout(function () {
                resolve('promise');
            }, ms);
        }).then(function (res) {
            console.clear();
            console.log('res:' + res);
            return 'then已经执行完了';
        });
        return p;
    };

    var _asyncPrint = async function _asyncPrint(ms) {
        var a = await _timeout(ms);
        console.log(a);
        return a;
    };

    ;
    ;
    //var p = asyncPrint(333);
    //p.then(function (res) {
    //    console.log(res);
    //});
}

/**
 * 语法
 * */
{
    //  async函数返回Promise对象
    var f = async function f() {
        if (Math.random() > 0.5) {
            throw new Error('async函数内部报错,会执行catch方法.');
        }
        return 'async函数的返回值';
    };

    ;
    (function () {
        return;
        var af = f().then(function (resolve) {
            console.log(resolve + ',\u4F1A\u6210\u4E3Athen\u65B9\u6CD5\u7684then\u65B9\u6CD5\u7684\u53C2\u6570');
        }).catch(function (reject) {
            console.log('' + reject);
        });
        console.log(af);
    })();
}
{
    //  async返回的Promise对象的then方法,必须等到async函数内部的每一个await后面的Promise对象执行完,才发生状态改变
    var _f = async function _f() {
        "use strict";

        await new Promise(function (resolve) {
            setTimeout(function () {
                resolve(123);
            }, 333);
        });
        return '这个返回值就是async的实例的then函数的实参.';
    };

    ;
    (function () {
        return;
        var af = _f().then(function (resolve) {
            return console.log(resolve + ':async\u51FD\u6570\u5185\u90E8\u7684await\u540E\u9762\u7684Promise\u6267\u884C\u5B8C.');
        });
        console.log(af);
    })();
}
{
    //  await后面应该是一个promise对象,如果不是,则返回对应的值
    var _f2 = async function _f2() {
        var a = await '值';
        var b = await new Promise(function (resolve, reject) {
            resolve('promise');
        }).then(function (resolve) {
            return 1;
        });
        return Math.random() > 0.5 ? a : b;
    };

    ;
    var af = _f2();
    //af.then(console.log);
}
{
    //  await后面的promise对象的状态变成reject,则会被await返回的promise实例的catch方法捕捉
    var _f3 = async function _f3() {
        await Promise.reject('await后面的promise的状态为reject');
        await Promise.resolve('前一个await后面的Promise的实例状态是reject,所以我不执行');
    };

    //f().catch(console.log);

}

{
    //  错误处理
    //  await后面的异步操作出错下:async返回的Promise实例的状态被置为reject
    var _f4 = async function _f4() {
        await new Promise(function (resolve, reject) {
            throw new Error('出错了');
        });

        //  统一放在try...catch中
        try {
            await new Promise(function (resolve, reject) {
                throw new Error('出错了');
            });
            await new Promise(function (resolve, reject) {
                throw new Error('出错了');
            });
            await new Promise(function (resolve, reject) {
                throw new Error('出错了');
            });
        } catch (err) {}
    };

    ;
    //f().catch(console.log);
}

//  使用注意点,优化
{
    //  如果多个await命令后的异步操作没有继发关系,则最好让它们同时触发
    var getA = function getA() {
        return new Promise(function (resolve) {
            resolve('getA完成');
        });
    };

    var getB = function getB() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve('getB完成');
            }, 333);
        });
    };

    var _f5 = async function _f5() {
        return await Promise.all([getA(), getB()]);
    };

    //f().then(console.log)


    ;
}

/**
 * 实例:按顺序执行异步操作
 * 读取一组 URL，然后按顺序输出.
 * */
/**
 * 这是promise,所以复杂!!
 * */
{
    var logInOrder = function logInOrder(urls) {
        //  读取
        var textPromise = urls.map(function (url) {
            /**
             *每个fetch操作都返回一个 Promise 对象
             * */
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(1);
                }, Math.random() * 1111);
            }).then(function (r) {
                return fetch(url).then(function (response) {
                    return response.text();
                });
            });
        });
        //  输出
        textPromise.reduce(function (chain, current) {
            return chain.then(function () {
                return current;
            }).then(function (text) {
                console.log(text.substr(0, 20));
            });
        }, Promise.resolve());
    };

    ;
    //logInOrder([encodeURIComponent('./async 函数.js'), encodeURIComponent('./Class 的基本语法.js'), location.href]);
}

//  async
{
    var _logInOrder = async function _logInOrder(urls) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = urls[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var url = _step.value;

                var text = (await fetch(url)).text();
                var str = (await text).substr(0, 50);
                console.log(str);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    ;
    _logInOrder([encodeURIComponent('./async 函数.js'), encodeURIComponent('./Class 的基本语法.js'), location.href]);
}
//  方法2.因为上面的方法有个缺点,在一个async函数里执行多个await,是阻断执行的.
//  改进方法,让他们可以异步执行.
//  思路:map一个arr,map出来urls的Promise对象,然后再for...of遍历这个arr
{
    var _logInOrder2 = async function _logInOrder2(urls) {
        var arr = urls.map(async function (url) {
            var response = await fetch(url);
            var text = await response.text();
            console.log(text.substr(0, 40), new Date().getTime());
            return text;
        });
        return arr;
    };

    ;
    _logInOrder2([encodeURIComponent('./async 函数.js'), encodeURIComponent('./Class 的基本语法.js'), location.href]);
    //list.then(response=>console.log(response));
}