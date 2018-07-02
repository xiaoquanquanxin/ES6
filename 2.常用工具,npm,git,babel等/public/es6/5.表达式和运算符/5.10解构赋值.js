const obj = {b: 2, c: 3, d: 4};
//let {a,b,c} = obj;
//console.log(a, b, c);


//  如果你先let 了 a,b,c,那么在解构的时候必须带括号
const obj1 = {b: 2, c: 3, d: 4};
//let a, b, c;
//({a, b, c} = obj);
//console.log(a, b, c);

//  可以解构数组
const arr = [1, 2, 1, 4, 5, 6];
//let [x,y] = arr;
//console.log(x, y);

//  ...语法标识剩下的所有元素 , 如果没有就是[]
let [q,w,...rest] = arr;
console.log(q, w, rest);


//  数组换位
let a = 5;
let b = 10;
[a, b] = [b, a];
console.log(a, b);
