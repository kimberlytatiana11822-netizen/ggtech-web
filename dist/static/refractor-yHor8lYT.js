import { e as distExports, j as jsxRuntimeExports } from "./pane2-D0T0EVhZ.js";
import { hasLanguage, Refractor } from "./index-DnxH7EKZ.js";
function LazyRefractor(props) {
  let $ = distExports.c(13), { language: languageProp, value } = props, language = typeof languageProp == "string" ? languageProp : void 0, t0;
  $[0] === language ? t0 = $[1] : (t0 = language ? hasLanguage(language) : false, $[0] = language, $[1] = t0);
  let registered = t0, t1;
  $[2] !== language || $[3] !== registered || $[4] !== value ? (t1 = !(language && registered) && /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: value }), $[2] = language, $[3] = registered, $[4] = value, $[5] = t1) : t1 = $[5];
  let t2;
  $[6] !== language || $[7] !== registered || $[8] !== value ? (t2 = language && registered && /* @__PURE__ */ jsxRuntimeExports.jsx(Refractor, {
    inline: true,
    language,
    value: String(value)
  }), $[6] = language, $[7] = registered, $[8] = value, $[9] = t2) : t2 = $[9];
  let t3;
  return $[10] !== t1 || $[11] !== t2 ? (t3 = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [t1, t2] }), $[10] = t1, $[11] = t2, $[12] = t3) : t3 = $[12], t3;
}
export {
  LazyRefractor as default
};
