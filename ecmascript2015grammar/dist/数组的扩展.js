'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//  扩展运算符
//  展开数组,相当于rest参数的逆运算
{
    var _console, _console2;

    (_console = console).log.apply(_console, [1, 2, 3]);
    (_console2 = console).log.apply(_console2, [1].concat([2, 3, 4], [5]));
    console.log([].concat(_toConsumableArray(document.querySelectorAll('*'))));
    var c = function c() {
        var _console3;

        for (var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++) {
            x[_key] = arguments[_key];
        }

        (_console3 = console).log.apply(_console3, x);
        console.log(x);
    };
    c.apply(undefined, [1].concat([2, 3, 4], [5]));
}
//  替代函数的 apply 方法
{
    var arr = [1, 2, 3, 4, 5];
    Math.max.apply(null, arr);
    Math.max.apply(Math, arr);
}
//  赋值数组
{
    var a1 = [1, 2, { name: false }];
    var a2 = [].concat(a1);
    a2.push(3);
    a2[2].name = true;
    console.log(a1, a2);
}
//  合并数组
{
    var _a = [1, 2, 3];
    var _a2 = [11, 12, 13];
    var a3 = [].concat(_a, _a2);
    console.log(a3);
}
//  字符串
{
    var _a3 = [].concat(_toConsumableArray('hello'));
    console.log(_a3);
    //能够正确识别四个字节的 Unicode 字符。
    var _a4 = [].concat(_toConsumableArray('x\uD83D\uDE80y'));
    console.log(_a4);
    console.log(_a4.reverse().join(''));
}

//  Array.from(),用于将两类对象转换成真正的数组.
//  1.类数组对象
//  2.可遍历对象iterator
{
    var arrayLike = {
        '0': 'a',
        //'1': 'b',
        '2': 'c',
        length: 3
    };
    var arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
    console.log(arr2);
    //  Array.from还可以接受第二个函数参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
    var arr3 = Array.from(arrayLike, function (x) {
        return x + '16';
    });
    console.log(arr3);
    //  如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this。
}
//  与扩展运算符的区别
//  任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

//  Array.of,方法用于将一组值，转换为数组,统一new Array参数为数字的不确定性
{
    var _arr = Array.of(3);
    console.log(_arr);
}

//  copyWithin,将一部分拷贝到某处.参数:修改点,copy起始\终止位置
//  将起始\终止位置处的全部作为一个整体,在修改点处覆盖一次
{
    var _arr2 = [].copyWithin.call({ length: 5, 3: 1 }, 0, 3);
    console.log(_arr2);
}
//  find,findIndex,找到第一个符合要求的值,下标
{
    [1, 23, 4, 5].find(function (x) {
        return x > 10;
    });
    [1, 23, 4, 5].findIndex(function (x) {
        return x > 10;
    });
    //  弥补indexof寻找nan的不足
    [NaN].findIndex(function (y) {
        return Number.isNaN(y);
    });
}
//  fill,填充一个数组
{
    [1, 24].fill(4);
    //  fill方法还可以接受第二个和第三个参数，用于指定填充的 起始位置 和 结束位置 。
    [1, 24].fill(4, 1);
    //  填充的是对象,则填充引用
    var obj = { name: '1' };
    [1, 23, 32].fill(obj, 1);
}
//  entries,keys,values遍历数组.keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历
{
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = ['a', 'b'].entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                index = _step$value[0],
                elem = _step$value[1];

            console.log(index, elem);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    var _arr3 = [1, 2, 3];
    var iterator = _arr3.entries();
    console.log(iterator);
    console.log(iterator.next().value);
    console.log(iterator.next().value);
    console.log(iterator.next().value);
    console.log(iterator.next().value);
}
//  includes,包含某元素
{
    [1, 2, NaN].includes(NaN);
    //  第二个参数表示开始计数的下标,超过数组长度时,按下标为0开始计算
    [1, 23,, 4].includes(undefined, 2);
}
//  数组实例的 flat()，flatMap(),将二维数组拉平为一维数组
{
    //  参数为拉平的层数,可以跳过空位
    [1, 2, 3, 4, [54, 323, 3]].flat(2);
}
//  数组的空位,明确将空位转为undefined。
{
    Array.from(Array(3))[0] === undefined;
    //  扩展运算符转为undefined
    var _ref = [];

    var _ref$slice = _slicedToArray(_ref.slice(0), 1);

    a = _ref$slice[0];

    a === undefined;
    //  copyWithin()会连空位一起拷贝。
    [,, 2, 2,, 2, 2].copyWithin(1, 3, 5) === [, 2,, 2,, 2, 2];
    //  entries,keys,values,find,findIndex
    [1, 3,, 3, 3,, 3].findIndex(function (x) {
        return x === undefined;
    });
}