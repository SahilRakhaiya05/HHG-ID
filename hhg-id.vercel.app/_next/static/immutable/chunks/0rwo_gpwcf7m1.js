(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 29531, e => {
            "use strict";
            var t = e.i(43476),
                r = e.i(71645);

            function n() {
                return (0, t.jsxs)("header", {
                    className: "w-full flex flex-col items-center mb-4 font-body",
                    children: [(0, t.jsxs)("div", {
                        className: "hidden md:flex w-full items-center justify-between gap-4 py-2",
                        children: [(0, t.jsxs)("div", {
                            className: "flex items-center gap-6",
                            children: [(0, t.jsxs)("div", {
                                className: "h-12 flex items-center gap-4",
                                children: [(0, t.jsx)("img", {
                                    src: "/assets/logo.png",
                                    alt: "Hacker House Goa Logo",
                                    className: "max-h-full w-auto object-contain"
                                }), (0, t.jsx)("img", {
                                    src: "/assets/goa.svg",
                                    alt: "Goa Logo",
                                    className: "h-15 w-auto object-contain"
                                })]
                            }), (0, t.jsx)("div", {
                                className: "h-10 flex items-center border-l border-white/20 pl-6",
                                children: (0, t.jsx)("img", {
                                    src: "/assets/2-47.svg",
                                    alt: "2:47 PM Studio Logo",
                                    className: "max-h-full w-auto object-contain"
                                })
                            })]
                        }), (0, t.jsxs)("div", {
                            className: "flex flex-col items-end text-right font-body text-xs sm:text-sm font-black tracking-wider text-white gap-0.5",
                            children: [(0, t.jsx)("span", {
                                className: "text-[#FEE101] uppercase",
                                children: "OCT 28–31 · 2026 · GOA"
                            }), (0, t.jsx)("span", {
                                className: "uppercase",
                                children: "LESS NOISE. MORE SIGNAL"
                            })]
                        })]
                    }), (0, t.jsxs)("div", {
                        className: "flex md:hidden w-full items-center justify-between",
                        children: [(0, t.jsx)("div", {
                            className: "h-18 flex items-center",
                            children: (0, t.jsx)("img", {
                                src: "/assets/logo.svg",
                                alt: "Hacker House Goa Logo",
                                className: "max-h-full w-auto object-contain"
                            })
                        }), (0, t.jsxs)("div", {
                            className: "flex flex-col items-end text-right font-body text-[10px] sm:text-xs font-black tracking-wider text-white gap-1.5",
                            children: [(0, t.jsx)("img", {
                                src: "/assets/2-47.svg",
                                alt: "Hacker House Goa Logo",
                                className: "max-h-full w-15 p-1 object-contain"
                            }), (0, t.jsx)("span", {
                                className: "text-[#FEE101] uppercase",
                                children: "OCT 28–31 · 2026 · GOA"
                            }), (0, t.jsx)("span", {
                                className: "uppercase",
                                children: "LESS NOISE. MORE SIGNAL"
                            })]
                        })]
                    }), (0, t.jsx)("hr", {
                        className: "w-full border-t-2 border-white/30 mt-2"
                    })]
                })
            }

            function a() {
                return (0, t.jsxs)("div", {
                    className: "flex flex-col gap-1 font-body",
                    children: [(0, t.jsx)("h2", {
                        className: "font-['Imbue']  font-heading text-3xl sm:text-5xl uppercase tracking-lose text-white",
                        children: "Hacker House Goa ID Card Generator"
                    }), (0, t.jsx)("p", {
                        className: "font-body text-xs sm:text-[15px] text-[#FEE101] max-w-4xl mt-1",
                        children: "Design your own HH Goa 2026 themed photo frame generator. Upload your photo in the control panel below, choose your frame style, and generate your shareable credential."
                    })]
                })
            }

            function o(...e) {
                let t = [];
                for (let r of e)
                    if (r) {
                        if ("string" == typeof r) t.push(r);
                        else if ("object" == typeof r)
                            for (let [e, n] of Object.entries(r)) n && t.push(e)
                    }
                return t.filter(Boolean).join(" ")
            }

            function i({
                children: e,
                variant: r = "yellow",
                className: n,
                asAnchor: a = !1,
                href: l,
                download: s,
                target: c,
                rel: u,
                disabled: d,
                onClick: f,
                type: h = "button",
                ...g
            }) {
                let p = "pink" === r ? "custom-btn-pink" : "black" === r ? "custom-btn-black" : "outline-pink" === r ? "custom-btn-outline-pink" : "custom-btn-yellow";
                return a && l ? (0, t.jsx)("a", {
                    href: l,
                    download: s,
                    target: c,
                    rel: u,
                    onClick: f,
                    className: o("custom-btn no-underline flex items-center justify-center text-center w-full cursor-pointer select-none", p, n),
                    children: e
                }) : (0, t.jsx)("button", {
                    type: h,
                    disabled: d,
                    onClick: f,
                    className: o("custom-btn", p, "w-full", d && "opacity-60 cursor-not-allowed pointer-events-none", n),
                    ...g,
                    children: e
                })
            }
            async function l(t) {
                let r = t.name.toLowerCase(),
                    n = t.type.toLowerCase();
                if (!(r.endsWith(".heic") || r.endsWith(".heif") || n.includes("heic") || n.includes("heif"))) return t;
                try {
                    let r = (await e.A(208)).default,
                        n = await r({
                            blob: t,
                            toType: "image/jpeg",
                            quality: .9
                        }),
                        a = Array.isArray(n) ? n[0] : n,
                        o = t.name.replace(/\.(heic|heif)$/i, ".jpg");
                    return new File([a], o, {
                        type: "image/jpeg"
                    })
                } catch (e) {
                    return console.error("Error converting HEIC image:", e), t
                }
            }
            async function s(e) {
                return e && e.type.startsWith("image/") ? new Promise(t => {
                    let r = new Image,
                        n = URL.createObjectURL(e);
                    r.onload = () => {
                        URL.revokeObjectURL(n);
                        let a = r.width,
                            o = r.height;
                        if (a <= 500 && o <= 500 && e.size < 409600) return void t(e);
                        (a > 500 || o > 500) && (a > o ? (o = Math.round(500 * o / a), a = 500) : (a = Math.round(500 * a / o), o = 500));
                        let i = document.createElement("canvas");
                        i.width = a, i.height = o;
                        let l = i.getContext("2d");
                        l ? (l.drawImage(r, 0, 0, a, o), i.toBlob(r => {
                            r ? t(new File([r], e.name.replace(/\.[^/.]+$/, "") + "-compressed.png", {
                                type: "image/png",
                                lastModified: Date.now()
                            })) : t(e)
                        }, "image/png", .9)) : t(e)
                    }, r.onerror = r => {
                        console.error("Failed to load image for background compression:", r), URL.revokeObjectURL(n), t(e)
                    }, r.src = n
                }) : e
            }

            function c({
                onPhotoSelected: e,
                selectedPreviewUrl: n,
                onClearPhoto: a,
                selectedFrame: o = "frame1.png",
                photoFilter: i = "none",
                zoom: u = 1,
                setZoom: d,
                offsetX: f = 0,
                setOffsetX: h,
                offsetY: g = 0,
                setOffsetY: p
            }) {
                let [m, x] = (0, r.useState)(!1), [b, y] = (0, r.useState)(!1), [w, v] = (0, r.useState)(!1), N = (0, r.useRef)(null), E = (0, r.useRef)(null), M = async t => {
                    if (!t || 0 === t.length) return;
                    let r = t[0],
                        n = r.name.toLowerCase();
                    if (!(r.type.startsWith("image/") || n.endsWith(".heic") || n.endsWith(".heif"))) return void console.error("Invalid image file provided:", r.name);
                    try {
                        x(!0);
                        let t = await l(r),
                            n = await s(t),
                            a = URL.createObjectURL(n);
                        e(n, a)
                    } catch (e) {
                        console.error("Image processing error:", e)
                    } finally {
                        x(!1)
                    }
                }, j = e => {
                    e.preventDefault(), e.stopPropagation(), "dragenter" === e.type || "dragover" === e.type ? y(!0) : "dragleave" === e.type && y(!1)
                }, C = () => {
                    v(!1), N.current = null
                }, S = o && "none" !== o ? `/assets/${o}` : null;
                return (0, t.jsxs)("div", {
                    className: "w-full font-body flex flex-col gap-3",
                    children: [(0, t.jsx)("input", {
                        ref: E,
                        type: "file",
                        accept: "image/png, image/jpeg, image/jpg, image/heic, image/heif",
                        className: "hidden",
                        onChange: e => M(e.target.files)
                    }), (0, t.jsxs)("div", {
                        className: "flex items-center gap-3 sm:gap-4 w-full",
                        children: [(0, t.jsx)("div", {
                            onWheel: e => {
                                n && d && (e.preventDefault(), d(Math.max(1, Math.min(3, Number((u + (e.deltaY > 0 ? -.1 : .1)).toFixed(2))))))
                            },
                            onMouseDown: e => {
                                n && (v(!0), N.current = {
                                    x: e.clientX,
                                    y: e.clientY,
                                    initX: f,
                                    initY: g
                                })
                            },
                            onMouseMove: e => {
                                if (!w || !N.current || !h || !p) return;
                                let t = e.clientX - N.current.x,
                                    r = e.clientY - N.current.y;
                                h(N.current.initX + 1.5 * t), p(N.current.initY + 1.5 * r)
                            },
                            onMouseUp: C,
                            onMouseLeave: C,
                            onTouchStart: e => {
                                if (!n || 1 !== e.touches.length) return;
                                v(!0);
                                let t = e.touches[0];
                                N.current = {
                                    x: t.clientX,
                                    y: t.clientY,
                                    initX: f,
                                    initY: g
                                }
                            },
                            onTouchMove: e => {
                                if (!w || !N.current || !h || !p || 1 !== e.touches.length) return;
                                let t = e.touches[0],
                                    r = t.clientX - N.current.x,
                                    n = t.clientY - N.current.y;
                                h(N.current.initX + 1.5 * r), p(N.current.initY + 1.5 * n)
                            },
                            onTouchEnd: C,
                            className: `w-[130px] sm:w-[150px] aspect-square bg-white border border-zinc-300 rounded-xl relative overflow-hidden flex items-center justify-center shadow-sm select-none shrink-0 ${n?w?"cursor-grabbing":"cursor-grab":""}`,
                            children: n ? (0, t.jsxs)("div", {
                                className: "relative w-full h-full overflow-hidden flex items-center justify-center",
                                children: [(0, t.jsx)("div", {
                                    className: "w-full h-full flex items-center justify-center transition-transform duration-75",
                                    style: {
                                        transform: `scale(${u}) translate(${(u>1?f:0)/u}px, ${(u>1?g:0)/u}px)`
                                    },
                                    children: (0, t.jsx)("img", {
                                        src: n,
                                        alt: "User photo preview",
                                        className: "w-full h-full object-cover pointer-events-none"
                                    })
                                }), S && (0, t.jsx)("img", {
                                    src: S,
                                    alt: "Frame overlay",
                                    className: "absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                                })]
                            }) : (0, t.jsx)("div", {
                                onDragEnter: j,
                                onDragOver: j,
                                onDragLeave: j,
                                onDrop: e => {
                                    e.preventDefault(), e.stopPropagation(), y(!1), e.dataTransfer.files && e.dataTransfer.files[0] && M(e.dataTransfer.files)
                                },
                                onClick: () => E.current ? .click(),
                                className: `w-full h-full cursor-pointer text-center flex items-center justify-center ${b?"scale-[0.98] bg-[#FFF8D6]":""}`,
                                children: (0, t.jsxs)("div", {
                                    className: "relative w-full h-full grid grid-cols-[1fr_0.5rem_auto_0.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] [--pattern-fg:rgba(0,0,0,0.12)]",
                                    children: [(0, t.jsx)("div", {
                                        className: "col-start-3 row-start-3 flex max-w-lg flex-col relative items-center justify-center p-2",
                                        children: (0, t.jsx)("span", {
                                            className: "font-['Imbue'] font-heading font-black text-sm sm:text-base tracking-wider text-[#0B6839] uppercase leading-none mb-1",
                                            children: m ? "PROCESSING..." : "CLICK TO UPLOAD"
                                        })
                                    }), (0, t.jsx)("div", {
                                        className: "-right-px col-start-2 row-span-full row-start-1 border-x border-black/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"
                                    }), (0, t.jsx)("div", {
                                        className: "relative -left-px col-start-4 row-span-full row-start-1 border-x border-black/10 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"
                                    }), (0, t.jsx)("div", {
                                        className: "relative -bottom-px col-span-full col-start-1 row-start-2 border-t border-black/10 border-dashed"
                                    }), (0, t.jsx)("div", {
                                        className: "relative -top-px col-span-full col-start-1 row-start-4 border-b border-black/10 border-dashed"
                                    })]
                                })
                            })
                        }), n && (0, t.jsxs)("div", {
                            className: "flex flex-col gap-1.5 min-w-[70px]",
                            children: [(0, t.jsx)("button", {
                                type: "button",
                                onClick: () => E.current ? .click(),
                                className: "custom-btn custom-btn-outline-pink py-1 px-2.5 text-[10px] text-center",
                                children: "CHANGE"
                            }), (0, t.jsx)("button", {
                                type: "button",
                                onClick: a,
                                className: "custom-btn custom-btn-pink py-1 px-2.5 text-[10px] text-center",
                                children: "REMOVE"
                            })]
                        })]
                    })]
                })
            }

            function u({
                selectedFrame: e,
                setSelectedFrame: r
            }) {
                return (0, t.jsx)("div", {
                    children: (0, t.jsx)("div", {
                        className: "grid grid-cols-5 gap-1.5 sm:gap-2",
                        children: [{
                            id: "none",
                            label: "None"
                        }, {
                            id: "frame1.png",
                            label: "1"
                        }, {
                            id: "frame2.png",
                            label: "2"
                        }, {
                            id: "frame3.png",
                            label: "3"
                        }, {
                            id: "frame4.png",
                            label: "4"
                        }].map(n => {
                            let a = e === n.id;
                            return (0, t.jsx)("button", {
                                type: "button",
                                onClick: () => r(n.id),
                                className: `custom-btn py-1 px-1 text-[10px] font-black uppercase text-center font-body ${a?"custom-btn-pink scale-[1.02]":"custom-btn-outline-pink"}`,
                                children: n.label
                            }, n.id)
                        })
                    })
                })
            }
            let d = [{
                id: "none",
                label: "Normal"
            }, {
                id: "duotone",
                label: "Dual Tone"
            }, {
                id: "dither",
                label: "Dither"
            }, {
                id: "ascii",
                label: "ASCII"
            }, {
                id: "grayscale",
                label: "Grayscale"
            }, {
                id: "pixelate",
                label: "Pixelate"
            }];

            function f(e) {
                let t = parseInt(e.replace("#", ""), 16);
                return {
                    r: t >> 16 & 255,
                    g: t >> 8 & 255,
                    b: 255 & t
                }
            }

            function h({
                name: e,
                setName: r,
                stack: n,
                setStack: a,
                qrUrl: o,
                setQrUrl: l,
                passNo: s,
                onPhotoSelected: f,
                selectedPreviewUrl: g,
                onClearPhoto: p,
                selectedFrame: m,
                setSelectedFrame: x,
                photoFilter: b,
                setPhotoFilter: y,
                onGenerate: w,
                isGenerating: v,
                hasPhoto: N,
                zoom: E,
                setZoom: M,
                offsetX: j,
                setOffsetX: C,
                offsetY: S,
                setOffsetY: k
            }) {
                return (0, t.jsxs)("form", {
                    onSubmit: e => {
                        (e.preventDefault(), N) ? w(): console.error("Please upload a photo before generating your ID card.")
                    },
                    className: "w-full flex flex-col gap-3 font-body",
                    children: [(0, t.jsxs)("div", {
                        children: [(0, t.jsxs)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1",
                            children: ["1. YOUR NAME ", (0, t.jsx)("span", {
                                className: "text-[#0B6839]",
                                children: "*"
                            })]
                        }), (0, t.jsx)("input", {
                            type: "text",
                            value: e,
                            onChange: e => r(e.target.value),
                            placeholder: "e.g. Ravi Kishan",
                            maxLength: 30,
                            required: !0,
                            className: "neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
                        })]
                    }), (0, t.jsxs)("div", {
                        children: [(0, t.jsxs)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1",
                            children: ["2. ROLE / TITLE ", (0, t.jsx)("span", {
                                className: "text-[#0B6839]]",
                                children: "*"
                            })]
                        }), (0, t.jsx)("input", {
                            type: "text",
                            value: n,
                            onChange: e => a(e.target.value),
                            placeholder: "e.g. Creative Director",
                            maxLength: 40,
                            required: !0,
                            className: "neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
                        })]
                    }), (0, t.jsxs)("div", {
                        children: [(0, t.jsxs)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1",
                            children: ["3. SOCIALS LINK  ", (0, t.jsx)("span", {
                                className: "text-[#0B6839]",
                                children: "*"
                            })]
                        }), (0, t.jsx)("input", {
                            type: "url",
                            value: o,
                            onChange: e => l(e.target.value),
                            placeholder: "e.g. https://x.com/BH4VE5H",
                            required: !0,
                            className: "neo-input text-xs sm:text-sm py-1 px-2.5 h-9"
                        })]
                    }), (0, t.jsxs)("div", {
                        children: [(0, t.jsxs)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body",
                            children: ["4. PHOTO UPLOAD ", (0, t.jsx)("span", {
                                className: "text-[#0B6839]",
                                children: "*"
                            })]
                        }), (0, t.jsx)(c, {
                            onPhotoSelected: f,
                            selectedPreviewUrl: g,
                            onClearPhoto: p,
                            selectedFrame: m,
                            photoFilter: b,
                            zoom: E,
                            setZoom: M,
                            offsetX: j,
                            setOffsetX: C,
                            offsetY: S,
                            setOffsetY: k
                        })]
                    }), (0, t.jsxs)("div", {
                        children: [(0, t.jsx)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body truncate",
                            children: "5. SELECT FRAME"
                        }), (0, t.jsx)(u, {
                            selectedFrame: m,
                            setSelectedFrame: x
                        })]
                    }), (0, t.jsxs)("div", {
                        children: [(0, t.jsx)("label", {
                            className: "block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-body ",
                            children: "6. SELECT FILTERS"
                        }), (0, t.jsx)("div", {
                            className: "grid grid-cols-3 gap-1.5",
                            children: d.map(e => {
                                let r = b === e.id;
                                return (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => y(e.id),
                                    className: `custom-btn py-1 px-1 text-[10px] uppercase text-center truncate ${r?"custom-btn-pink":"custom-btn-outline-pink"}`,
                                    children: e.label
                                }, e.id)
                            })
                        })]
                    }), N && (0, t.jsxs)("div", {
                        className: "p-3 bg-white/80 border-2 border-[#FF0080] rounded-3xl flex flex-col gap-2 my-0.5 shadow-xs",
                        children: [(0, t.jsxs)("div", {
                            className: "flex items-center justify-between",
                            children: [(0, t.jsx)("span", {
                                className: "text-[11px] font-black uppercase tracking-wider text-[#0B6839] flex items-center gap-1",
                                children: "🔍 ZOOM & ADJUST PHOTO"
                            }), (0, t.jsx)("button", {
                                type: "button",
                                onClick: () => {
                                    M(1), C(0), k(0)
                                },
                                className: "text-[9px] font-bold text-[#FF0080] hover:underline cursor-pointer",
                                children: "RESET POSITION"
                            })]
                        }), (0, t.jsxs)("div", {
                            className: "flex items-center gap-2.5",
                            children: [(0, t.jsxs)("span", {
                                className: "text-[10px] font-bold text-zinc-800 min-w-8",
                                children: [E.toFixed(1), "x"]
                            }), (0, t.jsx)("input", {
                                type: "range",
                                min: "1.0",
                                max: "3.0",
                                step: "0.05",
                                value: E,
                                onChange: e => M(parseFloat(e.target.value)),
                                className: "w-full accent-[#FF0080] cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
                            })]
                        }), E > 1 && (0, t.jsxs)("div", {
                            className: "flex items-center justify-between text-[10px] font-bold text-zinc-800 pt-1.5 border-t border-zinc-200",
                            children: [(0, t.jsx)("span", {
                                children: "MOVE PHOTO:"
                            }), (0, t.jsxs)("div", {
                                className: "flex gap-1",
                                children: [(0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => C(j - 15),
                                    className: "bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs",
                                    children: "⬅️"
                                }), (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => C(j + 15),
                                    className: "bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs",
                                    children: "➡️"
                                }), (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => k(S - 15),
                                    className: "bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs",
                                    children: "⬆️"
                                }), (0, t.jsx)("button", {
                                    type: "button",
                                    onClick: () => k(S + 15),
                                    className: "bg-white border border-zinc-300 rounded-full px-2 py-0.5 hover:bg-[#FEE101] text-[10px] font-bold cursor-pointer shadow-xs",
                                    children: "⬇️"
                                })]
                            })]
                        })]
                    }), (0, t.jsx)("div", {
                        className: "mt-0.5 w-fit mx-auto",
                        children: (0, t.jsx)(i, {
                            type: "submit",
                            variant: "outline-pink",
                            disabled: v || !N,
                            children: v ? (0, t.jsx)("span", {
                                className: "flex items-center justify-center gap-2 text-xs ",
                                children: "GENERATING BUILDER PASS..."
                            }) : "GENERATE ID CARD"
                        })
                    })]
                })
            }

            function g({
                onPhotoSelected: e,
                selectedPreviewUrl: r,
                onClearPhoto: n,
                selectedFrame: a,
                setSelectedFrame: o,
                photoFilter: i,
                setPhotoFilter: l,
                name: s,
                setName: c,
                stack: u,
                setStack: d,
                qrUrl: f,
                setQrUrl: p,
                passNo: m,
                onGenerate: x,
                isGenerating: b,
                hasPhoto: y,
                zoom: w,
                setZoom: v,
                offsetX: N,
                setOffsetX: E,
                offsetY: M,
                setOffsetY: j
            }) {
                return (0, t.jsxs)("div", {
                    className: "p-3.5 sm:p-4 flex flex-col gap-3.5 font-body bg-[#FFFBE8] rounded-lg shadow-[5px_5px_0px_0px_#084e2a]",
                    children: [(0, t.jsx)("h3", {
                        className: "font-['Imbue'] font-heading font-black text-base sm:text-lg uppercase tracking-wider text-[#0B6839] border-b border-[#0B6839]/20 pb-2",
                        children: "ADD YOUR DETAILS & PHOTO"
                    }), (0, t.jsx)(h, {
                        name: s,
                        setName: c,
                        stack: u,
                        setStack: d,
                        qrUrl: f,
                        setQrUrl: p,
                        passNo: m,
                        onPhotoSelected: e,
                        selectedPreviewUrl: r,
                        onClearPhoto: n,
                        selectedFrame: a,
                        setSelectedFrame: o,
                        photoFilter: i,
                        setPhotoFilter: l,
                        onGenerate: x,
                        isGenerating: b,
                        hasPhoto: y,
                        zoom: w,
                        setZoom: v,
                        offsetX: N,
                        setOffsetX: E,
                        offsetY: M,
                        setOffsetY: j
                    })]
                })
            }
            var p = e.i(70703),
                m = e.i(73134),
                x = e.i(76452),
                b = e.i(9892);

            function y({
                viewMode: e,
                setViewMode: r,
                generatedResult: n,
                onReset: a
            }) {
                let o = !!n,
                    l = `HH-Goa-2026-${(n?.name||"Builder").replace(/\s+/g,"-")}.png`;
                return (0, t.jsxs)("div", {
                    className: "flex flex-col gap-3 font-body mt-2 w-full",
                    children: [(0, t.jsx)("div", {
                        className: "flex items-center justify-start",
                        children: (0, t.jsxs)("div", {
                            className: "p-1 flex items-center gap-1.5",
                            children: [(0, t.jsx)("button", {
                                type: "button",
                                onClick: () => r("3d"),
                                className: `custom-btn text-xs py-1.5 text-nowrap font-black uppercase rounded-full ${"3d"===e?"custom-btn-pink":"custom-btn-outline-pink"}`,
                                children: "3D CARD"
                            }), (0, t.jsx)("button", {
                                type: "button",
                                onClick: () => r("2d"),
                                className: `custom-btn text-xs py-1.5 text-nowrap font-black uppercase rounded-full ${"2d"===e?"custom-btn-pink":"custom-btn-outline-pink"}`,
                                children: "2D CARD"
                            })]
                        })
                    }), (0, t.jsx)("div", {
                        className: `p-2.5 text-center bold rounded-3xl uppercase font-heading tracking-wider ${o?"custom-btn-pink border-2 border-pink rounded-full bg-[#FF0080] text-white":"custom-btn-pink border-2 border-pink-400 rounded-full bg-white text-[#FF0080]"}`,
                        children: o ? "YOUR BUILDER PASS IS READY" : "GENERATE CARD TO UNLOCK DOWNLOAD & SHARING"
                    }), (0, t.jsxs)("div", {
                        className: "flex flex-col gap-2",
                        children: [(0, t.jsx)("div", {
                            className: "flex flex-row gap-2",
                            children: o ? (0, t.jsxs)(t.Fragment, {
                                children: [(0, t.jsx)(i, {
                                    type: "button",
                                    onClick: e => {
                                        e.preventDefault(), n ? .cardUrl && (0, b.downloadOrOpenImage)(n.cardUrl, l)
                                    },
                                    variant: "pink",
                                    className: "flex-1 text-xs",
                                    children: "DOWNLOAD PNG"
                                }), (0, t.jsx)(i, {
                                    type: "button",
                                    onClick: e => {
                                        e.preventDefault(), n ? .xShareUrl && (0, x.handleXShare)(n.xShareUrl, n.name, e)
                                    },
                                    variant: "outline-pink",
                                    className: "flex-1 text-xs",
                                    children: "SHARE ON X"
                                })]
                            }) : (0, t.jsxs)(t.Fragment, {
                                children: [(0, t.jsx)("div", {
                                    className: "flex-1 py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60",
                                    children: "DOWNLOAD PNG"
                                }), (0, t.jsx)("div", {
                                    className: "flex-1 py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60",
                                    children: "SHARE ON X"
                                })]
                            })
                        }), (0, t.jsx)("div", {
                            className: "flex flex-row gap-2",
                            children: o ? (0, t.jsxs)(t.Fragment, {
                                children: [(0, t.jsx)(i, {
                                    type: "button",
                                    onClick: () => {
                                        n ? .shareUrl && navigator.clipboard && (navigator.clipboard.writeText(n.shareUrl), alert("Share URL copied to clipboard!"))
                                    },
                                    variant: "black",
                                    className: "flex-1 text-xs",
                                    children: "COPY LINK"
                                }), (0, t.jsx)(i, {
                                    type: "button",
                                    onClick: a,
                                    variant: "yellow",
                                    className: "flex-1 text-xs",
                                    children: "RESET"
                                })]
                            }) : (0, t.jsx)("div", {
                                className: "w-full py-2 px-3 bg-zinc-100 border border-zinc-300 rounded-lg text-zinc-400 font-black text-xs uppercase text-center cursor-not-allowed select-none opacity-60",
                                children: "COPY LINK"
                            })
                        })]
                    })]
                })
            }
            let w = (0, p.default)(() => e.A(96988), {
                    loadableGenerated: {
                        modules: [55139]
                    },
                    ssr: !1,
                    loading: () => (0, t.jsx)("div", {
                        className: "w-full h-full min-h-[540px] bg-zinc-950 flex items-center justify-center",
                        children: (0, t.jsx)("div", {
                            className: "w-8 h-8 border-4 border-zinc-800 border-t-[#FEE101] rounded-full animate-spin"
                        })
                    })
                }),
                v = "#1b6838",
                N = "#FEE101",
                E = "Imbue, Georgia, serif",
                M = "'Victor Mono', monospace";

            function j(e) {
                let n, a, o, i, l, s, c, u, d, {
                        cardUrl: h = null,
                        onCardTextureGenerated: g,
                        setZoom: p,
                        setOffsetX: x,
                        setOffsetY: b,
                        generatedResult: j = null,
                        onReset: C = () => {}
                    } = e,
                    {
                        displayName: S,
                        displayStack: k,
                        displayPassNo: I,
                        photoPreviewUrl: T,
                        selectedFrame: P,
                        zoom: A,
                        offsetX: R,
                        offsetY: B,
                        qrUrl: F,
                        photoFilter: L
                    } = (n = (e.name ? .trim() || "Ravi kisan").toUpperCase(), a = e.stack ? .trim() || "Creative Director", o = (e.passNo ? .trim() || "1").toUpperCase(), i = e.selectedFrame ? ? "none", l = e.zoom ? ? 1, s = e.offsetX ? ? 0, c = e.offsetY ? ? 0, u = e.qrUrl ? .trim() || "https://x.com/BH4VE5H", d = e.photoFilter || "none", {
                        displayName: n,
                        displayStack: a,
                        displayPassNo: o,
                        frameSrc: i && "none" !== i ? `/assets/${i}` : null,
                        selectedFrame: i,
                        zoom: l,
                        offsetX: s,
                        offsetY: c,
                        activePanX: l > 1 ? s : 0,
                        activePanY: l > 1 ? c : 0,
                        photoPreviewUrl: e.photoPreviewUrl ? ? null,
                        qrUrl: u,
                        photoFilter: d
                    }),
                    [U, O] = (0, r.useState)("3d"),
                    [D, z] = (0, r.useState)(null),
                    [Y, _] = (0, r.useState)(!1),
                    H = (0, r.useRef)(null),
                    X = (0, r.useCallback)(e => new Promise(t => {
                        let r = new Image;
                        r.crossOrigin = "anonymous", r.onload = () => t(r), r.onerror = () => t(null), r.src = e
                    }), []),
                    $ = (0, r.useCallback)(async () => {
                        if (h) return void z(h);
                        try {
                            "u" > typeof document && document.fonts && await document.fonts.ready;
                            let e = document.createElement("canvas");
                            e.width = 1200, e.height = 1800;
                            let t = e.getContext("2d");
                            if (!t) return;
                            t.fillStyle = v, t.beginPath(), t.roundRect(0, 0, 1200, 1800, 64), t.fill(), t.fillStyle = "#000000", t.beginPath(), t.arc(600, 130, 36, 0, 2 * Math.PI), t.fill(), t.fillStyle = N, t.font = `900 55px ${E}`, t.textAlign = "right", t.fillText("GOA, INDIA · 28 – 31 OCT 2026", 1060, 380), t.font = `900 55px ${E}`, t.fillText("LESS NOISE. MORE SIGNAL", 1060, 445), t.textAlign = "left";
                            let r = P && "none" !== P ? `/assets/${P}` : null,
                                [n, a, o, i, l] = await Promise.all([X("/assets/logo.png"), X("/assets/goa.svg"), X("/assets/2-47.svg"), r ? X(r) : Promise.resolve(null), T ? X(T) : Promise.resolve(null)]);
                            if (n && t.drawImage(n, 110, 195, 570, 120), a && t.drawImage(a, 800, 120, 270, 200), o && t.drawImage(o, 110, 340, 250, 120), t.save(), t.beginPath(), t.roundRect(110, 500, 980, 980, 48), t.clip(), t.fillStyle = v, t.fill(), l) {
                                let e = l.width || 980,
                                    r = l.height || 980,
                                    n = Math.max(980 / e, 980 / r),
                                    a = Math.max(1, Math.min(3, A)),
                                    o = n * a,
                                    i = e * o,
                                    s = r * o,
                                    c = a > 1 ? R : 0,
                                    u = a > 1 ? B : 0;
                                t.drawImage(l, 110 + (980 - i) / 2 + c / 400 * 980, 500 + (980 - s) / 2 + u / 400 * 980, i, s), L && "none" !== L && function(e, t) {
                                    if (!t || "none" === t) return;
                                    let r = Math.floor(980),
                                        n = Math.floor(980),
                                        a = Math.floor(110),
                                        o = Math.floor(500);
                                    try {
                                        let i = e.getImageData(a, o, r, n),
                                            l = i.data,
                                            s = f("#0B6839"),
                                            c = f("#FEE101");
                                        if ("duotone" === t) {
                                            for (let e = 0; e < l.length; e += 4) {
                                                let t = (.299 * l[e] + .587 * l[e + 1] + .114 * l[e + 2]) / 255;
                                                l[e] = Math.round(s.r + t * (c.r - s.r)), l[e + 1] = Math.round(s.g + t * (c.g - s.g)), l[e + 2] = Math.round(s.b + t * (c.b - s.b))
                                            }
                                            e.putImageData(i, a, o)
                                        } else if ("grayscale" === t) {
                                            for (let e = 0; e < l.length; e += 4) {
                                                let t = .299 * l[e] + .587 * l[e + 1] + .114 * l[e + 2],
                                                    r = Math.min(255, Math.max(0, (t - 128) * 1.3 + 128));
                                                l[e] = r, l[e + 1] = r, l[e + 2] = r
                                            }
                                            e.putImageData(i, a, o)
                                        } else if ("dither" === t) {
                                            let t = [
                                                [0, 8, 2, 10],
                                                [12, 4, 14, 6],
                                                [3, 11, 1, 9],
                                                [15, 7, 13, 5]
                                            ];
                                            for (let e = 0; e < n; e++)
                                                for (let n = 0; n < r; n++) {
                                                    let a = (e * r + n) * 4,
                                                        o = (.299 * l[a] + .587 * l[a + 1] + .114 * l[a + 2]) / 255,
                                                        i = (t[e % 4][n % 4] + .5) / 16,
                                                        u = o > i ? c : s;
                                                    l[a] = u.r, l[a + 1] = u.g, l[a + 2] = u.b
                                                }
                                            e.putImageData(i, a, o)
                                        } else if ("pixelate" === t) {
                                            let t = Math.max(6, Math.floor(r / 60));
                                            for (let i = 0; i < n; i += t)
                                                for (let n = 0; n < r; n += t) {
                                                    let s = (i * r + n) * 4,
                                                        c = l[s],
                                                        u = l[s + 1],
                                                        d = l[s + 2];
                                                    e.fillStyle = `rgb(${c},${u},${d})`, e.fillRect(a + n, o + i, t, t)
                                                }
                                        } else if ("ascii" === t) {
                                            let t = " @#*+=-:. ",
                                                i = Math.max(8, Math.floor(r / 50));
                                            e.fillStyle = "#1b6838", e.fillRect(a, o, r, n), e.fillStyle = "#FEE101", e.font = `bold ${i}px 'Victor Mono', monospace`, e.textAlign = "center", e.textBaseline = "middle";
                                            for (let s = 0; s < n; s += i)
                                                for (let n = 0; n < r; n += i) {
                                                    let c = (Math.floor(s) * r + Math.floor(n)) * 4;
                                                    if (c < l.length) {
                                                        let r = (.299 * l[c] + .587 * l[c + 1] + .114 * l[c + 2]) / 255,
                                                            u = Math.floor((1 - r) * (t.length - 1)),
                                                            d = t[Math.max(0, Math.min(t.length - 1, u))];
                                                        e.fillText(d, a + n + i / 2, o + s + i / 2)
                                                    }
                                                }
                                        }
                                    } catch (e) {
                                        console.warn("Could not apply photo filter to canvas:", e)
                                    }
                                }(t, L)
                            } else t.fillStyle = N, t.font = `900 110px ${E}`, t.textAlign = "center", t.fillText("Upload Your Photo", 600, 950), t.font = "900 110px ", t.fillStyle = "#ffffff", t.fillText("in Panel", 600, 1050), t.textAlign = "center";
                            i && "none" !== P && t.drawImage(i, 110, 500, 980, 980), t.restore(), t.strokeStyle = N, t.lineWidth = 12, t.beginPath(), t.roundRect(110, 500, 980, 980, 48), t.stroke(), t.fillStyle = N, t.font = `900 90px ${E}`, t.fillText(S, 100, 1572), t.fillStyle = "#a3e635", t.font = `700 50px ${M}`, t.fillText(k, 100, 1635), t.save(), t.fillStyle = N, t.beginPath(), t.roundRect(100, 1660, 300, 72, 18), t.fill(), t.fillStyle = "#0B6839", t.font = `900 40px ${M}`, t.fillText(`NO: ${I}`, 110, 1710), t.restore(), ! function(e, t, r = "#FEE101", n = "#1b6838") {
                                let {
                                    size: a,
                                    isDark: o
                                } = function(e) {
                                    try {
                                        let t = m.default.create(e || "https://github.com", {
                                                errorCorrectionLevel: "M"
                                            }),
                                            r = t.modules.size;
                                        return {
                                            size: r,
                                            isDark: (e, n) => !(e < 0) && !(e >= r) && !(n < 0) && !(n >= r) && !!t.modules.get(e, n)
                                        }
                                    } catch (e) {
                                        return console.error("Error generating QR matrix:", e), {
                                            size: 21,
                                            isDark: (e, t) => 0 === e || 20 === e || 0 === t || 20 === t || e === t
                                        }
                                    }
                                }(t);
                                e.fillStyle = n, e.fillRect(890, 1530, 200, 200);
                                let i = 200 / a;
                                e.fillStyle = r;
                                for (let t = 0; t < a; t++)
                                    for (let r = 0; r < a; r++)
                                        if (o(t, r)) {
                                            let n = 890 + r * i,
                                                a = 1530 + t * i;
                                            e.fillRect(Math.floor(n), Math.floor(a), Math.ceil(i), Math.ceil(i))
                                        }
                            }(t, F || "https://x.com/BH4VE5H/", N, v);
                            let s = e.toDataURL("image/png");
                            z(s), g && g(s)
                        } catch (e) {
                            console.warn("Error rendering front card texture for 3D Lanyard:", e)
                        }
                    }, [h, T, P, L, F, A, R, B, S, k, I, X, g]);
                (0, r.useEffect)(() => {
                    let e = setTimeout(() => {
                        $()
                    }, 150);
                    return () => clearTimeout(e)
                }, [$]);
                let G = () => {
                    _(!1), H.current = null
                };
                return (0, t.jsxs)("div", {
                    className: "bg-[#FFFBE8] p-4 flex flex-col gap-4 font-body rounded-lg shadow-[7px_7px_0px_0px_#084e2a] h-[750px] sm:h-[723px]",
                    children: [(0, t.jsx)("div", {
                        className: "relative w-full overflow-hidden",
                        children: "3d" === U ? (0, t.jsx)("div", {
                            className: "bg-white relative w-full h-[520px] sm:h-[520px] flex items-center justify-center border border-black/20 rounded-3xl",
                            children: (0, t.jsx)(w, {
                                position: [0, 0, 13],
                                fov: 20,
                                gravity: [0, -40, 0],
                                frontImage: D,
                                backImage: "/assets/lanyard/ID_back.png",
                                imageFit: "cover",
                                lanyardWidth: 1
                            })
                        }) : (0, t.jsx)("div", {
                            className: "flex justify-center",
                            children: (0, t.jsx)("div", {
                                onWheel: e => {
                                    p && p(Math.max(1, Math.min(3, Number((A + (e.deltaY > 0 ? -.1 : .1)).toFixed(2)))))
                                },
                                onMouseDown: e => {
                                    _(!0), H.current = {
                                        x: e.clientX,
                                        y: e.clientY,
                                        initX: R,
                                        initY: B
                                    }
                                },
                                onMouseMove: e => {
                                    if (!Y || !H.current || !x || !b) return;
                                    let t = e.clientX - H.current.x,
                                        r = e.clientY - H.current.y;
                                    x(H.current.initX + 2 * t), b(H.current.initY + 2 * r)
                                },
                                onMouseUp: G,
                                onMouseLeave: G,
                                onTouchStart: e => {
                                    if (1 !== e.touches.length) return;
                                    _(!0);
                                    let t = e.touches[0];
                                    H.current = {
                                        x: t.clientX,
                                        y: t.clientY,
                                        initX: R,
                                        initY: B
                                    }
                                },
                                onTouchMove: e => {
                                    if (!Y || !H.current || !x || !b || 1 !== e.touches.length) return;
                                    let t = e.touches[0],
                                        r = t.clientX - H.current.x,
                                        n = t.clientY - H.current.y;
                                    x(H.current.initX + 2 * r), b(H.current.initY + 2 * n)
                                },
                                onTouchEnd: G,
                                className: `bg-white w-full h-[520px] sm:h-[520px] mx-auto aspect-auto sm:aspect-[2/3] relative select-none p-10 pb-15 border border-black/20 rounded-3xl 
        ${Y?"cursor-grabbing":"cursor-grab"}`,
                                children: D ? (0, t.jsx)("img", {
                                    src: D,
                                    alt: "2D Builder ID Card",
                                    className: "w-full h-full object-contain pointer-events-none"
                                }) : (0, t.jsx)("div", {
                                    className: "w-full h-full bg-[#1b6838] flex items-center justify-center",
                                    children: (0, t.jsx)("div", {
                                        className: "w-8 h-8 border-4 border-zinc-800 border-t-[#FEE101] rounded-full animate-spin"
                                    })
                                })
                            })
                        })
                    }), (0, t.jsx)(y, {
                        viewMode: U,
                        setViewMode: O,
                        generatedResult: j,
                        onReset: C
                    })]
                })
            }

            function C({
                photoPreviewUrl: e,
                name: r,
                stack: n,
                qrUrl: a,
                photoFilter: o,
                passNo: i,
                selectedFrame: l,
                zoom: s,
                setZoom: c,
                offsetX: u,
                setOffsetX: d,
                offsetY: f,
                setOffsetY: h,
                onCardTextureGenerated: g,
                generatedResult: p,
                onReset: m
            }) {
                return (0, t.jsx)("div", {
                    className: "flex flex-col items-center gap-6 font-body w-full",
                    children: (0, t.jsx)("div", {
                        className: "w-full",
                        children: (0, t.jsx)(j, {
                            photoPreviewUrl: e,
                            name: r,
                            stack: n,
                            qrUrl: a,
                            photoFilter: o,
                            passNo: i,
                            selectedFrame: l,
                            zoom: s,
                            setZoom: c,
                            offsetX: u,
                            setOffsetX: d,
                            offsetY: f,
                            setOffsetY: h,
                            cardUrl: p ? .cardUrl,
                            onCardTextureGenerated: g,
                            generatedResult: p,
                            onReset: m
                        })
                    })
                })
            }
            var S = e.i(42831),
                k = {};
            ! function e(t, r, n, a) {
                var o, i, l, s, c, u, d, f, h, g, p, m = !!(t.Worker && t.Blob && t.Promise && t.OffscreenCanvas && t.OffscreenCanvasRenderingContext2D && t.HTMLCanvasElement && t.HTMLCanvasElement.prototype.transferControlToOffscreen && t.URL && t.URL.createObjectURL),
                    x = "function" == typeof Path2D && "function" == typeof DOMMatrix;

                function b() {}

                function y(e) {
                    var n = r.exports.Promise,
                        a = void 0 !== n ? n : t.Promise;
                    return "function" == typeof a ? new a(e) : (e(b, b), null)
                }
                var w = (o = function() {
                        if (!t.OffscreenCanvas) return !1;
                        try {
                            var e = new OffscreenCanvas(1, 1),
                                r = e.getContext("2d");
                            r.fillRect(0, 0, 1, 1);
                            var n = e.transferToImageBitmap();
                            r.createPattern(n, "no-repeat")
                        } catch (e) {
                            return !1
                        }
                        return !0
                    }(), i = new Map, {
                        transform: function(e) {
                            if (o) return e;
                            if (i.has(e)) return i.get(e);
                            var t = new OffscreenCanvas(e.width, e.height);
                            return t.getContext("2d").drawImage(e, 0, 0), i.set(e, t), t
                        },
                        clear: function() {
                            i.clear()
                        }
                    }),
                    v = (c = Math.floor(1e3 / 60), u = {}, d = 0, "function" == typeof requestAnimationFrame && "function" == typeof cancelAnimationFrame ? (l = function(e) {
                        var t = Math.random();
                        return u[t] = requestAnimationFrame(function r(n) {
                            d === n || d + c - 1 < n ? (d = n, delete u[t], e()) : u[t] = requestAnimationFrame(r)
                        }), t
                    }, s = function(e) {
                        u[e] && cancelAnimationFrame(u[e])
                    }) : (l = function(e) {
                        return setTimeout(e, c)
                    }, s = function(e) {
                        return clearTimeout(e)
                    }), {
                        frame: l,
                        cancel: s
                    }),
                    N = (g = {}, function() {
                        if (f) return f;
                        if (!n && m) {
                            var t = ["var CONFETTI, SIZE = {}, module = {};", "(" + e.toString() + ")(this, module, true, SIZE);", "onmessage = function(msg) {\n  if (msg.data.options) {\n    CONFETTI(msg.data.options).then(function () {\n      if (msg.data.callback) {\n        postMessage({ callback: msg.data.callback });\n      }\n    });\n  } else if (msg.data.reset) {\n    CONFETTI && CONFETTI.reset();\n  } else if (msg.data.resize) {\n    SIZE.width = msg.data.resize.width;\n    SIZE.height = msg.data.resize.height;\n  } else if (msg.data.canvas) {\n    SIZE.width = msg.data.canvas.width;\n    SIZE.height = msg.data.canvas.height;\n    CONFETTI = module.exports.create(msg.data.canvas);\n  }\n}"].join("\n");
                            try {
                                f = new Worker(URL.createObjectURL(new Blob([t])))
                            } catch (e) {
                                return "u" > typeof console && "function" == typeof console.warn && console.warn("🎊 Could not load worker", e), null
                            }
                            var r = f;

                            function a(e, t) {
                                r.postMessage({
                                    options: e || {},
                                    callback: t
                                })
                            }
                            r.init = function(e) {
                                var t = e.transferControlToOffscreen();
                                r.postMessage({
                                    canvas: t
                                }, [t])
                            }, r.fire = function(e, t, n) {
                                if (h) return a(e, null), h;
                                var o = Math.random().toString(36).slice(2);
                                return h = y(function(t) {
                                    function i(e) {
                                        e.data.callback === o && (delete g[o], r.removeEventListener("message", i), h = null, w.clear(), n(), t())
                                    }
                                    r.addEventListener("message", i), a(e, o), g[o] = i.bind(null, {
                                        data: {
                                            callback: o
                                        }
                                    })
                                })
                            }, r.reset = function() {
                                for (var e in r.postMessage({
                                        reset: !0
                                    }), g) g[e](), delete g[e]
                            }
                        }
                        return f
                    }),
                    E = {
                        particleCount: 50,
                        angle: 90,
                        spread: 45,
                        startVelocity: 45,
                        decay: .9,
                        gravity: 1,
                        drift: 0,
                        ticks: 200,
                        x: .5,
                        y: .5,
                        shapes: ["square", "circle"],
                        zIndex: 100,
                        colors: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"],
                        disableForReducedMotion: !1,
                        scalar: 1
                    };

                function M(e, t, r) {
                    var n;
                    return n = e && null != e[t] ? e[t] : E[t], r ? r(n) : n
                }

                function j(e) {
                    return e < 0 ? 0 : Math.floor(e)
                }

                function C(e) {
                    return parseInt(e, 16)
                }

                function S(e) {
                    return e.map(k)
                }

                function k(e) {
                    var t = String(e).replace(/[^0-9a-f]/gi, "");
                    return t.length < 6 && (t = t[0] + t[0] + t[1] + t[1] + t[2] + t[2]), {
                        r: C(t.substring(0, 2)),
                        g: C(t.substring(2, 4)),
                        b: C(t.substring(4, 6))
                    }
                }

                function I(e) {
                    e.width = document.documentElement.clientWidth, e.height = document.documentElement.clientHeight
                }

                function T(e) {
                    var t = e.getBoundingClientRect();
                    e.width = t.width, e.height = t.height
                }

                function P(e, r) {
                    var o, i = !e,
                        l = !!M(r || {}, "resize"),
                        s = !1,
                        c = M(r, "disableForReducedMotion", Boolean),
                        u = m && M(r || {}, "useWorker") ? N() : null,
                        d = i ? I : T,
                        f = !!e && !!u && !!e.__confetti_initialized,
                        h = "function" == typeof matchMedia && matchMedia("(prefers-reduced-motion)").matches;

                    function g(r) {
                        var g, p = c || M(r, "disableForReducedMotion", Boolean),
                            m = M(r, "zIndex", Number);
                        if (p && h) return y(function(e) {
                            e()
                        });
                        i && o ? e = o.canvas : i && !e && ((g = document.createElement("canvas")).style.position = "fixed", g.style.top = "0px", g.style.left = "0px", g.style.pointerEvents = "none", g.style.zIndex = m, e = g, document.body.appendChild(e)), l && !f && d(e);
                        var b = {
                            width: e.width,
                            height: e.height
                        };

                        function N() {
                            if (u) {
                                var t = {
                                    getBoundingClientRect: function() {
                                        if (!i) return e.getBoundingClientRect()
                                    }
                                };
                                d(t), u.postMessage({
                                    resize: {
                                        width: t.width,
                                        height: t.height
                                    }
                                });
                                return
                            }
                            b.width = b.height = null
                        }

                        function E() {
                            o = null, l && (s = !1, t.removeEventListener("resize", N)), i && e && (document.body.contains(e) && document.body.removeChild(e), e = null, f = !1)
                        }
                        return (u && !f && u.init(e), f = !0, u && (e.__confetti_initialized = !0), l && !s && (s = !0, t.addEventListener("resize", N, !1)), u) ? u.fire(r, b, E) : function(t, r, i) {
                            for (var l, s, c, u, f, h, g, p = M(t, "particleCount", j), m = M(t, "angle", Number), b = M(t, "spread", Number), N = M(t, "startVelocity", Number), E = M(t, "decay", Number), C = M(t, "gravity", Number), k = M(t, "drift", Number), I = M(t, "colors", S), T = M(t, "ticks", Number), P = M(t, "shapes"), A = M(t, "scalar"), R = !!M(t, "flat"), B = ((l = M(t, "origin", Object)).x = M(l, "x", Number), l.y = M(l, "y", Number), l), F = p, L = [], U = e.width * B.x, O = e.height * B.y; F--;) L.push(function(e) {
                                var t = e.angle * (Math.PI / 180),
                                    r = e.spread * (Math.PI / 180);
                                return {
                                    x: e.x,
                                    y: e.y,
                                    wobble: 10 * Math.random(),
                                    wobbleSpeed: Math.min(.11, .1 * Math.random() + .05),
                                    velocity: .5 * e.startVelocity + Math.random() * e.startVelocity,
                                    angle2D: -t + (.5 * r - Math.random() * r),
                                    tiltAngle: (.5 * Math.random() + .25) * Math.PI,
                                    color: e.color,
                                    shape: e.shape,
                                    tick: 0,
                                    totalTicks: e.ticks,
                                    decay: e.decay,
                                    drift: e.drift,
                                    random: Math.random() + 2,
                                    tiltSin: 0,
                                    tiltCos: 0,
                                    wobbleX: 0,
                                    wobbleY: 0,
                                    gravity: 3 * e.gravity,
                                    ovalScalar: .6,
                                    scalar: e.scalar,
                                    flat: e.flat
                                }
                            }({
                                x: U,
                                y: O,
                                angle: m,
                                spread: b,
                                startVelocity: N,
                                color: I[F % I.length],
                                shape: P[Math.floor(Math.random() * (P.length - 0)) + 0],
                                ticks: T,
                                decay: E,
                                gravity: C,
                                drift: k,
                                scalar: A,
                                flat: R
                            }));
                            return o ? o.addFettis(L) : (s = e, f = L.slice(), h = s.getContext("2d"), g = y(function(e) {
                                    function t() {
                                        c = u = null, h.clearRect(0, 0, r.width, r.height), w.clear(), i(), e()
                                    }
                                    c = v.frame(function e() {
                                        n && (r.width !== a.width || r.height !== a.height) && (r.width = s.width = a.width, r.height = s.height = a.height), r.width || r.height || (d(s), r.width = s.width, r.height = s.height), h.clearRect(0, 0, r.width, r.height), (f = f.filter(function(e) {
                                                    return function(e, t) {
                                                        t.x += Math.cos(t.angle2D) * t.velocity + t.drift, t.y += Math.sin(t.angle2D) * t.velocity + t.gravity, t.velocity *= t.decay, t.flat ? (t.wobble = 0, t.wobbleX = t.x + 10 * t.scalar, t.wobbleY = t.y + 10 * t.scalar, t.tiltSin = 0, t.tiltCos = 0, t.random = 1) : (t.wobble += t.wobbleSpeed, t.wobbleX = t.x + 10 * t.scalar * Math.cos(t.wobble), t.wobbleY = t.y + 10 * t.scalar * Math.sin(t.wobble), t.tiltAngle += .1, t.tiltSin = Math.sin(t.tiltAngle), t.tiltCos = Math.cos(t.tiltAngle), t.random = Math.random() + 2);
                                                        var r, n, a, o, i, l, s, c, u, d, f, h, g, p, m, b, y = t.tick++/t.totalTicks,v=t.x+t.random*t.tiltCos,N=t.y+t.random*t.tiltSin,E=t.wobbleX+t.random*t.tiltCos,M=t.wobbleY+t.random*t.tiltSin;if(e.fillStyle="rgba("+t.color.r+", "+t.color.g+", "+t.color.b+", "+(1-y)+")",e.beginPath(),x&&"path"===t.shape.type&&"string"==typeof t.shape.path&&Array.isArray(t.shape.matrix)){e.fill((r=t.shape.path,n=t.shape.matrix,a=t.x,o=t.y,i=.1*Math.abs(E-v),l=.1*Math.abs(M-N),s=Math.PI/
                                                        10 * t.wobble, c = new Path2D(r), (u = new Path2D).addPath(c, new DOMMatrix(n)), (d = new Path2D).addPath(u, new DOMMatrix([Math.cos(s) * i, Math.sin(s) * i, -Math.sin(s) * l, Math.cos(s) * l, a, o])), d))
                                            }
                                            else if ("bitmap" === t.shape.type) {
                                                var j = Math.PI / 10 * t.wobble,
                                                    C = .1 * Math.abs(E - v),
                                                    S = .1 * Math.abs(M - N),
                                                    k = t.shape.bitmap.width * t.scalar,
                                                    I = t.shape.bitmap.height * t.scalar,
                                                    T = new DOMMatrix([Math.cos(j) * C, Math.sin(j) * C, -Math.sin(j) * S, Math.cos(j) * S, t.x, t.y]);
                                                T.multiplySelf(new DOMMatrix(t.shape.matrix));
                                                var P = e.createPattern(w.transform(t.shape.bitmap), "no-repeat");
                                                P.setTransform(T), e.globalAlpha = 1 - y, e.fillStyle = P, e.fillRect(t.x - k / 2, t.y - I / 2, k, I), e.globalAlpha = 1
                                            } else if ("circle" === t.shape) e.ellipse ? e.ellipse(t.x, t.y, Math.abs(E - v) * t.ovalScalar, Math.abs(M - N) * t.ovalScalar, Math.PI / 10 * t.wobble, 0, 2 * Math.PI) : (f = t.x, h = t.y, g = Math.abs(E - v) * t.ovalScalar, p = Math.abs(M - N) * t.ovalScalar, m = Math.PI / 10 * t.wobble, b = 2 * Math.PI, e.save(), e.translate(f, h), e.rotate(m), e.scale(g, p), e.arc(0, 0, 1, 0, b, void 0), e.restore());
                                            else if ("star" === t.shape)
                                                for (var A = Math.PI / 2 * 3, R = 4 * t.scalar, B = 8 * t.scalar, F = t.x, L = t.y, U = 5, O = Math.PI / 5; U--;) F = t.x + Math.cos(A) * B, L = t.y + Math.sin(A) * B, e.lineTo(F, L), A += O, F = t.x + Math.cos(A) * R, L = t.y + Math.sin(A) * R, e.lineTo(F, L), A += O;
                                            else e.moveTo(Math.floor(t.x), Math.floor(t.y)), e.lineTo(Math.floor(t.wobbleX), Math.floor(N)), e.lineTo(Math.floor(E), Math.floor(M)), e.lineTo(Math.floor(v), Math.floor(t.wobbleY));
                                            return e.closePath(), e.fill(), t.tick < t.totalTicks
                                        }(h, e)
                                    })).length ? c = v.frame(e) : t()
                            }), u = t
                        }), (o = {
                        addFettis: function(e) {
                            return f = f.concat(e), g
                        },
                        canvas: s,
                        promise: g,
                        reset: function() {
                            c && v.cancel(c), u && u()
                        }
                    }).promise)
            }(r, b, E)
        }
        return g.reset = function() {
            u && u.reset(), o && o.reset()
        }, g
    }

    function A() {
        return p || (p = P(null, {
            useWorker: !0,
            resize: !0
        })), p
    }
    r.exports = function() {
        return A().apply(this, arguments)
    }, r.exports.reset = function() {
        A().reset()
    }, r.exports.create = P, r.exports.shapeFromPath = function(e) {
        if (!x) throw Error("path confetti are not supported in this browser");
        "string" == typeof e ? n = e : (n = e.path, a = e.matrix);
        var t = new Path2D(n),
            r = document.createElement("canvas").getContext("2d");
        if (!a) {
            for (var n, a, o, i, l = 1e3, s = 1e3, c = 0, u = 0, d = 0; d < 1e3; d += 2)
                for (var f = 0; f < 1e3; f += 2) r.isPointInPath(t, d, f, "nonzero") && (l = Math.min(l, d), s = Math.min(s, f), c = Math.max(c, d), u = Math.max(u, f));
            o = c - l;
            var h = Math.min(10 / o, 10 / (i = u - s));
            a = [h, 0, 0, h, -Math.round(o / 2 + l) * h, -Math.round(i / 2 + s) * h]
        }
        return {
            type: "path",
            path: n,
            matrix: a
        }
    }, r.exports.shapeFromText = function(e) {
        var t, r = 1,
            n = "#000000",
            a = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
        "string" == typeof e ? t = e : (t = e.text, r = "scalar" in e ? e.scalar : r, a = "fontFamily" in e ? e.fontFamily : a, n = "color" in e ? e.color : n);
        var o = 10 * r,
            i = "" + o + "px " + a,
            l = new OffscreenCanvas(o, o),
            s = l.getContext("2d");
        s.font = i;
        var c = s.measureText(t),
            u = Math.ceil(c.actualBoundingBoxRight + c.actualBoundingBoxLeft),
            d = Math.ceil(c.actualBoundingBoxAscent + c.actualBoundingBoxDescent),
            f = c.actualBoundingBoxLeft + 2,
            h = c.actualBoundingBoxAscent + 2;
        u += 4, d += 4, (s = (l = new OffscreenCanvas(u, d)).getContext("2d")).font = i, s.fillStyle = n, s.fillText(t, f, h);
        var g = 1 / r;
        return {
            type: "bitmap",
            bitmap: l.transferToImageBitmap(),
            matrix: [g, 0, 0, g, -u * g / 2, -d * g / 2]
        }
    }
}(function() {
    return "u" > typeof window ? window : "u" > typeof self ? self : this || {}
}(), k, !1);
let I = k.exports;
k.exports.create;
let T = () => {
    let e = Date.now() + 1500,
        t = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1", "#FEE101", "#FF0080"],
        r = () => {
            Date.now() > e || (I({
                particleCount: 3,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: {
                    x: 0,
                    y: .5
                },
                colors: t
            }), I({
                particleCount: 3,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: {
                    x: 1,
                    y: .5
                },
                colors: t
            }), requestAnimationFrame(r))
        };
    r()
};
e.s(["default", 0, function() {
    let [e, o] = (0, r.useState)(null), [i, l] = (0, r.useState)(null), [c, u] = (0, r.useState)(null), [d, f] = (0, r.useState)(1), [h, p] = (0, r.useState)(0), [m, b] = (0, r.useState)(0), [y, w] = (0, r.useState)(""), [v, N] = (0, r.useState)(""), [E, M] = (0, r.useState)(""), [j, k] = (0, r.useState)(""), [I, P] = (0, r.useState)(""), [A, R] = (0, r.useState)(""), [B, F] = (0, r.useState)(1), [L, U] = (0, r.useState)(0), [O, D] = (0, r.useState)(0), [z, Y] = (0, r.useState)("57236"), [_, H] = (0, r.useState)("frame1.png"), [X, $] = (0, r.useState)("none");
    (0, r.useEffect)(() => {
        Y(Math.floor(1e4 + 9e4 * Math.random()).toString())
    }, []);
    let [G, V] = (0, r.useState)(!1), [K, q] = (0, r.useState)(null), J = (e, t) => {
        let r = Math.random().toString(36).substring(2, 10),
            n = c || i || "",
            a = `${e}/card/${r}`,
            o = (0, x.getXShareUrl)(r, e, t);
        q({
            id: r,
            cardUrl: n,
            shareUrl: a,
            xShareUrl: o,
            name: t
        }), T()
    }, W = async () => {
        if (!e) return void console.error("No photo provided for ID card generation.");
        let t = y.trim() || "HH GOA BUILDER";
        V(!0), k(y), P(v), R(E), F(d), U(h), D(m);
        let r = window.location.origin;
        try {
            let n = await s(e),
                a = new FormData;
            a.append("photo", n), a.append("name", t), a.append("stack", v), a.append("qrUrl", E), a.append("passNo", z), a.append("selectedFrame", _), a.append("photoFilter", X), a.append("zoom", d.toString()), a.append("offsetX", h.toString()), a.append("offsetY", m.toString()), c && a.append("cardImageDataUrl", c);
            let o = await fetch("/api/generate", {
                    method: "POST",
                    body: a
                }),
                i = await o.text(),
                l = null;
            try {
                l = JSON.parse(i)
            } catch (e) {
                console.error("Server API returned non-JSON response:", i)
            }
            if (o.ok && l && l.success) q({
                id: l.id,
                cardUrl: l.cardUrl,
                shareUrl: l.shareUrl,
                xShareUrl: l.xShareUrl,
                name: l.name
            }), T();
            else {
                let e = l ? .error || i || "Server card creation failed";
                console.error("Card generation API error (falling back to client card):", e), J(r, t)
            }
        } catch (e) {
            console.error("Card generation exception (falling back to client card):", e), J(r, t)
        } finally {
            V(!1)
        }
    };
    return (0, t.jsxs)("div", {
        className: "w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between items-center font-body",
        children: [(0, t.jsx)(n, {}), (0, t.jsxs)("div", {
            className: "w-full flex flex-col gap-6",
            children: [(0, t.jsx)(a, {}), (0, t.jsxs)("div", {
                className: "grid grid-cols-1 md:grid-cols-12 gap-8 items-start",
                children: [(0, t.jsx)("div", {
                    className: "md:col-span-6 flex flex-col gap-6",
                    children: (0, t.jsx)(g, {
                        onPhotoSelected: (e, t) => {
                            o(e), l(t)
                        },
                        selectedPreviewUrl: i,
                        onClearPhoto: () => {
                            o(null), l(null), u(null), f(1), p(0), b(0)
                        },
                        selectedFrame: _,
                        setSelectedFrame: H,
                        photoFilter: X,
                        setPhotoFilter: $,
                        name: y,
                        setName: w,
                        stack: v,
                        setStack: N,
                        qrUrl: E,
                        setQrUrl: M,
                        passNo: z,
                        onGenerate: W,
                        isGenerating: G,
                        hasPhoto: !!e,
                        zoom: d,
                        setZoom: f,
                        offsetX: h,
                        setOffsetX: p,
                        offsetY: m,
                        setOffsetY: b
                    })
                }), (0, t.jsx)("div", {
                    className: "md:col-span-6 flex flex-col items-center w-full ",
                    children: (0, t.jsx)(C, {
                        photoPreviewUrl: i,
                        name: y || j,
                        stack: v || I,
                        qrUrl: E || A,
                        photoFilter: X,
                        passNo: z,
                        selectedFrame: _,
                        zoom: d,
                        setZoom: f,
                        offsetX: h,
                        setOffsetX: p,
                        offsetY: m,
                        setOffsetY: b,
                        onCardTextureGenerated: u,
                        generatedResult: K,
                        onReset: () => {
                            o(null), l(null), u(null), f(1), p(0), b(0), w(""), N(""), M("https://x.com/BH4VE5H/"), k(""), P(""), R("https://x.com/BH4VE5H/"), F(1), U(0), D(0), H("frame1.png"), $("none"), Y(Math.floor(1e4 + 9e4 * Math.random()).toString()), q(null)
                        }
                    })
                })]
            })]
        }), (0, t.jsx)(S.default, {})]
    })
}], 29531)
}, 38750, (e, t, r) => {
    t.exports = function() {
        return "function" == typeof Promise && Promise.prototype && Promise.prototype.then
    }
}, 87201, (e, t, r) => {
    let n, a = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346, 404, 466, 532, 581, 655, 733, 815, 901, 991, 1085, 1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185, 2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706];
    r.getSymbolSize = function(e) {
        if (!e) throw Error('"version" cannot be null or undefined');
        if (e < 1 || e > 40) throw Error('"version" should be in range from 1 to 40');
        return 4 * e + 17
    }, r.getSymbolTotalCodewords = function(e) {
        return a[e]
    }, r.getBCHDigit = function(e) {
        let t = 0;
        for (; 0 !== e;) t++, e >>>= 1;
        return t
    }, r.setToSJISFunction = function(e) {
        if ("function" != typeof e) throw Error('"toSJISFunc" is not a valid function.');
        n = e
    }, r.isKanjiModeEnabled = function() {
        return void 0 !== n
    }, r.toSJIS = function(e) {
        return n(e)
    }
}, 73133, (e, t, r) => {
    r.L = {
        bit: 1
    }, r.M = {
        bit: 0
    }, r.Q = {
        bit: 3
    }, r.H = {
        bit: 2
    }, r.isValid = function(e) {
        return e && void 0 !== e.bit && e.bit >= 0 && e.bit < 4
    }, r.from = function(e, t) {
        if (r.isValid(e)) return e;
        try {
            if ("string" != typeof e) throw Error("Param is not a string");
            switch (e.toLowerCase()) {
                case "l":
                case "low":
                    return r.L;
                case "m":
                case "medium":
                    return r.M;
                case "q":
                case "quartile":
                    return r.Q;
                case "h":
                case "high":
                    return r.H;
                default:
                    throw Error("Unknown EC Level: " + e)
            }
        } catch (e) {
            return t
        }
    }
}, 73666, (e, t, r) => {
    function n() {
        this.buffer = [], this.length = 0
    }
    n.prototype = {
        get: function(e) {
            let t = Math.floor(e / 8);
            return (this.buffer[t] >>> 7 - e % 8 & 1) == 1
        },
        put: function(e, t) {
            for (let r = 0; r < t; r++) this.putBit((e >>> t - r - 1 & 1) == 1)
        },
        getLengthInBits: function() {
            return this.length
        },
        putBit: function(e) {
            let t = Math.floor(this.length / 8);
            this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++
        }
    }, t.exports = n
}, 11421, (e, t, r) => {
    function n(e) {
        if (!e || e < 1) throw Error("BitMatrix size must be defined and greater than 0");
        this.size = e, this.data = new Uint8Array(e * e), this.reservedBit = new Uint8Array(e * e)
    }
    n.prototype.set = function(e, t, r, n) {
        let a = e * this.size + t;
        this.data[a] = r, n && (this.reservedBit[a] = !0)
    }, n.prototype.get = function(e, t) {
        return this.data[e * this.size + t]
    }, n.prototype.xor = function(e, t, r) {
        this.data[e * this.size + t] ^= r
    }, n.prototype.isReserved = function(e, t) {
        return this.reservedBit[e * this.size + t]
    }, t.exports = n
}, 20637, (e, t, r) => {
    let n = e.r(87201).getSymbolSize;
    r.getRowColCoords = function(e) {
        if (1 === e) return [];
        let t = Math.floor(e / 7) + 2,
            r = n(e),
            a = 145 === r ? 26 : 2 * Math.ceil((r - 13) / (2 * t - 2)),
            o = [r - 7];
        for (let e = 1; e < t - 1; e++) o[e] = o[e - 1] - a;
        return o.push(6), o.reverse()
    }, r.getPositions = function(e) {
        let t = [],
            n = r.getRowColCoords(e),
            a = n.length;
        for (let e = 0; e < a; e++)
            for (let r = 0; r < a; r++)(0 !== e || 0 !== r) && (0 !== e || r !== a - 1) && (e !== a - 1 || 0 !== r) && t.push([n[e], n[r]]);
        return t
    }
}, 14002, (e, t, r) => {
    let n = e.r(87201).getSymbolSize;
    r.getPositions = function(e) {
        let t = n(e);
        return [
            [0, 0],
            [t - 7, 0],
            [0, t - 7]
        ]
    }
}, 37692, (e, t, r) => {
    r.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };
    r.isValid = function(e) {
        return null != e && "" !== e && !isNaN(e) && e >= 0 && e <= 7
    }, r.from = function(e) {
        return r.isValid(e) ? parseInt(e, 10) : void 0
    }, r.getPenaltyN1 = function(e) {
        let t = e.size,
            r = 0,
            n = 0,
            a = 0,
            o = null,
            i = null;
        for (let l = 0; l < t; l++) {
            n = a = 0, o = i = null;
            for (let s = 0; s < t; s++) {
                let t = e.get(l, s);
                t === o ? n++ : (n >= 5 && (r += 3 + (n - 5)), o = t, n = 1), (t = e.get(s, l)) === i ? a++ : (a >= 5 && (r += 3 + (a - 5)), i = t, a = 1)
            }
            n >= 5 && (r += 3 + (n - 5)), a >= 5 && (r += 3 + (a - 5))
        }
        return r
    }, r.getPenaltyN2 = function(e) {
        let t = e.size,
            r = 0;
        for (let n = 0; n < t - 1; n++)
            for (let a = 0; a < t - 1; a++) {
                let t = e.get(n, a) + e.get(n, a + 1) + e.get(n + 1, a) + e.get(n + 1, a + 1);
                (4 === t || 0 === t) && r++
            }
        return 3 * r
    }, r.getPenaltyN3 = function(e) {
        let t = e.size,
            r = 0,
            n = 0,
            a = 0;
        for (let o = 0; o < t; o++) {
            n = a = 0;
            for (let i = 0; i < t; i++) n = n << 1 & 2047 | e.get(o, i), i >= 10 && (1488 === n || 93 === n) && r++, a = a << 1 & 2047 | e.get(i, o), i >= 10 && (1488 === a || 93 === a) && r++
        }
        return 40 * r
    }, r.getPenaltyN4 = function(e) {
        let t = 0,
            r = e.data.length;
        for (let n = 0; n < r; n++) t += e.data[n];
        return 10 * Math.abs(Math.ceil(100 * t / r / 5) - 10)
    }, r.applyMask = function(e, t) {
        let n = t.size;
        for (let a = 0; a < n; a++)
            for (let o = 0; o < n; o++) t.isReserved(o, a) || t.xor(o, a, function(e, t, n) {
                switch (e) {
                    case r.Patterns.PATTERN000:
                        return (t + n) % 2 == 0;
                    case r.Patterns.PATTERN001:
                        return t % 2 == 0;
                    case r.Patterns.PATTERN010:
                        return n % 3 == 0;
                    case r.Patterns.PATTERN011:
                        return (t + n) % 3 == 0;
                    case r.Patterns.PATTERN100:
                        return (Math.floor(t / 2) + Math.floor(n / 3)) % 2 == 0;
                    case r.Patterns.PATTERN101:
                        return t * n % 2 + t * n % 3 == 0;
                    case r.Patterns.PATTERN110:
                        return (t * n % 2 + t * n % 3) % 2 == 0;
                    case r.Patterns.PATTERN111:
                        return (t * n % 3 + (t + n) % 2) % 2 == 0;
                    default:
                        throw Error("bad maskPattern:" + e)
                }
            }(e, o, a))
    }, r.getBestMask = function(e, t) {
        let n = Object.keys(r.Patterns).length,
            a = 0,
            o = 1 / 0;
        for (let i = 0; i < n; i++) {
            t(i), r.applyMask(i, e);
            let n = r.getPenaltyN1(e) + r.getPenaltyN2(e) + r.getPenaltyN3(e) + r.getPenaltyN4(e);
            r.applyMask(i, e), n < o && (o = n, a = i)
        }
        return a
    }
}, 48125, (e, t, r) => {
    let n = e.r(73133),
        a = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 4, 1, 2, 4, 4, 2, 4, 4, 4, 2, 4, 6, 5, 2, 4, 6, 6, 2, 5, 8, 8, 4, 5, 8, 8, 4, 5, 8, 11, 4, 8, 10, 11, 4, 9, 12, 16, 4, 9, 16, 16, 6, 10, 12, 18, 6, 10, 17, 16, 6, 11, 16, 19, 6, 13, 18, 21, 7, 14, 21, 25, 8, 16, 20, 25, 8, 17, 23, 25, 9, 17, 23, 34, 9, 18, 25, 30, 10, 20, 27, 32, 12, 21, 29, 35, 12, 23, 34, 37, 12, 25, 34, 40, 13, 26, 35, 42, 14, 28, 38, 45, 15, 29, 40, 48, 16, 31, 43, 51, 17, 33, 45, 54, 18, 35, 48, 57, 19, 37, 51, 60, 19, 38, 53, 63, 20, 40, 56, 66, 21, 43, 59, 70, 22, 45, 62, 74, 24, 47, 65, 77, 25, 49, 68, 81],
        o = [7, 10, 13, 17, 10, 16, 22, 28, 15, 26, 36, 44, 20, 36, 52, 64, 26, 48, 72, 88, 36, 64, 96, 112, 40, 72, 108, 130, 48, 88, 132, 156, 60, 110, 160, 192, 72, 130, 192, 224, 80, 150, 224, 264, 96, 176, 260, 308, 104, 198, 288, 352, 120, 216, 320, 384, 132, 240, 360, 432, 144, 280, 408, 480, 168, 308, 448, 532, 180, 338, 504, 588, 196, 364, 546, 650, 224, 416, 600, 700, 224, 442, 644, 750, 252, 476, 690, 816, 270, 504, 750, 900, 300, 560, 810, 960, 312, 588, 870, 1050, 336, 644, 952, 1110, 360, 700, 1020, 1200, 390, 728, 1050, 1260, 420, 784, 1140, 1350, 450, 812, 1200, 1440, 480, 868, 1290, 1530, 510, 924, 1350, 1620, 540, 980, 1440, 1710, 570, 1036, 1530, 1800, 570, 1064, 1590, 1890, 600, 1120, 1680, 1980, 630, 1204, 1770, 2100, 660, 1260, 1860, 2220, 720, 1316, 1950, 2310, 750, 1372, 2040, 2430];
    r.getBlocksCount = function(e, t) {
        switch (t) {
            case n.L:
                return a[(e - 1) * 4 + 0];
            case n.M:
                return a[(e - 1) * 4 + 1];
            case n.Q:
                return a[(e - 1) * 4 + 2];
            case n.H:
                return a[(e - 1) * 4 + 3];
            default:
                return
        }
    }, r.getTotalCodewordsCount = function(e, t) {
        switch (t) {
            case n.L:
                return o[(e - 1) * 4 + 0];
            case n.M:
                return o[(e - 1) * 4 + 1];
            case n.Q:
                return o[(e - 1) * 4 + 2];
            case n.H:
                return o[(e - 1) * 4 + 3];
            default:
                return
        }
    }
}, 54232, (e, t, r) => {
    let n = new Uint8Array(512),
        a = new Uint8Array(256),
        o = 1;
    for (let e = 0; e < 255; e++) n[e] = o, a[o] = e, 256 & (o <<= 1) && (o ^= 285);
    for (let e = 255; e < 512; e++) n[e] = n[e - 255];
    r.log = function(e) {
        if (e < 1) throw Error("log(" + e + ")");
        return a[e]
    }, r.exp = function(e) {
        return n[e]
    }, r.mul = function(e, t) {
        return 0 === e || 0 === t ? 0 : n[a[e] + a[t]]
    }
}, 50677, (e, t, r) => {
    let n = e.r(54232);
    r.mul = function(e, t) {
        let r = new Uint8Array(e.length + t.length - 1);
        for (let a = 0; a < e.length; a++)
            for (let o = 0; o < t.length; o++) r[a + o] ^= n.mul(e[a], t[o]);
        return r
    }, r.mod = function(e, t) {
        let r = new Uint8Array(e);
        for (; r.length - t.length >= 0;) {
            let e = r[0];
            for (let a = 0; a < t.length; a++) r[a] ^= n.mul(t[a], e);
            let a = 0;
            for (; a < r.length && 0 === r[a];) a++;
            r = r.slice(a)
        }
        return r
    }, r.generateECPolynomial = function(e) {
        let t = new Uint8Array([1]);
        for (let a = 0; a < e; a++) t = r.mul(t, new Uint8Array([1, n.exp(a)]));
        return t
    }
}, 62458, (e, t, r) => {
    let n = e.r(50677);

    function a(e) {
        this.genPoly = void 0, this.degree = e, this.degree && this.initialize(this.degree)
    }
    a.prototype.initialize = function(e) {
        this.degree = e, this.genPoly = n.generateECPolynomial(this.degree)
    }, a.prototype.encode = function(e) {
        if (!this.genPoly) throw Error("Encoder not initialized");
        let t = new Uint8Array(e.length + this.degree);
        t.set(e);
        let r = n.mod(t, this.genPoly),
            a = this.degree - r.length;
        if (a > 0) {
            let e = new Uint8Array(this.degree);
            return e.set(r, a), e
        }
        return r
    }, t.exports = a
}, 67483, (e, t, r) => {
    r.isValid = function(e) {
        return !isNaN(e) && e >= 1 && e <= 40
    }
}, 96592, (e, t, r) => {
    let n = "[0-9]+",
        a = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+",
        o = "(?:(?![A-Z0-9 $%*+\\-./:]|" + (a = a.replace(/u/g, "\\u")) + ")(?:.|[\r\n]))+";
    r.KANJI = RegExp(a, "g"), r.BYTE_KANJI = RegExp("[^A-Z0-9 $%*+\\-./:]+", "g"), r.BYTE = RegExp(o, "g"), r.NUMERIC = RegExp(n, "g"), r.ALPHANUMERIC = RegExp("[A-Z $%*+\\-./:]+", "g");
    let i = RegExp("^" + a + "$"),
        l = RegExp("^" + n + "$"),
        s = RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    r.testKanji = function(e) {
        return i.test(e)
    }, r.testNumeric = function(e) {
        return l.test(e)
    }, r.testAlphanumeric = function(e) {
        return s.test(e)
    }
}, 50882, (e, t, r) => {
    let n = e.r(67483),
        a = e.r(96592);
    r.NUMERIC = {
        id: "Numeric",
        bit: 1,
        ccBits: [10, 12, 14]
    }, r.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 2,
        ccBits: [9, 11, 13]
    }, r.BYTE = {
        id: "Byte",
        bit: 4,
        ccBits: [8, 16, 16]
    }, r.KANJI = {
        id: "Kanji",
        bit: 8,
        ccBits: [8, 10, 12]
    }, r.MIXED = {
        bit: -1
    }, r.getCharCountIndicator = function(e, t) {
        if (!e.ccBits) throw Error("Invalid mode: " + e);
        if (!n.isValid(t)) throw Error("Invalid version: " + t);
        return t >= 1 && t < 10 ? e.ccBits[0] : t < 27 ? e.ccBits[1] : e.ccBits[2]
    }, r.getBestModeForData = function(e) {
        return a.testNumeric(e) ? r.NUMERIC : a.testAlphanumeric(e) ? r.ALPHANUMERIC : a.testKanji(e) ? r.KANJI : r.BYTE
    }, r.toString = function(e) {
        if (e && e.id) return e.id;
        throw Error("Invalid mode")
    }, r.isValid = function(e) {
        return e && e.bit && e.ccBits
    }, r.from = function(e, t) {
        if (r.isValid(e)) return e;
        try {
            if ("string" != typeof e) throw Error("Param is not a string");
            switch (e.toLowerCase()) {
                case "numeric":
                    return r.NUMERIC;
                case "alphanumeric":
                    return r.ALPHANUMERIC;
                case "kanji":
                    return r.KANJI;
                case "byte":
                    return r.BYTE;
                default:
                    throw Error("Unknown mode: " + e)
            }
        } catch (e) {
            return t
        }
    }
}, 93547, (e, t, r) => {
    let n = e.r(87201),
        a = e.r(48125),
        o = e.r(73133),
        i = e.r(50882),
        l = e.r(67483),
        s = n.getBCHDigit(7973);

    function c(e, t) {
        return i.getCharCountIndicator(e, t) + 4
    }
    r.from = function(e, t) {
        return l.isValid(e) ? parseInt(e, 10) : t
    }, r.getCapacity = function(e, t, r) {
        if (!l.isValid(e)) throw Error("Invalid QR Code version");
        void 0 === r && (r = i.BYTE);
        let o = (n.getSymbolTotalCodewords(e) - a.getTotalCodewordsCount(e, t)) * 8;
        if (r === i.MIXED) return o;
        let s = o - c(r, e);
        switch (r) {
            case i.NUMERIC:
                return Math.floor(s / 10 * 3);
            case i.ALPHANUMERIC:
                return Math.floor(s / 11 * 2);
            case i.KANJI:
                return Math.floor(s / 13);
            case i.BYTE:
            default:
                return Math.floor(s / 8)
        }
    }, r.getBestVersionForData = function(e, t) {
        let n, a = o.from(t, o.M);
        if (Array.isArray(e)) {
            if (e.length > 1) {
                for (let t = 1; t <= 40; t++)
                    if (function(e, t) {
                            let r = 0;
                            return e.forEach(function(e) {
                                let n = c(e.mode, t);
                                r += n + e.getBitsLength()
                            }), r
                        }(e, t) <= r.getCapacity(t, a, i.MIXED)) return t;
                return
            }
            if (0 === e.length) return 1;
            n = e[0]
        } else n = e;
        return function(e, t, n) {
            for (let a = 1; a <= 40; a++)
                if (t <= r.getCapacity(a, n, e)) return a
        }(n.mode, n.getLength(), a)
    }, r.getEncodedBits = function(e) {
        if (!l.isValid(e) || e < 7) throw Error("Invalid QR Code version");
        let t = e << 12;
        for (; n.getBCHDigit(t) - s >= 0;) t ^= 7973 << n.getBCHDigit(t) - s;
        return e << 12 | t
    }
}, 57655, (e, t, r) => {
    let n = e.r(87201),
        a = n.getBCHDigit(1335);
    r.getEncodedBits = function(e, t) {
        let r = e.bit << 3 | t,
            o = r << 10;
        for (; n.getBCHDigit(o) - a >= 0;) o ^= 1335 << n.getBCHDigit(o) - a;
        return (r << 10 | o) ^ 21522
    }
}, 94097, (e, t, r) => {
    let n = e.r(50882);

    function a(e) {
        this.mode = n.NUMERIC, this.data = e.toString()
    }
    a.getBitsLength = function(e) {
        return 10 * Math.floor(e / 3) + (e % 3 ? e % 3 * 3 + 1 : 0)
    }, a.prototype.getLength = function() {
        return this.data.length
    }, a.prototype.getBitsLength = function() {
        return a.getBitsLength(this.data.length)
    }, a.prototype.write = function(e) {
        let t, r;
        for (t = 0; t + 3 <= this.data.length; t += 3) r = parseInt(this.data.substr(t, 3), 10), e.put(r, 10);
        let n = this.data.length - t;
        n > 0 && (r = parseInt(this.data.substr(t), 10), e.put(r, 3 * n + 1))
    }, t.exports = a
}, 12553, (e, t, r) => {
    let n = e.r(50882),
        a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];

    function o(e) {
        this.mode = n.ALPHANUMERIC, this.data = e
    }
    o.getBitsLength = function(e) {
        return 11 * Math.floor(e / 2) + e % 2 * 6
    }, o.prototype.getLength = function() {
        return this.data.length
    }, o.prototype.getBitsLength = function() {
        return o.getBitsLength(this.data.length)
    }, o.prototype.write = function(e) {
        let t;
        for (t = 0; t + 2 <= this.data.length; t += 2) {
            let r = 45 * a.indexOf(this.data[t]);
            r += a.indexOf(this.data[t + 1]), e.put(r, 11)
        }
        this.data.length % 2 && e.put(a.indexOf(this.data[t]), 6)
    }, t.exports = o
}, 82257, (e, t, r) => {
    let n = e.r(50882);

    function a(e) {
        this.mode = n.BYTE, "string" == typeof e ? this.data = new TextEncoder().encode(e) : this.data = new Uint8Array(e)
    }
    a.getBitsLength = function(e) {
        return 8 * e
    }, a.prototype.getLength = function() {
        return this.data.length
    }, a.prototype.getBitsLength = function() {
        return a.getBitsLength(this.data.length)
    }, a.prototype.write = function(e) {
        for (let t = 0, r = this.data.length; t < r; t++) e.put(this.data[t], 8)
    }, t.exports = a
}, 22644, (e, t, r) => {
    let n = e.r(50882),
        a = e.r(87201);

    function o(e) {
        this.mode = n.KANJI, this.data = e
    }
    o.getBitsLength = function(e) {
        return 13 * e
    }, o.prototype.getLength = function() {
        return this.data.length
    }, o.prototype.getBitsLength = function() {
        return o.getBitsLength(this.data.length)
    }, o.prototype.write = function(e) {
        let t;
        for (t = 0; t < this.data.length; t++) {
            let r = a.toSJIS(this.data[t]);
            if (r >= 33088 && r <= 40956) r -= 33088;
            else if (r >= 57408 && r <= 60351) r -= 49472;
            else throw Error("Invalid SJIS character: " + this.data[t] + "\nMake sure your charset is UTF-8");
            r = (r >>> 8 & 255) * 192 + (255 & r), e.put(r, 13)
        }
    }, t.exports = o
}, 45953, (e, t, r) => {
    "use strict";
    var n = {
        single_source_shortest_paths: function(e, t, r) {
            var a, o, i, l, s, c, u, d = {},
                f = {};
            f[t] = 0;
            var h = n.PriorityQueue.make();
            for (h.push(t, 0); !h.empty();)
                for (i in o = (a = h.pop()).value, l = a.cost, s = e[o] || {}) s.hasOwnProperty(i) && (c = l + s[i], u = f[i], (void 0 === f[i] || u > c) && (f[i] = c, h.push(i, c), d[i] = o));
            if (void 0 !== r && void 0 === f[r]) throw Error(["Could not find a path from ", t, " to ", r, "."].join(""));
            return d
        },
        extract_shortest_path_from_predecessor_list: function(e, t) {
            for (var r = [], n = t; n;) r.push(n), e[n], n = e[n];
            return r.reverse(), r
        },
        find_path: function(e, t, r) {
            var a = n.single_source_shortest_paths(e, t, r);
            return n.extract_shortest_path_from_predecessor_list(a, r)
        },
        PriorityQueue: {
            make: function(e) {
                var t, r = n.PriorityQueue,
                    a = {};
                for (t in e = e || {}, r) r.hasOwnProperty(t) && (a[t] = r[t]);
                return a.queue = [], a.sorter = e.sorter || r.default_sorter, a
            },
            default_sorter: function(e, t) {
                return e.cost - t.cost
            },
            push: function(e, t) {
                this.queue.push({
                    value: e,
                    cost: t
                }), this.queue.sort(this.sorter)
            },
            pop: function() {
                return this.queue.shift()
            },
            empty: function() {
                return 0 === this.queue.length
            }
        }
    };
    t.exports = n
}, 97930, (e, t, r) => {
    let n = e.r(50882),
        a = e.r(94097),
        o = e.r(12553),
        i = e.r(82257),
        l = e.r(22644),
        s = e.r(96592),
        c = e.r(87201),
        u = e.r(45953);

    function d(e) {
        return unescape(encodeURIComponent(e)).length
    }

    function f(e, t, r) {
        let n, a = [];
        for (; null !== (n = e.exec(r));) a.push({
            data: n[0],
            index: n.index,
            mode: t,
            length: n[0].length
        });
        return a
    }

    function h(e) {
        let t, r, a = f(s.NUMERIC, n.NUMERIC, e),
            o = f(s.ALPHANUMERIC, n.ALPHANUMERIC, e);
        return c.isKanjiModeEnabled() ? (t = f(s.BYTE, n.BYTE, e), r = f(s.KANJI, n.KANJI, e)) : (t = f(s.BYTE_KANJI, n.BYTE, e), r = []), a.concat(o, t, r).sort(function(e, t) {
            return e.index - t.index
        }).map(function(e) {
            return {
                data: e.data,
                mode: e.mode,
                length: e.length
            }
        })
    }

    function g(e, t) {
        switch (t) {
            case n.NUMERIC:
                return a.getBitsLength(e);
            case n.ALPHANUMERIC:
                return o.getBitsLength(e);
            case n.KANJI:
                return l.getBitsLength(e);
            case n.BYTE:
                return i.getBitsLength(e)
        }
    }

    function p(e, t) {
        let r, s = n.getBestModeForData(e);
        if ((r = n.from(t, s)) !== n.BYTE && r.bit < s.bit) throw Error('"' + e + '" cannot be encoded with mode ' + n.toString(r) + ".\n Suggested mode is: " + n.toString(s));
        switch (r === n.KANJI && !c.isKanjiModeEnabled() && (r = n.BYTE), r) {
            case n.NUMERIC:
                return new a(e);
            case n.ALPHANUMERIC:
                return new o(e);
            case n.KANJI:
                return new l(e);
            case n.BYTE:
                return new i(e)
        }
    }
    r.fromArray = function(e) {
        return e.reduce(function(e, t) {
            return "string" == typeof t ? e.push(p(t, null)) : t.data && e.push(p(t.data, t.mode)), e
        }, [])
    }, r.fromString = function(e, t) {
        let a = function(e, t) {
                let r = {},
                    a = {
                        start: {}
                    },
                    o = ["start"];
                for (let i = 0; i < e.length; i++) {
                    let l = e[i],
                        s = [];
                    for (let e = 0; e < l.length; e++) {
                        let c = l[e],
                            u = "" + i + e;
                        s.push(u), r[u] = {
                            node: c,
                            lastCount: 0
                        }, a[u] = {};
                        for (let e = 0; e < o.length; e++) {
                            let i = o[e];
                            r[i] && r[i].node.mode === c.mode ? (a[i][u] = g(r[i].lastCount + c.length, c.mode) - g(r[i].lastCount, c.mode), r[i].lastCount += c.length) : (r[i] && (r[i].lastCount = c.length), a[i][u] = g(c.length, c.mode) + 4 + n.getCharCountIndicator(c.mode, t))
                        }
                    }
                    o = s
                }
                for (let e = 0; e < o.length; e++) a[o[e]].end = 0;
                return {
                    map: a,
                    table: r
                }
            }(function(e) {
                let t = [];
                for (let r = 0; r < e.length; r++) {
                    let a = e[r];
                    switch (a.mode) {
                        case n.NUMERIC:
                            t.push([a, {
                                data: a.data,
                                mode: n.ALPHANUMERIC,
                                length: a.length
                            }, {
                                data: a.data,
                                mode: n.BYTE,
                                length: a.length
                            }]);
                            break;
                        case n.ALPHANUMERIC:
                            t.push([a, {
                                data: a.data,
                                mode: n.BYTE,
                                length: a.length
                            }]);
                            break;
                        case n.KANJI:
                            t.push([a, {
                                data: a.data,
                                mode: n.BYTE,
                                length: d(a.data)
                            }]);
                            break;
                        case n.BYTE:
                            t.push([{
                                data: a.data,
                                mode: n.BYTE,
                                length: d(a.data)
                            }])
                    }
                }
                return t
            }(h(e, c.isKanjiModeEnabled())), t),
            o = u.find_path(a.map, "start", "end"),
            i = [];
        for (let e = 1; e < o.length - 1; e++) i.push(a.table[o[e]].node);
        return r.fromArray(i.reduce(function(e, t) {
            let r = e.length - 1 >= 0 ? e[e.length - 1] : null;
            return r && r.mode === t.mode ? e[e.length - 1].data += t.data : e.push(t), e
        }, []))
    }, r.rawSplit = function(e) {
        return r.fromArray(h(e, c.isKanjiModeEnabled()))
    }
}, 30671, (e, t, r) => {
    let n = e.r(87201),
        a = e.r(73133),
        o = e.r(73666),
        i = e.r(11421),
        l = e.r(20637),
        s = e.r(14002),
        c = e.r(37692),
        u = e.r(48125),
        d = e.r(62458),
        f = e.r(93547),
        h = e.r(57655),
        g = e.r(50882),
        p = e.r(97930);

    function m(e, t, r) {
        let n, a, o = e.size,
            i = h.getEncodedBits(t, r);
        for (n = 0; n < 15; n++) a = (i >> n & 1) == 1, n < 6 ? e.set(n, 8, a, !0) : n < 8 ? e.set(n + 1, 8, a, !0) : e.set(o - 15 + n, 8, a, !0), n < 8 ? e.set(8, o - n - 1, a, !0) : n < 9 ? e.set(8, 15 - n - 1 + 1, a, !0) : e.set(8, 15 - n - 1, a, !0);
        e.set(o - 8, 8, 1, !0)
    }
    r.create = function(e, t) {
        let r, h;
        if (void 0 === e || "" === e) throw Error("No input text");
        let x = a.M;
        return void 0 !== t && (x = a.from(t.errorCorrectionLevel, a.M), r = f.from(t.version), h = c.from(t.maskPattern), t.toSJISFunc && n.setToSJISFunction(t.toSJISFunc)),
            function(e, t, r, a) {
                let h;
                if (Array.isArray(e)) h = p.fromArray(e);
                else if ("string" == typeof e) {
                    let n = t;
                    if (!n) {
                        let t = p.rawSplit(e);
                        n = f.getBestVersionForData(t, r)
                    }
                    h = p.fromString(e, n || 40)
                } else throw Error("Invalid data");
                let x = f.getBestVersionForData(h, r);
                if (!x) throw Error("The amount of data is too big to be stored in a QR Code");
                if (t) {
                    if (t < x) throw Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + x + ".\n")
                } else t = x;
                let b = function(e, t, r) {
                        let a = new o;
                        r.forEach(function(t) {
                            a.put(t.mode.bit, 4), a.put(t.getLength(), g.getCharCountIndicator(t.mode, e)), t.write(a)
                        });
                        let i = (n.getSymbolTotalCodewords(e) - u.getTotalCodewordsCount(e, t)) * 8;
                        for (a.getLengthInBits() + 4 <= i && a.put(0, 4); a.getLengthInBits() % 8 != 0;) a.putBit(0);
                        let l = (i - a.getLengthInBits()) / 8;
                        for (let e = 0; e < l; e++) a.put(e % 2 ? 17 : 236, 8);
                        return function(e, t, r) {
                            let a, o, i = n.getSymbolTotalCodewords(t),
                                l = i - u.getTotalCodewordsCount(t, r),
                                s = u.getBlocksCount(t, r),
                                c = i % s,
                                f = s - c,
                                h = Math.floor(i / s),
                                g = Math.floor(l / s),
                                p = g + 1,
                                m = h - g,
                                x = new d(m),
                                b = 0,
                                y = Array(s),
                                w = Array(s),
                                v = 0,
                                N = new Uint8Array(e.buffer);
                            for (let e = 0; e < s; e++) {
                                let t = e < f ? g : p;
                                y[e] = N.slice(b, b + t), w[e] = x.encode(y[e]), b += t, v = Math.max(v, t)
                            }
                            let E = new Uint8Array(i),
                                M = 0;
                            for (a = 0; a < v; a++)
                                for (o = 0; o < s; o++) a < y[o].length && (E[M++] = y[o][a]);
                            for (a = 0; a < m; a++)
                                for (o = 0; o < s; o++) E[M++] = w[o][a];
                            return E
                        }(a, e, t)
                    }(t, r, h),
                    y = new i(n.getSymbolSize(t));
                ! function(e, t) {
                    let r = e.size,
                        n = s.getPositions(t);
                    for (let t = 0; t < n.length; t++) {
                        let a = n[t][0],
                            o = n[t][1];
                        for (let t = -1; t <= 7; t++)
                            if (!(a + t <= -1) && !(r <= a + t))
                                for (let n = -1; n <= 7; n++) o + n <= -1 || r <= o + n || (t >= 0 && t <= 6 && (0 === n || 6 === n) || n >= 0 && n <= 6 && (0 === t || 6 === t) || t >= 2 && t <= 4 && n >= 2 && n <= 4 ? e.set(a + t, o + n, !0, !0) : e.set(a + t, o + n, !1, !0))
                    }
                }(y, t);
                let w = y.size;
                for (let e = 8; e < w - 8; e++) {
                    let t = e % 2 == 0;
                    y.set(e, 6, t, !0), y.set(6, e, t, !0)
                }
                return ! function(e, t) {
                    let r = l.getPositions(t);
                    for (let t = 0; t < r.length; t++) {
                        let n = r[t][0],
                            a = r[t][1];
                        for (let t = -2; t <= 2; t++)
                            for (let r = -2; r <= 2; r++) - 2 === t || 2 === t || -2 === r || 2 === r || 0 === t && 0 === r ? e.set(n + t, a + r, !0, !0) : e.set(n + t, a + r, !1, !0)
                    }
                }(y, t), m(y, r, 0), t >= 7 && function(e, t) {
                    let r, n, a, o = e.size,
                        i = f.getEncodedBits(t);
                    for (let t = 0; t < 18; t++) r = Math.floor(t / 3), n = t % 3 + o - 8 - 3, a = (i >> t & 1) == 1, e.set(r, n, a, !0), e.set(n, r, a, !0)
                }(y, t), ! function(e, t) {
                    let r = e.size,
                        n = -1,
                        a = r - 1,
                        o = 7,
                        i = 0;
                    for (let l = r - 1; l > 0; l -= 2)
                        for (6 === l && l--;;) {
                            for (let r = 0; r < 2; r++)
                                if (!e.isReserved(a, l - r)) {
                                    let n = !1;
                                    i < t.length && (n = (t[i] >>> o & 1) == 1), e.set(a, l - r, n), -1 == --o && (i++, o = 7)
                                }
                            if ((a += n) < 0 || r <= a) {
                                a -= n, n = -n;
                                break
                            }
                        }
                }(y, b), isNaN(a) && (a = c.getBestMask(y, m.bind(null, y, r))), c.applyMask(a, y), m(y, r, a), {
                    modules: y,
                    version: t,
                    errorCorrectionLevel: r,
                    maskPattern: a,
                    segments: h
                }
            }(e, r, x, h)
    }
}, 25950, (e, t, r) => {
    function n(e) {
        if ("number" == typeof e && (e = e.toString()), "string" != typeof e) throw Error("Color should be defined as hex string");
        let t = e.slice().replace("#", "").split("");
        if (t.length < 3 || 5 === t.length || t.length > 8) throw Error("Invalid hex color: " + e);
        (3 === t.length || 4 === t.length) && (t = Array.prototype.concat.apply([], t.map(function(e) {
            return [e, e]
        }))), 6 === t.length && t.push("F", "F");
        let r = parseInt(t.join(""), 16);
        return {
            r: r >> 24 & 255,
            g: r >> 16 & 255,
            b: r >> 8 & 255,
            a: 255 & r,
            hex: "#" + t.slice(0, 6).join("")
        }
    }
    r.getOptions = function(e) {
        e || (e = {}), e.color || (e.color = {});
        let t = void 0 === e.margin || null === e.margin || e.margin < 0 ? 4 : e.margin,
            r = e.width && e.width >= 21 ? e.width : void 0,
            a = e.scale || 4;
        return {
            width: r,
            scale: r ? 4 : a,
            margin: t,
            color: {
                dark: n(e.color.dark || "#000000ff"),
                light: n(e.color.light || "#ffffffff")
            },
            type: e.type,
            rendererOpts: e.rendererOpts || {}
        }
    }, r.getScale = function(e, t) {
        return t.width && t.width >= e + 2 * t.margin ? t.width / (e + 2 * t.margin) : t.scale
    }, r.getImageWidth = function(e, t) {
        let n = r.getScale(e, t);
        return Math.floor((e + 2 * t.margin) * n)
    }, r.qrToImageData = function(e, t, n) {
        let a = t.modules.size,
            o = t.modules.data,
            i = r.getScale(a, n),
            l = Math.floor((a + 2 * n.margin) * i),
            s = n.margin * i,
            c = [n.color.light, n.color.dark];
        for (let t = 0; t < l; t++)
            for (let r = 0; r < l; r++) {
                let u = (t * l + r) * 4,
                    d = n.color.light;
                t >= s && r >= s && t < l - s && r < l - s && (d = c[+!!o[Math.floor((t - s) / i) * a + Math.floor((r - s) / i)]]), e[u++] = d.r, e[u++] = d.g, e[u++] = d.b, e[u] = d.a
            }
    }
}, 63037, (e, t, r) => {
    let n = e.r(25950);
    r.render = function(e, t, r) {
        var a;
        let o = r,
            i = t;
        void 0 !== o || t && t.getContext || (o = t, t = void 0), t || (i = function() {
            try {
                return document.createElement("canvas")
            } catch (e) {
                throw Error("You need to specify a canvas element")
            }
        }()), o = n.getOptions(o);
        let l = n.getImageWidth(e.modules.size, o),
            s = i.getContext("2d"),
            c = s.createImageData(l, l);
        return n.qrToImageData(c.data, e, o), a = i, s.clearRect(0, 0, a.width, a.height), a.style || (a.style = {}), a.height = l, a.width = l, a.style.height = l + "px", a.style.width = l + "px", s.putImageData(c, 0, 0), i
    }, r.renderToDataURL = function(e, t, n) {
        let a = n;
        void 0 !== a || t && t.getContext || (a = t, t = void 0), a || (a = {});
        let o = r.render(e, t, a),
            i = a.type || "image/png",
            l = a.rendererOpts || {};
        return o.toDataURL(i, l.quality)
    }
}, 10891, (e, t, r) => {
    let n = e.r(25950);

    function a(e, t) {
        let r = e.a / 255,
            n = t + '="' + e.hex + '"';
        return r < 1 ? n + " " + t + '-opacity="' + r.toFixed(2).slice(1) + '"' : n
    }

    function o(e, t, r) {
        let n = e + t;
        return void 0 !== r && (n += " " + r), n
    }
    r.render = function(e, t, r) {
        let i = n.getOptions(t),
            l = e.modules.size,
            s = e.modules.data,
            c = l + 2 * i.margin,
            u = i.color.light.a ? "<path " + a(i.color.light, "fill") + ' d="M0 0h' + c + "v" + c + 'H0z"/>' : "",
            d = "<path " + a(i.color.dark, "stroke") + ' d="' + function(e, t, r) {
                let n = "",
                    a = 0,
                    i = !1,
                    l = 0;
                for (let s = 0; s < e.length; s++) {
                    let c = Math.floor(s % t),
                        u = Math.floor(s / t);
                    c || i || (i = !0), e[s] ? (l++, s > 0 && c > 0 && e[s - 1] || (n += i ? o("M", c + r, .5 + u + r) : o("m", a, 0), a = 0, i = !1), c + 1 < t && e[s + 1] || (n += o("h", l), l = 0)) : a++
                }
                return n
            }(s, l, i.margin) + '"/>',
            f = '<svg xmlns="http://www.w3.org/2000/svg" ' + (i.width ? 'width="' + i.width + '" height="' + i.width + '" ' : "") + ('viewBox="0 0 ' + c + " ") + c + '" shape-rendering="crispEdges">' + u + d + "</svg>\n";
        return "function" == typeof r && r(null, f), f
    }
}, 73134, (e, t, r) => {
    let n = e.r(38750),
        a = e.r(30671),
        o = e.r(63037),
        i = e.r(10891);

    function l(e, t, r, o, i) {
        let l = [].slice.call(arguments, 1),
            s = l.length,
            c = "function" == typeof l[s - 1];
        if (!c && !n()) throw Error("Callback required as last argument");
        if (c) {
            if (s < 2) throw Error("Too few arguments provided");
            2 === s ? (i = r, r = t, t = o = void 0) : 3 === s && (t.getContext && void 0 === i ? (i = o, o = void 0) : (i = o, o = r, r = t, t = void 0))
        } else {
            if (s < 1) throw Error("Too few arguments provided");
            return 1 === s ? (r = t, t = o = void 0) : 2 !== s || t.getContext || (o = r, r = t, t = void 0), new Promise(function(n, i) {
                try {
                    let i = a.create(r, o);
                    n(e(i, t, o))
                } catch (e) {
                    i(e)
                }
            })
        }
        try {
            let n = a.create(r, o);
            i(null, e(n, t, o))
        } catch (e) {
            i(e)
        }
    }
    r.create = a.create, r.toCanvas = l.bind(null, o.render), r.toDataURL = l.bind(null, o.renderToDataURL), r.toString = l.bind(null, function(e, t, r) {
        return i.render(e, r)
    })
}]);