"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function a(_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        aa = _ref2[0],
        bb = _ref2[1],
        cc = _ref2[2];

    console.log("" + aa, "" + bb, "" + cc);
}
a([1, 2]);

function b(_ref3) {
    var aa = _ref3.aa,
        bb = _ref3.bb,
        cc = _ref3.cc;

    console.log("" + aa, "" + bb, "" + cc);
}
b({ aa: 1, bb: 2, cc: 3 });

function c(aa) {
    var prefiexdWords = [aa];

    for (var _len = arguments.length, bb = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        bb[_key - 1] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = bb[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            prefiexdWords.push(val);
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

    return prefiexdWords;
}
var cP = c(1, 2, 3, 4, 5);
console.log(cP);