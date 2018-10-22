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
//  赋值数组
{
    const a1 = [1, 2, {name: false}];
    const a2 = [...a1];
    a2.push(3);
    a2[2].name = true;
    console.log(a1, a2);
}
//  合并数组
{
    const a1 = [1, 2, 3];
    const a2 = [11, 12, 13];
    const a3 = [...a1, ...a2];
}
//  字符串
{
    const a1 = [...'hello'];
    console.log(a1);
    //能够正确识别四个字节的 Unicode 字符。
    const a2 = [...'x\uD83D\uDE80y'];
    console.log(a2);
    console.log(a2.reverse().join(''));
}

//  Array.from(),用于将两类对象转换成真正的数组.包括类数组对象和可遍历对象iterator
{
    let arrayLike = {
        '0': 'a',
        //'1': 'b',
        '2': 'c',
        length: 3
    };
    let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
    console.log(arr2);
    //  Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
    let arr3 = Array.from(arrayLike, x => x + '16');
    console.log(arr3);
    //  如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this。

}
//  与扩展运算符的区别
//  任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

//  Array.of
{
    let arr = Array.of(3);
    console.log(arr)
}

//  copyWithin
{

}