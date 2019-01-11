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
    //console.log(g, g[Symbol.iterator]() === g);
}