// Side-effect CSS imports from the font packages have no bundled types.
declare module "@fontsource-variable/instrument-sans";
declare module "@fontsource-variable/jetbrains-mono";

// Plain CSS side-effect imports (e.g. `import "./globals.css"`).
declare module "*.css";
