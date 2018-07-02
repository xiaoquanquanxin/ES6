"use strict";

var obj = {
    birth: 1994,
    getAge: function getAge() {
        var _this = this;

        var fn = function fn() {
            console.log(_this);
            return new Date().getFullYear() - _this.birth;
        };
        var tempObj = { name: 1234 }; //  这个tempObj无法call
        /*****
         * 这里的call不会改变fn里面的this.birth，因为this按照构词法绑定了
         * 由于this在箭头函数中已经按照词法作用域绑定了，用call()或者apply()调用箭头函数时，无法对this进行绑定，即传入的第一个参数被忽略：
         * ***/
        return fn.call(tempObj);
    }
};
//console.log(obj.getAge.call({birth: 1111}));        //  这个1111obj还是可以call的

var objA = {};
objA.obj1 = {
    birth: 1990,
    getAge: function getAge() {
        /******
         * 用箭头函数表示的属性方法，this未被指定
         * *********/
        console.log(undefined);
        /*******
         * 就是说，这种箭头函数作为属性方法的情况下，this不会被标识出来，既没有 var _this = this;
         * *******/
        function fn() {
            console.log(this);
        }

        fn();
        //var fn = () => new Date().getFullYear() - this.birth;
        //var tempObj = {name: 1234};
        //return fn.call(tempObj);
    }
};
console.log(objA.obj1.getAge.call());

/*************
 * 总结
 * 这两种写法是不同的，箭头函数是undefined，function是obj1
 * ****************/
//obj1.getAge = ()=> {
//    console.log(this)
//}
//obj1.getAge = function () {
//    console.log(this)
//}


//console.log(obj1.getAge());