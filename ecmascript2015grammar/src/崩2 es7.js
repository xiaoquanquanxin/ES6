(() => {
    /**
     * Service Worker for hsod2.hongshn.xyz.
     * This SW works for PWA.
     * When user visit the site at least twice,
     *   SW caches files for the future visit(s).
     */
    const CACHENAME = 'hsod2-2018.09.20v1';
    const urls = [
    /**
     * These files are important and useful for almost all pages.
     */
        '/',
        '/m/css/mdui.min.css',
        '/m/js/mdui.min.js',
        '/javascripts/vue.min.js',
        '/javascripts/axios.min.js',
    /**
     * Pages of the whole site.
     */
        '/cms',
        '/buglist',
        '/list/auto',
        '/worldbattle/20182',
        '/equip',
    /**
     * Inner world helper assets
     */
        '/m/js/innerWorld.vendors.js',
        '/m/js/innerWorld.js',
        '/m/css/innerWorld.css',
    /**
     * The following files are important and large,
     *   so cache them at the first time.
     */
        '/dist/js/equip.min.js',
        // '/live2d/model/seele/seele.2048/texture_00.png',
        // '/live2d/model/thresa/delisha.2048/texture_00.png',
    /**
     * MicroSoft YaHei Bold
     * Size: 16.0 MB
     */
        '/m/fonts/msyh.woff',
    ];
    const races = [
    /**
     * These data should usually be latest.
     * Sometimes the users have bad network and
     * the cached data can be return for them.
     */
        'data', 'last', 'auto/',
    ];
    const excludes = [
    /**
     * These assets will never be saved.
     */
        'data', 'last', 'nocache', 'auto/', 'details', 'convert', 'gtag',
    /**
     * Avoid Mixed Content Error over HTTPS
     */
        'mihoyo', 'cms/',
    ];
    const statics = [
    /**
     * These statics assets will be saved when the user
     *   visit the same page at twice.
     */
        // libs
        'vue', 'axios', 'mdui', 'html2canvas', 'echarts',
        // resources
        'images', 'icons', 'fonts', 'animation',
        // others
        'manifest', 'live2d', 'spine'
    ];
    let caching = false;
    const laterPrecache = new (class uniqueArray {
        constructor() {
            this.data = [];
            this.length = 0;
        }

        push(item) {
            for (let i of this.data) {
                if (i === item) return;
            }
            this.length++;
            return this.data.push(item);
        };

        pop() {
            if (this.length === 0) return;
            this.length--;
            return this.data.pop();
        };
    });

    self.addEventListener('install', e => {
        console.log('The service worker is installed.');
        checkAndCache();
        self.skipWaiting();
    });

    self.addEventListener('fetch', e => {
        checkAndCache();
        /**
         * Handling FetchEvent.
         * NOTE: that the origin host must be match to the SSL crt,
         *   or FailedToFetch errors will break the app and the SW.
         */
        if (isRequestRaceable(e.request.url)) {
            /**
             * Race requests.
             * Some data should be latest when network is available.
             */
            e.respondWith(caches.match(e.request).then(res => {
                if (res) {
                    const fetchRes = new Promise(async resolve => {
                        const r = await fetch(e.request);
                        if (r && r.status == 200) {
                            // Update cached file.
                            const _r = r.clone();
                            caches.open(CACHENAME).then(cache => {
                                cache.put(e.request, _r);
                            });
                            return resolve(r);
                        } else setTimeout(() => {
                            console.log('Bad Network. Use cached data.');
                            resolve();
                        }, 3000);
                    });
                    const cacheRes = new Promise(resolve => {
                        setTimeout(_ => resolve(res), 2000);
                    });
                    return Promise.race([fetchRes, cacheRes]);
                } else return fetch(e.request).then(res => {
                    let resp = res.clone();
                    if (!res || res.status !== 200) return res;
                    caches.open(CACHENAME).then(cache => {
                        cache.put(e.request, resp);
                    });
                    return res;
                });
            }))
        }
        else if (!isRequestCacheable(e.request.url)) return fetch(e.request);
        else e.respondWith(caches.match(e.request).then(res => {
                if (res) {
                    /**
                     * Return cached response and renew the cache.
                     * Statics files will not be cached again.
                     * This is usually used to update the html page itself.
                     * NOTE: The page will not be updated until next visit.
                     */
                    if (!isRequestStatic(e.request.url)) fetch(e.request).then(_res => {
                        if (!res || res.status !== 200) return res;
                        caches.open(CACHENAME).then(cache => {
                            cache.put(e.request, _res);
                        });
                    }).catch(_ => {
                        // Do nothing if fetch failed.
                    });
                    return res;
                }
                /**
                 * If request is cacheable, cache response for it.
                 */
                return fetch(e.request).then(res => {
                    /**
                     * Res can only be read once. Clone it for cache.
                     */
                    let resp = res.clone();
                    if (!res || res.status !== 200) return res;
                    caches.open(CACHENAME).then(cache => {
                        cache.put(e.request, resp);
                    });
                    return res;
                });
            }));
    });

    self.addEventListener('activate', async e => {
        console.log('Service Worker is activated.');
        /**
         * Merge cached files to latest cache,
         * then delete redundant caches.
         */
        const cacheNames = await caches.keys();
        const C = await caches.open(CACHENAME);
        /**
         * If there is any old cache version, get its cached files
         * and save to current version.
         */
        return Promise.all(cacheNames
            .filter(cacheName => cacheName !== CACHENAME)
            .map(async cacheName => {
                console.log(`[SW] Merging cache [${cacheName}] to [${CACHENAME}].`);
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                return Promise.all(keys
                    .map(async key => {
                        /**
                         * If the key is already existed, skip.
                         */
                        const exist = await C.match(key);
                        if (exist || !isRequestCacheable(key)) return Promise.resolve();
                        const res = await cache.match(key);
                        return C.put(key, res);
                    })
                ).then(_ => {
                    console.log(`[SW] Merged cache [${cacheName}] to [${CACHENAME}].`);
                    return caches.delete(cacheName);
                });
            })
        );
    });

    /**
     * Check and cache files in urls.
     */
    function checkAndCache() {
        if (caching) return;
        caching = true;
        setTimeout(_ => {
            caches.open(CACHENAME).then(cache => {
                for (let url of urls) {
                    cache.match(url).then(res => {
                        if (!res) laterPrecache.push(url);
                    })
                }
                caching = false;
            })
        }, 2000)
    }

    function cacheForUrls(cache, urls, i) {
        /**
         * Recusive caching files.
         * Set timeout for requests to avoid FailedToFetch error.
         */
        setTimeout(() => {
            cache.add(urls[i]).catch(() => {
                console.log('Failed to cache', urls[i]);
                laterPrecache.push(urls[i]);
            });
            if (i < urls.length - 1) cacheForUrls(cache, urls, i + 1);
        }, 200)
    }

    setInterval(_ => {
        /**
         * Check laterPrecache per 5 sec.
         * If laterPrecache is not empty, cache items in it.
         * Else clear timer.
         */
        if (laterPrecache.length) {
            /**
             * NOTE: Here clear the laterPrecache array.
             * If there is still something failing to cache,
             * they will be pushed into laterPrecache again.
             */
            const _urls = [];
            for (let i = 0; i < laterPrecache.length; i++) {
                _urls.push(laterPrecache.pop());
            }
            caches.open(CACHENAME).then(cache => {
                return cacheForUrls(cache, _urls, 0);
            });
        }
    }, 5000);

    function isRequestCacheable(url) {
        /**
         * Cache statics files only.
         */
        if (!url) return false;
        if (url.url) url = url.url;
        for (let e of excludes) {
            if (url.indexOf(e) !== -1) return false;
        }
        return true;
    }

    function isRequestStatic(url) {
        if (!url) return false;
        for (let s of statics) {
            if (url.indexOf(s) !== -1) return true;
        }
        return false;
    }

    function isRequestRaceable(url) {
        if (!url) return false;
        for (let r of races) {
            if (url.indexOf(r) !== -1) return true;
        }
        return false;
    }

})();


