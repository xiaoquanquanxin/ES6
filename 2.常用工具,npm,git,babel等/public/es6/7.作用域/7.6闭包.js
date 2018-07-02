let getName;
{
    let name = 1234;
    getName = function () {
        console.log(name)
    }
}
getName();


const f = (()=> {
    let num = 0;
    return ()=> {
        console.log(`被调用了${++num}次`);
    }
})();
f();
f();
f();


//  es6只有函数可以声明提升
ff();
function ff() {

}

//  临时死区    在es6中才会存在
if (typeof x === "undefined") {
    console.log(1);
} else {
    console.log(x);
}
const x = 1234567890;