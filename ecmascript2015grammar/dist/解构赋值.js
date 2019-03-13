'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

{
    var _ref = ['a'],
        x = _ref[0],
        y = _ref[1],
        z = _ref.slice(2);

    x; // "a"
    y; // undefined
    z; // []
}
{
    var _ref2 = new Set(['a', 'b', 'c']),
        _ref3 = _slicedToArray(_ref2, 3),
        _x = _ref3[0],
        _y = _ref3[1],
        _z = _ref3[2];

    _x; // "a"
}
{
    var _ref4 = [2],
        _ref4$ = _ref4[0],
        _x2 = _ref4$ === undefined ? 1 : _ref4$,
        _ref4$2 = _ref4[1],
        _y2 = _ref4$2 === undefined ? _x2 : _ref4$2; // x=2; y=2

}
{
    var obj = { first: 'hello', last: 'world' };
    var james = obj.first,
        l = obj.last;

    james; // 'hello'
    l; // 'world'
}
{
    var _obj = {
        p: ['Hello', { y: 'World' }]
    };

    var _james = _obj.p,
        _obj$p = _slicedToArray(_obj.p, 2),
        _x3 = _obj$p[0],
        _y3 = _obj$p[1].y;
    //x;// "Hello"
    //y;// "World"


    console.log(_james); // ["Hello", {y: "World"}]
}
{
    var node = {
        loc: {
            start: {
                line: 1,
                column: 5
            }
        }
    };
    var loc = node.loc,
        start = node.loc.start,
        line = node.loc.start.line;
}
{
    var log = Math.log,
        sin = Math.sin,
        cos = Math.cos;
}
{
    var arr = [1, 2, 3];
    var first = arr[0],
        last = arr[arr.length - 1],
        middle = arr[1];

    console.log(first);
    console.log(middle);
    console.log(last);
}
//函数参数解构
{
    var _arr = [[1, 2], [3, 4]].map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            a = _ref6[0],
            b = _ref6[1];

        return a + b;
    });
    console.log(_arr);
}
//为x和y这两个函数参数的属性设置默认值
{
    var move = function move() {
        var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref7$x = _ref7.x,
            x = _ref7$x === undefined ? 0 : _ref7$x,
            _ref7$y = _ref7.y,
            y = _ref7$y === undefined ? 0 : _ref7$y;

        return [x, y];
    };
}
//为函数的参数设置默认值而不是x和y
{
    var _move = function _move() {
        var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0 },
            x = _ref8.x,
            y = _ref8.y;

        return [x, y];
    };
}
//总结
//给谁设置默认值直接给谁加=号

{
    var _x6 = { x: 'ncaa' };
    ncaa = _x6.x;

    console.log(ncaa);
}
//可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号。
{
    // 正确
    b = 3;
    // 正确
    var _ref9 = {};
    d = _ref9.p;
    // 正确
    var _ref10 = [3];
    parseInt.prop = _ref10[0];
    console.log(parseInt.prop);
}