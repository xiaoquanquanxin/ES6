//  回调就是一个函数,在你需要的时候调用他.通常会把这些回调函数作为参数传递给需求函数

function a(b, c) {
    console.log(b);
    console.log(c);
}
setTimeout(a, 3, '111', 'cc');

//  每当一个函数被调用时,都创建了一个闭包,所有在函数内部创建的变量,只有在被访问的时候才存在.
let i;
//  每次都是12
for (i = 1; i < 12; i++) {
    setTimeout(function () {
        //console.log(i);
    }, 10 * i);
}

//  let j 在循环中定义
for (let j = 1; j < 12; j++) {
    setTimeout(function () {
        //console.log(j)
    }, 10 * j);
}
//  相当于
let k;
for (k = 1; k < 12; k++) {
    (function (i) {
        setTimeout(function () {
            console.log(i)
        }, k * 10);
    }(k));
}