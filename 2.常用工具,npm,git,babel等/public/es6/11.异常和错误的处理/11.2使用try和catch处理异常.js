const email = null;
try {
    const validateEmail = validate(email);
    console.log(typeof validateEmail);
}
catch (err) {
    console.log(`error : ${err.message}`)
}
function validate(email) {

    return email.test(/@/) ? email : new Error("不是一个email");
}

function a() {
    console.log("a开始");
    b();
    console.log("a结束");
}

function b() {
    console.log("b开始");
    c();
    console.log("b结束");
}

function c() {
    console.log("c开始");
    throw new Error("错误");
    console.log("c结束");
}

try {
    a();
} catch (err) {
    console.log(err.stack);
}