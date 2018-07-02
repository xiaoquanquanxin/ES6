(function (win) {
    win.QueryQ = function (selector) {
        return new QueryQ.prototype.init(selector);
    };
    QueryQ.prototype = {
        constructor: QueryQ,
        init: function (selector) {
            if (!selector) {
                return this;
            }
            var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
            if (typeof selector === "string") {
                //  创建div
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    var arr = selector.split("<");
                    for (var i = arr.length - 1; i >= 0; i--) {
                        //  排除空字符串
                        if (arr[i]) {
                            arr[i] = arr[i].split(">")[0];
                        } else {
                            arr.splice(i, 1);
                        }
                    }
                    //console.log(arr);
                    console.log(arr)
                } else {
                    if (rsingleTag.test(selector)) {

                    } else {

                    }
                }
            } else {
                if (selector instanceof QueryQ) {
                    return this;
                } else if (selector instanceof HTMLElement) {
                    this.context = this[0] = selector;
                    this.length = 1;
                    return this;
                    //this.makeArray(selector, this)
                }
            }
        },
        makeArray: function (arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (this.isArraylike(Object(arr))) {
                    this.merge(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    Array.prototype.push.call(ret, arr);
                }
            }
            return ret;
        },
        isArraylike(obj) {
            if (obj === null) {
                return false
            } else if (typeof obj === "object") {
                var len = 0;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        len++;
                    }
                }
                return len === obj.length;
            }
        },
        merge: function (first, second) {
            var len = +second.length;
            var j = 0;
            var i = first.length;
            while (j < len) {
                first[i++] = second[j++];
            }
            if (len !== len) {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        },
        setRole: function (role) {
            return (role === undefined) || roles[role];
        },
        addClass: function (addClassName) {
            this.el.classList.add(addClassName);
            return this;
        },
        removeClass: function (removeClassName) {
            this.el.classList.remove(removeClassName);
            return this;
        },
        append: function (dom) {
            this.el.appendChild(dom);
            return this;
        },
        appendTo: function (parentDom) {
            parentDom.appendChild(this.el);
            return this;
        },
        css: function (cssObject) {
            if (cssObject !== undefined && cssObject.constructor === Object) {
                for (var key in cssObject) {
                    this.el.style[key] = cssObject[key];
                }
            }
            return this;
        },
        on: function (eventType, fn) {
            if (eventType === undefined === fn) {

            } else {
                this.el.addEventListener(eventType, fn, false);
            }
            return this;
        },
        off: function (eventType, fn) {
            if (eventType === undefined === fn) {

            } else {
                this.el.removeEventListener(eventType, fn, false);
            }
            return this;
        },
        html: function (htmls) {
            if (htmls === undefined) {
                return this.el.innerHTML;
            } else {
                this.el.innerHTML = htmls;
                return this.el;
            }
        },
        text: function (texts) {
            if (texts === undefined) {
                return this.el.innerText;
            } else {
                this.el.innerText = texts;
                return this.el;
            }
        },
        attr: function (attrs, data) {
            if (data === undefined) {
                return this.el.getAttribute(attrs);
            } else {
                this.el.setAttribute(attrs, data);
                return this;
            }
        }
    };
    QueryQ.prototype.init.prototype = QueryQ.prototype;
    for (var key in QueryQ.prototype) {
        Object.defineProperty(QueryQ.prototype, key, {enumerable: false, configurable: false, writable: false});
    }
    window.$ = QueryQ;
    //console.log(QueryQ.prototype)
}(window));
