var U = globalThis,
  M =
    U.ShadowRoot &&
    (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  j = Symbol(),
  pe = new WeakMap(),
  k = class {
    constructor(e, t, s) {
      if (((this._$cssResult$ = !0), s !== j))
        throw Error(
          "CSSResult is not constructable. Use `unsafeCSS` or `css` instead.",
        );
      ((this.cssText = e), (this.t = t));
    }
    get styleSheet() {
      let e = this.o,
        t = this.t;
      if (M && e === void 0) {
        let s = t !== void 0 && t.length === 1;
        (s && (e = pe.get(t)),
          e === void 0 &&
            ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
            s && pe.set(t, e)));
      }
      return e;
    }
    toString() {
      return this.cssText;
    }
  },
  ge = (n) => new k(typeof n == "string" ? n : n + "", void 0, j),
  I = (n, ...e) => {
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
    return new k(t, n, j);
  },
  fe = (n, e) => {
    if (M)
      n.adoptedStyleSheets = e.map((t) =>
        t instanceof CSSStyleSheet ? t : t.styleSheet,
      );
    else
      for (let t of e) {
        let s = document.createElement("style"),
          i = U.litNonce;
        (i !== void 0 && s.setAttribute("nonce", i),
          (s.textContent = t.cssText),
          n.appendChild(s));
      }
  },
  V = M
    ? (n) => n
    : (n) =>
        n instanceof CSSStyleSheet
          ? ((e) => {
              let t = "";
              for (let s of e.cssRules) t += s.cssText;
              return ge(t);
            })(n)
          : n;
