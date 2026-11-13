var O = globalThis,
  U =
    O.ShadowRoot &&
    (O.ShadyCSS === void 0 || O.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  z = Symbol(),
  ct = new WeakMap(),
  x = class {
    constructor(t, e, s) {
      if (((this._$cssResult$ = !0), s !== z))
        throw Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead.",
        );
      ((this.cssText = t), (this.t = e));
    }
    get styleSheet() {
      let t = this.o,
        e = this.t;
      if (U && t === void 0) {
        let s = e !== void 0 && e.length === 1;
        (s && (t = ct.get(e)),
          t === void 0 &&
            ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
            s && ct.set(e, t)));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  },
  lt = (n) => new x(typeof n == "string" ? n : n + "", void 0, z),
  B = (n, ...t) => {
    let e =
      n.length === 1
        ? n[0]
        : t.reduce(
            (s, i, o) =>
              s +
              ((r) => {
                if (r._$cssResult$ === !0) return r.cssText;
                if (typeof r == "number") return r;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    r +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                );
              })(i) +
              n[o + 1],
            n[0],
          );
    return new x(e, n, z);
  },
  ht = (n, t) => {
    if (U)
      n.adoptedStyleSheets = t.map((e) =>
        e instanceof CSSStyleSheet ? e : e.styleSheet,
      );
    else
      for (let e of t) {
        let s = document.createElement("style"),
          i = O.litNonce;
        (i !== void 0 && s.setAttribute("nonce", i),
          (s.textContent = e.cssText),
          n.appendChild(s));
      }
  },
  K = U
    ? (n) => n
    : (n) =>
        n instanceof CSSStyleSheet
          ? ((t) => {
              let e = "";
              for (let s of t.cssRules) e += s.cssText;
              return lt(e);
            })(n)
          : n;
var {
    is: Dt,
    defineProperty: Lt,
    getOwnPropertyDescriptor: Wt,
    getOwnPropertyNames: zt,
    getOwnPropertySymbols: Bt,
    getPrototypeOf: Kt,
  } = Object,
  M = globalThis,
  dt = M.trustedTypes,
  jt = dt ? dt.emptyScript : "",
  It = M.reactiveElementPolyfillSupport,
  T = (n, t) => n,
  j = {
    toAttribute(n, t) {
      switch (t) {
        case Boolean:
          n = n ? jt : null;
          break;
        case Object:
        case Array:
          n = n == null ? n : JSON.stringify(n);
      }
      return n;
    },
    fromAttribute(n, t) {
      let e = n;
      switch (t) {
        case Boolean:
          e = n !== null;
          break;
        case Number:
          e = n === null ? null : Number(n);
          break;
        case Object:
        case Array:
          try {
            e = JSON.parse(n);
          } catch {
            e = null;
          }
      }
      return e;
    },
  },
  pt = (n, t) => !Dt(n, t),
  ut = {
    attribute: !0,
    type: String,
    converter: j,
    reflect: !1,
    useDefault: !1,
    hasChanged: pt,
  };
((Symbol.metadata ??= Symbol("metadata")),
  (M.litPropertyMetadata ??= new WeakMap()));
