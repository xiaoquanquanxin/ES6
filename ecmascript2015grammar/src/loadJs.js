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
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content= "width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no";
    document.head.insertBefore(meta,document.head.children[0]);
});
addFn(function () {
    setTimeout(function () {
        var showDiv = document.createElement('div');
        //document.body.appendChild(showDiv);
        showDiv.scrollIntoView({
            behavior: "smooth"
        })
    }, 100);
});
addFn(function () {
    var link = document.createElement('style');
    link.rel = 'css/text';
    link.innerText = 'body {padding: 0 10px;margin: 0;text-align: justify;word-break: break-all;}.red{color:red} ol{padding-left:30px;}';
    document.head.appendChild(link);
})