//  作为属性名的Symbol
{
    //  Symbol 值作为对象属性名时，不能用点运算符。
    let s = Symbol('mySymbol');
    let obj = {[s]: 'xxx'};
    console.log(obj[s]);
}

//  遍历
{
    let obj = {name: 1};
    obj[Symbol()] = 123;
    let ops = Object.getOwnPropertySymbols(obj);
    console.log(ops);

    //  Reflect.ownKeys 返回对象的各种类型属性集合
    let oks = Reflect.ownKeys(obj);
    console.log(oks);
}

//  重新使用同一个 Symbol 值
{
    let a = Symbol('xx');
    let b = Symbol.for('xx');
    let c = Symbol.for('xx');
    console.log(a === b, b === c);
    //  Symbol没有登记机制,每次一定是新值
    //  Symbol.for会被登记在全局环境中,如果有已存在则返回已存在的值
}

//  Symbol.keyFor方法返回一个[已登记]的 Symbol 类型值的key。
{
    let a = Symbol.keyFor(Symbol('xxx'));
    let b = Symbol.keyFor(Symbol.for('xxx'));
    console.log(a, b);
}


/**
 * 内置的Symbol属性
 * */
//  Symbol.hasInstance 指向一个内部方法.当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。
{
    class MyClass {
        [Symbol.hasInstance](foo) {
            return foo instanceof Array;
        }
    }
    [] instanceof new MyClass();
}

//  Symbol.isConcatSpreadable 值是一个布尔值 ,表示该对象调用Array.prototype.concat的时候[是否展开]
{
    let a = [1, 2, 3];
    let b = [].concat(a);
    console.log(b);
    a[Symbol.isConcatSpreadable] = false;
    b = [].concat(a);
    console.log(b);

    //  类似数组的对象相反
    let c = {length: 1, 0: 4};
    let d = [].concat(c);
    console.log(d);
    c[Symbol.isConcatSpreadable] = true;
    d = [].concat(c);
    console.log(d);
}

//  Symbol.species 指向一个构造函数,创建衍生对象时调用
//  实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数
{
    class MyArray extends Array {
        static get [Symbol.species]() {
            return Number;
        }
    }
    let a = new MyArray();
    let b = a.map(function () {
    });
    console.log(b instanceof MyArray, b instanceof Array, b instanceof Number, a, b);
}
/**
 * 其他类似,调用对象的某个方法时会调用[Symbol.xx]的方法
*/
