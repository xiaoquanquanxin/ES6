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
    function timeout(ms) {
        return new Promise((resolve)=> {
            setTimeout(function () {
                resolve(`???`);
            }, ms);
        });
    };
    async function asyncPrint(value, ms) {
        let a = await timeout(ms).then(function (res) {
            console.log(res);
            return 'then已经执行完了';
        });
        //console.log(a);
        await timeout(ms);
        console.log(a, value);
    };
    //asyncPrint('james', 300);
}
{
    async function timeout(ms) {
        await new Promise((resolve)=> {
            setTimeout(function () {
                resolve('promise');
            }, ms)
        }).then(function (res) {
            console.log(`res:${res}`);
            return 'then已经执行完了';
        });
    };
    async function asyncPrint(value, ms) {
        "use strict";
        let a = await timeout(ms);
        console.log(a, value);
    };
    //asyncPrint('hello world', 333);
}

/**
 * 语法
 * */
{
    //  async函数返回Promise对象
    async function f() {
        if (Math.random() > 0.5) {
            throw new Error('async函数内部报错,会执行catch方法.');
        }
        return 'async函数的返回值';
    };
    (function () {
        return;
        let af = f().then(resolve=> {
            console.log(`${resolve},会成为then方法的then方法的参数`);
        }).catch(function (reject) {
            console.log(`${reject}`)
        });
        console.log(af);
    }());
}
{
    //  async返回的Promise对象的then方法,必须等到async函数内部的每一个await后面的Promise对象执行完,才发生状态改变
    async function f() {
        "use strict";
        await new Promise(resolve=> {
            setTimeout(function () {
                resolve(123)
            }, 333);
        });
        return '这个返回值就是async的实例的then函数的实参.';
    };
    (function () {
        return;
        let af = f().then(resolve=>console.log(`${resolve}:async函数内部的await后面的Promise执行完.`));
        console.log(af);
    }());
}
{
    //  await后面应该是一个promise对象,如果不是,则返回对应的值
    async function f() {
        let a = await '值';
        let b = await new Promise((resolve, reject)=> {
            resolve('promise');
        }).then(resolve=>1);
        return (Math.random() > 0.5 ) ? a : b;
    };
    let af = f();
    //af.then(console.log);
}
{
    //  await后面的promise对象的状态变成reject,则会被await返回的promise实例的catch方法捕捉
    async function f() {
        await Promise.reject('await后面的promise的状态为reject');
        await Promise.resolve('前一个await后面的Promise的实例状态是reject,所以我不执行')
    }

    //f().catch(console.log);
}

{
    //  错误处理
    //  await后面的异步操作出错下:async返回的Promise实例的状态被置为reject
    async function f() {
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
        } catch (err) {

        }
    };
    //f().catch(console.log);
}

//  使用注意点,优化
{
    //  如果多个await命令后的异步操作没有继发关系,则最好让它们同时触发
    function getA() {
        return new Promise(function (resolve) {
            resolve('getA完成');
        })
    };
    function getB() {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve('getB完成');
            }, 333);
        })
    }

    async function f() {
        return await Promise.all([getA(), getB()]);
    }

    //f().then(console.log)
}
{

}