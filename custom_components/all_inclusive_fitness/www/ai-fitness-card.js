var O = globalThis,
  U =
    O.ShadowRoot &&
    (O.ShadyCSS === void 0 || O.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  z = Symbol(),
  le = new WeakMap(),
  x = class {
    constructor(e, t, s) {
      if (((this._$cssResult$ = !0), s !== z))
        throw Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead.",
        );
      ((this.cssText = e), (this.t = t));
    }
    get styleSheet() {
      let e = this.o,
        t = this.t;
      if (U && e === void 0) {
        let s = t !== void 0 && t.length === 1;
        (s && (e = le.get(t)),
          e === void 0 &&
            ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
            s && le.set(t, e)));
      }
      return e;
    }
    toString() {
      return this.cssText;
    }
  },
  ce = (n) => new x(typeof n == "string" ? n : n + "", void 0, z),
  B = (n, ...e) => {
    let t =
      n.length === 1
        ? n[0]
        : e.reduce(
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
    return new x(t, n, z);
  },
  he = (n, e) => {
    if (U)
      n.adoptedStyleSheets = e.map((t) =>
        t instanceof CSSStyleSheet ? t : t.styleSheet,
      );
    else
      for (let t of e) {
        let s = document.createElement("style"),
          i = O.litNonce;
        (i !== void 0 && s.setAttribute("nonce", i),
          (s.textContent = t.cssText),
          n.appendChild(s));
      }
  },
  j = U
    ? (n) => n
    : (n) =>
        n instanceof CSSStyleSheet
          ? ((e) => {
              let t = "";
              for (let s of e.cssRules) t += s.cssText;
              return ce(t);
            })(n)
          : n;
var {
    is: De,
    defineProperty: Le,
    getOwnPropertyDescriptor: We,
    getOwnPropertyNames: ze,
    getOwnPropertySymbols: Be,
    getPrototypeOf: je,
  } = Object,
  M = globalThis,
  de = M.trustedTypes,
  Ke = de ? de.emptyScript : "",
  Ie = M.reactiveElementPolyfillSupport,
  T = (n, e) => n,
  K = {
    toAttribute(n, e) {
      switch (e) {
        case Boolean:
          n = n ? Ke : null;
          break;
        case Object:
        case Array:
          n = n == null ? n : JSON.stringify(n);
      }
      return n;
    },
    fromAttribute(n, e) {
      let t = n;
      switch (e) {
        case Boolean:
          t = n !== null;
          break;
        case Number:
          t = n === null ? null : Number(n);
          break;
        case Object:
        case Array:
          try {
            t = JSON.parse(n);
          } catch {
            t = null;
          }
      }
      return t;
    },
  },
  pe = (n, e) => !De(n, e),
  ue = {
    attribute: !0,
    type: String,
    converter: K,
    reflect: !1,
    useDefault: !1,
    hasChanged: pe,
  };
((Symbol.metadata ??= Symbol("metadata")),
  (M.litPropertyMetadata ??= new WeakMap()));
var _ = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ??= []).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = ue) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      let s = Symbol(),
        i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && Le(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    let { get: i, set: o } = We(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(r) {
        this[t] = r;
      },
    };
    return {
      get: i,
      set(r) {
        let h = i?.call(this);
        (o?.call(this, r), this.requestUpdate(e, h, s));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    let e = je(this);
    (e.finalize(),
      e.l !== void 0 && (this.l = [...e.l]),
      (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (
      ((this.finalized = !0), this._$Ei(), this.hasOwnProperty(T("properties")))
    ) {
      let t = this.properties,
        s = [...ze(t), ...Be(t)];
      for (let i of s) this.createProperty(i, t[i]);
    }
    let e = this[Symbol.metadata];
    if (e !== null) {
      let t = litPropertyMetadata.get(e);
      if (t !== void 0) for (let [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = new Map();
    for (let [t, s] of this.elementProperties) {
      let i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    let t = [];
    if (Array.isArray(e)) {
      let s = new Set(e.flat(1 / 0).reverse());
      for (let i of s) t.unshift(j(i));
    } else e !== void 0 && t.push(j(e));
    return t;
  }
  static _$Eu(e, t) {
    let s = t.attribute;
    return s === !1
      ? void 0
      : typeof s == "string"
        ? s
        : typeof e == "string"
          ? e.toLowerCase()
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
    ((this._$ES = new Promise((e) => (this.enableUpdating = e))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      this.constructor.l?.forEach((e) => e(this)));
  }
  addController(e) {
    ((this._$EO ??= new Set()).add(e),
      this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.());
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    let e = new Map(),
      t = this.constructor.elementProperties;
    for (let s of t.keys())
      this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    let e =
      this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (he(e, this.constructor.elementStyles), e);
  }
  connectedCallback() {
    ((this.renderRoot ??= this.createRenderRoot()),
      this.enableUpdating(!0),
      this._$EO?.forEach((e) => e.hostConnected?.()));
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    let s = this.constructor.elementProperties.get(e),
      i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      let o = (
        s.converter?.toAttribute !== void 0 ? s.converter : K
      ).toAttribute(t, s.type);
      ((this._$Em = e),
        o == null ? this.removeAttribute(i) : this.setAttribute(i, o),
        (this._$Em = null));
    }
  }
  _$AK(e, t) {
    let s = this.constructor,
      i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      let o = s.getPropertyOptions(i),
        r =
          typeof o.converter == "function"
            ? { fromAttribute: o.converter }
            : o.converter?.fromAttribute !== void 0
              ? o.converter
              : K;
      this._$Em = i;
      let h = r.fromAttribute(t, o.type);
      ((this[i] = h ?? this._$Ej?.get(i) ?? h), (this._$Em = null));
    }
  }
  requestUpdate(e, t, s, i = !1, o) {
    if (e !== void 0) {
      let r = this.constructor;
      if (
        (i === !1 && (o = this[e]),
        (s ??= r.getPropertyOptions(e)),
        !(
          (s.hasChanged ?? pe)(o, t) ||
          (s.useDefault &&
            s.reflect &&
            o === this._$Ej?.get(e) &&
            !this.hasAttribute(r._$Eu(e, s)))
        ))
      )
        return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: o }, r) {
    (s &&
      !(this._$Ej ??= new Map()).has(e) &&
      (this._$Ej.set(e, r ?? t ?? this[e]), o !== !0 || r !== void 0)) ||
      (this._$AL.has(e) ||
        (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)),
      i === !0 && this._$Em !== e && (this._$Eq ??= new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    let e = this.scheduleUpdate();
    return (e != null && (await e), !this.isUpdatePending);
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
    let e = !1,
      t = this._$AL;
    try {
      ((e = this.shouldUpdate(t)),
        e
          ? (this.willUpdate(t),
            this._$EO?.forEach((s) => s.hostUpdate?.()),
            this.update(t))
          : this._$EM());
    } catch (s) {
      throw ((e = !1), this._$EM(), s);
    }
    e && this._$AE(t);
  }
  willUpdate(e) {}
  _$AE(e) {
    (this._$EO?.forEach((t) => t.hostUpdated?.()),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e));
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
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    ((this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t]))),
      this._$EM());
  }
  updated(e) {}
  firstUpdated(e) {}
};
((_.elementStyles = []),
  (_.shadowRootOptions = { mode: "open" }),
  (_[T("elementProperties")] = new Map()),
  (_[T("finalized")] = new Map()),
  Ie?.({ ReactiveElement: _ }),
  (M.reactiveElementVersions ??= []).push("2.1.2"));
var J = globalThis,
  ge = (n) => n,
  D = J.trustedTypes,
  fe = D ? D.createPolicy("lit-html", { createHTML: (n) => n }) : void 0,
  Ae = "$lit$",
  y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  we = "?" + y,
  Ve = `<${we}>`,
  b = document,
  R = () => b.createComment(""),
  H = (n) => n === null || (typeof n != "object" && typeof n != "function"),
  Q = Array.isArray,
  Fe = (n) => Q(n) || typeof n?.[Symbol.iterator] == "function",
  I = `[ 	
\f\r]`,
  k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  me = /-->/g,
  $e = />/g,
  A = RegExp(
    `>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    "g",
  ),
  _e = /'/g,
  ye = /"/g,
  be = /^(?:script|style|textarea|title)$/i,
  X =
    (n) =>
    (e, ...t) => ({ _$litType$: n, strings: e, values: t }),
  u = X(1),
  nt = X(2),
  ot = X(3),
  C = Symbol.for("lit-noChange"),
  l = Symbol.for("lit-nothing"),
  ve = new WeakMap(),
  w = b.createTreeWalker(b, 129);
function Ce(n, e) {
  if (!Q(n) || !n.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(e) : e;
}
var Ze = (n, e) => {
    let t = n.length - 1,
      s = [],
      i,
      o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "",
      r = k;
    for (let h = 0; h < t; h++) {
      let a = n[h],
        p,
        g,
        c = -1,
        d = 0;
      for (; d < a.length && ((r.lastIndex = d), (g = r.exec(a)), g !== null);)
        ((d = r.lastIndex),
          r === k
            ? g[1] === "!--"
              ? (r = me)
              : g[1] !== void 0
                ? (r = $e)
                : g[2] !== void 0
                  ? (be.test(g[2]) && (i = RegExp("</" + g[2], "g")), (r = A))
                  : g[3] !== void 0 && (r = A)
            : r === A
              ? g[0] === ">"
                ? ((r = i ?? k), (c = -1))
                : g[1] === void 0
                  ? (c = -2)
                  : ((c = r.lastIndex - g[2].length),
                    (p = g[1]),
                    (r = g[3] === void 0 ? A : g[3] === '"' ? ye : _e))
              : r === ye || r === _e
                ? (r = A)
                : r === me || r === $e
                  ? (r = k)
                  : ((r = A), (i = void 0)));
      let m = r === A && n[h + 1].startsWith("/>") ? " " : "";
      o +=
        r === k
          ? a + Ve
          : c >= 0
            ? (s.push(p), a.slice(0, c) + Ae + a.slice(c) + y + m)
            : a + y + (c === -2 ? h : m);
    }
    return [
      Ce(
        n,
        o + (n[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : ""),
      ),
      s,
    ];
  },
  N = class n {
    constructor({ strings: e, _$litType$: t }, s) {
      let i;
      this.parts = [];
      let o = 0,
        r = 0,
        h = e.length - 1,
        a = this.parts,
        [p, g] = Ze(e, t);
      if (
        ((this.el = n.createElement(p, s)),
        (w.currentNode = this.el.content),
        t === 2 || t === 3)
      ) {
        let c = this.el.content.firstChild;
        c.replaceWith(...c.childNodes);
      }
      for (; (i = w.nextNode()) !== null && a.length < h;) {
        if (i.nodeType === 1) {
          if (i.hasAttributes())
            for (let c of i.getAttributeNames())
              if (c.endsWith(Ae)) {
                let d = g[r++],
                  m = i.getAttribute(c).split(y),
                  v = /([.?@])?(.*)/.exec(d);
                (a.push({
                  type: 1,
                  index: o,
                  name: v[2],
                  strings: m,
                  ctor:
                    v[1] === "." ? F : v[1] === "?" ? Z : v[1] === "@" ? q : E,
                }),
                  i.removeAttribute(c));
              } else
                c.startsWith(y) &&
                  (a.push({ type: 6, index: o }), i.removeAttribute(c));
          if (be.test(i.tagName)) {
            let c = i.textContent.split(y),
              d = c.length - 1;
            if (d > 0) {
              i.textContent = D ? D.emptyScript : "";
              for (let m = 0; m < d; m++)
                (i.append(c[m], R()),
                  w.nextNode(),
                  a.push({ type: 2, index: ++o }));
              i.append(c[d], R());
            }
          }
        } else if (i.nodeType === 8)
          if (i.data === we) a.push({ type: 2, index: o });
          else {
            let c = -1;
            for (; (c = i.data.indexOf(y, c + 1)) !== -1;)
              (a.push({ type: 7, index: o }), (c += y.length - 1));
          }
        o++;
      }
    }
    static createElement(e, t) {
      let s = b.createElement("template");
      return ((s.innerHTML = e), s);
    }
  };
function S(n, e, t = n, s) {
  if (e === C) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl,
    o = H(e) ? void 0 : e._$litDirective$;
  return (
    i?.constructor !== o &&
      (i?._$AO?.(!1),
      o === void 0 ? (i = void 0) : ((i = new o(n)), i._$AT(n, t, s)),
      s !== void 0 ? ((t._$Co ??= [])[s] = i) : (t._$Cl = i)),
    i !== void 0 && (e = S(n, i._$AS(n, e.values), i, s)),
    e
  );
}
var V = class {
    constructor(e, t) {
      ((this._$AV = []),
        (this._$AN = void 0),
        (this._$AD = e),
        (this._$AM = t));
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(e) {
      let {
          el: { content: t },
          parts: s,
        } = this._$AD,
        i = (e?.creationScope ?? b).importNode(t, !0);
      w.currentNode = i;
      let o = w.nextNode(),
        r = 0,
        h = 0,
        a = s[0];
      for (; a !== void 0;) {
        if (r === a.index) {
          let p;
          (a.type === 2
            ? (p = new P(o, o.nextSibling, this, e))
            : a.type === 1
              ? (p = new a.ctor(o, a.name, a.strings, this, e))
              : a.type === 6 && (p = new G(o, this, e)),
            this._$AV.push(p),
            (a = s[++h]));
        }
        r !== a?.index && ((o = w.nextNode()), r++);
      }
      return ((w.currentNode = b), i);
    }
    p(e) {
      let t = 0;
      for (let s of this._$AV)
        (s !== void 0 &&
          (s.strings !== void 0
            ? (s._$AI(e, s, t), (t += s.strings.length - 2))
            : s._$AI(e[t])),
          t++);
    }
  },
  P = class n {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(e, t, s, i) {
      ((this.type = 2),
        (this._$AH = l),
        (this._$AN = void 0),
        (this._$AA = e),
        (this._$AB = t),
        (this._$AM = s),
        (this.options = i),
        (this._$Cv = i?.isConnected ?? !0));
    }
    get parentNode() {
      let e = this._$AA.parentNode,
        t = this._$AM;
      return (t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e);
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(e, t = this) {
      ((e = S(this, e, t)),
        H(e)
          ? e === l || e == null || e === ""
            ? (this._$AH !== l && this._$AR(), (this._$AH = l))
            : e !== this._$AH && e !== C && this._(e)
          : e._$litType$ !== void 0
            ? this.$(e)
            : e.nodeType !== void 0
              ? this.T(e)
              : Fe(e)
                ? this.k(e)
                : this._(e));
    }
    O(e) {
      return this._$AA.parentNode.insertBefore(e, this._$AB);
    }
    T(e) {
      this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
    }
    _(e) {
      (this._$AH !== l && H(this._$AH)
        ? (this._$AA.nextSibling.data = e)
        : this.T(b.createTextNode(e)),
        (this._$AH = e));
    }
    $(e) {
      let { values: t, _$litType$: s } = e,
        i =
          typeof s == "number"
            ? this._$AC(e)
            : (s.el === void 0 &&
                (s.el = N.createElement(Ce(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === i) this._$AH.p(t);
      else {
        let o = new V(i, this),
          r = o.u(this.options);
        (o.p(t), this.T(r), (this._$AH = o));
      }
    }
    _$AC(e) {
      let t = ve.get(e.strings);
      return (t === void 0 && ve.set(e.strings, (t = new N(e))), t);
    }
    k(e) {
      Q(this._$AH) || ((this._$AH = []), this._$AR());
      let t = this._$AH,
        s,
        i = 0;
      for (let o of e)
        (i === t.length
          ? t.push((s = new n(this.O(R()), this.O(R()), this, this.options)))
          : (s = t[i]),
          s._$AI(o),
          i++);
      i < t.length && (this._$AR(s && s._$AB.nextSibling, i), (t.length = i));
    }
    _$AR(e = this._$AA.nextSibling, t) {
      for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
        let s = ge(e).nextSibling;
        (ge(e).remove(), (e = s));
      }
    }
    setConnected(e) {
      this._$AM === void 0 && ((this._$Cv = e), this._$AP?.(e));
    }
  },
  E = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(e, t, s, i, o) {
      ((this.type = 1),
        (this._$AH = l),
        (this._$AN = void 0),
        (this.element = e),
        (this.name = t),
        (this._$AM = i),
        (this.options = o),
        s.length > 2 || s[0] !== "" || s[1] !== ""
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = l));
    }
    _$AI(e, t = this, s, i) {
      let o = this.strings,
        r = !1;
      if (o === void 0)
        ((e = S(this, e, t, 0)),
          (r = !H(e) || (e !== this._$AH && e !== C)),
          r && (this._$AH = e));
      else {
        let h = e,
          a,
          p;
        for (e = o[0], a = 0; a < o.length - 1; a++)
          ((p = S(this, h[s + a], t, a)),
            p === C && (p = this._$AH[a]),
            (r ||= !H(p) || p !== this._$AH[a]),
            p === l ? (e = l) : e !== l && (e += (p ?? "") + o[a + 1]),
            (this._$AH[a] = p));
      }
      r && !i && this.j(e);
    }
    j(e) {
      e === l
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, e ?? "");
    }
  },
  F = class extends E {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(e) {
      this.element[this.name] = e === l ? void 0 : e;
    }
  },
  Z = class extends E {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(e) {
      this.element.toggleAttribute(this.name, !!e && e !== l);
    }
  },
  q = class extends E {
    constructor(e, t, s, i, o) {
      (super(e, t, s, i, o), (this.type = 5));
    }
    _$AI(e, t = this) {
      if ((e = S(this, e, t, 0) ?? l) === C) return;
      let s = this._$AH,
        i =
          (e === l && s !== l) ||
          e.capture !== s.capture ||
          e.once !== s.once ||
          e.passive !== s.passive,
        o = e !== l && (s === l || i);
      (i && this.element.removeEventListener(this.name, this, s),
        o && this.element.addEventListener(this.name, this, e),
        (this._$AH = e));
    }
    handleEvent(e) {
      typeof this._$AH == "function"
        ? this._$AH.call(this.options?.host ?? this.element, e)
        : this._$AH.handleEvent(e);
    }
  },
  G = class {
    constructor(e, t, s) {
      ((this.element = e),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = t),
        (this.options = s));
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e) {
      S(this, e);
    }
  };
var qe = J.litHtmlPolyfillSupport;
(qe?.(N, P), (J.litHtmlVersions ??= []).push("3.3.3"));
var Se = (n, e, t) => {
  let s = t?.renderBefore ?? e,
    i = s._$litPart$;
  if (i === void 0) {
    let o = t?.renderBefore ?? null;
    s._$litPart$ = i = new P(e.insertBefore(R(), o), o, void 0, t ?? {});
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
      let e = super.createRenderRoot();
      return ((this.renderOptions.renderBefore ??= e.firstChild), e);
    }
    update(e) {
      let t = this.render();
      (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(e),
        (this._$Do = Se(t, this.renderRoot, this.renderOptions)));
    }
    connectedCallback() {
      (super.connectedCallback(), this._$Do?.setConnected(!0));
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), this._$Do?.setConnected(!1));
    }
    render() {
      return C;
    }
  };
(($._$litElement$ = !0),
  ($.finalized = !0),
  Y.litElementHydrateSupport?.({ LitElement: $ }));
var Ge = Y.litElementPolyfillSupport;
Ge?.({ LitElement: $ });
(Y.litElementVersions ??= []).push("4.2.2");
var Ee = {
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
  },
};
function f(n, e) {
  return n === "de" ? Ee.de[e] : Ee.en[e];
}
var ee = class extends $ {
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
  setConfig(e) {
    this.config = e;
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
    </div>`;
  }
  _toggle(e, t) {
    let s = this.config?.[e] !== !1;
    return u`<div class="row">
      <span class="row-label">${this._t(t)}</span>
      <ha-switch
        .checked=${s}
        @change=${(i) => this._setBoolean(e, i)}
      ></ha-switch>
    </div>`;
  }
  _titleChanged(e) {
    let t = e.target.value;
    this._update({ title: t || void 0 });
  }
  _setBoolean(e, t) {
    let s = t.target.checked;
    this._update({ [e]: s });
  }
  _update(e) {
    this.config &&
      ((this.config = { ...this.config, ...e }),
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: this.config },
          bubbles: !0,
          composed: !0,
        }),
      ));
  }
  _t(e) {
    return f(this.hass?.language ?? "en", e);
  }
};
customElements.get("ai-fitness-card-editor") ||
  customElements.define("ai-fitness-card-editor", ee);