var {
    is: Ke,
    defineProperty: We,
    getOwnPropertyDescriptor: ze,
    getOwnPropertyNames: Be,
    getOwnPropertySymbols: je,
    getPrototypeOf: Ie,
  } = Object,
  L = globalThis,
  me = L.trustedTypes,
  Ve = me ? me.emptyScript : "",
  Fe = L.reactiveElementPolyfillSupport,
  x = (n, e) => n,
  F = {
    toAttribute(n, e) {
      switch (e) {
        case Boolean:
          n = n ? Ve : null;
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
  _e = (n, e) => !Ke(n, e),
  $e = {
    attribute: !0,
    type: String,
    converter: F,
    reflect: !1,
    useDefault: !1,
    hasChanged: _e,
  };
((Symbol.metadata ??= Symbol("metadata")),
  (L.litPropertyMetadata ??= new WeakMap()));
var _ = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ??= []).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = $e) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      let s = Symbol(),
        i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && We(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    let { get: i, set: o } = ze(this.prototype, e) ?? {
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
    return this.elementProperties.get(e) ?? $e;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    let e = Ie(this);
    (e.finalize(),
      e.l !== void 0 && (this.l = [...e.l]),
      (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (
      ((this.finalized = !0), this._$Ei(), this.hasOwnProperty(x("properties")))
    ) {
      let t = this.properties,
        s = [...Be(t), ...je(t)];
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
      for (let i of s) t.unshift(V(i));
    } else e !== void 0 && t.push(V(e));
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
    return (fe(e, this.constructor.elementStyles), e);
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
        s.converter?.toAttribute !== void 0 ? s.converter : F
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
              : F;
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
          (s.hasChanged ?? _e)(o, t) ||
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
  (_[x("elementProperties")] = new Map()),
  (_[x("finalized")] = new Map()),
  Fe?.({ ReactiveElement: _ }),
  (L.reactiveElementVersions ??= []).push("2.1.2"));
var Y = globalThis,
  ye = (n) => n,
  K = Y.trustedTypes,
  ve = K ? K.createPolicy("lit-html", { createHTML: (n) => n }) : void 0,
  Ee = "$lit$",
  y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  ke = "?" + y,
  Ze = `<${ke}>`,
  b = document,
  O = () => b.createComment(""),
  H = (n) => n === null || (typeof n != "object" && typeof n != "function"),
  ee = Array.isArray,
  qe = (n) => ee(n) || typeof n?.[Symbol.iterator] == "function",
  Z = `[ 	
\f\r]`,
  T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Ae = /-->/g,
  we = />/g,
  A = RegExp(
    `>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    "g",
  ),
  be = /'/g,
  Ce = /"/g,
  xe = /^(?:script|style|textarea|title)$/i,
  te =
    (n) =>
    (e, ...t) => ({ _$litType$: n, strings: e, values: t }),
  p = te(1),
  rt = te(2),
  at = te(3),
  C = Symbol.for("lit-noChange"),
  c = Symbol.for("lit-nothing"),
  Se = new WeakMap(),
  w = b.createTreeWalker(b, 129);
function Te(n, e) {
  if (!ee(n) || !n.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ve !== void 0 ? ve.createHTML(e) : e;
}
var Ge = (n, e) => {
    let t = n.length - 1,
      s = [],
      i,
      o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "",
      r = T;
    for (let h = 0; h < t; h++) {
      let a = n[h],
        d,
        u,
        l = -1,
        m = 0;
      for (; m < a.length && ((r.lastIndex = m), (u = r.exec(a)), u !== null);)
        ((m = r.lastIndex),
          r === T
            ? u[1] === "!--"
              ? (r = Ae)
              : u[1] !== void 0
                ? (r = we)
                : u[2] !== void 0
                  ? (xe.test(u[2]) && (i = RegExp("</" + u[2], "g")), (r = A))
                  : u[3] !== void 0 && (r = A)
            : r === A
              ? u[0] === ">"
                ? ((r = i ?? T), (l = -1))
                : u[1] === void 0
                  ? (l = -2)
                  : ((l = r.lastIndex - u[2].length),
                    (d = u[1]),
                    (r = u[3] === void 0 ? A : u[3] === '"' ? Ce : be))
              : r === Ce || r === be
                ? (r = A)
                : r === Ae || r === we
                  ? (r = T)
                  : ((r = A), (i = void 0)));
      let g = r === A && n[h + 1].startsWith("/>") ? " " : "";
      o +=
        r === T
          ? a + Ze
          : l >= 0
            ? (s.push(d), a.slice(0, l) + Ee + a.slice(l) + y + g)
            : a + y + (l === -2 ? h : g);
    }
    return [
      Te(
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
        [d, u] = Ge(e, t);
      if (
        ((this.el = n.createElement(d, s)),
        (w.currentNode = this.el.content),
        t === 2 || t === 3)
      ) {
        let l = this.el.content.firstChild;
        l.replaceWith(...l.childNodes);
      }
      for (; (i = w.nextNode()) !== null && a.length < h;) {
        if (i.nodeType === 1) {
          if (i.hasAttributes())
            for (let l of i.getAttributeNames())
              if (l.endsWith(Ee)) {
                let m = u[r++],
                  g = i.getAttribute(l).split(y),
                  v = /([.?@])?(.*)/.exec(m);
                (a.push({
                  type: 1,
                  index: o,
                  name: v[2],
                  strings: g,
                  ctor:
                    v[1] === "." ? G : v[1] === "?" ? J : v[1] === "@" ? Q : E,
                }),
                  i.removeAttribute(l));
              } else
                l.startsWith(y) &&
                  (a.push({ type: 6, index: o }), i.removeAttribute(l));
          if (xe.test(i.tagName)) {
            let l = i.textContent.split(y),
              m = l.length - 1;
            if (m > 0) {
              i.textContent = K ? K.emptyScript : "";
              for (let g = 0; g < m; g++)
                (i.append(l[g], O()),
                  w.nextNode(),
                  a.push({ type: 2, index: ++o }));
              i.append(l[m], O());
            }
          }
        } else if (i.nodeType === 8)
          if (i.data === ke) a.push({ type: 2, index: o });
          else {
            let l = -1;
            for (; (l = i.data.indexOf(y, l + 1)) !== -1;)
              (a.push({ type: 7, index: o }), (l += y.length - 1));
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
var q = class {
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
          let d;
          (a.type === 2
            ? (d = new R(o, o.nextSibling, this, e))
            : a.type === 1
              ? (d = new a.ctor(o, a.name, a.strings, this, e))
              : a.type === 6 && (d = new X(o, this, e)),
            this._$AV.push(d),
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
  R = class n {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(e, t, s, i) {
      ((this.type = 2),
        (this._$AH = c),
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
          ? e === c || e == null || e === ""
            ? (this._$AH !== c && this._$AR(), (this._$AH = c))
            : e !== this._$AH && e !== C && this._(e)
          : e._$litType$ !== void 0
            ? this.$(e)
            : e.nodeType !== void 0
              ? this.T(e)
              : qe(e)
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
      (this._$AH !== c && H(this._$AH)
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
                (s.el = N.createElement(Te(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === i) this._$AH.p(t);
      else {
        let o = new q(i, this),
          r = o.u(this.options);
        (o.p(t), this.T(r), (this._$AH = o));
      }
    }
    _$AC(e) {
      let t = Se.get(e.strings);
      return (t === void 0 && Se.set(e.strings, (t = new N(e))), t);
    }
    k(e) {
      ee(this._$AH) || ((this._$AH = []), this._$AR());
      let t = this._$AH,
        s,
        i = 0;
      for (let o of e)
        (i === t.length
          ? t.push((s = new n(this.O(O()), this.O(O()), this, this.options)))
          : (s = t[i]),
          s._$AI(o),
          i++);
      i < t.length && (this._$AR(s && s._$AB.nextSibling, i), (t.length = i));
    }
    _$AR(e = this._$AA.nextSibling, t) {
      for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
        let s = ye(e).nextSibling;
        (ye(e).remove(), (e = s));
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
        (this._$AH = c),
        (this._$AN = void 0),
        (this.element = e),
        (this.name = t),
        (this._$AM = i),
        (this.options = o),
        s.length > 2 || s[0] !== "" || s[1] !== ""
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = c));
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
          d;
        for (e = o[0], a = 0; a < o.length - 1; a++)
          ((d = S(this, h[s + a], t, a)),
            d === C && (d = this._$AH[a]),
            (r ||= !H(d) || d !== this._$AH[a]),
            d === c ? (e = c) : e !== c && (e += (d ?? "") + o[a + 1]),
            (this._$AH[a] = d));
      }
      r && !i && this.j(e);
    }
    j(e) {
      e === c
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, e ?? "");
    }
  },
  G = class extends E {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(e) {
      this.element[this.name] = e === c ? void 0 : e;
    }
  },
  J = class extends E {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(e) {
      this.element.toggleAttribute(this.name, !!e && e !== c);
    }
  },
  Q = class extends E {
    constructor(e, t, s, i, o) {
      (super(e, t, s, i, o), (this.type = 5));
    }
    _$AI(e, t = this) {
      if ((e = S(this, e, t, 0) ?? c) === C) return;
      let s = this._$AH,
        i =
          (e === c && s !== c) ||
          e.capture !== s.capture ||
          e.once !== s.once ||
          e.passive !== s.passive,
        o = e !== c && (s === c || i);
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
  X = class {
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
var Je = Y.litHtmlPolyfillSupport;
(Je?.(N, R), (Y.litHtmlVersions ??= []).push("3.3.3"));
var Oe = (n, e, t) => {
  let s = t?.renderBefore ?? e,
    i = s._$litPart$;
  if (i === void 0) {
    let o = t?.renderBefore ?? null;
    s._$litPart$ = i = new R(e.insertBefore(O(), o), o, void 0, t ?? {});
  }
  return (i._$AI(n), i);
};
var se = globalThis,
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
        (this._$Do = Oe(t, this.renderRoot, this.renderOptions)));
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
  se.litElementHydrateSupport?.({ LitElement: $ }));
var Qe = se.litElementPolyfillSupport;
Qe?.({ LitElement: $ });
(se.litElementVersions ??= []).push("4.2.2");
var He = {
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
    noCourses: "Keine Kurse oder Events.",
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
    noCourses: "No courses or events.",
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
  return n === "de" ? He.de[e] : He.en[e];
}
var ie = class extends $ {
  static {
    this.properties = { hass: { attribute: !1 }, config: { attribute: !1 } };
  }
  static {
    this.styles = I`
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
      ? p``
      : p`<div class="form">
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
    return p`<div class="row">
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
  customElements.define("ai-fitness-card-editor", ie);
function W(n) {
  return Math.max(0, Math.min(100, Number(n) || 0));
}
function Ne(n) {
  return n === "de" ? "de-DE" : "en-GB";
}
function Re(n, e, t) {
  let s = new Date(n);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleTimeString(e, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: t,
      });
}
function Pe(n, e, t) {
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
function ne(n, e) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: e,
  }).format(n);
}
function oe(n, e) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: e,
  }).format(n);
}
function De(n, e, t) {
  if (!n) return f(e, "noData");
  let s = ne(new Date(), t).toLowerCase(),
    i = n[s] ?? [];
  return i.length
    ? i.map((o) => `${o.start}\u2013${o.end}`).join(", ")
    : f(e, "closedToday");
}
function re(n, e, t, s) {
  return p`<div class="header">
    <div>
      <div class="title">${n}</div>
      ${t ? p`<div class="subtitle">${t}</div>` : c}
    </div>
    <div class="badge ${e ? "open" : "closed"}">
      ${e ? f(s.language, "open") : f(s.language, "closed")}
    </div>
  </div>`;
}
function ae(n, e, t, s) {
  let i = e ? e.toUpperCase() : t ? f(s.language, "noData") : "",
    o = n === null || Number.isNaN(n) ? "\u2013" : `${Math.round(n)} %`;
  return p`<div class="occupancy ${e}">
    <div class="value">${o}</div>
    <div class="level">${i}</div>
    <div class="bar">
      <span style="width:${W(n ?? 0)}%"></span>
    </div>
  </div>`;
}
function P(n, e) {
  return p`<div class="section">
    <div class="section-title">${n}</div>
    ${e}
  </div>`;
}
function D(n, e, t, s, i) {
  return P(
    n,
    p`<div class="courses">
      ${e.slice(0, t).map((o) => Xe(o, s, i))}
    </div>`,
  );
}
function Xe(n, e, t) {
  let s = Re(n.start, t.locale, t.timeZone),
    i = e ? `${Pe(n.start, t.locale, t.timeZone)} \xB7 ` : "",
    o =
      n.capacity && n.capacity > 0
        ? p`${Ye()}${n.booked ?? 0}/${n.capacity}`
        : c;
  return p`<div class="course">
    <div class="course-time">${i}${s}</div>
    <div class="course-name">
      ${n.name ?? ""}
      ${
        n.in_progress
          ? p`<span class="tag running"
              >${f(t.language, "running")}</span
            >`
          : c
      }
      ${n.is_full ? p`<span class="tag">${f(t.language, "full")}</span>` : c}
    </div>
    <div class="course-capacity">${o}</div>
  </div>`;
}
function Ye() {
  return p`<svg class="person" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
    ></path>
  </svg>`;
}
function le(n, e) {
  return p`<div class="daybars">
    ${n.map((t) => {
      let s = W(t.percentage),
        i = `${t.start}\u2013${t.end} \xB7 ${t.percentage}%${t.is_estimate ? ` (${f(e.language, "estimate")})` : ""}`;
      return p`<div
        class="daybar ${t.is_estimate ? "estimate" : ""}"
        title=${i}
      >
        <span style="height:${Math.max(4, s)}%"></span>
        <small>${t.start.slice(0, 2)}</small>
      </div>`;
    })}
  </div>`;
}
function ce(n, e) {
  let t = [],
    s = new Date();
  for (let i = 0; i < 7; i += 1) {
    let o = new Date(s.getTime() + i * 864e5),
      r = n[ne(o, e.timeZone).toUpperCase()] ?? [];
    if (!r.length) continue;
    let h = Math.round(
        r.reduce((d, u) => d + (Number(u.percentage) || 0), 0) / r.length,
      ),
      a = o.toLocaleDateString(e.locale, {
        weekday: "short",
        timeZone: e.timeZone,
      });
    t.push(p`<div class="weekrow">
        <div class="weekday">${a}</div>
        <div class="weekbar">
          <span style="width:${W(h)}%"></span>
        </div>
        <div class="weekpct">${h}%</div>
      </div>`);
  }
  return t.length ? P(f(e.language, "week"), p`<div>${t}</div>`) : c;
}
var et = new URL("ai-fitness-card.css", import.meta.url).href,
  he = class extends $ {
    constructor() {
      super(...arguments);
      this._detailOpen = !1;
    }
    static {
      this.properties = {
        hass: { attribute: !1 },
        config: { attribute: !1 },
        _detailOpen: { state: !0 },
      };
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
        ...t,
      };
    }
    getCardSize() {
      return 8;
    }
    static getConfigElement() {
      return document.createElement("ai-fitness-card-editor");
    }
    render() {
      let t = this.hass,
        s = this.config;
      if (!t || !s) return c;
      let i = this._findOccupancyEntity(),
        o = i ? t.states[i] : void 0;
      if (!o)
        return p`${this._styleLink()}<ha-card>
          <div class="error">${f(t.language, "noSensor")}</div>
        </ha-card>`;
      let r = o.attributes,
        h = o.state === "unavailable" || o.state === "unknown",
        a = h ? null : Number(o.state),
        d = (r.occupancy_level ?? "").toLowerCase(),
        u = r.is_open === !0,
        l = s.title ?? r.studio_name ?? "",
        m = s.show_hours !== !1,
        g = {
          language: t.language,
          locale: Ne(t.language),
          timeZone: t.config?.time_zone,
        },
        v = De(r.opening_hours, g.language, g.timeZone),
        Ue = m ? v : "",
        de = this._findCourseEntity(),
        ue = (de ? t.states[de] : void 0)?.attributes ?? {},
        z = ue.today ?? [],
        Me = oe(new Date(), g.timeZone),
        B = (ue.week ?? []).filter(
          (Le) => oe(new Date(Le.start), g.timeZone) !== Me,
        );
      return p`${this._styleLink()}
      <ha-card
        role="button"
        tabindex="0"
        @click=${this._openDetail}
        @keydown=${this._handleCardKey}
      >
        ${re(l, u, Ue, g)}
        ${ae(a, d, h, g)}
        ${s.show_today_forecast !== !1 && r.forecast_today?.length ? P(f(g.language, "today"), le(r.forecast_today, g)) : c}
        ${s.show_courses !== !1 && z.length ? D(f(g.language, "coursesToday"), z, 8, !1, g) : c}
        ${s.show_week !== !1 && r.forecast_week ? ce(r.forecast_week, g) : c}
        ${s.show_week_courses !== !1 && B.length ? D(f(g.language, "coursesWeek"), B, 12, !0, g) : c}
      </ha-card>
      ${this._detailOpen ? this._renderDetail(l, u, v, a, d, h, r, z, B, g) : c}`;
    }
    _renderDetail(t, s, i, o, r, h, a, d, u, l) {
      return p`<div class="detail-overlay" @click=${this._overlayClick}>
      <div class="detail-panel" role="dialog" aria-modal="true">
        <button
          class="detail-close"
          aria-label="Close"
          @click=${this._closeDetail}
        >
          ×
        </button>
        <div class="detail-grid">
          <div class="detail-left">
            ${re(t, s, i, l)}
            ${ae(o, r, h, l)}
            ${a.forecast_today?.length ? P(f(l.language, "today"), le(a.forecast_today, l)) : c}
            ${a.forecast_week ? ce(a.forecast_week, l) : c}
          </div>
          <div class="detail-right">
            ${d.length ? D(f(l.language, "coursesToday"), d, 50, !1, l) : c}
            ${u.length ? D(f(l.language, "coursesWeek"), u, 50, !0, l) : c}
            ${
              !d.length && !u.length
                ? p`<div class="empty">
                    ${f(l.language, "noCourses")}
                  </div>`
                : c
            }
          </div>
        </div>
      </div>
    </div>`;
    }
    _openDetail() {
      this._detailOpen = !0;
    }
    _closeDetail() {
      this._detailOpen = !1;
    }
    _overlayClick(t) {
      t.target === t.currentTarget && (this._detailOpen = !1);
    }
    _handleCardKey(t) {
      (t.key === "Enter" || t.key === " ") &&
        (t.preventDefault(), (this._detailOpen = !0));
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
      return p`<link rel="stylesheet" href=${et} />`;
    }
  };
customElements.get("ai-fitness-card") ||
  customElements.define("ai-fitness-card", he);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ai-fitness-card",
  name: "AI Fitness Card",
  description:
    "Live occupancy, opening hours and courses for all inclusive Fitness.",
});
