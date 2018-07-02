const o = {
    a: 1,
    b(c){
        return c
    }
};
var s = o.b(123);
console.log(s);


//  this指向被调用函数的对象
const a = {
    name: "james", getName(){
        return this.name
    }
};
let aName = a.getName();
console.log(aName);
const b = {name: "pierce"};
let bName = a.getName.call(b);
console.log(bName);