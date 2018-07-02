"use strict";

function b() {
    console.log(1);
}
var a = b;
a();
b();

//不可以同时使用函数表达式和函数声明,否则表达式可以调用,申明不可用,会报错
var c = function d() {
    console.log(2);
};
c(); //  可以
//d();                //  报错
//因为在js上下文中，函数表达式的优先级高于函数申明