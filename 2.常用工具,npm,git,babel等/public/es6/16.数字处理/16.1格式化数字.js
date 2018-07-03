//  固定小数
const x = 1232552234.1234;
console.log(x.toFixed(3));

//  指数符号    保留精确度
console.log(x.toExponential(4));        //  1.2345e+12

//  固定进度    保留有效数字
console.log(x.toPrecision(4));

//  不同进制    转换为n进制
console.log(x.toString(2));

//