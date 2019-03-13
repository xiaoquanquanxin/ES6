'use strict';

//  识别大于\uffff的字
{
    var s = '𠮷a';
    s.codePointAt(0).toString(16); // "20bb7"
    s.codePointAt(2).toString(16); // "61"
}

//  转换为大于\uffff的字
{
    String.fromCodePoint(0x20BB7); //吉
}
//  字符串for of遍历可以识别大于\uffff的字
{
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (String.fromCodePoint(0x22222) + 11)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var x = _step.value;

            console.log(x);
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
}
//  unicode正规化
{
    console.log('\u01D1'.normalize() === 'O\u030C'.normalize());
}

//  参数表示开始搜索的位置
{
    var _s = 'hello';
    _s.includes('h');
    _s.endsWith('e', 2);
    _s.startsWith('h');
}
//  重复,参数取整,不可<-1,字符串参数先转为数字
{
    var _s2 = 'ncaa';
    _s2.repeat(2);
    _s2.repeat('0.2'); //  ''
}
//  如果某个字符串不够指定长度，会在头部或尾部补全。
{
    var _x = 'x';
    _x.padStart(5, 'ab'); // 'ababx'
    _x.padStart(4, 'ab'); // 'abax'

    _x.padEnd(5, 'ab'); // 'xabab'
    _x.padEnd(4, 'ab'); // 'xaba'
}
//  如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串
{
    'xxx'.padStart(1, 'ab'); // 'xxx'
}
//  模板字符串
{
    var tmpl = function tmpl(addrs) {
        return '\n  <table>\n  ' + addrs.map(function (addr) {
            return '\n    <tr><td>' + addr.first + '</td></tr>\n    <tr><td>' + addr.last + '</td></tr>\n  ';
        }).join('') + '\n  </table>\n';
    };
}