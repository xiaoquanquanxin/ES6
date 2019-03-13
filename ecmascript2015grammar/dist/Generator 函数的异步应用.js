"use strict";

/**
 * Thunk函数的实现,传明函数的策略
 * */
{
    var sum = function sum(x, y) {
        return x + y;
    };
    var s = sum(1 + 2, 3);
    console.log(s);
    //  thunk
    var thunk = function thunk(x) {
        return x;
    };
    var t = sum(thunk(1 + 2), 3);
    console.log(t);
}

{

    //var r1 = g.next();
    //r1.value(fn);
    var fn = function fn(err, data) {
        if (err) throw err;
        r1 = g.next(data);
        r1.value(fn);
    };
}