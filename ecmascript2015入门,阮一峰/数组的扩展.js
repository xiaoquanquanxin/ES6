//  扩展运算符
//  展开数组,相当于rest参数的逆运算
{
    console.log(...[1, 2, 3]);
    console.log(1, ...[2, 3, 4], 5);
    console.log([...document.querySelectorAll('*')]);
    const c = (...x) => {
        console.log(...x);
        console.log(x)
    };
    c(1, ...[2, 3, 4], 5);
}

//  替代函数的 apply 方法
{
    let arr = [1, 2, 3, 4, 5];
    Math.max.apply(null, arr);
    Math.max(...arr);
}
