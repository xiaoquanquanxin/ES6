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
    //console.log(genObj.next('a'));
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

/**
 * for...of
 * */
{
    let gen = function *() {
        yield 1;
        yield 2;
        return 3;
    };
    let obj = gen();
    for (let key of obj) {
        //console.log(key);
    }
    //console.log(obj.next());
}
/**
 * for...of generator 的 斐波那契
 * */
{
    function * fib(x) {
        let [p,n] = [1, 0];
        while (x) {
            [p, n] = [n, n + p];
            yield n;
            x--;
        }
        return false;
    }

    let fi = fib(20);
    for (let key of fi) {
        //console.log(key);
    }

}

/**
 * for...of 循环对象
 * */
{
    function *gen(x) {
        "use strict";
        let propKeys = Reflect.ownKeys(x);
        for (let key of propKeys) {
            yield {'key': key, 'value': x[key]};
        }
    }

    let obj = {name: 'james', [Symbol('ncaa')]: '??'};
    let g = gen(obj);
    for (let key of g) {
        //console.log(key);
    }
}

{
    //  将Generator部署到Symbol.iterator属性上
    function * objectEntries() {
        "use strict";
        let propKeys = Object.keys(this);
        for (let propKey of propKeys) {
            yield [propKey, this[propKey]]
        }
    }

    let jane = {first: 'jane', last: 'james'};
    jane[Symbol.iterator] = objectEntries;

    for (let [key,value] of jane) {
        //console.log(key, value);
    }

}

/**
 *  扩展运算符\解构赋值\Array.from
 * */
{
    //  解构
    let [x,y,z,w] = num();
    //console.log(x, y, z, w);

    function * num() {
        "use strict";
        yield 1;
        yield 2;
        yield 3;
        return 4;
    }

    //  扩展运算符
    //console.log([...num()]);
    //  Array.from
    //console.log(Array.from(num()));

    //  对象的Symbol.iterator
    let obj = {};
    obj[Symbol.iterator] = num;
    for (let key of obj) {
        //console.log(key)
    }
}


/**
 * Generator.prototype.throw
 * */
{
    function *g() {
        "use strict";
        try {
            yield 1;
            yield 1;
            yield 1;
        } catch (err) {
            console.log(`内部捕获${err}`, `\n由于 Generator 函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的catch语句捕获。`);
        }
        yield 2;
        yield 3;
    }

    let i = g();
    //  执行next是必要的
    i.next();
    try {
        //console.log(i.throw('a'));
        //console.log(i.throw('b'));
    } catch (err) {
        console.log(`外部捕获${err}`)
    }
}

/**
 *  Generator.prototype.return
 * */
{
    function * num() {
        "use strict";
        yield 1;
        //  如果上一次暂停在try块里,则等到finally块里的代码执行完才真正return
        try {
            yield 2;
            yield 3;
        } finally {
            yield 4;
            yield 5;
        }
        yield 6;
    }

    let g = num();
    g.next();
    g.next();
    //console.log(g.return());
    //console.log(g.next());
}

//  *********
/**
 * yield *
 * */
{
    function* foo() {
        yield 'a';
        yield 'b';
    }

    function* bar() {
        yield 'x';
        yield* foo();
        yield 'y';
    }

    // *********************等同于
    {
        function* bar() {
            yield 'x';
            yield 'a';
            yield 'b';
            yield 'y';
        }
    }

    // ***********************等同于
    {
        function* bar() {
            yield 'x';
            for (let v of foo()) {
                yield v;
            }
            yield 'y';
        }
    }

    for (let v of bar()) {
        //console.log(v);
    }
}
{
    function* inner() {
        yield 2;
    }

    function* outer1() {
        yield 1;
        yield inner();
        yield 3;
    }

    var gen = outer1();
    //console.log(gen.next().value);
    //console.log(gen.next().value.next().value);  // 返回一个遍历器对象
    //console.log(gen.next().value);

    //  相当于
    function* outer2() {
        yield 1;
        yield* inner();
        yield 3;
    }

    var gen = outer2();
    //console.log(gen.next().value);
    //console.log(gen.next().value);
    //console.log(gen.next().value);
}
{
    let a = (function* () {
        yield 2;
        yield 3;
    }());
    let delegatingIterator = (function* () {
        yield 1;
        yield* a;
        yield 4;
    }());

    for (let value of delegatingIterator) {
        //console.log(value);
    }
}
//  在内部调用的Generator函数有return语句时
{
    let a = (function *() {
        yield 2;
        yield 3;
        return 4;
    }());
    let b = (function *() {
        yield 1;
        let _temp = ( yield* a);
        yield _temp;
        yield 5;
        return 6;
    }());
    for (let key of b) {
        //console.log(key);
    }
}














