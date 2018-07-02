function sum(arr, f) {
    if (typeof f === "undefined") {
        f = x=>x;
    }
    return arr.reduce((a, x)=>a += f(x), 0);
}
function ff(x) {
    return x * 100;
}


const arr = [1, 2, 3, 4];
let result = sum(arr, ff);
console.log(result);


//  将传入多个参数的函数转换为传入一个参数的过程叫柯里化 ,curry
function newSummer(f) {
    return (arr)=>sum(arr, f);
}

const brr = [1, 2, 3, 4, 5];
let theNewSummer = newSummer(ff);
result = theNewSummer(brr);
console.log(result);


