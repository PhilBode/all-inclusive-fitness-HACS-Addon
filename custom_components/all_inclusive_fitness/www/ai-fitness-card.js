var O = globalThis,
  U =
    O.ShadowRoot &&
    (O.ShadyCSS === void 0 || O.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  z = Symbol(),
  at = new WeakMap(),
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
        (s && (t = at.get(e)),
          t === void 0 &&
            ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
            s && at.set(e, t)));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  },
  ct = (n) => new x(typeof n == "string" ? n : n + "", void 0, z),
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
  lt = (n, t) => {
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
              return ct(e);
            })(n)
          : n;
var {
    is: Dt,
    defineProperty: Mt,
    getOwnPropertyDescriptor: Lt,
    getOwnPropertyNames: Wt,
    getOwnPropertySymbols: zt,
    getPrototypeOf: Bt,
  } = Object,
  D = globalThis,
  ht = D.trustedTypes,
  Kt = ht ? ht.emptyScript : "",
  jt = D.reactiveElementPolyfillSupport,
  k = (n, t) => n,
  j = {
    toAttribute(n, t) {
      switch (t) {
        case Boolean:
          n = n ? Kt : null;
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
  ut = (n, t) => !Dt(n, t),
  dt = {
    attribute: !0,
    type: String,
    converter: j,
    reflect: !1,
    useDefault: !1,
    hasChanged: ut,
  };
((Symbol.metadata ??= Symbol("metadata")),
  (D.litPropertyMetadata ??= new WeakMap()));
var _ = class extends HTMLElement {
  static addInitializer(t) {
    (this._$Ei(), (this.l ??= []).push(t));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(t, e = dt) {
    if (
      (e.state && (e.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0),
      this.elementProperties.set(t, e),
      !e.noAccessor)
    ) {
      let s = Symbol(),
        i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Mt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    let { get: i, set: o } = Lt(this.prototype, t) ?? {
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
    return this.elementProperties.get(t) ?? dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    let t = Bt(this);
    (t.finalize(),
      t.l !== void 0 && (this.l = [...t.l]),
      (this.elementProperties = new Map(t.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (
      ((this.finalized = !0), this._$Ei(), this.hasOwnProperty(k("properties")))
    ) {
      let e = this.properties,
        s = [...Wt(e), ...zt(e)];
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
    return (lt(t, this.constructor.elementStyles), t);
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
          (s.hasChanged ?? ut)(o, e) ||
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
  (_[k("elementProperties")] = new Map()),
  (_[k("finalized")] = new Map()),
  jt?.({ ReactiveElement: _ }),
  (D.reactiveElementVersions ??= []).push("2.1.2"));
var J = globalThis,
  pt = (n) => n,
  M = J.trustedTypes,
  gt = M ? M.createPolicy("lit-html", { createHTML: (n) => n }) : void 0,
  vt = "$lit$",
  y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  At = "?" + y,
  It = `<${At}>`,
  C = document,
  H = () => C.createComment(""),
  P = (n) => n === null || (typeof n != "object" && typeof n != "function"),
  Q = Array.isArray,
  Vt = (n) => Q(n) || typeof n?.[Symbol.iterator] == "function",
  I = `[ 	
\f\r]`,
  T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ft = /-->/g,
  mt = />/g,
  A = RegExp(
    `>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    "g",
  ),
  $t = /'/g,
  _t = /"/g,
  wt = /^(?:script|style|textarea|title)$/i,
  X =
    (n) =>
    (t, ...e) => ({ _$litType$: n, strings: t, values: e }),
  u = X(1),
  ee = X(2),
  se = X(3),
  b = Symbol.for("lit-noChange"),
  l = Symbol.for("lit-nothing"),
  yt = new WeakMap(),
  w = C.createTreeWalker(C, 129);
function Ct(n, t) {
  if (!Q(n) || !n.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return gt !== void 0 ? gt.createHTML(t) : t;
}
var Ft = (n, t) => {
    let e = n.length - 1,
      s = [],
      i,
      o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "",
      r = T;
    for (let h = 0; h < e; h++) {
      let a = n[h],
        d,
        p,
        c = -1,
        f = 0;
      for (; f < a.length && ((r.lastIndex = f), (p = r.exec(a)), p !== null); )
        ((f = r.lastIndex),
          r === T
            ? p[1] === "!--"
              ? (r = ft)
              : p[1] !== void 0
                ? (r = mt)
                : p[2] !== void 0
                  ? (wt.test(p[2]) && (i = RegExp("</" + p[2], "g")), (r = A))
                  : p[3] !== void 0 && (r = A)
            : r === A
              ? p[0] === ">"
                ? ((r = i ?? T), (c = -1))
                : p[1] === void 0
                  ? (c = -2)
                  : ((c = r.lastIndex - p[2].length),
                    (d = p[1]),
                    (r = p[3] === void 0 ? A : p[3] === '"' ? _t : $t))
              : r === _t || r === $t
                ? (r = A)
                : r === ft || r === mt
                  ? (r = T)
                  : ((r = A), (i = void 0)));
      let $ = r === A && n[h + 1].startsWith("/>") ? " " : "";
      o +=
        r === T
          ? a + It
          : c >= 0
            ? (s.push(d), a.slice(0, c) + vt + a.slice(c) + y + $)
            : a + y + (c === -2 ? h : $);
    }
    return [
      Ct(
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
        [d, p] = Ft(t, e);
      if (
        ((this.el = n.createElement(d, s)),
        (w.currentNode = this.el.content),
        e === 2 || e === 3)
      ) {
        let c = this.el.content.firstChild;
        c.replaceWith(...c.childNodes);
      }
      for (; (i = w.nextNode()) !== null && a.length < h; ) {
        if (i.nodeType === 1) {
          if (i.hasAttributes())
            for (let c of i.getAttributeNames())
              if (c.endsWith(vt)) {
                let f = p[r++],
                  $ = i.getAttribute(c).split(y),
                  v = /([.?@])?(.*)/.exec(f);
                (a.push({
                  type: 1,
                  index: o,
                  name: v[2],
                  strings: $,
                  ctor:
                    v[1] === "." ? F : v[1] === "?" ? Z : v[1] === "@" ? q : E,
                }),
                  i.removeAttribute(c));
              } else
                c.startsWith(y) &&
                  (a.push({ type: 6, index: o }), i.removeAttribute(c));
          if (wt.test(i.tagName)) {
            let c = i.textContent.split(y),
              f = c.length - 1;
            if (f > 0) {
              i.textContent = M ? M.emptyScript : "";
              for (let $ = 0; $ < f; $++)
                (i.append(c[$], H()),
                  w.nextNode(),
                  a.push({ type: 2, index: ++o }));
              i.append(c[f], H());
            }
          }
        } else if (i.nodeType === 8)
          if (i.data === At) a.push({ type: 2, index: o });
          else {
            let c = -1;
            for (; (c = i.data.indexOf(y, c + 1)) !== -1; )
              (a.push({ type: 7, index: o }), (c += y.length - 1));
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
    o = P(t) ? void 0 : t._$litDirective$;
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
      for (; a !== void 0; ) {
        if (r === a.index) {
          let d;
          (a.type === 2
            ? (d = new R(o, o.nextSibling, this, t))
            : a.type === 1
              ? (d = new a.ctor(o, a.name, a.strings, this, t))
              : a.type === 6 && (d = new G(o, this, t)),
            this._$AV.push(d),
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
  R = class n {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, s, i) {
      ((this.type = 2),
        (this._$AH = l),
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
        P(t)
          ? t === l || t == null || t === ""
            ? (this._$AH !== l && this._$AR(), (this._$AH = l))
            : t !== this._$AH && t !== b && this._(t)
          : t._$litType$ !== void 0
            ? this.$(t)
            : t.nodeType !== void 0
              ? this.T(t)
              : Vt(t)
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
      (this._$AH !== l && P(this._$AH)
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
                (s.el = N.createElement(Ct(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === i) this._$AH.p(e);
      else {
        let o = new V(i, this),
          r = o.u(this.options);
        (o.p(e), this.T(r), (this._$AH = o));
      }
    }
    _$AC(t) {
      let e = yt.get(t.strings);
      return (e === void 0 && yt.set(t.strings, (e = new N(t))), e);
    }
    k(t) {
      Q(this._$AH) || ((this._$AH = []), this._$AR());
      let e = this._$AH,
        s,
        i = 0;
      for (let o of t)
        (i === e.length
          ? e.push((s = new n(this.O(H()), this.O(H()), this, this.options)))
          : (s = e[i]),
          s._$AI(o),
          i++);
      i < e.length && (this._$AR(s && s._$AB.nextSibling, i), (e.length = i));
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
        let s = pt(t).nextSibling;
        (pt(t).remove(), (t = s));
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
        (this._$AH = l),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = i),
        (this.options = o),
        s.length > 2 || s[0] !== "" || s[1] !== ""
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = l));
    }
    _$AI(t, e = this, s, i) {
      let o = this.strings,
        r = !1;
      if (o === void 0)
        ((t = S(this, t, e, 0)),
          (r = !P(t) || (t !== this._$AH && t !== b)),
          r && (this._$AH = t));
      else {
        let h = t,
          a,
          d;
        for (t = o[0], a = 0; a < o.length - 1; a++)
          ((d = S(this, h[s + a], e, a)),
            d === b && (d = this._$AH[a]),
            (r ||= !P(d) || d !== this._$AH[a]),
            d === l ? (t = l) : t !== l && (t += (d ?? "") + o[a + 1]),
            (this._$AH[a] = d));
      }
      r && !i && this.j(t);
    }
    j(t) {
      t === l
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, t ?? "");
    }
  },
  F = class extends E {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(t) {
      this.element[this.name] = t === l ? void 0 : t;
    }
  },
  Z = class extends E {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== l);
    }
  },
  q = class extends E {
    constructor(t, e, s, i, o) {
      (super(t, e, s, i, o), (this.type = 5));
    }
    _$AI(t, e = this) {
      if ((t = S(this, t, e, 0) ?? l) === b) return;
      let s = this._$AH,
        i =
          (t === l && s !== l) ||
          t.capture !== s.capture ||
          t.once !== s.once ||
          t.passive !== s.passive,
        o = t !== l && (s === l || i);
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
var Zt = J.litHtmlPolyfillSupport;
(Zt?.(N, R), (J.litHtmlVersions ??= []).push("3.3.3"));
var bt = (n, t, e) => {
  let s = e?.renderBefore ?? t,
    i = s._$litPart$;
  if (i === void 0) {
    let o = e?.renderBefore ?? null;
    s._$litPart$ = i = new R(t.insertBefore(H(), o), o, void 0, e ?? {});
  }
  return (i._$AI(n), i);
};
var Y = globalThis,
  m = class extends _ {
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
        (this._$Do = bt(e, this.renderRoot, this.renderOptions)));
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
((m._$litElement$ = !0),
  (m.finalized = !0),
  Y.litElementHydrateSupport?.({ LitElement: m }));
var qt = Y.litElementPolyfillSupport;
qt?.({ LitElement: m });
(Y.litElementVersions ??= []).push("4.2.2");
var St = {
  de: {
    open: "Ge\xF6ffnet",
    closed: "Geschlossen",
    today: "Heute",
    week: "Woche",
    coursesToday: "Kurse & Events heute",
    coursesWeek: "Kurse & Events diese Woche",
    closedToday: "Heute geschlossen",
    noData: "Keine Daten",
    estimate: "gesch\xE4tzt",
    full: "voll",
    running: "l\xE4uft",
    editorEntity: "Auslastungs-Sensor",
    editorCourseEntity: "Kurs-Sensor (optional)",
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
    estimate: "estimated",
    full: "full",
    running: "running",
    editorEntity: "Occupancy sensor",
    editorCourseEntity: "Course sensor (optional)",
    editorTitle: "Title (optional)",
    editorToday: "Show today's utilization",
    editorWeek: "Show weekly forecast",
    editorCourses: "Show courses & events today",
    editorWeekCourses: "Show upcoming courses & events",
    editorHours: "Show opening hours",
    editorCompact: "Compact mode",
  },
};
function g(n, t) {
  return n === "de" ? St.de[t] : St.en[t];
}
var tt = class extends m {
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
    ha-formfield {
      display: block;
    }
    ha-entity-picker,
    ha-textfield {
      display: block;
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
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.entity ?? ""}
        .includeDomains=${["sensor"]}
        .label=${this._t("editorEntity")}
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>

      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.course_entity ?? ""}
        .includeDomains=${["sensor"]}
        .label=${this._t("editorCourseEntity")}
        @value-changed=${this._courseChanged}
      ></ha-entity-picker>

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
    return u`<ha-formfield .label=${this._t(e)}>
      <ha-switch
        .checked=${s}
        @change=${(i) => this._setBoolean(t, i)}
      ></ha-switch>
    </ha-formfield>`;
  }
  _entityChanged(t) {
    this._update({ entity: t.detail.value });
  }
  _courseChanged(t) {
    this._update({ course_entity: t.detail.value || void 0 });
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
    return g(this.hass?.language ?? "en", t);
  }
};
customElements.get("ai-fitness-card-editor") ||
  customElements.define("ai-fitness-card-editor", tt);
function L(n) {
  return Math.max(0, Math.min(100, Number(n) || 0));
}
function Et(n) {
  return n === "de" ? "de-DE" : "en-GB";
}
function xt(n, t, e) {
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
function Tt(n, t, e) {
  if (!n) return g(t, "noData");
  let s = et(new Date(), e).toLowerCase(),
    i = n[s] ?? [];
  return i.length
    ? i.map((o) => `${o.start}\u2013${o.end}`).join(", ")
    : g(t, "closedToday");
}
function Ht(n, t, e, s) {
  return u`<div class="header">
    <div>
      <div class="title">${n}</div>
      ${e ? u`<div class="subtitle">${e}</div>` : l}
    </div>
    <div class="badge ${t ? "open" : "closed"}">
      ${t ? g(s.language, "open") : g(s.language, "closed")}
    </div>
  </div>`;
}
function Pt(n, t, e, s) {
  let i = t ? t.toUpperCase() : e ? g(s.language, "noData") : "",
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
      ${t.slice(0, e).map((o) => Gt(o, s, i))}
    </div>`,
  );
}
function Gt(n, t, e) {
  let s = xt(n.start, e.locale, e.timeZone),
    i = t ? `${kt(n.start, e.locale, e.timeZone)} \xB7 ` : "",
    o = n.capacity && n.capacity > 0 ? `${n.booked ?? 0}/${n.capacity}` : "";
  return u`<div class="course">
    <div class="course-time">${i}${s}</div>
    <div class="course-name">
      ${n.name ?? ""}
      ${
        n.in_progress
          ? u`<span class="tag running"
              >${g(e.language, "running")}</span
            >`
          : l
      }
      ${n.is_full ? u`<span class="tag">${g(e.language, "full")}</span>` : l}
    </div>
    <div class="course-capacity">${o}</div>
  </div>`;
}
function Nt(n, t) {
  return u`<div class="daybars">
    ${n.map((e) => {
      let s = L(e.percentage),
        i = `${e.start}\u2013${e.end} \xB7 ${e.percentage}%${e.is_estimate ? ` (${g(t.language, "estimate")})` : ""}`;
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
function Rt(n, t) {
  let e = [],
    s = new Date();
  for (let i = 0; i < 7; i += 1) {
    let o = new Date(s.getTime() + i * 864e5),
      r = n[et(o, t.timeZone).toUpperCase()] ?? [];
    if (!r.length) continue;
    let h = Math.round(
        r.reduce((d, p) => d + (Number(p.percentage) || 0), 0) / r.length,
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
  return e.length ? W(g(t.language, "week"), u`<div>${e}</div>`) : l;
}
var Jt = new URL("ai-fitness-card.css?v=0.1.0", import.meta.url).href,
  nt = class extends m {
    static {
      this.properties = { hass: { attribute: !1 }, config: { attribute: !1 } };
    }
    static getStubConfig(t) {
      return {
        entity:
          Object.keys(t.states).find(
            (s) =>
              s.startsWith("sensor.") && !!t.states[s].attributes.forecast_week,
          ) ?? "",
      };
    }
    setConfig(t) {
      if (!t?.entity) throw new Error("Please define an occupancy entity.");
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
      if (!t || !e) return l;
      let s = t.states[e.entity];
      if (!s)
        return u`${this._styleLink()}<ha-card>
          <div class="error">Entity not found: ${e.entity}</div>
        </ha-card>`;
      let i = s.attributes,
        o = s.state === "unavailable" || s.state === "unknown",
        r = o ? null : Number(s.state),
        h = (i.occupancy_level ?? "").toLowerCase(),
        a = i.is_open === !0,
        d = e.title ?? i.studio_name ?? "",
        p = e.show_hours !== !1,
        c = {
          language: t.language,
          locale: Et(t.language),
          timeZone: t.config?.time_zone,
        },
        f = p ? Tt(i.opening_hours, c.language, c.timeZone) : "",
        v =
          (e.course_entity ? t.states[e.course_entity] : void 0)?.attributes ??
          {},
        ot = v.today ?? [],
        Ot = st(new Date(), c.timeZone),
        rt = (v.week ?? []).filter(
          (Ut) => st(new Date(Ut.start), c.timeZone) !== Ot,
        );
      return u`${this._styleLink()}<ha-card>
        ${Ht(d, a, f, c)}
        ${Pt(r, h, o, c)}
        ${e.show_today_forecast !== !1 && !e.compact && i.forecast_today?.length ? W(g(c.language, "today"), Nt(i.forecast_today, c)) : l}
        ${e.show_courses !== !1 && ot.length ? it(g(c.language, "coursesToday"), ot, 8, !1, c) : l}
        ${e.show_week !== !1 && i.forecast_week ? Rt(i.forecast_week, c) : l}
        ${e.show_courses !== !1 && e.show_week_courses !== !1 && rt.length && !e.compact ? it(g(c.language, "coursesWeek"), rt, 12, !0, c) : l}
      </ha-card>`;
    }
    _styleLink() {
      return u`<link rel="stylesheet" href=${Jt} />`;
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
