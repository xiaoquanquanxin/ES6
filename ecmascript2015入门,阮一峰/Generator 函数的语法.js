{
    function* hello() {
        "use strict";
        yield 'hello';
        yield (function () {
            alert('惰性求值,暂时不执行');
            return 'word';
        }());
        console.log('允许执行了end');
        return 'ending';
    }

    let h = hello();
    //console.log(h);
    //console.log(h.next());
    //console.log(h.next());
    //console.log(h.next());
}

{
    var arr = [1, [[2, 3], 4], [5, 6]];
    var flat = function* (a) {
        var length = a.length;
        for (var i = 0; i < length; i++) {
            var item = a[i];
            if (typeof item !== 'number') {
                yield* flat(item);
            } else {
                //console.log('Hello' + (yield item)); // OK
                yield item;
            }
        }
    };

    let fl = flat(arr);
    fl.next();
    for (var f of fl) {
        //console.log(f);
    }
}

{
    var myIterable = {};
    myIterable[Symbol.iterator] = function* () {
        yield 1;
        yield 12;
        yield 3;
    };

    //console.log([...myIterable]);
    let gen = myIterable[Symbol.iterator]();
    //console.log(gen.next());
}

{
    function* gen() {

    }

    var g = gen();
    //  Generator函数指向返回的遍历器对象的Symbol.iterator属性执行后返回的对象===这个遍历器对象
    //console.log(g, g[Symbol.iterator]() === g);
}

/**
 * next方法,可以向函数内传递参数,作为上一次执行yield表达式的值
 * */
{
    function *f() {
        "use strict";
        for (var i = 0; true; i++) {
            var reset = yield i;
            if (reset) {
                i = -11;
            }
        }
    }

    let g = f();
    //console.log(g.next());
    //console.log(g.next());
    //console.log(g.next());
    //console.log(g.next(1));
    //console.log(g.next());
}

{
    function * foo(x) {
        "use strict";
        let y = 2 * (yield (x + 1));
        let z = yield( y / 3);
        return x + y + z;
    }

    let a = foo(3);
    a.next();
    a.next(3);
    //console.log(a.next(2));
}

{
    function * dataConsumer() {
        "use strict";
        //console.log('Started');
        console.log(`1.${yield}`);
        console.log(`2.${yield}`);
        return 'result';
    }

    let genObj = dataConsumer();
    genObj.next();
    //genObj.next('a');
    //console.log(genObj.next('b'));
}


/**
 *  由于第一个next的参数会被忽略,所以只要在传参之前预调用一个next就行了
 * */
{
    function wrapper(generatorFunction) {
        return function (...args) {
            let generatorObject = generatorFunction(...args);
            generatorObject.next();
            return generatorObject;
        };
    }

    const wrapped = wrapper(function* () {
        console.log(`First input: ${yield}`);
        console.log(`Second input: ${yield}`);
        return 'DONE';
    });

    let wr = wrapped();
    //console.log(wr.next('hello!'));
    //console.log(wr.next('hello!'));


    //  我的
    function gen(x) {
        let obj = (function *() {
            console.log(`第${yield '??'}[1]是:${x}`);
            console.log(`第${yield 'ffff'}[2]是:${x}`);
        }());
        obj.next();
        return obj;
    }

    let b = gen('james');
    //console.log(b.next(1));
    //console.log(b.next(2))
}



