function L(n) {
  return Math.max(0, Math.min(100, Number(n) || 0));
}
function xe(n) {
  return n === "de" ? "de-DE" : "en-GB";
}
function Te(n, e, t) {
  let s = new Date(n);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleTimeString(e, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: t,
      });
}
function ke(n, e, t) {
  let s = new Date(n);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleDateString(e, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        timeZone: t,
      });
}
function te(n, e) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: e,
  }).format(n);
}
function se(n, e) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: e,
  }).format(n);
}
function Re(n, e, t) {
  if (!n) return f(e, "noData");
  let s = te(new Date(), t).toLowerCase(),
    i = n[s] ?? [];
  return i.length
    ? i.map((o) => `${o.start}\u2013${o.end}`).join(", ")
    : f(e, "closedToday");
}
function He(n, e, t, s) {
  return u`<div class="header">
    <div>
      <div class="title">${n}</div>
      ${t ? u`<div class="subtitle">${t}</div>` : l}
    </div>
    <div class="badge ${e ? "open" : "closed"}">
      ${e ? f(s.language, "open") : f(s.language, "closed")}
    </div>
  </div>`;
}
function Ne(n, e, t, s) {
  let i = e ? e.toUpperCase() : t ? f(s.language, "noData") : "",
    o = n === null || Number.isNaN(n) ? "\u2013" : `${Math.round(n)} %`;
  return u`<div class="occupancy ${e}">
    <div class="value">${o}</div>
    <div class="level">${i}</div>
    <div class="bar">
      <span style="width:${L(n ?? 0)}%"></span>
    </div>
  </div>`;
}
function W(n, e) {
  return u`<div class="section">
    <div class="section-title">${n}</div>
    ${e}
  </div>`;
}
function ie(n, e, t, s, i) {
  return W(
    n,
    u`<div class="courses">
      ${e.slice(0, t).map((o) => Je(o, s, i))}
    </div>`,
  );
}
function Je(n, e, t) {
  let s = Te(n.start, t.locale, t.timeZone),
    i = e ? `${ke(n.start, t.locale, t.timeZone)} \xB7 ` : "",
    o =
      n.capacity && n.capacity > 0
        ? u`${Qe()}${n.booked ?? 0}/${n.capacity}`
        : l;
  return u`<div class="course">
    <div class="course-time">${i}${s}</div>
    <div class="course-name">
      ${n.name ?? ""}
      ${
        n.in_progress
          ? u`<span class="tag running"
              >${f(t.language, "running")}</span
            >`
          : l
      }
      ${n.is_full ? u`<span class="tag">${f(t.language, "full")}</span>` : l}
    </div>
    <div class="course-capacity">${o}</div>
  </div>`;
}
function Qe() {
  return u`<svg class="person" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
    ></path>
  </svg>`;
}
function Pe(n, e) {
  return u`<div class="daybars">
    ${n.map((t) => {
      let s = L(t.percentage),
        i = `${t.start}\u2013${t.end} \xB7 ${t.percentage}%${t.is_estimate ? ` (${f(e.language, "estimate")})` : ""}`;
      return u`<div
        class="daybar ${t.is_estimate ? "estimate" : ""}"
        title=${i}
      >
        <span style="height:${Math.max(4, s)}%"></span>
        <small>${t.start.slice(0, 2)}</small>
      </div>`;
    })}
  </div>`;
}
function Oe(n, e) {
  let t = [],
    s = new Date();
  for (let i = 0; i < 7; i += 1) {
    let o = new Date(s.getTime() + i * 864e5),
      r = n[te(o, e.timeZone).toUpperCase()] ?? [];
    if (!r.length) continue;
    let h = Math.round(
        r.reduce((p, g) => p + (Number(g.percentage) || 0), 0) / r.length,
      ),
      a = o.toLocaleDateString(e.locale, {
        weekday: "short",
        timeZone: e.timeZone,
      });
    t.push(u`<div class="weekrow">
        <div class="weekday">${a}</div>
        <div class="weekbar">
          <span style="width:${L(h)}%"></span>
        </div>
        <div class="weekpct">${h}%</div>
      </div>`);
  }
  return t.length ? W(f(e.language, "week"), u`<div>${t}</div>`) : l;
}
var Xe = new URL("ai-fitness-card.css", import.meta.url).href,
  ne = class extends $ {
    static {
      this.properties = { hass: { attribute: !1 }, config: { attribute: !1 } };
    }
    static getStubConfig() {
      return {};
    }
    setConfig(e) {
      this.config = {
        show_today_forecast: !0,
        show_week: !0,
        show_courses: !0,
        show_week_courses: !0,
        show_hours: !0,
        ...e,
      };
    }
    getCardSize() {
      return 8;
    }
    static getConfigElement() {
      return document.createElement("ai-fitness-card-editor");
    }
    render() {
      let e = this.hass,
        t = this.config;
      if (!e || !t) return l;
      let s = this._findOccupancyEntity(),
        i = s ? e.states[s] : void 0;
      if (!i)
        return u`${this._styleLink()}<ha-card>
          <div class="error">${f(e.language, "noSensor")}</div>
        </ha-card>`;
      let o = i.attributes,
        r = i.state === "unavailable" || i.state === "unknown",
        h = r ? null : Number(i.state),
        a = (o.occupancy_level ?? "").toLowerCase(),
        p = o.is_open === !0,
        g = t.title ?? o.studio_name ?? "",
        c = t.show_hours !== !1,
        d = {
          language: e.language,
          locale: xe(e.language),
          timeZone: e.config?.time_zone,
        },
        m = c ? Re(o.opening_hours, d.language, d.timeZone) : "",
        v = this._findCourseEntity(),
        oe = (v ? e.states[v] : void 0)?.attributes ?? {},
        re = oe.today ?? [],
        Ue = se(new Date(), d.timeZone),
        ae = (oe.week ?? []).filter(
          (Me) => se(new Date(Me.start), d.timeZone) !== Ue,
        );
      return u`${this._styleLink()}<ha-card>
        ${He(g, p, m, d)}
        ${Ne(h, a, r, d)}
        ${t.show_today_forecast !== !1 && o.forecast_today?.length ? W(f(d.language, "today"), Pe(o.forecast_today, d)) : l}
        ${t.show_courses !== !1 && re.length ? ie(f(d.language, "coursesToday"), re, 8, !1, d) : l}
        ${t.show_week !== !1 && o.forecast_week ? Oe(o.forecast_week, d) : l}
        ${t.show_week_courses !== !1 && ae.length ? ie(f(d.language, "coursesWeek"), ae, 12, !0, d) : l}
      </ha-card>`;
    }
    _findOccupancyEntity() {
      return Object.keys(this.hass?.states ?? {}).find(
        (e) =>
          e.startsWith("sensor.") &&
          !!this.hass?.states[e].attributes.forecast_week,
      );
    }
    _findCourseEntity() {
      return Object.keys(this.hass?.states ?? {}).find(
        (e) =>
          e.startsWith("sensor.") &&
          (Array.isArray(this.hass?.states[e].attributes.today) ||
            Array.isArray(this.hass?.states[e].attributes.week)),
      );
    }
    _styleLink() {
      return u`<link rel="stylesheet" href=${Xe} />`;
    }
  };
customElements.get("ai-fitness-card") ||
  customElements.define("ai-fitness-card", ne);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ai-fitness-card",
  name: "AI Fitness Card",
  description:
    "Live occupancy, opening hours and courses for all inclusive Fitness.",
});
