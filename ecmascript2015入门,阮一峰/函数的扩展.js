//  函数参数默认值
{
    log = (a = 12) => {
        a++
    };
    let a = log();
}
//  作用域
{
    //实际执行的是let x = x，由于暂时性死区的原因，这行代码会报错”x 未定义“。
    //  形参自成作用域
    var x = 1;

    function foo(x = x) {
        // ...
    }

    foo(); // ReferenceError: x is not defined
}
//  作用域
{
    let foo = '外';

    function bar(func = ()=> foo) {
        (()=> {
            let foo = '内';
            console.log(func())
        })();
    }

    bar();
}

{
    var x = 1;
    //  y里面的x先指向同级作用域的x
    function foo(x, y = function () {
        x = 2;
    }) {
        let x = 3;
        y();
        console.log(x);
    }

    foo() // 3
    x // 1
}
//  函数参数默认值的应用
{
    function throwIfMissing() {
        throw new Error('Missing parameter');
    }

    function foo(mustBeProvided = throwIfMissing()) {
        return mustBeProvided;
    }

    foo();// Error: Missing paramete
}
//...rest
{
    function sortNumbers() {
        return Array.prototype.slice.call(arguments).sort();
    }

    //相当于
    const mySortNumbers = (...numbers)=> (numbers.sort());
    //numbers是arguments的纯数组形式
}
//  函数的length属性，不包括 rest 参数,rest参数也不能设置默认值
{
    foo = (a = 1, ...b) => {};
}