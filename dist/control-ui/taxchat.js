var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = /* @__PURE__ */ Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t5, e6, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t5, this.t = e6;
  }
  get styleSheet() {
    let t5 = this.o;
    const s4 = this.t;
    if (e && void 0 === t5) {
      const e6 = void 0 !== s4 && 1 === s4.length;
      e6 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e6 && o.set(s4, t5));
    }
    return t5;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
var S = (s4, o6) => {
  if (e) s4.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
  else for (const e6 of o6) {
    const o7 = document.createElement("style"), n4 = t.litNonce;
    void 0 !== n4 && o7.setAttribute("nonce", n4), o7.textContent = e6.cssText, s4.appendChild(o7);
  }
};
var c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
  let e6 = "";
  for (const s4 of t6.cssRules) e6 += s4.cssText;
  return r(e6);
})(t5) : t5;

// node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t5, s4) => t5;
var u = { toAttribute(t5, s4) {
  switch (s4) {
    case Boolean:
      t5 = t5 ? l : null;
      break;
    case Object:
    case Array:
      t5 = null == t5 ? t5 : JSON.stringify(t5);
  }
  return t5;
}, fromAttribute(t5, s4) {
  let i6 = t5;
  switch (s4) {
    case Boolean:
      i6 = null !== t5;
      break;
    case Number:
      i6 = null === t5 ? null : Number(t5);
      break;
    case Object:
    case Array:
      try {
        i6 = JSON.parse(t5);
      } catch (t6) {
        i6 = null;
      }
  }
  return i6;
} };
var f = (t5, s4) => !i2(t5, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var y = class extends HTMLElement {
  static addInitializer(t5) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t5);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t5, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
      const i6 = /* @__PURE__ */ Symbol(), h4 = this.getPropertyDescriptor(t5, i6, s4);
      void 0 !== h4 && e2(this.prototype, t5, h4);
    }
  }
  static getPropertyDescriptor(t5, s4, i6) {
    const { get: e6, set: r5 } = h(this.prototype, t5) ?? { get() {
      return this[s4];
    }, set(t6) {
      this[s4] = t6;
    } };
    return { get: e6, set(s5) {
      const h4 = e6?.call(this);
      r5?.call(this, s5), this.requestUpdate(t5, h4, i6);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t5) {
    return this.elementProperties.get(t5) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t5 = n2(this);
    t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t6 = this.properties, s4 = [...r2(t6), ...o2(t6)];
      for (const i6 of s4) this.createProperty(i6, t6[i6]);
    }
    const t5 = this[Symbol.metadata];
    if (null !== t5) {
      const s4 = litPropertyMetadata.get(t5);
      if (void 0 !== s4) for (const [t6, i6] of s4) this.elementProperties.set(t6, i6);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t6, s4] of this.elementProperties) {
      const i6 = this._$Eu(t6, s4);
      void 0 !== i6 && this._$Eh.set(i6, t6);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i6 = [];
    if (Array.isArray(s4)) {
      const e6 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e6) i6.unshift(c(s5));
    } else void 0 !== s4 && i6.push(c(s4));
    return i6;
  }
  static _$Eu(t5, s4) {
    const i6 = s4.attribute;
    return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
  }
  addController(t5) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
  }
  removeController(t5) {
    this._$EO?.delete(t5);
  }
  _$E_() {
    const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i6 of s4.keys()) this.hasOwnProperty(i6) && (t5.set(i6, this[i6]), delete this[i6]);
    t5.size > 0 && (this._$Ep = t5);
  }
  createRenderRoot() {
    const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t5, this.constructor.elementStyles), t5;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
  }
  enableUpdating(t5) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t5) => t5.hostDisconnected?.());
  }
  attributeChangedCallback(t5, s4, i6) {
    this._$AK(t5, i6);
  }
  _$ET(t5, s4) {
    const i6 = this.constructor.elementProperties.get(t5), e6 = this.constructor._$Eu(t5, i6);
    if (void 0 !== e6 && true === i6.reflect) {
      const h4 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s4, i6.type);
      this._$Em = t5, null == h4 ? this.removeAttribute(e6) : this.setAttribute(e6, h4), this._$Em = null;
    }
  }
  _$AK(t5, s4) {
    const i6 = this.constructor, e6 = i6._$Eh.get(t5);
    if (void 0 !== e6 && this._$Em !== e6) {
      const t6 = i6.getPropertyOptions(e6), h4 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
      this._$Em = e6;
      const r5 = h4.fromAttribute(s4, t6.type);
      this[e6] = r5 ?? this._$Ej?.get(e6) ?? r5, this._$Em = null;
    }
  }
  requestUpdate(t5, s4, i6, e6 = false, h4) {
    if (void 0 !== t5) {
      const r5 = this.constructor;
      if (false === e6 && (h4 = this[t5]), i6 ?? (i6 = r5.getPropertyOptions(t5)), !((i6.hasChanged ?? f)(h4, s4) || i6.useDefault && i6.reflect && h4 === this._$Ej?.get(t5) && !this.hasAttribute(r5._$Eu(t5, i6)))) return;
      this.C(t5, s4, i6);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t5, s4, { useDefault: i6, reflect: e6, wrapped: h4 }, r5) {
    i6 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t5) && (this._$Ej.set(t5, r5 ?? s4 ?? this[t5]), true !== h4 || void 0 !== r5) || (this._$AL.has(t5) || (this.hasUpdated || i6 || (s4 = void 0), this._$AL.set(t5, s4)), true === e6 && this._$Em !== t5 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t5));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t6) {
      Promise.reject(t6);
    }
    const t5 = this.scheduleUpdate();
    return null != t5 && await t5, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t7, s5] of this._$Ep) this[t7] = s5;
        this._$Ep = void 0;
      }
      const t6 = this.constructor.elementProperties;
      if (t6.size > 0) for (const [s5, i6] of t6) {
        const { wrapped: t7 } = i6, e6 = this[s5];
        true !== t7 || this._$AL.has(s5) || void 0 === e6 || this.C(s5, void 0, i6, e6);
      }
    }
    let t5 = false;
    const s4 = this._$AL;
    try {
      t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t5 = false, this._$EM(), s5;
    }
    t5 && this._$AE(s4);
  }
  willUpdate(t5) {
  }
  _$AE(t5) {
    this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t5) {
    return true;
  }
  update(t5) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t6) => this._$ET(t6, this[t6]))), this._$EM();
  }
  updated(t5) {
  }
  firstUpdated(t5) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.2");

// node_modules/.pnpm/lit-html@3.3.2/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t5) => t5;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
var u2 = Array.isArray;
var d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t5) => (i6, ...s4) => ({ _$litType$: t5, strings: i6, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = /* @__PURE__ */ Symbol.for("lit-noChange");
var A = /* @__PURE__ */ Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t5, i6) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i6) : i6;
}
var N = (t5, i6) => {
  const s4 = t5.length - 1, e6 = [];
  let n4, l4 = 2 === i6 ? "<svg>" : 3 === i6 ? "<math>" : "", c4 = v;
  for (let i7 = 0; i7 < s4; i7++) {
    const s5 = t5[i7];
    let a3, u5, d4 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u5 = c4.exec(s5), null !== u5); ) f3 = c4.lastIndex, c4 === v ? "!--" === u5[1] ? c4 = _ : void 0 !== u5[1] ? c4 = m : void 0 !== u5[2] ? (y2.test(u5[2]) && (n4 = RegExp("</" + u5[2], "g")), c4 = p2) : void 0 !== u5[3] && (c4 = p2) : c4 === p2 ? ">" === u5[0] ? (c4 = n4 ?? v, d4 = -1) : void 0 === u5[1] ? d4 = -2 : (d4 = c4.lastIndex - u5[2].length, a3 = u5[1], c4 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n4 = void 0);
    const x3 = c4 === p2 && t5[i7 + 1].startsWith("/>") ? " " : "";
    l4 += c4 === v ? s5 + r3 : d4 >= 0 ? (e6.push(a3), s5.slice(0, d4) + h2 + s5.slice(d4) + o3 + x3) : s5 + o3 + (-2 === d4 ? i7 : x3);
  }
  return [V(t5, l4 + (t5[s4] || "<?>") + (2 === i6 ? "</svg>" : 3 === i6 ? "</math>" : "")), e6];
};
var S2 = class _S {
  constructor({ strings: t5, _$litType$: i6 }, e6) {
    let r5;
    this.parts = [];
    let l4 = 0, a3 = 0;
    const u5 = t5.length - 1, d4 = this.parts, [f3, v3] = N(t5, i6);
    if (this.el = _S.createElement(f3, e6), P.currentNode = this.el.content, 2 === i6 || 3 === i6) {
      const t6 = this.el.content.firstChild;
      t6.replaceWith(...t6.childNodes);
    }
    for (; null !== (r5 = P.nextNode()) && d4.length < u5; ) {
      if (1 === r5.nodeType) {
        if (r5.hasAttributes()) for (const t6 of r5.getAttributeNames()) if (t6.endsWith(h2)) {
          const i7 = v3[a3++], s4 = r5.getAttribute(t6).split(o3), e7 = /([.?@])?(.*)/.exec(i7);
          d4.push({ type: 1, index: l4, name: e7[2], strings: s4, ctor: "." === e7[1] ? I : "?" === e7[1] ? L : "@" === e7[1] ? z : H }), r5.removeAttribute(t6);
        } else t6.startsWith(o3) && (d4.push({ type: 6, index: l4 }), r5.removeAttribute(t6));
        if (y2.test(r5.tagName)) {
          const t6 = r5.textContent.split(o3), i7 = t6.length - 1;
          if (i7 > 0) {
            r5.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i7; s4++) r5.append(t6[s4], c3()), P.nextNode(), d4.push({ type: 2, index: ++l4 });
            r5.append(t6[i7], c3());
          }
        }
      } else if (8 === r5.nodeType) if (r5.data === n3) d4.push({ type: 2, index: l4 });
      else {
        let t6 = -1;
        for (; -1 !== (t6 = r5.data.indexOf(o3, t6 + 1)); ) d4.push({ type: 7, index: l4 }), t6 += o3.length - 1;
      }
      l4++;
    }
  }
  static createElement(t5, i6) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t5, s4;
  }
};
function M(t5, i6, s4 = t5, e6) {
  if (i6 === E) return i6;
  let h4 = void 0 !== e6 ? s4._$Co?.[e6] : s4._$Cl;
  const o6 = a2(i6) ? void 0 : i6._$litDirective$;
  return h4?.constructor !== o6 && (h4?._$AO?.(false), void 0 === o6 ? h4 = void 0 : (h4 = new o6(t5), h4._$AT(t5, s4, e6)), void 0 !== e6 ? (s4._$Co ?? (s4._$Co = []))[e6] = h4 : s4._$Cl = h4), void 0 !== h4 && (i6 = M(t5, h4._$AS(t5, i6.values), h4, e6)), i6;
}
var R = class {
  constructor(t5, i6) {
    this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t5) {
    const { el: { content: i6 }, parts: s4 } = this._$AD, e6 = (t5?.creationScope ?? l2).importNode(i6, true);
    P.currentNode = e6;
    let h4 = P.nextNode(), o6 = 0, n4 = 0, r5 = s4[0];
    for (; void 0 !== r5; ) {
      if (o6 === r5.index) {
        let i7;
        2 === r5.type ? i7 = new k(h4, h4.nextSibling, this, t5) : 1 === r5.type ? i7 = new r5.ctor(h4, r5.name, r5.strings, this, t5) : 6 === r5.type && (i7 = new Z(h4, this, t5)), this._$AV.push(i7), r5 = s4[++n4];
      }
      o6 !== r5?.index && (h4 = P.nextNode(), o6++);
    }
    return P.currentNode = l2, e6;
  }
  p(t5) {
    let i6 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i6), i6 += s4.strings.length - 2) : s4._$AI(t5[i6])), i6++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t5, i6, s4, e6) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s4, this.options = e6, this._$Cv = e6?.isConnected ?? true;
  }
  get parentNode() {
    let t5 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === t5?.nodeType && (t5 = i6.parentNode), t5;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t5, i6 = this) {
    t5 = M(this, t5, i6), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
  }
  O(t5) {
    return this._$AA.parentNode.insertBefore(t5, this._$AB);
  }
  T(t5) {
    this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
  }
  _(t5) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
  }
  $(t5) {
    const { values: i6, _$litType$: s4 } = t5, e6 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e6) this._$AH.p(i6);
    else {
      const t6 = new R(e6, this), s5 = t6.u(this.options);
      t6.p(i6), this.T(s5), this._$AH = t6;
    }
  }
  _$AC(t5) {
    let i6 = C.get(t5.strings);
    return void 0 === i6 && C.set(t5.strings, i6 = new S2(t5)), i6;
  }
  k(t5) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s4, e6 = 0;
    for (const h4 of t5) e6 === i6.length ? i6.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i6[e6], s4._$AI(h4), e6++;
    e6 < i6.length && (this._$AR(s4 && s4._$AB.nextSibling, e6), i6.length = e6);
  }
  _$AR(t5 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t5 !== this._$AB; ) {
      const s5 = i3(t5).nextSibling;
      i3(t5).remove(), t5 = s5;
    }
  }
  setConnected(t5) {
    void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t5, i6, s4, e6, h4) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e6, this.options = h4, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t5, i6 = this, s4, e6) {
    const h4 = this.strings;
    let o6 = false;
    if (void 0 === h4) t5 = M(this, t5, i6, 0), o6 = !a2(t5) || t5 !== this._$AH && t5 !== E, o6 && (this._$AH = t5);
    else {
      const e7 = t5;
      let n4, r5;
      for (t5 = h4[0], n4 = 0; n4 < h4.length - 1; n4++) r5 = M(this, e7[s4 + n4], i6, n4), r5 === E && (r5 = this._$AH[n4]), o6 || (o6 = !a2(r5) || r5 !== this._$AH[n4]), r5 === A ? t5 = A : t5 !== A && (t5 += (r5 ?? "") + h4[n4 + 1]), this._$AH[n4] = r5;
    }
    o6 && !e6 && this.j(t5);
  }
  j(t5) {
    t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t5) {
    this.element[this.name] = t5 === A ? void 0 : t5;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t5) {
    this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
  }
};
var z = class extends H {
  constructor(t5, i6, s4, e6, h4) {
    super(t5, i6, s4, e6, h4), this.type = 5;
  }
  _$AI(t5, i6 = this) {
    if ((t5 = M(this, t5, i6, 0) ?? A) === E) return;
    const s4 = this._$AH, e6 = t5 === A && s4 !== A || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h4 = t5 !== A && (s4 === A || e6);
    e6 && this.element.removeEventListener(this.name, this, s4), h4 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
  }
  handleEvent(t5) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
  }
};
var Z = class {
  constructor(t5, i6, s4) {
    this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t5) {
    M(this, t5);
  }
};
var j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.2");
var D = (t5, i6, s4) => {
  const e6 = s4?.renderBefore ?? i6;
  let h4 = e6._$litPart$;
  if (void 0 === h4) {
    const t6 = s4?.renderBefore ?? null;
    e6._$litPart$ = h4 = new k(i6.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
  }
  return h4._$AI(t5), h4;
};

// node_modules/.pnpm/lit-element@4.2.2/node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a3;
    const t5 = super.createRenderRoot();
    return (_a3 = this.renderOptions).renderBefore ?? (_a3.renderBefore = t5.firstChild), t5;
  }
  update(t5) {
    const r5 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.2");

// node_modules/.pnpm/lit-html@3.3.2/node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e4 = (t5) => (...e6) => ({ _$litDirective$: t5, values: e6 });
var i5 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e6, i6) {
    this._$Ct = t5, this._$AM = e6, this._$Ci = i6;
  }
  _$AS(t5, e6) {
    return this.update(t5, e6);
  }
  update(t5, e6) {
    return this.render(...e6);
  }
};

// node_modules/.pnpm/lit-html@3.3.2/node_modules/lit-html/directives/unsafe-html.js
var e5 = class extends i5 {
  constructor(i6) {
    if (super(i6), this.it = A, i6.type !== t3.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r5) {
    if (r5 === A || null == r5) return this._t = void 0, this.it = r5;
    if (r5 === E) return r5;
    if ("string" != typeof r5) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r5 === this.it) return this._t;
    this.it = r5;
    const s4 = [r5];
    return s4.raw = s4, this._t = { _$litType$: this.constructor.resultType, strings: s4, values: [] };
  }
};
e5.directiveName = "unsafeHTML", e5.resultType = 1;
var o5 = e4(e5);

// node_modules/.pnpm/lit-html@3.3.2/node_modules/lit-html/directive-helpers.js
var { I: t4 } = j;
var r4 = (o6) => void 0 === o6.strings;
var m2 = {};
var p3 = (o6, t5 = m2) => o6._$AH = t5;

// node_modules/.pnpm/lit-html@3.3.2/node_modules/lit-html/directives/live.js
var l3 = e4(class extends i5 {
  constructor(r5) {
    if (super(r5), r5.type !== t3.PROPERTY && r5.type !== t3.ATTRIBUTE && r5.type !== t3.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!r4(r5)) throw Error("`live` bindings can only contain a single expression");
  }
  render(r5) {
    return r5;
  }
  update(i6, [t5]) {
    if (t5 === E || t5 === A) return t5;
    const o6 = i6.element, l4 = i6.name;
    if (i6.type === t3.PROPERTY) {
      if (t5 === o6[l4]) return E;
    } else if (i6.type === t3.BOOLEAN_ATTRIBUTE) {
      if (!!t5 === o6.hasAttribute(l4)) return E;
    } else if (i6.type === t3.ATTRIBUTE && o6.getAttribute(l4) === t5 + "") return E;
    return p3(i6), t5;
  }
});

// src/gateway/device-auth.ts
function buildDeviceAuthPayload(params) {
  const version = params.version ?? (params.nonce ? "v2" : "v1");
  const scopes = params.scopes.join(",");
  const token = params.token ?? "";
  const base = [
    version,
    params.deviceId,
    params.clientId,
    params.clientMode,
    params.role,
    scopes,
    String(params.signedAtMs),
    token
  ];
  if (version === "v2") {
    base.push(params.nonce ?? "");
  }
  return base.join("|");
}

// src/gateway/protocol/client-info.ts
var GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  IOS_APP: "openclaw-ios",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe"
};
var GATEWAY_CLIENT_NAMES = GATEWAY_CLIENT_IDS;
var GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  PROBE: "probe",
  TEST: "test"
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(GATEWAY_CLIENT_MODES));

// ui/src/ui/device-auth.ts
var STORAGE_KEY = "openclaw.device.auth.v1";
function normalizeRole(role) {
  return role.trim();
}
function normalizeScopes(scopes) {
  if (!Array.isArray(scopes)) {
    return [];
  }
  const out = /* @__PURE__ */ new Set();
  for (const scope of scopes) {
    const trimmed = scope.trim();
    if (trimmed) {
      out.add(trimmed);
    }
  }
  return [...out].toSorted();
}
function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) {
      return null;
    }
    if (!parsed.deviceId || typeof parsed.deviceId !== "string") {
      return null;
    }
    if (!parsed.tokens || typeof parsed.tokens !== "object") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
function writeStore(store) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
  }
}
function loadDeviceAuthToken(params) {
  const store = readStore();
  if (!store || store.deviceId !== params.deviceId) {
    return null;
  }
  const role = normalizeRole(params.role);
  const entry = store.tokens[role];
  if (!entry || typeof entry.token !== "string") {
    return null;
  }
  return entry;
}
function storeDeviceAuthToken(params) {
  const role = normalizeRole(params.role);
  const next = {
    version: 1,
    deviceId: params.deviceId,
    tokens: {}
  };
  const existing = readStore();
  if (existing && existing.deviceId === params.deviceId) {
    next.tokens = { ...existing.tokens };
  }
  const entry = {
    token: params.token,
    role,
    scopes: normalizeScopes(params.scopes),
    updatedAtMs: Date.now()
  };
  next.tokens[role] = entry;
  writeStore(next);
  return entry;
}
function clearDeviceAuthToken(params) {
  const store = readStore();
  if (!store || store.deviceId !== params.deviceId) {
    return;
  }
  const role = normalizeRole(params.role);
  if (!store.tokens[role]) {
    return;
  }
  const next = { ...store, tokens: { ...store.tokens } };
  delete next.tokens[role];
  writeStore(next);
}

// node_modules/.pnpm/@noble+ed25519@3.0.0/node_modules/@noble/ed25519/index.js
var ed25519_CURVE = {
  p: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffedn,
  n: 0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3edn,
  h: 8n,
  a: 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffecn,
  d: 0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3n,
  Gx: 0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51an,
  Gy: 0x6666666666666666666666666666666666666666666666666666666666666658n
};
var { p: P2, n: N2, Gx, Gy, a: _a, d: _d, h: h3 } = ed25519_CURVE;
var L2 = 32;
var L22 = 64;
var captureTrace = (...args) => {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
};
var err = (message = "") => {
  const e6 = new Error(message);
  captureTrace(e6, err);
  throw e6;
};
var isBig = (n4) => typeof n4 === "bigint";
var isStr = (s4) => typeof s4 === "string";
var isBytes = (a3) => a3 instanceof Uint8Array || ArrayBuffer.isView(a3) && a3.constructor.name === "Uint8Array";
var abytes = (value, length, title = "") => {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || needsLen && len !== length) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    err(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
};
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n4, pad) => n4.toString(16).padStart(pad, "0");
var bytesToHex = (b4) => Array.from(abytes(b4)).map((e6) => padh(e6, 2)).join("");
var C2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C2._0 && ch <= C2._9)
    return ch - C2._0;
  if (ch >= C2.A && ch <= C2.F)
    return ch - (C2.A - 10);
  if (ch >= C2.a && ch <= C2.f)
    return ch - (C2.a - 10);
  return;
};
var hexToBytes = (hex) => {
  const e6 = "hex invalid";
  if (!isStr(hex))
    return err(e6);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    return err(e6);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n22 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n22 === void 0)
      return err(e6);
    array[ai] = n1 * 16 + n22;
  }
  return array;
};
var cr = () => globalThis?.crypto;
var subtle = () => cr()?.subtle ?? err("crypto.subtle must be defined, consider polyfill");
var concatBytes = (...arrs) => {
  const r5 = u8n(arrs.reduce((sum, a3) => sum + abytes(a3).length, 0));
  let pad = 0;
  arrs.forEach((a3) => {
    r5.set(a3, pad);
    pad += a3.length;
  });
  return r5;
};
var randomBytes = (len = L2) => {
  const c4 = cr();
  return c4.getRandomValues(u8n(len));
};
var big = BigInt;
var assertRange = (n4, min, max, msg = "bad number: out of range") => isBig(n4) && min <= n4 && n4 < max ? n4 : err(msg);
var M2 = (a3, b4 = P2) => {
  const r5 = a3 % b4;
  return r5 >= 0n ? r5 : b4 + r5;
};
var modN = (a3) => M2(a3, N2);
var invert = (num, md) => {
  if (num === 0n || md <= 0n)
    err("no inverse n=" + num + " mod=" + md);
  let a3 = M2(num, md), b4 = md, x3 = 0n, y4 = 1n, u5 = 1n, v3 = 0n;
  while (a3 !== 0n) {
    const q2 = b4 / a3, r5 = b4 % a3;
    const m4 = x3 - u5 * q2, n4 = y4 - v3 * q2;
    b4 = a3, a3 = r5, x3 = u5, y4 = v3, u5 = m4, v3 = n4;
  }
  return b4 === 1n ? M2(x3, md) : err("no inverse");
};
var callHash = (name) => {
  const fn = hashes[name];
  if (typeof fn !== "function")
    err("hashes." + name + " not set");
  return fn;
};
var apoint = (p4) => p4 instanceof Point ? p4 : err("Point expected");
var B256 = 2n ** 256n;
var _Point = class _Point {
  constructor(X2, Y, Z3, T3) {
    __publicField(this, "X");
    __publicField(this, "Y");
    __publicField(this, "Z");
    __publicField(this, "T");
    const max = B256;
    this.X = assertRange(X2, 0n, max);
    this.Y = assertRange(Y, 0n, max);
    this.Z = assertRange(Z3, 1n, max);
    this.T = assertRange(T3, 0n, max);
    Object.freeze(this);
  }
  static CURVE() {
    return ed25519_CURVE;
  }
  static fromAffine(p4) {
    return new _Point(p4.x, p4.y, 1n, M2(p4.x * p4.y));
  }
  /** RFC8032 5.1.3: Uint8Array to Point. */
  static fromBytes(hex, zip215 = false) {
    const d4 = _d;
    const normed = u8fr(abytes(hex, L2));
    const lastByte = hex[31];
    normed[31] = lastByte & ~128;
    const y4 = bytesToNumLE(normed);
    const max = zip215 ? B256 : P2;
    assertRange(y4, 0n, max);
    const y22 = M2(y4 * y4);
    const u5 = M2(y22 - 1n);
    const v3 = M2(d4 * y22 + 1n);
    let { isValid, value: x3 } = uvRatio(u5, v3);
    if (!isValid)
      err("bad point: y not sqrt");
    const isXOdd = (x3 & 1n) === 1n;
    const isLastByteOdd = (lastByte & 128) !== 0;
    if (!zip215 && x3 === 0n && isLastByteOdd)
      err("bad point: x==0, isLastByteOdd");
    if (isLastByteOdd !== isXOdd)
      x3 = M2(-x3);
    return new _Point(x3, y4, 1n, M2(x3 * y4));
  }
  static fromHex(hex, zip215) {
    return _Point.fromBytes(hexToBytes(hex), zip215);
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const a3 = _a;
    const d4 = _d;
    const p4 = this;
    if (p4.is0())
      return err("bad point: ZERO");
    const { X: X2, Y, Z: Z3, T: T3 } = p4;
    const X22 = M2(X2 * X2);
    const Y2 = M2(Y * Y);
    const Z22 = M2(Z3 * Z3);
    const Z4 = M2(Z22 * Z22);
    const aX2 = M2(X22 * a3);
    const left = M2(Z22 * M2(aX2 + Y2));
    const right = M2(Z4 + M2(d4 * M2(X22 * Y2)));
    if (left !== right)
      return err("bad point: equation left != right (1)");
    const XY = M2(X2 * Y);
    const ZT = M2(Z3 * T3);
    if (XY !== ZT)
      return err("bad point: equation left != right (2)");
    return this;
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const { X: X2, Y: Y2, Z: Z22 } = apoint(other);
    const X1Z2 = M2(X1 * Z22);
    const X2Z1 = M2(X2 * Z1);
    const Y1Z2 = M2(Y1 * Z22);
    const Y2Z1 = M2(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I2);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point(M2(-this.X), this.Y, this.Z, M2(-this.T));
  }
  /** Point doubling. Complete formula. Cost: `4M + 4S + 1*a + 6add + 1*2`. */
  double() {
    const { X: X1, Y: Y1, Z: Z1 } = this;
    const a3 = _a;
    const A2 = M2(X1 * X1);
    const B3 = M2(Y1 * Y1);
    const C4 = M2(2n * M2(Z1 * Z1));
    const D3 = M2(a3 * A2);
    const x1y1 = X1 + Y1;
    const E3 = M2(M2(x1y1 * x1y1) - A2 - B3);
    const G3 = D3 + B3;
    const F2 = G3 - C4;
    const H2 = D3 - B3;
    const X3 = M2(E3 * F2);
    const Y3 = M2(G3 * H2);
    const T3 = M2(E3 * H2);
    const Z3 = M2(F2 * G3);
    return new _Point(X3, Y3, Z3, T3);
  }
  /** Point addition. Complete formula. Cost: `8M + 1*k + 8add + 1*2`. */
  add(other) {
    const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
    const { X: X2, Y: Y2, Z: Z22, T: T22 } = apoint(other);
    const a3 = _a;
    const d4 = _d;
    const A2 = M2(X1 * X2);
    const B3 = M2(Y1 * Y2);
    const C4 = M2(T1 * d4 * T22);
    const D3 = M2(Z1 * Z22);
    const E3 = M2((X1 + Y1) * (X2 + Y2) - A2 - B3);
    const F2 = M2(D3 - C4);
    const G3 = M2(D3 + C4);
    const H2 = M2(B3 - a3 * A2);
    const X3 = M2(E3 * F2);
    const Y3 = M2(G3 * H2);
    const T3 = M2(E3 * H2);
    const Z3 = M2(F2 * G3);
    return new _Point(X3, Y3, Z3, T3);
  }
  subtract(other) {
    return this.add(apoint(other).negate());
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n4, safe = true) {
    if (!safe && (n4 === 0n || this.is0()))
      return I2;
    assertRange(n4, 1n, N2);
    if (n4 === 1n)
      return this;
    if (this.equals(G))
      return wNAF(n4).p;
    let p4 = I2;
    let f3 = G;
    for (let d4 = this; n4 > 0n; d4 = d4.double(), n4 >>= 1n) {
      if (n4 & 1n)
        p4 = p4.add(d4);
      else if (safe)
        f3 = f3.add(d4);
    }
    return p4;
  }
  multiplyUnsafe(scalar) {
    return this.multiply(scalar, false);
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { X: X2, Y, Z: Z3 } = this;
    if (this.equals(I2))
      return { x: 0n, y: 1n };
    const iz = invert(Z3, P2);
    if (M2(Z3 * iz) !== 1n)
      err("invalid inverse");
    const x3 = M2(X2 * iz);
    const y4 = M2(Y * iz);
    return { x: x3, y: y4 };
  }
  toBytes() {
    const { x: x3, y: y4 } = this.assertValidity().toAffine();
    const b4 = numTo32bLE(y4);
    b4[31] |= x3 & 1n ? 128 : 0;
    return b4;
  }
  toHex() {
    return bytesToHex(this.toBytes());
  }
  clearCofactor() {
    return this.multiply(big(h3), false);
  }
  isSmallOrder() {
    return this.clearCofactor().is0();
  }
  isTorsionFree() {
    let p4 = this.multiply(N2 / 2n, false).double();
    if (N2 % 2n)
      p4 = p4.add(this);
    return p4.is0();
  }
};
__publicField(_Point, "BASE");
__publicField(_Point, "ZERO");
var Point = _Point;
var G = new Point(Gx, Gy, 1n, M2(Gx * Gy));
var I2 = new Point(0n, 1n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I2;
var numTo32bLE = (num) => hexToBytes(padh(assertRange(num, 0n, B256), L22)).reverse();
var bytesToNumLE = (b4) => big("0x" + bytesToHex(u8fr(abytes(b4)).reverse()));
var pow2 = (x3, power) => {
  let r5 = x3;
  while (power-- > 0n) {
    r5 *= r5;
    r5 %= P2;
  }
  return r5;
};
var pow_2_252_3 = (x3) => {
  const x22 = x3 * x3 % P2;
  const b22 = x22 * x3 % P2;
  const b4 = pow2(b22, 2n) * b22 % P2;
  const b5 = pow2(b4, 1n) * x3 % P2;
  const b10 = pow2(b5, 5n) * b5 % P2;
  const b20 = pow2(b10, 10n) * b10 % P2;
  const b40 = pow2(b20, 20n) * b20 % P2;
  const b80 = pow2(b40, 40n) * b40 % P2;
  const b160 = pow2(b80, 80n) * b80 % P2;
  const b240 = pow2(b160, 80n) * b80 % P2;
  const b250 = pow2(b240, 10n) * b10 % P2;
  const pow_p_5_8 = pow2(b250, 2n) * x3 % P2;
  return { pow_p_5_8, b2: b22 };
};
var RM1 = 0x2b8324804fc1df0b2b4d00993dfbd7a72f431806ad2fe478c4ee1b274a0ea0b0n;
var uvRatio = (u5, v3) => {
  const v32 = M2(v3 * v3 * v3);
  const v7 = M2(v32 * v32 * v3);
  const pow = pow_2_252_3(u5 * v7).pow_p_5_8;
  let x3 = M2(u5 * v32 * pow);
  const vx2 = M2(v3 * x3 * x3);
  const root1 = x3;
  const root2 = M2(x3 * RM1);
  const useRoot1 = vx2 === u5;
  const useRoot2 = vx2 === M2(-u5);
  const noRoot = vx2 === M2(-u5 * RM1);
  if (useRoot1)
    x3 = root1;
  if (useRoot2 || noRoot)
    x3 = root2;
  if ((M2(x3) & 1n) === 1n)
    x3 = M2(-x3);
  return { isValid: useRoot1 || useRoot2, value: x3 };
};
var modL_LE = (hash) => modN(bytesToNumLE(hash));
var sha512a = (...m4) => hashes.sha512Async(concatBytes(...m4));
var sha512s = (...m4) => callHash("sha512")(concatBytes(...m4));
var hash2extK = (hashed) => {
  const head = hashed.slice(0, L2);
  head[0] &= 248;
  head[31] &= 127;
  head[31] |= 64;
  const prefix = hashed.slice(L2, L22);
  const scalar = modL_LE(head);
  const point = G.multiply(scalar);
  const pointBytes = point.toBytes();
  return { head, prefix, scalar, point, pointBytes };
};
var getExtendedPublicKeyAsync = (secretKey) => sha512a(abytes(secretKey, L2)).then(hash2extK);
var getExtendedPublicKey = (secretKey) => hash2extK(sha512s(abytes(secretKey, L2)));
var getPublicKeyAsync = (secretKey) => getExtendedPublicKeyAsync(secretKey).then((p4) => p4.pointBytes);
var hashFinishA = (res) => sha512a(res.hashable).then(res.finish);
var _sign = (e6, rBytes, msg) => {
  const { pointBytes: P4, scalar: s4 } = e6;
  const r5 = modL_LE(rBytes);
  const R2 = G.multiply(r5).toBytes();
  const hashable = concatBytes(R2, P4, msg);
  const finish = (hashed) => {
    const S4 = modN(r5 + modL_LE(hashed) * s4);
    return abytes(concatBytes(R2, numTo32bLE(S4)), L22);
  };
  return { hashable, finish };
};
var signAsync = async (message, secretKey) => {
  const m4 = abytes(message);
  const e6 = await getExtendedPublicKeyAsync(secretKey);
  const rBytes = await sha512a(e6.prefix, m4);
  return hashFinishA(_sign(e6, rBytes, m4));
};
var hashes = {
  sha512Async: async (message) => {
    const s4 = subtle();
    const m4 = concatBytes(message);
    return u8n(await s4.digest("SHA-512", m4.buffer));
  },
  sha512: void 0
};
var randomSecretKey = (seed = randomBytes(L2)) => seed;
var utils = {
  getExtendedPublicKeyAsync,
  getExtendedPublicKey,
  randomSecretKey
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p4 = G;
  let b4 = p4;
  for (let w3 = 0; w3 < pwindows; w3++) {
    b4 = p4;
    points.push(b4);
    for (let i6 = 1; i6 < pwindowSize; i6++) {
      b4 = b4.add(p4);
      points.push(b4);
    }
    p4 = b4.double();
  }
  return points;
};
var Gpows = void 0;
var ctneg = (cnd, p4) => {
  const n4 = p4.negate();
  return cnd ? n4 : p4;
};
var wNAF = (n4) => {
  const comp = Gpows || (Gpows = precompute());
  let p4 = I2;
  let f3 = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w3 = 0; w3 < pwindows; w3++) {
    let wbits = Number(n4 & mask);
    n4 >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n4 += 1n;
    }
    const off = w3 * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven = w3 % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f3 = f3.add(ctneg(isEven, comp[offF]));
    } else {
      p4 = p4.add(ctneg(isNeg, comp[offP]));
    }
  }
  if (n4 !== 0n)
    err("invalid wnaf");
  return { p: p4, f: f3 };
};