function a(t, e, i) {
    i.r(e);
    i("cadf"), i("551c"), i("097d");
    var a = i("2b0e"), s = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {attrs: {id: "app"}}, [i("IwHeader", {attrs: {title: t.title}}), t._m(0), i("IwDrawer", {
            attrs: {
                id: "drawer",
                drawer: t.drawer
            }
        }), i("router-view", {
            staticClass: "main-view mdui-m-t-1",
            attrs: {used: t.used, minify: t.minify},
            on: {update: t.update, "update-equips": t.updateEquips}
        })], 1)
    }, n = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {
            staticClass: "mdui-progress",
            attrs: {id: "progress"}
        }, [i("div", {staticClass: "mdui-progress-indeterminate"})])
    }], r = (i("7f7f"), i("ac4d"), i("8a81"), i("ac6a"), i("bc3a")), o = i.n(r), l = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("header", {staticClass: "mdui-appbar mdui-appbar-fixed"}, [i("div", {staticClass: "mdui-toolbar mdui-color-theme"}, [t._m(0), i("div", {staticClass: "mdui-typo-title"}, [t._v(t._s(t.title))]), i("div", {staticClass: "mdui-toolbar-spacer"}), i("img", {
            staticClass: "favicon",
            attrs: {src: "/images/favicon-r.png"}
        })])])
    }, u = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("span", {
            staticClass: "mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white",
            attrs: {"mdui-drawer": '{target:"#drawer"}'}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("menu")])])
    }], c = window.mdui, d = {
        props: {title: String}, mounted: function () {
            c.mutation()
        }
    }, m = d, p = (i("4f6d"), i("2877")), v = Object(p["a"])(m, l, u, !1, null, "05b807f1", null);
    v.options.__file = "IwHeader.vue";
    var f = v.exports, h = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-drawer mdui-list"}, [t._m(0), t._l(t.drawer, function (e) {
            return i("router-link", {
                key: e.url,
                staticClass: "mdui-list-item mdui-ripple",
                class: {"mdui-list-item-active": e.url == t.$route.path},
                attrs: {to: e.url}
            }, [i("i", {
                staticClass: "mdui-list-item-icon",
                class: {"material-icons mdui-icon": e.icon}
            }, [t._v(t._s(e.icon || ""))]), i("div", {staticClass: "mdui-list-item-content mdui-text-left"}, [t._v(t._s(e.name))])])
        })], 2)
    }, g = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("a", {
            staticClass: "mdui-list-item mdui-ripple",
            attrs: {href: "/"}
        }, [i("i", {staticClass: "mdui-list-item-icon material-icons mdui-icon"}, [t._v("home")]), i("div", {staticClass: "mdui-list-item-content mdui-text-left"}, [t._v("主页")])])
    }], b = window.mdui, y = {
        props: {drawer: Array}, mounted: function () {
            b.mutation("#drawer")
        }
    }, _ = y, w = Object(p["a"])(_, h, g, !1, null, null, null);
    w.options.__file = "IwDrawer.vue";
    var C = w.exports, x = window.mdui, S = x.JQ, $ = {
        name: "app", data: function () {
            return {
                drawer: [{url: "/", name: "里塔助手", icon: "book"}, {
                    url: "/my-equips",
                    name: "我的仓库",
                    icon: "apps"
                }, {url: "/tower", name: "里塔记录", icon: "format_list_numbered"}]
            }
        }, created: function () {
            this.loadUsed()
        }, computed: {
            title: function () {
                var t = "里塔助手", e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.drawer[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        this.$route.path == r.url && (t = r.name)
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t
            }, minify: function () {
                return this.$store.state.minify
            }, used: {
                get: function () {
                    var t = this.$store.getters.used;
                    return t
                }, set: function (t) {
                    return this.$store.commit("used", t)
                }
            }
        }, methods: {
            update: function () {
                this.saveUsed()
            }, updateEquips: function () {
                this.saveUsed()
            }, loadUsed: function () {
                var t = JSON.parse(window.localStorage.getItem("used"));
                this.$store.commit("used", t || [])
            }, saveUsed: function () {
                window.localStorage.setItem("used", JSON.stringify(this.used))
            }
        }, components: {IwHeader: f, IwDrawer: C}, mounted: function () {
            var t = this;
            x.mutation(), o.a.get("/illustrate/data/minify").then(function (e) {
                t.$store.commit("minify", e.data), S("#progress").css("opacity", 0)
            })
        }
    }, q = $, O = (i("034f"), Object(p["a"])(q, s, n, !1, null, null, null));
    O.options.__file = "App.vue";
    var T = O.exports, I = (i("28a5"), i("9393")), E = (i("6b54"), i("2f62"));
    a["a"].use(E["a"]);
    var P = function (t) {
        if (t = t.toString(), t.length > 2)return t;
        for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
        return e + t
    }, k = new E["a"].Store({
        state: {used: {}, equips: {}, raw: {}, $minify: {}, minify: {}},
        mutations: {
            used: function (t, e) {
                var i = {}, a = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                        var l = r.value;
                        l && (i[P(l.id)] = l)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        a || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
                t.used = i
            }, equips: function (t, e) {
                var i = {}, a = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                        var l = r.value;
                        i[l.id] = l
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        a || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
                t.equips = i
            }, raw: function (t, e) {
                var i = {}, a = function (t) {
                    e[t].forEach(function (e) {
                        var a = e.split("$"), s = Object(I["a"])(a, 3), n = s[0], r = s[1], o = s[2];
                        n = P(n), i[n] = {id: n, stars: r, name: o, type: t}
                    })
                };
                for (var s in e)a(s);
                t.raw = i
            }, minify: function (t, e) {
                t.minify = e;
                var i = {}, a = function (t) {
                    e[t].forEach(function (e) {
                        var a = e.split("$"), s = Object(I["a"])(a, 3), n = s[0], r = s[1], o = s[2];
                        n = P(n), i[n] = {id: n, stars: r, name: o, type: t}
                    })
                };
                for (var s in e)a(s);
                t.$minify = i
            }, addEquips: function (t, e) {
                window.log || (window.log = []), window.log.push(e);
                var i = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(i = (r = o.next()).done); i = !0) {
                        var l = r.value;
                        window.log.push(l), a["a"].set(t.equips, l.id, l), a["a"].set(t.used, l.id, {
                            id: l.id,
                            used: l.usage[0] || 0,
                            max: l.usage[1] || 2
                        }), a["a"].set(t.raw, l.id, {
                            id: l.id,
                            stars: l.stars,
                            name: l.name,
                            type: l.type
                        }), window.log.push(t)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        i || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
            }, removeEquips: function (t, e) {
                var i = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(i = (r = o.next()).done); i = !0) {
                        var l = r.value;
                        a["a"].delete(t.equips, l), a["a"].delete(t.used, l), a["a"].delete(t.raw, l)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        i || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
            }, addUsed: function (t, e) {
                var i = t.used[e];
                !i || i.used >= i.max || (i.used += 1)
            }, minusUsed: function (t, e) {
                var i = t.used[e];
                !i || i.used <= 0 || (i.used -= 1)
            }, clearUsed: function (t) {
                for (var e in t.used)t.used[e].used = 0
            }
        },
        actions: {
            add: function (t, e) {
                var i = t.commit, a = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                        var l = r.value;
                        i("add", l)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        a || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
                return Promise.resolve()
            }, remove: function (t, e) {
                var i = t.commit, a = !0, s = !1, n = void 0;
                try {
                    for (var r, o = e[Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                        var l = r.value;
                        i("remove", l)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        a || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
                return Promise.resolve()
            }
        },
        getters: {
            used: function (t) {
                var e = [];
                for (var i in window.log || (window.log = []), t.used)i && t.used[i] && e.push(t.used[i]), window.log.push([i, t.used[i], e.length]);
                return window.log.push(e), e.filter(function (t) {
                    return t
                })
            }, equips: function (t) {
                var e = [];
                for (var i in t.equips)e.push(t.equips[i]);
                return e
            }, raw: function (t) {
                var e = {};
                for (var i in t.raw) {
                    var a = t.raw[i];
                    e[a.type] || (e[a.type] = []), e[a.type].push("".concat(parseInt(a.id), "$").concat(a.stars, "$").concat(a.name))
                }
                return e
            }, ownEquips: function (t) {
                var e = {};
                for (var i in t.used) {
                    var a = t.$minify[i];
                    a && t.used[i].used < t.used[i].max && (e[a.type] || (e[a.type] = []), e[a.type].push("".concat(a.id, "$").concat(a.stars, "$").concat(a.name)))
                }
                return e
            }
        }
    }), N = i("8c4f"), j = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-container doc-container mdui-text-left mdui-typo"}, [i("h1", {staticClass: "doc-title mdui-text-color-theme"}, [t._v("欢迎使用里塔助手")]), i("hr"), t._m(0), i("hr"), i("h3", {staticClass: "doc-title"}, [t._v("碎碎念")]), t._m(1), i("hr"), i("h3", {staticClass: "doc-title"}, [t._v("一些可能有用的数据")]), i("div", {
            staticClass: "mdui-panel",
            attrs: {id: "panel", "mdui-panel": ""}
        }, [i("div", {staticClass: "score mdui-panel-item"}, [t._m(2), i("div", {staticClass: "mdui-panel-item-body"}, [i("IwStaticTable", t._b({staticClass: "table mdui-m-l-1"}, "IwStaticTable", t.score, !1))], 1)]), i("div", {staticClass: "mod-list mdui-panel-item"}, [t._m(3), i("div", {staticClass: "mdui-panel-item-body"}, [i("div", {staticClass: "mdui-panel-item-summary mdui-m-l-3 mdui-m-b-1"}, [t._v("Special Thanks to Wyz_C")]), i("div", {staticClass: "warn"}, [t._v("这是里塔每个模式对应的关卡内容，不是里塔层数！")]), i("IwStaticTable", t._b({staticClass: "table mdui-m-l-1"}, "IwStaticTable", t.modTable, !1))], 1)])])])
    }, A = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("blockquote", {staticClass: "data-hint warn"}, [t._v("搞事学园不记录任何用户数据 , \n所有用户数据只保存在本地 , \n清理浏览器缓存/使用无痕浏览等可能会导致数据丢失 , \n请谨慎保管数据！"), i("footer", [t._v("—— 买不起服务器的█豆")])])
    }, function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {attrs: {id: "about"}}, [i("div", {staticClass: "warn"}, [t._v("强烈建议使用电脑 , 手机由于屏幕太小 , 显示和操作都会比较复杂.")]), i("h5", [t._v("关于『我的仓库』")]), i("div", {
            staticClass: "mdui-typo",
            attrs: {id: "about-equips"}
        }, [i("p", [t._v("使用右下角的按钮栏添加/删除装备 , 设置按钮里可以批量添加装备 , 但装备数量太多可能有性能问题 , 请根据设备性能选择性使用.")]), i("p", [t._v("只有在仓库添加的装备才能在『里塔记录』里使用 , 删除装备会自动从里塔记录里删掉对应的使用记录.")]), i("p", [t._v("在里塔助手里 , 五六星使魔是可以并存的 , 请注意分配次数.")])]), i("h5", [t._v("关于『里塔记录』")]), i("div", {
            staticClass: "mdui-typo",
            attrs: {id: "about-helper"}
        }, [i("p", [t._v("右下角的『编辑/退出』按钮可以切换编辑模式和阅读模式 "), i("del", [t._v(", 可以用来截图")])]), i("p", [t._v("『导入/导出』按钮可以一键导入里塔配置(感谢测试服大佬们提供数据)、导出记录 , 如有必要请自行备份数据.")])]), i("div", {staticClass: "warn"}, [t._v("再次强调 , 搞事学园不记录任何用户数据 , \n所有用户数据只保存在本地 , \n请谨慎保管数据！")])])
    }, function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-panel-item-header"}, [i("div", {staticClass: "mdui-panel-item-title"}, [t._v("得分倾向参考")]), i("i", {staticClass: "mdui-panel-item-arrow mdui-icon material-icons"}, [t._v("keyboard_arrow_down")])])
    }, function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-panel-item-header"}, [i("div", {staticClass: "mdui-panel-item-title"}, [t._v("里塔模式表")]), i("i", {staticClass: "mdui-panel-item-arrow mdui-icon material-icons"}, [t._v("keyboard_arrow_down")])])
    }], D = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "iw-table-container mdui-container"}, [i("table", {staticClass: "iw-table mdui-col-xs-12"}, [i("thead", t._l(t.head, function (e) {
            return t.head ? i("tr", t._l(e, function (e) {
                return i("th", {staticClass: "mdui-p-x-1"}, [t._v(t._s(e))])
            })) : t._e()
        })), i("tbody", t._l(t.body, function (e, a) {
            return t.body ? i("tr", {class: a % 2 ? "odd" : "even"}, t._l(e, function (e, a) {
                return i(t.templates[a], t._b({
                    key: e.id,
                    tag: "td",
                    staticClass: "mdui-p-x-1",
                    attrs: {options: t.options}
                }, "td", e, !1))
            })) : t._e()
        }))])])
    }, F = [], J = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {
            staticClass: "equip-data",
            class: t.options.showText ? "full" : "mini"
        }, [i("img", {
            staticClass: "equip-img", attrs: {async: "", src: t.src}, on: {
                "~error": function (e) {
                    return t.notFound(e)
                }
            }
        }), i("img", {staticClass: "equip-container", attrs: {src: t.container}}), i("div", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.options.showText,
                expression: "options.showText"
            }], staticClass: "equip-stars"
        }, t._l(parseInt(t.stars), function (t) {
            return i("img", {staticClass: "equip-star", attrs: {src: "images/star-full.png"}})
        })), i("div", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.options.showText,
                expression: "options.showText"
            }], staticClass: "equip-name"
        }, [t._v(t._s(t.name))]), i("div", {staticClass: "equip-slot"}, [t._t("default")], 2)])
    }, L = [], B = {
        props: {
            id: String,
            stars: String,
            name: String,
            selected: Boolean,
            options: {showText: Boolean, selectable: Boolean}
        }, data: function () {
            return {src: ""}
        }, created: function () {
            this.src = "https://static.image.mihoyo.com/hsod2_webview/images/broadcast_top/equip_icon/jpg/" + this.idToString(this.id) + ".jpg"
        }, computed: {
            container: function () {
                var t = "images/equip";
                return this.options.showText || (t += "-mini"), this.selected && (t += "-selected"), t + ".png"
            }
        }, methods: {
            idToString: function (t) {
                t = t.toString();
                for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
                return e + t
            }, toggleSelected: function () {
                this.options.selectable && (this.selected = !this.selected)
            }, notFound: function () {
                this.src = "https://static.image.mihoyo.com/hsod2_webview/images/broadcast_top/equip_icon/png/" + this.idToString(this.id) + ".png"
            }
        }
    }, Q = B, U = (i("fe45"), Object(p["a"])(Q, J, L, !1, null, null, null));
    U.options.__file = "EquipData.vue";
    var M = U.exports, R = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("td", {staticClass: "simple-text"}, [t.editable ? i("input", {
            domProps: {value: t.value},
            on: {
                input: function (e) {
                    t.input(e)
                }
            }
        }) : i("span", [t._v(t._s(t.value))])])
    }, H = [], W = (i("c5f6"), {
        props: {value: String, id: [String, Number], editable: Boolean}, data: function () {
            return {val: 0}
        }, created: function () {
            this.val = this.value
        }, methods: {
            input: function (t) {
                this.val = t.target.value, this.$emit("input", [this.id, this.val])
            }
        }
    }), z = W, Y = (i("aff3"), Object(p["a"])(z, R, H, !1, null, "ebc157a8", null));
    Y.options.__file = "SimpleText.vue";
    var G = Y.exports, K = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("td", {staticClass: "simple-number"}, [t.editable ? i("input", {
            attrs: {type: "number"},
            domProps: {value: t.value},
            on: {
                input: function (e) {
                    t.input(e)
                }
            }
        }) : i("span", [t._v(t._s(t.value))])])
    }, V = [], X = {
        props: {value: [Number, String], id: [String, Number], editable: Boolean}, data: function () {
            return {val: 0}
        }, created: function () {
            "number" !== typeof this.value ? this.val = Number(this.value) : this.val = this.value
        }, methods: {
            input: function (t) {
                this.val = parseInt(t.target.value), this.$emit("input", [this.id, this.val])
            }
        }
    }, Z = X, tt = (i("4a4f"), Object(p["a"])(Z, K, V, !1, null, "dcab18cc", null));
    tt.options.__file = "SimpleNumber.vue";
    var et = tt.exports, it = {
        props: {templates: Array, head: Array, body: Array, options: Object},
        components: {EquipData: M, SimpleText: G, SimpleNumber: et}
    }, at = it, st = (i("7f3f"), Object(p["a"])(at, D, F, !1, null, "748733f4", null));
    st.options.__file = "IwStaticTable.vue";
    var nt = st.exports, rt = window.mdui, ot = {
        templates: ["SimpleText", "SimpleNumber", "SimpleNumber", "SimpleNumber", "SimpleNumber"],
        head: [["", "击杀", "连击", "被击", "时间"]],
        body: [[{value: "速", id: "1-0"}, {value: 1, id: "1-1"}, {value: 2, id: "1-2"}, {value: 0, id: "1-3"}, {
            value: 3,
            id: "1-4"
        }], [{value: "技", id: "2-0"}, {value: 4, id: "2-1"}, {value: 2, id: "2-2"}, {value: 0, id: "2-3"}, {
            value: .5,
            id: "2-4"
        }], [{value: "御", id: "3-0"}, {value: 2, id: "3-1"}, {value: 1, id: "3-2"}, {value: 4, id: "3-3"}, {
            value: 0,
            id: "3-4"
        }], [{value: "统", id: "4-0"}, {value: 1, id: "4-1"}, {value: 1, id: "4-2"}, {value: 1, id: "4-3"}, {
            value: .5,
            id: "4-4"
        }]]
    }, lt = {
        components: {IwStaticTable: nt}, data: function () {
            return {mods: [], score: ot}
        }, mounted: function () {
            var t = this;
            rt.JQ("#progress").css("opacity", 1), o.a.get("/innerWorld/data/mod").then(function (e) {
                t.mods = e.data, rt.JQ("#progress").css("opacity", 0)
            }), rt.mutation("#panel")
        }, computed: {
            modTable: function () {
                var t = {
                    templates: ["SimpleNumber", "SimpleText", "SimpleText"],
                    head: [["", "模式名", "描述"]],
                    body: []
                }, e = 0;
                for (var i in this.mods)e++, t.body.push([{value: e, id: "id" + e}, {
                    value: i,
                    id: "name" + e
                }, {value: this.mods[i], id: "desc" + e}]);
                return t
            }
        }
    }, ut = lt, ct = (i("e0fd"), Object(p["a"])(ut, j, A, !1, null, "3c2a9aba", null));
    ct.options.__file = "Home.vue";
    var dt = ct.exports, mt = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "my-equips"}, [i("IwStore", {
            attrs: {
                items: t.equips,
                options: t.options
            }
        }), i(t.dialog, {
            tag: "div",
            staticClass: "mdui-dialog",
            attrs: {id: "dialog", title: t.dialogTitle, all: t.itemsToSelect, raw: t.raw},
            on: {select: t.select}
        }), i("div", {
            staticClass: "mdui-fab-wrapper",
            attrs: {id: "actions", "mdui-fab": '{trigger: "hover"}'}
        }, [t._m(0), i("div", {staticClass: "mdui-fab-dial"}, [i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "回到顶部", position: "left"}'},
            on: {click: t.backToTop}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("publish")])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "显示/隐藏装备名", position: "left"}'},
            on: {click: t.toggleText}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v(t._s(t.options.showText ? "format_strikethrough" : "title"))])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "添加装备", position: "left"}'},
            on: {
                click: function (e) {
                    t.showDialog("EquipSelector", "add")
                }
            }
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("add")])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "移除装备", position: "left"}'},
            on: {
                click: function (e) {
                    t.showDialog("EquipSelector", "remove")
                }
            }
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("delete_forever")])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "数据设置", position: "left"}'},
            on: {
                click: function (e) {
                    t.showDialog("StoreSetting", "setting")
                }
            }
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("settings")])])])])], 1)
    }, pt = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("button", {staticClass: "mdui-fab mdui-ripple mdui-color-theme-accent"}, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("menu")]), i("i", {staticClass: "mdui-icon material-icons mdui-fab-opened"}, [t._v("list")])])
    }], vt = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "iw-store"}, [i("div", {staticClass: "mdui-container mdui-p-x-0"}, t._l(t.itemsInPage, function (e) {
            return i("EquipData", t._b({
                key: e.id,
                class: {polluted: e.usage[0] == e.usage[1]},
                attrs: {options: t.options}
            }, "EquipData", e, !1), [t._v(t._s(e.usage[0] + " / " + e.usage[1]))])
        })), t.items.length ? i("div", {staticClass: "mdui-container"}, [i("div", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.totalPage > 1,
                expression: "totalPage > 1"
            }], staticClass: "paging mdui-textfield mdui-m-t-2 mdui-col-xs-12 mdui-col-lg-6"
        }, t._l(t.pages, function (e) {
            return i("a", {
                staticClass: "mdui-btn mdui-ripple mdui-p-x-1",
                class: {disabled: e == t.currentPage + 1 || "..." == e},
                attrs: {disabled: e == t.currentPage + 1 || "..." == e},
                on: {
                    click: function (i) {
                        t.paging(e)
                    }
                }
            }, [t._v(t._s(e))])
        })), i("div", {staticClass: "settings mdui-m-t-1 mdui-container mdui-col-xs-12 mdui-col-lg-6"}, [i("div", {staticClass: "items-per-page mdui-textfield"}, [i("label", {staticClass: "mdui-textfield-label"}, [t._v("每页显示数量")]), i("input", {
            directives: [{
                name: "model",
                rawName: "v-model.number",
                value: t.itemsPerPage,
                expression: "itemsPerPage",
                modifiers: {number: !0}
            }],
            staticClass: "mdui-textfield-input",
            attrs: {type: "number"},
            domProps: {value: t.itemsPerPage},
            on: {
                input: function (e) {
                    e.target.composing || (t.itemsPerPage = t._n(e.target.value))
                }, blur: function (e) {
                    t.$forceUpdate()
                }
            }
        })]), i("div", {staticClass: "select mdui-textfield"}, [t._v("排序 : "), i("select", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.sortOption,
                expression: "sortOption"
            }], staticClass: "mdui-select", on: {
                change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (t) {
                        var e = "_value" in t ? t._value : t.value;
                        return e
                    });
                    t.sortOption = e.target.multiple ? i : i[0]
                }
            }
        }, [i("option", {attrs: {value: ""}}, [t._v("(无)")]), t._l(t.sortOptions, function (e, a) {
            return i("option", {domProps: {value: a}}, [t._v(t._s(e))])
        })], 2)]), i("div", {staticClass: "select type-select mdui-textfield"}, [t._v("星级(≥) : "), i("select", {
            directives: [{
                name: "model",
                rawName: "v-model.number",
                value: t.starOption,
                expression: "starOption",
                modifiers: {number: !0}
            }], staticClass: "mdui-select", on: {
                change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (e) {
                        var i = "_value" in e ? e._value : e.value;
                        return t._n(i)
                    });
                    t.starOption = e.target.multiple ? i : i[0]
                }
            }
        }, t._l(7, function (e) {
            return i("option", {domProps: {value: e}}, [t._v(t._s(e))])
        }))]), i("div", {staticClass: "select star-select mdui-textfield"}, [t._v("类型 : "), i("select", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.typeOption,
                expression: "typeOption"
            }], staticClass: "mdui-select", on: {
                change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (t) {
                        var e = "_value" in t ? t._value : t.value;
                        return e
                    });
                    t.typeOption = e.target.multiple ? i : i[0]
                }
            }
        }, [i("option", {attrs: {value: ""}}, [t._v("全部")]), i("option", {attrs: {value: "weapon"}}, [t._v("武器")]), i("option", {attrs: {value: "costume"}}, [t._v("衣服")]), i("option", {attrs: {value: "passive_skill"}}, [t._v("徽章")]), i("option", {attrs: {value: "pet"}}, [t._v("使魔")])])])])]) : i("div", {staticClass: "mdui-container"}, [i("p", [t._v("仓库空空如也……快点击右下角添加装备吧~")])])])
    }, ft = [], ht = (i("55dd"), {
        props: {items: Array, options: Object},
        components: {EquipData: M},
        data: function () {
            return {
                currentPage: 0,
                itemsPerPage: 90,
                sortOptions: {positive: "正序", invert: "倒序", stars: "星级", type: "类型", usage: "污染"},
                sortFns: {
                    positive: function (t, e) {
                        return parseInt(t.id) - parseInt(e.id)
                    }, invert: function (t, e) {
                        return parseInt(e.id) - parseInt(t.id)
                    }, stars: function (t, e) {
                        return t.stars === e.stars ? parseInt(t.id) - parseInt(e.id) : parseInt(t.stars) - parseInt(e.stars)
                    }, type: function (t, e) {
                        if (t.type === e.type)return parseInt(t.id) - parseInt(e.id);
                        var i = {weapon: 1, costume: 2, passive_skill: 3, pet: 4};
                        return i[t.type] - i[e.type]
                    }, usage: function (t, e) {
                        var i = t.usage[1] - t.usage[0], a = e.usage[1] - e.usage[0];
                        return a - i
                    }
                },
                sortOption: "",
                typeOption: "",
                starOption: 1
            }
        },
        computed: {
            sortedItems: function () {
                var t = this, e = this.items;
                return e = e.filter(function (e) {
                    var i = e.stars, a = e.type;
                    return i = parseInt(i), i >= t.starOption && -1 !== a.indexOf(t.typeOption)
                }), this.sortFns[this.sortOption] ? e.sort(this.sortFns[this.sortOption]) : e
            }, totalPage: function () {
                return Math.floor(this.sortedItems.length / this.itemsPerPage) + 1
            }, itemsInPage: function () {
                for (var t = this.currentPage * this.itemsPerPage, e = t + this.itemsPerPage, i = [], a = t; a < e; a++)this.sortedItems[a] && i.push(this.sortedItems[a]);
                return i
            }, pages: function () {
                var t = this.totalPage, e = this.currentPage, i = [];
                if (t <= 5)for (var a = 1; a <= t; a++)i.push(a); else i = e < 2 ? [1, 2, 3, "...", t - 2, t - 1, t] : 4 == e ? [1, 2, 3, 4, 5, "...", t] : e == t - 3 ? [1, 2, "...", t - 3, t - 2, t - 1, t] : e > t - 3 ? [1, 2, "...", t - 2, t - 1, t] : [1, "...", e, e + 1, e + 2, "...", t];
                return i.push(">", ">|"), i.unshift("|<", "<"), i
            }
        },
        methods: {
            paging: function (t) {
                if ("number" === typeof t)return this.currentPage = t - 1;
                var e = this.currentPage;
                switch (t) {
                    case"|<":
                        e = 0;
                        break;
                    case"<":
                        e -= 1;
                        break;
                    case">":
                        e += 1;
                        break;
                    case">|":
                        e = this.totalPage;
                        break
                }
                return e < 0 && (e = 0), e >= this.totalPage && (e = this.totalPage - 1), this.currentPage = e
            }
        },
        watch: {
            totalPage: function (t) {
                this.currentPage >= t && (this.currentPage = t - 1)
            }, currentPage: function (t) {
                t < 0 && (this.currentPage = 0)
            }
        }
    }), gt = ht, bt = (i("a7ff"), Object(p["a"])(gt, vt, ft, !1, null, "07dc1136", null));
    bt.options.__file = "IwStore.vue";
    var yt = bt.exports, _t = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "equip-selector"}, [t.title ? i("div", {staticClass: "mdui-dialog-title mdui-toolbar"}, [i("span", {staticClass: "mdui-typo-title"}, [t._v(t._s(t.title))]), i("div", {staticClass: "mdui-toolbar-spacer"}), i("div", {staticClass: "search mdui-textfield mdui-textfield-expandable mdui-float-right"}, [t._m(0), i("input", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.searchInput,
                expression: "searchInput"
            }],
            staticClass: "mdui-textfield-input",
            attrs: {type: "text", placeholder: "搜索"},
            domProps: {value: t.searchInput},
            on: {
                input: function (e) {
                    e.target.composing || (t.searchInput = e.target.value)
                }
            }
        }), i("button", {
            staticClass: "mdui-textfield-close mdui-btn mdui-btn-icon", on: {
                click: function (e) {
                    t.searchInput = ""
                }
            }
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("close")])])])]) : t._e(), t.equips[t.currentPage] ? i("div", {staticClass: "mdui-dialog-content"}, t._l(t.equips[t.currentPage], function (e) {
            return i("EquipData", t._b({
                key: e.id,
                attrs: {selected: t.selected[e.id] || !1, options: t.options},
                nativeOn: {
                    click: function (i) {
                        t.select(e)
                    }
                }
            }, "EquipData", e, !1), [i("span", {staticClass: "stars"}, [t._v(t._s(e.stars) + "★")])])
        })) : i("div", {staticClass: "mdui-dialog-content"}, [t._v("啊哦，空空如也……")]), i("div", {staticClass: "mdui-dialog-actions"}, [i("div", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.pages.length > 1,
                expression: "pages.length > 1"
            }], staticClass: "paging mdui-p-b-1"
        }, t._l(t.pages, function (e) {
            return i("a", {
                staticClass: "mdui-btn mdui-ripple mdui-p-x-1",
                class: {disabled: e == t.currentPage + 1 || "..." == e},
                attrs: {disabled: e == t.currentPage + 1 || "..." == e},
                on: {
                    click: function (i) {
                        t.paging(e)
                    }
                }
            }, [t._v(t._s(e))])
        })), i("div", {staticClass: "mdui-toolbar mdui-p-x-2"}, [t._v("星级筛选(≥): "), i("select", {
            directives: [{
                name: "model",
                rawName: "v-model.number",
                value: t.starFilter,
                expression: "starFilter",
                modifiers: {number: !0}
            }], staticClass: "mdui-select", on: {
                change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (e) {
                        var i = "_value" in e ? e._value : e.value;
                        return t._n(i)
                    });
                    t.starFilter = e.target.multiple ? i : i[0]
                }
            }
        }, t._l(7, function (e) {
            return i("option", [t._v(t._s(e))])
        })), i("div", {staticClass: "mdui-toolbar-spacer"}), i("button", {
            staticClass: "mdui-btn mdui-ripple mdui-shadow-1 mdui-color-red-400",
            on: {click: t.clearSelected}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("close")])]), i("button", {
            staticClass: "mdui-btn mdui-ripple mdui-shadow-1",
            on: {click: t.confirmSelected}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("done")])])])])])
    }, wt = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("button", {staticClass: "mdui-textfield-icon mdui-btn mdui-btn-icon"}, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("search")])])
    }], Ct = i("8afe"), xt = {
        props: {all: Object, title: String, single: Boolean}, data: function () {
            return {
                selected: {},
                currentPage: 0,
                searchInput: "",
                starFilter: 1,
                options: {showText: !1, selectable: !0}
            }
        }, computed: {
            allEquips: function () {
                var t = [], e = [];
                for (var i in this.all)e.push.apply(e, Object(Ct["a"])(this.all[i]));
                for (var a = 0; a < e.length; a++) {
                    var s = e[a], n = s.split("$"), r = parseInt(n[0]), o = parseInt(n[1]), l = n[2];
                    o >= this.starFilter && -1 !== l.indexOf(this.searchInput) && t.push({
                        id: r.toString(),
                        stars: o.toString(),
                        name: l
                    })
                }
                return t
            }, equips: function () {
                var t = [], e = [], i = !0, a = !1, s = void 0;
                try {
                    for (var n, r = this.allEquips[Symbol.iterator](); !(i = (n = r.next()).done); i = !0) {
                        var o = n.value;
                        e.push(o), 30 === e.length && (t.push(e), e = [])
                    }
                } catch (t) {
                    a = !0, s = t
                } finally {
                    try {
                        i || null == r.return || r.return()
                    } finally {
                        if (a)throw s
                    }
                }
                return e.length && t.push(e), t
            }, totalPage: function () {
                return this.equips.length
            }, pages: function () {
                var t = this.totalPage, e = this.currentPage, i = [];
                if (t <= 5)for (var a = 1; a <= t; a++)i.push(a); else i = e < 2 ? [1, 2, 3, "...", t] : 3 == e ? [1, 2, 3, 4, "..."] : e == t - 3 ? ["...", t - 3, t - 2, t - 1, t] : e > t - 3 ? [1, "...", t - 2, t - 1, t] : ["...", e, e + 1, e + 2, "..."];
                return i.push(">", ">|"), i.unshift("|<", "<"), i
            }
        }, methods: {
            select: function (t) {
                var e = t.id;
                this.selected[e] ? this.$set(this.selected, e, !1) : this.$set(this.selected, e, !0), this.single && this.confirmSelected()
            }, clearSelected: function () {
                for (var t in this.selected)this.$set(this.selected, t, !1);
                this.$emit("select", {type: "cancel"})
            }, confirmSelected: function () {
                var t = [];
                for (var e in this.selected)this.selected[e] && (t.push(e), this.$set(this.selected, e, !1));
                this.$emit("select", {type: "confirm", data: t})
            }, paging: function (t) {
                if ("number" === typeof t)return this.currentPage = t - 1;
                var e = this.currentPage;
                switch (t) {
                    case"|<":
                        e = 0;
                        break;
                    case"<":
                        e -= 1;
                        break;
                    case">":
                        e += 1;
                        break;
                    case">|":
                        e = this.totalPage;
                        break
                }
                return e < 0 && (e = 0), e >= this.totalPage && (e = this.totalPage - 1), this.currentPage = e
            }
        }, components: {EquipData: M}, watch: {
            totalPage: function (t) {
                this.currentPage > t - 1 && (this.currentPage = t - 1)
            }, currentPage: function (t) {
                t < 0 && (this.currentPage = 0)
            }
        }
    }, St = xt, $t = (i("05c0"), Object(p["a"])(St, _t, wt, !1, null, "20cc7bf5", null));
    $t.options.__file = "EquipSelector.vue";
    var qt = $t.exports, Ot = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "store-setting"}, [t.title ? i("div", {staticClass: "mdui-dialog-title"}, [i("span", {staticClass: "mdui-typo-title"}, [t._v(t._s(t.title))])]) : t._e(), i("div", {staticClass: "mdui-dialog-content"}, [i("div", {staticClass: "operations mdui-p-b-1"}, [i("button", {
            staticClass: "mdui-btn mdui-ripple mdui-shadow-2",
            on: {click: t.addSome}
        }, [t._v("按星级添加")]), i("div", {staticClass: "tip mdui-m-l-2 mdui-text-left"}, [t._v("添加 ≥"), i("select", {
            directives: [{
                name: "model",
                rawName: "v-model.number",
                value: t.minStar,
                expression: "minStar",
                modifiers: {number: !0}
            }], staticClass: "mdui-select mdui-m-l-1", on: {
                change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (e) {
                        var i = "_value" in e ? e._value : e.value;
                        return t._n(i)
                    });
                    t.minStar = e.target.multiple ? i : i[0]
                }
            }
        }, t._l(7, function (e) {
            return i("option", [t._v(t._s(e))])
        })), t._v(" 星的装备")])]), t._l(t.operations, function (e) {
            return i("div", {staticClass: "operations mdui-p-b-1"}, [i("button", {
                staticClass: "mdui-btn mdui-ripple mdui-shadow-2",
                on: {
                    click: function (i) {
                        t.operate(e.opr)
                    }
                }
            }, [t._v(t._s(e.name))]), i("div", {staticClass: "tip mdui-m-l-2 mdui-text-left"}, [t._v(t._s(e.tip))])])
        }), i("div", {staticClass: "operations input mdui-p-x-2"}, [i("input", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.rawText,
                expression: "rawText"
            }],
            staticClass: "mdui-textfield-input",
            attrs: {id: "raw-data", placeholder: "请完整输入已保存的的文本"},
            domProps: {value: t.rawText},
            on: {
                input: function (e) {
                    e.target.composing || (t.rawText = e.target.value)
                }
            }
        })])], 2), t._m(0)])
    }, Tt = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-dialog-actions"}, [i("button", {
            staticClass: "mdui-btn mdui-ripple mdui-shadow-1",
            attrs: {"mdui-dialog-cancel": ""}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("close")])])])
    }], It = {
        props: {all: Object, title: String, raw: Object}, data: function () {
            return {
                operations: {
                    addAll: {opr: "addAll", name: "添加全图鉴", tip: "装备太多可能会卡，别用"},
                    removeAll: {opr: "removeAll", name: "清空仓库", tip: "在这里融号是找不回的"},
                    saveAsFile: {opr: "saveAsFile", name: "保存数据", tip: "获得仓库装备的配置数据"},
                    readFromFile: {opr: "readFromFile", name: "读取数据", tip: "万一找回了呢"}
                }, minStar: 6, rawText: ""
            }
        }, computed: {
            allId: function () {
                var t = [];
                for (var e in this.all) {
                    var i = !0, a = !1, s = void 0;
                    try {
                        for (var n, r = this.all[e][Symbol.iterator](); !(i = (n = r.next()).done); i = !0) {
                            var o = n.value;
                            t.push(o.split("$")[0])
                        }
                    } catch (t) {
                        a = !0, s = t
                    } finally {
                        try {
                            i || null == r.return || r.return()
                        } finally {
                            if (a)throw s
                        }
                    }
                }
                return t
            }, someId: function () {
                var t = [], e = this.minStar;
                for (var i in this.all) {
                    var a = !0, s = !1, n = void 0;
                    try {
                        for (var r, o = this.all[i][Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                            var l = r.value, u = l.split("$"), c = Object(I["a"])(u, 2), d = c[0], m = c[1];
                            parseInt(m) >= e && t.push(d)
                        }
                    } catch (t) {
                        s = !0, n = t
                    } finally {
                        try {
                            a || null == o.return || o.return()
                        } finally {
                            if (s)throw n
                        }
                    }
                }
                return t
            }
        }, methods: {
            operate: function (t) {
                return this[t]()
            }, addAll: function () {
                this.$emit("select", {type: "add", data: this.allId})
            }, addSome: function () {
                this.$emit("select", {type: "add", data: this.someId})
            }, removeAll: function () {
                this.$emit("select", {type: "remove", data: this.allId})
            }, saveAsFile: function () {
                var t = document.getElementById("raw-data"), e = JSON.stringify(this.raw);
                t.setAttribute("readonly", "readonly"), t.setAttribute("value", e), t.select(), document.execCommand("copy") ? this.$parent.tip("数据已复制到剪贴板") : (t.setSelectionRange(0, e.length), document.execCommand("copy") ? this.$parent.tip("数据已复制到剪贴板") : this.$parent.tip("复制失败，请手动复制")), t.removeAttribute("readonly")
            }, readFromFile: function () {
                var t = this.rawText || "";
                if (-1 !== t.indexOf("{") && -1 !== t.indexOf("}"))try {
                    var e = [], i = JSON.parse(t);
                    for (var a in i) {
                        var s = !0, n = !1, r = void 0;
                        try {
                            for (var o, l = i[a][Symbol.iterator](); !(s = (o = l.next()).done); s = !0) {
                                var u = o.value;
                                e.push(this.formarId(u.split("$")[0]))
                            }
                        } catch (t) {
                            n = !0, r = t
                        } finally {
                            try {
                                s || null == l.return || l.return()
                            } finally {
                                if (n)throw r
                            }
                        }
                    }
                    this.$emit("select", {type: "add", data: e}), this.$parent.tip("客服娘 (?) 已经帮你找回成功啦！")
                } catch (t) {
                    if (t)return this.$parent.tip("读取失败！")
                } else this.$parent.tip("格式错误")
            }, formarId: function (t) {
                if (t.length >= 3)return t;
                t = t.toString();
                for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
                return e + t
            }
        }, watch: {
            raw: {
                handler: function (t) {
                    this.rawText = JSON.stringify(t)
                }, deep: !0
            }
        }
    }, Et = It, Pt = (i("ecd1"), Object(p["a"])(Et, Ot, Tt, !1, null, "a06ebc6c", null));
    Pt.options.__file = "StoreSetting.vue";
    var kt = Pt.exports, Nt = window.mdui, jt = {
        props: {used: Array, minify: Object}, data: function () {
            return {equipList: [], all: {}, options: {showText: !1}, dialog: "", dialogTitle: "", dialogInst: null}
        }, computed: {
            equips: function () {
                return this.$store.getters.equips
            }, raw: function () {
                return this.$store.getters.raw
            }, elmap: function () {
                var t = {}, e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.equipList[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        t[r.id] = r
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t
            }, allButOwn: function () {
                var t = this, e = {};
                for (var i in this.all)e[i] = this.all[i].filter(function (e) {
                    var i = !0, a = !1, s = void 0;
                    try {
                        for (var n, r = t.equips[Symbol.iterator](); !(i = (n = r.next()).done); i = !0) {
                            var o = n.value;
                            if (o.id == t.formatId(e.split("$")[0]))return !1
                        }
                    } catch (t) {
                        a = !0, s = t
                    } finally {
                        try {
                            i || null == r.return || r.return()
                        } finally {
                            if (a)throw s
                        }
                    }
                    return !0
                });
                return e
            }, ownEquips: function () {
                var t = {}, e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.equips[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        t[r.type] || (t[r.type] = []), t[r.type].push("".concat(parseInt(r.id), "$").concat(r.stars, "$").concat(r.name))
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t
            }, itemsToSelect: function () {
                return "移除装备" === this.dialogTitle ? this.ownEquips : "添加装备" === this.dialogTitle ? this.allButOwn : this.all
            }, usage: function () {
                var t = {};
                for (var e in this.used) {
                    var i = this.used[e];
                    t[i.id] = [i.used, i.max]
                }
                return t
            }
        }, components: {IwStore: yt, EquipSelector: qt, StoreSetting: kt}, beforeMount: function () {
            Nt.JQ("#progress").show()
        }, mounted: function () {
            this.all = this.minify, this.equipList = this.parseEquips(this.minify), this.loadFromLocal(), this.hideLoading()
        }, methods: {
            parseEquips: function (t) {
                var e = [], i = function (i) {
                    t[i].forEach(function (t) {
                        return e.push({equip: t, type: i})
                    })
                };
                for (var a in t)i(a);
                for (var s = [], n = 0; n < e.length; n++) {
                    var r = e[n].equip.split("$"), o = {
                            weapon: [0, 2],
                            passive_skill: [0, 2],
                            costume: [0, 3],
                            pet: [0, 5]
                        }[e[n].type] || [0, 2];
                    s.push({
                        id: this.formatId(r[0]),
                        stars: r[1],
                        name: r[2],
                        type: e[n].type,
                        usage: this.usage[this.formatId(r[0])] || o
                    })
                }
                return s
            }, updateEquips: function () {
                this.$store.commit("equips", this.parseEquips(this.raw))
            }, formatId: function (t) {
                if (!t)return "001";
                t = t.toString();
                for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
                return e + t
            }, toggleText: function () {
                this.options.showText = !this.options.showText
            }, tip: function (t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1500;
                return Nt.snackbar({message: t, position: "right-bottom", timeout: e})
            }, backToTop: function () {
                document.body.scrollTop = 0, document.documentElement.scrollTop = 0
            }, saveToLocal: function () {
                window.localStorage.setItem("my-equips", JSON.stringify(this.raw)), this.tip("数据已更新")
            }, loadFromLocal: function () {
                var t = this, e = JSON.parse(window.localStorage.getItem("my-equips"));
                this.$store.commit("raw", e), a["a"].nextTick(function () {
                    t.updateEquips()
                }), this.tip("数据加载已完成")
            }, showDialog: function (t, e) {
                var i = this;
                this.showLoading(), this.dialog = t, this.dialogTitle = {
                        add: "添加装备",
                        remove: "移除装备",
                        setting: "数据设置"
                    }[e] || "", a["a"].nextTick(function () {
                    var t = new Nt.Dialog(Nt.JQ("#dialog"), {history: !1});
                    i.dialogInst = t, i.hideLoading(), t.open()
                })
            }, select: function (t) {
                "confirm" === t.type ? "移除装备" === this.dialogTitle ? this.removeFromStore(t.data) : "添加装备" === this.dialogTitle && this.addToStore(t.data) : "add" === t.type ? this.addToStore(t.data) : "remove" === t.type && this.removeFromStore(t.data), this.dialogInst && this.dialogInst.close && this.dialogInst.close()
            }, addToStore: function (t) {
                var e = this, i = t.map(function (t) {
                    return e.elmap[e.formatId(t)]
                });
                this.$store.commit("addEquips", i), this.saveToLocal()
            }, removeFromStore: function (t) {
                var e = this, i = t.map(function (t) {
                    return e.formatId(t)
                });
                this.$store.commit("removeEquips", i), this.saveToLocal()
            }, showLoading: function () {
                Nt.JQ("#progress").css("opacity", 1)
            }, hideLoading: function () {
                Nt.JQ("#progress").css("opacity", 0)
            }
        }, watch: {
            usage: function () {
                this.$emit("update-equips")
            }, minify: function () {
                this.all = this.minify, this.equipList = this.parseEquips(this.minify)
            }
        }
    }, At = jt, Dt = Object(p["a"])(At, mt, pt, !1, null, null, null);
    Dt.options.__file = "MyEquips.vue";
    var Ft = Dt.exports, Jt = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "tower"}, [i("div", {staticClass: "table"}, [i("IwDynamicTable", t._b({
            attrs: {
                used: t.used,
                minify: t.minify,
                edit: t.edit
            }, on: {set: t.update, update: t.updateBody, "update-equip": t.updateEquip}
        }, "IwDynamicTable", t.table, !1), [i("tr", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.table.body.length,
                expression: "table.body.length"
            }], staticClass: "footer"
        }, [t._l(8, function (t) {
            return i("td")
        }), i("td", {staticClass: "text"}, [t._v("总分 :")]), i("td", {staticClass: "total"}, [t._v(t._s(t.sum))]), i("td", [t._v("Powerd By 搞事学园")]), i("td")], 2)])], 1), i("div", {
            staticClass: "mdui-fab-wrapper",
            attrs: {id: "actions", "mdui-fab": '{trigger: "hover"}'}
        }, [t._m(0), i("div", {staticClass: "mdui-fab-dial"}, [i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "回到顶部", position: "left"}'},
            on: {click: t.backToTop}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("publish")])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "编辑/退出编辑", position: "left"}'},
            on: {click: t.toggleEdit}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v(t._s(t.edit ? "done" : "edit"))])]), i("button", {
            staticClass: "mdui-fab mdui-fab-mini mdui-ripple mdui-color-theme-accent",
            attrs: {"mdui-tooltip": '{content: "导入/导出", position: "left"}'},
            on: {click: t.showPanel}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("cloud")])])])]), i("div", {
            staticClass: "mdui-dialog",
            attrs: {id: "data-panel"}
        }, [i("div", {staticClass: "mdui-dialog-title"}, [t._v("导入/导出")]), i("div", {staticClass: "mdui-dialog-content"}, [t._l(t.operations, function (e) {
            return i("div", {staticClass: "operations mdui-p-b-1"}, [i("button", {
                staticClass: "mdui-btn mdui-ripple mdui-shadow-2",
                on: {
                    click: function (i) {
                        t.operate(e.opr)
                    }
                }
            }, [t._v(t._s(e.name))]), i("div", {staticClass: "tips mdui-m-l-2 mdui-text-left"}, [t._v(t._s(e.tip))])])
        }), i("div", {staticClass: "operations input mdui-p-x-2"}, [i("input", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.rawText,
                expression: "rawText"
            }],
            staticClass: "mdui-textfield-input",
            attrs: {id: "raw-data", placeholder: "读取数据时请在此完整输入已保存的的文本"},
            domProps: {value: t.rawText},
            on: {
                input: function (e) {
                    e.target.composing || (t.rawText = e.target.value)
                }
            }
        })])], 2), t._m(1)])])
    }, Lt = [function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("button", {staticClass: "mdui-fab mdui-ripple mdui-color-theme-accent"}, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("menu")]), i("i", {staticClass: "mdui-icon material-icons mdui-fab-opened"}, [t._v("list")])])
    }, function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "mdui-dialog-actions"}, [i("button", {
            staticClass: "mdui-btn mdui-ripple mdui-shadow-1",
            attrs: {"mdui-dialog-cancel": ""}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("close")])])])
    }], Bt = i("6bde"), Qt = i("1146"), Ut = i.n(Qt), Mt = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "iw-table-container mdui-container"}, [i("div", {staticClass: "mdui-table-fluid"}, [i("table", {
            staticClass: "iw-dynamic-table mdui-table mdui-table-hoverable",
            attrs: {id: "iw-table"}
        }, [t.head ? i("thead", t._l(t.head, function (e) {
            return i("tr", [t._l(e, function (e) {
                return i("th", {staticClass: "mdui-p-x-2 mdui-p-y-1"}, [t._v(t._s(e))])
            }), i("th", {
                directives: [{name: "show", rawName: "v-show", value: t.edit, expression: "edit"}],
                staticClass: "rm-btn"
            }, [t._v("删除")])], 2)
        })) : t._e(), i("tbody", [t._l(t.body, function (e, a) {
            return i("tr", [t._l(e, function (e, s) {
                return i(t.templates[s], {
                    tag: "td",
                    staticClass: "td mdui-p-a-1",
                    attrs: {
                        id: "table-" + a + "-" + s,
                        value: e,
                        editable: !!s && t.edit,
                        selectorOptions: t.selectorOptions[t.head[0][s]]
                    },
                    on: {click: t.showSelect, input: t.changeInput}
                })
            }), i("td", {
                directives: [{name: "show", rawName: "v-show", value: t.edit, expression: "edit"}],
                staticClass: "rm-btn mdui-p-a-1 mdui-text-center"
            }, [i("button", {
                staticClass: "mdui-btn mdui-btn-dense mdui-ripple mdui-color-red mdui-p-a-0",
                on: {
                    click: function (e) {
                        t.removeRow(a)
                    }
                }
            }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("close")])])])], 2)
        }), t._t("default")], 2)])]), i("div", {
            directives: [{
                name: "show",
                rawName: "v-show",
                value: t.edit,
                expression: "edit"
            }],
            staticClass: "mdui-ripple mdui-color-theme-accent mdui-shadow-2 mdui-p-a-2",
            attrs: {id: "add-item", "mdui-tooltip": '{content: "添加新行", position: "top"}'},
            on: {click: t.addRow}
        }, [i("i", {staticClass: "mdui-icon material-icons"}, [t._v("add")])]), i("EquipSelector", {
            tag: "div",
            staticClass: "mdui-dialog",
            attrs: {id: "dialog", all: t.equipOptions, title: "选择装备", single: !0},
            on: {select: t.select}
        })])
    }, Rt = [], Ht = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("div", {staticClass: "equip-suit"}, [i("div", {staticClass: "suit-view"}, t._l(t.value, function (e, a) {
            return i("div", {
                staticClass: "item", on: {
                    click: function (e) {
                        t.changeItem(a)
                    }
                }
            }, [i("img", e ? {attrs: {src: "https://static.image.mihoyo.com/hsod2_webview/images/broadcast_top/equip_icon/jpg/" + e + ".jpg"}} : {attrs: {src: "https://static.image.mihoyo.com/hsod2_webview/images/broadcast_top/equip_icon/png/Series/Series37.png"}})])
        }))])
    }, Wt = [], zt = {
        props: {value: Array, id: [String, Number], editable: Boolean}, data: function () {
            return {val: {}, used: []}
        }, created: function () {
            if (this.val = this.value, this.val.length < 8)for (var t = this.val.length; t < 8; t++)this.val.push(""); else this.val.length > 8 && this.val.splice(8)
        }, computed: {
            availableEquips: function () {
                var t = [], e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.$parent.used[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        r.used < r.max && t.push(r)
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t
            }
        }, methods: {
            update: function () {
            }, changeItem: function (t) {
                this.editable && this.$emit("click", [this.id, t])
            }
        }
    }, Yt = zt, Gt = (i("149a"), Object(p["a"])(Yt, Ht, Wt, !1, null, "67295418", null));
    Gt.options.__file = "EquipSuit.vue";
    var Kt = Gt.exports, Vt = function () {
        var t = this, e = t.$createElement, i = t._self._c || e;
        return i("td", {
            staticClass: "selector",
            style: t.style
        }, [t.editable ? i("select", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: t.val,
                expression: "val"
            }], staticClass: "mdui-select", on: {
                input: function (e) {
                    t.input(e)
                }, change: function (e) {
                    var i = Array.prototype.filter.call(e.target.options, function (t) {
                        return t.selected
                    }).map(function (t) {
                        var e = "_value" in t ? t._value : t.value;
                        return e
                    });
                    t.val = e.target.multiple ? i : i[0]
                }
            }
        }, [i("option", {attrs: {value: ""}}, [t._v("(未设置)")]), t._l(t.selectorOptions, function (e) {
            return i("option", {domProps: {value: e}}, [t._v(t._s(e))])
        })], 2) : i("span", [t._v(t._s(t.val || "(未设置)"))])])
    }, Xt = [], Zt = {
        props: {id: [String, Array], value: [String, Number], selectorOptions: Array, editable: Boolean},
        data: function () {
            return {val: ""}
        },
        computed: {
            size: function () {
                var t = 1, e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.selectorOptions[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        r.length > t && (t = r.length)
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t > 10 && (t = 10), t
            }, style: function () {
                return {"min-width": 16 * this.size + 16 + "px"}
            }
        },
        created: function () {
            this.val = this.value
        },
        methods: {
            input: function (t) {
                this.val = t.target.value, this.$emit("input", [this.id, this.val])
            }
        }
    }, te = Zt, ee = (i("251a"), Object(p["a"])(te, Vt, Xt, !1, null, "218d6ca5", null));
    ee.options.__file = "Selector.vue";
    var ie = ee.exports, ae = window.mdui, se = {
        props: {
            used: Array,
            minify: Object,
            templates: Array,
            head: Array,
            body: Array,
            edit: Boolean
        },
        components: {EquipSelector: qt, SimpleNumber: et, SimpleText: G, EquipSuit: Kt, Selector: ie},
        data: function () {
            return {dialog: null, editing: [], type: "", selectorOptions: {"计分倾向": ["速", "技", "御", "统"], "模式": []}}
        },
        beforeCreate: function () {
            var t = this;
            o.a.get("/innerWorld/data/mods").then(function (e) {
                t.$set(t.selectorOptions, "模式", e.data)
            })
        },
        computed: {
            usedMap: function () {
                var t = {}, e = !0, i = !1, a = void 0;
                try {
                    for (var s, n = this.used[Symbol.iterator](); !(e = (s = n.next()).done); e = !0) {
                        var r = s.value;
                        t[r.id] = {id: r.id, used: r.used, max: r.max}
                    }
                } catch (t) {
                    i = !0, a = t
                } finally {
                    try {
                        e || null == n.return || n.return()
                    } finally {
                        if (i)throw a
                    }
                }
                return t
            }, equipOptions: function () {
                var t = this.$store.getters.ownEquips || {}, e = {};
                return e[this.type] = t[this.type] || [], e
            }
        },
        methods: {
            formatId: function (t) {
                if (t = t.toString(), t.length >= 3)return t;
                for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
                return e + t
            }, showSelect: function (t) {
                var e = this, i = t[0].split("-"), s = Object(I["a"])(i, 3), n = s[0], r = s[1], o = s[2];
                if ("table" === n) {
                    this.editing = [r, o, t[1]];
                    var l = parseInt(t[1]);
                    this.type = 0 === l ? "costume" : 4 === l ? "pet" : l > 4 ? "passive_skill" : "weapon", a["a"].nextTick(function () {
                        var t = new ae.Dialog(ae.JQ("#dialog"), {history: !1});
                        e.dialog = t, t.open()
                    })
                }
            }, select: function (t) {
                if ("confirm" !== t.type)return this.dialog.close();
                var e;
                e = t.data[0] ? this.formatId(t.data[0]) : "";
                var i = Object(I["a"])(this.editing, 3), a = i[0], s = i[1], n = i[2], r = this.body[a][s][n], o = !1, l = !1, u = !0, c = !1, d = void 0;
                try {
                    for (var m, p = this.body[a][s][Symbol.iterator](); !(u = (m = p.next()).done); u = !0) {
                        var v = m.value;
                        "" !== v && v === e && (o = !0)
                    }
                } catch (t) {
                    c = !0, d = t
                } finally {
                    try {
                        u || null == p.return || p.return()
                    } finally {
                        if (c)throw d
                    }
                }
                for (var f in this.$set(this.body[a][s], n, e), this.body[a][s]) {
                    var h = this.body[a][s][f];
                    f !== n && h === r && (l = !0)
                }
                this.editing = [], o || this.$store.commit("addUsed", e), l || this.$store.commit("minusUsed", r), this.$emit("update-equip", [a, s, n, e]), this.dialog && this.dialog.close()
            }, changeInput: function (t) {
                var e = t[0].split("-"), i = Object(I["a"])(e, 3), a = i[0], s = i[1], n = i[2];
                "table" === a && (this.$set(this.body[s], n, t[1]), this.$emit("update", [s, n, t[1]]))
            }, addRow: function () {
                var t = [];
                for (var e in this.templates) {
                    var i = this.templates[e];
                    -1 !== i.indexOf("Equip") ? t.push([]) : -1 !== i.indexOf("Number") ? t.push(0) : t.push("")
                }
                t[0] = this.body.length + 1, this.body.push(t), this.$emit("set")
            }, removeRow: function (t) {
                for (this.body.splice(t, 1); t < this.body.length; t++)this.body[t][0] -= 1;
                this.$emit("set")
            }
        }
    }, ne = se, re = (i("19eb"), Object(p["a"])(ne, Mt, Rt, !1, null, "0bbb1ea8", null));
    re.options.__file = "IwDynamicTable.vue";
    var oe = re.exports, le = window.mdui, ue = {
        props: {used: Array, minify: Object},
        components: {IwDynamicTable: oe},
        computed: {
            usage: function () {
                return this.$store.state.used
            }, sum: function () {
                var t = 0;
                return this.table.body.forEach(function (e) {
                    t += parseInt(e[9])
                }), t
            }
        },
        data: function () {
            return {
                table: {
                    templates: ["SimpleNumber", "EquipSuit", "Selector", "Selector", "Selector", "SimpleNumber", "SimpleNumber", "SimpleNumber", "SimpleNumber", "SimpleNumber", "SimpleText"],
                    head: [["层数", "装备", "模式", "模式", "计分倾向", "击杀", "连击", "被击", "时间", "积分", "备注"]],
                    body: []
                },
                operations: {
                    addAll: {opr: "cloudImport", name: "导入云端模板", tip: "会覆盖原数据哦~"},
                    removeAll: {opr: "removeAll", name: "清空数据", tip: "注意备份哦~"},
                    saveAsFile: {opr: "saveAsFile", name: "保存数据", tip: "获得记录的备份"},
                    readFromFile: {opr: "readFromFile", name: "读取数据", tip: "从备份恢复数据"},
                    saveAsExcel: {opr: "saveAsExcel", name: "保存Excel", tip: "不会保存配装信息"}
                },
                rawText: "",
                edit: !0,
                timelock: !1,
                dialog: null
            }
        },
        beforeCreate: function () {
            le.JQ("#progress").show(), le.JQ("#progress").css("opacity", 1)
        },
        created: function () {
            this.loadData()
        },
        mounted: function () {
            this.checkDumplicate(), this.hideLoading()
        },
        methods: {
            operate: function (t) {
                this[t] && this[t]()
            }, saveData: function () {
                var t = this;
                this.timelock || (this.timelock = !0, setTimeout(function () {
                    t.timelock = !1, window.localStorage.setItem("tower-records", JSON.stringify(t.table.body)), t.$emit("update-equips"), t.tip("数据已保存")
                }, 1e3))
            }, loadData: function () {
                var t = window.localStorage.getItem("tower-records");
                this.$set(this.table, "body", JSON.parse(t) || []), this.tip("已加载数据")
            }, saveAsExcel: function () {
                this.showLoading(), this.dialog.close();
                var t = [], e = ["层数", "模式", "模式", "计分倾向", "击杀", "连击", "被击", "时间", "积分", "备注"], i = [{wch: 5}, {wch: 18}, {wch: 18}, {wch: 10}, {wch: 5}, {wch: 5}, {wch: 5}, {wch: 5}, {wch: 6}, {wch: 24}];
                t.push(e);
                var a = !0, s = !1, n = void 0;
                try {
                    for (var r, o = this.table.body[Symbol.iterator](); !(a = (r = o.next()).done); a = !0) {
                        var l = r.value, u = [], c = !0, d = !1, m = void 0;
                        try {
                            for (var p, v = l[Symbol.iterator](); !(c = (p = v.next()).done); c = !0) {
                                var f = p.value;
                                "object" !== Object(Bt["a"])(f) && u.push(f)
                            }
                        } catch (t) {
                            d = !0, m = t
                        } finally {
                            try {
                                c || null == v.return || v.return()
                            } finally {
                                if (d)throw m
                            }
                        }
                        t.push(u)
                    }
                } catch (t) {
                    s = !0, n = t
                } finally {
                    try {
                        a || null == o.return || o.return()
                    } finally {
                        if (s)throw n
                    }
                }
                t.push(["", "", "", "", "", "", "", "总分", this.sum, "Powered by 搞事学园"], ["", "", "", "", "", "", "", "", "", ce()]);
                var h = Ut.a.utils.book_new(), g = Ut.a.utils.aoa_to_sheet(t);
                g["!cols"] = i, Ut.a.utils.book_append_sheet(h, g, "里塔记录");
                try {
                    Ut.a.writeFile(h, "里塔记录.xlsx"), this.tip("保存成功")
                } catch (t) {
                    this.tip("保存失败，浏览器不支持自动保存")
                }
                this.hideLoading()
            }, checkDumplicate: function () {
                for (var t = {}, e = 0; e < this.table.body.length; e++) {
                    for (var i = this.table.body[e][1], s = {}, n = 0; n < i.length; n++) {
                        var r = this.parseId(i[n]);
                        r && "" !== r && (this.usage[r] ? t[r] && t[r] >= this.usage[r].max ? a["a"].set(this.table.body[e][1], n, "") : s[r] = !0 : a["a"].set(this.table.body[e][1], n, ""))
                    }
                    for (var o in s)t[o] || (t[o] = 0), t[o] += 1
                }
                this.saveData()
            }, update: function () {
                var t = this;
                a["a"].nextTick(function () {
                    t.saveData()
                })
            }, updateBody: function (t) {
                var e = this, i = Object(I["a"])(t, 3), s = i[0], n = i[1], r = i[2];
                this.table.body[s][n] = r, a["a"].nextTick(function () {
                    e.saveData()
                })
            }, updateEquip: function (t) {
                var e = this, i = Object(I["a"])(t, 4), s = i[0], n = i[1], r = i[2], o = i[3];
                this.table.body[s][n][r] = o, a["a"].nextTick(function () {
                    e.saveData()
                })
            }, tip: function (t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1500;
                if (window.mdui)return window.mdui.snackbar({message: t, position: "right-bottom", timeout: e})
            }, backToTop: function () {
                document.body.scrollTop = 0, document.documentElement.scrollTop = 0
            }, toggleEdit: function () {
                this.edit = !this.edit
            }, showPanel: function () {
                var t = this;
                this.showLoading(), this.dialog = new window.mdui.Dialog("#data-panel", {history: !1}), a["a"].nextTick(function () {
                    t.dialog.open(), t.hideLoading()
                })
            }, cloudImport: function () {
                var t = this;
                this.table.body = [], this.showLoading(), this.dialog.close(), this.tip("正在导入"), o.a.get("/innerWorld/data/stage").then(function (e) {
                    for (var i = e.data.data, a = [], s = 0; s < i.length; s++) {
                        var n = [s + 1, [], i[s][0], i[s][1], i[s][2], 0, 0, 0, 0, 0, ""];
                        a.push(n)
                    }
                    return a[0][10] = "版本: " + e.data.version, a[1][10] = "提供: " + e.data.author, a[2][10] = "数据来自测试服", a[3][10] = "请以正式服为准", t.table.body = a, t.saveData(), t.hideLoading(), t.usage
                })
            }, removeAll: function () {
                this.table.body = [], this.$store.commit("clearUsed"), this.saveData(), this.dialog.close()
            }, saveAsFile: function () {
                var t = document.getElementById("raw-data"), e = JSON.stringify(this.table.body);
                t.setAttribute("readonly", "readonly"), t.setAttribute("value", e), t.select(), document.execCommand("copy") ? this.tip("数据已复制到剪贴板") : (t.setSelectionRange(0, e.length), document.execCommand("copy") ? this.tip("数据已复制到剪贴板") : this.tip("复制失败，请手动复制")), t.removeAttribute("readonly"), this.dialog.close()
            }, readFromFile: function () {
                var t = this.rawText || "";
                if (-1 !== t.indexOf("[") && -1 !== t.indexOf("]"))try {
                    var e = JSON.parse(t);
                    this.$set(this.table, "body", e), this.tip("数据导入成功"), this.saveData()
                } catch (t) {
                    if (t)return this.tip("读取失败！")
                } else this.tip("格式错误");
                this.dialog.close()
            }, parseId: function (t) {
                if (t = t.toString(), t.length > 2)return t;
                for (var e = "", i = 0; i < 3 - t.length; i++)e += "0";
                return e + t
            }, showLoading: function () {
                le.JQ("#progress").css("opacity", 1)
            }, hideLoading: function () {
                le.JQ("#progress").css("opacity", 0)
            }
        }
    };

    function ce() {
        var t = new Date, e = function (t) {
            return ("0" + t).slice(-2)
        }, i = [t.getFullYear(), t.getMonth() + 1, t.getDay()], a = i[0], s = i[1], n = i[2], r = [t.getHours(), t.getMinutes()], o = r[0], l = r[1];
        return "".concat(a, "-").concat(e(s), "-").concat(e(n), " ").concat(e(o), ":").concat(e(l))
    }

    var de = ue, me = (i("a42d"), Object(p["a"])(de, Jt, Lt, !1, null, "85d62d80", null));
    me.options.__file = "Tower.vue";
    var pe = me.exports;
    a["a"].use(N["a"]);
    var ve = [{path: "/", component: dt}, {path: "/my-equips", component: Ft}, {
        path: "/tower",
        component: pe
    }], fe = new N["a"]({
        routes: ve, scrollBehavior: function () {
            return {x: 0, y: 0}
        }
    });
    fe.beforeResolve(function (t, e, i) {
        var a = window.mdui;
        (t || e || i) && (a.JQ("#progress").css("opacity", 1), i())
    }), a["a"].config.productionTip = !1, new a["a"]({
        router: fe, store: k, render: function (t) {
            return t(T)
        }
    }).$mount("#app")
};


