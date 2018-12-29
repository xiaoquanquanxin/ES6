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
 * 如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
 * */
{
    let o = {
        set name(value) {
            "use strict";
            this.num = value;
        }
    };
    let receiver = {};
    Reflect.set(o, 'name', 222, receiver);
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
 *setPrototypeOf
 * 返回一个布尔值
 * */
{
    const myObj = {};
    Reflect.setPrototypeOf(myObj, Array.prototype);
    console.log(myObj);
    var isFail = Reflect.setPrototypeOf(Object.freeze({}), {});
    console.log(isFail);
}

/**
 * apply
 * 相当于Function.prototype.apply.call (func,obj,args)
 * */
{
    const arr = [11, 33, 12, 54, 18, 96];
    const youngest = Reflect.apply(Math.min, null, arr);
    console.log(youngest);
    const type = Reflect.apply(Object.prototype.toString, youngest, {});
    console.log(type);
}

/**
 * defineProperty
 * */
{
    let obj = {};
    const p = new Proxy(obj, {
        defineProperty(target, prop, descriptor){
            "use strict";
            return Reflect.defineProperty(target, prop, descriptor);
        }
    });
    p.name = '12345y';
    console.log(p.name);
}





























