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
        return new Promise((resolve)=> {
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
    asyncPrint('hello world', 333);

}