/*!
 * mdui v0.4.1 (https://mdui.org)
 * Copyright 2016-2018 zdhxiong
 * Licensed under MIT
 */
!function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.mdui = e()
}(this, function () {
    "use strict";
    var t = {};
    !function () {
        var t = 0;
        window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame,
            window.cancelAnimationFrame = window.webkitCancelAnimationFrame),
        window.requestAnimationFrame || (window.requestAnimationFrame = function (e, n) {
                var i = (new Date).getTime()
                    , o = Math.max(0, 16.7 - (i - t))
                    , a = window.setTimeout(function () {
                    e(i + o)
                }, o);
                return t = i + o,
                    a
            }
        ),
        window.cancelAnimationFrame || (window.cancelAnimationFrame = function (t) {
                clearTimeout(t)
            }
        )
    }();
    var e = function (t, e, n) {
        function i(t) {
            return "number" == typeof t.length
        }

        function o(t, e) {
            var n, o;
            if (i(t)) {
                for (n = 0; n < t.length; n++)
                    if (!1 === e.call(t[n], n, t[n]))
                        return t
            } else
                for (o in t)
                    if (t.hasOwnProperty(o) && !1 === e.call(t[o], o, t[o]))
                        return t;
            return t
        }

        function a(t, e) {
            var i, a = [];
            return o(t, function (t, o) {
                null !== (i = e(o, t)) && i !== n && a.push(i)
            }),
                x.apply([], a)
        }

        function s(t, e) {
            return o(e, function (e, n) {
                t.push(n)
            }),
                t
        }

        function r(t) {
            for (var e = [], n = 0; n < t.length; n++)
                -1 === e.indexOf(t[n]) && e.push(t[n]);
            return e
        }

        function c(t) {
            return null === t
        }

        function d(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
        }

        function u(t) {
            return "function" == typeof t
        }

        function l(t) {
            return "string" == typeof t
        }

        function f(t) {
            return "object" == typeof t
        }

        function p(t) {
            return f(t) && !c(t)
        }

        function h(t) {
            return t && t === t.window
        }

        function m(t) {
            return t && t.nodeType === t.DOCUMENT_NODE
        }

        function v(t) {
            var n, i;
            return w[t] || (n = e.createElement(t),
                e.body.appendChild(n),
                i = getComputedStyle(n, "").getPropertyValue("display"),
                n.parentNode.removeChild(n),
            "none" === i && (i = "block"),
                w[t] = i),
                w[t]
        }

        var g = []
            , b = g.slice
            , x = g.concat
            , y = Array.isArray
            , $ = e.documentElement
            , w = {}
            , C = function (t) {
            for (var e = this, n = 0; n < t.length; n++)
                e[n] = t[n];
            return e.length = t.length,
                this
        }
            , k = function (n) {
            var i = []
                , o = 0;
            if (!n)
                return new C(i);
            if (n instanceof C)
                return n;
            if (l(n)) {
                var a, s;
                if ("<" === (n = n.trim())[0] && ">" === n[n.length - 1]) {
                    var r = "div";
                    for (0 === n.indexOf("<li") && (r = "ul"),
                         0 === n.indexOf("<tr") && (r = "tbody"),
                         0 !== n.indexOf("<td") && 0 !== n.indexOf("<th") || (r = "tr"),
                         0 === n.indexOf("<tbody") && (r = "table"),
                         0 === n.indexOf("<option") && (r = "select"),
                             (s = e.createElement(r)).innerHTML = n,
                             o = 0; o < s.childNodes.length; o++)
                        i.push(s.childNodes[o])
                } else
                    for (a = "#" !== n[0] || n.match(/[ .<>:~]/) ? e.querySelectorAll(n) : [e.getElementById(n.slice(1))],
                             o = 0; o < a.length; o++)
                        a[o] && i.push(a[o])
            } else {
                if (u(n))
                    return k(e).ready(n);
                if (n.nodeType || n === t || n === e)
                    i.push(n);
                else if (n.length > 0 && n[0].nodeType)
                    for (o = 0; o < n.length; o++)
                        i.push(n[o])
            }
            return new C(i)
        };
        k.fn = C.prototype,
            k.extend = k.fn.extend = function (t) {
                if (t === n)
                    return this;
                var e, i, o, a = arguments.length;
                if (1 === a) {
                    for (e in t)
                        t.hasOwnProperty(e) && (this[e] = t[e]);
                    return this
                }
                for (i = 1; i < a; i++) {
                    o = arguments[i];
                    for (e in o)
                        o.hasOwnProperty(e) && (t[e] = o[e])
                }
                return t
            }
            ,
            k.extend({
                each: o,
                merge: s,
                unique: r,
                map: a,
                contains: function (t, e) {
                    return t && !e ? $.contains(t) : t !== e && t.contains(e)
                },
                param: function (t) {
                    function e(t, i) {
                        var a;
                        p(i) ? o(i, function (n, o) {
                            a = y(i) && !p(o) ? "" : n,
                                e(t + "[" + a + "]", o)
                        }) : (a = c(i) || "" === i ? "" : "=" + encodeURIComponent(i),
                            n.push(encodeURIComponent(t) + a))
                    }

                    if (!p(t))
                        return "";
                    var n = [];
                    return o(t, function (t, n) {
                        e(t, n)
                    }),
                        n.join("&")
                }
            }),
            k.fn.extend({
                each: function (t) {
                    return o(this, t)
                },
                map: function (t) {
                    return new C(a(this, function (e, n) {
                        return t.call(e, n, e)
                    }))
                },
                get: function (t) {
                    return t === n ? b.call(this) : this[t >= 0 ? t : t + this.length]
                },
                slice: function (t) {
                    return new C(b.apply(this, arguments))
                },
                filter: function (t) {
                    if (u(t))
                        return this.map(function (e, i) {
                            return t.call(i, e, i) ? i : n
                        });
                    var e = k(t);
                    return this.map(function (t, i) {
                        return e.index(i) > -1 ? i : n
                    })
                },
                not: function (t) {
                    var e = this.filter(t);
                    return this.map(function (t, i) {
                        return e.index(i) > -1 ? n : i
                    })
                },
                offset: function () {
                    if (this[0]) {
                        var e = this[0].getBoundingClientRect();
                        return {
                            left: e.left + t.pageXOffset,
                            top: e.top + t.pageYOffset,
                            width: e.width,
                            height: e.height
                        }
                    }
                    return null
                },
                offsetParent: function () {
                    return this.map(function () {
                        for (var t = this.offsetParent; t && "static" === k(t).css("position");)
                            t = t.offsetParent;
                        return t || $
                    })
                },
                position: function () {
                    var t = this;
                    if (!t[0])
                        return null;
                    var e, n, i = {
                        top: 0,
                        left: 0
                    };
                    return "fixed" === t.css("position") ? n = t[0].getBoundingClientRect() : (e = t.offsetParent(),
                        n = t.offset(),
                    d(e[0], "html") || (i = e.offset()),
                        i = {
                            top: i.top + e.css("borderTopWidth"),
                            left: i.left + e.css("borderLeftWidth")
                        }),
                    {
                        top: n.top - i.top - t.css("marginTop"),
                        left: n.left - i.left - t.css("marginLeft"),
                        width: n.width,
                        height: n.height
                    }
                },
                show: function () {
                    return this.each(function () {
                        "none" === this.style.display && (this.style.display = ""),
                        "none" === t.getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = v(this.nodeName))
                    })
                },
                hide: function () {
                    return this.each(function () {
                        this.style.display = "none"
                    })
                },
                toggle: function () {
                    return this.each(function () {
                        this.style.display = "none" === this.style.display ? "" : "none"
                    })
                },
                hasClass: function (t) {
                    return !(!this[0] || !t) && this[0].classList.contains(t)
                },
                removeAttr: function (t) {
                    return this.each(function () {
                        this.removeAttribute(t)
                    })
                },
                removeProp: function (t) {
                    return this.each(function () {
                        try {
                            delete this[t]
                        } catch (t) {
                        }
                    })
                },
                eq: function (t) {
                    var e = -1 === t ? this.slice(t) : this.slice(t, +t + 1);
                    return new C(e)
                },
                first: function () {
                    return this.eq(0)
                },
                last: function () {
                    return this.eq(-1)
                },
                index: function (t) {
                    return t ? l(t) ? k(t).eq(0).parent().children().get().indexOf(this[0]) : this.get().indexOf(t) : this.eq(0).parent().children().get().indexOf(this[0])
                },
                is: function (o) {
                    var a = this[0];
                    if (!a || o === n || null === o)
                        return !1;
                    var s, r;
                    if (l(o))
                        return a !== e && a !== t && (a.matches || a.matchesSelector || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector).call(a, o);
                    if (o === e || o === t)
                        return a === o;
                    if (o.nodeType || i(o)) {
                        for (s = o.nodeType ? [o] : o,
                                 r = 0; r < s.length; r++)
                            if (s[r] === a)
                                return !0;
                        return !1
                    }
                    return !1
                },
                find: function (t) {
                    var e = [];
                    return this.each(function (n, i) {
                        s(e, i.querySelectorAll(t))
                    }),
                        new C(e)
                },
                children: function (t) {
                    var e = [];
                    return this.each(function (n, i) {
                        o(i.childNodes, function (n, i) {
                            if (1 !== i.nodeType)
                                return !0;
                            (!t || t && k(i).is(t)) && e.push(i)
                        })
                    }),
                        new C(r(e))
                },
                has: function (t) {
                    var e = l(t) ? this.find(t) : k(t)
                        , n = e.length;
                    return this.filter(function () {
                        for (var t = 0; t < n; t++)
                            if (k.contains(this, e[t]))
                                return !0
                    })
                },
                siblings: function (t) {
                    return this.prevAll(t).add(this.nextAll(t))
                },
                closest: function (t) {
                    var e = this;
                    return e.is(t) || (e = e.parents(t).eq(0)),
                        e
                },
                remove: function () {
                    return this.each(function (t, e) {
                        e.parentNode && e.parentNode.removeChild(e)
                    })
                },
                add: function (t) {
                    return new C(r(s(this.get(), k(t))))
                },
                empty: function () {
                    return this.each(function () {
                        this.innerHTML = ""
                    })
                },
                clone: function () {
                    return this.map(function () {
                        return this.cloneNode(!0)
                    })
                },
                replaceWith: function (t) {
                    return this.before(t).remove()
                },
                serializeArray: function () {
                    var t, e, n = [], i = this[0];
                    return i && i.elements ? (k(b.call(i.elements)).each(function () {
                        t = k(this),
                            e = t.attr("type"),
                        "fieldset" === this.nodeName.toLowerCase() || this.disabled || -1 !== ["submit", "reset", "button"].indexOf(e) || -1 !== ["radio", "checkbox"].indexOf(e) && !this.checked || n.push({
                            name: t.attr("name"),
                            value: t.val()
                        })
                    }),
                        n) : n
                },
                serialize: function () {
                    var t = [];
                    return o(this.serializeArray(), function (e, n) {
                        t.push(encodeURIComponent(n.name) + "=" + encodeURIComponent(n.value))
                    }),
                        t.join("&")
                }
            }),
            o(["val", "html", "text"], function (t, e) {
                var i = {
                    0: "value",
                    1: "innerHTML",
                    2: "textContent"
                }
                    , o = {
                    0: n,
                    1: n,
                    2: null
                };
                k.fn[e] = function (e) {
                    return e === n ? this[0] ? this[0][i[t]] : o[t] : this.each(function (n, o) {
                        o[i[t]] = e
                    })
                }
            }),
            o(["attr", "prop", "css"], function (e, i) {
                var a = function (t, n, i) {
                    0 === e ? t.setAttribute(n, i) : 1 === e ? t[n] = i : t.style[n] = i
                }
                    , s = function (i, o) {
                    if (!i)
                        return n;
                    return 0 === e ? i.getAttribute(o) : 1 === e ? i[o] : t.getComputedStyle(i, null).getPropertyValue(o)
                };
                k.fn[i] = function (t, e) {
                    var n = arguments.length;
                    return 1 === n && l(t) ? s(this[0], t) : this.each(function (i, s) {
                        2 === n ? a(s, t, e) : o(t, function (t, e) {
                            a(s, t, e)
                        })
                    })
                }
            }),
            o(["add", "remove", "toggle"], function (t, e) {
                k.fn[e + "Class"] = function (t) {
                    if (!t)
                        return this;
                    var n = t.split(" ");
                    return this.each(function (t, i) {
                        o(n, function (t, n) {
                            i.classList[e](n)
                        })
                    })
                }
            }),
            o({
                Width: "width",
                Height: "height"
            }, function (e, i) {
                k.fn[i] = function (o) {
                    if (o === n) {
                        var a = this[0];
                        if (h(a))
                            return a["inner" + e];
                        if (m(a))
                            return a.documentElement["scroll" + e];
                        var s = k(a)
                            , r = 0
                            , c = "width" === i;
                        return "ActiveXObject" in t && "border-box" === s.css("box-sizing") && (r = parseFloat(s.css("padding-" + (c ? "left" : "top"))) + parseFloat(s.css("padding-" + (c ? "right" : "bottom"))) + parseFloat(s.css("border-" + (c ? "left" : "top") + "-width")) + parseFloat(s.css("border-" + (c ? "right" : "bottom") + "-width"))),
                        parseFloat(k(a).css(i)) + r
                    }
                    return isNaN(Number(o)) || "" === o || (o += "px"),
                        this.css(i, o)
                }
            }),
            o({
                Width: "width",
                Height: "height"
            }, function (t, e) {
                k.fn["inner" + t] = function () {
                    var t = this[e]()
                        , n = k(this[0]);
                    return "border-box" !== n.css("box-sizing") && (t += parseFloat(n.css("padding-" + ("width" === e ? "left" : "top"))),
                        t += parseFloat(n.css("padding-" + ("width" === e ? "right" : "bottom")))),
                        t
                }
            });
        var O = function (t, e, n, i) {
            var o, a = [];
            return t.each(function (t, s) {
                for (o = s[i]; o;) {
                    if (2 === n) {
                        if (!e || e && k(o).is(e))
                            break;
                        a.push(o)
                    } else {
                        if (0 === n) {
                            (!e || e && k(o).is(e)) && a.push(o);
                            break
                        }
                        (!e || e && k(o).is(e)) && a.push(o)
                    }
                    o = o[i]
                }
            }),
                new C(r(a))
        };
        return o(["", "All", "Until"], function (t, e) {
            k.fn["prev" + e] = function (e) {
                var n = 0 === t ? this : k(this.get().reverse());
                return O(n, e, t, "previousElementSibling")
            }
        }),
            o(["", "All", "Until"], function (t, e) {
                k.fn["next" + e] = function (e) {
                    return O(this, e, t, "nextElementSibling")
                }
            }),
            o(["", "s", "sUntil"], function (t, e) {
                k.fn["parent" + e] = function (e) {
                    var n = 0 === t ? this : k(this.get().reverse());
                    return O(n, e, t, "parentNode")
                }
            }),
            o(["append", "prepend"], function (t, n) {
                k.fn[n] = function (n) {
                    var i, a = this.length > 1;
                    if (l(n)) {
                        var s = e.createElement("div");
                        s.innerHTML = n,
                            i = b.call(s.childNodes)
                    } else
                        i = k(n).get();
                    return 1 === t && i.reverse(),
                        this.each(function (e, n) {
                            o(i, function (i, o) {
                                a && e > 0 && (o = o.cloneNode(!0)),
                                    0 === t ? n.appendChild(o) : n.insertBefore(o, n.childNodes[0])
                            })
                        })
                }
            }),
            o(["insertBefore", "insertAfter"], function (t, e) {
                k.fn[e] = function (e) {
                    var n = k(e);
                    return this.each(function (e, i) {
                        n.each(function (e, o) {
                            o.parentNode.insertBefore(1 === n.length ? i : i.cloneNode(!0), 0 === t ? o : o.nextSibling)
                        })
                    })
                }
            }),
            o({
                appendTo: "append",
                prependTo: "prepend",
                before: "insertBefore",
                after: "insertAfter",
                replaceAll: "replaceWith"
            }, function (t, e) {
                k.fn[t] = function (t) {
                    return k(t)[e](this),
                        this
                }
            }),
            function () {
                var t = "mduiElementDataStorage";
                k.extend({
                    data: function (e, i, a) {
                        var s = {};
                        if (a !== n)
                            s[i] = a;
                        else {
                            if (!p(i)) {
                                if (i === n) {
                                    var r = {};
                                    return o(e.attributes, function (t, e) {
                                        var n = e.name;
                                        if (0 === n.indexOf("data-")) {
                                            var i = n.slice(5).replace(/-./g, function (t) {
                                                return t.charAt(1).toUpperCase()
                                            });
                                            r[i] = e.value
                                        }
                                    }),
                                    e[t] && o(e[t], function (t, e) {
                                        r[t] = e
                                    }),
                                        r
                                }
                                if (e[t] && i in e[t])
                                    return e[t][i];
                                var c = e.getAttribute("data-" + i);
                                return c || n
                            }
                            s = i
                        }
                        e[t] || (e[t] = {}),
                            o(s, function (n, i) {
                                e[t][n] = i
                            })
                    },
                    removeData: function (e, n) {
                        e[t] && e[t][n] && (e[t][n] = null,
                            delete e.mduiElementDataStorage[n])
                    }
                }),
                    k.fn.extend({
                        data: function (t, e) {
                            return e === n ? p(t) ? this.each(function (e, n) {
                                k.data(n, t)
                            }) : this[0] ? k.data(this[0], t) : n : this.each(function (n, i) {
                                k.data(i, t, e)
                            })
                        },
                        removeData: function (t) {
                            return this.each(function (e, n) {
                                k.removeData(n, t)
                            })
                        }
                    })
            }(),
            function () {
                function i(t, e, i, o, a) {
                    var r = s(t);
                    c[r] || (c[r] = []);
                    var d = !1;
                    p(o) && o.useCapture && (d = !0),
                        e.split(" ").forEach(function (e) {
                            var s = {
                                    e: e,
                                    fn: i,
                                    sel: a,
                                    i: c[r].length
                                }
                                , u = function (t, e) {
                                    !1 === i.apply(e, t._detail === n ? [t] : [t].concat(t._detail)) && (t.preventDefault(),
                                        t.stopPropagation())
                                }
                                , l = s.proxy = function (e) {
                                    e._data = o,
                                        a ? k(t).find(a).get().reverse().forEach(function (t) {
                                            (t === e.target || k.contains(t, e.target)) && u(e, t)
                                        }) : u(e, t)
                                }
                                ;
                            c[r].push(s),
                                t.addEventListener(s.e, l, d)
                        })
                }

                function a(t, e, n, i) {
                    (e || "").split(" ").forEach(function (e) {
                        r(t, e, n, i).forEach(function (e) {
                            delete c[s(t)][e.i],
                                t.removeEventListener(e.e, e.proxy, !1)
                        })
                    })
                }

                function s(t) {
                    return t._elementId || (t._elementId = d++)
                }

                function r(t, e, n, i) {
                    return (c[s(t)] || []).filter(function (t) {
                        return t && (!e || t.e === e) && (!n || t.fn.toString() === n.toString()) && (!i || t.sel === i)
                    })
                }

                var c = {}
                    , d = 1
                    , f = function () {
                    return !1
                };
                k.fn.extend({
                    ready: function (t) {
                        return /complete|loaded|interactive/.test(e.readyState) && e.body ? t(k) : e.addEventListener("DOMContentLoaded", function () {
                            t(k)
                        }, !1),
                            this
                    },
                    on: function (t, e, a, s, r) {
                        var c = this;
                        if (t && !l(t))
                            return o(t, function (t, n) {
                                c.on(t, e, a, n)
                            }),
                                c;
                        if (l(e) || u(s) || !1 === s || (s = a,
                                a = e,
                                e = n),
                            (u(a) || !1 === a) && (s = a,
                                a = n),
                            !1 === s && (s = f),
                            1 === r) {
                            var d = s;
                            s = function () {
                                return c.off(t, e, s),
                                    d.apply(this, arguments)
                            }
                        }
                        return this.each(function () {
                            i(this, t, s, a, e)
                        })
                    },
                    one: function (t, e, n, i) {
                        var a = this;
                        return l(t) ? t.split(" ").forEach(function (t) {
                            a.on(t, e, n, i, 1)
                        }) : o(t, function (t, i) {
                            t.split(" ").forEach(function (t) {
                                a.on(t, e, n, i, 1)
                            })
                        }),
                            this
                    },
                    off: function (t, e, i) {
                        var s = this;
                        return t && !l(t) ? (o(t, function (t, n) {
                            s.off(t, e, n)
                        }),
                            s) : (l(e) || u(i) || !1 === i || (i = e,
                            e = n),
                        !1 === i && (i = f),
                            s.each(function () {
                                a(this, t, i, e)
                            }))
                    },
                    trigger: function (n, i) {
                        if (l(n)) {
                            var o;
                            if (["click", "mousedown", "mouseup", "mousemove"].indexOf(n) > -1)
                                try {
                                    o = new MouseEvent(n, {
                                        bubbles: !0,
                                        cancelable: !0
                                    })
                                } catch (i) {
                                    (o = e.createEvent("MouseEvent")).initMouseEvent(n, !0, !0, t, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null)
                                }
                            else
                                try {
                                    o = new CustomEvent(n, {
                                        detail: i,
                                        bubbles: !0,
                                        cancelable: !0
                                    })
                                } catch (t) {
                                    (o = e.createEvent("CustomEvent")).initCustomEvent(n, !0, !0, i)
                                }
                            return o._detail = i,
                                this.each(function () {
                                    this.dispatchEvent(o)
                                })
                        }
                    }
                })
            }(),
            function () {
                var i = {}
                    , a = 0
                    , s = {
                    ajaxStart: "start.mdui.ajax",
                    ajaxSuccess: "success.mdui.ajax",
                    ajaxError: "error.mdui.ajax",
                    ajaxComplete: "complete.mdui.ajax"
                }
                    , r = function (t) {
                    return ["GET", "HEAD"].indexOf(t) >= 0
                }
                    , c = function (t, e) {
                    return (t + "&" + e).replace(/[&?]{1,2}/, "?")
                };
                k.extend({
                    ajaxSetup: function (t) {
                        k.extend(i, t || {})
                    },
                    ajax: function (d) {
                        function f(t, n) {
                            d.global && k(e).trigger(t, n)
                        }

                        function p(t) {
                            var e, n, i = arguments;
                            t && (t in g && (e = g[t](i[1], i[2], i[3], i[4])),
                            d[t] && (n = d[t](i[1], i[2], i[3], i[4])),
                            "beforeSend" !== t || !1 !== e && !1 !== n || (v = !0))
                        }

                        var h = {
                            method: "GET",
                            data: !1,
                            processData: !0,
                            async: !0,
                            cache: !0,
                            username: "",
                            password: "",
                            headers: {},
                            xhrFields: {},
                            statusCode: {},
                            dataType: "text",
                            jsonp: "callback",
                            jsonpCallback: function () {
                                return "mduijsonp_" + Date.now() + "_" + (a += 1)
                            },
                            contentType: "application/x-www-form-urlencoded",
                            timeout: 0,
                            global: !0
                        }
                            , m = ["beforeSend", "success", "error", "statusCode", "complete"]
                            , v = !1
                            , g = i
                            , b = {};
                        o(g, function (t, e) {
                            m.indexOf(t) < 0 && (h[t] = e)
                        });
                        var x = (d = k.extend({}, h, d)).method = d.method.toUpperCase();
                        d.url || (d.url = t.location.toString());
                        var y;
                        if (y = (r(x) || d.processData) && d.data && [ArrayBuffer, Blob, Document, FormData].indexOf(d.data.constructor) < 0 ? l(d.data) ? d.data : k.param(d.data) : d.data,
                            r(x) && y && (d.url = c(d.url, y),
                                y = null),
                            "jsonp" === d.dataType) {
                            var $ = u(d.jsonpCallback) ? d.jsonpCallback() : d.jsonpCallback
                                , w = c(d.url, d.jsonp + "=" + $);
                            if (b.options = d,
                                    f(s.ajaxStart, b),
                                    p("beforeSend", null),
                                    v)
                                return;
                            var C, O = e.createElement("script");
                            return O.type = "text/javascript",
                                O.onerror = function () {
                                    C && clearTimeout(C),
                                        f(s.ajaxError, b),
                                        p("error", null, "scripterror"),
                                        f(s.ajaxComplete, b),
                                        p("complete", null, "scripterror")
                                }
                                ,
                                O.src = w,
                                t[$] = function (e) {
                                    C && clearTimeout(C),
                                        b.data = e,
                                        f(s.ajaxSuccess, b),
                                        p("success", e, "success", null),
                                        k(O).remove(),
                                        O = null,
                                        delete t[$]
                                }
                                ,
                                k("head").append(O),
                                void (d.timeout > 0 && (C = setTimeout(function () {
                                    k(O).remove(),
                                        O = null,
                                        f(s.ajaxError, b),
                                        p("error", null, "timeout")
                                }, d.timeout)))
                        }
                        r(x) && !d.cache && (d.url = c(d.url, "_=" + Date.now()));
                        var T = new XMLHttpRequest;
                        T.open(x, d.url, d.async, d.username, d.password),
                        (y && !r(x) && !1 !== d.contentType || d.contentType) && T.setRequestHeader("Content-Type", d.contentType),
                        "json" === d.dataType && T.setRequestHeader("Accept", "application/json, text/javascript"),
                        d.headers && o(d.headers, function (t, e) {
                            T.setRequestHeader(t, e)
                        }),
                        d.crossDomain === n && (d.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(d.url) && RegExp.$2 !== t.location.host),
                        d.crossDomain || T.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                        d.xhrFields && o(d.xhrFields, function (t, e) {
                            T[t] = e
                        }),
                            b.xhr = T,
                            b.options = d;
                        var E;
                        return T.onload = function () {
                            E && clearTimeout(E);
                            var t, e = T.status >= 200 && T.status < 300 || 0 === T.status;
                            if (e) {
                                t = 204 === T.status || "HEAD" === x ? "nocontent" : 304 === T.status ? "notmodified" : "success";
                                var n;
                                if ("json" === d.dataType) {
                                    try {
                                        b.data = n = JSON.parse(T.responseText)
                                    } catch (e) {
                                        t = "parsererror",
                                            f(s.ajaxError, b),
                                            p("error", T, t)
                                    }
                                    "parsererror" !== t && (f(s.ajaxSuccess, b),
                                        p("success", n, t, T))
                                } else
                                    b.data = n = "text" === T.responseType || "" === T.responseType ? T.responseText : T.response,
                                        f(s.ajaxSuccess, b),
                                        p("success", n, t, T)
                            } else
                                t = "error",
                                    f(s.ajaxError, b),
                                    p("error", T, t);
                            o([g.statusCode, d.statusCode], function (i, o) {
                                o && o[T.status] && (e ? o[T.status](n, t, T) : o[T.status](T, t))
                            }),
                                f(s.ajaxComplete, b),
                                p("complete", T, t)
                        }
                            ,
                            T.onerror = function () {
                                E && clearTimeout(E),
                                    f(s.ajaxError, b),
                                    p("error", T, T.statusText),
                                    f(s.ajaxComplete, b),
                                    p("complete", T, "error")
                            }
                            ,
                            T.onabort = function () {
                                var t = "abort";
                                E && (t = "timeout",
                                    clearTimeout(E)),
                                    f(s.ajaxError, b),
                                    p("error", T, t),
                                    f(s.ajaxComplete, b),
                                    p("complete", T, t)
                            }
                            ,
                            f(s.ajaxStart, b),
                            p("beforeSend", T),
                            v ? T : (d.timeout > 0 && (E = setTimeout(function () {
                                T.abort()
                            }, d.timeout)),
                                T.send(y),
                                T)
                    }
                }),
                    o(s, function (t, e) {
                        k.fn[t] = function (t) {
                            return this.on(e, function (e, n) {
                                t(e, n.xhr, n.options, n.data)
                            })
                        }
                    })
            }(),
            k
    }(window, document)
        , n = e(document)
        , i = e(window)
        , o = {};
    !function () {
        var t = [];
        o.queue = function (e, n) {
            if (void 0 === t[e] && (t[e] = []),
                void 0 === n)
                return t[e];
            t[e].push(n)
        }
            ,
            o.dequeue = function (e) {
                void 0 !== t[e] && t[e].length && t[e].shift()()
            }
    }();
    var a = {
        touches: 0,
        isAllow: function (t) {
            var e = !0;
            return a.touches && ["mousedown", "mouseup", "mousemove", "click", "mouseover", "mouseout", "mouseenter", "mouseleave"].indexOf(t.type) > -1 && (e = !1),
                e
        },
        register: function (t) {
            "touchstart" === t.type ? a.touches += 1 : ["touchmove", "touchend", "touchcancel"].indexOf(t.type) > -1 && setTimeout(function () {
                a.touches && (a.touches -= 1)
            }, 500)
        },
        start: "touchstart mousedown",
        move: "touchmove mousemove",
        end: "touchend mouseup",
        cancel: "touchcancel mouseleave",
        unlock: "touchend touchmove touchcancel"
    };
    e(function () {
        setTimeout(function () {
            e("body").addClass("mdui-loaded")
        }, 0)
    });
    var s = function (t) {
        var e = {};
        if (null === t || !t)
            return e;
        if ("object" == typeof t)
            return t;
        var n = t.indexOf("{");
        try {
            e = new Function("", "var json = " + t.substr(n) + "; return JSON.parse(JSON.stringify(json));")()
        } catch (t) {
        }
        return e
    }
        , r = function (t, n, i, o, a) {
        a || (a = {}),
            a.inst = i;
        var s = t + ".mdui." + n;
        "undefined" != typeof jQuery && jQuery(o).trigger(s, a),
            e(o).trigger(s, a)
    };
    e.fn.extend({
        reflow: function () {
            return this.each(function () {
                return this.clientLeft
            })
        },
        transition: function (t) {
            return "string" != typeof t && (t += "ms"),
                this.each(function () {
                    this.style.webkitTransitionDuration = t,
                        this.style.transitionDuration = t
                })
        },
        transitionEnd: function (t) {
            function e(a) {
                if (a.target === this)
                    for (t.call(this, a),
                             n = 0; n < i.length; n++)
                        o.off(i[n], e)
            }

            var n, i = ["webkitTransitionEnd", "transitionend"], o = this;
            if (t)
                for (n = 0; n < i.length; n++)
                    o.on(i[n], e);
            return this
        },
        transformOrigin: function (t) {
            return this.each(function () {
                this.style.webkitTransformOrigin = t,
                    this.style.transformOrigin = t
            })
        },
        transform: function (t) {
            return this.each(function () {
                this.style.webkitTransform = t,
                    this.style.transform = t
            })
        }
    }),
        e.extend({
            showOverlay: function (t) {
                var n = e(".mdui-overlay");
                n.length ? (n.data("isDeleted", 0),
                void 0 !== t && n.css("z-index", t)) : (void 0 === t && (t = 2e3),
                    n = e('<div class="mdui-overlay">').appendTo(document.body).reflow().css("z-index", t));
                var i = n.data("overlay-level") || 0;
                return n.data("overlay-level", ++i).addClass("mdui-overlay-show")
            },
            hideOverlay: function (t) {
                var n = e(".mdui-overlay");
                if (n.length) {
                    var i = t ? 1 : n.data("overlay-level");
                    i > 1 ? n.data("overlay-level", --i) : n.data("overlay-level", 0).removeClass("mdui-overlay-show").data("isDeleted", 1).transitionEnd(function () {
                        n.data("isDeleted") && n.remove()
                    })
                }
            },
            lockScreen: function () {
                var t = e("body")
                    , n = t.width();
                t.addClass("mdui-locked").width(n);
                var i = t.data("lockscreen-level") || 0;
                t.data("lockscreen-level", ++i)
            },
            unlockScreen: function (t) {
                var n = e("body")
                    , i = t ? 1 : n.data("lockscreen-level");
                i > 1 ? n.data("lockscreen-level", --i) : n.data("lockscreen-level", 0).removeClass("mdui-locked").width("")
            },
            throttle: function (t, e) {
                var n = null;
                return (!e || e < 16) && (e = 16),
                    function () {
                        var i = this
                            , o = arguments;
                        null === n && (n = setTimeout(function () {
                            t.apply(i, o),
                                n = null
                        }, e))
                    }
            }
        }),
        function () {
            var t = {};
            e.extend({
                guid: function (e) {
                    function n() {
                        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
                    }

                    if (void 0 !== e && void 0 !== t[e])
                        return t[e];
                    var i = n() + n() + "-" + n() + "-" + n() + "-" + n() + "-" + n() + n() + n();
                    return void 0 !== e && (t[e] = i),
                        i
                }
            })
        }(),
        function () {
            function n(t, n, i, o, a) {
                var s = e(i)
                    , r = s.data("mdui.mutation");
                r || (r = [],
                    s.data("mdui.mutation", r)),
                -1 === r.indexOf(t) && (r.push(t),
                    n.call(i, o, a))
            }

            var i = {};
            e.fn.extend({
                mutation: function () {
                    return this.each(function (t, o) {
                        var a = e(this);
                        e.each(i, function (e, i) {
                            a.is(e) && n(e, i, a[0], t, o),
                                a.find(e).each(function (t, o) {
                                    n(e, i, this, t, o)
                                })
                        })
                    })
                }
            }),
                t.mutation = function (t, o) {
                    "string" == typeof t && "function" == typeof o ? (i[t] = o,
                        e(t).each(function (e, i) {
                            n(t, o, this, e, i)
                        })) : e(document).mutation()
                }
        }(),
        t.Headroom = function () {
            function t(t, i) {
                var o = this;
                if (o.$headroom = e(t).eq(0),
                        o.$headroom.length) {
                    var a = o.$headroom.data("mdui.headroom");
                    if (a)
                        return a;
                    o.options = e.extend({}, n, i || {});
                    var s = o.options.tolerance;
                    s !== Object(s) && (o.options.tolerance = {
                        down: s,
                        up: s
                    }),
                        o._init()
                }
            }

            var n = {
                tolerance: 5,
                offset: 0,
                initialClass: "mdui-headroom",
                pinnedClass: "mdui-headroom-pinned-top",
                unpinnedClass: "mdui-headroom-unpinned-top"
            };
            t.prototype._init = function () {
                var t = this;
                t.state = "pinned",
                    t.$headroom.addClass(t.options.initialClass).removeClass(t.options.pinnedClass + " " + t.options.unpinnedClass),
                    t.inited = !1,
                    t.lastScrollY = 0,
                    t._attachEvent()
            }
                ,
                t.prototype._attachEvent = function () {
                    var t = this;
                    t.inited || (t.lastScrollY = window.pageYOffset,
                        t.inited = !0,
                        i.on("scroll", function () {
                            t._scroll()
                        }))
                }
                ,
                t.prototype._scroll = function () {
                    var t = this;
                    t.rafId = window.requestAnimationFrame(function () {
                        var e = window.pageYOffset
                            , n = e > t.lastScrollY ? "down" : "up"
                            , i = Math.abs(e - t.lastScrollY) >= t.options.tolerance[n];
                        e > t.lastScrollY && e >= t.options.offset && i ? t.unpin() : (e < t.lastScrollY && i || e <= t.options.offset) && t.pin(),
                            t.lastScrollY = e
                    })
                }
            ;
            var o = function (t) {
                "pinning" === t.state && (t.state = "pinned",
                    r("pinned", "headroom", t, t.$headroom)),
                "unpinning" === t.state && (t.state = "unpinned",
                    r("unpinned", "headroom", t, t.$headroom))
            };
            return t.prototype.pin = function () {
                var t = this;
                "pinning" !== t.state && "pinned" !== t.state && t.$headroom.hasClass(t.options.initialClass) && (r("pin", "headroom", t, t.$headroom),
                    t.state = "pinning",
                    t.$headroom.removeClass(t.options.unpinnedClass).addClass(t.options.pinnedClass).transitionEnd(function () {
                        o(t)
                    }))
            }
                ,
                t.prototype.unpin = function () {
                    var t = this;
                    "unpinning" !== t.state && "unpinned" !== t.state && t.$headroom.hasClass(t.options.initialClass) && (r("unpin", "headroom", t, t.$headroom),
                        t.state = "unpinning",
                        t.$headroom.removeClass(t.options.pinnedClass).addClass(t.options.unpinnedClass).transitionEnd(function () {
                            o(t)
                        }))
                }
                ,
                t.prototype.enable = function () {
                    var t = this;
                    t.inited || t._init()
                }
                ,
                t.prototype.disable = function () {
                    var t = this;
                    t.inited && (t.inited = !1,
                        t.$headroom.removeClass([t.options.initialClass, t.options.pinnedClass, t.options.unpinnedClass].join(" ")),
                        i.off("scroll", function () {
                            t._scroll()
                        }),
                        window.cancelAnimationFrame(t.rafId))
                }
                ,
                t.prototype.getState = function () {
                    return this.state
                }
                ,
                t
        }(),
        e(function () {
            t.mutation("[mdui-headroom]", function () {
                var n = e(this)
                    , i = s(n.attr("mdui-headroom"))
                    , o = n.data("mdui.headroom");
                o || (o = new t.Headroom(n, i),
                    n.data("mdui.headroom", o))
            })
        });
    var c = function () {
        function t(t, i, o) {
            var a = this;
            a.ns = o;
            var s = "mdui-" + a.ns + "-item";
            if (a.class_item = s,
                    a.class_item_open = s + "-open",
                    a.class_header = s + "-header",
                    a.class_body = s + "-body",
                    a.$collapse = e(t).eq(0),
                    a.$collapse.length) {
                var r = a.$collapse.data("mdui." + a.ns);
                if (r)
                    return r;
                a.options = e.extend({}, n, i || {}),
                    a.$collapse.on("click", "." + a.class_header, function () {
                        var t = e(this).parent("." + a.class_item);
                        a.$collapse.children(t).length && a.toggle(t)
                    }),
                    a.$collapse.on("click", "[mdui-" + a.ns + "-item-close]", function () {
                        var t = e(this).parents("." + a.class_item).eq(0);
                        a._isOpen(t) && a.close(t)
                    })
            }
        }

        var n = {
            accordion: !1
        };
        t.prototype._isOpen = function (t) {
            return t.hasClass(this.class_item_open)
        }
            ,
            t.prototype._getItem = function (t) {
                var n = this;
                return parseInt(t) === t ? n.$collapse.children("." + n.class_item).eq(t) : e(t).eq(0)
            }
        ;
        var i = function (t, e, n) {
            t._isOpen(n) ? (e.transition(0).height("auto").reflow().transition(""),
                r("opened", t.ns, t, n[0])) : (e.height(""),
                r("closed", t.ns, t, n[0]))
        };
        return t.prototype.open = function (t) {
            var n = this
                , o = n._getItem(t);
            if (!n._isOpen(o)) {
                n.options.accordion && n.$collapse.children("." + n.class_item_open).each(function () {
                    var t = e(this);
                    t !== o && n.close(t)
                });
                var a = o.children("." + n.class_body);
                a.height(a[0].scrollHeight).transitionEnd(function () {
                    i(n, a, o)
                }),
                    r("open", n.ns, n, o[0]),
                    o.addClass(n.class_item_open)
            }
        }
            ,
            t.prototype.close = function (t) {
                var e = this
                    , n = e._getItem(t);
                if (e._isOpen(n)) {
                    var o = n.children("." + e.class_body);
                    r("close", e.ns, e, n[0]),
                        n.removeClass(e.class_item_open),
                        o.transition(0).height(o[0].scrollHeight).reflow().transition("").height("").transitionEnd(function () {
                            i(e, o, n)
                        })
                }
            }
            ,
            t.prototype.toggle = function (t) {
                var e = this
                    , n = e._getItem(t);
                e._isOpen(n) ? e.close(n) : e.open(n)
            }
            ,
            t.prototype.openAll = function () {
                var t = this;
                t.$collapse.children("." + t.class_item).each(function () {
                    var n = e(this);
                    t._isOpen(n) || t.open(n)
                })
            }
            ,
            t.prototype.closeAll = function () {
                var t = this;
                t.$collapse.children("." + t.class_item).each(function () {
                    var n = e(this);
                    t._isOpen(n) && t.close(n)
                })
            }
            ,
            t
    }();
    return t.Collapse = function () {
        return function (t, e) {
            return new c(t, e, "collapse")
        }
    }(),
        e(function () {
            t.mutation("[mdui-collapse]", function () {
                var n = e(this)
                    , i = n.data("mdui.collapse");
                if (!i) {
                    var o = s(n.attr("mdui-collapse"));
                    i = new t.Collapse(n, o),
                        n.data("mdui.collapse", i)
                }
            })
        }),
        function () {
            function n(t) {
                var n = this;
                n.$table = e(t).eq(0),
                n.$table.length && n.init()
            }

            var i = function (t) {
                return "<" + t + ' class="mdui-table-cell-checkbox"><label class="mdui-checkbox"><input type="checkbox"/><i class="mdui-checkbox-icon"></i></label></' + t + ">"
            };
            n.prototype.init = function () {
                var t = this;
                t.$thRow = t.$table.find("thead tr"),
                    t.$tdRows = t.$table.find("tbody tr"),
                    t.$tdCheckboxs = e(),
                    t.selectable = t.$table.hasClass("mdui-table-selectable"),
                    t.selectedRow = 0,
                    t._updateThCheckbox(),
                    t._updateTdCheckbox(),
                    t._updateNumericCol()
            }
                ,
                n.prototype._updateTdCheckbox = function () {
                    var t = this;
                    t.$tdRows.each(function () {
                        var n = e(this);
                        if (n.find(".mdui-table-cell-checkbox").remove(),
                                t.selectable) {
                            var o = e(i("td")).prependTo(n).find('input[type="checkbox"]');
                            n.hasClass("mdui-table-row-selected") && (o[0].checked = !0,
                                t.selectedRow++),
                                t.$thCheckbox[0].checked = t.selectedRow === t.$tdRows.length,
                                o.on("change", function () {
                                    o[0].checked ? (n.addClass("mdui-table-row-selected"),
                                        t.selectedRow++) : (n.removeClass("mdui-table-row-selected"),
                                        t.selectedRow--),
                                        t.$thCheckbox[0].checked = t.selectedRow === t.$tdRows.length
                                }),
                                t.$tdCheckboxs = t.$tdCheckboxs.add(o)
                        }
                    })
                }
                ,
                n.prototype._updateThCheckbox = function () {
                    var t = this;
                    t.$thRow.find(".mdui-table-cell-checkbox").remove(),
                    t.selectable && (t.$thCheckbox = e(i("th")).prependTo(t.$thRow).find('input[type="checkbox"]').on("change", function () {
                        var n = t.$thCheckbox[0].checked;
                        t.selectedRow = n ? t.$tdRows.length : 0,
                            t.$tdCheckboxs.each(function (t, e) {
                                e.checked = n
                            }),
                            t.$tdRows.each(function (t, i) {
                                e(i)[n ? "addClass" : "removeClass"]("mdui-table-row-selected")
                            })
                    }))
                }
                ,
                n.prototype._updateNumericCol = function () {
                    var t, n, i = this;
                    i.$thRow.find("th").each(function (o, a) {
                        t = e(a),
                            i.$tdRows.each(function () {
                                n = e(this);
                                var i = t.hasClass("mdui-table-col-numeric") ? "addClass" : "removeClass";
                                n.find("td").eq(o)[i]("mdui-table-col-numeric")
                            })
                    })
                }
                ,
                t.mutation(".mdui-table", function () {
                    var t = e(this);
                    t.data("mdui.table") || t.data("mdui.table", new n(t))
                }),
                t.updateTables = function () {
                    e(arguments.length ? arguments[0] : ".mdui-table").each(function () {
                        var t = e(this)
                            , i = t.data("mdui.table");
                        i ? i.init() : t.data("mdui.table", new n(t))
                    })
                }
        }(),
        function () {
            function t(t) {
                if (t.length && !t.data("isRemoved")) {
                    t.data("isRemoved", !0);
                    var e = setTimeout(function () {
                        t.remove()
                    }, 400)
                        , n = t.data("translate");
                    t.addClass("mdui-ripple-wave-fill").transform(n.replace("scale(1)", "scale(1.01)")).transitionEnd(function () {
                        clearTimeout(e),
                            t.addClass("mdui-ripple-wave-out").transform(n.replace("scale(1)", "scale(1.01)")),
                            e = setTimeout(function () {
                                t.remove()
                            }, 700),
                            setTimeout(function () {
                                t.transitionEnd(function () {
                                    clearTimeout(e),
                                        t.remove()
                                })
                            }, 0)
                    })
                }
            }

            var i = {
                delay: 200,
                show: function (t, n) {
                    if (2 !== t.button) {
                        var i, o = (i = "touches" in t && t.touches.length ? t.touches[0] : t).pageX, a = i.pageY, s = n.offset(), r = {
                            x: o - s.left,
                            y: a - s.top
                        }, c = n.innerHeight(), d = n.innerWidth(), u = Math.max(Math.pow(Math.pow(c, 2) + Math.pow(d, 2), .5), 48), l = "translate3d(" + (d / 2 - r.x) + "px, " + (c / 2 - r.y) + "px, 0) scale(1)";
                        e('<div class="mdui-ripple-wave" style="width: ' + u + "px; height: " + u + "px; margin-top:-" + u / 2 + "px; margin-left:-" + u / 2 + "px; left:" + r.x + "px; top:" + r.y + 'px;"></div>').data("translate", l).prependTo(n).reflow().transform(l)
                    }
                },
                hide: function (n, o) {
                    var a = e(o || this);
                    a.children(".mdui-ripple-wave").each(function () {
                        t(e(this))
                    }),
                        a.off("touchmove touchend touchcancel mousemove mouseup mouseleave", i.hide)
                }
            };
            n.on(a.start, function (t) {
                if (a.isAllow(t) && (a.register(t),
                    t.target !== document)) {
                    var n, o = e(t.target);
                    if ((n = o.hasClass("mdui-ripple") ? o : o.parents(".mdui-ripple").eq(0)).length) {
                        if (n[0].disabled || null !== n.attr("disabled"))
                            return;
                        if ("touchstart" === t.type) {
                            var s = !1
                                , r = setTimeout(function () {
                                r = null,
                                    i.show(t, n)
                            }, i.delay)
                                , c = function (e) {
                                r && (clearTimeout(r),
                                    r = null,
                                    i.show(t, n)),
                                s || (s = !0,
                                    i.hide(e, n))
                            };
                            n.on("touchmove", function (t) {
                                r && (clearTimeout(r),
                                    r = null),
                                    c(t)
                            }).on("touchend touchcancel", c)
                        } else
                            i.show(t, n),
                                n.on("touchmove touchend touchcancel mousemove mouseup mouseleave", i.hide)
                    }
                }
            }).on(a.unlock, a.register)
        }(),
        function () {
            var i = function (t, e) {
                return !("object" != typeof t || null === t || void 0 === t[e] || !t[e]) && t[e]
            };
            n.on("input focus blur", ".mdui-textfield-input", {
                useCapture: !0
            }, function (t) {
                var n = t.target
                    , o = e(n)
                    , a = t.type
                    , s = o.val()
                    , r = i(t.detail, "reInit")
                    , c = i(t.detail, "domLoadedEvent")
                    , d = o.attr("type") || "";
                if (!(["checkbox", "button", "submit", "range", "radio", "image"].indexOf(d) >= 0)) {
                    var u = o.parent(".mdui-textfield");
                    if ("focus" === a && u.addClass("mdui-textfield-focus"),
                        "blur" === a && u.removeClass("mdui-textfield-focus"),
                        "blur" !== a && "input" !== a || u[s && "" !== s ? "addClass" : "removeClass"]("mdui-textfield-not-empty"),
                            u[n.disabled ? "addClass" : "removeClass"]("mdui-textfield-disabled"),
                        "input" !== a && "blur" !== a || c || n.validity && u[n.validity.valid ? "removeClass" : "addClass"]("mdui-textfield-invalid-html5"),
                        "textarea" === t.target.nodeName.toLowerCase()) {
                        var l = o.val()
                            , f = !1;
                        "" === l.replace(/[\r\n]/g, "") && (o.val(" " + l),
                            f = !0),
                            o.height("");
                        var p = o.height()
                            , h = n.scrollHeight;
                        h > p && o.height(h),
                        f && o.val(l)
                    }
                    r && u.find(".mdui-textfield-counter").remove();
                    var m = o.attr("maxlength");
                    if (m) {
                        (r || c) && e('<div class="mdui-textfield-counter"><span class="mdui-textfield-counter-inputed"></span> / ' + m + "</div>").appendTo(u);
                        var v = s.length + s.split("\n").length - 1;
                        u.find(".mdui-textfield-counter-inputed").text(v.toString())
                    }
                    (u.find(".mdui-textfield-helper").length || u.find(".mdui-textfield-error").length || m) && u.addClass("mdui-textfield-has-bottom")
                }
            }),
                n.on("click", ".mdui-textfield-expandable .mdui-textfield-icon", function () {
                    e(this).parents(".mdui-textfield").addClass("mdui-textfield-expanded").find(".mdui-textfield-input")[0].focus()
                }),
                n.on("click", ".mdui-textfield-expanded .mdui-textfield-close", function () {
                    e(this).parents(".mdui-textfield").removeClass("mdui-textfield-expanded").find(".mdui-textfield-input").val("")
                }),
                t.updateTextFields = function () {
                    e(arguments.length ? arguments[0] : ".mdui-textfield").each(function () {
                        e(this).find(".mdui-textfield-input").trigger("input", {
                            reInit: !0
                        })
                    })
                }
                ,
                t.mutation(".mdui-textfield", function () {
                    e(this).find(".mdui-textfield-input").trigger("input", {
                        domLoadedEvent: !0
                    })
                })
        }(),
        function () {
            var i = function (t) {
                var e = t.data()
                    , n = e.$track
                    , i = e.$fill
                    , o = e.$thumb
                    , a = e.$input
                    , s = e.min
                    , r = e.max
                    , c = e.disabled
                    , d = e.discrete
                    , u = e.$thumbText
                    , l = a.val()
                    , f = (l - s) / (r - s) * 100;
                i.width(f + "%"),
                    n.width(100 - f + "%"),
                c && (i.css("padding-right", "6px"),
                    n.css("padding-left", "6px")),
                    o.css("left", f + "%"),
                d && u.text(l),
                    t[0 === parseFloat(f) ? "addClass" : "removeClass"]("mdui-slider-zero")
            }
                , o = function (t) {
                var n = e('<div class="mdui-slider-track"></div>')
                    , o = e('<div class="mdui-slider-fill"></div>')
                    , a = e('<div class="mdui-slider-thumb"></div>')
                    , s = t.find('input[type="range"]')
                    , r = s[0].disabled;
                t[r ? "addClass" : "removeClass"]("mdui-slider-disabled"),
                    t.find(".mdui-slider-track").remove(),
                    t.find(".mdui-slider-fill").remove(),
                    t.find(".mdui-slider-thumb").remove(),
                    t.append(n).append(o).append(a);
                var c, d = t.hasClass("mdui-slider-discrete");
                d && (c = e("<span></span>"),
                    a.empty().append(c)),
                    t.data({
                        $track: n,
                        $fill: o,
                        $thumb: a,
                        $input: s,
                        min: s.attr("min"),
                        max: s.attr("max"),
                        disabled: r,
                        discrete: d,
                        $thumbText: c
                    }),
                    i(t)
            }
                , s = '.mdui-slider input[type="range"]';
            n.on("input change", s, function () {
                var t = e(this).parent();
                i(t)
            }).on(a.start, s, function (t) {
                a.isAllow(t) && (a.register(t),
                this.disabled || e(this).parent().addClass("mdui-slider-focus"))
            }).on(a.end, s, function (t) {
                a.isAllow(t) && (this.disabled || e(this).parent().removeClass("mdui-slider-focus"))
            }).on(a.unlock, s, a.register),
                t.mutation(".mdui-slider", function () {
                    o(e(this))
                }),
                t.updateSliders = function () {
                    e(arguments.length ? arguments[0] : ".mdui-slider").each(function () {
                        o(e(this))
                    })
                }
        }(),
        t.Fab = function () {
            function t(t, o) {
                var s = this;
                if (s.$fab = e(t).eq(0),
                        s.$fab.length) {
                    var r = s.$fab.data("mdui.fab");
                    if (r)
                        return r;
                    s.options = e.extend({}, i, o || {}),
                        s.state = "closed",
                        s.$btn = s.$fab.find(".mdui-fab"),
                        s.$dial = s.$fab.find(".mdui-fab-dial"),
                        s.$dialBtns = s.$dial.find(".mdui-fab"),
                    "hover" === s.options.trigger && (s.$btn.on("touchstart mouseenter", function () {
                        s.open()
                    }),
                        s.$fab.on("mouseleave", function () {
                            s.close()
                        })),
                    "click" === s.options.trigger && s.$btn.on(a.start, function () {
                        s.open()
                    }),
                        n.on(a.start, function (t) {
                            e(t.target).parents(".mdui-fab-wrapper").length || s.close()
                        })
                }
            }

            var i = {
                trigger: "hover"
            };
            return t.prototype.open = function () {
                var t = this;
                "opening" !== t.state && "opened" !== t.state && (t.$dialBtns.each(function (e, n) {
                    n.style["transition-delay"] = n.style["-webkit-transition-delay"] = 15 * (t.$dialBtns.length - e) + "ms"
                }),
                    t.$dial.css("height", "auto").addClass("mdui-fab-dial-show"),
                t.$btn.find(".mdui-fab-opened").length && t.$btn.addClass("mdui-fab-opened"),
                    t.state = "opening",
                    r("open", "fab", t, t.$fab),
                    t.$dialBtns.eq(0).transitionEnd(function () {
                        t.$btn.hasClass("mdui-fab-opened") && (t.state = "opened",
                            r("opened", "fab", t, t.$fab))
                    }))
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    "closing" !== t.state && "closed" !== t.state && (t.$dialBtns.each(function (t, e) {
                        e.style["transition-delay"] = e.style["-webkit-transition-delay"] = 15 * t + "ms"
                    }),
                        t.$dial.removeClass("mdui-fab-dial-show"),
                        t.$btn.removeClass("mdui-fab-opened"),
                        t.state = "closing",
                        r("close", "fab", t, t.$fab),
                        t.$dialBtns.eq(-1).transitionEnd(function () {
                            t.$btn.hasClass("mdui-fab-opened") || (t.state = "closed",
                                r("closed", "fab", t, t.$fab),
                                t.$dial.css("height", 0))
                        }))
                }
                ,
                t.prototype.toggle = function () {
                    var t = this;
                    "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
                }
                ,
                t.prototype.getState = function () {
                    return this.state
                }
                ,
                t.prototype.show = function () {
                    this.$fab.removeClass("mdui-fab-hide")
                }
                ,
                t.prototype.hide = function () {
                    this.$fab.addClass("mdui-fab-hide")
                }
                ,
                t
        }(),
        e(function () {
            n.on("touchstart mousedown mouseover", "[mdui-fab]", function (n) {
                var i = e(this)
                    , o = i.data("mdui.fab");
                if (!o) {
                    var a = s(i.attr("mdui-fab"));
                    o = new t.Fab(i, a),
                        i.data("mdui.fab", o)
                }
            })
        }),
        t.Select = function () {
            function t(t, i) {
                var a = this
                    , s = a.$selectNative = e(t).eq(0);
                if (s.length) {
                    var r = s.data("mdui.select");
                    if (r)
                        return r;
                    s.hide(),
                        a.options = e.extend({}, o, i || {}),
                        a.uniqueID = e.guid(),
                        a.state = "closed",
                        a.handleUpdate(),
                        n.on("click touchstart", function (t) {
                            var n = e(t.target);
                            "opening" !== a.state && "opened" !== a.state || n.is(a.$select) || e.contains(a.$select[0], n[0]) || a.close()
                        })
                }
            }

            var o = {
                position: "auto",
                gutter: 16
            }
                , a = function (t) {
                var e, n, o = i.height(), a = t.options.gutter, s = t.options.position, r = parseInt(t.$select.height()), c = t.$items.eq(0), d = parseInt(c.height()), u = parseInt(c.css("margin-top")), l = parseFloat(t.$select.width() + .01), f = d * t.size + 2 * u, p = t.$select[0].getBoundingClientRect().top;
                if ("auto" === s) {
                    var h = o - 2 * a;
                    f > h && (f = h),
                        n = -(u + t.selectedIndex * d + (d - r) / 2);
                    var m = -(u + (t.size - 1) * d + (d - r) / 2);
                    n < m && (n = m);
                    var v = p + n;
                    v < a ? n = -(p - a) : v + f + a > o && (n = -(p + f + a - o)),
                        e = t.selectedIndex * d + d / 2 + u + "px"
                } else
                    "bottom" === s ? (n = r,
                        e = "0px") : "top" === s && (n = -f - 1,
                        e = "100%");
                t.$select.width(l),
                    t.$menu.width(l).height(f).css({
                        "margin-top": n + "px",
                        "transform-origin": "center " + e + " 0"
                    })
            };
            t.prototype.handleUpdate = function () {
                var t = this;
                "opening" !== t.state && "opened" !== t.state || t.close();
                var n = t.$selectNative;
                t.value = n.val(),
                    t.text = "",
                    t.$items = e(),
                    n.find("option").each(function (n, i) {
                        var o = {
                            value: i.value,
                            text: i.textContent,
                            disabled: i.disabled,
                            selected: t.value === i.value,
                            index: n
                        };
                        t.value === o.value && (t.text = o.text,
                            t.selectedIndex = n),
                            t.$items = t.$items.add(e('<div class="mdui-select-menu-item mdui-ripple"' + (o.disabled ? " disabled" : "") + (o.selected ? " selected" : "") + ">" + o.text + "</div>").data(o))
                    }),
                    t.$selected = e('<span class="mdui-select-selected">' + t.text + "</span>"),
                    t.$select = e('<div class="mdui-select mdui-select-position-' + t.options.position + '" style="' + t.$selectNative.attr("style") + '" id="' + t.uniqueID + '"></div>').show().append(t.$selected),
                    t.$menu = e('<div class="mdui-select-menu"></div>').appendTo(t.$select).append(t.$items),
                    e("#" + t.uniqueID).remove(),
                    n.after(t.$select),
                    t.size = t.$selectNative.attr("size"),
                t.size || (t.size = t.$items.length,
                t.size > 8 && (t.size = 8)),
                t.size < 2 && (t.size = 2),
                    t.$items.on("click", function () {
                        if ("closing" !== t.state) {
                            var i = e(this);
                            if (!i.data("disabled")) {
                                var o = i.data();
                                t.$selected.text(o.text),
                                    n.val(o.value),
                                    t.$items.removeAttr("selected"),
                                    i.attr("selected", ""),
                                    t.selectedIndex = o.index,
                                    t.value = o.value,
                                    t.text = o.text,
                                    n.trigger("change"),
                                    t.close()
                            }
                        }
                    }),
                    t.$select.on("click", function (n) {
                        var i = e(n.target);
                        i.is(".mdui-select-menu") || i.is(".mdui-select-menu-item") || t.toggle()
                    })
            }
            ;
            var s = function (t) {
                t.$select.removeClass("mdui-select-closing"),
                "opening" === t.state && (t.state = "opened",
                    r("opened", "select", t, t.$selectNative),
                    t.$menu.css("overflow-y", "auto")),
                "closing" === t.state && (t.state = "closed",
                    r("closed", "select", t, t.$selectNative),
                    t.$select.width(""),
                    t.$menu.css({
                        "margin-top": "",
                        height: "",
                        width: ""
                    }))
            };
            return t.prototype.open = function () {
                var t = this;
                "opening" !== t.state && "opened" !== t.state && (t.state = "opening",
                    r("open", "select", t, t.$selectNative),
                    a(t),
                    t.$select.addClass("mdui-select-open"),
                    t.$menu.transitionEnd(function () {
                        s(t)
                    }))
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    "closing" !== t.state && "closed" !== t.state && (t.state = "closing",
                        r("close", "select", t, t.$selectNative),
                        t.$menu.css("overflow-y", ""),
                        t.$select.removeClass("mdui-select-open").addClass("mdui-select-closing"),
                        t.$menu.transitionEnd(function () {
                            s(t)
                        }))
                }
                ,
                t.prototype.toggle = function () {
                    var t = this;
                    "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
                }
                ,
                t
        }(),
        e(function () {
            t.mutation("[mdui-select]", function () {
                var n = e(this)
                    , i = n.data("mdui.select");
                i || (i = new t.Select(n, s(n.attr("mdui-select"))),
                    n.data("mdui.select", i))
            })
        }),
        e(function () {
            t.mutation(".mdui-appbar-scroll-hide", function () {
                var n = e(this);
                n.data("mdui.headroom", new t.Headroom(n))
            }),
                t.mutation(".mdui-appbar-scroll-toolbar-hide", function () {
                    var n = e(this)
                        , i = new t.Headroom(n, {
                        pinnedClass: "mdui-headroom-pinned-toolbar",
                        unpinnedClass: "mdui-headroom-unpinned-toolbar"
                    });
                    n.data("mdui.headroom", i)
                })
        }),
        t.Tab = function () {
            function t(t, o) {
                var a = this;
                if (a.$tab = e(t).eq(0),
                        a.$tab.length) {
                    var s = a.$tab.data("mdui.tab");
                    if (s)
                        return s;
                    a.options = e.extend({}, n, o || {}),
                        a.$tabs = a.$tab.children("a"),
                        a.$indicator = e('<div class="mdui-tab-indicator"></div>').appendTo(a.$tab),
                        a.activeIndex = !1;
                    var r = location.hash;
                    r && a.$tabs.each(function (t, n) {
                        if (e(n).attr("href") === r)
                            return a.activeIndex = t,
                                !1
                    }),
                    !1 === a.activeIndex && a.$tabs.each(function (t, n) {
                        if (e(n).hasClass("mdui-tab-active"))
                            return a.activeIndex = t,
                                !1
                    }),
                    a.$tabs.length && !1 === a.activeIndex && (a.activeIndex = 0),
                        a._setActive(),
                        i.on("resize", e.throttle(function () {
                            a._setIndicatorPosition()
                        }, 100)),
                        a.$tabs.each(function (t, e) {
                            a._bindTabEvent(e)
                        })
                }
            }

            var n = {
                trigger: "click",
                loop: !1
            }
                , o = function (t) {
                return t[0].disabled || null !== t.attr("disabled")
            };
            return t.prototype._bindTabEvent = function (t) {
                var n = this
                    , i = e(t)
                    , a = function (e) {
                    o(i) ? e.preventDefault() : (n.activeIndex = n.$tabs.index(t),
                        n._setActive())
                };
                i.on("click", a),
                "hover" === n.options.trigger && i.on("mouseenter", a),
                    i.on("click", function (t) {
                        0 === i.attr("href").indexOf("#") && t.preventDefault()
                    })
            }
                ,
                t.prototype._setActive = function () {
                    var t = this;
                    t.$tabs.each(function (n, i) {
                        var a = e(i)
                            , s = a.attr("href");
                        n !== t.activeIndex || o(a) ? (a.removeClass("mdui-tab-active"),
                            e(s).hide()) : (a.hasClass("mdui-tab-active") || (r("change", "tab", t, t.$tab, {
                            index: t.activeIndex,
                            id: s.substr(1)
                        }),
                            r("show", "tab", t, a),
                            a.addClass("mdui-tab-active")),
                            e(s).show(),
                            t._setIndicatorPosition())
                    })
                }
                ,
                t.prototype._setIndicatorPosition = function () {
                    var t, e, n = this;
                    !1 !== n.activeIndex ? (t = n.$tabs.eq(n.activeIndex),
                    o(t) || (e = t.offset(),
                        n.$indicator.css({
                            left: e.left + n.$tab[0].scrollLeft - n.$tab[0].getBoundingClientRect().left + "px",
                            width: t.width() + "px"
                        }))) : n.$indicator.css({
                        left: 0,
                        width: 0
                    })
                }
                ,
                t.prototype.next = function () {
                    var t = this;
                    !1 !== t.activeIndex && (t.$tabs.length > t.activeIndex + 1 ? t.activeIndex++ : t.options.loop && (t.activeIndex = 0),
                        t._setActive())
                }
                ,
                t.prototype.prev = function () {
                    var t = this;
                    !1 !== t.activeIndex && (t.activeIndex > 0 ? t.activeIndex-- : t.options.loop && (t.activeIndex = t.$tabs.length - 1),
                        t._setActive())
                }
                ,
                t.prototype.show = function (t) {
                    var e = this;
                    !1 !== e.activeIndex && (parseInt(t) === t ? e.activeIndex = t : e.$tabs.each(function (n, i) {
                        if (i.id === t)
                            return e.activeIndex = n,
                                !1
                    }),
                        e._setActive())
                }
                ,
                t.prototype.handleUpdate = function () {
                    var t = this
                        , e = t.$tabs
                        , n = t.$tab.children("a")
                        , i = e.get()
                        , o = n.get();
                    if (!n.length)
                        return t.activeIndex = !1,
                            t.$tabs = n,
                            void t._setIndicatorPosition();
                    n.each(function (e, n) {
                        i.indexOf(n) < 0 && (t._bindTabEvent(n),
                            !1 === t.activeIndex ? t.activeIndex = 0 : e <= t.activeIndex && t.activeIndex++)
                    }),
                        e.each(function (e, n) {
                            o.indexOf(n) < 0 && (e < t.activeIndex ? t.activeIndex-- : e === t.activeIndex && (t.activeIndex = 0))
                        }),
                        t.$tabs = n,
                        t._setActive()
                }
                ,
                t
        }(),
        e(function () {
            t.mutation("[mdui-tab]", function () {
                var n = e(this)
                    , i = n.data("mdui.tab");
                i || (i = new t.Tab(n, s(n.attr("mdui-tab"))),
                    n.data("mdui.tab", i))
            })
        }),
        t.Drawer = function () {
            function t(t, s) {
                var r = this;
                if (r.$drawer = e(t).eq(0),
                        r.$drawer.length) {
                    var c = r.$drawer.data("mdui.drawer");
                    if (c)
                        return c;
                    r.options = e.extend({}, n, s || {}),
                        r.overlay = !1,
                        r.position = r.$drawer.hasClass("mdui-drawer-right") ? "right" : "left",
                        r.$drawer.hasClass("mdui-drawer-close") ? r.state = "closed" : r.$drawer.hasClass("mdui-drawer-open") ? r.state = "opened" : o() ? r.state = "opened" : r.state = "closed",
                        i.on("resize", e.throttle(function () {
                            o() ? (r.overlay && !r.options.overlay && (e.hideOverlay(),
                                r.overlay = !1,
                                e.unlockScreen()),
                            r.$drawer.hasClass("mdui-drawer-close") || (r.state = "opened")) : r.overlay || "opened" !== r.state || (r.$drawer.hasClass("mdui-drawer-open") ? (e.showOverlay(),
                                r.overlay = !0,
                                e.lockScreen(),
                                e(".mdui-overlay").one("click", function () {
                                    r.close()
                                })) : r.state = "closed")
                        }, 100)),
                        r.$drawer.find("[mdui-drawer-close]").each(function () {
                            e(this).on("click", function () {
                                r.close()
                            })
                        }),
                        a(r)
                }
            }

            var n = {
                overlay: !1,
                swipe: !1
            }
                , o = function () {
                return i.width() >= 1024
            }
                , a = function (t) {
                function n(e, n) {
                    var i = "translate(" + -1 * ("right" === t.position ? -1 : 1) * e + "px, 0) !important;";
                    t.$drawer.css("cssText", "transform:" + i + (n ? "transition: initial !important;" : ""))
                }

                function i() {
                    t.$drawer.css({
                        transform: "",
                        transition: ""
                    })
                }

                function o() {
                    return t.$drawer.width() + 10
                }

                function a(t) {
                    return Math.min(Math.max("closing" === p ? f - t : o() + f - t, 0), o())
                }

                function s(e) {
                    u = e.touches[0].pageX,
                    "right" === t.position && (u = m.width() - u),
                        l = e.touches[0].pageY,
                    "opened" !== t.state && (u > v || d !== s) || (h = !0,
                        m.on({
                            touchmove: r,
                            touchend: c,
                            touchcancel: r
                        }))
                }

                function r(i) {
                    var o = i.touches[0].pageX;
                    "right" === t.position && (o = m.width() - o);
                    var s = i.touches[0].pageY;
                    if (p)
                        n(a(o), !0);
                    else if (h) {
                        var r = Math.abs(o - u)
                            , d = Math.abs(s - l);
                        r > 8 && d <= 8 ? (f = o,
                            p = "opened" === t.state ? "closing" : "opening",
                            e.lockScreen(),
                            n(a(o), !0)) : r <= 8 && d > 8 && c()
                    }
                }

                function c(n) {
                    if (p) {
                        var s = n.changedTouches[0].pageX;
                        "right" === t.position && (s = m.width() - s);
                        var d = a(s) / o();
                        h = !1;
                        var u = p;
                        p = null,
                            "opening" === u ? d < .92 ? (i(),
                                t.open()) : i() : d > .08 ? (i(),
                                t.close()) : i(),
                            e.unlockScreen()
                    } else
                        h = !1;
                    m.off({
                        touchmove: r,
                        touchend: c,
                        touchcancel: r
                    })
                }

                var d, u, l, f, p = !1, h = !1, m = e("body"), v = 24;
                t.options.swipe && (d || (m.on("touchstart", s),
                    d = s))
            }
                , s = function (t) {
                t.$drawer.hasClass("mdui-drawer-open") ? (t.state = "opened",
                    r("opened", "drawer", t, t.$drawer)) : (t.state = "closed",
                    r("closed", "drawer", t, t.$drawer))
            };
            return t.prototype.open = function () {
                var t = this;
                "opening" !== t.state && "opened" !== t.state && (t.state = "opening",
                    r("open", "drawer", t, t.$drawer),
                t.options.overlay || e("body").addClass("mdui-drawer-body-" + t.position),
                    t.$drawer.removeClass("mdui-drawer-close").addClass("mdui-drawer-open").transitionEnd(function () {
                        s(t)
                    }),
                o() && !t.options.overlay || (t.overlay = !0,
                    e.showOverlay().one("click", function () {
                        t.close()
                    }),
                    e.lockScreen()))
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    "closing" !== t.state && "closed" !== t.state && (t.state = "closing",
                        r("close", "drawer", t, t.$drawer),
                    t.options.overlay || e("body").removeClass("mdui-drawer-body-" + t.position),
                        t.$drawer.addClass("mdui-drawer-close").removeClass("mdui-drawer-open").transitionEnd(function () {
                            s(t)
                        }),
                    t.overlay && (e.hideOverlay(),
                        t.overlay = !1,
                        e.unlockScreen()))
                }
                ,
                t.prototype.toggle = function () {
                    var t = this;
                    "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
                }
                ,
                t.prototype.getState = function () {
                    return this.state
                }
                ,
                t
        }(),
        e(function () {
            t.mutation("[mdui-drawer]", function () {
                var n = e(this)
                    , i = s(n.attr("mdui-drawer"))
                    , o = i.target;
                delete i.target;
                var a = e(o).eq(0)
                    , r = a.data("mdui.drawer");
                r || (r = new t.Drawer(a, i),
                    a.data("mdui.drawer", r)),
                    n.on("click", function () {
                        r.toggle()
                    })
            })
        }),
        t.Dialog = function () {
            function t(t, n) {
                var i = this;
                if (i.$dialog = e(t).eq(0),
                        i.$dialog.length) {
                    var o = i.$dialog.data("mdui.dialog");
                    if (o)
                        return o;
                    e.contains(document.body, i.$dialog[0]) || (i.append = !0,
                        e("body").append(i.$dialog)),
                        i.options = e.extend({}, d, n || {}),
                        i.state = "closed",
                        i.$dialog.find("[mdui-dialog-cancel]").each(function () {
                            e(this).on("click", function () {
                                r("cancel", "dialog", i, i.$dialog),
                                i.options.closeOnCancel && i.close()
                            })
                        }),
                        i.$dialog.find("[mdui-dialog-confirm]").each(function () {
                            e(this).on("click", function () {
                                r("confirm", "dialog", i, i.$dialog),
                                i.options.closeOnConfirm && i.close()
                            })
                        }),
                        i.$dialog.find("[mdui-dialog-close]").each(function () {
                            e(this).on("click", function () {
                                i.close()
                            })
                        })
                }
            }

            var a, s, c, d = {
                history: !0,
                overlay: !0,
                modal: !1,
                closeOnEsc: !0,
                closeOnCancel: !0,
                closeOnConfirm: !0,
                destroyOnClosed: !1
            }, u = "__md_dialog", l = function () {
                if (c) {
                    var t = c.$dialog
                        , e = t.children(".mdui-dialog-title")
                        , n = t.children(".mdui-dialog-content")
                        , o = t.children(".mdui-dialog-actions");
                    t.height(""),
                        n.height("");
                    var a = t.height();
                    t.css({
                        top: (i.height() - a) / 2 + "px",
                        height: a + "px"
                    }),
                        n.height(a - (e.height() || 0) - (o.height() || 0))
                }
            }, f = function () {
                location.hash.substring(1).indexOf("&mdui-dialog") < 0 && c.close(!0)
            }, p = function (t) {
                e(t.target).hasClass("mdui-overlay") && c && c.close()
            }, h = function (t) {
                t.$dialog.hasClass("mdui-dialog-open") ? (t.state = "opened",
                    r("opened", "dialog", t, t.$dialog)) : (t.state = "closed",
                    r("closed", "dialog", t, t.$dialog),
                    t.$dialog.hide(),
                0 === o.queue(u).length && !c && s && (e.unlockScreen(),
                    s = !1),
                    i.off("resize", e.throttle(function () {
                        l()
                    }, 100)),
                t.options.destroyOnClosed && t.destroy())
            };
            return t.prototype._doOpen = function () {
                var t = this;
                if (c = t,
                    s || (e.lockScreen(),
                        s = !0),
                        t.$dialog.show(),
                        l(),
                        i.on("resize", e.throttle(function () {
                            l()
                        }, 100)),
                        t.state = "opening",
                        r("open", "dialog", t, t.$dialog),
                        t.$dialog.addClass("mdui-dialog-open").transitionEnd(function () {
                            h(t)
                        }),
                    a || (a = e.showOverlay(5100)),
                        a[t.options.modal ? "off" : "on"]("click", p).css("opacity", t.options.overlay ? "" : 0),
                        t.options.history) {
                    var n = location.hash.substring(1);
                    n.indexOf("&mdui-dialog") > -1 && (n = n.replace(/&mdui-dialog/g, "")),
                        location.hash = n + "&mdui-dialog",
                        i.on("hashchange", f)
                }
            }
                ,
                t.prototype.open = function () {
                    var t = this;
                    "opening" !== t.state && "opened" !== t.state && (c && ("opening" === c.state || "opened" === c.state) || o.queue(u).length ? o.queue(u, function () {
                        t._doOpen()
                    }) : t._doOpen())
                }
                ,
                t.prototype.close = function () {
                    var t = this;
                    setTimeout(function () {
                        "closing" !== t.state && "closed" !== t.state && (c = null,
                            t.state = "closing",
                            r("close", "dialog", t, t.$dialog),
                        0 === o.queue(u).length && a && (e.hideOverlay(),
                            a = null),
                            t.$dialog.removeClass("mdui-dialog-open").transitionEnd(function () {
                                h(t)
                            }),
                        t.options.history && 0 === o.queue(u).length && (arguments[0] || window.history.back(),
                            i.off("hashchange", f)),
                            setTimeout(function () {
                                o.dequeue(u)
                            }, 100))
                    }, 0)
                }
                ,
                t.prototype.toggle = function () {
                    var t = this;
                    "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
                }
                ,
                t.prototype.getState = function () {
                    return this.state
                }
                ,
                t.prototype.destroy = function () {
                    var t = this;
                    t.append && t.$dialog.remove(),
                        t.$dialog.removeData("mdui.dialog"),
                    0 !== o.queue(u).length || c || (a && (e.hideOverlay(),
                        a = null),
                    s && (e.unlockScreen(),
                        s = !1))
                }
                ,
                t.prototype.handleUpdate = function () {
                    l()
                }
                ,
                n.on("keydown", function (t) {
                    c && c.options.closeOnEsc && "opened" === c.state && 27 === t.keyCode && c.close()
                }),
                t
        }(),
        e(function () {
            n.on("click", "[mdui-dialog]", function () {
                var n = e(this)
                    , i = s(n.attr("mdui-dialog"))
                    , o = i.target;
                delete i.target;
                var a = e(o).eq(0)
                    , r = a.data("mdui.dialog");
                r || (r = new t.Dialog(a, i),
                    a.data("mdui.dialog", r)),
                    r.open()
            })
        }),
        t.dialog = function (n) {
            var i = {
                title: "",
                content: "",
                buttons: [],
                stackedButtons: !1,
                cssClass: "",
                history: !0,
                overlay: !0,
                modal: !1,
                closeOnEsc: !0,
                destroyOnClosed: !0,
                onOpen: function () {
                },
                onOpened: function () {
                },
                onClose: function () {
                },
                onClosed: function () {
                }
            }
                , o = {
                text: "",
                bold: !1,
                close: !0,
                onClick: function (t) {
                }
            };
            n = e.extend({}, i, n || {}),
                e.each(n.buttons, function (t, i) {
                    n.buttons[t] = e.extend({}, o, i)
                });
            var a = "";
            n.buttons.length && (a = '<div class="mdui-dialog-actions ' + (n.stackedButtons ? "mdui-dialog-actions-stacked" : "") + '">',
                e.each(n.buttons, function (t, e) {
                    a += '<a href="javascript:void(0)" class="mdui-btn mdui-ripple mdui-text-color-primary ' + (e.bold ? "mdui-btn-bold" : "") + '">' + e.text + "</a>"
                }),
                a += "</div>");
            var s = '<div class="mdui-dialog ' + n.cssClass + '">' + (n.title ? '<div class="mdui-dialog-title">' + n.title + "</div>" : "") + (n.content ? '<div class="mdui-dialog-content">' + n.content + "</div>" : "") + a + "</div>"
                , r = new t.Dialog(s, {
                history: n.history,
                overlay: n.overlay,
                modal: n.modal,
                closeOnEsc: n.closeOnEsc,
                destroyOnClosed: n.destroyOnClosed
            });
            return n.buttons.length && r.$dialog.find(".mdui-dialog-actions .mdui-btn").each(function (t, i) {
                e(i).on("click", function () {
                    "function" == typeof n.buttons[t].onClick && n.buttons[t].onClick(r),
                    n.buttons[t].close && r.close()
                })
            }),
            "function" == typeof n.onOpen && r.$dialog.on("open.mdui.dialog", function () {
                n.onOpen(r)
            }).on("opened.mdui.dialog", function () {
                n.onOpened(r)
            }).on("close.mdui.dialog", function () {
                n.onClose(r)
            }).on("closed.mdui.dialog", function () {
                n.onClosed(r)
            }),
                r.open(),
                r
        }
        ,
        t.alert = function (n, i, o, a) {
            "function" == typeof i && (i = "",
                o = arguments[1],
                a = arguments[2]),
            void 0 === o && (o = function () {
                }
            ),
            void 0 === a && (a = {});
            var s = {
                confirmText: "ok",
                history: !0,
                modal: !1,
                closeOnEsc: !0
            };
            return a = e.extend({}, s, a),
                t.dialog({
                    title: i,
                    content: n,
                    buttons: [{
                        text: a.confirmText,
                        bold: !1,
                        close: !0,
                        onClick: o
                    }],
                    cssClass: "mdui-dialog-alert",
                    history: a.history,
                    modal: a.modal,
                    closeOnEsc: a.closeOnEsc
                })
        }
        ,
        t.confirm = function (n, i, o, a, s) {
            "function" == typeof i && (i = "",
                o = arguments[1],
                a = arguments[2],
                s = arguments[3]),
            void 0 === o && (o = function () {
                }
            ),
            void 0 === a && (a = function () {
                }
            ),
            void 0 === s && (s = {});
            var r = {
                confirmText: "ok",
                cancelText: "cancel",
                history: !0,
                modal: !1,
                closeOnEsc: !0
            };
            return s = e.extend({}, r, s),
                t.dialog({
                    title: i,
                    content: n,
                    buttons: [{
                        text: s.cancelText,
                        bold: !1,
                        close: !0,
                        onClick: a
                    }, {
                        text: s.confirmText,
                        bold: !1,
                        close: !0,
                        onClick: o
                    }],
                    cssClass: "mdui-dialog-confirm",
                    history: s.history,
                    modal: s.modal,
                    closeOnEsc: s.closeOnEsc
                })
        }
        ,
        t.prompt = function (n, i, o, a, s) {
            "function" == typeof i && (i = "",
                o = arguments[1],
                a = arguments[2],
                s = arguments[3]),
            void 0 === o && (o = function () {
                }
            ),
            void 0 === a && (a = function () {
                }
            ),
            void 0 === s && (s = {});
            var r = {
                confirmText: "ok",
                cancelText: "cancel",
                history: !0,
                modal: !1,
                closeOnEsc: !0,
                type: "text",
                maxlength: "",
                defaultValue: "",
                confirmOnEnter: !1
            };
            s = e.extend({}, r, s);
            var c = '<div class="mdui-textfield">' + (n ? '<label class="mdui-textfield-label">' + n + "</label>" : "") + ("text" === s.type ? '<input class="mdui-textfield-input" type="text" value="' + s.defaultValue + '" ' + (s.maxlength ? 'maxlength="' + s.maxlength + '"' : "") + "/>" : "") + ("textarea" === s.type ? '<textarea class="mdui-textfield-input" ' + (s.maxlength ? 'maxlength="' + s.maxlength + '"' : "") + ">" + s.defaultValue + "</textarea>" : "") + "</div>";
            return t.dialog({
                title: i,
                content: c,
                buttons: [{
                    text: s.cancelText,
                    bold: !1,
                    close: !0,
                    onClick: function (t) {
                        var e = t.$dialog.find(".mdui-textfield-input").val();
                        a(e, t)
                    }
                }, {
                    text: s.confirmText,
                    bold: !1,
                    close: !0,
                    onClick: function (t) {
                        var e = t.$dialog.find(".mdui-textfield-input").val();
                        o(e, t)
                    }
                }],
                cssClass: "mdui-dialog-prompt",
                history: s.history,
                modal: s.modal,
                closeOnEsc: s.closeOnEsc,
                onOpen: function (e) {
                    var n = e.$dialog.find(".mdui-textfield-input");
                    t.updateTextFields(n),
                        n[0].focus(),
                    "text" === s.type && !0 === s.confirmOnEnter && n.on("keydown", function (t) {
                        if (13 === t.keyCode) {
                            var n = e.$dialog.find(".mdui-textfield-input").val();
                            o(n, e),
                                e.close()
                        }
                    }),
                    "textarea" === s.type && n.on("input", function () {
                        e.handleUpdate()
                    }),
                    s.maxlength && e.handleUpdate()
                }
            })
        }
        ,
        t.Tooltip = function () {
            function t(t) {
                var e, n, o, a = t.$target[0].getBoundingClientRect(), s = c() ? 14 : 24, r = t.$tooltip[0].offsetWidth, d = t.$tooltip[0].offsetHeight;
                switch (o = t.options.position,
                -1 === ["bottom", "top", "left", "right"].indexOf(o) && (o = a.top + a.height + s + d + 2 < i.height() ? "bottom" : s + d + 2 < a.top ? "top" : s + r + 2 < a.left ? "left" : a.width + s + r + 2 < i.width() - a.left ? "right" : "bottom"),
                    o) {
                    case "bottom":
                        e = r / 2 * -1,
                            n = a.height / 2 + s,
                            t.$tooltip.transformOrigin("top center");
                        break;
                    case "top":
                        e = r / 2 * -1,
                            n = -1 * (d + a.height / 2 + s),
                            t.$tooltip.transformOrigin("bottom center");
                        break;
                    case "left":
                        e = -1 * (r + a.width / 2 + s),
                            n = d / 2 * -1,
                            t.$tooltip.transformOrigin("center right");
                        break;
                    case "right":
                        e = a.width / 2 + s,
                            n = d / 2 * -1,
                            t.$tooltip.transformOrigin("center left")
                }
                var u = t.$target.offset();
                t.$tooltip.css({
                    top: u.top + a.height / 2 + "px",
                    left: u.left + a.width / 2 + "px",
                    "margin-left": e + "px",
                    "margin-top": n + "px"
                })
            }

            function n(t, n) {
                var i = this;
                if (i.$target = e(t).eq(0),
                        i.$target.length) {
                    var s = i.$target.data("mdui.tooltip");
                    if (s)
                        return s;
                    i.options = e.extend({}, o, n || {}),
                        i.state = "closed",
                        i.$tooltip = e('<div class="mdui-tooltip" id="' + e.guid() + '">' + i.options.content + "</div>").appendTo(document.body),
                        i.$target.on("touchstart mouseenter", function (t) {
                            this.disabled || a.isAllow(t) && (a.register(t),
                                i.open())
                        }).on("touchend mouseleave", function (t) {
                            this.disabled || a.isAllow(t) && i.close()
                        }).on(a.unlock, function (t) {
                            this.disabled || a.register(t)
                        })
                }
            }

            var o = {
                position: "auto",
                delay: 0,
                content: ""
            }
                , c = function () {
                return i.width() > 1024
            }
                , d = function (t) {
                t.$tooltip.hasClass("mdui-tooltip-open") ? (t.state = "opened",
                    r("opened", "tooltip", t, t.$target)) : (t.state = "closed",
                    r("closed", "tooltip", t, t.$target))
            };
            return n.prototype._doOpen = function () {
                var t = this;
                t.state = "opening",
                    r("open", "tooltip", t, t.$target),
                    t.$tooltip.addClass("mdui-tooltip-open").transitionEnd(function () {
                        d(t)
                    })
            }
                ,
                n.prototype.open = function (n) {
                    var i = this;
                    if ("opening" !== i.state && "opened" !== i.state) {
                        var o = e.extend({}, i.options);
                        e.extend(i.options, s(i.$target.attr("mdui-tooltip"))),
                        n && e.extend(i.options, n),
                        o.content !== i.options.content && i.$tooltip.html(i.options.content),
                            t(i),
                            i.options.delay ? i.timeoutId = setTimeout(function () {
                                i._doOpen()
                            }, i.options.delay) : (i.timeoutId = !1,
                                i._doOpen())
                    }
                }
                ,
                n.prototype.close = function () {
                    var t = this;
                    t.timeoutId && (clearTimeout(t.timeoutId),
                        t.timeoutId = !1),
                    "closing" !== t.state && "closed" !== t.state && (t.state = "closing",
                        r("close", "tooltip", t, t.$target),
                        t.$tooltip.removeClass("mdui-tooltip-open").transitionEnd(function () {
                            d(t)
                        }))
                }
                ,
                n.prototype.toggle = function () {
                    var t = this;
                    "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
                }
                ,
                n.prototype.getState = function () {
                    return this.state
                }
                ,
                n
        }(),
        e(function () {
            n.on("touchstart mouseover", "[mdui-tooltip]", function () {
                var n = e(this)
                    , i = n.data("mdui.tooltip");
                if (!i) {
                    var o = s(n.attr("mdui-tooltip"));
                    i = new t.Tooltip(n, o),
                        n.data("mdui.tooltip", i)
                }
            })
        }),
        function () {
            function i(t, n) {
                var i = this;
                if (i.message = t,
                        i.options = e.extend({}, r, n || {}),
                        i.message) {
                    i.state = "closed",
                        i.timeoutId = !1;
                    var o = ""
                        , a = "";
                    0 === i.options.buttonColor.indexOf("#") || 0 === i.options.buttonColor.indexOf("rgb") ? o = 'style="color:' + i.options.buttonColor + '"' : "" !== i.options.buttonColor && (a = "mdui-text-color-" + i.options.buttonColor),
                        i.$snackbar = e('<div class="mdui-snackbar"><div class="mdui-snackbar-text">' + i.message + "</div>" + (i.options.buttonText ? '<a href="javascript:void(0)" class="mdui-snackbar-action mdui-btn mdui-ripple mdui-ripple-white ' + a + '" ' + o + ">" + i.options.buttonText + "</a>" : "") + "</div>").appendTo(document.body),
                        i._setPosition("close"),
                        i.$snackbar.reflow().addClass("mdui-snackbar-" + i.options.position)
                }
            }

            var s, r = {
                timeout: 4e3,
                buttonText: "",
                buttonColor: "",
                position: "bottom",
                closeOnButtonClick: !0,
                closeOnOutsideClick: !0,
                onClick: function () {
                },
                onButtonClick: function () {
                },
                onOpen: function () {
                },
                onOpened: function () {
                },
                onClose: function () {
                },
                onClosed: function () {
                }
            }, c = function (t) {
                var n = e(t.target);
                n.hasClass("mdui-snackbar") || n.parents(".mdui-snackbar").length || s.close()
            };
            i.prototype._setPosition = function (t) {
                var e, n, i = this, o = i.$snackbar[0].clientHeight, a = i.options.position;
                e = "bottom" === a || "top" === a ? "-50%" : "0",
                    "open" === t ? n = "0" : ("bottom" === a && (n = o),
                    "top" === a && (n = -o),
                    "left-top" !== a && "right-top" !== a || (n = -o - 24),
                    "left-bottom" !== a && "right-bottom" !== a || (n = o + 24)),
                    i.$snackbar.transform("translate(" + e + "," + n + "px)")
            }
                ,
                i.prototype.open = function () {
                    var t = this;
                    t.message && "opening" !== t.state && "opened" !== t.state && (s ? o.queue("__md_snackbar", function () {
                        t.open()
                    }) : (s = t,
                        t.state = "opening",
                        t.options.onOpen(),
                        t._setPosition("open"),
                        t.$snackbar.transitionEnd(function () {
                            "opening" === t.state && (t.state = "opened",
                                t.options.onOpened(),
                            t.options.buttonText && t.$snackbar.find(".mdui-snackbar-action").on("click", function () {
                                t.options.onButtonClick(),
                                t.options.closeOnButtonClick && t.close()
                            }),
                                t.$snackbar.on("click", function (n) {
                                    e(n.target).hasClass("mdui-snackbar-action") || t.options.onClick()
                                }),
                            t.options.closeOnOutsideClick && n.on(a.start, c),
                            t.options.timeout && (t.timeoutId = setTimeout(function () {
                                t.close()
                            }, t.options.timeout)))
                        })))
                }
                ,
                i.prototype.close = function () {
                    var t = this;
                    t.message && "closing" !== t.state && "closed" !== t.state && (t.timeoutId && clearTimeout(t.timeoutId),
                    t.options.closeOnOutsideClick && n.off(a.start, c),
                        t.state = "closing",
                        t.options.onClose(),
                        t._setPosition("close"),
                        t.$snackbar.transitionEnd(function () {
                            "closing" === t.state && (s = null,
                                t.state = "closed",
                                t.options.onClosed(),
                                t.$snackbar.remove(),
                                o.dequeue("__md_snackbar"))
                        }))
                }
                ,
                t.snackbar = function (t, e) {
                    "string" != typeof t && (t = (e = t).message);
                    var n = new i(t, e);
                    return n.open(),
                        n
                }
        }(),
        n.on("click", ".mdui-bottom-nav>a", function () {
            var t, n = e(this), i = n.parent();
            i.children("a").each(function (o, a) {
                (t = n.is(a)) && r("change", "bottomNav", null, i, {
                    index: o
                }),
                    e(a)[t ? "addClass" : "removeClass"]("mdui-bottom-nav-active")
            })
        }),
        t.mutation(".mdui-bottom-nav-scroll-hide", function () {
            var n = e(this)
                , i = new t.Headroom(n, {
                pinnedClass: "mdui-headroom-pinned-down",
                unpinnedClass: "mdui-headroom-unpinned-down"
            });
            n.data("mdui.headroom", i)
        }),
        function () {
            var n = function () {
                var t = !!arguments.length && arguments[0];
                return '<div class="mdui-spinner-layer ' + (t ? "mdui-spinner-layer-" + t : "") + '"><div class="mdui-spinner-circle-clipper mdui-spinner-left"><div class="mdui-spinner-circle"></div></div><div class="mdui-spinner-gap-patch"><div class="mdui-spinner-circle"></div></div><div class="mdui-spinner-circle-clipper mdui-spinner-right"><div class="mdui-spinner-circle"></div></div></div>'
            }
                , i = function (t) {
                var i, o = e(t);
                i = o.hasClass("mdui-spinner-colorful") ? n("1") + n("2") + n("3") + n("4") : n(),
                    o.html(i)
            };
            t.mutation(".mdui-spinner", function () {
                i(this)
            }),
                t.updateSpinners = function () {
                    e(arguments.length ? arguments[0] : ".mdui-spinner").each(function () {
                        i(this)
                    })
                }
        }(),
        t.Panel = function () {
            return function (t, e) {
                return new c(t, e, "panel")
            }
        }(),
        e(function () {
            t.mutation("[mdui-panel]", function () {
                var n = e(this)
                    , i = n.data("mdui.panel");
                if (!i) {
                    var o = s(n.attr("mdui-panel"));
                    i = new t.Panel(n, o),
                        n.data("mdui.panel", i)
                }
            })
        }),
        t.Menu = function () {
            function t(t, s, r) {
                var c = this;
                if (c.$anchor = e(t).eq(0),
                        c.$anchor.length) {
                    var d = c.$anchor.data("mdui.menu");
                    if (d)
                        return d;
                    c.$menu = e(s).eq(0),
                    c.$anchor.siblings(c.$menu).length && (c.options = e.extend({}, o, r || {}),
                        c.state = "closed",
                        c.isCascade = c.$menu.hasClass("mdui-menu-cascade"),
                        "auto" === c.options.covered ? c.isCovered = !c.isCascade : c.isCovered = c.options.covered,
                        c.$anchor.on("click", function () {
                            c.toggle()
                        }),
                        n.on("click touchstart", function (t) {
                            var n = e(t.target);
                            "opening" !== c.state && "opened" !== c.state || n.is(c.$menu) || e.contains(c.$menu[0], n[0]) || n.is(c.$anchor) || e.contains(c.$anchor[0], n[0]) || c.close()
                        }),
                        n.on("click", ".mdui-menu-item", function (t) {
                            var n = e(this);
                            n.find(".mdui-menu").length || null !== n.attr("disabled") || c.close()
                        }),
                        l(c),
                        i.on("resize", e.throttle(function () {
                            a(c)
                        }, 100)))
                }
            }

            var o = {
                position: "auto",
                align: "auto",
                gutter: 16,
                fixed: !1,
                covered: "auto",
                subMenuTrigger: "hover",
                subMenuDelay: 200
            }
                , a = function (t) {
                var e, n, o, a, s, r, c = i.height(), d = i.width(), u = t.options.gutter, l = t.isCovered, f = t.options.fixed, p = t.$menu.width(), h = t.$menu.height(), m = t.$anchor, v = m[0].getBoundingClientRect(), g = v.top, b = v.left, x = v.height, y = v.width, $ = c - g - x, w = d - b - y, C = m[0].offsetTop, k = m[0].offsetLeft;
                if (o = "auto" === t.options.position ? $ + (l ? x : 0) > h + u ? "bottom" : g + (l ? x : 0) > h + u ? "top" : "center" : t.options.position,
                        a = "auto" === t.options.align ? w + y > p + u ? "left" : b + y > p + u ? "right" : "center" : t.options.align,
                    "bottom" === o)
                    r = "0",
                        n = (l ? 0 : x) + (f ? g : C);
                else if ("top" === o)
                    r = "100%",
                        n = (l ? x : 0) + (f ? g - h : C - h);
                else {
                    r = "50%";
                    var O = h;
                    t.isCascade || h + 2 * u > c && (O = c - 2 * u,
                        t.$menu.height(O)),
                        n = (c - O) / 2 + (f ? 0 : C - g)
                }
                if (t.$menu.css("top", n + "px"),
                    "left" === a)
                    s = "0",
                        e = f ? b : k;
                else if ("right" === a)
                    s = "100%",
                        e = f ? b + y - p : k + y - p;
                else {
                    s = "50%";
                    var T = p;
                    p + 2 * u > d && (T = d - 2 * u,
                        t.$menu.width(T)),
                        e = (d - T) / 2 + (f ? 0 : k - b)
                }
                t.$menu.css("left", e + "px"),
                    t.$menu.transformOrigin(s + " " + r)
            }
                , s = function (t) {
                var e, n, o, a, s, r, c = t.parent(".mdui-menu-item"), d = i.height(), u = i.width(), l = t.width(), f = t.height(), p = c[0].getBoundingClientRect(), h = p.width, m = p.height, v = p.left, g = p.top;
                o = d - g > f ? "bottom" : g + m > f ? "top" : "bottom",
                    a = u - v - h > l ? "left" : v > l ? "right" : "left",
                    "bottom" === o ? (r = "0",
                        e = "0") : "top" === o && (r = "100%",
                        e = -f + m),
                    t.css("top", e + "px"),
                    "left" === a ? (s = "0",
                        n = h) : "right" === a && (s = "100%",
                        n = -l),
                    t.css("left", n + "px"),
                    t.transformOrigin(s + " " + r)
            }
                , c = function (t) {
                s(t),
                    t.addClass("mdui-menu-open").parent(".mdui-menu-item").addClass("mdui-menu-item-active")
            }
                , d = function (t) {
                t.removeClass("mdui-menu-open").addClass("mdui-menu-closing").transitionEnd(function () {
                    t.removeClass("mdui-menu-closing")
                }).parent(".mdui-menu-item").removeClass("mdui-menu-item-active"),
                    t.find(".mdui-menu").each(function () {
                        var t = e(this);
                        t.removeClass("mdui-menu-open").addClass("mdui-menu-closing").transitionEnd(function () {
                            t.removeClass("mdui-menu-closing")
                        }).parent(".mdui-menu-item").removeClass("mdui-menu-item-active")
                    })
            }
                , u = function (t) {
                t.hasClass("mdui-menu-open") ? d(t) : c(t)
            }
                , l = function (t) {
                if (t.$menu.on("click", ".mdui-menu-item", function (t) {
                        var n = e(this)
                            , i = e(t.target);
                        if (null === n.attr("disabled") && !i.is(".mdui-menu") && !i.is(".mdui-divider") && i.parents(".mdui-menu-item").eq(0).is(n)) {
                            var o = n.children(".mdui-menu");
                            n.parent(".mdui-menu").children(".mdui-menu-item").each(function () {
                                var t = e(this).children(".mdui-menu");
                                !t.length || o.length && t.is(o) || d(t)
                            }),
                            o.length && u(o)
                        }
                    }),
                    "hover" === t.options.subMenuTrigger) {
                    var n, i, o;
                    t.$menu.on("mouseover mouseout", ".mdui-menu-item", function (a) {
                        var s = e(this)
                            , r = a.type
                            , u = e(a.relatedTarget);
                        if (null === s.attr("disabled")) {
                            if ("mouseover" === r) {
                                if (!s.is(u) && e.contains(s[0], u[0]))
                                    return
                            } else if ("mouseout" === r && (s.is(u) || e.contains(s[0], u[0])))
                                return;
                            var l = s.children(".mdui-menu");
                            if ("mouseover" === r) {
                                if (l.length) {
                                    var f = l.data("timeoutClose.mdui.menu");
                                    if (f && clearTimeout(f),
                                            l.hasClass("mdui-menu-open"))
                                        return;
                                    clearTimeout(i),
                                        n = i = setTimeout(function () {
                                            c(l)
                                        }, t.options.subMenuDelay),
                                        l.data("timeoutOpen.mdui.menu", n)
                                }
                            } else if ("mouseout" === r && l.length) {
                                var p = l.data("timeoutOpen.mdui.menu");
                                p && clearTimeout(p),
                                    n = o = setTimeout(function () {
                                        d(l)
                                    }, t.options.subMenuDelay),
                                    l.data("timeoutClose.mdui.menu", n)
                            }
                        }
                    })
                }
            };
            t.prototype.toggle = function () {
                var t = this;
                "opening" === t.state || "opened" === t.state ? t.close() : "closing" !== t.state && "closed" !== t.state || t.open()
            }
            ;
            var f = function (t) {
                t.$menu.removeClass("mdui-menu-closing"),
                "opening" === t.state && (t.state = "opened",
                    r("opened", "menu", t, t.$menu)),
                "closing" === t.state && (t.state = "closed",
                    r("closed", "menu", t, t.$menu),
                    t.$menu.css({
                        top: "",
                        left: "",
                        width: "",
                        position: "fixed"
                    }))
            };
            return t.prototype.open = function () {
                var t = this;
                "opening" !== t.state && "opened" !== t.state && (t.state = "opening",
                    r("open", "menu", t, t.$menu),
                    a(t),
                    t.$menu.css("position", t.options.fixed ? "fixed" : "absolute").addClass("mdui-menu-open").transitionEnd(function () {
                        f(t)
                    }))
            }
                ,
                t.prototype.close = function () {
                    var t = this;
                    "closing" !== t.state && "closed" !== t.state && (t.state = "closing",
                        r("close", "menu", t, t.$menu),
                        t.$menu.find(".mdui-menu").each(function () {
                            d(e(this))
                        }),
                        t.$menu.removeClass("mdui-menu-open").addClass("mdui-menu-closing").transitionEnd(function () {
                            f(t)
                        }))
                }
                ,
                t
        }(),
        e(function () {
            n.on("click", "[mdui-menu]", function () {
                var n = e(this)
                    , i = n.data("mdui.menu");
                if (!i) {
                    var o = s(n.attr("mdui-menu"))
                        , a = o.target;
                    delete o.target,
                        i = new t.Menu(n, a, o),
                        n.data("mdui.menu", i),
                        i.toggle()
                }
            })
        }),
        t.JQ = e,
        t
});