var _ = class extends HTMLElement {
  static addInitializer(t) {
    (this._$Ei(), (this.l ??= []).push(t));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(t, e = ut) {
    if (
      (e.state && (e.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0),
      this.elementProperties.set(t, e),
      !e.noAccessor)
    ) {
      let s = Symbol(),
        i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Lt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    let { get: i, set: o } = Wt(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(r) {
        this[e] = r;
      },
    };
    return {
      get: i,
      set(r) {
        let h = i?.call(this);
        (o?.call(this, r), this.requestUpdate(t, h, s));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    let t = Kt(this);
    (t.finalize(),
      t.l !== void 0 && (this.l = [...t.l]),
      (this.elementProperties = new Map(t.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (
      ((this.finalized = !0), this._$Ei(), this.hasOwnProperty(T("properties")))
    ) {
      let e = this.properties,
        s = [...zt(e), ...Bt(e)];
      for (let i of s) this.createProperty(i, e[i]);
    }
    let t = this[Symbol.metadata];
    if (t !== null) {
      let e = litPropertyMetadata.get(t);
      if (e !== void 0) for (let [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = new Map();
    for (let [e, s] of this.elementProperties) {
      let i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    let e = [];
    if (Array.isArray(t)) {
      let s = new Set(t.flat(1 / 0).reverse());
      for (let i of s) e.unshift(K(i));
    } else t !== void 0 && e.push(K(t));
    return e;
  }
  static _$Eu(t, e) {
    let s = e.attribute;
    return s === !1
      ? void 0
      : typeof s == "string"
        ? s
        : typeof t == "string"
          ? t.toLowerCase()
          : void 0;
  }
  constructor() {
    (super(),
      (this._$Ep = void 0),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this._$Em = null),
      this._$Ev());
  }
  _$Ev() {
    ((this._$ES = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      this.constructor.l?.forEach((t) => t(this)));
  }
  addController(t) {
    ((this._$EO ??= new Set()).add(t),
      this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.());
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    let t = new Map(),
      e = this.constructor.elementProperties;
    for (let s of e.keys())
      this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    let t =
      this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (ht(t, this.constructor.elementStyles), t);
  }
  connectedCallback() {
    ((this.renderRoot ??= this.createRenderRoot()),
      this.enableUpdating(!0),
      this._$EO?.forEach((t) => t.hostConnected?.()));
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    let s = this.constructor.elementProperties.get(t),
      i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      let o = (
        s.converter?.toAttribute !== void 0 ? s.converter : j
      ).toAttribute(e, s.type);
      ((this._$Em = t),
        o == null ? this.removeAttribute(i) : this.setAttribute(i, o),
        (this._$Em = null));
    }
  }
  _$AK(t, e) {
    let s = this.constructor,
      i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      let o = s.getPropertyOptions(i),
        r =
          typeof o.converter == "function"
            ? { fromAttribute: o.converter }
            : o.converter?.fromAttribute !== void 0
              ? o.converter
              : j;
      this._$Em = i;
      let h = r.fromAttribute(e, o.type);
      ((this[i] = h ?? this._$Ej?.get(i) ?? h), (this._$Em = null));
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    if (t !== void 0) {
      let r = this.constructor;
      if (
        (i === !1 && (o = this[t]),
        (s ??= r.getPropertyOptions(t)),
        !(
          (s.hasChanged ?? pt)(o, e) ||
          (s.useDefault &&
            s.reflect &&
            o === this._$Ej?.get(t) &&
            !this.hasAttribute(r._$Eu(t, s)))
        ))
      )
        return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, r) {
    (s &&
      !(this._$Ej ??= new Map()).has(t) &&
      (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0)) ||
      (this._$AL.has(t) ||
        (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)),
      i === !0 && this._$Em !== t && (this._$Eq ??= new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    let t = this.scheduleUpdate();
    return (t != null && (await t), !this.isUpdatePending);
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
        for (let [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      let s = this.constructor.elementProperties;
      if (s.size > 0)
        for (let [i, o] of s) {
          let { wrapped: r } = o,
            h = this[i];
          r !== !0 ||
            this._$AL.has(i) ||
            h === void 0 ||
            this.C(i, void 0, o, h);
        }
    }
    let t = !1,
      e = this._$AL;
    try {
      ((t = this.shouldUpdate(e)),
        t
          ? (this.willUpdate(e),
            this._$EO?.forEach((s) => s.hostUpdate?.()),
            this.update(e))
          : this._$EM());
    } catch (s) {
      throw ((t = !1), this._$EM(), s);
    }
    t && this._$AE(e);
  }
  willUpdate(t) {}
  _$AE(t) {
    (this._$EO?.forEach((e) => e.hostUpdated?.()),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t));
  }
  _$EM() {
    ((this._$AL = new Map()), (this.isUpdatePending = !1));
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    ((this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e]))),
      this._$EM());
  }
  updated(t) {}
  firstUpdated(t) {}
};
((_.elementStyles = []),
  (_.shadowRootOptions = { mode: "open" }),
  (_[T("elementProperties")] = new Map()),
  (_[T("finalized")] = new Map()),
  It?.({ ReactiveElement: _ }),
  (M.reactiveElementVersions ??= []).push("2.1.2"));
var J = globalThis,
  gt = (n) => n,
  D = J.trustedTypes,
  ft = D ? D.createPolicy("lit-html", { createHTML: (n) => n }) : void 0,
  At = "$lit$",
  y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  wt = "?" + y,
  Vt = `<${wt}>`,
  C = document,
  R = () => C.createComment(""),
  H = (n) => n === null || (typeof n != "object" && typeof n != "function"),
  Q = Array.isArray,
  Ft = (n) => Q(n) || typeof n?.[Symbol.iterator] == "function",
  I = `[ 	
\f\r]`,
  k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  mt = /-->/g,
  $t = />/g,
  A = RegExp(
    `>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    "g",
  ),
  _t = /'/g,
  yt = /"/g,
  Ct = /^(?:script|style|textarea|title)$/i,
  X =
    (n) =>
    (t, ...e) => ({ _$litType$: n, strings: t, values: e }),
  u = X(1),
  ne = X(2),
  oe = X(3),
  b = Symbol.for("lit-noChange"),
  c = Symbol.for("lit-nothing"),
  vt = new WeakMap(),
  w = C.createTreeWalker(C, 129);
function bt(n, t) {
  if (!Q(n) || !n.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
var Zt = (n, t) => {
    let e = n.length - 1,
      s = [],
      i,
      o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "",
      r = k;
    for (let h = 0; h < e; h++) {
      let a = n[h],
        p,
        g,
        l = -1,
        d = 0;
      for (; d < a.length && ((r.lastIndex = d), (g = r.exec(a)), g !== null);)
        ((d = r.lastIndex),
          r === k
            ? g[1] === "!--"
              ? (r = mt)
              : g[1] !== void 0
                ? (r = $t)
                : g[2] !== void 0
                  ? (Ct.test(g[2]) && (i = RegExp("</" + g[2], "g")), (r = A))
                  : g[3] !== void 0 && (r = A)
            : r === A
              ? g[0] === ">"
                ? ((r = i ?? k), (l = -1))
                : g[1] === void 0
                  ? (l = -2)
                  : ((l = r.lastIndex - g[2].length),
                    (p = g[1]),
                    (r = g[3] === void 0 ? A : g[3] === '"' ? yt : _t))
              : r === yt || r === _t
                ? (r = A)
                : r === mt || r === $t
                  ? (r = k)
                  : ((r = A), (i = void 0)));
      let m = r === A && n[h + 1].startsWith("/>") ? " " : "";
      o +=
        r === k
          ? a + Vt
          : l >= 0
            ? (s.push(p), a.slice(0, l) + At + a.slice(l) + y + m)
            : a + y + (l === -2 ? h : m);
    }
    return [
      bt(
        n,
        o + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : ""),
      ),
      s,
    ];
  },
  N = class n {
    constructor({ strings: t, _$litType$: e }, s) {
      let i;
      this.parts = [];
      let o = 0,
        r = 0,
        h = t.length - 1,
        a = this.parts,
        [p, g] = Zt(t, e);
      if (
        ((this.el = n.createElement(p, s)),
        (w.currentNode = this.el.content),
        e === 2 || e === 3)
      ) {
        let l = this.el.content.firstChild;
        l.replaceWith(...l.childNodes);
      }
      for (; (i = w.nextNode()) !== null && a.length < h;) {
        if (i.nodeType === 1) {
          if (i.hasAttributes())
            for (let l of i.getAttributeNames())
              if (l.endsWith(At)) {
                let d = g[r++],
                  m = i.getAttribute(l).split(y),
                  v = /([.?@])?(.*)/.exec(d);
                (a.push({
                  type: 1,
                  index: o,
                  name: v[2],
                  strings: m,
                  ctor:
                    v[1] === "." ? F : v[1] === "?" ? Z : v[1] === "@" ? q : E,
                }),
                  i.removeAttribute(l));
              } else
                l.startsWith(y) &&
                  (a.push({ type: 6, index: o }), i.removeAttribute(l));
          if (Ct.test(i.tagName)) {
            let l = i.textContent.split(y),
              d = l.length - 1;
            if (d > 0) {
              i.textContent = D ? D.emptyScript : "";
              for (let m = 0; m < d; m++)
                (i.append(l[m], R()),
                  w.nextNode(),
                  a.push({ type: 2, index: ++o }));
              i.append(l[d], R());
            }
          }
        } else if (i.nodeType === 8)
          if (i.data === wt) a.push({ type: 2, index: o });
          else {
            let l = -1;
            for (; (l = i.data.indexOf(y, l + 1)) !== -1;)
              (a.push({ type: 7, index: o }), (l += y.length - 1));
          }
        o++;
      }
    }
    static createElement(t, e) {
      let s = C.createElement("template");
      return ((s.innerHTML = t), s);
    }
  };
function S(n, t, e = n, s) {
  if (t === b) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl,
    o = H(t) ? void 0 : t._$litDirective$;
  return (
    i?.constructor !== o &&
      (i?._$AO?.(!1),
      o === void 0 ? (i = void 0) : ((i = new o(n)), i._$AT(n, e, s)),
      s !== void 0 ? ((e._$Co ??= [])[s] = i) : (e._$Cl = i)),
    i !== void 0 && (t = S(n, i._$AS(n, t.values), i, s)),
    t
  );
}
var V = class {
    constructor(t, e) {
      ((this._$AV = []),
        (this._$AN = void 0),
        (this._$AD = t),
        (this._$AM = e));
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      let {
          el: { content: e },
          parts: s,
        } = this._$AD,
        i = (t?.creationScope ?? C).importNode(e, !0);
      w.currentNode = i;
      let o = w.nextNode(),
        r = 0,
        h = 0,
        a = s[0];
      for (; a !== void 0;) {
        if (r === a.index) {
          let p;
          (a.type === 2
            ? (p = new P(o, o.nextSibling, this, t))
            : a.type === 1
              ? (p = new a.ctor(o, a.name, a.strings, this, t))
              : a.type === 6 && (p = new G(o, this, t)),
            this._$AV.push(p),
            (a = s[++h]));
        }
        r !== a?.index && ((o = w.nextNode()), r++);
      }
      return ((w.currentNode = C), i);
    }
    p(t) {
      let e = 0;
      for (let s of this._$AV)
        (s !== void 0 &&
          (s.strings !== void 0
            ? (s._$AI(t, s, e), (e += s.strings.length - 2))
            : s._$AI(t[e])),
          e++);
    }
  },
  P = class n {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, s, i) {
      ((this.type = 2),
        (this._$AH = c),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = s),
        (this.options = i),
        (this._$Cv = i?.isConnected ?? !0));
    }
    get parentNode() {
      let t = this._$AA.parentNode,
        e = this._$AM;
      return (e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t);
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      ((t = S(this, t, e)),
        H(t)
          ? t === c || t == null || t === ""
            ? (this._$AH !== c && this._$AR(), (this._$AH = c))
            : t !== this._$AH && t !== b && this._(t)
          : t._$litType$ !== void 0
            ? this.$(t)
            : t.nodeType !== void 0
              ? this.T(t)
              : Ft(t)
                ? this.k(t)
                : this._(t));
    }
    O(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
    }
    _(t) {
      (this._$AH !== c && H(this._$AH)
        ? (this._$AA.nextSibling.data = t)
        : this.T(C.createTextNode(t)),
        (this._$AH = t));
    }
    $(t) {
      let { values: e, _$litType$: s } = t,
        i =
          typeof s == "number"
            ? this._$AC(t)
            : (s.el === void 0 &&
                (s.el = N.createElement(bt(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        let o = new V(i, this),
          r = o.u(this.options);
        (o.p(e), this.T(r), (this._$AH = o));
      }
    }
    _$AC(t) {
      let e = vt.get(t.strings);
      return (e === void 0 && vt.set(t.strings, (e = new N(t))), e);
    }
    k(t) {
      Q(this._$AH) || ((this._$AH = []), this._$AR());
      let e = this._$AH,
        s,
        i = 0;
      for (let o of t)
        (i === e.length
          ? e.push((s = new n(this.O(R()), this.O(R()), this, this.options)))
          : (s = e[i]),
          s._$AI(o),
          i++);
      i < e.length && (this._$AR(s && s._$AB.nextSibling, i), (e.length = i));
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t !== this._$AB;) {
        let s = gt(t).nextSibling;
        (gt(t).remove(), (t = s));
      }
    }
    setConnected(t) {
      this._$AM === void 0 && ((this._$Cv = t), this._$AP?.(t));
    }
  },
  E = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, s, i, o) {
      ((this.type = 1),
        (this._$AH = c),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = o),
        s.length > 2 || s[0] !== "" || s[1] !== ""
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = c));
    }
    _$AI(t, e = this, s, i) {
      let o = this.strings,
        r = !1;
      if (o === void 0)
        ((t = S(this, t, e, 0)),
          (r = !H(t) || (t !== this._$AH && t !== b)),
          r && (this._$AH = t));
      else {
        let h = t,
          a,
          p;
        for (t = o[0], a = 0; a < o.length - 1; a++)
          ((p = S(this, h[s + a], e, a)),
            p === b && (p = this._$AH[a]),
            (r ||= !H(p) || p !== this._$AH[a]),
            p === c ? (t = c) : t !== c && (t += (p ?? "") + o[a + 1]),
            (this._$AH[a] = p));
      }
      r && !i && this.j(t);
    }
    j(t) {
      t === c
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, t ?? "");
    }
  },
  F = class extends E {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(t) {
      this.element[this.name] = t === c ? void 0 : t;
    }
  },
  Z = class extends E {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== c);
    }
  },
  q = class extends E {
    constructor(t, e, s, i, o) {
      (super(t, e, s, i, o), (this.type = 5));
    }
    _$AI(t, e = this) {
      if ((t = S(this, t, e, 0) ?? c) === b) return;
      let s = this._$AH,
        i =
          (t === c && s !== c) ||
          t.capture !== s.capture ||
          t.once !== s.once ||
          t.passive !== s.passive,
        o = t !== c && (s === c || i);
      (i && this.element.removeEventListener(this.name, this, s),
        o && this.element.addEventListener(this.name, this, t),
        (this._$AH = t));
    }
    handleEvent(t) {
      typeof this._$AH == "function"
        ? this._$AH.call(this.options?.host ?? this.element, t)
        : this._$AH.handleEvent(t);
    }
  },
  G = class {
    constructor(t, e, s) {
      ((this.element = t),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = e),
        (this.options = s));
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      S(this, t);
    }
  };
var qt = J.litHtmlPolyfillSupport;
(qt?.(N, P), (J.litHtmlVersions ??= []).push("3.3.3"));
var St = (n, t, e) => {
  let s = e?.renderBefore ?? t,
    i = s._$litPart$;
  if (i === void 0) {
    let o = e?.renderBefore ?? null;
    s._$litPart$ = i = new P(t.insertBefore(R(), o), o, void 0, e ?? {});
  }
  return (i._$AI(n), i);
};
var Y = globalThis,
  $ = class extends _ {
    constructor() {
      (super(...arguments),
        (this.renderOptions = { host: this }),
        (this._$Do = void 0));
    }
    createRenderRoot() {
      let t = super.createRenderRoot();
      return ((this.renderOptions.renderBefore ??= t.firstChild), t);
    }
    update(t) {
      let e = this.render();
      (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(t),
        (this._$Do = St(e, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
      (super.connectedCallback(), this._$Do?.setConnected(!0));
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), this._$Do?.setConnected(!1));
    }
    render() {
      return b;
    }
  };
(($._$litElement$ = !0),
  ($.finalized = !0),
  Y.litElementHydrateSupport?.({ LitElement: $ }));
var Gt = Y.litElementPolyfillSupport;
Gt?.({ LitElement: $ });
(Y.litElementVersions ??= []).push("4.2.2");
var Et = {
  de: {
    open: "Ge\xF6ffnet",
    closed: "Geschlossen",
    today: "Heute",
    week: "Woche",
    coursesToday: "Kurse & Events heute",
    coursesWeek: "Kurse & Events diese Woche",
    closedToday: "Heute geschlossen",
    noData: "Keine Daten",
    noSensor:
      "Kein Auslastungs-Sensor gefunden. Richte zuerst die Integration ein.",
    estimate: "gesch\xE4tzt",
    full: "voll",
    running: "l\xE4uft",
    editorTitle: "Titel (optional)",
    editorToday: "Heutige Auslastung anzeigen",
    editorWeek: "Wochenprognose anzeigen",
    editorCourses: "Kurse & Events heute anzeigen",
    editorWeekCourses: "Kommende Kurse & Events anzeigen",
    editorHours: "\xD6ffnungszeiten anzeigen",
    editorCompact: "Kompaktmodus",
  },
  en: {
    open: "Open",
    closed: "Closed",
    today: "Today",
    week: "Week",
    coursesToday: "Courses & events today",
    coursesWeek: "Courses & events this week",
    closedToday: "Closed today",
    noData: "No data",
    noSensor: "No occupancy sensor found. Set up the integration first.",
    estimate: "estimated",
    full: "full",
    running: "running",
    editorTitle: "Title (optional)",
    editorToday: "Show today's utilization",
    editorWeek: "Show weekly forecast",
    editorCourses: "Show courses & events today",
    editorWeekCourses: "Show upcoming courses & events",
    editorHours: "Show opening hours",
    editorCompact: "Compact mode",
  },
};
function f(n, t) {
  return n === "de" ? Et.de[t] : Et.en[t];
}
var tt = class extends $ {
  static {
    this.properties = { hass: { attribute: !1 }, config: { attribute: !1 } };
  }
  static {
    this.styles = B`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    ha-textfield {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 40px;
    }
    .row-label {
      flex: 1;
    }
  `;
  }
  setConfig(t) {
    this.config = t;
  }
  render() {
    return !this.hass || !this.config
      ? u``
      : u`<div class="form">
      <ha-textfield
        .value=${this.config.title ?? ""}
        .label=${this._t("editorTitle")}
        @input=${this._titleChanged}
      ></ha-textfield>

      ${this._toggle("show_today_forecast", "editorToday")}
      ${this._toggle("show_week", "editorWeek")}
      ${this._toggle("show_courses", "editorCourses")}
      ${this._toggle("show_week_courses", "editorWeekCourses")}
      ${this._toggle("show_hours", "editorHours")}
      ${this._toggle("compact", "editorCompact")}
    </div>`;
  }
  _toggle(t, e) {
    let s =
      t === "compact" ? this.config?.compact === !0 : this.config?.[t] !== !1;
    return u`<div class="row">
      <span class="row-label">${this._t(e)}</span>
      <ha-switch
        .checked=${s}
        @change=${(i) => this._setBoolean(t, i)}
      ></ha-switch>
    </div>`;
  }
  _titleChanged(t) {
    let e = t.target.value;
    this._update({ title: e || void 0 });
  }
  _setBoolean(t, e) {
    let s = e.target.checked;
    this._update({ [t]: s });
  }
  _update(t) {
    this.config &&
      ((this.config = { ...this.config, ...t }),
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this.config },
          bubbles: !0,
          composed: !0,
        }),
      ));
  }
  _t(t) {
    return f(this.hass?.language ?? "en", t);
  }
};
customElements.get("ai-fitness-card-editor") ||
  customElements.define("ai-fitness-card-editor", tt);
function L(n) {
  return Math.max(0, Math.min(100, Number(n) || 0));
}
function xt(n) {
  return n === "de" ? "de-DE" : "en-GB";
}
function Tt(n, t, e) {
  let s = new Date(n);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleTimeString(t, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: e,
      });
}
function kt(n, t, e) {
  let s = new Date(n);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleDateString(t, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        timeZone: e,
      });
}
function et(n, t) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: t,
  }).format(n);
}
function st(n, t) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: t,
  }).format(n);
}
function Rt(n, t, e) {
  if (!n) return f(t, "noData");
  let s = et(new Date(), e).toLowerCase(),
    i = n[s] ?? [];
  return i.length
    ? i.map((o) => `${o.start}\u2013${o.end}`).join(", ")
    : f(t, "closedToday");
}
function Ht(n, t, e, s) {
  return u`<div class="header">
    <div>
      <div class="title">${n}</div>
      ${e ? u`<div class="subtitle">${e}</div>` : c}
    </div>
    <div class="badge ${t ? "open" : "closed"}">
      ${t ? f(s.language, "open") : f(s.language, "closed")}
    </div>
  </div>`;
}
function Nt(n, t, e, s) {
  let i = t ? t.toUpperCase() : e ? f(s.language, "noData") : "",
    o = n === null || Number.isNaN(n) ? "\u2013" : `${Math.round(n)} %`;
  return u`<div class="occupancy ${t}">
    <div class="value">${o}</div>
    <div class="level">${i}</div>
    <div class="bar">
      <span style="width:${L(n ?? 0)}%"></span>
    </div>
  </div>`;
}
function W(n, t) {
  return u`<div class="section">
    <div class="section-title">${n}</div>
    ${t}
  </div>`;
}
function it(n, t, e, s, i) {
  return W(
    n,
    u`<div class="courses">
      ${t.slice(0, e).map((o) => Jt(o, s, i))}
    </div>`,
  );
}
function Jt(n, t, e) {
  let s = Tt(n.start, e.locale, e.timeZone),
    i = t ? `${kt(n.start, e.locale, e.timeZone)} \xB7 ` : "",
    o =
      n.capacity && n.capacity > 0
        ? u`${Qt()}${n.booked ?? 0}/${n.capacity}`
        : c;
  return u`<div class="course">
    <div class="course-time">${i}${s}</div>
    <div class="course-name">
      ${n.name ?? ""}
      ${
        n.in_progress
          ? u`<span class="tag running"
              >${f(e.language, "running")}</span
            >`
          : c
      }
      ${n.is_full ? u`<span class="tag">${f(e.language, "full")}</span>` : c}
    </div>
    <div class="course-capacity">${o}</div>
  </div>`;
}
function Qt() {
  return u`<svg class="person" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
    ></path>
  </svg>`;
}
function Pt(n, t) {
  return u`<div class="daybars">
    ${n.map((e) => {
      let s = L(e.percentage),
        i = `${e.start}\u2013${e.end} \xB7 ${e.percentage}%${e.is_estimate ? ` (${f(t.language, "estimate")})` : ""}`;
      return u`<div
        class="daybar ${e.is_estimate ? "estimate" : ""}"
        title=${i}
      >
        <span style="height:${Math.max(4, s)}%"></span>
        <small>${e.start.slice(0, 2)}</small>
      </div>`;
    })}
  </div>`;
}
function Ot(n, t) {
  let e = [],
    s = new Date();
  for (let i = 0; i < 7; i += 1) {
    let o = new Date(s.getTime() + i * 864e5),
      r = n[et(o, t.timeZone).toUpperCase()] ?? [];
    if (!r.length) continue;
    let h = Math.round(
        r.reduce((p, g) => p + (Number(g.percentage) || 0), 0) / r.length,
      ),
      a = o.toLocaleDateString(t.locale, {
        weekday: "short",
        timeZone: t.timeZone,
      });
    e.push(u`<div class="weekrow">
        <div class="weekday">${a}</div>
        <div class="weekbar">
          <span style="width:${L(h)}%"></span>
        </div>
        <div class="weekpct">${h}%</div>
      </div>`);
  }
  return e.length ? W(f(t.language, "week"), u`<div>${e}</div>`) : c;
}
var Xt = new URL("ai-fitness-card.css", import.meta.url).href,
  nt = class extends $ {
    static {
      this.properties = { hass: { attribute: !1 }, config: { attribute: !1 } };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(t) {
      this.config = {
        show_today_forecast: !0,
        show_week: !0,
        show_courses: !0,
        show_week_courses: !0,
        show_hours: !0,
        compact: !1,
        ...t,
      };
    }
    getCardSize() {
      return this.config?.compact ? 4 : 8;
    }
    static getConfigElement() {
      return document.createElement("ai-fitness-card-editor");
    }
    render() {
      let t = this.hass,
        e = this.config;
      if (!t || !e) return c;
      let s = this._findOccupancyEntity(),
        i = s ? t.states[s] : void 0;
      if (!i)
        return u`${this._styleLink()}<ha-card>
          <div class="error">${f(t.language, "noSensor")}</div>
        </ha-card>`;
      let o = i.attributes,
        r = i.state === "unavailable" || i.state === "unknown",
        h = r ? null : Number(i.state),
        a = (o.occupancy_level ?? "").toLowerCase(),
        p = o.is_open === !0,
        g = e.title ?? o.studio_name ?? "",
        l = e.show_hours !== !1,
        d = {
          language: t.language,
          locale: xt(t.language),
          timeZone: t.config?.time_zone,
        },
        m = l ? Rt(o.opening_hours, d.language, d.timeZone) : "",
        v = this._findCourseEntity(),
        ot = (v ? t.states[v] : void 0)?.attributes ?? {},
        rt = ot.today ?? [],
        Ut = st(new Date(), d.timeZone),
        at = (ot.week ?? []).filter(
          (Mt) => st(new Date(Mt.start), d.timeZone) !== Ut,
        );
      return u`${this._styleLink()}<ha-card>
        ${Ht(g, p, m, d)}
        ${Nt(h, a, r, d)}
        ${e.show_today_forecast !== !1 && !e.compact && o.forecast_today?.length ? W(f(d.language, "today"), Pt(o.forecast_today, d)) : c}
        ${e.show_courses !== !1 && rt.length ? it(f(d.language, "coursesToday"), rt, 8, !1, d) : c}
        ${e.show_week !== !1 && o.forecast_week ? Ot(o.forecast_week, d) : c}
        ${e.show_courses !== !1 && e.show_week_courses !== !1 && at.length && !e.compact ? it(f(d.language, "coursesWeek"), at, 12, !0, d) : c}
      </ha-card>`;
    }
    _findOccupancyEntity() {
      return Object.keys(this.hass?.states ?? {}).find(
        (t) =>
          t.startsWith("sensor.") &&
          !!this.hass?.states[t].attributes.forecast_week,
      );
    }
    _findCourseEntity() {
      return Object.keys(this.hass?.states ?? {}).find(
        (t) =>
          t.startsWith("sensor.") &&
          (Array.isArray(this.hass?.states[t].attributes.today) ||
            Array.isArray(this.hass?.states[t].attributes.week)),
      );
    }
    _styleLink() {
      return u`<link rel="stylesheet" href=${Xt} />`;
    }
  };
customElements.get("ai-fitness-card") ||
  customElements.define("ai-fitness-card", nt);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ai-fitness-card",
  name: "AI Fitness Card",
  description:
    "Live occupancy, opening hours and courses for all inclusive Fitness.",
});
