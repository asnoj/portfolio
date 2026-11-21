import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SECTIONS } from "../data.js";
import { scrollToId } from "../lib/scroll.js";
import { useTheme } from "../lib/theme.jsx";

const pad = (n) => String(n).padStart(2, "0");

/* Barre du haut + barre de progression + rail de navigation latéral */
export default function Hud({ active, onMenu }) {
  const root = useRef(null);
  const nameRef = useRef(null);
  const [clock, setClock] = useState("--:--:--");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const t = () => setClock(new Date().toLocaleTimeString("fr-FR", { hour12: false }));
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    // progression globale : barre du haut + paquet qui descend le long du rail
    gsap.to(".hud-progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    gsap.to(".rail-packet", { top: "100%", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }, { scope: root });

  // nom de section : petit balayage à chaque changement
  useGSAP(() => {
    gsap.fromTo(nameRef.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "power3.out" });
  }, { dependencies: [active], scope: root });

  const go = (e, id) => { e.preventDefault(); scrollToId(id); };

  return (
    <div ref={root}>
      <header className="hud">
        <a href="#accueil" className="hud-logo" onClick={(e) => go(e, "accueil")} aria-label="Retour en haut">
          <span className="logo-mark">JC</span>
          <span className="logo-txt">JONAS CROCHET<small>//herisson</small></span>
        </a>
        <div className="hud-status" aria-live="polite">
          <b>{pad(active)}</b><span className="hud-total">/{pad(SECTIONS.length - 1)}</span>
          <span className="hud-name" ref={nameRef}>{SECTIONS[active].label}</span>
        </div>
        <div className="hud-right">
          <span className="hud-clock" aria-hidden="true">{clock}</span>
          <button
            type="button" className="theme-btn" onClick={toggle}
            aria-label={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
            title={theme === "light" ? "Mode sombre" : "Mode clair"}
          >
            {theme === "light" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            )}
          </button>
          <button type="button" className="hud-menu" onClick={onMenu} aria-haspopup="dialog">
            <span className="burger" aria-hidden="true"><i /><i /><i /></span>Menu <kbd>Échap</kbd>
          </button>
          <a href="#contact" className="hud-cta" onClick={(e) => go(e, "contact")}>Contact</a>
        </div>
        <div className="hud-progress" aria-hidden="true"><i /></div>
      </header>

      <nav className="rail" aria-label="Sections">
        <span className="rail-line" aria-hidden="true"><i className="rail-packet" /></span>
        <ol>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} className={i === active ? "on" : ""} aria-current={i === active ? "true" : undefined}>
                <b>{pad(i)}</b><span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
