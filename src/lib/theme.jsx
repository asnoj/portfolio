/* Thème clair / sombre : attribut data-theme sur <html>, mémorisé dans localStorage.
   La valeur initiale est posée avant le rendu par le script inline de index.html. */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { reducedMotion } from "./scroll.js";

const ThemeCtx = createContext({ theme: "dark", toggle: () => {} });

/* couleurs utilisées par les composants canvas / WebGL (qui ne lisent pas le CSS) */
export const PALETTES = {
  dark: {
    acid: "#c8ff00", acidInk: "#c8ff00", pink: "#ff5cc8", strong: "#ffffff",
    text: "#e9eee6", dotBase: "#2b3427", spotlight: "dark",
  },
  light: {
    acid: "#c8ff00", acidInk: "#4f7000", pink: "#c0177f", strong: "#0b0c0b",
    text: "#14170f", dotBase: "#cfd4c4", spotlight: "light",
  },
};

const current = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(current);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f1f2ec" : "#0b0c0b");
    try { localStorage.setItem("theme", theme); } catch { /* stockage indisponible */ }
  }, [theme]);

  /* bascule avec un cercle qui s'ouvre depuis le bouton (View Transitions si dispo) */
  const toggle = useCallback((e) => {
    const next = current() === "light" ? "dark" : "light";
    const apply = () => flushSync(() => { document.documentElement.dataset.theme = next; setTheme(next); });
    if (!document.startViewTransition || reducedMotion()) return apply();
    const r = e?.currentTarget?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth - 40;
    const y = r ? r.top + r.height / 2 : 28;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.7, 0, .2, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
export const usePalette = () => PALETTES[useTheme().theme];
