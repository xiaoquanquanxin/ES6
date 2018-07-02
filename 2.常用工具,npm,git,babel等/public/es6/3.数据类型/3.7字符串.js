let currentTemp = 10;
//  模板字符串可以加变量，不用+号拼接
const message = `aaaaaaaaaa${currentTemp} is okey`;
console.log(message);

//  人家模板字符串可以自动换行，而且自带缩进666
const multiline = `line1
line2
          line3`;
console.log(multiline);

//  符号，不能用new关键字创建
const RED = Symbol();
const ORANGE = Symbol("The color of sunset");
console.log(RED);

const obj = {};
obj[RED] = 8;
console.log(obj);


//  for of语法
const hand = [1, 2, 3, 4, 5];
for (let value of hand) {
    console.log(`这个是${value}`);
}
