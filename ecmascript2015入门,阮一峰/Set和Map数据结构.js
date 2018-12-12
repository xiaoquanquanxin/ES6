//  set
{
    const s = new Set();
    [1, 2, 3, 1, 2, 3].forEach(x=>s.add(x));
    console.log(s, s.size);
    //  数组去重
    console.log([...new Set([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 7])]);
    console.log(Array.from(new Set([1, 23, 4, 56, 1, 2, 3, 4, 5, 6])));
    //  set认为 +0 和 -0 ，NaN和NaN相等
}

//  Set的方法包括 操作方法 和 遍历方法 两大类
//  操作方法
{
    var s = new Set([1, 2, 3]);
    s.add(4);
    s.delete(3);
    s.has(2);
    s.clear();
}

//  遍历方法
{
    let s = new Set([3, 2, 1, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5]);
    //  Set 结构没有键名，只有键值,所以keys和values的返回值相同
    for (let item of s.keys()) {
        //console.log(item);
    }
    s.forEach(function (val, key) {

    })
}
//  遍历的应用
{
    let arr = [1, , , , 2, 1, 22, 3, 31];
    let s = new Set(arr.filter(x=>x !== undefined).map(x=>x * x));
    console.log(s);
}
//  两个set的并集,交集,差集
{
    let a = new Set([1, 2, 3]);
    let b = new Set([2, 3, 4]);
    let c = new Set([...a, ...b]);
    console.log('并集', c);
    let d = new Set([...a].filter(x=>b.has(x)));
    console.log('交集', d);
    let e = new Set([...c].filter(x=>!(a.has(x) && b.has(x))));
    console.log('差集', e);
}


//  WeakSet
{
    const ws = new WeakSet;
    console.log(ws);
    //  任何有Iterable接口的对象都可以作为WeakSet的参数
    const ws1 = new WeakSet([[], [1], [3, 4]]);
    console.log(ws1);
}
{
    const b = {b: 3};
    const arr = [b, {a: 1}];
    const ws = new WeakSet(arr);
    console.log(ws.has(b));
    console.log(ws.delete(b));
    console.log(ws.add(b));
}


//  Map
{
    const o = {n: 1};
    const m = new Map([['key', 'value'], [o, 'j']]);
    m.set(o, 'james');
    console.log(m.get(o));
    m.has(o);
    console.log(m);
    m.delete(o);
}


//  WeakMap
//  部署私有属性。
{
    const _counter = new WeakMap();
    const _action = new WeakMap();

    class Countdown {
        constructor(counter, action) {
            _counter.set(this, counter);
            _action.set(this, action);
        }

        dec() {
            let counter = _counter.get(this);
            if (counter < 1){
                return;
            }
            counter--;
            console.log(counter);
            _counter.set(this, counter);
            if (counter === 0) {
                _action.get(this)();
            }
        }
    }
    const c = new Countdown(3, () => console.log('DONE'));
    c.dec();
    c.dec();
    c.dec();
    c.dec();
}





































