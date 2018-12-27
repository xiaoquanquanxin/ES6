{
    //  new Proxy(target, handler);
    //  handler也是一个对象,用来定制拦截行为
    let obj = new Proxy({count: 2}, {
        get: function (target, key, receiver) {
            console.log('读取', '\n', target, key, receiver);
            return Reflect.get(target, key, receiver);
        }, set: function (target, key, value, receiver) {
            console.log('设置', target, key, value, receiver);
            return Reflect.set(target, key, value, receiver);
        }
    });
    obj.count = '设置的值';
    console.log(obj.count);
    console.log(obj);
}

{
    var pipe = (function () {
        return function (value) {
            var funcStack = [];
            var oproxy = new Proxy({}, {
                get: function (pipeObject, fnName) {
                    if (fnName === 'get') {
                        return funcStack.reduce(function (val, fn) {
                            return fn(val);
                        }, value);
                    }
                    funcStack.push(window[fnName]);
                    return oproxy;
                }
            });

            return oproxy;
        }
    }());

    var double = n => n * 2;
    var pow = n => n * n;
    var reverseInt = n => n.toString().split("").reverse().join("") | 0;

    pipe(3).double.pow.reverseInt.get; // 63
}