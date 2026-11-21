import { useEffect, useRef, useState } from "react";
import { defOf } from "../data.js";

/* Terme souligné avec une définition au survol. Sans définition connue : texte simple. */
export function T({ term, children }) {
  const key = term ?? (typeof children === "string" ? children : "");
  if (!defOf(key)) return <>{children}</>;
  return (
    <span className="tip" data-term={key} tabIndex={0}>
      {children}
    </span>
  );
}

/* Une seule info-bulle pour toute la page, par délégation d'événements */
export function TooltipLayer() {
  const ref = useRef(null);
  const [tip, setTip] = useState(null); // { term, def, x, y, below }

  useEffect(() => {
    let current = null;
    const find = (e) => e.target.closest?.(".tip[data-term]");

    const show = (el) => {
      current = el;
      const label = el.dataset.term === "terme technique" ? el.textContent.trim() : el.textContent.trim() || el.dataset.term;
      const r = el.getBoundingClientRect();
      setTip({ term: label, def: defOf(el.dataset.term), r });
      el.setAttribute("aria-describedby", "tooltip");
    };
    const hide = () => {
      current?.removeAttribute("aria-describedby");
      current = null;
      setTip(null);
    };

    const over = (e) => { const el = find(e); if (el && el !== current) show(el); };
    const out = (e) => { const el = find(e); if (el && !el.contains(e.relatedTarget)) hide(); };
    const fin = (e) => { const el = find(e); if (el) show(el); };
    const fout = (e) => { if (find(e)) hide(); };
    const key = (e) => { if (e.key === "Escape") hide(); };
    const touch = window.matchMedia("(hover: none)");
    const tap = (e) => {
      if (!touch.matches) return;
      const el = find(e);
      if (el) { e.preventDefault(); el === current ? hide() : show(el); }
      else if (current) hide();
    };

    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    document.addEventListener("focusin", fin);
    document.addEventListener("focusout", fout);
    document.addEventListener("keydown", key);
    document.addEventListener("click", tap, true);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("focusin", fin);
      document.removeEventListener("focusout", fout);
      document.removeEventListener("keydown", key);
      document.removeEventListener("click", tap, true);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  // positionnement après rendu (on connaît alors la taille de la bulle)
  useEffect(() => {
    const el = ref.current;
    if (!el || !tip) return;
    const m = 10, tw = el.offsetWidth, th = el.offsetHeight, { r } = tip;
    const x = Math.max(m, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - m));
    let y = r.top - th - 10;
    const below = y < m;
    if (below) y = r.bottom + 10;
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.classList.toggle("below", below);
  }, [tip]);

  return (
    <div ref={ref} id="tooltip" role="tooltip" className={`tooltip${tip ? " on" : ""}`}>
      {tip && (<><b>{tip.term}</b>{tip.def}</>)}
    </div>
  );
}
