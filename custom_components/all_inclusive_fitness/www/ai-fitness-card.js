var U = globalThis,
  M =
    U.ShadowRoot &&
    (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) &&
    "adoptedStyleSheets" in Document.prototype &&
    "replace" in CSSStyleSheet.prototype,
  j = Symbol(),
  ue = new WeakMap(),
  x = class {
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
        (s && (e = ue.get(t)),
          e === void 0 &&
            ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText),
            s && ue.set(t, e)));
      }
      return e;
    }
    toString() {
      return this.cssText;
    }
  },
  pe = (i) => new x(typeof i == "string" ? i : i + "", void 0, j),
  I = (i, ...e) => {
    let t =
      i.length === 1
        ? i[0]
        : e.reduce(
            (s, n, o) =>
              s +
              ((r) => {
                if (r._$cssResult$ === !0) return r.cssText;
                if (typeof r == "number") return r;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    r +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                );
              })(n) +
              i[o + 1],
            i[0],
          );
    return new x(t, i, j);
  },
  ge = (i, e) => {
    if (M)
      i.adoptedStyleSheets = e.map((t) =>
        t instanceof CSSStyleSheet ? t : t.styleSheet,
      );
    else
      for (let t of e) {
        let s = document.createElement("style"),
          n = U.litNonce;
        (n !== void 0 && s.setAttribute("nonce", n),
          (s.textContent = t.cssText),
          i.appendChild(s));
      }
  },
  V = M
    ? (i) => i
    : (i) =>
        i instanceof CSSStyleSheet
          ? ((e) => {
              let t = "";
              for (let s of e.cssRules) t += s.cssText;
              return pe(t);
            })(i)
          : i;
