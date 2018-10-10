{
    let [x, y, ...z] = ['a'];
    x;  // "a"
    y; // undefined
    z; // []
}
{
    let [x, y, z] = new Set(['a', 'b', 'c']);
    x;// "a"
}
{
    let [x = 1, y = x] = [2];    // x=2; y=2
}
{
    let obj = {first: 'hello', last: 'world'};
    let { first: james, last: l } = obj;
    james;// 'hello'
    l;// 'world'
}
{
    let obj = {
        p: [
            'Hello',
            {y: 'World'}
        ]
    };
    let { p:james, p: [x, { y }] } = obj;
    //x;// "Hello"
    //y;// "World"
    console.log(james);// ["Hello", {y: "World"}]
}
{
    const node = {
        loc: {
            start: {
                line: 1,
                column: 5
            }
        }
    };
    let { loc, loc: { start }, loc: { start: { line }} } = node;
}
{
    let { log, sin, cos } = Math;
}
{
    let arr = [1, 2, 3];
    let {0:first,[arr.length - 1]:last,[1]:middle} = arr;
    console.log(first);
    console.log(middle);
    console.log(last);
}
//函数参数解构
{
    let arr = [[1, 2], [3, 4]].map(([a, b]) => a + b);
    console.log(arr)
}
//为x和y这两个函数参数的属性设置默认值
{
    function move({x = 0, y = 0} = {}) {
        return [x, y];
    }
}
//为函数的参数设置默认值而不是x和y
{
    function move({x, y} = {x: 0, y: 0}) {
        return [x, y];
    }
}
//总结
//给谁设置默认值直接给谁加=号

{
    ({x: (ncaa)} = {x: 'ncaa'});
    console.log(ncaa);
}
//可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。
