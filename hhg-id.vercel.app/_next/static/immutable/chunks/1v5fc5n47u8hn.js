(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 96988, e => {
    e.v(t => Promise.all(["static/immutable/chunks/01p67rmdfr14z.js", "static/immutable/chunks/033evfd1n6ojk.js", "static/immutable/chunks/1f5pp1ymrv066.js", "static/immutable/chunks/3-_y9e-rnx60u.css"].map(t => e.l(t))).then(() => t(55139)))
}, 42831, e => {
    "use strict";
    var t = e.i(43476),
        r = e.i(71829);
    e.s(["default", 0, function() {
        return (0, t.jsxs)("footer", {
            className: "w-full mt-auto pt-4 pb-2 border-t-2 border-white/30 text-center font-body",
            children: [(0, t.jsxs)("div", {
                className: "flex flex-wrap justify-center gap-4 mb-2 text-l",
                children: [(0, t.jsx)("a", {
                    href: r.SITE_LINKS.officialWebsite,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:underline text-[#FEE101]",
                    children: "Official Website ↗"
                }), (0, t.jsx)("a", {
                    href: r.SITE_LINKS.eventDetails,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:underline text-[#FEE101]",
                    children: "Event Details ↗"
                }), (0, t.jsx)("a", {
                    href: r.SITE_LINKS.registration,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:underline text-[#FEE101]",
                    children: "Devfolio Apply ↗"
                })]
            }), (0, t.jsxs)("p", {
                className: "text-l font-bold text-white/90 pt-2 pb-1",
                children: ["Built By", " ", (0, t.jsx)("a", {
                    href: "https://x.com/BH4VE5H/",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-[#FEE101] hover:underline",
                    children: "BH4VE5H"
                }), " ", "for", " ", (0, t.jsx)("span", {
                    className: "text-[#FEE101]",
                    children: "Hacker House Goa 2026"
                }), " · 28 – 31 OCT 2026 · Goa, India"]
            })]
        })
    }])
}, 71829, e => {
    "use strict";
    e.s(["HASHTAG", 0, "#FrameInGoa", "SITE_LINKS", 0, {
        officialWebsite: "https://hhgoa.com/",
        eventDetails: "https://hhgoa.com/#check-hype",
        registration: "https://hacker-house-goa-2026.devfolio.co/",
        xProfile: "https://x.com/247pmstudio",
        radarUrl: "https://hhgoa.com/radar"
    }])
}, 76452, 9892, e => {
    "use strict";
    var t = e.i(71829);
    async function r(e, t = "HH-Goa-2026-Pass.png") {
        if (!e) return;
        let a = "u" > typeof navigator && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
        if (e.startsWith("data:")) try {
            let r = await fetch(e),
                o = await r.blob();
            n(o, t, a, e);
            return
        } catch (t) {
            console.error("Data URI download failed, opening in new tab:", t), o(e);
            return
        }
        try {
            let r = await fetch(e, {
                mode: "cors",
                cache: "no-cache"
            });
            if (!r.ok) throw Error(`HTTP error ${r.status}`);
            let o = await r.blob();
            n(o, t, a, e)
        } catch (t) {
            console.warn("Direct blob download failed, opening image in new tab instead:", t), o(e)
        }
    }

    function n(e, t, r, n) {
        let o = URL.createObjectURL(e),
            a = document.createElement("a");
        a.href = o, a.download = t, r && (a.target = "_blank", a.rel = "noopener noreferrer"), document.body.appendChild(a), a.click(), document.body.removeChild(a), setTimeout(() => {
            URL.revokeObjectURL(o)
        }, 15e3)
    }

    function o(e) {
        window.open(e, "_blank", "noopener,noreferrer") || (window.location.href = e)
    }
    e.s(["getXShareUrl", 0, function(e, r, n) {
        let o = (r || "https://hhg-id.vercel.app/").replace(/\/$/, ""),
            a = `${o}/card/${e}`,
            i = new URLSearchParams({
                text: n ? `Just claimed my official HH Goa 2026 Builder Pass! 🌴

Building, shipping & creating at HH Goa 2026.

${t.HASHTAG}` : `Just claimed my official HH Goa 2026 Builder Pass 🌴

Building, shipping & creating at HH Goa 2026.

${t.HASHTAG}`,
                url: a
            });
        return `https://twitter.com/intent/tweet?${i.toString()}`
    }, "handleXShare", 0, function(e, r, n) {
        n && n.preventDefault();
        let o = "u" > typeof navigator && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent),
            a = e.includes("x.com/intent/post") ? e.replace("x.com/intent/post", "twitter.com/intent/tweet") : e;
        if (o) {
            let e = "",
                n = "";
            try {
                let t = new URL(a);
                e = t.searchParams.get("text") || "", n = t.searchParams.get("url") || ""
            } catch {
                e = r ? `Just claimed my official HH Goa 2026 Builder Pass! 🌴

Building, shipping & creating at HH Goa 2026.

${t.HASHTAG}` : `Just claimed my official HH Goa 2026 Builder Pass 🌴

Building, shipping & creating at HH Goa 2026.

${t.HASHTAG}`
            }
            let o = e && n ? `${e}

${n}` : e || n,
                i = `twitter://post?message=${encodeURIComponent(o)}`,
                l = Date.now();
            window.location.href = i, setTimeout(() => {
                Date.now() - l < 1200 && window.open(a, "_blank", "noopener,noreferrer")
            }, 600)
        } else window.open(a, "_blank", "noopener,noreferrer")
    }], 76452), e.s(["downloadOrOpenImage", 0, r], 9892)
}, 208, e => {
    e.v(t => Promise.all(["static/immutable/chunks/14-c85ae9yz73.js"].map(t => e.l(t))).then(() => t(56414)))
}, 90317, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    var n = {
        bindSnapshot: function() {
            return c
        },
        createAsyncLocalStorage: function() {
            return s
        },
        createSnapshot: function() {
            return u
        }
    };
    for (var o in n) Object.defineProperty(r, o, {
        enumerable: !0,
        get: n[o]
    });
    let a = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", {
        value: "E504",
        enumerable: !1,
        configurable: !0
    });
    class i {
        disable() {
            throw a
        }
        getStore() {}
        run() {
            throw a
        }
        exit() {
            throw a
        }
        enterWith() {
            throw a
        }
        static bind(e) {
            return e
        }
    }
    let l = "u" > typeof globalThis && globalThis.AsyncLocalStorage;

    function s() {
        return l ? new l : new i
    }

    function c(e) {
        return l ? l.bind(e) : i.bind(e)
    }

    function u() {
        return l ? l.snapshot() : function(e, ...t) {
            return e(...t)
        }
    }
}, 42344, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "workAsyncStorageInstance", {
        enumerable: !0,
        get: function() {
            return n
        }
    });
    let n = (0, e.r(90317).createAsyncLocalStorage)()
}, 63599, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "workAsyncStorage", {
        enumerable: !0,
        get: function() {
            return n.workAsyncStorageInstance
        }
    });
    let n = e.r(42344)
}, 9885, (e, t, r) => {
    "use strict";

    function n(e) {
        return e.split("/").map(e => encodeURIComponent(e)).join("/")
    }
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "encodeURIPath", {
        enumerable: !0,
        get: function() {
            return n
        }
    })
}, 67585, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "BailoutToCSR", {
        enumerable: !0,
        get: function() {
            return o
        }
    });
    let n = e.r(32061);

    function o({
        reason: e,
        children: t
    }) {
        if ("u" < typeof window) throw Object.defineProperty(new n.BailoutToCSRError(e), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: !1,
            configurable: !0
        });
        return t
    }
}, 52157, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "PreloadChunks", {
        enumerable: !0,
        get: function() {
            return s
        }
    });
    let n = e.r(43476),
        o = e.r(74080),
        a = e.r(63599),
        i = e.r(9885),
        l = e.r(43369);

    function s({
        moduleIds: e
    }) {
        if ("u" > typeof window) return null;
        let t = a.workAsyncStorage.getStore();
        if (void 0 === t) return null;
        let r = [];
        if (t.reactLoadableManifest && e) {
            let n = t.reactLoadableManifest;
            for (let t of e) {
                if (!n[t]) continue;
                let e = n[t].files;
                r.push(...e)
            }
        }
        if (0 === r.length) return null;
        let c = (0, l.getAssetTokenQuery)();
        return (0, n.jsx)(n.Fragment, {
            children: r.map(e => {
                let r = `${t.assetPrefix}/_next/${(0,i.encodeURIPath)(e)}${c}`;
                return e.endsWith(".css") ? (0, n.jsx)("link", {
                    precedence: "dynamic",
                    href: r,
                    rel: "stylesheet",
                    as: "style",
                    nonce: t.nonce
                }, e) : ((0, o.preload)(r, {
                    as: "script",
                    fetchPriority: "low",
                    nonce: t.nonce
                }), null)
            })
        })
    }
}, 69093, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function() {
            return c
        }
    });
    let n = e.r(43476),
        o = e.r(71645),
        a = e.r(67585),
        i = e.r(52157);

    function l(e) {
        return {
            default: e && "default" in e ? e.default : e
        }
    }
    let s = {
            loader: () => Promise.resolve(l(() => null)),
            loading: null,
            ssr: !0
        },
        c = function(e) {
            let t = { ...s,
                    ...e
                },
                r = (0, o.lazy)(() => t.loader().then(l)),
                c = t.loading;

            function u(e) {
                let l = c ? (0, n.jsx)(c, {
                        isLoading: !0,
                        pastDelay: !0,
                        error: null
                    }) : null,
                    s = !t.ssr || !!t.loading,
                    u = s ? o.Suspense : o.Fragment,
                    d = t.ssr ? (0, n.jsxs)(n.Fragment, {
                        children: ["u" < typeof window ? (0, n.jsx)(i.PreloadChunks, {
                            moduleIds: t.modules
                        }) : null, (0, n.jsx)(r, { ...e
                        })]
                    }) : (0, n.jsx)(a.BailoutToCSR, {
                        reason: "next/dynamic",
                        children: (0, n.jsx)(r, { ...e
                        })
                    });
                return (0, n.jsx)(u, { ...s ? {
                        fallback: l
                    } : {},
                    children: d
                })
            }
            return u.displayName = "LoadableComponent", u
        }
}, 70703, (e, t, r) => {
    "use strict";
    Object.defineProperty(r, "__esModule", {
        value: !0
    }), Object.defineProperty(r, "default", {
        enumerable: !0,
        get: function() {
            return o
        }
    });
    let n = e.r(55682)._(e.r(69093));

    function o(e, t) {
        let r = {};
        "function" == typeof e && (r.loader = e);
        let o = { ...r,
            ...t
        };
        return (0, n.default)({ ...o,
            modules: o.loadableGenerated ? .modules
        })
    }("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
        value: !0
    }), Object.assign(r.default, r), t.exports = r.default)
}]);