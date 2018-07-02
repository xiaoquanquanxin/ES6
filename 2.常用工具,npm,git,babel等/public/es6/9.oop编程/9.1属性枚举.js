const SYM = Symbol();
const o = {a: 1, b: 2, c: 3, [SYM]: 4};
for (let prop in o) {
    if (o.hasOwnProperty(prop)) {
        console.log(o[prop]);
    }
}
console.log("------------");
console.log(Object.keys(o));
Object.keys(o).forEach(prop=>console.log(o[prop]));
console.log("筛出对象的键的首字母为k的值");

const nameObj = {"james": 21, "kg": 32, "kevin": 32, "ky": 1};
let n = Object.keys(nameObj).filter(o=>o.match(/^k/)).map(o=>nameObj[o]);
console.log(n);