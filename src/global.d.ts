// Lets TypeScript accept plain side-effect CSS imports (e.g. `import "./globals.css"`)
// when `noUncheckedSideEffectImports` is on — the default from TypeScript 6.
declare module "*.css";
