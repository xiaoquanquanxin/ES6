//1.0
(function (win) {
    win.QueryQ = function (options) {
        function CreateElement(options) {
            this.el = document.createElement(options.tagName);
            this.el.innerHTML = options.text || null;
            this.el.className = options.className || options.tagName + "-normal";
            this.init(options);
        }

        CreateElement.prototype = {
            constructor: CreateElement,
            init: function () {
                var isRoles = this.setRole(options.role);
                if (isRoles) {
                    var eventList = Object.keys(options.event || {});
                    var _this = this;
                    eventList.forEach(function (key, i) {
                        //  注册事件
                        _this.el.addEventListener(key, options.event[key], false);
                    });
                } else {
                    this.el.disabled = true;
                    this.el.classList.add("disabled");
                }
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
        return new CreateElement(options);
    }
}(window));
//1.1
(function (win) {
    win.QueryQ = function (options) {
        return new CreateElement(options);
    };
    function CreateElement(options) {
        this.init(options);
    }

    CreateElement.prototype = {
        constructor: CreateElement,
        init: function (options) {
            this.el = document.createElement(options.tagName);
            this.el.innerHTML = options.text || null;
            this.el.className = options.className || options.tagName + "-normal";
            var isRoles = this.setRole(options.role);
            if (isRoles) {
                var eventList = Object.keys(options.event || {});
                var _this = this;
                eventList.forEach(function (key, i) {
                    //  注册事件
                    _this.el.addEventListener(key, options.event[key], false);
                });
            } else {
                this.el.disabled = true;
                this.el.classList.add("disabled");
            }
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
}(window));
//  这时QueryQ的原型只是一个普通方程.而我每次new方程是要对CreateElement这个构造函数进行操作,这本来没什么问题,但如果我想拓展这个QueryQ的话,我几乎无计可施,因为我无法修改CreateElement的原型


(function (win) {
    var QueryQ = function (options) {
        return new QueryQ.fn.init(options);
    };
    QueryQ.prototype = {
        constructor: QueryQ,
        init: function (options) {
            this.el = document.createElement(options.tagName);
            this.el.innerHTML = options.text || null;
            this.el.className = options.className || options.tagName + "-normal";
            var isRoles = this.setRole(options.role);
            if (isRoles) {
                var eventList = Object.keys(options.event || {});
                var _this = this;
                eventList.forEach(function (key, i) {
                    //  注册事件
                    _this.el.addEventListener(key, options.event[key], false);
                });
            } else {
                this.el.disabled = true;
                this.el.classList.add("disabled");
            }
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
    QueryQ.fn = QueryQ.prototype;
    QueryQ.fn.init.prototype = QueryQ.fn;
    win.QueryQ = QueryQ;
}(window));

