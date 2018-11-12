//  对象的扩展
//  属性的简洁表示法
{
    const a = 'xxx';
    const obj = {
        a, getObj(x, y){
            return {x, y, a}
        }
    };
    console.log(obj.a);

    console.log(obj.getObj(11, 22));
}

//  属性名表达式
{
    let a = 'ncaa';
    let obj = {
        ['name']: 'Griffin', 'first letter': 111, [a]: a,
    };
    console.log(obj)
}

//  方法的 name 属性
{
    const key1 = Symbol('Miaoshu');
    const obj = {
        [key1](){
        }, set a(x) {
        }, get a() {
        }
    };
    //  如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
    const des = Object.getOwnPropertyDescriptor(obj, 'a');
    console.log(des);
    console.log(des.get.name);
    //  如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
    console.log(obj[key1].name)
}

//  两个值相等
{
    Object.is(+0, -0);
    Object.is(NaN, NaN);
}

{
    Object.defineProperty(Object, 'was', {
        value: function (x, y) {
            if (x === y) {
                // 针对+0 不等于 -0的情况
                return x !== 0 || 1 / x === 1 / y;
            }
            // 针对NaN的情况
            return x !== x && y !== y;
        }, configurable: false, enumerable: false, writable: false,
    });
    let res = Object.was(+0, -0);
    console.log(Object.getOwnPropertyDescriptor(Object, 'was'))
    console.log(res)
}

//  合并,所有可枚举属性复制到target , 只复制自身的可枚举属性
{
    const target = {a: 1};
    const source1 = {b: 2};
    const source2 = {a: 2, c: 3};
    Object.assign(target, source1, source2);
    console.log(target);
    //  字符串会以数组形式拷贝进入目标对象,布尔,数字类型会被忽略
    const tar = {};
    const nba = 'nba';
    Object.assign(tar, nba);
    console.log(tar);
}
//  注意:
//  1.浅拷贝,拷贝对象的引用
//  2.同名属性替换
//  3.target为数组时,会被视为对象
//  4.Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法

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
    const getSameObject = (origin) => Object.defineProperties({}, Object.getOwnPropertyDescriptors(origin));
    const _o = {
        set _name(x) {
            this.name = x
        }, get _name() {
            return this.name
        }
    };
    const obj = getSameObject(_o);
    const asobj = Object.assign({}, _o);
    console.log(asobj)
}

//  super指向当前对象的原型对象,只能用在对象的原型方法中
{
    const prot = {
        name: 'parent', b(){
            return this.name
        }
    };
    const obj = {
        name: 'obj', a(){
            "use strict";
            return super.name;
        }, b(){
            "use strict";
            return super.b();
        }
    };
    Object.setPrototypeOf(obj, prot);
    console.log(obj.a());
    //  super方法被调用相当于 Object.getPrototypeOf(this).b.call(this),故有:
    console.log(obj.b());
}

//  解构赋值
{
    console.clear();
    let proto = {
        a: {
            name: 'xx',
        },
    };
    let obj1 = {
        b: 2, c: 3,
    };
    Object.setPrototypeOf(obj1, proto);
    let {a,b} = obj1;
    //  直接解构继承原型属性,可以复制原型属性的引用
    console.log(a, b);
    //  【但是,扩展运算符的解构赋值,不能复制继承自原型对象的属性】！！！！
    //  变量声明语句之中，如果使用解构赋值，扩展运算符后面必须是一个变量名
    let {...x} = obj1;
    console.log(x, x.a);
}
//  解构赋值
//完整克隆一个对象，还拷贝对象原型的属性
{
    const proto = {name: 'origin'};
    const obj = {name: 'obj', james: 'x'};
    Object.setPrototypeOf(obj, proto);
    let clone = {
        '__proto__': Object.getPrototypeOf(obj), ...obj
    };
    console.log(clone);

    let clone1 = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    console.log(clone1);

    //  Object.create( 原型 ， 属性的描述 );
    let clone2 = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
    console.log(Object.getOwnPropertyDescriptors(obj));
    console.log(clone2);
}

//  扩展运算符的参数对象之中，如果有取值函数get，这个函数是会执行的。
{
    let obj1 = {
        get x(){console.log(1)}
    }
    let obj2 = {
        ...{
            get x(){console.log(2)}
        }
    }

}