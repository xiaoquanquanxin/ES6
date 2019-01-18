/**
 * Thunk函数的实现,传明函数的策略
 * */
{
    let sum = (x, y)=>x + y;
    let s = sum(1 + 2, 3);
    console.log(s);
    //  thunk
    let thunk = (x)=>x++;
    let t = sum(thunk(1 + 2), 3);
    console.log(t);
}


{
    var r1 = g.next();
    r1.value(fn);
    function fn(err, data) {
        if (err) throw err;
        r1 = g.next(data);
        r1.value(fn);
    }
}