//  let 相当于创建了一个作用域
for (let i = 0; i < 4; i++) {
    setTimeout(function () {
        console.log(i)
    }, 555 * i);
}

//  这里的i会报错 , 已经离开作用域了
//console.log(i);

let i = '111111111';
a();
function a() {
    console.log(i);
}