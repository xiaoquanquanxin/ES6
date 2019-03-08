'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//  对象的扩展
//  属性的简洁表示法
{
    var a = 'xxx';
    var obj = {
        a: a, getObj: function getObj(x, y) {
            return { x: x, y: y, a: a };
        }
    };
    console.log(obj.a);

    console.log(obj.getObj(11, 22));
}

//  属性名表达式
{
    var _obj2;

    var _a = 'ncaa';
    var _obj = (_obj2 = {}, _defineProperty(_obj2, 'name', 'Griffin'), _defineProperty(_obj2, 'first letter', 111), _defineProperty(_obj2, _a, _a), _obj2);
    console.log(_obj);
}

//  方法的 name 属性
{
    var _a2, _a3, _obj4, _mutatorMap;

    var key1 = Symbol('Miaoshu');
    var _obj3 = (_obj4 = {}, _defineProperty(_obj4, key1, function () {}), _a2 = 'a', _mutatorMap = {}, _mutatorMap[_a2] = _mutatorMap[_a2] || {}, _mutatorMap[_a2].set = function (x) {}, _a3 = 'a', _mutatorMap[_a3] = _mutatorMap[_a3] || {}, _mutatorMap[_a3].get = function () {}, _defineEnumerableProperties(_obj4, _mutatorMap), _obj4);
    //  如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
    var des = Object.getOwnPropertyDescriptor(_obj3, 'a');
    console.log(des);
    console.log(des.get.name);
    //  如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
    console.log(_obj3[key1].name);
}

//  属性的可枚举性和遍历
{
    //  Reflect.ownKeys,返回对象自身的一切键
    Reflect.ownKeys({});
}

//  返回一个对象属性的描述
{
    Object.getOwnPropertyDescriptor({}, 'name');
    Object.getOwnPropertyDescriptors({});
}
//  针对Object.assign不能正确返回set,get存取器的问题
{
    var getSameObject = function getSameObject(origin) {
        return Object.defineProperties({}, Object.getOwnPropertyDescriptors(origin));
    };
    var _o = {
        set _name(x) {
            this.name = x;
        }, get _name() {
            return this.name;
        }
    };
    var _obj5 = getSameObject(_o);
    var asobj = Object.assign({}, _o);
    console.log(asobj);
}

//  super指向当前对象的原型对象,只能用在对象的原型方法中
{
    var _obj7;

    var prot = {
        name: 'parent', b: function b() {
            return this.name;
        }
    };
    var _obj6 = _obj7 = {
        name: 'obj', a: function a() {
            "use strict";

            return _get(_obj7.__proto__ || Object.getPrototypeOf(_obj7), 'name', this);
        },
        b: function b() {
            "use strict";

            return _get(_obj7.__proto__ || Object.getPrototypeOf(_obj7), 'b', this).call(this);
        }
    };
    Object.setPrototypeOf(_obj6, prot);
    console.log(_obj6.a());
    //  super方法被调用相当于 Object.getPrototypeOf(this).b.call(this),故有:
    console.log(_obj6.b());
}

//  解构赋值
{
    console.clear();
    var proto = {
        a: {
            name: 'xx'
        }
    };
    var obj1 = {
        b: 2, c: 3
    };
    Object.setPrototypeOf(obj1, proto);
    var _a4 = obj1.a,
        b = obj1.b;
    //  直接解构继承原型属性,可以复制原型属性的引用

    console.log(_a4, b);
    //  【但是,扩展运算符的解构赋值,不能复制继承自原型对象的属性】！！！！
    //  变量声明语句之中，如果使用解构赋值，扩展运算符后面必须是一个变量名
    // let {...x} = obj1;
    // console.log(x, x.a);
}

//  解构赋值
//  完整克隆一个对象，还拷贝对象原型的属性
{
    var _proto = { name: 'origin' };
    var _obj8 = { name: 'obj', james: 'x' };
    Object.setPrototypeOf(_obj8, _proto);
    // 写法一
    var clone = {
        // '__proto__': Object.getPrototypeOf(obj), ...obj
    };
    console.log(clone);

    // 写法二
    var clone1 = Object.assign(Object.create(Object.getPrototypeOf(_obj8)), _obj8);
    console.log(clone1);

    // 写法三
    //  Object.create( 原型 ， 属性的描述 );
    var clone2 = Object.create(Object.getPrototypeOf(_obj8), Object.getOwnPropertyDescriptors(_obj8));
    console.log(Object.getOwnPropertyDescriptors(_obj8));
    console.log(clone2);
}

//  扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。
{
    var _obj9 = {
        get x() {
            console.log(1);
        }
    };
    var obj2 = {
        // ...{
        //     get x(){console.log(2)}
        // }
    };
}