var {
    is: We,
    defineProperty: ze,
    getOwnPropertyDescriptor: Be,
    getOwnPropertyNames: je,
    getOwnPropertySymbols: Ie,
    getPrototypeOf: Ve,
  } = Object,
  L = globalThis,
  fe = L.trustedTypes,
  Fe = fe ? fe.emptyScript : "",
  Ze = L.reactiveElementPolyfillSupport,
  k = (i, e) => i,
  F = {
    toAttribute(i, e) {
      switch (e) {
        case Boolean:
          i = i ? Fe : null;
          break;
        case Object:
        case Array:
          i = i == null ? i : JSON.stringify(i);
      }
      return i;
    },
    fromAttribute(i, e) {
      let t = i;
      switch (e) {
        case Boolean:
          t = i !== null;
          break;
        case Number:
          t = i === null ? null : Number(i);
          break;
        case Object:
        case Array:
          try {
            t = JSON.parse(i);
          } catch {
            t = null;
          }
      }
      return t;
    },
  },
  $e = (i, e) => !We(i, e),
  me = {
    attribute: !0,
    type: String,
    converter: F,
    reflect: !1,
    useDefault: !1,
    hasChanged: $e,
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
  static createProperty(e, t = me) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      let s = Symbol(),
        n = this.getPropertyDescriptor(e, s, t);
      n !== void 0 && ze(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    let { get: n, set: o } = Be(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(r) {
        this[t] = r;
      },
    };
    return {
      get: n,
      set(r) {
        let h = n?.call(this);
        (o?.call(this, r), this.requestUpdate(e, h, s));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? me;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    let e = Ve(this);
    (e.finalize(),
      e.l !== void 0 && (this.l = [...e.l]),
      (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (
      ((this.finalized = !0), this._$Ei(), this.hasOwnProperty(k("properties")))
    ) {
      let t = this.properties,
        s = [...je(t), ...Ie(t)];
      for (let n of s) this.createProperty(n, t[n]);
    }
    let e = this[Symbol.metadata];
    if (e !== null) {
      let t = litPropertyMetadata.get(e);
      if (t !== void 0) for (let [s, n] of t) this.elementProperties.set(s, n);
    }
    this._$Eh = new Map();
    for (let [t, s] of this.elementProperties) {
      let n = this._$Eu(t, s);
      n !== void 0 && this._$Eh.set(n, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    let t = [];
    if (Array.isArray(e)) {
      let s = new Set(e.flat(1 / 0).reverse());
      for (let n of s) t.unshift(V(n));
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
    return (ge(e, this.constructor.elementStyles), e);
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
      n = this.constructor._$Eu(e, s);
    if (n !== void 0 && s.reflect === !0) {
      let o = (
        s.converter?.toAttribute !== void 0 ? s.converter : F
      ).toAttribute(t, s.type);
      ((this._$Em = e),
        o == null ? this.removeAttribute(n) : this.setAttribute(n, o),
        (this._$Em = null));
    }
  }
  _$AK(e, t) {
    let s = this.constructor,
      n = s._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      let o = s.getPropertyOptions(n),
        r =
          typeof o.converter == "function"
            ? { fromAttribute: o.converter }
            : o.converter?.fromAttribute !== void 0
              ? o.converter
              : F;
      this._$Em = n;
      let h = r.fromAttribute(t, o.type);
      ((this[n] = h ?? this._$Ej?.get(n) ?? h), (this._$Em = null));
    }
  }
  requestUpdate(e, t, s, n = !1, o) {
    if (e !== void 0) {
      let r = this.constructor;
      if (
        (n === !1 && (o = this[e]),
        (s ??= r.getPropertyOptions(e)),
        !(
          (s.hasChanged ?? $e)(o, t) ||
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
  C(e, t, { useDefault: s, reflect: n, wrapped: o }, r) {
    (s &&
      !(this._$Ej ??= new Map()).has(e) &&
      (this._$Ej.set(e, r ?? t ?? this[e]), o !== !0 || r !== void 0)) ||
      (this._$AL.has(e) ||
        (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)),
      n === !0 && this._$Em !== e && (this._$Eq ??= new Set()).add(e));
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
        for (let [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      let s = this.constructor.elementProperties;
      if (s.size > 0)
        for (let [n, o] of s) {
          let { wrapped: r } = o,
            h = this[n];
          r !== !0 ||
            this._$AL.has(n) ||
            h === void 0 ||
            this.C(n, void 0, o, h);
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
  (_[k("elementProperties")] = new Map()),
  (_[k("finalized")] = new Map()),
  Ze?.({ ReactiveElement: _ }),
  (L.reactiveElementVersions ??= []).push("2.1.2"));
var Y = globalThis,
  _e = (i) => i,
  K = Y.trustedTypes,
  ye = K ? K.createPolicy("lit-html", { createHTML: (i) => i }) : void 0,
  Se = "$lit$",
  y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Ee = "?" + y,
  qe = `<${Ee}>`,
  b = document,
  O = () => b.createComment(""),
  R = (i) => i === null || (typeof i != "object" && typeof i != "function"),
  ee = Array.isArray,
  Ge = (i) => ee(i) || typeof i?.[Symbol.iterator] == "function",
  Z = `[ 	
\f\r]`,
  T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ve = /-->/g,
  Ae = />/g,
  A = RegExp(
    `>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    "g",
  ),
  we = /'/g,
  be = /"/g,
  xe = /^(?:script|style|textarea|title)$/i,
  te =
    (i) =>
    (e, ...t) => ({ _$litType$: i, strings: e, values: t }),
  u = te(1),
  at = te(2),
  lt = te(3),
  C = Symbol.for("lit-noChange"),
  c = Symbol.for("lit-nothing"),
  Ce = new WeakMap(),
  w = b.createTreeWalker(b, 129);
function ke(i, e) {
  if (!ee(i) || !i.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ye !== void 0 ? ye.createHTML(e) : e;
}
var Je = (i, e) => {
    let t = i.length - 1,
      s = [],
      n,
      o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "",
      r = T;
    for (let h = 0; h < t; h++) {
      let a = i[h],
        d,
        p,
        l = -1,
        m = 0;
      for (; m < a.length && ((r.lastIndex = m), (p = r.exec(a)), p !== null);)
        ((m = r.lastIndex),
          r === T
            ? p[1] === "!--"
              ? (r = ve)
              : p[1] !== void 0
                ? (r = Ae)
                : p[2] !== void 0
                  ? (xe.test(p[2]) && (n = RegExp("</" + p[2], "g")), (r = A))
                  : p[3] !== void 0 && (r = A)
            : r === A
              ? p[0] === ">"
                ? ((r = n ?? T), (l = -1))
                : p[1] === void 0
                  ? (l = -2)
                  : ((l = r.lastIndex - p[2].length),
                    (d = p[1]),
                    (r = p[3] === void 0 ? A : p[3] === '"' ? be : we))
              : r === be || r === we
                ? (r = A)
                : r === ve || r === Ae
                  ? (r = T)
                  : ((r = A), (n = void 0)));
      let f = r === A && i[h + 1].startsWith("/>") ? " " : "";
      o +=
        r === T
          ? a + qe
          : l >= 0
            ? (s.push(d), a.slice(0, l) + Se + a.slice(l) + y + f)
            : a + y + (l === -2 ? h : f);
    }
    return [
      ke(
        i,
        o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : ""),
      ),
      s,
    ];
  },
  H = class i {
    constructor({ strings: e, _$litType$: t }, s) {
      let n;
      this.parts = [];
      let o = 0,
        r = 0,
        h = e.length - 1,
        a = this.parts,
        [d, p] = Je(e, t);
      if (
        ((this.el = i.createElement(d, s)),
        (w.currentNode = this.el.content),
        t === 2 || t === 3)
      ) {
        let l = this.el.content.firstChild;
        l.replaceWith(...l.childNodes);
      }
      for (; (n = w.nextNode()) !== null && a.length < h;) {
        if (n.nodeType === 1) {
          if (n.hasAttributes())
            for (let l of n.getAttributeNames())
              if (l.endsWith(Se)) {
                let m = p[r++],
                  f = n.getAttribute(l).split(y),
                  v = /([.?@])?(.*)/.exec(m);
                (a.push({
                  type: 1,
                  index: o,
                  name: v[2],
                  strings: f,
                  ctor:
                    v[1] === "." ? G : v[1] === "?" ? J : v[1] === "@" ? Q : E,
                }),
                  n.removeAttribute(l));
              } else
                l.startsWith(y) &&
                  (a.push({ type: 6, index: o }), n.removeAttribute(l));
          if (xe.test(n.tagName)) {
            let l = n.textContent.split(y),
              m = l.length - 1;
            if (m > 0) {
              n.textContent = K ? K.emptyScript : "";
              for (let f = 0; f < m; f++)
                (n.append(l[f], O()),
                  w.nextNode(),
                  a.push({ type: 2, index: ++o }));
              n.append(l[m], O());
            }
          }
        } else if (n.nodeType === 8)
          if (n.data === Ee) a.push({ type: 2, index: o });
          else {
            let l = -1;
            for (; (l = n.data.indexOf(y, l + 1)) !== -1;)
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
function S(i, e, t = i, s) {
  if (e === C) return e;
  let n = s !== void 0 ? t._$Co?.[s] : t._$Cl,
    o = R(e) ? void 0 : e._$litDirective$;
  return (
    n?.constructor !== o &&
      (n?._$AO?.(!1),
      o === void 0 ? (n = void 0) : ((n = new o(i)), n._$AT(i, t, s)),
      s !== void 0 ? ((t._$Co ??= [])[s] = n) : (t._$Cl = n)),
    n !== void 0 && (e = S(i, n._$AS(i, e.values), n, s)),
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
        n = (e?.creationScope ?? b).importNode(t, !0);
      w.currentNode = n;
      let o = w.nextNode(),
        r = 0,
        h = 0,
        a = s[0];
      for (; a !== void 0;) {
        if (r === a.index) {
          let d;
          (a.type === 2
            ? (d = new N(o, o.nextSibling, this, e))
            : a.type === 1
              ? (d = new a.ctor(o, a.name, a.strings, this, e))
              : a.type === 6 && (d = new X(o, this, e)),
            this._$AV.push(d),
            (a = s[++h]));
        }
        r !== a?.index && ((o = w.nextNode()), r++);
      }
      return ((w.currentNode = b), n);
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
  N = class i {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(e, t, s, n) {
      ((this.type = 2),
        (this._$AH = c),
        (this._$AN = void 0),
        (this._$AA = e),
        (this._$AB = t),
        (this._$AM = s),
        (this.options = n),
        (this._$Cv = n?.isConnected ?? !0));
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
        R(e)
          ? e === c || e == null || e === ""
            ? (this._$AH !== c && this._$AR(), (this._$AH = c))
            : e !== this._$AH && e !== C && this._(e)
          : e._$litType$ !== void 0
            ? this.$(e)
            : e.nodeType !== void 0
              ? this.T(e)
              : Ge(e)
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
      (this._$AH !== c && R(this._$AH)
        ? (this._$AA.nextSibling.data = e)
        : this.T(b.createTextNode(e)),
        (this._$AH = e));
    }
    $(e) {
      let { values: t, _$litType$: s } = e,
        n =
          typeof s == "number"
            ? this._$AC(e)
            : (s.el === void 0 &&
                (s.el = H.createElement(ke(s.h, s.h[0]), this.options)),
              s);
      if (this._$AH?._$AD === n) this._$AH.p(t);
      else {
        let o = new q(n, this),
          r = o.u(this.options);
        (o.p(t), this.T(r), (this._$AH = o));
      }
    }
    _$AC(e) {
      let t = Ce.get(e.strings);
      return (t === void 0 && Ce.set(e.strings, (t = new H(e))), t);
    }
    k(e) {
      ee(this._$AH) || ((this._$AH = []), this._$AR());
      let t = this._$AH,
        s,
        n = 0;
      for (let o of e)
        (n === t.length
          ? t.push((s = new i(this.O(O()), this.O(O()), this, this.options)))
          : (s = t[n]),
          s._$AI(o),
          n++);
      n < t.length && (this._$AR(s && s._$AB.nextSibling, n), (t.length = n));
    }
    _$AR(e = this._$AA.nextSibling, t) {
      for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
        let s = _e(e).nextSibling;
        (_e(e).remove(), (e = s));
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
    constructor(e, t, s, n, o) {
      ((this.type = 1),
        (this._$AH = c),
        (this._$AN = void 0),
        (this.element = e),
        (this.name = t),
        (this._$AM = n),
        (this.options = o),
        s.length > 2 || s[0] !== "" || s[1] !== ""
          ? ((this._$AH = Array(s.length - 1).fill(new String())),
            (this.strings = s))
          : (this._$AH = c));
    }
    _$AI(e, t = this, s, n) {
      let o = this.strings,
        r = !1;
      if (o === void 0)
        ((e = S(this, e, t, 0)),
          (r = !R(e) || (e !== this._$AH && e !== C)),
          r && (this._$AH = e));
      else {
        let h = e,
          a,
          d;
        for (e = o[0], a = 0; a < o.length - 1; a++)
          ((d = S(this, h[s + a], t, a)),
            d === C && (d = this._$AH[a]),
            (r ||= !R(d) || d !== this._$AH[a]),
            d === c ? (e = c) : e !== c && (e += (d ?? "") + o[a + 1]),
            (this._$AH[a] = d));
      }
      r && !n && this.j(e);
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
    constructor(e, t, s, n, o) {
      (super(e, t, s, n, o), (this.type = 5));
    }
    _$AI(e, t = this) {
      if ((e = S(this, e, t, 0) ?? c) === C) return;
      let s = this._$AH,
        n =
          (e === c && s !== c) ||
          e.capture !== s.capture ||
          e.once !== s.once ||
          e.passive !== s.passive,
        o = e !== c && (s === c || n);
      (n && this.element.removeEventListener(this.name, this, s),
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
var Qe = Y.litHtmlPolyfillSupport;
(Qe?.(H, N), (Y.litHtmlVersions ??= []).push("3.3.3"));
var Te = (i, e, t) => {
  let s = t?.renderBefore ?? e,
    n = s._$litPart$;
  if (n === void 0) {
    let o = t?.renderBefore ?? null;
    s._$litPart$ = n = new N(e.insertBefore(O(), o), o, void 0, t ?? {});
  }
  return (n._$AI(i), n);
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
        (this._$Do = Te(t, this.renderRoot, this.renderOptions)));
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
var Xe = se.litElementPolyfillSupport;
Xe?.({ LitElement: $ });
(se.litElementVersions ??= []).push("4.2.2");
var Oe = {
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
function g(i, e) {
  return i === "de" ? Oe.de[e] : Oe.en[e];
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
        @change=${(n) => this._setBoolean(e, n)}
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
    return g(this.hass?.language ?? "en", e);
  }
};
customElements.get("ai-fitness-card-editor") ||
  customElements.define("ai-fitness-card-editor", ie);
function W(i) {
  return Math.max(0, Math.min(100, Number(i) || 0));
}
function Re(i) {
  return i === "de" ? "de-DE" : "en-GB";
}
function He(i, e, t) {
  let s = new Date(i);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleTimeString(e, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: t,
      });
}
function Ne(i, e, t) {
  let s = new Date(i);
  return Number.isNaN(s.getTime())
    ? ""
    : s.toLocaleDateString(e, {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        timeZone: t,
      });
}
function ne(i, e) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: e,
  }).format(i);
}
function oe(i, e) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: e,
  }).format(i);
}
function Pe(i, e, t) {
  if (!i) return g(e, "noData");
  let s = ne(new Date(), t).toLowerCase(),
    n = i[s] ?? [];
  return n.length
    ? n.map((o) => `${o.start}\u2013${o.end}`).join(", ")
    : g(e, "closedToday");
}
function De(i, e, t, s) {
  return u`<div class="header">
    <div>
      <div class="title">${i}</div>
      ${t ? u`<div class="subtitle">${t}</div>` : c}
    </div>
    <div class="badge ${e ? "open" : "closed"}">
      ${e ? g(s.language, "open") : g(s.language, "closed")}
    </div>
  </div>`;
}
function Ue(i, e) {
  return u`<div class="status">
    <span class="badge ${i ? "open" : "closed"}">
      ${i ? g(e.language, "open") : g(e.language, "closed")}
    </span>
  </div>`;
}
function re(i, e, t, s) {
  let n = e ? e.toUpperCase() : t ? g(s.language, "noData") : "",
    o = i === null || Number.isNaN(i) ? "\u2013" : `${Math.round(i)} %`;
  return u`<div class="occupancy ${e}">
    <div class="value">${o}</div>
    <div class="level">${n}</div>
    <div class="bar">
      <span style="width:${W(i ?? 0)}%"></span>
    </div>
  </div>`;
}
function P(i, e) {
  return u`<div class="section">
    <div class="section-title">${i}</div>
    ${e}
  </div>`;
}
function D(i, e, t, s, n) {
  return P(
    i,
    u`<div class="courses">
      ${e.slice(0, t).map((o) => Ye(o, s, n))}
    </div>`,
  );
}
function Ye(i, e, t) {
  let s = He(i.start, t.locale, t.timeZone),
    n = e ? `${Ne(i.start, t.locale, t.timeZone)} \xB7 ` : "",
    o =
      i.capacity && i.capacity > 0
        ? u`${et()}${i.booked ?? 0}/${i.capacity}`
        : c;
  return u`<div class="course">
    <div class="course-time">${n}${s}</div>
    <div class="course-name">
      ${i.name ?? ""}
      ${
        i.in_progress
          ? u`<span class="tag running"
              >${g(t.language, "running")}</span
            >`
          : c
      }
      ${i.is_full ? u`<span class="tag">${g(t.language, "full")}</span>` : c}
    </div>
    <div class="course-capacity">${o}</div>
  </div>`;
}
function et() {
  return u`<svg class="person" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
    ></path>
  </svg>`;
}
function ae(i, e) {
  return u`<div class="daybars">
    ${i.map((t) => {
      let s = W(t.percentage),
        n = `${t.start}\u2013${t.end} \xB7 ${t.percentage}%${t.is_estimate ? ` (${g(e.language, "estimate")})` : ""}`;
      return u`<div
        class="daybar ${t.is_estimate ? "estimate" : ""}"
        title=${n}
      >
        <span style="height:${Math.max(4, s)}%"></span>
        <small>${t.start.slice(0, 2)}</small>
      </div>`;
    })}
  </div>`;
}
function le(i, e) {
  let t = [],
    s = new Date();
  for (let n = 0; n < 7; n += 1) {
    let o = new Date(s.getTime() + n * 864e5),
      r = i[ne(o, e.timeZone).toUpperCase()] ?? [];
    if (!r.length) continue;
    let h = Math.round(
        r.reduce((d, p) => d + (Number(p.percentage) || 0), 0) / r.length,
      ),
      a = o.toLocaleDateString(e.locale, {
        weekday: "short",
        timeZone: e.timeZone,
      });
    t.push(u`<div class="weekrow">
        <div class="weekday">${a}</div>
        <div class="weekbar">
          <span style="width:${W(h)}%"></span>
        </div>
        <div class="weekpct">${h}%</div>
      </div>`);
  }
  return t.length ? P(g(e.language, "week"), u`<div>${t}</div>`) : c;
}
var tt = new URL("ai-fitness-card.css", import.meta.url).href,
  ce = class extends $ {
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
      let n = this._findOccupancyEntity(),
        o = n ? t.states[n] : void 0;
      if (!o)
        return u`${this._styleLink()}<ha-card>
          <div class="error">${g(t.language, "noSensor")}</div>
        </ha-card>`;
      let r = o.attributes,
        h = o.state === "unavailable" || o.state === "unknown",
        a = h ? null : Number(o.state),
        d = (r.occupancy_level ?? "").toLowerCase(),
        p = r.is_open === !0,
        l = s.title ?? r.studio_name ?? "",
        m = s.show_hours !== !1,
        f = {
          language: t.language,
          locale: Re(t.language),
          timeZone: t.config?.time_zone,
        },
        v = Pe(r.opening_hours, f.language, f.timeZone),
        Me = m ? v : "",
        he = this._findCourseEntity(),
        de = (he ? t.states[he] : void 0)?.attributes ?? {},
        z = de.today ?? [],
        Le = oe(new Date(), f.timeZone),
        B = (de.week ?? []).filter(
          (Ke) => oe(new Date(Ke.start), f.timeZone) !== Le,
        );
      return u`${this._styleLink()}
      <ha-card
        role="button"
        tabindex="0"
        @click=${this._openDetail}
        @keydown=${this._handleCardKey}
      >
        ${De(l, p, Me, f)}
        ${re(a, d, h, f)}
        ${s.show_today_forecast !== !1 && r.forecast_today?.length ? P(g(f.language, "today"), ae(r.forecast_today, f)) : c}
        ${s.show_courses !== !1 && z.length ? D(g(f.language, "coursesToday"), z, 8, !1, f) : c}
        ${s.show_week !== !1 && r.forecast_week ? le(r.forecast_week, f) : c}
        ${s.show_week_courses !== !1 && B.length ? D(g(f.language, "coursesWeek"), B, 12, !0, f) : c}
      </ha-card>
      ${this._renderDetail(l, p, v, a, d, h, r, z, B, f)}`;
    }
    _renderDetail(t, s, n, o, r, h, a, d, p, l) {
      return u`<ha-dialog
      .open=${this._detailOpen}
      .headerTitle=${t}
      .headerSubtitle=${n}
      width="large"
      flexcontent
      @closed=${this._dialogClosed}
    >
      <div class="detail-grid">
        <div class="detail-left">
          ${Ue(s, l)}
          ${re(o, r, h, l)}
          ${a.forecast_today?.length ? P(g(l.language, "today"), ae(a.forecast_today, l)) : c}
          ${a.forecast_week ? le(a.forecast_week, l) : c}
        </div>
        <div class="detail-right">
          ${d.length ? D(g(l.language, "coursesToday"), d, 50, !1, l) : c}
          ${p.length ? D(g(l.language, "coursesWeek"), p, 50, !0, l) : c}
          ${
            !d.length && !p.length
              ? u`<div class="empty">
                  ${g(l.language, "noCourses")}
                </div>`
              : c
          }
        </div>
      </div>
    </ha-dialog>`;
    }
    _openDetail() {
      this._detailOpen = !0;
    }
    _dialogClosed() {
      this._detailOpen = !1;
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
      return u`<link rel="stylesheet" href=${tt} />`;
    }
  };
customElements.get("ai-fitness-card") ||
  customElements.define("ai-fitness-card", ce);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ai-fitness-card",
  name: "AI Fitness Card",
  description:
    "Live occupancy, opening hours and courses for all inclusive Fitness.",
});
