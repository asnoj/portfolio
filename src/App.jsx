import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { initScroll, destroyScroll, scrollToId, stopScroll, startScroll } from "./lib/scroll.js";
import { SECTIONS } from "./data.js";
import Boot, { shouldBoot } from "./components/Boot.jsx";
import Hud from "./components/Hud.jsx";
import Menu from "./components/Menu.jsx";
import { TooltipLayer } from "./components/Tip.jsx";
import Hero from "./sections/Hero.jsx";
import Profil from "./sections/Profil.jsx";
import Parcours from "./sections/Parcours.jsx";
import Skills from "./sections/Skills.jsx";
import Projets from "./sections/Projets.jsx";
import Htb from "./sections/Htb.jsx";
import Terminal from "./sections/Terminal.jsx";
import Contact from "./sections/Contact.jsx";

export default function App() {
  const main = useRef(null);
  const [booting] = useState(shouldBoot);
  const [revealed, setRevealed] = useState(!booting);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(menuOpen);
  menuRef.current = menuOpen;

  // smooth scroll (Lenis) — bloqué pendant l'intro
  useEffect(() => {
    initScroll();
    if (booting) { stopScroll(); document.documentElement.classList.add("is-booting"); }
    return () => destroyScroll();
  }, [booting]);

  useEffect(() => {
    if (!revealed) return;
    document.documentElement.classList.remove("is-booting");
    startScroll();
    const id = location.hash.slice(1);
    if (id && id !== "accueil") requestAnimationFrame(() => scrollToId(id, { immediate: true }));
  }, [revealed]);

  useGSAP(() => {
    // section active (HUD, rail, menu)
    SECTIONS.forEach((s, i) => {
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => { if (self.isActive) setActive(i); },
      });
    });

    // apparition générique des blocs marqués data-reveal
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-reveal]", { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, { scope: main });

  // clavier : Échap = menu, 0-7 = accès direct
  useEffect(() => {
    const onKey = (e) => {
      if (document.documentElement.classList.contains("is-booting") || menuRef.current) return;
      if (e.target.closest?.("input, textarea, [contenteditable]")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Escape") { e.preventDefault(); setMenuOpen(true); }
      else if (/^[0-7]$/.test(e.key)) scrollToId(SECTIONS[Number(e.key)].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {booting && <Boot onReveal={() => setRevealed(true)} />}
      <Hud active={active} onMenu={() => setMenuOpen(true)} />
      <Menu open={menuOpen} active={active} onClose={() => setMenuOpen(false)} />
      <main ref={main} className="page">
        <Hero revealed={revealed} />
        <Profil />
        <Parcours />
        <Skills />
        <Projets />
        <Htb />
        <Terminal />
        <Contact />
      </main>
      <div className="grain" aria-hidden="true" />
      <TooltipLayer />
    </>
  );
}