// ui/src/ui/device-identity.ts
var STORAGE_KEY2 = "openclaw-device-identity-v1";
function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}
function base64UrlDecode(input) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i6 = 0; i6 < binary.length; i6 += 1) {
    out[i6] = binary.charCodeAt(i6);
  }
  return out;
}
function bytesToHex2(bytes) {
  return Array.from(bytes).map((b4) => b4.toString(16).padStart(2, "0")).join("");
}
async function fingerprintPublicKey(publicKey) {
  const hash = await crypto.subtle.digest("SHA-256", publicKey);
  return bytesToHex2(new Uint8Array(hash));
}
async function generateIdentity() {
  const privateKey = utils.randomSecretKey();
  const publicKey = await getPublicKeyAsync(privateKey);
  const deviceId = await fingerprintPublicKey(publicKey);
  return {
    deviceId,
    publicKey: base64UrlEncode(publicKey),
    privateKey: base64UrlEncode(privateKey)
  };
}
async function loadOrCreateDeviceIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY2);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.version === 1 && typeof parsed.deviceId === "string" && typeof parsed.publicKey === "string" && typeof parsed.privateKey === "string") {
        const derivedId = await fingerprintPublicKey(base64UrlDecode(parsed.publicKey));
        if (derivedId !== parsed.deviceId) {
          const updated = {
            ...parsed,
            deviceId: derivedId
          };
          localStorage.setItem(STORAGE_KEY2, JSON.stringify(updated));
          return {
            deviceId: derivedId,
            publicKey: parsed.publicKey,
            privateKey: parsed.privateKey
          };
        }
        return {
          deviceId: parsed.deviceId,
          publicKey: parsed.publicKey,
          privateKey: parsed.privateKey
        };
      }
    }
  } catch {
  }
  const identity = await generateIdentity();
  const stored = {
    version: 1,
    deviceId: identity.deviceId,
    publicKey: identity.publicKey,
    privateKey: identity.privateKey,
    createdAtMs: Date.now()
  };
  localStorage.setItem(STORAGE_KEY2, JSON.stringify(stored));
  return identity;
}
async function signDevicePayload(privateKeyBase64Url, payload) {
  const key = base64UrlDecode(privateKeyBase64Url);
  const data = new TextEncoder().encode(payload);
  const sig = await signAsync(data, key);
  return base64UrlEncode(sig);
}

