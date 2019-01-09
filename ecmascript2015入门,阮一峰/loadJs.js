function loadJs(src) {
    "use strict";
    var script = document.createElement('script');
    script.src = src + '?v=' + Math.random();
    document.head.appendChild(script);
}
function addFn(fn) {
    var oldFn = window.onload;
    if (!oldFn || typeof oldFn !== 'function') {
        window.onload = fn;
        return;
    }
    window.onload = function () {
        oldFn();
        fn();
    }
}
addFn(function () {
    setTimeout(function () {
        var showDiv = document.createElement('div');
        document.body.appendChild(showDiv);
        showDiv.scrollIntoView({
            behavior: "smooth"
        })
    }, 100);
});