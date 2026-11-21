import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SECTIONS } from "../data.js";
import { scrollToId, startScroll, stopScroll } from "../lib/scroll.js";
import DecryptedText from "./rb/DecryptedText/DecryptedText.jsx";

const pad = (n) => String(n).padStart(2, "0");

export default function Menu({ open, active, onClose }) {
  const root = useRef(null);
  const tl = useRef(null);
  const items = useRef([]);
  const [sel, setSel] = useState(active);

  useGSAP(() => {
    gsap.set(root.current, { autoAlpha: 0 });
    tl.current = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } })
      .set(root.current, { autoAlpha: 1 })
      .fromTo(".menu-bg", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power4.inOut" })
      .from(".menu-item", { yPercent: 120, autoAlpha: 0, duration: 0.5, stagger: 0.035 }, "-=0.2")
      .from(".menu-preview, .menu-head, .menu-foot", { autoAlpha: 0, y: 14, duration: 0.4, stagger: 0.05 }, "<0.1");
  }, { scope: root });

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      setSel(active);
      stopScroll();
      tl.current.timeScale(1).play();
      setTimeout(() => items.current[active]?.focus({ preventScroll: true }), 60);
    } else {
      startScroll();
      tl.current.timeScale(1.8).reverse();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (i) => {
    onClose();
    setTimeout(() => scrollToId(SECTIONS[i].id), 250);
  };

  // clavier global tant que le menu est ouvert (que le focus soit dedans ou non)
  const selRef = useRef(sel);
  selRef.current = sel;
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      const n = SECTIONS.length, cur = selRef.current;
      const move = (i) => { e.preventDefault(); setSel(i); items.current[i]?.focus({ preventScroll: true }); };
      if (e.key === "ArrowDown") move((cur + 1) % n);
      else if (e.key === "ArrowUp") move((cur - 1 + n) % n);
      else if (e.key === "Escape") { e.preventDefault(); onClose(); }
      else if (/^[0-7]$/.test(e.key)) { e.preventDefault(); choose(Number(e.key)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="menu" ref={root} role="dialog" aria-modal="true" aria-label="Menu principal" aria-hidden={!open} inert={!open ? true : undefined}>
      <div className="menu-bg" aria-hidden="true"><span className="menu-watermark">JC</span></div>
      <header className="menu-head">
        <p className="menu-kicker">// menu</p>
        <button type="button" className="menu-close" onClick={onClose}>Fermer <span aria-hidden="true">✕</span></button>
      </header>
      <div className="menu-body">
        <ol className="menu-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                ref={(el) => { items.current[i] = el; }}
                className={`menu-item${i === sel ? " is-sel" : ""}${i === active ? " is-here" : ""}`}
                onMouseEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                onClick={() => choose(i)}
              >
                <b>{pad(i)}</b><span>{s.label}</span><i aria-hidden="true">→</i>
              </button>
            </li>
          ))}
        </ol>
        <aside className="menu-preview" aria-live="polite">
          <p className="mp-num" aria-hidden="true">{pad(sel)}</p>
          <p className="mp-title">
            <DecryptedText key={sel} text={SECTIONS[sel].label.toUpperCase()} animateOn="view" sequential speed={25} characters="ABCDEF0123456789" />
          </p>
          <p className="mp-desc">{SECTIONS[sel].desc}</p>
          {sel === active && <p className="mp-here">● vous êtes ici</p>}
        </aside>
      </div>
      <footer className="menu-foot">
        <span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span>
        <span><kbd>Entrée</kbd> ouvrir</span>
        <span><kbd>0</kbd>–<kbd>7</kbd> accès direct</span>
        <span><kbd>Échap</kbd> fermer</span>
      </footer>
    </div>
  );
}
