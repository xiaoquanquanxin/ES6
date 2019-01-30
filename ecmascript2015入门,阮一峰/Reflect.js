/**
 *  Reflect 13
 *
 *  get
 *  set
 *  has
 *  ownKeys
 *
 *  defineProperty
 *  getPropertyDescriptor
 *  deleteProperty
 *
 *  constructor
 *  setPrototypeOf
 *  getPrototypeOf
 *
 *  apply
 *  isExtensible
 *  preventExtensions
 * */

/**
 * set
 * */
{
    let o = {
        set receiver(value) {
            "use strict";
            this.xxx = value;
        }
    };
    let receiver = {};
    //  如果name属性设置了赋值函数，则赋值函数的this绑定receiver。那么receiver 的 num 有值,而 o 的 name 没有值
    Reflect.set(o, 'receiver', '接收器；接受者', receiver);
    console.log('receiver', receiver);
    console.log('o', o);
}
{
    let p = {
        a: 'a'
    };
    let handler = {
        set(target, key, value, receiver) {
            console.log('set');
            Reflect.set(target, key, value, receiver);
            //  如果不传入receiver则无法触发defineProperty
            //Reflect.set(target, key, value);
        },
        defineProperty(target, key, attribute) {
            console.log('defineProperty', attribute);
            Reflect.defineProperty(target, key, attribute);
        }
    };
    let obj = new Proxy(p, handler);
    obj.a = 'A';
    console.log(obj, p);
}

/**
 * deleteProperty
 * 返回一个布尔值
 * */

/**
 * constructor
 * 等同于new target(...arguments)
 *
 * */
{
    function Greeting(name) {
        "use strict";
        this.name = name;
    }

    const instance = Reflect.construct(Greeting, ['张三']);
    console.log(instance);
}

/**
 * getPrototypeOf
 * 相当于读取__proto__
 *
 * */

/**
 *setPrototypeOf    target , prototype
 * 返回一个布尔值 , 表示设置成功了没有
 * */
{
    const myObj = {name: 'my house is tem'};
    Reflect.setPrototypeOf(myObj, {
        getName: function () {
            return this.name;
        }
    });
    console.log(myObj.getName());
    const fre = Object.freeze({});
    var isFail = Reflect.setPrototypeOf(fre, Array.prototype);
    console.log('isFail是一个布尔值', isFail, fre);
}

/**
 * apply    func , obj用于绑定this , args
 * 相当于Function.prototype.apply.call (func,obj,args)
 * */
{
    const arr = [11, 33, 12, 54, 18, 96];
    const youngest = Reflect.apply(Math.min, null, arr);
    console.log('最大值是', youngest);
    const type = Reflect.apply(Object.prototype.toString, youngest, {});
    console.log(type);
}

/**
 * defineProperty   target , prop , descriptor
 * 返回一个布尔值,表示设置property成功了还是失败了
 * */
{
    let obj = {};
    Reflect.defineProperty(obj, 'pierce', {
        value: 12345,
    });
    const p = new Proxy(obj, {
        defineProperty(target, prop, descriptor){
            "use strict";
            return Reflect.defineProperty(target, prop, descriptor);
        }
    });
    p.name = '12345y';
    console.log(obj, p);
}

/**
 * getOwnPropertyDescriptor     target , prop
 * 如果target不是对象,则抛出错误
 * */

/**
 * isExtensible     target
 * 如果target不是对象,则抛出错误
 * */

/**
 * preventExtensions    target
 * 如果target不是对象,则抛出错误
 * */

/**
 * ownKeys  target
 * 返回全部自身属性,包括symbol属性和不可枚举属性
 * 如果target不是对象,则抛出错误
 * */
{
    const obj = {};
    Reflect.defineProperty(obj, 'name', {
        value: 'james',
    });
    Reflect.defineProperty(obj, Symbol('啦啦啦'), {
        value: 'james',
        enumerable: true,
    });
    console.log(obj);
    console.log('Reflect.ownKeys', Reflect.ownKeys(obj));
    console.log('Object.getOwnPropertyNames', Object.getOwnPropertyNames(obj));
    console.log('Object.getOwnPropertySymbols', Object.getOwnPropertySymbols(obj));
}


/**
 * 观察者模式    Observer mode
 * 函数自动观察数据对象,一旦对象有变化,函数自动执行
 *
 *  观察者模式就是在get里面执行观察者
 *  * */
{
    const queuedObservers = new Set();
    const observe = fn =>queuedObservers.add(fn);
    const observable = obj => new Proxy(obj, {
        set: function (target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            queuedObservers.forEach(observe => observe());
            return result;
        }
    });

    const obj = observable(queuedObservers);
    console.log(obj.aa = 1);
    console.log(queuedObservers);
}