import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import DotGrid from "../components/rb/DotGrid.jsx";
import Magnet from "../components/rb/Magnet/Magnet.jsx";
import VariableProximity from "../components/rb/VariableProximity.jsx";
import { T } from "../components/Tip.jsx";
import Ticker from "../components/Ticker.jsx";
import { scrollToId } from "../lib/scroll.js";
import { usePalette } from "../lib/theme.jsx";

const ROLES = ["Programmation bas niveau", "Cybersécurité offensive", "C · C++ · x86-64 ASM", "Pentest · CTF · Hack The Box"];

export default function Hero({ revealed }) {
  const root = useRef(null);
  const roleRef = useRef(null);
  const intro = useRef(null);
  const pal = usePalette();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      intro.current = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } })
        .from(".hero-meta span", { autoAlpha: 0, y: -12, duration: 0.5, stagger: 0.06 })
        .from(".name-inner", { yPercent: 110, duration: 1, stagger: 0.12 }, "<0.1")
        .from(".hero-kicker > *, .hero-title, .hero-role, .hero-lead, .hero-actions", { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.07 }, "<0.3")
        .from(".hero-card", { autoAlpha: 0, x: 40, rotate: 1.5, duration: 0.9 }, "<0.1")
        .from(".hero-card .stats > div", { autoAlpha: 0, x: 12, duration: 0.4, stagger: 0.05 }, "<0.3");

      // sortie au scroll : le contenu remonte et s'efface, la carte part en parallaxe
      gsap.to(".hero-main", { yPercent: -18, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-card-wrap", { yPercent: -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    });

    // fiche : inclinaison 3D qui suit la souris + reflet (souris uniquement)
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const card = root.current.querySelector(".hero-card");
      const glare = card.querySelector(".card-glare");
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
      const gx = gsap.quickTo(glare, "xPercent", { duration: 0.6, ease: "power3" });
      const onMove = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const k = Math.max(Math.abs(px), Math.abs(py)) > 1.2 ? 0 : 1; // trop loin : retour à plat
        ry(px * 12 * k); rx(-py * 10 * k); gx(px * 60 * k);
      };
      root.current.addEventListener("pointermove", onMove);
      const reset = () => { rx(0); ry(0); gx(0); };
      root.current.addEventListener("pointerleave", reset);
      return () => { root.current?.removeEventListener("pointermove", onMove); root.current?.removeEventListener("pointerleave", reset); };
    });

    // rôle qui tourne : sortie vers le haut, entrée par le bas
    const el = roleRef.current;
    let i = 0;
    const cycle = gsap.timeline({ repeat: -1, repeatDelay: 0 });
    ROLES.forEach(() => {
      cycle
        .to(el, { yPercent: -110, autoAlpha: 0, duration: 0.35, ease: "power2.in", delay: 2.2 })
        .add(() => { i = (i + 1) % ROLES.length; el.textContent = ROLES[i]; })
        .fromTo(el, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => { cycle.pause(0); });
  }, { scope: root });

  useEffect(() => {
    if (revealed) intro.current?.play();
  }, [revealed]);

  const go = (e, id) => { e.preventDefault(); scrollToId(id); };

  return (
    <section id="accueil" className="hero" ref={root}>
      <div className="hero-bg" aria-hidden="true">
        {revealed && (
          <DotGrid dotSize={3} gap={22} baseColor={pal.dotBase} activeColor={pal.acidInk} proximity={130} glow={0.35} shockRadius={260} shockStrength={3} fade={0.6} />
        )}
      </div>

      <div className="hero-meta">
        <span>École 42 Le Havre</span>
        <span>Bac+5 · RNCP 39774</span>
        <span>Mobile · toute la France</span>
        <span className="live">● Disponible 01/2027</span>
      </div>

      <div className="hero-grid">
        <div className="hero-main">
          <p className="hero-kicker">
            <span className="tag tag-a">Stage</span><span className="tag tag-p">Alternance</span>
            <span>dès janvier 2027 · partout en France</span>
          </p>
          <h1 className="hero-name" aria-label="Jonas Crochet">
            {["JONAS", "CROCHET"].map((w, i) => (
              <span className="name-line" key={w} aria-hidden="true">
                <span className="name-inner">
                  <VariableProximity
                    label={w}
                    containerRef={root}
                    radius={150}
                    falloff="exponential"
                    fromFontVariationSettings="'wght' 900, 'wdth' 125"
                    toFontVariationSettings="'wght' 380, 'wdth' 100"
                    fromColor={i ? pal.acidInk : pal.text}
                    toColor={i ? pal.strong : pal.acidInk}
                  />
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-title">Étudiant en Architecture Informatique <span>(Bac+5)</span></p>
          <p className="hero-role"><span className="role-mask"><span ref={roleRef}>{ROLES[0]}</span></span></p>
          <p className="hero-lead">
            Étudiant à l'<strong>École 42 Le Havre</strong>, à l'aise en <T>C</T>, <T>C++</T> et <T>assembleur</T> x86-64 sous Linux.
            J'apprends en construisant mes outils de zéro et je m'intéresse autant à l'offensif
            (<T>pentest</T>, <T>CTF</T>) qu'au défensif. Je cherche un <strong>stage ou une alternance dès janvier 2027</strong> en
            <em> cybersécurité</em> ou en <em>développement logiciel C/C++</em>.
          </p>
          <div className="hero-actions">
            <Magnet padding={60} magnetStrength={4}>
              <a href="#projets" className="btn btn-a" onClick={(e) => go(e, "projets")}>Voir les projets</a>
            </Magnet>
            <Magnet padding={60} magnetStrength={4}>
              <a href="#contact" className="btn btn-ghost" onClick={(e) => go(e, "contact")}>Me contacter</a>
            </Magnet>
          </div>
        </div>

        <div className="hero-card-wrap">
        <aside className="hero-card" aria-label="Fiche">
          <span className="card-glare" aria-hidden="true" />
          <div className="card-head"><span>FICHE //</span><span>JC</span></div>
          <pre className="hedgehog" aria-hidden="true">{`  .|||||||||.
 |||||||||||||
|||||||||||' .\\
\`||||||||||_,__o`}</pre>
          <dl className="stats">
            <div><dt>Alias</dt><dd>herisson / asnoj</dd></div>
            <div><dt>Formation</dt><dd>Bac+5 · École 42</dd></div>
            <div><dt>Cible</dt><dd>Stage · Alternance</dd></div>
            <div><dt>Dispo</dt><dd>Janvier 2027</dd></div>
            <div><dt>Localisation</dt><dd>Le Havre · mobile dans toute la France</dd></div>
            <div><dt>Mobilité</dt><dd>Prêt à déménager · permis B</dd></div>
            <div><dt>Langues</dt><dd>Français · Anglais B2</dd></div>
          </dl>
          <div className="barcode" aria-hidden="true" />
        </aside>
        </div>
      </div>

      <p className="scroll-cue" aria-hidden="true"><span>scroll</span><i /></p>

      <Ticker items={["Memory safety", "Pentest", "System V ABI", "Argon2id", "XChaCha20-Poly1305", "/proc", "fork · execve · pipe", "Privesc", "NASM", "Docker · TLS 1.3"]} />
    </section>
  );
}