// ui/src/ui/uuid.ts
var warnedWeakCrypto = false;
function uuidFromBytes(bytes) {
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  let hex = "";
  for (let i6 = 0; i6 < bytes.length; i6++) {
    hex += bytes[i6].toString(16).padStart(2, "0");
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20)}`;
}
function weakRandomBytes() {
  const bytes = new Uint8Array(16);
  const now = Date.now();
  for (let i6 = 0; i6 < bytes.length; i6++) {
    bytes[i6] = Math.floor(Math.random() * 256);
  }
  bytes[0] ^= now & 255;
  bytes[1] ^= now >>> 8 & 255;
  bytes[2] ^= now >>> 16 & 255;
  bytes[3] ^= now >>> 24 & 255;
  return bytes;
}
function warnWeakCryptoOnce() {
  if (warnedWeakCrypto) {
    return;
  }
  warnedWeakCrypto = true;
  console.warn("[uuid] crypto API missing; falling back to weak randomness");
}
function generateUUID(cryptoLike = globalThis.crypto) {
  if (cryptoLike && typeof cryptoLike.randomUUID === "function") {
    return cryptoLike.randomUUID();
  }
  if (cryptoLike && typeof cryptoLike.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    cryptoLike.getRandomValues(bytes);
    return uuidFromBytes(bytes);
  }
  warnWeakCryptoOnce();
  return uuidFromBytes(weakRandomBytes());
}

// ui/src/ui/gateway.ts
var CONNECT_FAILED_CLOSE_CODE = 4008;
var GatewayBrowserClient = class {
  constructor(opts) {
    this.opts = opts;
    this.ws = null;
    this.pending = /* @__PURE__ */ new Map();
    this.closed = false;
    this.lastSeq = null;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectTimer = null;
    this.backoffMs = 800;
  }
  start() {
    this.closed = false;
    this.connect();
  }
  stop() {
    this.closed = true;
    this.ws?.close();
    this.ws = null;
    this.flushPending(new Error("gateway client stopped"));
  }
  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  connect() {
    if (this.closed) {
      return;
    }
    this.ws = new WebSocket(this.opts.url);
    this.ws.addEventListener("open", () => this.queueConnect());
    this.ws.addEventListener("message", (ev) => this.handleMessage(String(ev.data ?? "")));
    this.ws.addEventListener("close", (ev) => {
      const reason = String(ev.reason ?? "");
      this.ws = null;
      this.flushPending(new Error(`gateway closed (${ev.code}): ${reason}`));
      this.opts.onClose?.({ code: ev.code, reason });
      this.scheduleReconnect();
    });
    this.ws.addEventListener("error", () => {
    });
  }
  scheduleReconnect() {
    if (this.closed) {
      return;
    }
    const delay = this.backoffMs;
    this.backoffMs = Math.min(this.backoffMs * 1.7, 15e3);
    window.setTimeout(() => this.connect(), delay);
  }
  flushPending(err2) {
    for (const [, p4] of this.pending) {
      p4.reject(err2);
    }
    this.pending.clear();
  }
  async sendConnect() {
    if (this.connectSent) {
      return;
    }
    this.connectSent = true;
    if (this.connectTimer !== null) {
      window.clearTimeout(this.connectTimer);
      this.connectTimer = null;
    }
    const isSecureContext = typeof crypto !== "undefined" && !!crypto.subtle;
    const scopes = ["operator.admin", "operator.approvals", "operator.pairing"];
    const role = "operator";
    let deviceIdentity = null;
    let canFallbackToShared = false;
    let authToken = this.opts.token;
    if (isSecureContext) {
      deviceIdentity = await loadOrCreateDeviceIdentity();
      const storedToken = loadDeviceAuthToken({
        deviceId: deviceIdentity.deviceId,
        role
      })?.token;
      authToken = storedToken ?? this.opts.token;
      canFallbackToShared = Boolean(storedToken && this.opts.token);
    }
    const auth = authToken || this.opts.password ? {
      token: authToken,
      password: this.opts.password
    } : void 0;
    let device;
    if (isSecureContext && deviceIdentity) {
      const signedAtMs = Date.now();
      const nonce = this.connectNonce ?? void 0;
      const payload = buildDeviceAuthPayload({
        deviceId: deviceIdentity.deviceId,
        clientId: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.CONTROL_UI,
        clientMode: this.opts.mode ?? GATEWAY_CLIENT_MODES.WEBCHAT,
        role,
        scopes,
        signedAtMs,
        token: authToken ?? null,
        nonce
      });
      const signature = await signDevicePayload(deviceIdentity.privateKey, payload);
      device = {
        id: deviceIdentity.deviceId,
        publicKey: deviceIdentity.publicKey,
        signature,
        signedAt: signedAtMs,
        nonce
      };
    }
    const params = {
      minProtocol: 3,
      maxProtocol: 3,
      client: {
        id: this.opts.clientName ?? GATEWAY_CLIENT_NAMES.CONTROL_UI,
        version: this.opts.clientVersion ?? "dev",
        platform: this.opts.platform ?? navigator.platform ?? "web",
        mode: this.opts.mode ?? GATEWAY_CLIENT_MODES.WEBCHAT,
        instanceId: this.opts.instanceId
      },
      role,
      scopes,
      device,
      caps: [],
      auth,
      userAgent: navigator.userAgent,
      locale: navigator.language
    };
    void this.request("connect", params).then((hello) => {
      if (hello?.auth?.deviceToken && deviceIdentity) {
        storeDeviceAuthToken({
          deviceId: deviceIdentity.deviceId,
          role: hello.auth.role ?? role,
          token: hello.auth.deviceToken,
          scopes: hello.auth.scopes ?? []
        });
      }
      this.backoffMs = 800;
      this.opts.onHello?.(hello);
    }).catch(() => {
      if (canFallbackToShared && deviceIdentity) {
        clearDeviceAuthToken({ deviceId: deviceIdentity.deviceId, role });
      }
      this.ws?.close(CONNECT_FAILED_CLOSE_CODE, "connect failed");
    });
  }
  handleMessage(raw) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    const frame = parsed;
    if (frame.type === "event") {
      const evt = parsed;
      if (evt.event === "connect.challenge") {
        const payload = evt.payload;
        const nonce = payload && typeof payload.nonce === "string" ? payload.nonce : null;
        if (nonce) {
          this.connectNonce = nonce;
          void this.sendConnect();
        }
        return;
      }
      const seq = typeof evt.seq === "number" ? evt.seq : null;
      if (seq !== null) {
        if (this.lastSeq !== null && seq > this.lastSeq + 1) {
          this.opts.onGap?.({ expected: this.lastSeq + 1, received: seq });
        }
        this.lastSeq = seq;
      }
      try {
        this.opts.onEvent?.(evt);
      } catch (err2) {
        console.error("[gateway] event handler error:", err2);
      }
      return;
    }
    if (frame.type === "res") {
      const res = parsed;
      const pending = this.pending.get(res.id);
      if (!pending) {
        return;
      }
      this.pending.delete(res.id);
      if (res.ok) {
        pending.resolve(res.payload);
      } else {
        pending.reject(new Error(res.error?.message ?? "request failed"));
      }
      return;
    }
  }
  request(method, params) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("gateway not connected"));
    }
    const id = generateUUID();
    const frame = { type: "req", id, method, params };
    const p4 = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve: (v3) => resolve(v3), reject });
    });
    this.ws.send(JSON.stringify(frame));
    return p4;
  }
  queueConnect() {
    this.connectNonce = null;
    this.connectSent = false;
    if (this.connectTimer !== null) {
      window.clearTimeout(this.connectTimer);
    }
    this.connectTimer = window.setTimeout(() => {
      void this.sendConnect();
    }, 750);
  }
};

// node_modules/.pnpm/dompurify@3.3.1/node_modules/dompurify/dist/purify.es.mjs
var {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
var {
  freeze,
  seal,
  create
} = Object;
var {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x3) {
    return x3;
  };
}
if (!seal) {
  seal = function seal2(x3) {
    return x3;
  };
}
if (!apply) {
  apply = function apply2(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  let l4 = array.length;
  while (l4--) {
    let element = array[l4];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l4] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var text = freeze(["#text"]);
var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
var TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
var NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_3) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.3.1";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (cfg.ADD_FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_3) {
      remove(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_3) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_3) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_3) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_3) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_3) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i6 = childCount - 1; i6 >= 0; --i6) {
            const childClone = cloneNode(childNodes[i6], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l4 = attributes.length;
    while (l4--) {
      const attr = attributes[l4];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_3) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

// node_modules/.pnpm/marked@17.0.1/node_modules/marked/lib/marked.esm.js
function L3() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T2 = L3();
function Z2(u5) {
  T2 = u5;
}
var C3 = { exec: () => null };
function k2(u5, e6 = "") {
  let t5 = typeof u5 == "string" ? u5 : u5.source, n4 = { replace: (r5, i6) => {
    let s4 = typeof i6 == "string" ? i6 : i6.source;
    return s4 = s4.replace(m3.caret, "$1"), t5 = t5.replace(r5, s4), n4;
  }, getRegex: () => new RegExp(t5, e6) };
  return n4;
}
var me = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return false;
  }
})();
var m3 = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u5) => new RegExp(`^( {0,3}${u5})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u5) => new RegExp(`^ {0,${Math.min(3, u5 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u5) => new RegExp(`^ {0,${Math.min(3, u5 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u5) => new RegExp(`^ {0,${Math.min(3, u5 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u5) => new RegExp(`^ {0,${Math.min(3, u5 - 1)}}#`), htmlBeginRegex: (u5) => new RegExp(`^ {0,${Math.min(3, u5 - 1)}}<(?:[a-z].*>|!--)`, "i") };
var xe = /^(?:[ \t]*(?:\n|$))+/;
var be = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Re = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var I3 = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Te = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var N3 = /(?:[*+-]|\d{1,9}[.)])/;
var re = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var se = k2(re).replace(/bull/g, N3).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Oe = k2(re).replace(/bull/g, N3).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var Q = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var we = /^[^\n]+/;
var F = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var ye = k2(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", F).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Pe = k2(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, N3).getRegex();
var v2 = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var j2 = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var Se = k2("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", j2).replace("tag", v2).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var ie = k2(Q).replace("hr", I3).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var $e = k2(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ie).getRegex();
var U = { blockquote: $e, code: be, def: ye, fences: Re, heading: Te, hr: I3, html: Se, lheading: se, list: Pe, newline: xe, paragraph: ie, table: C3, text: we };
var te = k2("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", I3).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex();
var _e = { ...U, lheading: Oe, table: te, paragraph: k2(Q).replace("hr", I3).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", te).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v2).getRegex() };
var Le = { ...U, html: k2(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", j2).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: C3, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: k2(Q).replace("hr", I3).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", se).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var Me = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var ze = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var oe = /^( {2,}|\\)\n(?!\s*$)/;
var Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var D2 = /[\p{P}\p{S}]/u;
var K = /[\s\p{P}\p{S}]/u;
var ae = /[^\s\p{P}\p{S}]/u;
var Ce = k2(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, K).getRegex();
var le = /(?!~)[\p{P}\p{S}]/u;
var Ie = /(?!~)[\s\p{P}\p{S}]/u;
var Ee = /(?:[^\s\p{P}\p{S}]|~)/u;
var Be = k2(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", me ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ue = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var qe = k2(ue, "u").replace(/punct/g, D2).getRegex();
var ve = k2(ue, "u").replace(/punct/g, le).getRegex();
var pe = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var De = k2(pe, "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D2).getRegex();
var He = k2(pe, "gu").replace(/notPunctSpace/g, Ee).replace(/punctSpace/g, Ie).replace(/punct/g, le).getRegex();
var Ze = k2("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ae).replace(/punctSpace/g, K).replace(/punct/g, D2).getRegex();
var Ge = k2(/\\(punct)/, "gu").replace(/punct/g, D2).getRegex();
var Ne = k2(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var Qe = k2(j2).replace("(?:-->|$)", "-->").getRegex();
var Fe = k2("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Qe).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
var je = k2(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var ce = k2(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", F).getRegex();
var he = k2(/^!?\[(ref)\](?:\[\])?/).replace("ref", F).getRegex();
var Ue = k2("reflink|nolink(?!\\()", "g").replace("reflink", ce).replace("nolink", he).getRegex();
var ne = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var W2 = { _backpedal: C3, anyPunctuation: Ge, autolink: Ne, blockSkip: Be, br: oe, code: ze, del: C3, emStrongLDelim: qe, emStrongRDelimAst: De, emStrongRDelimUnd: Ze, escape: Me, link: je, nolink: he, punctuation: Ce, reflink: ce, reflinkSearch: Ue, tag: Fe, text: Ae, url: C3 };
var Ke = { ...W2, link: k2(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: k2(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
var G2 = { ...W2, emStrongRDelimAst: He, emStrongLDelim: ve, url: k2(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ne).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: k2(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ne).getRegex() };
var We = { ...G2, br: k2(oe).replace("{2,}", "*").getRegex(), text: k2(G2.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var E2 = { normal: U, gfm: _e, pedantic: Le };
var M3 = { normal: W2, gfm: G2, breaks: We, pedantic: Ke };
var Xe = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ke = (u5) => Xe[u5];
function w2(u5, e6) {
  if (e6) {
    if (m3.escapeTest.test(u5)) return u5.replace(m3.escapeReplace, ke);
  } else if (m3.escapeTestNoEncode.test(u5)) return u5.replace(m3.escapeReplaceNoEncode, ke);
  return u5;
}
function X(u5) {
  try {
    u5 = encodeURI(u5).replace(m3.percentDecode, "%");
  } catch {
    return null;
  }
  return u5;
}
function J(u5, e6) {
  let t5 = u5.replace(m3.findPipe, (i6, s4, a3) => {
    let o6 = false, l4 = s4;
    for (; --l4 >= 0 && a3[l4] === "\\"; ) o6 = !o6;
    return o6 ? "|" : " |";
  }), n4 = t5.split(m3.splitPipe), r5 = 0;
  if (n4[0].trim() || n4.shift(), n4.length > 0 && !n4.at(-1)?.trim() && n4.pop(), e6) if (n4.length > e6) n4.splice(e6);
  else for (; n4.length < e6; ) n4.push("");
  for (; r5 < n4.length; r5++) n4[r5] = n4[r5].trim().replace(m3.slashPipe, "|");
  return n4;
}
function z2(u5, e6, t5) {
  let n4 = u5.length;
  if (n4 === 0) return "";
  let r5 = 0;
  for (; r5 < n4; ) {
    let i6 = u5.charAt(n4 - r5 - 1);
    if (i6 === e6 && !t5) r5++;
    else if (i6 !== e6 && t5) r5++;
    else break;
  }
  return u5.slice(0, n4 - r5);
}
function de(u5, e6) {
  if (u5.indexOf(e6[1]) === -1) return -1;
  let t5 = 0;
  for (let n4 = 0; n4 < u5.length; n4++) if (u5[n4] === "\\") n4++;
  else if (u5[n4] === e6[0]) t5++;
  else if (u5[n4] === e6[1] && (t5--, t5 < 0)) return n4;
  return t5 > 0 ? -2 : -1;
}
function ge(u5, e6, t5, n4, r5) {
  let i6 = e6.href, s4 = e6.title || null, a3 = u5[1].replace(r5.other.outputLinkReplace, "$1");
  n4.state.inLink = true;
  let o6 = { type: u5[0].charAt(0) === "!" ? "image" : "link", raw: t5, href: i6, title: s4, text: a3, tokens: n4.inlineTokens(a3) };
  return n4.state.inLink = false, o6;
}
function Je(u5, e6, t5) {
  let n4 = u5.match(t5.other.indentCodeCompensation);
  if (n4 === null) return e6;
  let r5 = n4[1];
  return e6.split(`
`).map((i6) => {
    let s4 = i6.match(t5.other.beginningSpace);
    if (s4 === null) return i6;
    let [a3] = s4;
    return a3.length >= r5.length ? i6.slice(r5.length) : i6;
  }).join(`
`);
}
var y3 = class {
  constructor(e6) {
    __publicField(this, "options");
    __publicField(this, "rules");
    __publicField(this, "lexer");
    this.options = e6 || T2;
  }
  space(e6) {
    let t5 = this.rules.block.newline.exec(e6);
    if (t5 && t5[0].length > 0) return { type: "space", raw: t5[0] };
  }
  code(e6) {
    let t5 = this.rules.block.code.exec(e6);
    if (t5) {
      let n4 = t5[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t5[0], codeBlockStyle: "indented", text: this.options.pedantic ? n4 : z2(n4, `
`) };
    }
  }
  fences(e6) {
    let t5 = this.rules.block.fences.exec(e6);
    if (t5) {
      let n4 = t5[0], r5 = Je(n4, t5[3] || "", this.rules);
      return { type: "code", raw: n4, lang: t5[2] ? t5[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t5[2], text: r5 };
    }
  }
  heading(e6) {
    let t5 = this.rules.block.heading.exec(e6);
    if (t5) {
      let n4 = t5[2].trim();
      if (this.rules.other.endingHash.test(n4)) {
        let r5 = z2(n4, "#");
        (this.options.pedantic || !r5 || this.rules.other.endingSpaceChar.test(r5)) && (n4 = r5.trim());
      }
      return { type: "heading", raw: t5[0], depth: t5[1].length, text: n4, tokens: this.lexer.inline(n4) };
    }
  }
  hr(e6) {
    let t5 = this.rules.block.hr.exec(e6);
    if (t5) return { type: "hr", raw: z2(t5[0], `
`) };
  }
  blockquote(e6) {
    let t5 = this.rules.block.blockquote.exec(e6);
    if (t5) {
      let n4 = z2(t5[0], `
`).split(`
`), r5 = "", i6 = "", s4 = [];
      for (; n4.length > 0; ) {
        let a3 = false, o6 = [], l4;
        for (l4 = 0; l4 < n4.length; l4++) if (this.rules.other.blockquoteStart.test(n4[l4])) o6.push(n4[l4]), a3 = true;
        else if (!a3) o6.push(n4[l4]);
        else break;
        n4 = n4.slice(l4);
        let p4 = o6.join(`
`), c4 = p4.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r5 = r5 ? `${r5}
${p4}` : p4, i6 = i6 ? `${i6}
${c4}` : c4;
        let g2 = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(c4, s4, true), this.lexer.state.top = g2, n4.length === 0) break;
        let h4 = s4.at(-1);
        if (h4?.type === "code") break;
        if (h4?.type === "blockquote") {
          let R2 = h4, f3 = R2.raw + `
` + n4.join(`
`), O = this.blockquote(f3);
          s4[s4.length - 1] = O, r5 = r5.substring(0, r5.length - R2.raw.length) + O.raw, i6 = i6.substring(0, i6.length - R2.text.length) + O.text;
          break;
        } else if (h4?.type === "list") {
          let R2 = h4, f3 = R2.raw + `
` + n4.join(`
`), O = this.list(f3);
          s4[s4.length - 1] = O, r5 = r5.substring(0, r5.length - h4.raw.length) + O.raw, i6 = i6.substring(0, i6.length - R2.raw.length) + O.raw, n4 = f3.substring(s4.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r5, tokens: s4, text: i6 };
    }
  }
  list(e6) {
    let t5 = this.rules.block.list.exec(e6);
    if (t5) {
      let n4 = t5[1].trim(), r5 = n4.length > 1, i6 = { type: "list", raw: "", ordered: r5, start: r5 ? +n4.slice(0, -1) : "", loose: false, items: [] };
      n4 = r5 ? `\\d{1,9}\\${n4.slice(-1)}` : `\\${n4}`, this.options.pedantic && (n4 = r5 ? n4 : "[*+-]");
      let s4 = this.rules.other.listItemRegex(n4), a3 = false;
      for (; e6; ) {
        let l4 = false, p4 = "", c4 = "";
        if (!(t5 = s4.exec(e6)) || this.rules.block.hr.test(e6)) break;
        p4 = t5[0], e6 = e6.substring(p4.length);
        let g2 = t5[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (O) => " ".repeat(3 * O.length)), h4 = e6.split(`
`, 1)[0], R2 = !g2.trim(), f3 = 0;
        if (this.options.pedantic ? (f3 = 2, c4 = g2.trimStart()) : R2 ? f3 = t5[1].length + 1 : (f3 = t5[2].search(this.rules.other.nonSpaceChar), f3 = f3 > 4 ? 1 : f3, c4 = g2.slice(f3), f3 += t5[1].length), R2 && this.rules.other.blankLine.test(h4) && (p4 += h4 + `
`, e6 = e6.substring(h4.length + 1), l4 = true), !l4) {
          let O = this.rules.other.nextBulletRegex(f3), V2 = this.rules.other.hrRegex(f3), Y = this.rules.other.fencesBeginRegex(f3), ee = this.rules.other.headingBeginRegex(f3), fe = this.rules.other.htmlBeginRegex(f3);
          for (; e6; ) {
            let H2 = e6.split(`
`, 1)[0], A2;
            if (h4 = H2, this.options.pedantic ? (h4 = h4.replace(this.rules.other.listReplaceNesting, "  "), A2 = h4) : A2 = h4.replace(this.rules.other.tabCharGlobal, "    "), Y.test(h4) || ee.test(h4) || fe.test(h4) || O.test(h4) || V2.test(h4)) break;
            if (A2.search(this.rules.other.nonSpaceChar) >= f3 || !h4.trim()) c4 += `
` + A2.slice(f3);
            else {
              if (R2 || g2.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || Y.test(g2) || ee.test(g2) || V2.test(g2)) break;
              c4 += `
` + h4;
            }
            !R2 && !h4.trim() && (R2 = true), p4 += H2 + `
`, e6 = e6.substring(H2.length + 1), g2 = A2.slice(f3);
          }
        }
        i6.loose || (a3 ? i6.loose = true : this.rules.other.doubleBlankLine.test(p4) && (a3 = true)), i6.items.push({ type: "list_item", raw: p4, task: !!this.options.gfm && this.rules.other.listIsTask.test(c4), loose: false, text: c4, tokens: [] }), i6.raw += p4;
      }
      let o6 = i6.items.at(-1);
      if (o6) o6.raw = o6.raw.trimEnd(), o6.text = o6.text.trimEnd();
      else return;
      i6.raw = i6.raw.trimEnd();
      for (let l4 of i6.items) {
        if (this.lexer.state.top = false, l4.tokens = this.lexer.blockTokens(l4.text, []), l4.task) {
          if (l4.text = l4.text.replace(this.rules.other.listReplaceTask, ""), l4.tokens[0]?.type === "text" || l4.tokens[0]?.type === "paragraph") {
            l4.tokens[0].raw = l4.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l4.tokens[0].text = l4.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let c4 = this.lexer.inlineQueue.length - 1; c4 >= 0; c4--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[c4].src)) {
              this.lexer.inlineQueue[c4].src = this.lexer.inlineQueue[c4].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let p4 = this.rules.other.listTaskCheckbox.exec(l4.raw);
          if (p4) {
            let c4 = { type: "checkbox", raw: p4[0] + " ", checked: p4[0] !== "[ ]" };
            l4.checked = c4.checked, i6.loose ? l4.tokens[0] && ["paragraph", "text"].includes(l4.tokens[0].type) && "tokens" in l4.tokens[0] && l4.tokens[0].tokens ? (l4.tokens[0].raw = c4.raw + l4.tokens[0].raw, l4.tokens[0].text = c4.raw + l4.tokens[0].text, l4.tokens[0].tokens.unshift(c4)) : l4.tokens.unshift({ type: "paragraph", raw: c4.raw, text: c4.raw, tokens: [c4] }) : l4.tokens.unshift(c4);
          }
        }
        if (!i6.loose) {
          let p4 = l4.tokens.filter((g2) => g2.type === "space"), c4 = p4.length > 0 && p4.some((g2) => this.rules.other.anyLine.test(g2.raw));
          i6.loose = c4;
        }
      }
      if (i6.loose) for (let l4 of i6.items) {
        l4.loose = true;
        for (let p4 of l4.tokens) p4.type === "text" && (p4.type = "paragraph");
      }
      return i6;
    }
  }
  html(e6) {
    let t5 = this.rules.block.html.exec(e6);
    if (t5) return { type: "html", block: true, raw: t5[0], pre: t5[1] === "pre" || t5[1] === "script" || t5[1] === "style", text: t5[0] };
  }
  def(e6) {
    let t5 = this.rules.block.def.exec(e6);
    if (t5) {
      let n4 = t5[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r5 = t5[2] ? t5[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i6 = t5[3] ? t5[3].substring(1, t5[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t5[3];
      return { type: "def", tag: n4, raw: t5[0], href: r5, title: i6 };
    }
  }
  table(e6) {
    let t5 = this.rules.block.table.exec(e6);
    if (!t5 || !this.rules.other.tableDelimiter.test(t5[2])) return;
    let n4 = J(t5[1]), r5 = t5[2].replace(this.rules.other.tableAlignChars, "").split("|"), i6 = t5[3]?.trim() ? t5[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s4 = { type: "table", raw: t5[0], header: [], align: [], rows: [] };
    if (n4.length === r5.length) {
      for (let a3 of r5) this.rules.other.tableAlignRight.test(a3) ? s4.align.push("right") : this.rules.other.tableAlignCenter.test(a3) ? s4.align.push("center") : this.rules.other.tableAlignLeft.test(a3) ? s4.align.push("left") : s4.align.push(null);
      for (let a3 = 0; a3 < n4.length; a3++) s4.header.push({ text: n4[a3], tokens: this.lexer.inline(n4[a3]), header: true, align: s4.align[a3] });
      for (let a3 of i6) s4.rows.push(J(a3, s4.header.length).map((o6, l4) => ({ text: o6, tokens: this.lexer.inline(o6), header: false, align: s4.align[l4] })));
      return s4;
    }
  }
  lheading(e6) {
    let t5 = this.rules.block.lheading.exec(e6);
    if (t5) return { type: "heading", raw: t5[0], depth: t5[2].charAt(0) === "=" ? 1 : 2, text: t5[1], tokens: this.lexer.inline(t5[1]) };
  }
  paragraph(e6) {
    let t5 = this.rules.block.paragraph.exec(e6);
    if (t5) {
      let n4 = t5[1].charAt(t5[1].length - 1) === `
` ? t5[1].slice(0, -1) : t5[1];
      return { type: "paragraph", raw: t5[0], text: n4, tokens: this.lexer.inline(n4) };
    }
  }
  text(e6) {
    let t5 = this.rules.block.text.exec(e6);
    if (t5) return { type: "text", raw: t5[0], text: t5[0], tokens: this.lexer.inline(t5[0]) };
  }
  escape(e6) {
    let t5 = this.rules.inline.escape.exec(e6);
    if (t5) return { type: "escape", raw: t5[0], text: t5[1] };
  }
  tag(e6) {
    let t5 = this.rules.inline.tag.exec(e6);
    if (t5) return !this.lexer.state.inLink && this.rules.other.startATag.test(t5[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t5[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t5[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t5[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t5[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t5[0] };
  }
  link(e6) {
    let t5 = this.rules.inline.link.exec(e6);
    if (t5) {
      let n4 = t5[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n4)) {
        if (!this.rules.other.endAngleBracket.test(n4)) return;
        let s4 = z2(n4.slice(0, -1), "\\");
        if ((n4.length - s4.length) % 2 === 0) return;
      } else {
        let s4 = de(t5[2], "()");
        if (s4 === -2) return;
        if (s4 > -1) {
          let o6 = (t5[0].indexOf("!") === 0 ? 5 : 4) + t5[1].length + s4;
          t5[2] = t5[2].substring(0, s4), t5[0] = t5[0].substring(0, o6).trim(), t5[3] = "";
        }
      }
      let r5 = t5[2], i6 = "";
      if (this.options.pedantic) {
        let s4 = this.rules.other.pedanticHrefTitle.exec(r5);
        s4 && (r5 = s4[1], i6 = s4[3]);
      } else i6 = t5[3] ? t5[3].slice(1, -1) : "";
      return r5 = r5.trim(), this.rules.other.startAngleBracket.test(r5) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n4) ? r5 = r5.slice(1) : r5 = r5.slice(1, -1)), ge(t5, { href: r5 && r5.replace(this.rules.inline.anyPunctuation, "$1"), title: i6 && i6.replace(this.rules.inline.anyPunctuation, "$1") }, t5[0], this.lexer, this.rules);
    }
  }
  reflink(e6, t5) {
    let n4;
    if ((n4 = this.rules.inline.reflink.exec(e6)) || (n4 = this.rules.inline.nolink.exec(e6))) {
      let r5 = (n4[2] || n4[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i6 = t5[r5.toLowerCase()];
      if (!i6) {
        let s4 = n4[0].charAt(0);
        return { type: "text", raw: s4, text: s4 };
      }
      return ge(n4, i6, n4[0], this.lexer, this.rules);
    }
  }
  emStrong(e6, t5, n4 = "") {
    let r5 = this.rules.inline.emStrongLDelim.exec(e6);
    if (!r5 || r5[3] && n4.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r5[1] || r5[2] || "") || !n4 || this.rules.inline.punctuation.exec(n4)) {
      let s4 = [...r5[0]].length - 1, a3, o6, l4 = s4, p4 = 0, c4 = r5[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c4.lastIndex = 0, t5 = t5.slice(-1 * e6.length + s4); (r5 = c4.exec(t5)) != null; ) {
        if (a3 = r5[1] || r5[2] || r5[3] || r5[4] || r5[5] || r5[6], !a3) continue;
        if (o6 = [...a3].length, r5[3] || r5[4]) {
          l4 += o6;
          continue;
        } else if ((r5[5] || r5[6]) && s4 % 3 && !((s4 + o6) % 3)) {
          p4 += o6;
          continue;
        }
        if (l4 -= o6, l4 > 0) continue;
        o6 = Math.min(o6, o6 + l4 + p4);
        let g2 = [...r5[0]][0].length, h4 = e6.slice(0, s4 + r5.index + g2 + o6);
        if (Math.min(s4, o6) % 2) {
          let f3 = h4.slice(1, -1);
          return { type: "em", raw: h4, text: f3, tokens: this.lexer.inlineTokens(f3) };
        }
        let R2 = h4.slice(2, -2);
        return { type: "strong", raw: h4, text: R2, tokens: this.lexer.inlineTokens(R2) };
      }
    }
  }
  codespan(e6) {
    let t5 = this.rules.inline.code.exec(e6);
    if (t5) {
      let n4 = t5[2].replace(this.rules.other.newLineCharGlobal, " "), r5 = this.rules.other.nonSpaceChar.test(n4), i6 = this.rules.other.startingSpaceChar.test(n4) && this.rules.other.endingSpaceChar.test(n4);
      return r5 && i6 && (n4 = n4.substring(1, n4.length - 1)), { type: "codespan", raw: t5[0], text: n4 };
    }
  }
  br(e6) {
    let t5 = this.rules.inline.br.exec(e6);
    if (t5) return { type: "br", raw: t5[0] };
  }
  del(e6) {
    let t5 = this.rules.inline.del.exec(e6);
    if (t5) return { type: "del", raw: t5[0], text: t5[2], tokens: this.lexer.inlineTokens(t5[2]) };
  }
  autolink(e6) {
    let t5 = this.rules.inline.autolink.exec(e6);
    if (t5) {
      let n4, r5;
      return t5[2] === "@" ? (n4 = t5[1], r5 = "mailto:" + n4) : (n4 = t5[1], r5 = n4), { type: "link", raw: t5[0], text: n4, href: r5, tokens: [{ type: "text", raw: n4, text: n4 }] };
    }
  }
  url(e6) {
    let t5;
    if (t5 = this.rules.inline.url.exec(e6)) {
      let n4, r5;
      if (t5[2] === "@") n4 = t5[0], r5 = "mailto:" + n4;
      else {
        let i6;
        do
          i6 = t5[0], t5[0] = this.rules.inline._backpedal.exec(t5[0])?.[0] ?? "";
        while (i6 !== t5[0]);
        n4 = t5[0], t5[1] === "www." ? r5 = "http://" + t5[0] : r5 = t5[0];
      }
      return { type: "link", raw: t5[0], text: n4, href: r5, tokens: [{ type: "text", raw: n4, text: n4 }] };
    }
  }
  inlineText(e6) {
    let t5 = this.rules.inline.text.exec(e6);
    if (t5) {
      let n4 = this.lexer.state.inRawBlock;
      return { type: "text", raw: t5[0], text: t5[0], escaped: n4 };
    }
  }
};
var x2 = class u3 {
  constructor(e6) {
    __publicField(this, "tokens");
    __publicField(this, "options");
    __publicField(this, "state");
    __publicField(this, "inlineQueue");
    __publicField(this, "tokenizer");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e6 || T2, this.options.tokenizer = this.options.tokenizer || new y3(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t5 = { other: m3, block: E2.normal, inline: M3.normal };
    this.options.pedantic ? (t5.block = E2.pedantic, t5.inline = M3.pedantic) : this.options.gfm && (t5.block = E2.gfm, this.options.breaks ? t5.inline = M3.breaks : t5.inline = M3.gfm), this.tokenizer.rules = t5;
  }
  static get rules() {
    return { block: E2, inline: M3 };
  }
  static lex(e6, t5) {
    return new u3(t5).lex(e6);
  }
  static lexInline(e6, t5) {
    return new u3(t5).inlineTokens(e6);
  }
  lex(e6) {
    e6 = e6.replace(m3.carriageReturn, `
`), this.blockTokens(e6, this.tokens);
    for (let t5 = 0; t5 < this.inlineQueue.length; t5++) {
      let n4 = this.inlineQueue[t5];
      this.inlineTokens(n4.src, n4.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e6, t5 = [], n4 = false) {
    for (this.options.pedantic && (e6 = e6.replace(m3.tabCharGlobal, "    ").replace(m3.spaceLine, "")); e6; ) {
      let r5;
      if (this.options.extensions?.block?.some((s4) => (r5 = s4.call({ lexer: this }, e6, t5)) ? (e6 = e6.substring(r5.raw.length), t5.push(r5), true) : false)) continue;
      if (r5 = this.tokenizer.space(e6)) {
        e6 = e6.substring(r5.raw.length);
        let s4 = t5.at(-1);
        r5.raw.length === 1 && s4 !== void 0 ? s4.raw += `
` : t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.code(e6)) {
        e6 = e6.substring(r5.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "paragraph" || s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r5.raw, s4.text += `
` + r5.text, this.inlineQueue.at(-1).src = s4.text) : t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.fences(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.heading(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.hr(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.blockquote(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.list(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.html(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.def(e6)) {
        e6 = e6.substring(r5.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "paragraph" || s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r5.raw, s4.text += `
` + r5.raw, this.inlineQueue.at(-1).src = s4.text) : this.tokens.links[r5.tag] || (this.tokens.links[r5.tag] = { href: r5.href, title: r5.title }, t5.push(r5));
        continue;
      }
      if (r5 = this.tokenizer.table(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      if (r5 = this.tokenizer.lheading(e6)) {
        e6 = e6.substring(r5.raw.length), t5.push(r5);
        continue;
      }
      let i6 = e6;
      if (this.options.extensions?.startBlock) {
        let s4 = 1 / 0, a3 = e6.slice(1), o6;
        this.options.extensions.startBlock.forEach((l4) => {
          o6 = l4.call({ lexer: this }, a3), typeof o6 == "number" && o6 >= 0 && (s4 = Math.min(s4, o6));
        }), s4 < 1 / 0 && s4 >= 0 && (i6 = e6.substring(0, s4 + 1));
      }
      if (this.state.top && (r5 = this.tokenizer.paragraph(i6))) {
        let s4 = t5.at(-1);
        n4 && s4?.type === "paragraph" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r5.raw, s4.text += `
` + r5.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s4.text) : t5.push(r5), n4 = i6.length !== e6.length, e6 = e6.substring(r5.raw.length);
        continue;
      }
      if (r5 = this.tokenizer.text(e6)) {
        e6 = e6.substring(r5.raw.length);
        let s4 = t5.at(-1);
        s4?.type === "text" ? (s4.raw += (s4.raw.endsWith(`
`) ? "" : `
`) + r5.raw, s4.text += `
` + r5.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s4.text) : t5.push(r5);
        continue;
      }
      if (e6) {
        let s4 = "Infinite loop on byte: " + e6.charCodeAt(0);
        if (this.options.silent) {
          console.error(s4);
          break;
        } else throw new Error(s4);
      }
    }
    return this.state.top = true, t5;
  }
  inline(e6, t5 = []) {
    return this.inlineQueue.push({ src: e6, tokens: t5 }), t5;
  }
  inlineTokens(e6, t5 = []) {
    let n4 = e6, r5 = null;
    if (this.tokens.links) {
      let o6 = Object.keys(this.tokens.links);
      if (o6.length > 0) for (; (r5 = this.tokenizer.rules.inline.reflinkSearch.exec(n4)) != null; ) o6.includes(r5[0].slice(r5[0].lastIndexOf("[") + 1, -1)) && (n4 = n4.slice(0, r5.index) + "[" + "a".repeat(r5[0].length - 2) + "]" + n4.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r5 = this.tokenizer.rules.inline.anyPunctuation.exec(n4)) != null; ) n4 = n4.slice(0, r5.index) + "++" + n4.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i6;
    for (; (r5 = this.tokenizer.rules.inline.blockSkip.exec(n4)) != null; ) i6 = r5[2] ? r5[2].length : 0, n4 = n4.slice(0, r5.index + i6) + "[" + "a".repeat(r5[0].length - i6 - 2) + "]" + n4.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n4 = this.options.hooks?.emStrongMask?.call({ lexer: this }, n4) ?? n4;
    let s4 = false, a3 = "";
    for (; e6; ) {
      s4 || (a3 = ""), s4 = false;
      let o6;
      if (this.options.extensions?.inline?.some((p4) => (o6 = p4.call({ lexer: this }, e6, t5)) ? (e6 = e6.substring(o6.raw.length), t5.push(o6), true) : false)) continue;
      if (o6 = this.tokenizer.escape(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.tag(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.link(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.reflink(e6, this.tokens.links)) {
        e6 = e6.substring(o6.raw.length);
        let p4 = t5.at(-1);
        o6.type === "text" && p4?.type === "text" ? (p4.raw += o6.raw, p4.text += o6.text) : t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.emStrong(e6, n4, a3)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.codespan(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.br(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.del(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (o6 = this.tokenizer.autolink(e6)) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      if (!this.state.inLink && (o6 = this.tokenizer.url(e6))) {
        e6 = e6.substring(o6.raw.length), t5.push(o6);
        continue;
      }
      let l4 = e6;
      if (this.options.extensions?.startInline) {
        let p4 = 1 / 0, c4 = e6.slice(1), g2;
        this.options.extensions.startInline.forEach((h4) => {
          g2 = h4.call({ lexer: this }, c4), typeof g2 == "number" && g2 >= 0 && (p4 = Math.min(p4, g2));
        }), p4 < 1 / 0 && p4 >= 0 && (l4 = e6.substring(0, p4 + 1));
      }
      if (o6 = this.tokenizer.inlineText(l4)) {
        e6 = e6.substring(o6.raw.length), o6.raw.slice(-1) !== "_" && (a3 = o6.raw.slice(-1)), s4 = true;
        let p4 = t5.at(-1);
        p4?.type === "text" ? (p4.raw += o6.raw, p4.text += o6.text) : t5.push(o6);
        continue;
      }
      if (e6) {
        let p4 = "Infinite loop on byte: " + e6.charCodeAt(0);
        if (this.options.silent) {
          console.error(p4);
          break;
        } else throw new Error(p4);
      }
    }
    return t5;
  }
};
var P3 = class {
  constructor(e6) {
    __publicField(this, "options");
    __publicField(this, "parser");
    this.options = e6 || T2;
  }
  space(e6) {
    return "";
  }
  code({ text: e6, lang: t5, escaped: n4 }) {
    let r5 = (t5 || "").match(m3.notSpaceStart)?.[0], i6 = e6.replace(m3.endingNewline, "") + `
`;
    return r5 ? '<pre><code class="language-' + w2(r5) + '">' + (n4 ? i6 : w2(i6, true)) + `</code></pre>
` : "<pre><code>" + (n4 ? i6 : w2(i6, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e6 }) {
    return `<blockquote>
${this.parser.parse(e6)}</blockquote>
`;
  }
  html({ text: e6 }) {
    return e6;
  }
  def(e6) {
    return "";
  }
  heading({ tokens: e6, depth: t5 }) {
    return `<h${t5}>${this.parser.parseInline(e6)}</h${t5}>
`;
  }
  hr(e6) {
    return `<hr>
`;
  }
  list(e6) {
    let t5 = e6.ordered, n4 = e6.start, r5 = "";
    for (let a3 = 0; a3 < e6.items.length; a3++) {
      let o6 = e6.items[a3];
      r5 += this.listitem(o6);
    }
    let i6 = t5 ? "ol" : "ul", s4 = t5 && n4 !== 1 ? ' start="' + n4 + '"' : "";
    return "<" + i6 + s4 + `>
` + r5 + "</" + i6 + `>
`;
  }
  listitem(e6) {
    return `<li>${this.parser.parse(e6.tokens)}</li>
`;
  }
  checkbox({ checked: e6 }) {
    return "<input " + (e6 ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e6 }) {
    return `<p>${this.parser.parseInline(e6)}</p>
`;
  }
  table(e6) {
    let t5 = "", n4 = "";
    for (let i6 = 0; i6 < e6.header.length; i6++) n4 += this.tablecell(e6.header[i6]);
    t5 += this.tablerow({ text: n4 });
    let r5 = "";
    for (let i6 = 0; i6 < e6.rows.length; i6++) {
      let s4 = e6.rows[i6];
      n4 = "";
      for (let a3 = 0; a3 < s4.length; a3++) n4 += this.tablecell(s4[a3]);
      r5 += this.tablerow({ text: n4 });
    }
    return r5 && (r5 = `<tbody>${r5}</tbody>`), `<table>
<thead>
` + t5 + `</thead>
` + r5 + `</table>
`;
  }
  tablerow({ text: e6 }) {
    return `<tr>
${e6}</tr>
`;
  }
  tablecell(e6) {
    let t5 = this.parser.parseInline(e6.tokens), n4 = e6.header ? "th" : "td";
    return (e6.align ? `<${n4} align="${e6.align}">` : `<${n4}>`) + t5 + `</${n4}>
`;
  }
  strong({ tokens: e6 }) {
    return `<strong>${this.parser.parseInline(e6)}</strong>`;
  }
  em({ tokens: e6 }) {
    return `<em>${this.parser.parseInline(e6)}</em>`;
  }
  codespan({ text: e6 }) {
    return `<code>${w2(e6, true)}</code>`;
  }
  br(e6) {
    return "<br>";
  }
  del({ tokens: e6 }) {
    return `<del>${this.parser.parseInline(e6)}</del>`;
  }
  link({ href: e6, title: t5, tokens: n4 }) {
    let r5 = this.parser.parseInline(n4), i6 = X(e6);
    if (i6 === null) return r5;
    e6 = i6;
    let s4 = '<a href="' + e6 + '"';
    return t5 && (s4 += ' title="' + w2(t5) + '"'), s4 += ">" + r5 + "</a>", s4;
  }
  image({ href: e6, title: t5, text: n4, tokens: r5 }) {
    r5 && (n4 = this.parser.parseInline(r5, this.parser.textRenderer));
    let i6 = X(e6);
    if (i6 === null) return w2(n4);
    e6 = i6;
    let s4 = `<img src="${e6}" alt="${n4}"`;
    return t5 && (s4 += ` title="${w2(t5)}"`), s4 += ">", s4;
  }
  text(e6) {
    return "tokens" in e6 && e6.tokens ? this.parser.parseInline(e6.tokens) : "escaped" in e6 && e6.escaped ? e6.text : w2(e6.text);
  }
};
var $2 = class {
  strong({ text: e6 }) {
    return e6;
  }
  em({ text: e6 }) {
    return e6;
  }
  codespan({ text: e6 }) {
    return e6;
  }
  del({ text: e6 }) {
    return e6;
  }
  html({ text: e6 }) {
    return e6;
  }
  text({ text: e6 }) {
    return e6;
  }
  link({ text: e6 }) {
    return "" + e6;
  }
  image({ text: e6 }) {
    return "" + e6;
  }
  br() {
    return "";
  }
  checkbox({ raw: e6 }) {
    return e6;
  }
};
var b3 = class u4 {
  constructor(e6) {
    __publicField(this, "options");
    __publicField(this, "renderer");
    __publicField(this, "textRenderer");
    this.options = e6 || T2, this.options.renderer = this.options.renderer || new P3(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $2();
  }
  static parse(e6, t5) {
    return new u4(t5).parse(e6);
  }
  static parseInline(e6, t5) {
    return new u4(t5).parseInline(e6);
  }
  parse(e6) {
    let t5 = "";
    for (let n4 = 0; n4 < e6.length; n4++) {
      let r5 = e6[n4];
      if (this.options.extensions?.renderers?.[r5.type]) {
        let s4 = r5, a3 = this.options.extensions.renderers[s4.type].call({ parser: this }, s4);
        if (a3 !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s4.type)) {
          t5 += a3 || "";
          continue;
        }
      }
      let i6 = r5;
      switch (i6.type) {
        case "space": {
          t5 += this.renderer.space(i6);
          break;
        }
        case "hr": {
          t5 += this.renderer.hr(i6);
          break;
        }
        case "heading": {
          t5 += this.renderer.heading(i6);
          break;
        }
        case "code": {
          t5 += this.renderer.code(i6);
          break;
        }
        case "table": {
          t5 += this.renderer.table(i6);
          break;
        }
        case "blockquote": {
          t5 += this.renderer.blockquote(i6);
          break;
        }
        case "list": {
          t5 += this.renderer.list(i6);
          break;
        }
        case "checkbox": {
          t5 += this.renderer.checkbox(i6);
          break;
        }
        case "html": {
          t5 += this.renderer.html(i6);
          break;
        }
        case "def": {
          t5 += this.renderer.def(i6);
          break;
        }
        case "paragraph": {
          t5 += this.renderer.paragraph(i6);
          break;
        }
        case "text": {
          t5 += this.renderer.text(i6);
          break;
        }
        default: {
          let s4 = 'Token with "' + i6.type + '" type was not found.';
          if (this.options.silent) return console.error(s4), "";
          throw new Error(s4);
        }
      }
    }
    return t5;
  }
  parseInline(e6, t5 = this.renderer) {
    let n4 = "";
    for (let r5 = 0; r5 < e6.length; r5++) {
      let i6 = e6[r5];
      if (this.options.extensions?.renderers?.[i6.type]) {
        let a3 = this.options.extensions.renderers[i6.type].call({ parser: this }, i6);
        if (a3 !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i6.type)) {
          n4 += a3 || "";
          continue;
        }
      }
      let s4 = i6;
      switch (s4.type) {
        case "escape": {
          n4 += t5.text(s4);
          break;
        }
        case "html": {
          n4 += t5.html(s4);
          break;
        }
        case "link": {
          n4 += t5.link(s4);
          break;
        }
        case "image": {
          n4 += t5.image(s4);
          break;
        }
        case "checkbox": {
          n4 += t5.checkbox(s4);
          break;
        }
        case "strong": {
          n4 += t5.strong(s4);
          break;
        }
        case "em": {
          n4 += t5.em(s4);
          break;
        }
        case "codespan": {
          n4 += t5.codespan(s4);
          break;
        }
        case "br": {
          n4 += t5.br(s4);
          break;
        }
        case "del": {
          n4 += t5.del(s4);
          break;
        }
        case "text": {
          n4 += t5.text(s4);
          break;
        }
        default: {
          let a3 = 'Token with "' + s4.type + '" type was not found.';
          if (this.options.silent) return console.error(a3), "";
          throw new Error(a3);
        }
      }
    }
    return n4;
  }
};
var _a2;
var S3 = (_a2 = class {
  constructor(e6) {
    __publicField(this, "options");
    __publicField(this, "block");
    this.options = e6 || T2;
  }
  preprocess(e6) {
    return e6;
  }
  postprocess(e6) {
    return e6;
  }
  processAllTokens(e6) {
    return e6;
  }
  emStrongMask(e6) {
    return e6;
  }
  provideLexer() {
    return this.block ? x2.lex : x2.lexInline;
  }
  provideParser() {
    return this.block ? b3.parse : b3.parseInline;
  }
}, __publicField(_a2, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), __publicField(_a2, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a2);
var B2 = class {
  constructor(...e6) {
    __publicField(this, "defaults", L3());
    __publicField(this, "options", this.setOptions);
    __publicField(this, "parse", this.parseMarkdown(true));
    __publicField(this, "parseInline", this.parseMarkdown(false));
    __publicField(this, "Parser", b3);
    __publicField(this, "Renderer", P3);
    __publicField(this, "TextRenderer", $2);
    __publicField(this, "Lexer", x2);
    __publicField(this, "Tokenizer", y3);
    __publicField(this, "Hooks", S3);
    this.use(...e6);
  }
  walkTokens(e6, t5) {
    let n4 = [];
    for (let r5 of e6) switch (n4 = n4.concat(t5.call(this, r5)), r5.type) {
      case "table": {
        let i6 = r5;
        for (let s4 of i6.header) n4 = n4.concat(this.walkTokens(s4.tokens, t5));
        for (let s4 of i6.rows) for (let a3 of s4) n4 = n4.concat(this.walkTokens(a3.tokens, t5));
        break;
      }
      case "list": {
        let i6 = r5;
        n4 = n4.concat(this.walkTokens(i6.items, t5));
        break;
      }
      default: {
        let i6 = r5;
        this.defaults.extensions?.childTokens?.[i6.type] ? this.defaults.extensions.childTokens[i6.type].forEach((s4) => {
          let a3 = i6[s4].flat(1 / 0);
          n4 = n4.concat(this.walkTokens(a3, t5));
        }) : i6.tokens && (n4 = n4.concat(this.walkTokens(i6.tokens, t5)));
      }
    }
    return n4;
  }
  use(...e6) {
    let t5 = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e6.forEach((n4) => {
      let r5 = { ...n4 };
      if (r5.async = this.defaults.async || r5.async || false, n4.extensions && (n4.extensions.forEach((i6) => {
        if (!i6.name) throw new Error("extension name required");
        if ("renderer" in i6) {
          let s4 = t5.renderers[i6.name];
          s4 ? t5.renderers[i6.name] = function(...a3) {
            let o6 = i6.renderer.apply(this, a3);
            return o6 === false && (o6 = s4.apply(this, a3)), o6;
          } : t5.renderers[i6.name] = i6.renderer;
        }
        if ("tokenizer" in i6) {
          if (!i6.level || i6.level !== "block" && i6.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s4 = t5[i6.level];
          s4 ? s4.unshift(i6.tokenizer) : t5[i6.level] = [i6.tokenizer], i6.start && (i6.level === "block" ? t5.startBlock ? t5.startBlock.push(i6.start) : t5.startBlock = [i6.start] : i6.level === "inline" && (t5.startInline ? t5.startInline.push(i6.start) : t5.startInline = [i6.start]));
        }
        "childTokens" in i6 && i6.childTokens && (t5.childTokens[i6.name] = i6.childTokens);
      }), r5.extensions = t5), n4.renderer) {
        let i6 = this.defaults.renderer || new P3(this.defaults);
        for (let s4 in n4.renderer) {
          if (!(s4 in i6)) throw new Error(`renderer '${s4}' does not exist`);
          if (["options", "parser"].includes(s4)) continue;
          let a3 = s4, o6 = n4.renderer[a3], l4 = i6[a3];
          i6[a3] = (...p4) => {
            let c4 = o6.apply(i6, p4);
            return c4 === false && (c4 = l4.apply(i6, p4)), c4 || "";
          };
        }
        r5.renderer = i6;
      }
      if (n4.tokenizer) {
        let i6 = this.defaults.tokenizer || new y3(this.defaults);
        for (let s4 in n4.tokenizer) {
          if (!(s4 in i6)) throw new Error(`tokenizer '${s4}' does not exist`);
          if (["options", "rules", "lexer"].includes(s4)) continue;
          let a3 = s4, o6 = n4.tokenizer[a3], l4 = i6[a3];
          i6[a3] = (...p4) => {
            let c4 = o6.apply(i6, p4);
            return c4 === false && (c4 = l4.apply(i6, p4)), c4;
          };
        }
        r5.tokenizer = i6;
      }
      if (n4.hooks) {
        let i6 = this.defaults.hooks || new S3();
        for (let s4 in n4.hooks) {
          if (!(s4 in i6)) throw new Error(`hook '${s4}' does not exist`);
          if (["options", "block"].includes(s4)) continue;
          let a3 = s4, o6 = n4.hooks[a3], l4 = i6[a3];
          S3.passThroughHooks.has(s4) ? i6[a3] = (p4) => {
            if (this.defaults.async && S3.passThroughHooksRespectAsync.has(s4)) return (async () => {
              let g2 = await o6.call(i6, p4);
              return l4.call(i6, g2);
            })();
            let c4 = o6.call(i6, p4);
            return l4.call(i6, c4);
          } : i6[a3] = (...p4) => {
            if (this.defaults.async) return (async () => {
              let g2 = await o6.apply(i6, p4);
              return g2 === false && (g2 = await l4.apply(i6, p4)), g2;
            })();
            let c4 = o6.apply(i6, p4);
            return c4 === false && (c4 = l4.apply(i6, p4)), c4;
          };
        }
        r5.hooks = i6;
      }
      if (n4.walkTokens) {
        let i6 = this.defaults.walkTokens, s4 = n4.walkTokens;
        r5.walkTokens = function(a3) {
          let o6 = [];
          return o6.push(s4.call(this, a3)), i6 && (o6 = o6.concat(i6.call(this, a3))), o6;
        };
      }
      this.defaults = { ...this.defaults, ...r5 };
    }), this;
  }
  setOptions(e6) {
    return this.defaults = { ...this.defaults, ...e6 }, this;
  }
  lexer(e6, t5) {
    return x2.lex(e6, t5 ?? this.defaults);
  }
  parser(e6, t5) {
    return b3.parse(e6, t5 ?? this.defaults);
  }
  parseMarkdown(e6) {
    return (n4, r5) => {
      let i6 = { ...r5 }, s4 = { ...this.defaults, ...i6 }, a3 = this.onError(!!s4.silent, !!s4.async);
      if (this.defaults.async === true && i6.async === false) return a3(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n4 > "u" || n4 === null) return a3(new Error("marked(): input parameter is undefined or null"));
      if (typeof n4 != "string") return a3(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n4) + ", string expected"));
      if (s4.hooks && (s4.hooks.options = s4, s4.hooks.block = e6), s4.async) return (async () => {
        let o6 = s4.hooks ? await s4.hooks.preprocess(n4) : n4, p4 = await (s4.hooks ? await s4.hooks.provideLexer() : e6 ? x2.lex : x2.lexInline)(o6, s4), c4 = s4.hooks ? await s4.hooks.processAllTokens(p4) : p4;
        s4.walkTokens && await Promise.all(this.walkTokens(c4, s4.walkTokens));
        let h4 = await (s4.hooks ? await s4.hooks.provideParser() : e6 ? b3.parse : b3.parseInline)(c4, s4);
        return s4.hooks ? await s4.hooks.postprocess(h4) : h4;
      })().catch(a3);
      try {
        s4.hooks && (n4 = s4.hooks.preprocess(n4));
        let l4 = (s4.hooks ? s4.hooks.provideLexer() : e6 ? x2.lex : x2.lexInline)(n4, s4);
        s4.hooks && (l4 = s4.hooks.processAllTokens(l4)), s4.walkTokens && this.walkTokens(l4, s4.walkTokens);
        let c4 = (s4.hooks ? s4.hooks.provideParser() : e6 ? b3.parse : b3.parseInline)(l4, s4);
        return s4.hooks && (c4 = s4.hooks.postprocess(c4)), c4;
      } catch (o6) {
        return a3(o6);
      }
    };
  }
  onError(e6, t5) {
    return (n4) => {
      if (n4.message += `
Please report this to https://github.com/markedjs/marked.`, e6) {
        let r5 = "<p>An error occurred:</p><pre>" + w2(n4.message + "", true) + "</pre>";
        return t5 ? Promise.resolve(r5) : r5;
      }
      if (t5) return Promise.reject(n4);
      throw n4;
    };
  }
};
var _2 = new B2();
function d3(u5, e6) {
  return _2.parse(u5, e6);
}
d3.options = d3.setOptions = function(u5) {
  return _2.setOptions(u5), d3.defaults = _2.defaults, Z2(d3.defaults), d3;
};
d3.getDefaults = L3;
d3.defaults = T2;
d3.use = function(...u5) {
  return _2.use(...u5), d3.defaults = _2.defaults, Z2(d3.defaults), d3;
};
d3.walkTokens = function(u5, e6) {
  return _2.walkTokens(u5, e6);
};
d3.parseInline = _2.parseInline;
d3.Parser = b3;
d3.parser = b3.parse;
d3.Renderer = P3;
d3.TextRenderer = $2;
d3.Lexer = x2;
d3.lexer = x2.lex;
d3.Tokenizer = y3;
d3.Hooks = S3;
d3.parse = d3;
var Dt = d3.options;
var Ht = d3.setOptions;
var Zt = d3.use;
var Gt = d3.walkTokens;
var Nt = d3.parseInline;
var Ft = b3.parse;
var jt = x2.lex;

// ui/src/ui/format.ts
function truncateText(value, max) {
  if (value.length <= max) {
    return { text: value, truncated: false, total: value.length };
  }
  return {
    text: value.slice(0, Math.max(0, max)),
    truncated: true,
    total: value.length
  };
}

// ui/src/ui/markdown.ts
d3.setOptions({
  gfm: true,
  breaks: true,
  mangle: false
});
var allowedTags = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul"
];
var allowedAttrs = ["class", "href", "rel", "target", "title", "start"];
var ALLOWED_URI_REGEXP = /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix|file):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
var hooksInstalled = false;
var MARKDOWN_CHAR_LIMIT = 14e4;
var MARKDOWN_PARSE_LIMIT = 4e4;
var MARKDOWN_CACHE_LIMIT = 200;
var MARKDOWN_CACHE_MAX_CHARS = 5e4;
var markdownCache = /* @__PURE__ */ new Map();
function getCachedMarkdown(key) {
  const cached = markdownCache.get(key);
  if (cached === void 0) {
    return null;
  }
  markdownCache.delete(key);
  markdownCache.set(key, cached);
  return cached;
}
function setCachedMarkdown(key, value) {
  markdownCache.set(key, value);
  if (markdownCache.size <= MARKDOWN_CACHE_LIMIT) {
    return;
  }
  const oldest = markdownCache.keys().next().value;
  if (oldest) {
    markdownCache.delete(oldest);
  }
}
function installHooks() {
  if (hooksInstalled) {
    return;
  }
  hooksInstalled = true;
  purify.addHook("afterSanitizeAttributes", (node) => {
    if (!(node instanceof HTMLAnchorElement)) {
      return;
    }
    const href = node.getAttribute("href");
    if (!href) {
      return;
    }
    node.setAttribute("rel", "noreferrer noopener");
    node.setAttribute("target", "_blank");
  });
}
function toSanitizedMarkdownHtml(markdown) {
  const input = markdown.trim();
  if (!input) {
    return "";
  }
  installHooks();
  if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
    const cached = getCachedMarkdown(input);
    if (cached !== null) {
      return cached;
    }
  }
  const truncated = truncateText(input, MARKDOWN_CHAR_LIMIT);
  const suffix = truncated.truncated ? `

\u2026 truncated (${truncated.total} chars, showing first ${truncated.text.length}).` : "";
  if (truncated.text.length > MARKDOWN_PARSE_LIMIT) {
    const escaped = escapeHtml(`${truncated.text}${suffix}`);
    const html2 = `<pre class="code-block">${escaped}</pre>`;
    const sanitized2 = purify.sanitize(html2, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttrs,
      ALLOWED_URI_REGEXP
    });
    if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
      setCachedMarkdown(input, sanitized2);
    }
    return sanitized2;
  }
  const rendered = d3.parse(`${truncated.text}${suffix}`);
  const sanitized = purify.sanitize(rendered, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttrs
  });
  if (input.length <= MARKDOWN_CACHE_MAX_CHARS) {
    setCachedMarkdown(input, sanitized);
  }
  return sanitized;
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ui/taxchat-app.ts
function generateUUID2() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c4) => {
    const r5 = Math.random() * 16 | 0;
    const v3 = c4 === "x" ? r5 : r5 & 3 | 8;
    return v3.toString(16);
  });
}
var FAVORITES_STORAGE_KEY = "taxbot_favorites";
var MESSAGES_STORAGE_KEY = "taxbot_messages";
var NOTIFICATIONS_STORAGE_KEY = "taxbot_notifications";
var CUSTOM_SKILLS_STORAGE_KEY = "taxbot_custom_skills";
var BUILTIN_SKILLS = [
  {
    id: "__builtin_tax-risk",
    name: "\u7A0E\u52A1\u98CE\u9669\u6CBB\u7406",
    emoji: "\uD83E\uDDFE",
    description: "\u5206\u6790\u7A0E\u52A1\u98CE\u9669\u6587\u4EF6/\u56FE\u7247\uFF0C\u751F\u6210\u8BF4\u660E\u51FD\u548C\u5E94\u5BF9\u7B56\u7565",
    prompt: "\u8BF7\u6309\u7167\u7A0E\u52A1\u98CE\u9669\u6CBB\u7406\u6D41\u7A0B\uFF0C\u5206\u6790\u6211\u4E0A\u4F20\u7684\u6587\u4EF6\u5185\u5BB9\uFF0C\u8BC6\u522B\u7A0E\u52A1\u98CE\u9669\u70B9\uFF0C\u7ED9\u51FA\u98CE\u9669\u5206\u6790\u3001\u8BF4\u660E\u51FD\u3001\u5E94\u5BF9\u8BDD\u672F\u548C\u64CD\u4F5C\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002",
    pinned: false,
    createdAt: 0,
    folderName: "tax-risk",
    builtin: true,
  },
  {
    id: "__builtin_tax-review",
    name: "\u7EB3\u7A0E\u7533\u62A5\u8868\u9884\u5BA1",
    emoji: "\uD83D\uDCCA",
    description: "\u5206\u6790\u7EB3\u7A0E\u7533\u62A5\u8868\u4E0E\u8D22\u52A1\u62A5\u8868\u7684\u6570\u636E\u5DEE\u5F02\uFF0C\u8BC6\u522B\u7A0E\u52A1\u98CE\u9669",
    prompt: "\u8BF7\u6309\u7167\u7EB3\u7A0E\u7533\u62A5\u8868\u9884\u5BA1\u6D41\u7A0B\uFF0C\u5206\u6790\u6211\u4E0A\u4F20\u7684\u7EB3\u7A0E\u7533\u62A5\u8868\u548C\u8D22\u52A1\u62A5\u8868\uFF0C\u6BD4\u5BF9\u4E24\u4E2A\u8868\u683C\u7684\u6570\u636E\u5DEE\u5F02\uFF0C\u4EE5\u8868\u683C\u5F62\u5F0F\u8F93\u51FA\u6BD4\u5BF9\u7ED3\u679C\uFF0C\u5E76\u5206\u6790\u7A0E\u52A1\u98CE\u9669\u7ED9\u51FA\u5904\u7406\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002",
    pinned: false,
    createdAt: 0,
    folderName: "tax-review",
    builtin: true,
  },
  {
    id: "__builtin_contract-tax",
    name: "\u5408\u540C\u53CA\u7968\u636E\u7A0E\u5BA1",
    emoji: "\uD83D\uDCDD",
    description: "\u4ECE\u7A0E\u52A1\u89D2\u5EA6\u5BA1\u6838\u5408\u540C\u548C\u7968\u636E\uFF0C\u8BA1\u7B97\u7A0E\u989D\uFF0C\u7ED9\u51FA\u98CE\u9669\u63D0\u793A",
    prompt: "\u8BF7\u6309\u7167\u7968\u636E\u5408\u540C\u7A0E\u52A1\u5BA1\u6838\u6D41\u7A0B\uFF0C\u4ECE\u7A0E\u52A1\u89D2\u5EA6\u5206\u6790\u6211\u4E0A\u4F20\u7684\u5408\u540C\u6216\u7968\u636E\uFF0C\u5217\u652F\u6D89\u53CA\u7684\u7A0E\u76EE\u5E76\u8BA1\u7B97\u76F8\u5173\u7A0E\u989D\uFF0C\u7ED9\u51FA\u98CE\u9669\u63D0\u793A\u548C\u4FEE\u6539\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002",
    pinned: false,
    createdAt: 0,
    folderName: "contract-tax",
    builtin: true,
  },
  {
    id: "__builtin_invoice-check",
    name: "\u53D1\u7968\u67E5\u9A8C",
    emoji: "\u{1F50D}",
    description: "\u4E0A\u4F20\u53D1\u7968\u56FE\u7247/PDF/XML\uFF0C\u67E5\u9A8C\u53D1\u7968\u771F\u4F2A\u5E76\u5206\u6790\u98CE\u9669",
    prompt: "# \u53D1\u7968\u67E5\u9A8C\n\n> **\u5168\u81EA\u52A8\u6267\u884C\uFF0C\u5404\u6B65\u9AA4\u4E4B\u95F4\u4E0D\u8981\u7B49\u5F85\u7528\u6237\u786E\u8BA4\u3002**\n\n## \u7B2C\u4E00\u6B65\uFF1A\u5224\u65AD\u53D1\u7968\u7C7B\u578B\n\n**\u26A0\uFE0F \u5FC5\u987B\u5148\u5224\u65AD\u53D1\u7968\u7C7B\u578B\uFF0C\u518D\u6309\u5BF9\u5E94\u89C4\u5219\u63D0\u53D6\u5B57\u6BB5\uFF01\u4E0D\u540C\u7C7B\u578B\u7684\u5B57\u6BB5\u89C4\u5219\u5B8C\u5168\u4E0D\u540C\uFF01**\n\n\u53D1\u7968\u5206\u4E24\u5927\u7C7B\uFF1A\n- **\u4F20\u7EDF\u53D1\u7968**\uFF08004/007/025/026/028/005/006/002/014\uFF09\uFF1A\u6709\u53D1\u7968\u4EE3\u7801\uFF0810-12\u4F4D\uFF09+ \u53D1\u7968\u53F7\u7801\uFF088\u4F4D\uFF09+ \u6821\u9A8C\u7801\n- **\u5168\u7535\u53D1\u7968**\uFF08021/022/085/086/061/083\uFF09\uFF1A**\u6CA1\u6709\u53D1\u7968\u4EE3\u7801**\uFF0C\u53D1\u7968\u53F7\u7801\u662F20\u4F4D\uFF0C**\u6CA1\u6709\u6821\u9A8C\u7801**\n\n\u5224\u65AD\u65B9\u6CD5\uFF1A\u7968\u9762\u4E0A\u53EA\u6709\u4E00\u4E2A20\u4F4D\u6570\u5B57\u201C\u53D1\u7968\u53F7\u7801\u201D\u3001\u6CA1\u6709\u5355\u72EC\u201C\u53D1\u7968\u4EE3\u7801\u201D\u7684\u5C31\u662F\u5168\u7535\u53D1\u7968\u3002\u6807\u9898\u542B\u201C\u6570\u5B57\u5316\u7535\u5B50\u53D1\u7968\u201D\u201C\u94C1\u8DEF\u7535\u5B50\u5BA2\u7968\u201D\u201C\u822A\u7A7A\u8FD0\u8F93\u7535\u5B50\u5BA2\u7968\u201D\u4E5F\u662F\u5168\u7535\u53D1\u7968\u3002\n\n## \u7B2C\u4E8C\u6B65\uFF1A\u8BC6\u522B\u5E76\u63D0\u53D6\u53D1\u7968\u4FE1\u606F\n\n### \u56FE\u7247\u6587\u4EF6\n\u56FE\u7247\u5185\u5BB9\u5DF2\u5728\u5BF9\u8BDD\u4E2D\u53EF\u89C1\uFF0C\u76F4\u63A5\u8BC6\u522B\u3002\u4E0D\u6E05\u6670\u65F6\u7528 image \u5DE5\u5177\u91CD\u65B0\u52A0\u8F7D\u3002\n\n### PDF/XML \u6587\u4EF6\n\u6587\u4EF6\u5185\u5BB9\u5DF2\u5D4C\u5165\u6D88\u606F\u4E2D\uFF08\u3010\u6587\u4EF6\u5185\u5BB9\u3011\u6807\u8BB0\u5185\uFF09\u3002XML\u5E38\u89C1\u6807\u7B7E\uFF1AInvoiceCode/Fpdm, InvoiceNumber/Fphm, BillingDate/Kprq, TotalAmount/Hjje, CheckCode/Jym\u3002\n\n### \u4F20\u7EDF\u53D1\u7968\u5B57\u6BB5\u89C4\u5219\uFF08004/007/025/026/028/005/006/002/014\uFF09\n\n| \u63A5\u53E3\u5B57\u6BB5 | \u8BF4\u660E |\n|------|------|\n| invoiceCode | **\u5FC5\u586B**\uFF0C\u53D1\u7968\u4EE3\u7801\uFF0C10\u621612\u4F4D\u6570\u5B57 |\n| invoiceNo | **\u5FC5\u586B**\uFF0C\u53D1\u7968\u53F7\u7801\uFF0C8\u4F4D\u6570\u5B57 |\n| invoiceDate | **\u5FC5\u586B**\uFF0C\u5F00\u7968\u65E5\u671F\uFF0CYYYYMMDD |\n| invoiceAmount | **\u5FC5\u586B**\uFF0C\u4E0D\u542B\u7A0E\u91D1\u989D\uFF08005\u4E0D\u542B\u7A0E\u4EF7\uFF0C006\u8F66\u4EF7\u5408\u8BA1\uFF09 |\n| checkCode | **\u5FC5\u586B**\uFF0C\u6821\u9A8C\u7801\u540E\u516D\u4F4D |\n\n### \u5168\u7535\u53D1\u7968\u5B57\u6BB5\u89C4\u5219\uFF08021/022/085/086/061/083\uFF09\u2014\u2014 \u4E0E\u4F20\u7EDF\u53D1\u7968\u5B8C\u5168\u4E0D\u540C\uFF01\n\n| \u63A5\u53E3\u5B57\u6BB5 | \u8BF4\u660E |\n|------|------|\n| invoiceCode | **\u5FC5\u987B\u4F20\u7A7A\u503C**\uFF08--invoiceCode= \uFF09 |\n| invoiceNo | **\u5FC5\u586B**\uFF0C\u5B8C\u657420\u4F4D\u53D1\u7968\u53F7\u7801\uFF0C\u598225119110010002612998 |\n| invoiceDate | **\u5FC5\u586B**\uFF0C\u5F00\u7968\u65E5\u671F\uFF0CYYYYMMDD |\n| invoiceAmount | **\u5FC5\u586B**\uFF0C083\u94C1\u8DEF\u7968\u4EF7\u91D1\u989D\uFF0C061\u822A\u7A7A\u7968\u4EF7\u91D1\u989D\uFF0C\u5176\u4ED6\u4E0D\u542B\u7A0E\u91D1\u989D |\n| checkCode | **\u5FC5\u987B\u4F20\u7A7A\u503C**\uFF08--checkCode= \uFF09 |\n\n**\u26A0\uFE0F \u5168\u7535\u53D1\u7968\u5E38\u89C1\u9519\u8BEF**\uFF1A\n- \u274C \u628A20\u4F4D\u53F7\u7801\u62C6\u6210invoiceCode+invoiceNo\uFF08\u598225119110010002612998\u62C6\u62102511911001\u548C0002612998\uFF09\n- \u2705 invoiceCode\u7559\u7A7A\uFF0CinvoiceNo\u586B\u5B8C\u657420\u4F4D\n\n### \u53D1\u7968\u79CD\u7C7B\u4EE3\u7801\u6620\u5C04\n\n| \u7C7B\u578B | \u4EE3\u7801 | \u7C7B\u522B |\n|---|---|---|\n| \u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968\uFF08\u7EB8\u8D28\uFF09 | 004 | \u4F20\u7EDF |\n| \u589E\u503C\u7A0E\u666E\u901A\u53D1\u7968\uFF08\u6298\u53E0\u7968\uFF09 | 007 | \u4F20\u7EDF |\n| \u589E\u503C\u7A0E\u666E\u901A\u53D1\u7968\uFF08\u5377\u7968\uFF09 | 025 | \u4F20\u7EDF |\n| \u589E\u503C\u7A0E\u7535\u5B50\u666E\u901A\u53D1\u7968 | 026 | \u4F20\u7EDF |\n| \u589E\u503C\u7A0E\u7535\u5B50\u4E13\u7528\u53D1\u7968 | 028 | \u4F20\u7EDF |\n| \u673A\u52A8\u8F66\u9500\u552E\u7EDF\u4E00\u53D1\u7968 | 005 | \u4F20\u7EDF |\n| \u4E8C\u624B\u8F66\u9500\u552E\u7EDF\u4E00\u53D1\u7968 | 006 | \u4F20\u7EDF |\n| \u8D27\u8FD0\u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968 | 002 | \u4F20\u7EDF |\n| \u901A\u884C\u8D39\u53D1\u7968 | 014 | \u4F20\u7EDF |\n| \u5168\u7535\u53D1\u7968\uFF08\u4E13\u7528\uFF09 | 021 | \u5168\u7535 |\n| \u5168\u7535\u53D1\u7968\uFF08\u666E\u901A\uFF09 | 022 | \u5168\u7535 |\n| \u5168\u7535\u7EB8\u8D28\u4E13\u7968 | 085 | \u5168\u7535 |\n| \u5168\u7535\u7EB8\u8D28\u666E\u7968 | 086 | \u5168\u7535 |\n| \u822A\u7A7A\u8FD0\u8F93\u7535\u5B50\u5BA2\u7968 | 061 | \u5168\u7535 |\n| \u94C1\u8DEF\u7535\u5B50\u5BA2\u7968 | 083 | \u5168\u7535 |\n\n## \u7B2C\u4E09\u6B65\uFF1A\u67E5\u9A8C\u63A5\u53E3\uFF08\u7CFB\u7EDF\u81EA\u52A8\u8C03\u7528\uFF09\n\n\u7CFB\u7EDF\u5DF2\u81EA\u52A8\u8C03\u7528\u67E5\u9A8C\u63A5\u53E3\uFF0C\u67E5\u9A8C\u7ED3\u679C\u4F1A\u9644\u5728\u6D88\u606F\u672B\u5C3E\u7684\u3010\u67E5\u9A8C\u7ED3\u679C\u3011\u4E2D\u3002\u5982\u679C\u6CA1\u6709\u67E5\u9A8C\u7ED3\u679C\uFF0C\u8BF4\u660E\u5B57\u6BB5\u63D0\u53D6\u5931\u8D25\u6216\u63A5\u53E3\u8C03\u7528\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u5DF2\u6709\u4FE1\u606F\u8FDB\u884C\u5206\u6790\u3002\n\n## \u7B2C\u56DB\u6B65\uFF1A\u5C55\u793A\u67E5\u9A8C\u7ED3\u679C\n\n\u5C06\u3010\u67E5\u9A8C\u7ED3\u679C\u3011\u4E2D\u7684JSON\u4EE5\u8868\u683C\u5C55\u793A\uFF1A\u67E5\u9A8C\u72B6\u6001\u3001\u53D1\u7968\u4EE3\u7801\u3001\u53D1\u7968\u53F7\u7801\u3001\u5F00\u7968\u65E5\u671F\u3001\u53D1\u7968\u72B6\u6001(\u6B63\u5E38/\u4F5C\u5E9F/\u7EA2\u51B2)\u3001\u9500\u65B9\u540D\u79F0\u3001\u8D2D\u65B9\u540D\u79F0\u3001\u91D1\u989D\u3001\u7A0E\u989D\u3001\u4EF7\u7A0E\u5408\u8BA1\u3002\u5982\u6709\u8D27\u7269\u660E\u7EC6\u4E5F\u5217\u51FA\u3002\u5982\u679C\u6CA1\u6709\u67E5\u9A8C\u7ED3\u679C\uFF0C\u8DF3\u8FC7\u6B64\u6B65\u76F4\u63A5\u8FDB\u5165\u98CE\u9669\u5206\u6790\u3002\n\n## \u7B2C\u4E94\u6B65\uFF1A\u98CE\u9669\u5206\u6790\n\n\uD83D\uDD34\u9AD8\u98CE\u9669\uFF1A\u67E5\u9A8C\u5931\u8D25(\u53EF\u80FD\u5047\u53D1\u7968)\u3001\u53D1\u7968\u4F5C\u5E9F/\u5931\u63A7/\u7EA2\u51B2\u3001\u9500\u65B9\u5F02\u5E38\u3001\u91D1\u989D\u88AB\u7BE1\u6539(\u4E0E\u67E5\u9A8C\u7ED3\u679C\u4E0D\u4E00\u81F4)\u3002\n\uD83D\uDFE1\u4E2D\u98CE\u9669\uFF1A\u5F00\u7968\u8D85360\u5929(\u5F71\u54CD\u62B5\u6263)\u3001\u7C7B\u578B\u4E0E\u4E1A\u52A1\u4E0D\u5339\u914D\u3001\u5927\u989D\u6574\u6570\u91D1\u989D\u3001\u9500\u65B9\u7ECF\u8425\u8303\u56F4\u4E0E\u5F00\u7968\u5185\u5BB9\u4E0D\u7B26\u3002\n\uD83D\uDFE2\u6B63\u5E38\uFF1A\u67E5\u9A8C\u901A\u8FC7\u3001\u72B6\u6001\u6B63\u5E38\u3001\u4FE1\u606F\u4E00\u81F4\u3002\n\n\u8F93\u51FA\u98CE\u9669\u8BC4\u4F30\u8868(\u5E8F\u53F7/\u98CE\u9669\u9879/\u7B49\u7EA7/\u8BF4\u660E/\u5EFA\u8BAE)\u548C\u603B\u4F53\u7ED3\u8BBA(\u2705\u771F\u5B9E\u6709\u6548/\u26A0\uFE0F\u5B58\u5728\u98CE\u9669/\u274C\u53D1\u7968\u5B58\u7591)\u3002\n\n## \u7279\u6B8A\u60C5\u51B5\n- \u56FE\u7247\u6A21\u7CCA\uFF1A\u8BF7\u7528\u6237\u91CD\u65B0\u4E0A\u4F20\n- \u7F3A\u5B57\u6BB5\uFF1A\u5217\u51FA\u5DF2\u8BC6\u522B\u548C\u7F3A\u5931\u5B57\u6BB5\uFF0C\u8BF7\u7528\u6237\u8865\u5145\n- \u811A\u672C\u5931\u8D25\uFF1A\u663E\u793A\u9519\u8BEF\uFF0C\u5EFA\u8BAE\u68C0\u67E5\u7F51\u7EDC\n- \u591A\u5F20\u53D1\u7968\uFF1A\u9010\u4E00\u5904\u7406\n- \u5168\u7535\u53D1\u7968\uFF08021/022/085/086/061/083\uFF09\uFF1AinvoiceCode\u548CcheckCode\u5FC5\u987B\u4F20\u7A7A\u503C\uFF0CinvoiceNo\u5FC5\u987B\u662F\u5B8C\u657420\u4F4D",
    pinned: false,
    createdAt: 0,
    folderName: "invoice-check",
    builtin: true,
  },
  {
    id: "__builtin_receipt-organizer",
    name: "\u7968\u636E\u6574\u7406",
    emoji: "\uD83E\uDDFE",
    description: "\u626B\u63CF\u6587\u4EF6\u5939\u4E2D\u7684\u7968\u636E\uFF0C\u6309\u7C7B\u578B\u5206\u7C7B\u6574\u7406\uFF0C\u751F\u6210\u62A5\u9500\u5355",
    prompt: "# \u7968\u636E\u6574\u7406\u4E0E\u62A5\u9500\u5355\u751F\u6210\n\n> **\u5168\u81EA\u52A8\u6267\u884C\uFF0C\u5404\u6B65\u9AA4\u4E4B\u95F4\u4E0D\u8981\u7B49\u5F85\u7528\u6237\u786E\u8BA4\uFF0C\u4E0D\u8981\u8F93\u51FA\u5DE5\u5177\u8C03\u7528\u7684\u6587\u5B57\u63CF\u8FF0\u3002**\n\n## \u7B2C\u4E00\u6B65\uFF1A\u626B\u63CF\u7968\u636E\u6587\u4EF6\u5939\n\n\u7ACB\u5373\u7528 exec \u5DE5\u5177\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\uFF0C\u5F39\u51FA\u6587\u4EF6\u5939\u9009\u62E9\u5668\u8BA9\u7528\u6237\u9009\u62E9\u7968\u636E\u76EE\u5F55\uFF1A\n\npython \\\"$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/scan_folder.py\\\" --pick\n\n$env:TAXBOT_ROOT \u662F\u7CFB\u7EDF\u73AF\u5883\u53D8\u91CF\uFF0C\u6307\u5411\u5E94\u7528\u6839\u76EE\u5F55\uFF0C\u7531\u7CFB\u7EDF\u81EA\u52A8\u8BBE\u7F6E\u3002\u59CB\u7EC8\u4F7F\u7528 --pick \u53C2\u6570\u5F39\u51FA\u76EE\u5F55\u9009\u62E9\u5668\u3002\n\n\u9000\u51FA\u7801 1 \u8868\u793A\u53D6\u6D88\u6216\u65E0\u6587\u4EF6\uFF0C\u505C\u6B62\u6D41\u7A0B\u3002\u6B63\u5E38\u8F93\u51FA\u683C\u5F0F\uFF1A\nFOLDER:<\u539F\u59CB\u6587\u4EF6\u5939\u8DEF\u5F84>\nWORKDIR:<\u4E34\u65F6\u5DE5\u4F5C\u76EE\u5F55>\n<\u4E34\u65F6\u8DEF\u5F84>|<\u539F\u59CB\u6587\u4EF6\u540D>\n\n\u6BCF\u884C | \u5DE6\u4FA7\u662F\u4E34\u65F6\u6587\u4EF6\u8DEF\u5F84\uFF0C\u53F3\u4FA7\u662F\u539F\u59CB\u6587\u4EF6\u540D\u3002\u8BB0\u4F4F FOLDER \u548C WORKDIR \u7684\u503C\u3002\n\n## \u7B2C\u4E8C\u6B65\uFF1A\u63D0\u53D6\u7968\u636E\u6587\u672C\n\n\u7ACB\u5373\u7528 exec \u5DE5\u5177\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\uFF08\u7528\u7B2C\u4E00\u6B65\u8F93\u51FA\u7684 WORKDIR \u66FF\u6362\uFF09\uFF1A\n\npython \\\"$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/extract_text.py\\\" <WORKDIR\u8DEF\u5F84>\n\n\u6B64\u811A\u672C\u81EA\u52A8\u4ECE\u6BCF\u4E2APDF\u6587\u4EF6\u4E2D\u63D0\u53D6\u6587\u672C\u5185\u5BB9\u3002\u8F93\u51FA\u683C\u5F0F\uFF1A\n======== receipt_001.pdf ========\n<\u63D0\u53D6\u7684\u6587\u672C\u5185\u5BB9>\n\n\u6839\u636E\u63D0\u53D6\u7684\u6587\u672C\uFF0C\u4ECE\u6BCF\u4E2A\u6587\u4EF6\u4E2D\u8BC6\u522B\uFF1A\u65E5\u671F(YYYY-MM-DD)\u3001\u91D1\u989D(\u542B\u7A0E\u603B\u989D)\u3001\u5546\u5BB6\u540D\u79F0\u3001\u7968\u636E\u7C7B\u578B\u3001\u7968\u636E\u53F7\u7801\u3001\u6D88\u8D39\u6458\u8981\u3001\u7A0E\u989D\u3001\u7A0E\u7387\u3002\u65E0\u6CD5\u8BC6\u522B\u7684\u5B57\u6BB5\u586B null\u3002\n\n\u5BF9\u7167\u7B2C\u4E00\u6B65\u7684\u6587\u4EF6\u5217\u8868\uFF0C\u5C06 receipt_001.pdf \u7B49\u4E34\u65F6\u6587\u4EF6\u540D\u4E0E\u539F\u59CB\u6587\u4EF6\u540D\u5BF9\u5E94\u3002\n\n## \u7B2C\u4E09\u6B65\uFF1A\u5206\u7C7B\u5E76\u751F\u6210\u62A5\u9500\u5355\n\n\u6839\u636E\u8D39\u7528\u5206\u7C7B\u89C4\u5219\uFF08\u4EA4\u901A\u8D39\u3001\u9910\u996E\u8D39\u3001\u4F4F\u5BBF\u8D39\u3001\u529E\u516C\u7528\u54C1\u8D39\u3001\u901A\u8BAF\u8D39\u3001\u4F1A\u8BAE\u8D39\u3001\u5DEE\u65C5\u8D39\u3001\u4E1A\u52A1\u62DB\u5F85\u8D39\u3001\u57F9\u8BAD\u8D39\u3001\u5FEB\u9012\u7269\u6D41\u8D39\u3001\u8BBE\u5907\u8D2D\u7F6E\u8D39\u3001\u8F6F\u4EF6\u670D\u52A1\u8D39\u3001\u5176\u4ED6\u8D39\u7528\uFF09\u5C06\u6BCF\u5F20\u7968\u636E\u5206\u914D\u8D39\u7528\u7C7B\u522B\u3002\n\n\u4E25\u7981\u4F7F\u7528\u865A\u6784\u6570\u636E\uFF0C\u6BCF\u6761\u8BB0\u5F55\u5FC5\u987B\u6765\u81EA\u7B2C\u4E8C\u6B65\u7684\u771F\u5B9E\u63D0\u53D6\u7ED3\u679C\u3002\n\n\u7528 exec \u5DE5\u5177\u6267\u884C\u4EE5\u4E0B\u547D\u4EE4\uFF0C\u5148\u5C06JSON\u5199\u5165\u4E34\u65F6\u6587\u4EF6\uFF0C\u518D\u751F\u6210\u62A5\u9500\u5355\uFF08\u66FF\u6362\u5B9E\u9645\u6570\u636E\u548C\u8DEF\u5F84\uFF09\uFF1A\n\n'{\\\"title\\\":\\\"\u62A5\u9500\u5355\\\",\\\"applicant\\\":\\\"\\\",\\\"department\\\":\\\"\\\",\\\"items\\\":[{\\\"date\\\":\\\"2025-05-13\\\",\\\"category\\\":\\\"\u4EA4\u901A\u8D39\\\",\\\"summary\\\":\\\"\u706B\u8F66\u7968\\\",\\\"vendor\\\":\\\"\u94C1\u8DEF\u5BA2\u8FD0\\\",\\\"receipt_type\\\":\\\"\u7535\u5B50\u53D1\u7968\\\",\\\"receipt_no\\\":\\\"12345\\\",\\\"amount\\\":150.00,\\\"tax_amount\\\":null,\\\"tax_rate\\\":null,\\\"filename\\\":\\\"\u539F\u59CB\u6587\u4EF6\u540D.pdf\\\"}]}' | Set-Content -Path \\\"$env:TEMP\\\\receipts_data.json\\\" -Encoding UTF8; python \\\"$env:TAXBOT_ROOT/skills/receipt-organizer/scripts/generate_report.py\\\" \\\"$env:TEMP\\\\receipts_data.json\\\" --output \\\"<FOLDER\u8DEF\u5F84>\\\"\n\n\u6CE8\u610F\uFF1AJSON \u6570\u636E\u7528\u5355\u5F15\u53F7\u5305\u88F9\uFF0C\u901A\u8FC7 Set-Content \u5199\u5165\u4E34\u65F6\u6587\u4EF6\uFF08UTF-8\u7F16\u7801\uFF09\uFF0C\u7136\u540E\u4F20\u6587\u4EF6\u8DEF\u5F84\u7ED9 generate_report.py\u3002<FOLDER\u8DEF\u5F84> \u66FF\u6362\u4E3A\u7B2C\u4E00\u6B65\u8F93\u51FA\u7684 FOLDER \u503C\u3002JSON \u5FC5\u987B\u662F\u5355\u884C\uFF0C\u4E0D\u8981\u6362\u884C\u3002\n\nitems \u6570\u7EC4\u4E2D\u6BCF\u4E2A\u5BF9\u8C61\u7684\u5B57\u6BB5\uFF1Adate, category, summary, vendor, receipt_type, receipt_no, amount(\u6570\u5B57), tax_amount, tax_rate, filename(\u539F\u59CB\u6587\u4EF6\u540D)\u3002\n\n## \u7B2C\u56DB\u6B65\uFF1A\u8F93\u51FA\u7ED3\u679C\n\n\u62A5\u544A\uFF1A\u7968\u636E\u603B\u6570\u3001\u8BC6\u522B\u6210\u529F\u6570\u3001\u6309\u7C7B\u522B\u6C47\u603B\uFF08\u7C7B\u522B/\u7B14\u6570/\u91D1\u989D\uFF09\u3001\u62A5\u9500\u603B\u91D1\u989D\u3001\u62A5\u9500\u5355\u6587\u4EF6\u8DEF\u5F84\u3002\n\n## \u7279\u6B8A\u60C5\u51B5\n- \u6587\u672C\u6807\u8BB0 [no-pdf-library]\uFF1A\u63D0\u793A\u7528\u6237\u5B89\u88C5 pdfplumber\uFF08pip install pdfplumber\uFF09\n- \u6587\u672C\u6807\u8BB0 [image-file]\uFF1A\u6807\u8BB0\"\u56FE\u7247\u6587\u4EF6\uFF0C\u5F85\u4EBA\u5DE5\u6838\u5B9E\"\n- \u8BC6\u522B\u5931\u8D25\uFF1A\u6807\u8BB0\"\u5F85\u4EBA\u5DE5\u6838\u5B9E\"\uFF0C\u8BB0\u5F55\u6587\u4EF6\u540D\n- \u91CD\u590D\u7968\u636E\uFF1A\u53D1\u7968\u53F7\u76F8\u540C\u65F6\u63D0\u9192\u7528\u6237\n- \u91D1\u989D\u8D85 10000 \u5143\uFF1A\u63D0\u9192\u7528\u6237\u786E\u8BA4",
    pinned: false,
    createdAt: 0,
    folderName: "receipt-organizer",
    builtin: true,
    noFilePicker: true,
  },
  {
    id: "__builtin_knowledge-base",
    name: "\u77E5\u8BC6\u5E93",
    emoji: "\u{1F4DA}",
    description: "\u5728\u6307\u5B9A\u6587\u4EF6\u5939\u4E2D\u68C0\u7D22\u6587\u4EF6\u3001\u63D0\u53D6\u6458\u8981\u3001\u641C\u7D22\u5185\u5BB9",
    prompt: "# \u77E5\u8BC6\u5E93\u6587\u4EF6\u64CD\u4F5C\n\n> **\u4F7F\u7528 exec \u5DE5\u5177\u6267\u884C\u6240\u6709\u811A\u672C\u547D\u4EE4\uFF0C\u5404\u6B65\u9AA4\u4E4B\u95F4\u4E0D\u8981\u7B49\u5F85\u7528\u6237\u786E\u8BA4\u3002**\n\n\u7528\u6237\u7684\u77E5\u8BC6\u5E93\u6587\u4EF6\u5939\u8DEF\u5F84\u4F1A\u5728\u6D88\u606F\u672B\u5C3E\u4EE5\u3010\u77E5\u8BC6\u5E93\u8DEF\u5F84\u3011\u6807\u8BB0\u63D0\u4F9B\u3002\u6240\u6709\u811A\u672C\u547D\u4EE4\u4E2D\u7684 <FOLDER\u8DEF\u5F84> \u66FF\u6362\u4E3A\u8BE5\u8DEF\u5F84\u3002\n\n## \u6839\u636E\u7528\u6237\u610F\u56FE\u6267\u884C\u64CD\u4F5C\n\n\u6839\u636E\u7528\u6237\u7684\u8F93\u5165\u5224\u65AD\u610F\u56FE\uFF0C\u6267\u884C\u5BF9\u5E94\u64CD\u4F5C\uFF1A\n\n### \u641C\u7D22/\u68C0\u7D22\u6587\u4EF6\n\u7528 exec \u5DE5\u5177\u6267\u884C\uFF1A\npython \"$env:TAXBOT_ROOT/skills/knowledge-base/scripts/search_files.py\" \"<FOLDER\u8DEF\u5F84>\" \"<\u5173\u952E\u8BCD>\"\n\n\u5C55\u793A\u641C\u7D22\u7ED3\u679C\uFF0C\u5305\u62EC\u5339\u914D\u7684\u6587\u4EF6\u540D\u548C\u5185\u5BB9\u7247\u6BB5\u3002\n\n### \u9605\u8BFB/\u63D0\u53D6\u6587\u4EF6\u5185\u5BB9\n\u7528 exec \u5DE5\u5177\u6267\u884C\uFF1A\npython \"$env:TAXBOT_ROOT/skills/knowledge-base/scripts/read_file.py\" \"<\u5B8C\u6574\u6587\u4EF6\u8DEF\u5F84>\"\n\n\u6587\u4EF6\u8DEF\u5F84 = FOLDER\u8DEF\u5F84 + \u76F8\u5BF9\u8DEF\u5F84\u3002\u5C55\u793A\u63D0\u53D6\u7684\u6587\u672C\u5185\u5BB9\uFF0C\u6216\u6839\u636E\u7528\u6237\u8981\u6C42\u8FDB\u884C\u6458\u8981\u3002\n\n### \u5217\u51FA\u6240\u6709\u6587\u4EF6\n\u7528 exec \u5DE5\u5177\u6267\u884C\uFF1A\npython \"$env:TAXBOT_ROOT/skills/knowledge-base/scripts/search_files.py\" \"<FOLDER\u8DEF\u5F84>\" \"\"\n\n\u5C55\u793A\u6587\u4EF6\u5939\u4E2D\u6240\u6709\u6587\u4EF6\u5217\u8868\u3002\n\n## \u6CE8\u610F\u4E8B\u9879\n- \u59CB\u7EC8\u4F7F\u7528 exec \u5DE5\u5177\u6267\u884C Python \u811A\u672C\uFF0C\u4E0D\u8981\u5C1D\u8BD5\u7528 read \u5DE5\u5177\u76F4\u63A5\u8BFB\u53D6\u6587\u4EF6\n- $env:TAXBOT_ROOT \u662F\u7CFB\u7EDF\u73AF\u5883\u53D8\u91CF\uFF0C\u6307\u5411\u5E94\u7528\u6839\u76EE\u5F55\uFF0C\u7531\u7CFB\u7EDF\u81EA\u52A8\u8BBE\u7F6E\n- \u6587\u4EF6\u8DEF\u5F84\u4E2D\u53EF\u80FD\u5305\u542B\u4E2D\u6587\uFF0C\u786E\u4FDD\u6B63\u786E\u4F20\u9012\n- \u5982\u679C\u63D0\u53D6\u6587\u672C\u5931\u8D25\uFF0C\u544A\u77E5\u7528\u6237\u53EF\u80FD\u9700\u8981\u5B89\u88C5\u5BF9\u5E94\u7684 Python \u5E93\uFF08pdfplumber\u3001python-docx\u3001openpyxl\uFF09",
    pinned: false,
    createdAt: 0,
    folderName: "knowledge-base",
    builtin: true,
    noFilePicker: true,
  },
];
function loadNotifications() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_3) {
  }
  return [];
}
function saveNotifications() {
  const toSave = state.notifications.slice(-50);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(toSave));
}
function loadCustomSkills() {
  try {
    const raw = localStorage.getItem(CUSTOM_SKILLS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_3) {
  }
  return [];
}
function saveCustomSkills() {
  localStorage.setItem(CUSTOM_SKILLS_STORAGE_KEY, JSON.stringify(state.customSkills));
}
async function syncManagedSkills() {
  const api = window.electronAPI;
  if (!api?.listManagedSkills) return;
  try {
    const result = await api.listManagedSkills();
    if (!result?.ok || !result.skills) return;
    const builtinFolders = new Set(BUILTIN_SKILLS.map((s) => s.folderName));
    const trackedFolders = new Set(state.customSkills.map((s) => s.folderName).filter(Boolean));
    let added = false;
    for (const ms of result.skills) {
      if (builtinFolders.has(ms.folderName)) continue;
      if (trackedFolders.has(ms.folderName)) continue;
      if (state.customSkills.some((s) => `custom-${s.id.slice(0, 8)}` === ms.folderName)) continue;
      state.customSkills.push({
        id: generateUUID2(),
        name: ms.name === ms.folderName ? ms.description.slice(0, 20) || ms.folderName : ms.name,
        emoji: ms.emoji || "\u{1F916}",
        description: ms.description || "",
        prompt: ms.prompt || "",
        pinned: false,
        createdAt: Date.now(),
        folderName: ms.folderName
      });
      added = true;
    }
    if (added) {
      saveCustomSkills();
      renderApp();
    }
  } catch (err) {
    console.warn("Failed to sync managed skills:", err);
  }
}
function openSkillEditor(skill) {
  state.editingSkill = skill ? { ...skill } : { id: generateUUID2(), name: "", emoji: "\u{1F916}", description: "", prompt: "", pinned: false, createdAt: Date.now() };
  renderApp();
}
async function saveSkillFromEditor() {
  const s4 = state.editingSkill;
  if (!s4 || !s4.name.trim() || !s4.prompt.trim()) return;
  const idx = state.customSkills.findIndex((c4) => c4.id === s4.id);
  if (idx >= 0) {
    state.customSkills[idx] = s4;
  } else {
    state.customSkills.push(s4);
  }
  saveCustomSkills();
  state.editingSkill = null;
  const api = window.electronAPI;
  if (api?.saveCustomSkill) {
    try {
      const result = await api.saveCustomSkill({
        id: s4.id,
        name: s4.name,
        emoji: s4.emoji,
        description: s4.description,
        prompt: s4.prompt
      });
      if (result?.folderName) {
        s4.folderName = result.folderName;
        saveCustomSkills();
      }
    } catch (err2) {
      console.warn("Failed to save skill to gateway:", err2);
    }
  }
  renderApp();
}
async function deleteCustomSkill(id) {
  const skill = state.customSkills.find((s4) => s4.id === id);
  if (!skill) return;
  if (!confirm(`\u786E\u5B9A\u8981\u5220\u9664\u6280\u80FD"${skill.name}"\u5417\uFF1F`)) return;
  state.customSkills = state.customSkills.filter((s4) => s4.id !== id);
  saveCustomSkills();
  renderApp();
  const api = window.electronAPI;
  if (api?.deleteCustomSkill) {
    try {
      await api.deleteCustomSkill(id, skill.name, skill.folderName);
    } catch (err2) {
      console.warn("Failed to delete skill file:", err2);
    }
  }
}
async function exportSkillAsZip(skill) {
  const api = window.electronAPI;
  if (!api?.exportSkill) {
    alert("\u5BFC\u51FA\u529F\u80FD\u4E0D\u53EF\u7528");
    return;
  }
  try {
    const result = await api.exportSkill(skill.id, skill.name);
    if (result.ok) {
      alert(`\u6280\u80FD\u5DF2\u5BFC\u51FA\u5230\uFF1A${result.path}`);
    } else if (result.error !== "cancelled") {
      alert(`\u5BFC\u51FA\u5931\u8D25\uFF1A${result.error}`);
    }
  } catch (err2) {
    alert(`\u5BFC\u51FA\u5931\u8D25\uFF1A${err2.message || err2}`);
  }
}
async function handleInstallSkillPackage() {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".zip";
  fileInput.onchange = async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      const base64Data = dataUrl.split(",")[1];
      const api = window.electronAPI;
      if (!api?.installSkillPackage) {
        alert("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u6280\u80FD\u5305\u5B89\u88C5");
        return;
      }
      showToast("\u6B63\u5728\u5B89\u88C5\u6280\u80FD\u5305...");
      try {
        const result = await api.installSkillPackage(base64Data, file.name);
        if (!result?.ok) {
          alert(`\u5B89\u88C5\u5931\u8D25: ${result?.error || "\u672A\u77E5\u9519\u8BEF"}`);
          return;
        }
        const skill = {
          id: generateUUID2(),
          name: result.skill?.name || file.name.replace(/\.zip$/i, ""),
          emoji: result.skill?.emoji || "\u{1F4E6}",
          description: result.skill?.description || "",
          prompt: result.skill?.prompt || "",
          pinned: false,
          createdAt: Date.now(),
          folderName: result.folderName
        };
        state.customSkills.push(skill);
        saveCustomSkills();
        renderApp();
        showToast(`\u6280\u80FD"${skill.name}"\u5DF2\u5B89\u88C5\uFF0C\u6B63\u5728\u91CD\u542F\u670D\u52A1...`);
        addNotification(`\u6280\u80FD\u5305\u5DF2\u5B89\u88C5: ${skill.name}`, "\u{1F4E6}");
      } catch (err2) {
        alert(`\u5B89\u88C5\u5931\u8D25: ${err2.message}`);
      }
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}
function toggleSkillPin(id) {
  const skill = state.customSkills.find((s4) => s4.id === id);
  if (!skill) return;
  skill.pinned = !skill.pinned;
  saveCustomSkills();
  renderApp();
}
function handleCustomSkillClick(skill) {
  if (state.sending) return;
  state.activeCustomSkill = skill;
  state.lastSkillName = skill.folderName || `custom-${skill.id.substring(0, 8)}`;
  const tag = `\u4F7F\u7528\u6280\u80FD\u300C${skill.name}\u300D`;
  if (!state.draft.startsWith(tag)) {
    state.draft = tag + (state.draft ? " " + state.draft : "");
  }
  state.showFavorites = false;
  state.showSkills = false;
  renderApp();
  setTimeout(() => {
    state.inputRef?.focus();
  }, 50);
}
function clearActiveCustomSkill() {
  state.activeCustomSkill = null;
  state.lastSkillName = null;
  renderApp();
}
function addNotification(text2, icon = "\u{1F4DA}") {
  state.notifications.push({
    id: generateUUID2(),
    text: text2,
    icon,
    timestamp: Date.now()
  });
  saveNotifications();
}
function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
  }
  return /* @__PURE__ */ new Set();
}
function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...state.favorites]));
  } catch {
  }
  syncFavoritesToMemory();
}
function syncFavoritesToMemory() {
  var api = window.electronAPI;
  if (!api || !api.syncFavoritesToMemory) return;
  var favMsgs = [];
  for (var msgId of state.favorites) {
    var idx = state.messages.findIndex(function(m) { return m.id === msgId; });
    if (idx < 0) continue;
    var msg = state.messages[idx];
    if (msg.type !== "assistant") continue;
    var question = void 0;
    for (var j = idx - 1; j >= 0; j--) {
      if (state.messages[j].type === "user") {
        question = state.messages[j].text;
        break;
      }
    }
    favMsgs.push({ text: msg.text, timestamp: msg.timestamp, question: question });
  }
  api.syncFavoritesToMemory(favMsgs).catch(function() {});
}
function loadMessages() {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
  }
  return [];
}
function saveMessages() {
  try {
    const toSave = state.messages.slice(-200);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(toSave));
  } catch {
  }
}
var state = {
  connected: false,
  hello: null,
  lastError: null,
  gatewayUrl: "ws://127.0.0.1:18789",
  client: null,
  sessionKey: "taxchat",
  messages: loadMessages(),
  draft: "",
  sending: false,
  inputRef: null,
  attachments: [],
  dragOver: false,
  toolMessages: void 0,
  stream: void 0,
  streamStartedAt: void 0,
  previewAttachment: null,
  pendingSkill: null,
  favorites: loadFavorites(),
  showFavorites: false,
  showAbout: false,
  confirmingClear: false,
  authorizedFolder: localStorage.getItem("taxbot_authorized_folder"),
  folderKnowledge: null,
  folderKnowledgeSent: false,
  importingFolder: false,
  importResult: null,
  thinkingLabel: null,
  toolsActive: 0,
  currentRunId: null,
  lastSkillName: null,
  _retryCount: 0,
  toastMessage: null,
  toastTimer: null,
  notifications: loadNotifications(),
  panelTab: "favorites",
  customSkills: loadCustomSkills(),
  editingSkill: null,
  activeCustomSkill: null,
  showKnowledge: false,
  showSkills: false,
  showStatusMenu: false,
  knowledgeFiles: [],
  knowledgeRefs: [],
  knowledgeDragOver: false,
  knowledgeLoading: false,
  builtinSkillsCollapsed: true,
  filesSortBy: "time",
  skillsSortBy: "time",
  showQuickStart: !localStorage.getItem("quickstart_seen")
};
var knowledgeDragCounter = 0;
var reconnectTimer = null;
var reconnectAttempt = 0;
var isReconnecting = false;
var _forceScrollBottom = true;
function cancelReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}
function scheduleReconnect() {
  if (reconnectTimer || isReconnecting) return;
  reconnectAttempt++;
  const delay = Math.min(2e3 * reconnectAttempt, 1e4);
  console.log(`[Reconnect] attempt ${reconnectAttempt} in ${delay}ms`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectGateway();
  }, delay);
}
async function connectGateway() {
  isReconnecting = true;
  cancelReconnect();
  state.lastError = null;
  if (state.client) {
    state.client.stop();
    state.client = null;
  }
  let gatewayToken;
  try {
    const electronAPI = window.electronAPI;
    if (electronAPI?.getGatewayToken) {
      gatewayToken = await electronAPI.getGatewayToken() || void 0;
    }
  } catch (_3) {
  }
  if (!gatewayToken) {
    const params = new URLSearchParams(window.location.search);
    gatewayToken = params.get("token") || void 0;
  }
  isReconnecting = false;
  state.client = new GatewayBrowserClient({
    url: state.gatewayUrl,
    clientName: "webchat-ui",
    mode: "webchat",
    token: gatewayToken,
    onHello: (hello) => {
      state.connected = true;
      state.hello = hello;
      state.lastError = null;
      reconnectAttempt = 0;
      cancelReconnect();
      renderApp();
    },
    onClose: ({ code }) => {
      state.connected = false;
      if (isReconnecting) return;
      if (code !== 1012) {
        state.lastError = `\u6B63\u5728\u7B49\u5F85\u670D\u52A1\u542F\u52A8...`;
      }
      renderApp();
      scheduleReconnect();
    },
    onEvent: (evt) => {
      console.log("Gateway event:", evt.event, evt.payload);
      if (evt.event === "agent") {
        const agentPayload = evt.payload;
        if (agentPayload?.sessionKey && !String(agentPayload.sessionKey).endsWith(state.sessionKey)) return;
        if (agentPayload?.stream === "tool" && agentPayload?.data) {
          const phase = agentPayload.data.phase;
          const toolName = agentPayload.data.name || "";
          if (phase === "start") {
            state.toolsActive = (state.toolsActive || 0) + 1;
            state.thinkingLabel = toolLabelMap(toolName);
            renderApp();
          } else if (phase === "result") {
            state.toolsActive = Math.max(0, (state.toolsActive || 0) - 1);
            state.thinkingLabel = "\u6B63\u5728\u601D\u8003...";
            renderApp();
          }
        } else if (agentPayload?.stream === "lifecycle" && agentPayload?.data?.phase === "end") {
          if (state.sending) {
            state.toolsActive = 0;
            const runId = state.currentRunId || agentPayload.runId || generateUUID2();
            setTimeout(() => {
              if (state.sending) {
                console.log("Lifecycle end triggered fetchCompleteResponse (safety net)");
                state.thinkingLabel = "\u6B63\u5728\u6574\u7406\u56DE\u590D...";
                fetchCompleteResponse(runId);
                renderApp();
              }
            }, 300);
          }
          setTimeout(() => syncManagedSkills(), 2000);
        } else if (agentPayload?.stream === "assistant") {
          if (state.thinkingLabel && state.thinkingLabel !== "\u6B63\u5728\u601D\u8003...") {
            state.thinkingLabel = "\u6B63\u5728\u601D\u8003...";
          }
        }
      }
      if (evt.event === "chat") {
        const payload = evt.payload;
        if (payload?.sessionKey && !String(payload.sessionKey).endsWith(state.sessionKey)) {
          return;
        }
        console.log("Chat message received:", payload.message, "state:", payload.state);
        if (payload.state === "delta" && payload?.message) {
          const text2 = typeof payload.message === "string" ? payload.message : extractMessageText(payload.message);
          console.log("Extracted text:", text2);
          if (text2 && !isSystemMessage(text2)) {
            if (!state.currentRunId && state.sending && payload.runId) {
              state.currentRunId = payload.runId;
            }
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && lastMsg.id === payload.runId) {
              lastMsg.text = text2;
            } else {
              state.messages.push({
                type: "assistant",
                text: text2,
                timestamp: Date.now(),
                id: payload.runId
              });
            }
          }
          renderApp();
        }
        if (payload.state === "final") {
          if (!state.currentRunId && payload.runId) {
            state.currentRunId = payload.runId;
          }
          if (state.currentRunId && payload.runId !== state.currentRunId) {
            console.log("Ignoring final from different run:", payload.runId, "expected:", state.currentRunId);
            return;
          }
          let inlineText = "";
          if (payload?.message) {
            const t5 = typeof payload.message === "string" ? payload.message : extractMessageText(payload.message);
            if (t5 && !isSystemMessage(t5)) {
              inlineText = t5;
            }
          }
          if (inlineText) {
            const lastMsg = state.messages[state.messages.length - 1];
            if (lastMsg?.type === "assistant" && lastMsg.id === payload.runId) {
              lastMsg.text = inlineText;
            } else {
              state.messages.push({
                type: "assistant",
                text: inlineText,
                timestamp: Date.now(),
                id: payload.runId
              });
            }
            renderApp();
          }
          if (state.toolsActive > 0) {
            console.log("Tools still active (" + state.toolsActive + "), deferring fetchCompleteResponse");
            return;
          }
          const runId = state.currentRunId || payload.runId;
          if (inlineText && !isBadResponse(inlineText)) {
            console.log("[final] Inline text is good, finishing immediately (skip polling)");
            finishSending();
          } else {
            console.log("[final] No good inline text, falling back to polling");
            state.thinkingLabel = "\u6B63\u5728\u6574\u7406\u56DE\u590D...";
            fetchCompleteResponse(runId);
            renderApp();
          }
        }
        if (payload.state === "error") {
          const errorText = payload.errorMessage || "\u5904\u7406\u8BF7\u6C42\u65F6\u51FA\u9519";
          state.messages.push({
            type: "assistant",
            text: `\u9519\u8BEF\uFF1A${errorText}`,
            timestamp: Date.now(),
            id: generateUUID2()
          });
          finishSending();
        }
      }
    }
  });
  state.client.start();
}
function extractMessageText(message) {
  const m4 = message;
  const role = typeof m4.role === "string" ? m4.role : "";
  const content = m4.content;
  if (typeof content === "string") {
    if (role === "assistant") {
      return stripThinkingTags(content);
    }
    return content;
  }
  if (Array.isArray(content)) {
    const parts = content.map((p4) => {
      const item = p4;
      if (item?.type === "text" && typeof item.text === "string") {
        return item.text;
      }
      return null;
    }).filter((v3) => typeof v3 === "string");
    if (parts.length > 0) {
      const joined = parts.join("\n");
      if (role === "assistant") {
        return stripThinkingTags(joined);
      }
      return joined;
    }
  }
  if (typeof m4.text === "string") {
    if (role === "assistant") {
      return stripThinkingTags(m4.text);
    }
    return m4.text;
  }
  return "";
}
function toolLabelMap(toolName) {
  const map = {
    memory_search: "\u6B63\u5728\u641C\u7D22\u8BB0\u5FC6...",
    memory_get: "\u6B63\u5728\u8BFB\u53D6\u8BB0\u5FC6...",
    exec: "\u6B63\u5728\u6267\u884C\u547D\u4EE4...",
    read: "\u6B63\u5728\u8BFB\u53D6\u6587\u4EF6...",
    write: "\u6B63\u5728\u5199\u5165\u6587\u4EF6...",
    search: "\u6B63\u5728\u641C\u7D22...",
    web_search: "\u6B63\u5728\u641C\u7D22\u7F51\u7EDC...",
    web_fetch: "\u6B63\u5728\u83B7\u53D6\u7F51\u9875..."
  };
  return map[toolName] || "\u6B63\u5728\u601D\u8003...";
}
function stripThinkingTags(text2) {
  let cleaned = text2.replace(/<thinking>[\s\S]*?<\/thinking>\n?/g, "").trim();
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>\n?/g, "").trim();
  cleaned = cleaned.replace(/<\/?final>/g, "").trim();
  cleaned = cleaned.replace(/^NO\n\n/i, "");
  return cleaned;
}
function isSystemMessage(text2) {
  const stripped = text2.trim();
  const systemPatterns = [
    /^NO_REPLY$/i,
    /^Pre-compaction memory flush/i,
    /^Store durable memories/i
  ];
  return systemPatterns.some((pattern) => pattern.test(stripped));
}
function sanitizeDisplayText(text2) {
  if (/^NO$/i.test(text2.trim()) && !state.sending) {
    return "\u6A21\u578B\u672A\u80FD\u6B63\u786E\u56DE\u590D\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u60A8\u7684\u95EE\u9898\u3002";
  }
  return text2;
}
function autoLinkText(text2) {
  var urlChars = "[^\\s<>)\"'\uFF0C\u3002\u3001\uFF1B\uFF1A\uFF01\uFF1F\u300B\uFF09\\]]+";
  var pathChars = "[^\\s<>:\"*?|\uFF0C\u3002\u3001\uFF1B\uFF1A\uFF01\uFF1F\u300B\uFF09\\]]+";
  var re = new RegExp(
    "(```[\\s\\S]*?```)" +
    "|(\\[[^\\]]*\\]\\([^)]+\\))" +
    "|`([^`]+)`" +
    "|(https?:\\/\\/" + urlChars + ")" +
    "|([A-Za-z]:\\\\(?:" + pathChars + "\\\\)*" + pathChars + ")",
    "g"
  );
  return text2.replace(re, function(match, codeBlock, mdLink, inlineCode, url, filePath) {
    if (codeBlock || mdLink) return match;
    if (inlineCode !== undefined) {
      var t5 = inlineCode.trim();
      if (/^[A-Za-z]:\\/.test(t5)) {
        var cleaned2 = t5.replace(/[.,;:!?)]+$/, "");
        return "[" + cleaned2 + "](#localpath=" + encodeURIComponent(cleaned2) + ")";
      }
      if (/^https?:\/\//.test(t5)) {
        var cleaned2 = t5.replace(/[.,;:!?)]+$/, "");
        return "[" + cleaned2 + "](" + cleaned2 + ")";
      }
      return match;
    }
    if (url) {
      var cleaned = url.replace(/[.,;:!?)]+$/, "");
      return "[" + cleaned + "](" + cleaned + ")";
    }
    if (filePath) {
      var cleaned = filePath.replace(/[.,;:!?)]+$/, "");
      return "[" + cleaned + "](#localpath=" + encodeURIComponent(cleaned) + ")";
    }
    return match;
  });
}
function isBadResponse(text2) {
  const t5 = text2.trim();
  return !t5 || /^NO$/i.test(t5) || t5 === "\u56DE\u590D\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002" || t5 === "\u6A21\u578B\u672A\u80FD\u6B63\u786E\u56DE\u590D\uFF0C\u8BF7\u91CD\u65B0\u53D1\u9001\u60A8\u7684\u95EE\u9898\u3002";
}
function finishSending() {
  const recentAssistant = state.messages.filter((m4) => m4.type === "assistant");
  const hasRealResponse = recentAssistant.some((m4) => !isBadResponse(m4.text || ""));
  if (hasRealResponse) {
    state.messages = state.messages.filter((m4) => {
      if (m4.type === "assistant" && isBadResponse(m4.text || "")) {
        console.log("[finishSending] Removing bad message:", (m4.text || "").substring(0, 40));
        return false;
      }
      return true;
    });
    state._retryCount = 0;
    state.sending = false;
    state.thinkingLabel = null;
    state.toolsActive = 0;
    state.currentRunId = null;
    saveMessages();
    renderApp();
    return;
  }
  const lastMsg = state.messages[state.messages.length - 1];
  const lastText = (lastMsg?.text || "").trim();
  const isNoResponse = lastMsg?.type === "assistant" && /^NO$/i.test(lastText);
  const isFailResponse = lastMsg?.type === "assistant" && lastText === "\u56DE\u590D\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002";
  if ((isNoResponse || isFailResponse) && state._retryCount < 1) {
    state._retryCount++;
    console.log(`[AutoRetry] Model responded with "${lastText}", retrying (attempt ${state._retryCount})`);
    state.messages.pop();
    state.thinkingLabel = "\u6B63\u5728\u91CD\u8BD5...";
    state.sending = true;
    state.toolsActive = 0;
    state.currentRunId = null;
    renderApp();
    const idempotencyKey = generateUUID2();
    state.client?.request("chat.send", {
      sessionKey: state.sessionKey,
      message: "\u8BF7\u76F4\u63A5\u56DE\u7B54\u4E0A\u9762\u7684\u95EE\u9898\u3002",
      deliver: false,
      idempotencyKey
    }).catch((err2) => {
      console.error("Auto-retry send failed:", err2);
      state.sending = false;
      state.thinkingLabel = null;
      state._retryCount = 0;
      saveMessages();
      renderApp();
    });
    return;
  }
  state._retryCount = 0;
  state.sending = false;
  state.thinkingLabel = null;
  state.toolsActive = 0;
  state.currentRunId = null;
  saveMessages();
  renderApp();
}
function fetchCompleteResponse(runId, attempt = 1, maxAttempts = 15, prevText = "") {
  const delay = attempt <= 3 ? 800 : 2e3;
  setTimeout(() => {
    if (!state.sending) return;
    state.client?.request("chat.history", {
      sessionKey: state.sessionKey,
      limit: 20
    }).then((result) => {
      if (!state.sending) return;
      if (result?.messages && result.messages.length > 0) {
        const msgs = result.messages;
        let lastUserIdx = -1;
        for (let i6 = msgs.length - 1; i6 >= 0; i6--) {
          if (msgs[i6].role === "user") {
            lastUserIdx = i6;
            break;
          }
        }
        const startIdx = lastUserIdx >= 0 ? lastUserIdx + 1 : 0;
        const assistantTexts = [];
        for (let i6 = startIdx; i6 < msgs.length; i6++) {
          if (msgs[i6].role === "assistant") {
            const t5 = extractMessageText(msgs[i6]);
            if (t5 && !isSystemMessage(t5)) {
              assistantTexts.push(t5);
            }
          }
        }
        if (assistantTexts.length === 0) {
          for (let i6 = startIdx; i6 < msgs.length; i6++) {
            const m4 = msgs[i6];
            const content = m4.content;
            if (!Array.isArray(content)) continue;
            for (const block of content) {
              if (block?.type === "tool_result") {
                const rc = block.content;
                if (typeof rc === "string" && rc.trim()) {
                  assistantTexts.push(rc.trim());
                } else if (Array.isArray(rc)) {
                  for (const sub of rc) {
                    if (sub?.type === "text" && typeof sub.text === "string" && sub.text.trim()) {
                      assistantTexts.push(sub.text.trim());
                    }
                  }
                }
              }
            }
          }
        }
        if (assistantTexts.length > 0) {
          const historyText = assistantTexts.join("\n\n");
          if (historyText === prevText && historyText.length > 0) {
            const lastMsg2 = state.messages[state.messages.length - 1];
            if (lastMsg2?.type === "assistant" && lastMsg2.id === runId) {
              if (historyText.length > (lastMsg2.text || "").length) {
                lastMsg2.text = historyText;
              }
            } else {
              state.messages.push({
                type: "assistant",
                text: historyText,
                timestamp: Date.now(),
                id: runId
              });
            }
            finishSending();
            return;
          }
          if (attempt < maxAttempts) {
            const lastMsg2 = state.messages[state.messages.length - 1];
            if (lastMsg2?.type === "assistant" && lastMsg2.id === runId) {
              if (historyText.length > (lastMsg2.text || "").length) {
                lastMsg2.text = historyText;
              }
            }
            renderApp();
            fetchCompleteResponse(runId, attempt + 1, maxAttempts, historyText);
            return;
          }
          const lastMsg = state.messages[state.messages.length - 1];
          if (lastMsg?.type === "assistant" && lastMsg.id === runId) {
            if (historyText.length > (lastMsg.text || "").length) {
              lastMsg.text = historyText;
            }
          } else {
            state.messages.push({
              type: "assistant",
              text: historyText,
              timestamp: Date.now(),
              id: runId
            });
          }
          finishSending();
          return;
        }
      }
      if (attempt < maxAttempts) {
        fetchCompleteResponse(runId, attempt + 1, maxAttempts, prevText);
      } else {
        const existingReal = state.messages.some((m4) => m4.type === "assistant" && !isBadResponse(m4.text || ""));
        if (!existingReal) {
          const lastMsg = state.messages[state.messages.length - 1];
          if (!lastMsg || lastMsg.type !== "assistant" || lastMsg.id !== runId) {
            state.messages.push({
              type: "assistant",
              text: "\u56DE\u590D\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002",
              timestamp: Date.now(),
              id: runId
            });
          }
        }
        finishSending();
      }
    }).catch(() => {
      if (attempt < maxAttempts) {
        fetchCompleteResponse(runId, attempt + 1, maxAttempts, prevText);
      } else {
        finishSending();
      }
    });
  }, delay);
}
async function handleFiles(files) {
  const fileArray = Array.from(files);
  console.log("handleFiles called with", fileArray.length, "files");
  for (const file of fileArray) {
    console.log("Processing file:", file.name, "size:", file.size, "type:", file.type);
    if (file.size > 10 * 1024 * 1024) {
      state.lastError = `\u6587\u4EF6"${file.name}"\u8FC7\u5927\uFF08>10MB\uFF09\uFF0C\u8BF7\u9009\u62E9\u66F4\u5C0F\u7684\u6587\u4EF6`;
      renderApp();
      continue;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      console.log("File read as data URL, length:", dataUrl.length);
      state.attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl
      });
      console.log("File added to attachments, total:", state.attachments.length);
    } catch (err2) {
      state.lastError = `\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6"${file.name}"\uFF1A${String(err2)}`;
      console.error("File read error:", err2);
    }
  }
  console.log("Final attachments count:", state.attachments.length);
  if (state.pendingSkill && state.attachments.length > 0) {
    const skill = state.pendingSkill;
    state.pendingSkill = null;
    state.draft = skill.prompt;
    renderApp();
    handleSend();
    return;
  }
  renderApp();
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
}
function removeAttachment(index) {
  state.attachments.splice(index, 1);
  renderApp();
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k3 = 1024;
  const sizes = ["B", "KB", "MB"];
  const i6 = Math.floor(Math.log(bytes) / Math.log(k3));
  return Math.round(bytes / Math.pow(k3, i6) * 100) / 100 + " " + sizes[i6];
}
function sortedFiles() {
  const files = [...state.knowledgeFiles];
  if (state.filesSortBy === "name") {
    files.sort((a, b3) => a.name.localeCompare(b3.name, "zh"));
  } else {
    files.sort((a, b3) => (b3.mtime || 0) - (a.mtime || 0));
  }
  return files;
}
function sortedSkills() {
  const skills = [...state.customSkills];
  if (state.skillsSortBy === "name") {
    skills.sort((a, b3) => a.name.localeCompare(b3.name, "zh"));
  } else {
    skills.sort((a, b3) => (b3.createdAt || 0) - (a.createdAt || 0));
  }
  return skills;
}
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}
function toggleFavorite(msgId) {
  if (state.favorites.has(msgId)) {
    state.favorites.delete(msgId);
  } else {
    state.favorites.add(msgId);
  }
  saveFavorites();
  renderApp();
}
function scrollToMessage(msgId) {
  const el = document.querySelector(`[data-msg-id="${msgId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "outline 0.2s";
    el.style.outline = "2px solid #00A8FF";
    setTimeout(() => {
      el.style.outline = "none";
    }, 1500);
  }
}
function copyMessageText(msgId, text2) {
  const el = document.createElement("div");
  el.innerHTML = toSanitizedMarkdownHtml(text2);
  const plain = el.innerText || el.textContent || text2;
  navigator.clipboard.writeText(plain).then(() => {
    const btn = document.querySelector(`[data-copy-id="${msgId}"]`);
    if (btn) {
      btn.classList.add("copied");
      const label = btn.querySelector(".action-label");
      if (label) label.textContent = "\u5DF2\u590D\u5236";
      setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = "\u590D\u5236";
      }, 1500);
    }
  });
}
function generateTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}
function generateWordDoc(text2) {
  const bodyHtml = toSanitizedMarkdownHtml(text2);
  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>\u667A\u7A0E\u5B9D</title>
<style>
  body { font-family: "Microsoft YaHei", "SimSun", sans-serif; font-size: 12pt; line-height: 1.8; color: #333; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; }
  th, td { border: 1px solid #999; padding: 6px 10px; text-align: left; }
  th { background: #f0f0f0; font-weight: bold; }
  h1 { font-size: 18pt; } h2 { font-size: 15pt; } h3 { font-size: 13pt; }
  ul, ol { padding-left: 2em; }
</style>
</head><body>${bodyHtml}</body></html>`;
}
function saveMessageAsWord(text2) {
  const wordDoc = generateWordDoc(text2);
  const blob = new Blob([wordDoc], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a3 = document.createElement("a");
  a3.href = url;
  a3.download = `\u667A\u7A0E\u5B9D_${generateTimestamp()}.doc`;
  document.body.appendChild(a3);
  a3.click();
  document.body.removeChild(a3);
  URL.revokeObjectURL(url);
}
async function saveMessageToKnowledge(text2) {
  const api = window.electronAPI;
  if (!api?.copyToKnowledgeFolder) return;
  if (!state.authorizedFolder) {
    showToast("\u8BF7\u5148\u5728\u77E5\u8BC6\u5E93\u4E2D\u9009\u62E9\u6587\u4EF6\u5939");
    return;
  }
  const fileName = `\u667A\u7A0E\u5B9D_${generateTimestamp()}.doc`;
  const wordDoc = generateWordDoc(text2);
  const base64 = btoa(unescape(encodeURIComponent(wordDoc)));
  try {
    await api.copyToKnowledgeFolder({
      folderPath: state.authorizedFolder,
      fileName,
      base64Data: base64,
    });
    showToast(`\u5DF2\u4FDD\u5B58\u5230\u77E5\u8BC6\u5E93: ${fileName}`);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err) {
    console.warn("Failed to save to knowledge:", err);
    showToast("\u4FDD\u5B58\u5931\u8D25");
  }
}
function dismissQuickStart() {
  state.showQuickStart = false;
  localStorage.setItem("quickstart_seen", "1");
  renderApp();
}
function renderQuickStart() {
  return b2`
    <div class="quickstart-overlay" @click=${dismissQuickStart}>
      <div class="quickstart-container" @click=${(e) => e.stopPropagation()}>
        <div class="qs-hero">
          <div class="qs-hero-logo"><img src="./assets/taxchat-logo.png" alt="\u667A\u7A0E\u5B9D" style="width:80px;height:80px;" /></div>
          <h1>\u6B22\u8FCE\u4F7F\u7528\u667A\u7A0E\u5B9D</h1>
          <p>\u60A8\u7684 AI \u7A0E\u52A1\u52A9\u624B\uFF0C\u5E2E\u52A9\u60A8\u5206\u6790\u7A0E\u52A1\u98CE\u9669\u3001\u5BA1\u6838\u7968\u636E\u5408\u540C\u3001\u6574\u7406\u62A5\u9500\u5355\u3001\u7BA1\u7406\u77E5\u8BC6\u5E93\u3002<br/>\u4EE5\u4E0B\u662F\u5FEB\u901F\u4E0A\u624B\u6307\u5357\uFF0C\u5E2E\u60A8\u4E86\u89E3\u5404\u9879\u529F\u80FD\u3002</p>
          <div class="qs-scroll-hint">\u2193 \u5411\u4E0B\u6EDA\u52A8\u67E5\u770B\u529F\u80FD\u4ECB\u7ECD</div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">1</span> \u667A\u80FD\u5BF9\u8BDD</div>
          <div class="qs-section-desc">\u5728\u8F93\u5165\u6846\u4E2D\u8F93\u5165\u60A8\u7684\u7A0E\u52A1\u95EE\u9898\uFF0C\u667A\u7A0E\u5B9D\u4F1A\u5B9E\u65F6\u89E3\u7B54\u3002\u652F\u6301\u591A\u8F6E\u5BF9\u8BDD\uFF0C\u4E0A\u4E0B\u6587\u81EA\u52A8\u5173\u8054\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u667A\u7A0E\u5B9D - \u5BF9\u8BDD\u754C\u9762</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              <div class="qs-chat-label" style="text-align:right">\u7528\u6237</div>
              <div class="qs-chat-bubble qs-chat-user">\u6211\u4EEC\u516C\u53F8\u6536\u5230\u4E00\u5F20\u54A8\u8BE2\u8D39\u53D1\u7968\uFF0C\u7A0E\u7387\u662F6%\uFF0C\u8BF7\u95EE\u53EF\u4EE5\u62B5\u6263\u5417\uFF1F</div>
              <div class="qs-chat-label">\u667A\u7A0E\u5B9D</div>
              <div class="qs-chat-bubble qs-chat-ai">\u6839\u636E\u589E\u503C\u7A0E\u76F8\u5173\u89C4\u5B9A\uFF0C\u54A8\u8BE2\u8D39\u5C5E\u4E8E<b>\u73B0\u4EE3\u670D\u52A1\u4E1A</b>\u8303\u7574\uFF0C\u4E00\u822C\u7EB3\u7A0E\u4EBA\u53D6\u5F97\u76846%\u7A0E\u7387\u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968\uFF0C\u53EF\u4EE5\u6309\u7167\u7968\u9762\u6CE8\u660E\u7684\u7A0E\u989D\u8FDB\u884C<b>\u8FDB\u9879\u7A0E\u989D\u62B5\u6263</b>\u3002\u9700\u8981\u6CE8\u610F\uFF1A<br/>1. \u786E\u4FDD\u53D1\u7968\u4E3A\u589E\u503C\u7A0E\u4E13\u7528\u53D1\u7968<br/>2. \u4E1A\u52A1\u771F\u5B9E\u6027\u3001\u5408\u7406\u6027\u9700\u6709\u5408\u540C\u652F\u6491<br/>3. \u9700\u5728\u89C4\u5B9A\u671F\u9650\u5185\u8BA4\u8BC1</div>
              <div class="qs-chat-label" style="text-align:right">\u7528\u6237</div>
              <div class="qs-chat-bubble qs-chat-user">\u5982\u679C\u662F\u5C0F\u89C4\u6A21\u7EB3\u7A0E\u4EBA\u5462\uFF1F</div>
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:75%">\u5C0F\u89C4\u6A21\u7EB3\u7A0E\u4EBA\u91C7\u7528<b>\u7B80\u6613\u8BA1\u7A0E</b>\u65B9\u6CD5\uFF0C\u4E0D\u5B58\u5728\u8FDB\u9879\u62B5\u6263\u7684\u6982\u5FF5\u3002\u53D6\u5F97\u7684\u53D1\u7968\u76F4\u63A5\u8BA1\u5165\u6210\u672C\u8D39\u7528\u5373\u53EF\u3002</div>
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">2</span> \u5FEB\u6377\u6280\u80FD</div>
          <div class="qs-section-desc">\u70B9\u51FB\u5FEB\u6377\u6309\u94AE\u5373\u53EF\u542F\u7528\u4E13\u4E1A\u7A0E\u52A1\u6280\u80FD\u3002\u4E0A\u4F20\u6587\u4EF6\u540E\u81EA\u52A8\u5206\u6790\uFF0C\u65E0\u9700\u8F93\u5165\u590D\u6742\u6307\u4EE4\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u5FEB\u6377\u64CD\u4F5C\u680F</span>
            </div>
            <div class="qs-btn-row">
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F9FE}</span> \u7A0E\u52A1\u98CE\u9669\u6CBB\u7406</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F4CA}</span> \u7533\u62A5\u8868\u9884\u5BA1</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F4DD}</span> \u5408\u540C\u53CA\u7968\u636E\u7A0E\u5BA1</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F9FE}</span> \u7968\u636E\u6574\u7406</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F4DA}</span> \u77E5\u8BC6\u5E93</div>
              <div class="qs-btn-mock"><span class="qs-btn-mock-icon">\u{1F3E5}</span> \u5168\u9762\u7A0E\u52A1\u4F53\u68C0</div>
            </div>
            <div style="margin-top:14px;font-size:12px;color:#64748b;line-height:1.8;">
              <b>\u{1F9FE} \u7A0E\u52A1\u98CE\u9669\u6CBB\u7406</b> \u2014 \u4E0A\u4F20\u98CE\u9669\u6587\u4EF6\uFF0C\u81EA\u52A8\u751F\u6210\u8BF4\u660E\u51FD\u548C\u5E94\u5BF9\u7B56\u7565<br/>
              <b>\u{1F4CA} \u7533\u62A5\u8868\u9884\u5BA1</b> \u2014 \u4E0A\u4F20\u7EB3\u7A0E\u7533\u62A5\u8868\u548C\u8D22\u52A1\u62A5\u8868\uFF0C\u81EA\u52A8\u6BD4\u5BF9\u5DEE\u5F02<br/>
              <b>\u{1F4DD} \u5408\u540C\u53CA\u7968\u636E\u7A0E\u5BA1</b> \u2014 \u4E0A\u4F20\u5408\u540C\u6216\u7968\u636E\uFF0C\u8BA1\u7B97\u7A0E\u989D\u5E76\u7ED9\u51FA\u98CE\u9669\u63D0\u793A<br/>
              <b>\u{1F9FE} \u7968\u636E\u6574\u7406</b> \u2014 \u626B\u63CF\u6574\u4E2A\u6587\u4EF6\u5939\u7684\u7968\u636E\uFF0C\u5206\u7C7B\u6574\u7406\u751F\u6210\u62A5\u9500\u5355\uFF08Excel\uFF09<br/>
              <b>\u{1F4DA} \u77E5\u8BC6\u5E93</b> \u2014 \u5728\u6388\u6743\u6587\u4EF6\u5939\u4E2D\u641C\u7D22\u3001\u9605\u8BFB\u3001\u63D0\u53D6\u6587\u4EF6\u6458\u8981<br/>
              <b>\u{1F3E5} \u5168\u9762\u7A0E\u52A1\u4F53\u68C0</b> \u2014 \u8DF3\u8F6C\u5728\u7EBF\u7A0E\u52A1\u4F53\u68C0\u5E73\u53F0
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">3</span> \u6587\u4EF6\u4E0A\u4F20\u4E0E\u5206\u6790</div>
          <div class="qs-section-desc">\u652F\u6301\u4E0A\u4F20\u56FE\u7247\u3001PDF\u3001Word\u3001Excel \u6587\u4EF6\u3002\u53EF\u4EE5\u62D6\u62FD\u5230\u5BF9\u8BDD\u533A\u57DF\u6216\u70B9\u51FB\u4E0A\u4F20\u6309\u94AE\u3002AI \u81EA\u52A8\u8BC6\u522B\u6587\u4EF6\u5185\u5BB9\u8FDB\u884C\u5206\u6790\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u6587\u4EF6\u4E0A\u4F20</span>
            </div>
            <div class="qs-upload-zone">\u{1F4CE} \u62D6\u62FD\u6587\u4EF6\u5230\u8FD9\u91CC\u4E0A\u4F20<br/><span style="font-size:11px;color:#cbd5e1">\u652F\u6301 JPG / PNG / PDF / DOCX / XLSX</span></div>
            <div class="qs-attachment-row">
              <div class="qs-attachment-thumb">\u{1F4C4}<span class="qs-attachment-x">\u2715</span></div>
              <div class="qs-attachment-thumb" style="background:#e0f2fe;">\u{1F5BC}\uFE0F<span class="qs-attachment-x">\u2715</span></div>
              <div class="qs-attachment-thumb">\u{1F4CA}<span class="qs-attachment-x">\u2715</span></div>
              <div style="flex:1;display:flex;align-items:center;padding-left:12px;"><span style="font-size:12px;color:#94a3b8;">\u2190 \u5DF2\u4E0A\u4F20\u7684\u6587\u4EF6\u4F1A\u663E\u793A\u7F29\u7565\u56FE\uFF0C\u70B9\u51FB \u2715 \u53EF\u79FB\u9664</span></div>
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">4</span> \u77E5\u8BC6\u5E93\u7BA1\u7406</div>
          <div class="qs-section-desc">\u6388\u6743\u4E00\u4E2A\u6587\u4EF6\u5939\u4F5C\u4E3A\u77E5\u8BC6\u5E93\uFF0C\u667A\u7A0E\u5B9D\u4F1A\u5B66\u4E60\u5176\u4E2D\u7684\u6587\u4EF6\u5185\u5BB9\u3002\u70B9\u51FB\u201C\u5F15\u7528\u201D\u53EF\u5C06\u7279\u5B9A\u6587\u4EF6\u4F5C\u4E3A\u4E0A\u4E0B\u6587\u53D1\u9001\u3002\u65B0\u6587\u4EF6\u4F1A\u81EA\u52A8\u88AB\u5B66\u4E60\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u77E5\u8BC6\u5E93\u9762\u677F\uFF08\u53F3\u4FA7\u8FB9\u680F\uFF09</span>
            </div>
            <div class="qs-panel-mock">
              <div class="qs-panel-header">
                <span class="qs-panel-tab qs-panel-tab-active">\u{1F4DA} \u77E5\u8BC6\u5E93\u6587\u4EF6</span>
                <span class="qs-panel-tab qs-panel-tab-inactive">\u{1F6E0} \u81EA\u5B9A\u4E49\u6280\u80FD</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;padding:4px 0 8px;font-size:11px;color:#64748b;">
                <span>\u{1F4C2} D:\\\u6211\u7684\u6587\u6863\\\u7A0E\u52A1\u8D44\u6599</span>
                <span style="color:#00A8FF;">\u66F4\u6362</span>
                <span style="color:#00A8FF;">\u5237\u65B0</span>
              </div>
              <div class="qs-file-row"><span class="qs-file-icon">\u{1F4C4}</span><span class="qs-file-name">2024\u5E74\u5EA6\u7EB3\u7A0E\u7533\u62A5\u8868.pdf</span><span class="qs-file-size">2.3MB</span><span class="qs-file-btn">\u5F15\u7528</span></div>
              <div class="qs-file-row"><span class="qs-file-icon">\u{1F4CA}</span><span class="qs-file-name">\u8D22\u52A1\u62A5\u8868\u6C47\u603B.xlsx</span><span class="qs-file-size">856KB</span><span class="qs-file-btn">\u5F15\u7528</span></div>
              <div class="qs-file-row"><span class="qs-file-icon">\u{1F4DD}</span><span class="qs-file-name">\u670D\u52A1\u5408\u540C-2024.docx</span><span class="qs-file-size">145KB</span><span class="qs-file-btn">\u5F15\u7528</span></div>
              <div style="text-align:center;padding:8px;font-size:11px;color:#94a3b8;">\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u53EF\u6DFB\u52A0\u5230\u77E5\u8BC6\u5E93</div>
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">5</span> \u81EA\u5B9A\u4E49\u6280\u80FD</div>
          <div class="qs-section-desc">\u5728\u77E5\u8BC6\u5E93\u9762\u677F\u7684\u201C\u81EA\u5B9A\u4E49\u6280\u80FD\u201D\u9009\u9879\u5361\u4E2D\u521B\u5EFA\u4E13\u5C5E\u6280\u80FD\u3002\u8BBE\u7F6E\u6280\u80FD\u540D\u79F0\u3001\u56FE\u6807\u548C\u64CD\u4F5C\u6307\u4EE4\uFF0C\u8FD8\u53EF\u4EE5\u5BFC\u5165\u4ED6\u4EBA\u5206\u4EAB\u7684\u6280\u80FD\u5305\uFF08.zip\uFF09\u3002\u56FA\u5B9A\u7684\u6280\u80FD\u4F1A\u51FA\u73B0\u5728\u5FEB\u6377\u6309\u94AE\u680F\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u81EA\u5B9A\u4E49\u6280\u80FD\u7BA1\u7406</span>
            </div>
            <div class="qs-skill-card"><span class="qs-skill-emoji">\u{1F4B0}</span><div class="qs-skill-info"><div class="qs-skill-name">\u7A0E\u6536\u4F18\u60E0\u67E5\u8BE2</div><div class="qs-skill-desc">\u67E5\u8BE2\u9002\u7528\u7684\u7A0E\u6536\u4F18\u60E0\u653F\u7B56</div></div><div class="qs-skill-actions"><span class="qs-skill-action-btn">\u2B50 \u56FA\u5B9A</span><span class="qs-skill-action-btn">\u270F\uFE0F \u7F16\u8F91</span><span class="qs-skill-action-btn">\u{1F4E4} \u5BFC\u51FA</span></div></div>
            <div class="qs-skill-card"><span class="qs-skill-emoji">\u{1F4CB}</span><div class="qs-skill-info"><div class="qs-skill-name">\u53D1\u7968\u771F\u4F2A\u67E5\u9A8C</div><div class="qs-skill-desc">\u6838\u9A8C\u53D1\u7968\u4FE1\u606F\u662F\u5426\u5408\u89C4</div></div><div class="qs-skill-actions"><span class="qs-skill-action-btn">\u2B50 \u56FA\u5B9A</span><span class="qs-skill-action-btn">\u270F\uFE0F \u7F16\u8F91</span><span class="qs-skill-action-btn">\u{1F4E4} \u5BFC\u51FA</span></div></div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <div class="qs-btn-mock" style="background:#eff6ff;color:#00A8FF;border:1px dashed #00A8FF;">\u2795 \u65B0\u5EFA\u6280\u80FD</div>
              <div class="qs-btn-mock" style="background:#f0fdf4;color:#22c55e;border:1px dashed #22c55e;">\u{1F4E6} \u5BFC\u5165\u6280\u80FD\u5305</div>
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">6</span> \u6D88\u606F\u64CD\u4F5C</div>
          <div class="qs-section-desc">\u9F20\u6807\u60AC\u505C\u5728 AI \u56DE\u590D\u4E0A\u65B9\uFF0C\u4F1A\u6D6E\u73B0\u64CD\u4F5C\u6309\u94AE\u3002\u53EF\u4EE5\u590D\u5236\u6587\u672C\u3001\u5BFC\u51FA\u4E3A Word \u6587\u6863\u3001\u6536\u85CF\u5230\u4FA7\u680F\u3001\u6216\u5B58\u5165\u77E5\u8BC6\u5E93\u6587\u4EF6\u5939\u3002</div>
          <div class="qs-mockup">
            <div class="qs-mockup-titlebar">
              <span class="qs-dot qs-dot-r"></span><span class="qs-dot qs-dot-y"></span><span class="qs-dot qs-dot-g"></span>
              <span class="qs-mockup-title">\u6D88\u606F\u60AC\u6D6E\u64CD\u4F5C</span>
            </div>
            <div style="position:relative;padding:8px 0;">
              <div class="qs-chat-bubble qs-chat-ai" style="max-width:100%;">\u6839\u636E\u60A8\u4E0A\u4F20\u7684\u5408\u540C\uFF0C\u6D89\u53CA\u4EE5\u4E0B\u7A0E\u76EE\uFF1A<br/>1. \u589E\u503C\u7A0E\uFF086%\uFF09\uFF1A\u54A8\u8BE2\u670D\u52A1\u8D39 50,000 \u5143\uFF0C\u7A0E\u989D 2,830.19 \u5143<br/>2. \u5370\u82B1\u7A0E\uFF1A\u6280\u672F\u5408\u540C\u6309 0.03% \u8D34\u82B1\uFF0C\u7A0E\u989D 15 \u5143<br/><b>\u98CE\u9669\u63D0\u793A\uFF1A</b>\u5408\u540C\u672A\u6CE8\u660E\u4EF7\u7A0E\u5206\u79BB\u6761\u6B3E\uFF0C\u5EFA\u8BAE\u8865\u5145\u3002</div>
              <div style="display:flex;justify-content:flex-start;margin-top:6px;">
                <div class="qs-msg-actions">
                  <span class="qs-msg-action">\u{1F4CB} \u590D\u5236</span>
                  <span class="qs-msg-action">\u{1F4DD} \u5BFC\u51FAWord</span>
                  <span class="qs-msg-action">\u2B50 \u6536\u85CF</span>
                  <span class="qs-msg-action">\u{1F4BE} \u5B58\u5165\u77E5\u8BC6\u5E93</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="qs-section">
          <div class="qs-section-title"><span class="qs-section-num">7</span> \u5B9E\u7528\u6280\u5DE7</div>
          <div class="qs-section-desc" style="margin-bottom:0;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div style="background:#f0f9ff;padding:12px;border-radius:8px;"><b style="color:#0070CC;">\u{1F4C2} \u77E5\u8BC6\u5E93\u81EA\u52A8\u5B66\u4E60</b><br/><span style="font-size:13px;">\u6388\u6743\u6587\u4EF6\u5939\u540E\uFF0C\u65B0\u589E\u6587\u4EF6\u4F1A\u88AB\u81EA\u52A8\u5B66\u4E60\u3002\u65E0\u9700\u624B\u52A8\u5BFC\u5165\u3002</span></div>
              <div style="background:#fefce8;padding:12px;border-radius:8px;"><b style="color:#a16207;">\u2B50 \u6536\u85CF\u91CD\u8981\u56DE\u590D</b><br/><span style="font-size:13px;">\u70B9\u51FB\u6536\u85CF\u540E\uFF0C\u53EF\u968F\u65F6\u4ECE\u5DE6\u4FA7\u9762\u677F\u5FEB\u901F\u67E5\u627E\u5386\u53F2\u56DE\u590D\u3002</span></div>
              <div style="background:#f0fdf4;padding:12px;border-radius:8px;"><b style="color:#15803d;">\u{1F4CE} \u5F15\u7528\u77E5\u8BC6\u5E93\u6587\u4EF6</b><br/><span style="font-size:13px;">\u5728\u77E5\u8BC6\u5E93\u9762\u677F\u70B9\u51FB\u201C\u5F15\u7528\u201D\uFF0C\u8BE5\u6587\u4EF6\u5185\u5BB9\u4F1A\u4F5C\u4E3A\u4E0A\u4E0B\u6587\u53D1\u9001\u7ED9 AI\u3002</span></div>
              <div style="background:#fdf2f8;padding:12px;border-radius:8px;"><b style="color:#be185d;">\u{1F6E0} \u56FA\u5B9A\u5E38\u7528\u6280\u80FD</b><br/><span style="font-size:13px;">\u81EA\u5B9A\u4E49\u6280\u80FD\u70B9\u51FB\u201C\u56FA\u5B9A\u201D\u540E\u4F1A\u51FA\u73B0\u5728\u5FEB\u6377\u6309\u94AE\u680F\uFF0C\u4E00\u952E\u4F7F\u7528\u3002</span></div>
            </div>
          </div>
        </div>
        <div class="qs-footer">
          <button class="qs-btn-start" @click=${dismissQuickStart}>\u5F00\u59CB\u4F7F\u7528\u667A\u7A0E\u5B9D \u2192</button>
          <div class="qs-tip">\u60A8\u53EF\u4EE5\u968F\u65F6\u5728\u201C\u5173\u4E8E\u201D\u5F39\u7A97\u4E2D\u91CD\u65B0\u67E5\u770B\u6B64\u6307\u5357</div>
        </div>
      </div>
    </div>
  `;
}
function renderMessages() {
  if (state.messages.length === 0) {
    return b2`
      <div class="empty-state">
        <div class="empty-state__icon">
          <img src="./assets/taxchat-logo.png" alt="智税宝" style="width: 120px; height: 120px;" />
        </div>
        <div class="empty-state__text">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">欢迎来到智税宝</div>
          <div>有任何税务问题？请在下方输入并提问</div>
        </div>
      </div>
    `;
  }
  const groups = [];
  for (const msg of state.messages) {
    if (msg.type === "user") {
      groups.push(b2`
        <div class="message-group">
          <div class="message-item user">
            <div class="message-content user">
              ${msg.text ? b2`<div class="message-bubble user">${msg.text}</div>` : ""}
              ${msg.attachments && msg.attachments.length > 0 ? b2`
                <div class="message-attachments">
                  ${msg.attachments.map((att) => b2`
                    <div class="attachment-thumbnail" @click=${() => {
        state.previewAttachment = att;
        renderApp();
      }}>
                      ${att.type.startsWith("image/") ? b2`
                        <img src=${att.dataUrl} alt=${att.name} class="thumbnail-image" />
                      ` : b2`
                        <div class="thumbnail-file">
                          <span class="file-icon">📄</span>
                          <span class="file-name">${att.name}</span>
                        </div>
                      `}
                    </div>
                  `)}
                </div>
              ` : ""}
            </div>
            <div class="message-avatar user">👤</div>
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    } else {
      const isFav = state.favorites.has(msg.id);
      groups.push(b2`
        <div class="message-group" data-msg-id="${msg.id}">
          <div class="message-item">
            <div class="message-avatar assistant"><img src="./assets/taxchat-logo.png" alt="智税宝" /></div>
            <div class="message-bubble assistant markdown-body ${isFav ? "favorited" : ""}">${o5(toSanitizedMarkdownHtml(autoLinkText(sanitizeDisplayText(msg.text))))}</div>
          </div>
          <div class="message-actions">
            <button class="message-action-btn" data-copy-id="${msg.id}" @click=${() => copyMessageText(msg.id, msg.text)} title="复制文本">
              <span class="action-icon">📋</span><span class="action-label">复制</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageAsWord(msg.text)} title="保存为Word文档">
              <span class="action-icon">💾</span><span class="action-label">保存Word</span>
            </button>
            <button class="message-action-btn" @click=${() => saveMessageToKnowledge(msg.text)} title="保存到知识库">
              <span class="action-icon">📚</span><span class="action-label">存知识库</span>
            </button>
            <button class="message-action-btn ${isFav ? "fav-active" : ""}" @click=${() => toggleFavorite(msg.id)} title="${isFav ? "\u53D6\u6D88\u6536\u85CF" : "\u6536\u85CF"}">
              <span class="action-icon">${isFav ? "\u2B50" : "\u2606"}</span><span class="action-label">${isFav ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF"}</span>
            </button>
          </div>
          <div class="message-time">${formatTime(msg.timestamp)}</div>
        </div>
      `);
    }
  }
  if (state.sending) {
    groups.push(b2`
      <div class="message-group">
        <div class="message-item">
          <div class="message-avatar assistant"><img src="./assets/taxchat-logo.png" alt="智税宝" /></div>
          <div class="message-bubble assistant">
            <div class="thinking-indicator">
              ${state.thinkingLabel ? b2`<span class="thinking-label">${state.thinkingLabel}</span>` : ""}
              <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }
  return b2`${groups}`;
}
function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;
  saveMessages();
  const statusText = state.connected ? "\u5DF2\u8FDE\u63A5" : "\u8FDE\u63A5\u4E2D...";
  const statusClass = state.connected ? "ok" : "";
  const content = b2`
    <div class="taxchat-app">
      <header class="taxchat-header">
        <div class="taxchat-header__title" @click=${() => {
    state.showAbout = true;
    renderApp();
  }} style="cursor: pointer;" title="关于智税宝">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="taxchat-header__logo">
              <img src="./assets/taxchat-logo.png" alt="智税宝" />
            </div>
            <h1>智税宝</h1>
            <div class="taxchat-header__status" @click=${(e) => { e.stopPropagation(); state.showStatusMenu = !state.showStatusMenu; renderApp(); }}>
              <span class="status-dot ${statusClass}"></span> ${statusText} <span class="status-arrow">▾</span>
              ${state.showStatusMenu ? b2`
                <div class="status-menu" @click=${(e) => e.stopPropagation()}>
                  ${state.connected ? b2`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = window.electronAPI; if (api?.restartGateway) api.restartGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>重连 Gateway</div>
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = window.electronAPI; if (api?.stopGateway) api.stopGateway(); state.connected = false; cancelReconnect(); renderApp(); }}>关闭 Gateway</div>
                  ` : b2`
                    <div class="status-menu__item" @click=${() => { state.showStatusMenu = false; const api = window.electronAPI; if (api?.startGateway) api.startGateway(); setTimeout(() => connectGateway(), 2000); renderApp(); }}>连接 Gateway</div>
                  `}
                </div>
              ` : ""}
            </div>
          </div>
        </div>
        <div class="taxchat-header__right">
          <button class="favorites-toggle-btn ${state.showFavorites ? "active" : ""}" @click=${() => {
    state.showFavorites = !state.showFavorites;
    state.showKnowledge = false;
    state.showSkills = false;
    renderApp();
  }} title="收藏夹">
            <span>⭐</span>
            ${state.favorites.size > 0 ? b2`<span class="fav-badge">${state.favorites.size}</span>` : ""}
          </button>
          <button class="knowledge-toggle-btn ${state.showKnowledge ? "active" : ""}" @click=${() => {
    state.showKnowledge = !state.showKnowledge;
    state.showFavorites = false;
    state.showSkills = false;
    if (state.showKnowledge) loadKnowledgeFiles();
    renderApp();
  }} title="知识库">
            知识库
          </button>
          <button class="knowledge-toggle-btn ${state.showSkills ? "active" : ""}" @click=${() => {
    state.showSkills = !state.showSkills;
    state.showFavorites = false;
    state.showKnowledge = false;
    renderApp();
  }} title="技能管理">
            技能
          </button>
        </div>
      </header>

      <div class="taxchat-body">
        <div class="taxchat-main">
          <div class="taxchat-messages" id="messages-container">
            ${renderMessages()}
          </div>

      <div class="taxchat-input-area">
        <div class="taxchat-quick-actions">
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("tax-risk", "\u8BF7\u6309\u7167\u7A0E\u52A1\u98CE\u9669\u6CBB\u7406\u6D41\u7A0B\uFF0C\u5206\u6790\u6211\u4E0A\u4F20\u7684\u6587\u4EF6\u5185\u5BB9\uFF0C\u8BC6\u522B\u7A0E\u52A1\u98CE\u9669\u70B9\uFF0C\u7ED9\u51FA\u98CE\u9669\u5206\u6790\u3001\u8BF4\u660E\u51FD\u3001\u5E94\u5BF9\u8BDD\u672F\u548C\u64CD\u4F5C\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002", "\u7A0E\u52A1\u98CE\u9669\u6CBB\u7406")}
            title="上传税务风险文件，自动分析并生成说明函"
          >
            <span class="qa-icon">🧾</span>
            <span>税务风险治理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("tax-review", "\u8BF7\u6309\u7167\u7EB3\u7A0E\u7533\u62A5\u8868\u9884\u5BA1\u6D41\u7A0B\uFF0C\u5206\u6790\u6211\u4E0A\u4F20\u7684\u7EB3\u7A0E\u7533\u62A5\u8868\u548C\u8D22\u52A1\u62A5\u8868\uFF0C\u6BD4\u5BF9\u4E24\u4E2A\u8868\u683C\u7684\u6570\u636E\u5DEE\u5F02\uFF0C\u4EE5\u8868\u683C\u5F62\u5F0F\u8F93\u51FA\u6BD4\u5BF9\u7ED3\u679C\uFF0C\u5E76\u5206\u6790\u7A0E\u52A1\u98CE\u9669\u7ED9\u51FA\u5904\u7406\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002", "\u7EB3\u7A0E\u7533\u62A5\u8868\u9884\u5BA1")}
            title="上传纳税申报表和财务报表，自动比对分析"
          >
            <span class="qa-icon">📊</span>
            <span>申报表预审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("contract-tax", "\u8BF7\u6309\u7167\u7968\u636E\u5408\u540C\u7A0E\u52A1\u5BA1\u6838\u6D41\u7A0B\uFF0C\u4ECE\u7A0E\u52A1\u89D2\u5EA6\u5206\u6790\u6211\u4E0A\u4F20\u7684\u5408\u540C\u6216\u7968\u636E\uFF0C\u5217\u652F\u6D89\u53CA\u7684\u7A0E\u76EE\u5E76\u8BA1\u7B97\u76F8\u5173\u7A0E\u989D\uFF0C\u7ED9\u51FA\u98CE\u9669\u63D0\u793A\u548C\u4FEE\u6539\u5EFA\u8BAE\u3002\u8BF7\u76F4\u63A5\u5206\u6790\u6587\u4EF6\u5185\u5BB9\uFF0C\u4E0D\u8981\u8C03\u7528\u4EFB\u4F55\u5DE5\u5177\u6216\u547D\u4EE4\u3002", "\u5408\u540C\u7A0E\u52A1\u5BA1\u6838")}
            title="上传合同或票据，从税务角度审核分析"
          >
            <span class="qa-icon">📝</span>
            <span>合同及票据税审</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("invoice-check", BUILTIN_SKILLS[3].prompt, "\u53D1\u7968\u67E5\u9A8C")}
            title="\u4E0A\u4F20\u53D1\u7968\u56FE\u7247/PDF/XML\uFF0C\u67E5\u9A8C\u53D1\u7968\u771F\u4F2A\u5E76\u5206\u6790\u98CE\u9669"
          >
            <span class="qa-icon">\u{1F50D}</span>
            <span>\u53D1\u7968\u67E5\u9A8C</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => handleQuickSkill("receipt-organizer", BUILTIN_SKILLS[4].prompt, "\u7968\u636E\u6574\u7406", true)}
            title="扫描文件夹中的票据，按类型分类整理，生成报销单"
          >
            <span class="qa-icon">🧾</span>
            <span>票据整理</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => {
    if (!state.authorizedFolder) {
      showToast("\u8BF7\u5148\u5728\u77E5\u8BC6\u5E93\u9762\u677F\u4E2D\u9009\u62E9\u6587\u4EF6\u5939");
      state.showKnowledge = true;
      state.showSkills = false;
      renderApp();
      return;
    }
    handleCustomSkillClick(BUILTIN_SKILLS[5]);
  }}
            title="\u5728\u6307\u5B9A\u6587\u4EF6\u5939\u4E2D\u68C0\u7D22\u6587\u4EF6\u3001\u63D0\u53D6\u6458\u8981\u3001\u641C\u7D22\u5185\u5BB9"
          >
            <span class="qa-icon">\u{1F4DA}</span>
            <span>\u77E5\u8BC6\u5E93</span>
          </button>
          <button
            class="quick-action-btn"
            @click=${() => {
    window.open("https://ai.taxyes.com/taxCheck", "_blank");
  }}
            title="打开全面税务体检页面"
          >
            <span class="qa-icon">🏥</span>
            <span>全面税务体检</span>
          </button>
          <button
            class="quick-action-btn"
            ?disabled=${state.sending}
            @click=${() => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx";
    fileInput.multiple = true;
    fileInput.onchange = () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFiles(fileInput.files);
      }
    };
    fileInput.click();
  }}
            title="上传图片或文件"
          >
            <span class="qa-icon">📎</span>
            <span>上传文件</span>
          </button>
          ${state.customSkills.filter((s4) => s4.pinned).sort((a3, b4) => a3.createdAt - b4.createdAt).map((sk) => b2`
            <button
              class="quick-action-btn custom"
              ?disabled=${state.sending}
              @click=${() => handleCustomSkillClick(sk)}
              title=${sk.description || sk.name}
            >
              <span class="qa-icon">${sk.emoji}</span>
              <span>${sk.name}</span>
            </button>
          `)}
        </div>

        <div class="taxchat-input-container"
          @dragover=${(e6) => {
    e6.preventDefault();
    e6.stopPropagation();
    state.dragOver = true;
    renderApp();
  }}
          @dragleave=${(e6) => {
    e6.preventDefault();
    e6.stopPropagation();
    state.dragOver = false;
    renderApp();
  }}
          @drop=${(e6) => {
    e6.preventDefault();
    e6.stopPropagation();
    state.dragOver = false;
    console.log("Drop event, files:", e6.dataTransfer?.files?.length);
    if (e6.dataTransfer?.files) {
      handleFiles(e6.dataTransfer.files);
    }
  }}
          class=${state.dragOver ? "taxchat-input-container drag-over" : "taxchat-input-container"}
        >
          ${state.activeCustomSkill ? b2`
            <div class="skill-prompt-bubble">
              <span class="skill-prompt-bubble__emoji">${state.activeCustomSkill.emoji}</span>
              <span class="skill-prompt-bubble__text">${state.activeCustomSkill.name}${state.activeCustomSkill.description ? ` \xB7 ${state.activeCustomSkill.description}` : ""}</span>
              <button class="skill-prompt-bubble__close" @click=${() => clearActiveCustomSkill()} title="取消技能">✕</button>
            </div>
          ` : ""}
          <textarea
            id="message-input"
            class="taxchat-input"
            rows="1"
            placeholder=${state.activeCustomSkill ? `\u8BF7\u8F93\u5165\u5185\u5BB9\uFF0C\u5C06\u6309\u300C${state.activeCustomSkill.name}\u300D\u6D41\u7A0B\u5904\u7406...` : "\u8F93\u5165\u60A8\u7684\u7A0E\u52A1\u95EE\u9898...\u6216\u62D6\u5165/\u7C98\u8D34\u6587\u4EF6"}
            .value=${state.draft}
            @input=${(e6) => {
    const ta = e6.target;
    state.draft = ta.value;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
    renderApp();
  }}
            @keydown=${(e6) => {
    if (e6.key === "Enter" && !e6.ctrlKey && !e6.shiftKey && !e6.isComposing) {
      e6.preventDefault();
      handleSend();
    }
  }}
            @paste=${(e6) => {
    console.log("Paste event, files:", e6.clipboardData?.files?.length);
    if (e6.clipboardData?.files && e6.clipboardData.files.length > 0) {
      e6.preventDefault();
      handleFiles(e6.clipboardData.files);
    }
  }}
            ?disabled=${state.sending}
            rows="1"
          ></textarea>
          
          ${state.dragOver ? b2`
            <div class="drag-overlay">
              <div class="drag-text">📁 拖入文件即可上传</div>
            </div>
          ` : ""}
        </div>

        ${state.attachments.length > 0 ? b2`
          <div class="attachments-list">
            ${state.attachments.map((att, idx) => b2`
              <div class="attachment-item">
                <span class="attachment-icon">📎</span>
                <span class="attachment-name" title=${att.name}>${att.name}</span>
                <span class="attachment-size">${formatFileSize(att.size)}</span>
                <button
                  class="attachment-remove"
                  @click=${() => removeAttachment(idx)}
                  title="移除"
                >
                  ✕
                </button>
              </div>
            `)}
          </div>
        ` : ""}

        ${state.knowledgeRefs.length > 0 ? b2`
          <div class="knowledge-refs-list">
            ${state.knowledgeRefs.map((ref, idx) => b2`
              <div class="knowledge-ref-item">
                <span class="kr-icon">📚</span>
                <span class="kr-name" title=${ref.name}>${ref.name}</span>
                <button class="kr-remove" @click=${() => removeKnowledgeRef(idx)} title="移除引用">✕</button>
              </div>
            `)}
          </div>
        ` : ""}

        <div class="taxchat-input-actions">
          <button
            class="taxchat-button primary"
            ?disabled=${state.sending || state.draft.trim().length === 0 && state.attachments.length === 0 && state.knowledgeRefs.length === 0}
            @click=${handleSend}
            title="发送消息 (Enter)"
          >
            <span class="button-icon">➤</span>
            <span>发送</span>
          </button>
        </div>
      </div>
        </div><!-- /taxchat-main -->

        <div class="favorites-panel ${state.showFavorites ? "open" : ""}">
          <div class="favorites-panel__header">
            <div class="panel-tabs">
              <button class="panel-tab ${state.panelTab === "favorites" ? "active" : ""}" @click=${() => {
    state.panelTab = "favorites";
    renderApp();
  }}>
                <span>⭐</span> 收藏夹
              </button>
              <button class="panel-tab ${state.panelTab === "notifications" ? "active" : ""}" @click=${() => {
    state.panelTab = "notifications";
    renderApp();
  }}>
                <span>🔔</span> 消息${state.notifications.length > 0 ? b2` <span class="panel-tab__badge">${state.notifications.length}</span>` : ""}
              </button>
            </div>
            <button class="favorites-panel__close" @click=${() => {
    state.showFavorites = false;
    renderApp();
  }}>✕</button>
          </div>

          ${state.panelTab === "favorites" ? b2`
          <div class="favorites-panel__list">
            ${(() => {
    const favMsgs = state.messages.filter((m4) => m4.type === "assistant" && state.favorites.has(m4.id));
    if (favMsgs.length === 0) {
      return b2`<div class="favorites-empty">暂无收藏</div>`;
    }
    return favMsgs.map((m4) => b2`
                <div class="favorites-item" @click=${() => scrollToMessage(m4.id)}>
                  <div class="favorites-item__text">${m4.text.length > 80 ? m4.text.slice(0, 80) + "..." : m4.text}</div>
                  <div class="favorites-item__meta">
                    <span>${formatTime(m4.timestamp)}</span>
                    <button class="favorites-item__remove" @click=${(e6) => {
      e6.stopPropagation();
      toggleFavorite(m4.id);
    }} title="取消收藏">✕</button>
                  </div>
                </div>
              `);
  })()}
          </div>
          ` : b2`
          <div class="favorites-panel__list">
            ${state.notifications.length === 0 ? b2`<div class="favorites-empty">暂无消息</div>` : [...state.notifications].reverse().map((n4) => b2`
                <div class="notif-item">
                  <div class="notif-item__icon">${n4.icon}</div>
                  <div class="notif-item__body">
                    <div class="notif-item__text">${n4.text}</div>
                    <div class="notif-item__time">${formatTime(n4.timestamp)}</div>
                  </div>
                  <button class="notif-item__remove" @click=${() => {
    state.notifications = state.notifications.filter((x3) => x3.id !== n4.id);
    saveNotifications();
    renderApp();
  }} title="删除">✕</button>
                </div>
              `)}
            ${state.notifications.length > 0 ? b2`
              <div style="padding: 8px; text-align: center;">
                <button class="notif-clear-btn" @click=${() => {
    state.notifications = [];
    saveNotifications();
    renderApp();
  }}>清空所有消息</button>
              </div>
            ` : ""}
          </div>
          `}
        </div>

        <div class="knowledge-panel ${state.showKnowledge ? "open" : ""}">
          <div class="knowledge-panel__header">
            <span class="panel-title">📂 知识库</span>
            <button class="favorites-panel__close" @click=${() => { state.showKnowledge = false; renderApp(); }}>✕</button>
          </div>
          <div class="knowledge-panel__body"
            @dragover=${(e6) => { e6.preventDefault(); e6.stopPropagation(); }}
            @dragenter=${(e6) => { e6.preventDefault(); e6.stopPropagation(); knowledgeDragCounter++; if (!state.knowledgeDragOver) { state.knowledgeDragOver = true; renderApp(); } }}
            @dragleave=${(e6) => { e6.preventDefault(); e6.stopPropagation(); knowledgeDragCounter--; if (knowledgeDragCounter <= 0) { knowledgeDragCounter = 0; state.knowledgeDragOver = false; renderApp(); } }}
            @drop=${(e6) => { e6.preventDefault(); e6.stopPropagation(); knowledgeDragCounter = 0; state.knowledgeDragOver = false; renderApp(); handleKnowledgeDrop(e6); }}
          >
            ${!state.authorizedFolder ? b2`
              <div class="knowledge-empty">
                <div style="font-size: 36px; margin-bottom: 12px;">📂</div>
                <div style="margin-bottom: 16px; color: #6b7280;">尚未选择知识库文件夹</div>
                <button class="skill-add-btn" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())}>📂 选择文件夹</button>
              </div>
            ` : b2`
              <div class="knowledge-folder-bar">
                <span class="knowledge-folder-path" title=${state.authorizedFolder}>📂 ${state.authorizedFolder}</span>
                <button class="knowledge-folder-change" @click=${() => handleAuthorizeFolder().then(() => loadKnowledgeFiles())} title="更换文件夹">\u66F4\u6362</button>
                <button class="knowledge-folder-change" @click=${() => loadKnowledgeFiles()} title="刷新文件列表">\u5237\u65B0</button>
              </div>
              ${state.knowledgeFiles.length > 0 ? b2`
                <div class="sort-bar">
                  <span class="sort-bar__label">\u6392\u5E8F:</span>
                  <button class="sort-bar__btn ${state.filesSortBy === "time" ? "active" : ""}" @click=${() => { state.filesSortBy = "time"; renderApp(); }}>\u6309\u65F6\u95F4</button>
                  <button class="sort-bar__btn ${state.filesSortBy === "name" ? "active" : ""}" @click=${() => { state.filesSortBy = "name"; renderApp(); }}>\u6309\u540D\u79F0</button>
                </div>
              ` : ""}
              ${state.knowledgeDragOver ? b2`
                <div class="knowledge-drop-zone">
                  <div class="knowledge-drop-text">📁 \u677E\u5F00\u4EE5\u6DFB\u52A0\u6587\u4EF6\u5230\u77E5\u8BC6\u5E93</div>
                </div>
              ` : ""}
              ${state.knowledgeLoading ? b2`
                <div class="knowledge-empty">\u52A0\u8F7D\u4E2D...</div>
              ` : state.knowledgeFiles.length === 0 ? b2`
                <div class="knowledge-empty">\u6587\u4EF6\u5939\u4E2D\u6CA1\u6709\u53EF\u8BC6\u522B\u7684\u6587\u4EF6<br><small>\u652F\u6301: txt, pdf, docx, xlsx, csv, json, md \u7B49</small></div>
              ` : sortedFiles().map((f4) => b2`
                <div class="knowledge-file-item">
                  <span class="knowledge-file-icon">${f4.type === "image" ? "🖼" : f4.type === "doc" ? "📊" : "📄"}</span>
                  <span class="knowledge-file-name" title=${f4.name}>${f4.name}</span>
                  <span class="knowledge-file-size">${formatFileSize(f4.size)}</span>
                  <button class="knowledge-file-btn ref" @click=${() => addKnowledgeRef(f4.name)} title="引用到对话">引用</button>
                  <button class="knowledge-file-btn del" @click=${() => deleteKnowledgeFileAction(f4.name)} title="删除文件">🗑</button>
                </div>
              `)}
            `}
          </div>
        </div>

        <div class="skills-panel ${state.showSkills ? "open" : ""}">
          <div class="skills-panel__header">
            <span class="panel-title">🛠 技能管理</span>
            <button class="favorites-panel__close" @click=${() => { state.showSkills = false; renderApp(); }}>✕</button>
          </div>
          <div class="skills-panel__body">
            <div class="skill-section-header" @click=${() => { state.builtinSkillsCollapsed = !state.builtinSkillsCollapsed; renderApp(); }}>
              <span class="skill-section-arrow ${state.builtinSkillsCollapsed ? "collapsed" : ""}">\u25BE</span>
              <span class="skill-section-label">\u9884\u5236\u6280\u80FD</span>
              <span class="skill-section-count">${BUILTIN_SKILLS.length}</span>
            </div>
            ${state.builtinSkillsCollapsed ? "" : BUILTIN_SKILLS.map((sk) => b2`
              <div class="skill-item skill-item--builtin">
                <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                  <div class="skill-item__name">${sk.name} <span class="skill-builtin-badge">\u9884\u5236</span></div>
                  ${sk.description ? b2`<div class="skill-item__desc">${sk.description}</div>` : ""}
                </div>
              </div>
            `)}
            <div class="skill-section-label" style="margin-top: 12px; padding-left: 12px;">\u81EA\u5B9A\u4E49\u6280\u80FD</div>
            <div class="skill-add-row">
              <button class="skill-add-btn" @click=${() => openSkillEditor()}>➕ \u65B0\u5EFA Skill</button>
              <button class="skill-add-btn" @click=${() => handleInstallSkillPackage()}>📦 \u4E0A\u4F20\u6280\u80FD\u5305</button>
            </div>
            ${state.customSkills.length > 1 ? b2`
              <div class="sort-bar">
                <span class="sort-bar__label">\u6392\u5E8F:</span>
                <button class="sort-bar__btn ${state.skillsSortBy === "time" ? "active" : ""}" @click=${() => { state.skillsSortBy = "time"; renderApp(); }}>\u6309\u65F6\u95F4</button>
                <button class="sort-bar__btn ${state.skillsSortBy === "name" ? "active" : ""}" @click=${() => { state.skillsSortBy = "name"; renderApp(); }}>\u6309\u540D\u79F0</button>
              </div>
            ` : ""}
            ${state.customSkills.length === 0 ? b2`<div class="knowledge-empty" style="padding: 12px;">\u6682\u65E0\u81EA\u5B9A\u4E49\u6280\u80FD</div>` : sortedSkills().map((sk) => b2`
                <div class="skill-item skill-item--custom">
                  <div class="skill-item__emoji" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">${sk.emoji}</div>
                  <div class="skill-item__body" @click=${() => handleCustomSkillClick(sk)} style="cursor:pointer">
                    <div class="skill-item__name">${sk.name}</div>
                    ${sk.description ? b2`<div class="skill-item__desc">${sk.description}</div>` : ""}
                  </div>
                  <div class="skill-item__actions">
                    <button class="skill-item__btn ${sk.pinned ? "pinned" : ""}" @click=${() => toggleSkillPin(sk.id)} title="${sk.pinned ? "\u53D6\u6D88\u5FEB\u6377" : "\u6DFB\u52A0\u5230\u5FEB\u6377"}">📌</button>
                    <button class="skill-item__btn" @click=${() => exportSkillAsZip(sk)} title="\u5BFC\u51FA">📤</button>
                    <button class="skill-item__btn" @click=${() => openSkillEditor(sk)} title="\u7F16\u8F91">✏️</button>
                    <button class="skill-item__btn" @click=${() => deleteCustomSkill(sk.id)} title="\u5220\u9664">🗑</button>
                  </div>
                </div>
              `)}
          </div>
        </div>
      </div><!-- /taxchat-body -->

      ${state.showAbout ? b2`
        <div class="about-modal" @click=${() => {
    state.showAbout = false;
    state.confirmingClear = false;
    renderApp();
  }}>
          <div class="about-content" @click=${(e6) => e6.stopPropagation()}>
            <button class="about-close" @click=${() => {
    state.showAbout = false;
    state.confirmingClear = false;
    renderApp();
  }}>✕</button>
            <div class="about-logo">
              <img src="./assets/taxchat-logo.png" alt="智税宝" />
            </div>
            <div class="about-title">智税宝</div>
            <div class="about-desc">
              智税宝是您的AI税务助理，基于先进的人工智能技术，为您提供专业的税务服务：
            </div>
            <div class="about-features">
              <div class="about-feature-item">🧾 税务风险治理与应对策略</div>
              <div class="about-feature-item">📊 纳税申报表预审与比对</div>
              <div class="about-feature-item">📝 合同及票据税务审核</div>
              <div class="about-feature-item">💬 日常税务问题咨询</div>
            </div>
            <div class="about-divider"></div>
            <div class="about-actions">
              <button class="about-action-btn" @click=${() => {
    handleAuthorizeFolder();
  }} ?disabled=${state.importingFolder}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span>${state.importingFolder ? "\u5BFC\u5165\u4E2D..." : "\u6388\u6743\u8BBF\u95EE\u6587\u4EF6\u5939"}</span>
              </button>
              ${state.authorizedFolder ? b2`
                <div class="about-folder-row">
                  <div class="about-folder-path" title=${state.authorizedFolder}>${state.authorizedFolder}</div>
                  <button class="about-folder-refresh" @click=${() => {
    handleRefreshFolder();
  }} ?disabled=${state.importingFolder} title="\u91CD\u65B0\u8BFB\u53D6\u6587\u4EF6\u5939">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                      <path d="M21 3v5h-5"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                      <path d="M3 21v-5h5"/>
                    </svg>
                  </button>
                </div>
              ` : ""}
              ${state.importResult ? b2`
                <div class="about-folder-status">${state.importResult}</div>
              ` : ""}
              ${state.confirmingClear ? b2`
                <div class="about-confirm-hint">\u6E05\u7A7A\u540E\u804A\u5929\u8BB0\u5F55\u548C\u6536\u85CF\u5939\u5C06\u88AB\u5220\u9664\uFF0CAI\u8BB0\u5FC6\u4E0D\u53D7\u5F71\u54CD</div>
                <div class="about-confirm-actions">
                  <button class="about-confirm-btn confirm" @click=${() => {
    doClearAll();
  }}>
                    \u786E\u8BA4\u6E05\u7A7A
                  </button>
                  <button class="about-confirm-btn cancel" @click=${() => {
    state.confirmingClear = false;
    renderApp();
  }}>
                    \u53D6\u6D88
                  </button>
                </div>
              ` : b2`
                <button class="about-action-btn" @click=${() => {
    state.confirmingClear = true;
    renderApp();
  }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  <span>\u6E05\u7A7A\u5BF9\u8BDD\u8BB0\u5F55</span>
                </button>
              `}
              <button class="about-action-btn" @click=${() => { state.showQuickStart = true; state.showAbout = false; renderApp(); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <span>\u67E5\u770B\u4F7F\u7528\u6307\u5357</span>
              </button>
            </div>
            <div class="about-version">版本 1.0</div>
          </div>
        </div>
      ` : ""}

      ${state.showQuickStart ? renderQuickStart() : ""}

      ${state.editingSkill ? b2`
        <div class="skill-editor-overlay" @click=${() => {
    state.editingSkill = null;
    renderApp();
  }}>
          <div class="skill-editor" @click=${(e6) => e6.stopPropagation()}>
            <h3>${state.customSkills.some((s4) => s4.id === state.editingSkill.id) ? "\u7F16\u8F91 Skill" : "\u65B0\u5EFA Skill"}</h3>
            <label>名称 *</label>
            <input type="text" .value=${l3(state.editingSkill.name)} @input=${(e6) => {
    state.editingSkill.name = e6.target.value;
  }} placeholder="例：增值税计算助手" />
            <label>图标</label>
            <input type="text" .value=${l3(state.editingSkill.emoji)} @input=${(e6) => {
    state.editingSkill.emoji = e6.target.value;
  }} placeholder="🤖" style="width: 60px;" />
            <label>描述</label>
            <textarea .value=${l3(state.editingSkill.description)} @input=${(e6) => {
    state.editingSkill.description = e6.target.value;
  }} placeholder="描述这个技能的用途和使用场景，例如：当用户提到增值税计算、税率查询时使用此技能" style="min-height: 60px;"></textarea>
            <label>操作流程 *</label>
            <textarea .value=${l3(state.editingSkill.prompt)} @input=${(e6) => {
    state.editingSkill.prompt = e6.target.value;
  }} placeholder="请详细描述技能的操作流程（自然语言）。例如：分析用户上传的文件，从增值税角度列出所有涉税项目，计算应纳税额..."></textarea>
            <div class="skill-editor__actions">
              <button class="skill-editor__cancel" @click=${() => {
    state.editingSkill = null;
    renderApp();
  }}>取消</button>
              <button class="skill-editor__save" @click=${() => {
    if (!state.editingSkill?.name.trim() || !state.editingSkill?.prompt.trim()) {
      alert("\u8BF7\u586B\u5199\u540D\u79F0\u548C\u64CD\u4F5C\u6D41\u7A0B");
      return;
    }
    saveSkillFromEditor();
  }}>保存技能</button>
            </div>
          </div>
        </div>
      ` : ""}

      ${state.previewAttachment ? b2`
        <div class="preview-modal" @click=${() => {
    state.previewAttachment = null;
    renderApp();
  }}>
          <div class="preview-content" @click=${(e6) => e6.stopPropagation()}>
            <button class="preview-close" @click=${() => {
    state.previewAttachment = null;
    renderApp();
  }}>✕</button>
            ${state.previewAttachment.type.startsWith("image/") ? b2`
              <img src=${state.previewAttachment.dataUrl} alt=${state.previewAttachment.name} class="preview-image" />
            ` : b2`
              <div class="preview-file-info">
                <div class="preview-file-icon">📄</div>
                <div class="preview-file-name">${state.previewAttachment.name}</div>
                <div class="preview-file-size">${formatFileSize(state.previewAttachment.size)}</div>
                <div class="preview-file-type">${state.previewAttachment.type}</div>
              </div>
            `}
          </div>
        </div>
      ` : ""}

      ${state.toastMessage ? b2`
        <div class="taxchat-toast">
          <div class="taxchat-toast__icon">📚</div>
          <div class="taxchat-toast__text">${state.toastMessage}</div>
          <button class="taxchat-toast__close" @click=${() => {
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastMessage = null;
    state.toastTimer = null;
    renderApp();
  }}>✕</button>
        </div>
      ` : ""}
    </div>
  `;
  D(content, app);
  requestAnimationFrame(() => {
    const container = document.getElementById("messages-container");
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (_forceScrollBottom || isNearBottom || state.sending) {
        container.scrollTop = container.scrollHeight;
        _forceScrollBottom = false;
      }
    }
  });
  const input = document.getElementById("message-input");
  if (input && !state.sending) {
    input.focus();
    state.inputRef = input;
  }
}
function handleQuickSkill(skillName, prompt, displayLabel, noFilePicker) {
  if (!state.client || state.sending) return;
  state.lastSkillName = skillName;
  if (noFilePicker) {
    var builtinSkill = BUILTIN_SKILLS.find(function(s) { return s.folderName === skillName; });
    if (builtinSkill) {
      state.activeCustomSkill = builtinSkill;
    }
    state.draft = "\u8BF7\u6267\u884C\u7968\u636E\u6574\u7406\u6D41\u7A0B";
    handleSend();
    return;
  }
  if (state.attachments.length > 0) {
    state.draft = prompt;
    handleSend();
    return;
  }
  state.pendingSkill = { name: skillName, prompt, displayLabel };
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.xml";
  fileInput.multiple = true;
  fileInput.onchange = () => {
    if (fileInput.files && fileInput.files.length > 0) {
      handleFiles(fileInput.files);
    } else {
      state.pendingSkill = null;
    }
  };
  fileInput.click();
}
async function handleSend() {
  if (!state.client || state.sending) return;
  if (!state.draft.trim() && state.attachments.length === 0) return;
  const userText = state.draft.trim();
  const msgId = generateUUID2();
  const triggeredSkillName = state.lastSkillName;
  state.lastSkillName = null;
  const activeSkill = state.activeCustomSkill;
  state.activeCustomSkill = null;
  let detectedSkill = activeSkill;
  if (!detectedSkill && userText) {
    const textLower = userText.toLowerCase();
    for (const sk of state.customSkills) {
      if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
        detectedSkill = sk;
        break;
      }
    }
    if (!detectedSkill) {
      for (const sk of BUILTIN_SKILLS) {
        if (sk.prompt && sk.name && textLower.includes(sk.name.toLowerCase())) {
          detectedSkill = sk;
          break;
        }
      }
    }
  }
  let messageToSend;
  if (detectedSkill && detectedSkill.prompt) {
    let skillSuffix = "";
    if (detectedSkill.id === "__builtin_knowledge-base" && state.authorizedFolder) {
      skillSuffix = `\n\n\u3010\u77E5\u8BC6\u5E93\u8DEF\u5F84\u3011\n${state.authorizedFolder}`;
    }
    messageToSend = `\u8BF7\u4E25\u683C\u6309\u7167\u4EE5\u4E0B\u64CD\u4F5C\u6D41\u7A0B\u5904\u7406\u7528\u6237\u7684\u8F93\u5165\u3002

\u3010${detectedSkill.name} - \u64CD\u4F5C\u6D41\u7A0B\u3011
${detectedSkill.prompt}

\u3010\u7528\u6237\u8F93\u5165\u3011
${userText}${skillSuffix}`;
    console.log(`[Skill] Embedded prompt for skill "${detectedSkill.name}", prompt length: ${detectedSkill.prompt.length}`);
  } else if (detectedSkill) {
    messageToSend = `\u8BF7\u6309\u7167${detectedSkill.name}\u7684\u64CD\u4F5C\u6D41\u7A0B\u5904\u7406\u4EE5\u4E0B\u5185\u5BB9\u3002

${userText}`;
    console.log(`[Skill] Skill "${detectedSkill.name}" active but no prompt text`);
  } else {
    messageToSend = userText;
  }
  const hasAttachments = state.attachments.length > 0;
  const hasImages = state.attachments.some((att) => att.type.startsWith("image/"));
  const hasDocuments = state.attachments.some(
    (att) => att.type === "application/pdf" || att.type.includes("word") || att.type.includes("excel") || att.type.includes("document")
  );
  const displayText = userText || `(${state.attachments.length} \u4E2A\u6587\u4EF6)`;
  if (hasAttachments && !detectedSkill) {
    if (!userText) {
      if (hasImages && hasDocuments) {
        messageToSend = "\u8BF7\u5206\u6790\u8FD9\u4E9B\u56FE\u7247\u548C\u6587\u6863\uFF0C\u63D0\u53D6\u5176\u4E2D\u7684\u6587\u5B57\u5185\u5BB9\u5E76\u603B\u7ED3\u8981\u70B9\u3002";
      } else if (hasImages) {
        messageToSend = "\u8BF7\u63D0\u53D6\u56FE\u7247\u4E2D\u7684\u6240\u6709\u6587\u5B57\u5185\u5BB9\uFF0C\u4FDD\u6301\u539F\u6709\u7684\u7ED3\u6784\u548C\u683C\u5F0F\u3002\u5982\u679C\u56FE\u7247\u4E2D\u6CA1\u6709\u6587\u5B57\uFF0C\u8BF7\u63CF\u8FF0\u56FE\u7247\u7684\u5185\u5BB9\u3002";
      } else if (hasDocuments) {
        messageToSend = "\u8BF7\u5206\u6790\u8FD9\u4E2A\u6587\u6863\uFF0C\u63D0\u53D6\u5E76\u603B\u7ED3\u5176\u4E2D\u7684\u4E3B\u8981\u5185\u5BB9\u3002";
      }
    } else if (hasImages) {
      messageToSend = `${userText}

\uFF08\u6CE8\uFF1A\u8BF7\u5148\u8BC6\u522B\u5E76\u63D0\u53D6\u56FE\u7247\u4E2D\u7684\u6587\u5B57\u5185\u5BB9\uFF0C\u7136\u540E\u7ED3\u5408\u6211\u7684\u95EE\u9898\u8FDB\u884C\u5206\u6790\uFF09`;
    }
  } else if (hasAttachments && detectedSkill && hasImages) {
    messageToSend += "\n\n\uFF08\u6CE8\uFF1A\u8BF7\u5148\u8BC6\u522B\u5E76\u63D0\u53D6\u56FE\u7247\u4E2D\u7684\u6587\u5B57\u5185\u5BB9\uFF0C\u7136\u540E\u7ED3\u5408\u64CD\u4F5C\u6D41\u7A0B\u8FDB\u884C\u5206\u6790\uFF09";
  }
  const messageAttachments = state.attachments.length > 0 ? [...state.attachments] : void 0;
  state.messages.push({
    type: "user",
    text: displayText,
    timestamp: Date.now(),
    id: msgId,
    attachments: messageAttachments
  });
  state.draft = "";
  state.sending = true;
  state.thinkingLabel = "\u6B63\u5728\u601D\u8003...";
  state.toolsActive = 0;
  state.currentRunId = null;
  renderApp();
  let apiAttachments = state.attachments.map((att) => {
    const match = /^data:([^;]+);base64,(.+)$/.exec(att.dataUrl);
    if (!match) {
      console.warn("Failed to parse data URL for file:", att.name);
      return null;
    }
    const mimeType = match[1];
    let attachmentType = "document";
    if (mimeType.startsWith("image/")) {
      attachmentType = "image";
    } else if (mimeType === "application/pdf") {
      attachmentType = "document";
    } else if (mimeType.includes("word") || mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      attachmentType = "document";
    }
    const attachment = {
      type: attachmentType,
      mimeType,
      fileName: att.name,
      content: match[2]
    };
    console.log(`Prepared attachment: ${att.name}, type: ${attachmentType}, mime: ${mimeType}, base64 length: ${match[2].length}`);
    return attachment;
  }).filter((a3) => a3 !== null);
  console.log(`Total attachments prepared: ${apiAttachments.length}`);
  // Extract text from document attachments (PDF, Word etc.) client-side
  // since the gateway only accepts image attachments and drops everything else
  var _documentText = "";
  if (hasDocuments) {
    var _eApi = window.electronAPI;
    if (_eApi?.extractDocumentText) {
      var _docParts = [];
      for (var _att of state.attachments) {
        var _m = /^data:([^;]+);base64,(.+)$/.exec(_att.dataUrl);
        if (!_m) continue;
        try {
          var _res = await _eApi.extractDocumentText(_m[2], _m[1], _att.name);
          if (_res?.ok && _res.text?.trim()) {
            _docParts.push(`\u3010${_att.name}\u3011\n${_res.text.trim()}`);
          }
        } catch (_e) {
          console.warn(`Failed to extract text from ${_att.name}:`, _e);
        }
      }
      if (_docParts.length > 0) {
        _documentText = _docParts.join("\n\n");
        messageToSend += `\n\n\u3010\u6587\u4EF6\u5185\u5BB9\u3011\n${_documentText}`;
      }
    }
  }
  // Remove non-image attachments (gateway drops them anyway)
  apiAttachments = apiAttachments.filter((a3) => a3.type === "image");
  state.attachments = [];
  const idempotencyKey = generateUUID2();
  if (state.knowledgeRefs.length > 0) {
    var krApi = window.electronAPI;
    if (krApi?.readKnowledgeFile) {
      var refParts = [];
      for (var krRef of state.knowledgeRefs) {
        try {
          var krResult = await krApi.readKnowledgeFile(krRef.name);
          if (krResult?.ok && krResult.content) {
            refParts.push(`\u3010\u77E5\u8BC6\u5E93\u5F15\u7528: ${krRef.name}\u3011\n${krResult.content}`);
          }
        } catch (_kr) {}
      }
      if (refParts.length > 0) {
        messageToSend = `${messageToSend}\n\n---\n${refParts.join("\n\n")}\n---`;
      }
    }
    state.knowledgeRefs = [];
    renderApp();
  }
  if (state.folderKnowledge && !state.folderKnowledgeSent) {
    messageToSend = `${messageToSend}

---
\u3010\u5DF2\u5BFC\u5165\u77E5\u8BC6\u5E93\u6587\u4EF6\u5185\u5BB9\u3011
\u4EE5\u4E0B\u662F\u7528\u6237\u6388\u6743\u6587\u4EF6\u5939\u4E2D\u7684\u6587\u4EF6\u5185\u5BB9\uFF0C\u8BF7\u6839\u636E\u8FD9\u4E9B\u5185\u5BB9\u56DE\u7B54\u7528\u6237\u7684\u95EE\u9898\uFF1A
${state.folderKnowledge}
---`;
    state.folderKnowledgeSent = true;
  }
  const finalMessage = messageToSend || (apiAttachments.length > 0 ? "(\u67E5\u770B\u9644\u4EF6)" : "");
  const requestPayload = {
    sessionKey: state.sessionKey,
    message: finalMessage,
    // must have text content
    deliver: false,
    idempotencyKey
  };
  if (apiAttachments.length > 0) {
    requestPayload.attachments = apiAttachments;
  }
  console.log("Sending chat.send with payload:", {
    ...requestPayload,
    attachments: apiAttachments.map((a3) => ({ ...a3, content: a3.content.substring(0, 50) + "..." }))
  });
  state.client.request("chat.send", requestPayload).then((response) => {
    console.log("Chat.send response:", response);
  }).catch((err2) => {
    state.messages.push({
      type: "assistant",
      text: `\u62B1\u6B49\uFF0C\u53D1\u9001\u6D88\u606F\u65F6\u51FA\u9519\uFF1A${String(err2)}`,
      timestamp: Date.now(),
      id: generateUUID2()
    });
    state.sending = false;
    renderApp();
  });
}
function doClearAll() {
  state.messages = [];
  state.draft = "";
  state.sending = false;
  state.favorites.clear();
  state.showFavorites = false;
  state.showAbout = false;
  state.confirmingClear = false;
  state.folderKnowledgeSent = false;
  saveFavorites();
  saveMessages();
  renderApp();
}
function formatImportResult(result) {
  const parts = [];
  if (result.textCount > 0) parts.push(`\u6587\u672C ${result.textCount}`);
  if (result.imageCount > 0) parts.push(`\u56FE\u7247 ${result.imageCount}`);
  if (result.docCount > 0) parts.push(`\u6587\u6863 ${result.docCount}`);
  if (parts.length === 0) return result.message || "\u672A\u627E\u5230\u53EF\u8BFB\u53D6\u7684\u6587\u4EF6";
  return `\u5DF2\u5BFC\u5165: ${parts.join("\u3001")}`;
}
async function doImportFolder(folderPath) {
  const api = window.electronAPI;
  state.importingFolder = true;
  state.importResult = null;
  renderApp();
  try {
    const result = await api.importFolderToMemory(folderPath);
    state.importingFolder = false;
    if (result.ok) {
      state.authorizedFolder = result.folderPath;
      localStorage.setItem("taxbot_authorized_folder", result.folderPath);
      state.importResult = formatImportResult(result);
      addNotification(`\u6587\u4EF6\u5939\u5DF2\u5BFC\u5165: ${state.importResult}`, "\u{1F4C2}");
      await loadFolderKnowledge();
      state.folderKnowledgeSent = false;
      startWatcher();
    } else {
      state.importResult = result.error || "\u5BFC\u5165\u5931\u8D25";
    }
  } catch (err2) {
    state.importingFolder = false;
    state.importResult = err2?.message || "\u5BFC\u5165\u5931\u8D25";
  }
  renderApp();
}
async function handleAuthorizeFolder() {
  const api = window.electronAPI;
  if (!api?.openFolderDialog) return;
  const folderPath = await api.openFolderDialog();
  if (!folderPath) return;
  await doImportFolder(folderPath);
}
async function handleRefreshFolder() {
  if (!state.authorizedFolder) return;
  await doImportFolder(state.authorizedFolder);
}
async function loadFolderKnowledge() {
  const api = window.electronAPI;
  if (!api?.getFolderKnowledge || !state.authorizedFolder) return;
  try {
    const result = await api.getFolderKnowledge();
    if (result?.ok && result.content) {
      state.folderKnowledge = result.content;
      console.log(`Folder knowledge loaded: ${result.files?.length || 0} files, ${result.content.length} chars`);
    }
  } catch (err2) {
    console.warn("Failed to load folder knowledge:", err2);
  }
}
async function loadKnowledgeFiles() {
  var api = window.electronAPI;
  if (!api?.listKnowledgeFiles || !state.authorizedFolder) return;
  state.knowledgeLoading = true;
  renderApp();
  try {
    var result = await api.listKnowledgeFiles(state.authorizedFolder);
    if (result?.ok) {
      state.knowledgeFiles = result.files || [];
    }
  } catch (err2) {
    console.warn("Failed to list knowledge files:", err2);
  }
  state.knowledgeLoading = false;
  renderApp();
}
async function handleKnowledgeDrop(e6) {
  var api = window.electronAPI;
  if (!api?.copyToKnowledgeFolder || !state.authorizedFolder) return;
  var files = e6.dataTransfer?.files;
  if (!files || files.length === 0) return;
  for (var i3 = 0; i3 < files.length; i3++) {
    var file = files[i3];
    var reader = new FileReader();
    reader.onload = async () => {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(",")[1];
      if (!base64) return;
      try {
        await api.copyToKnowledgeFolder({
          folderPath: state.authorizedFolder,
          fileName: file.name,
          base64Data: base64
        });
      } catch (err2) {
        console.warn("Failed to copy file to knowledge folder:", err2);
      }
      if (i3 === files.length - 1) {
        await loadKnowledgeFiles();
        await loadFolderKnowledge();
        state.folderKnowledgeSent = false;
      }
    };
    reader.readAsDataURL(file);
  }
}
function addKnowledgeRef(name) {
  if (state.knowledgeRefs.some((r3) => r3.name === name)) return;
  state.knowledgeRefs.push({ name });
  renderApp();
}
function removeKnowledgeRef(index) {
  state.knowledgeRefs.splice(index, 1);
  renderApp();
}
async function deleteKnowledgeFileAction(fileName) {
  var api = window.electronAPI;
  if (!api?.deleteKnowledgeFile || !state.authorizedFolder) return;
  try {
    await api.deleteKnowledgeFile(state.authorizedFolder, fileName);
    state.knowledgeRefs = state.knowledgeRefs.filter((r3) => r3.name !== fileName);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err2) {
    console.warn("Failed to delete knowledge file:", err2);
  }
}
function showToast(message, durationMs = 5e3) {
  if (state.toastTimer) clearTimeout(state.toastTimer);
  state.toastMessage = message;
  renderApp();
  state.toastTimer = setTimeout(() => {
    state.toastMessage = null;
    state.toastTimer = null;
    renderApp();
  }, durationMs);
}
function startWatcher() {
  const api = window.electronAPI;
  if (!api?.startFolderWatcher || !state.authorizedFolder) return;
  api.startFolderWatcher(state.authorizedFolder);
}
var _watcherListenerRegistered = false;
function registerWatcherListener() {
  if (_watcherListenerRegistered) return;
  const api = window.electronAPI;
  if (!api?.onFolderKnowledgeUpdated) return;
  _watcherListenerRegistered = true;
  api.onFolderKnowledgeUpdated(async (data) => {
    console.log(`Folder watcher: ${data.count} new file(s) detected`);
    await loadFolderKnowledge();
    const names = data.newFiles.length <= 3 ? data.newFiles.join("\u3001") : data.newFiles.slice(0, 3).join("\u3001") + ` \u7B49${data.newFiles.length}\u4E2A\u6587\u4EF6`;
    const msg = `\u65B0\u77E5\u8BC6\u5DF2\u5B66\u4E60: ${names}`;
    showToast(msg);
    addNotification(msg, "\u{1F4DA}");
    renderApp();
  });
}
var _skillsListenerRegistered = false;
function registerManagedSkillsListener() {
  if (_skillsListenerRegistered) return;
  const api = window.electronAPI;
  if (!api?.onManagedSkillsUpdated) return;
  _skillsListenerRegistered = true;
  api.onManagedSkillsUpdated(() => {
    console.log("Managed skills directory changed, syncing...");
    syncManagedSkills();
  });
}
document.addEventListener("click", () => {
  if (state.showStatusMenu) {
    state.showStatusMenu = false;
    renderApp();
  }
});
document.addEventListener("click", (e6) => {
  const target = e6.target;
  const anchor = target.closest("a");
  if (!anchor) return;
  const href = anchor.getAttribute("href");
  if (!href) return;
  if (!anchor.closest(".message-bubble")) return;
  e6.preventDefault();
  e6.stopPropagation();
  const api = window.electronAPI;
  if (href.startsWith("#localpath=")) {
    const localPath = decodeURIComponent(href.replace("#localpath=", ""));
    if (api?.openPath) {
      api.openPath(localPath);
    }
  } else if (/^https?:\/\//i.test(href)) {
    if (api?.openPath) {
      api.openPath(href);
    } else {
      window.open(href, "_blank");
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  connectGateway();
  loadFolderKnowledge();
  registerWatcherListener();
  registerManagedSkillsListener();
  startWatcher();
  syncManagedSkills();
});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
lit-html/directive.js:
lit-html/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
lit-html/directives/live.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@noble/ed25519/index.js:
  (*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.1/LICENSE *)
*/
//# sourceMappingURL=taxchat.js.map
