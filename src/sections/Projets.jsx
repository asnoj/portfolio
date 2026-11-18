import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionHead from "../components/SectionHead.jsx";
import SpotlightCard from "../components/rb/SpotlightCard.jsx";
import Ticker from "../components/Ticker.jsx";
import { T } from "../components/Tip.jsx";
import { PROJECTS, CAT_LABEL, GH } from "../data.js";
import { usePalette } from "../lib/theme.jsx";

gsap.registerPlugin(Flip);

const FILTERS = [["all", "Tout"], ...Object.entries(CAT_LABEL)];
const FEATURED = PROJECTS.filter((p) => p.featured);
const OTHERS = PROJECTS.filter((p) => !p.featured);
const url = (p) => GH + encodeURIComponent(p.repo);
const pad = (n) => String(n).padStart(2, "0");

export default function Projets() {
  const root = useRef(null);
  const flipState = useRef(null);
  const [filter, setFilter] = useState("all");
  const pal = usePalette();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // bureau : les projets phares défilent à l'horizontale pendant que la section est épinglée
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = root.current.querySelector(".feat-pin");
      const track = root.current.querySelector(".feat-track");
      // la dernière carte s'arrête alignée sur la marge droite du contenu
      const distance = () => {
        const pad = parseFloat(getComputedStyle(pin).paddingLeft) || 0;
        return Math.max(0, track.scrollWidth - (pin.clientWidth - 2 * pad));
      };
      const skew = gsap.quickTo(".feat-card", "skewX", { duration: 0.5, ease: "power3" });
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=56",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(".feat-progress i", { scaleX: self.progress });
            // les cartes s'inclinent selon la vitesse de défilement, puis reviennent à plat
            skew(gsap.utils.clamp(-7, 7, self.getVelocity() / -350));
          },
        },
      });
      const settle = () => skew(0);
      ScrollTrigger.addEventListener("scrollEnd", settle);
      // le gros numéro de chaque carte glisse légèrement à contre-sens (parallaxe)
      gsap.utils.toArray(".feat-num", root.current).forEach((num) => {
        gsap.fromTo(num, { xPercent: 40 }, {
          xPercent: -40, ease: "none",
          scrollTrigger: { trigger: num.closest(".feat-card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
      return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".feat-card", {
        autoAlpha: 0, y: 50, duration: 0.8, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: ".feat-track", start: "top 80%", once: true },
      });
    });

  }, { scope: root });

  /* Filtre animé avec Flip.
     - la hauteur de la grille est figée puis animée (sinon elle s'effondre pendant que
       les cartes passent en position absolue et toute la page saute) ;
     - pas de mise à l'échelle (les cartes n'ont pas la même hauteur : le texte se déformait) ;
     - un clic pendant une animation repart proprement de la position actuelle. */
  const flipTl = useRef(null);
  const lockH = useRef(0);
  const FLIP_PROPS = "position,top,left,width,height,margin,transform,opacity,visibility,zIndex";
  const pick = (f) => {
    if (f === filter) return;
    const grid = root.current.querySelector(".projects");
    const cards = grid.querySelectorAll(".proj");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flipState.current = reduce ? null : Flip.getState(cards, { props: "opacity" });
    flipTl.current?.kill();
    gsap.set(cards, { clearProps: FLIP_PROPS });
    lockH.current = grid.offsetHeight;
    if (!reduce) gsap.set(grid, { height: lockH.current });
    setFilter(f);
  };
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    const grid = root.current.querySelector(".projects");
    gsap.set(grid, { height: "auto" });
    const target = grid.offsetHeight;
    gsap.set(grid, { height: lockH.current });

    const tl = gsap.timeline({
      onComplete: () => { gsap.set(grid, { clearProps: "height" }); ScrollTrigger.refresh(); },
    });
    tl.add(Flip.from(state, {
      duration: 0.55, ease: "power3.inOut", absolute: true, scale: false, prune: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, delay: 0.15, ease: "power3.out" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: "power2.in" }),
    }), 0);
    tl.to(grid, { height: target, duration: 0.55, ease: "power3.inOut" }, 0);
    flipTl.current = tl;
  }, [filter]);

  return (
    <section id="projets" className="section projets" ref={root}>
      <SectionHead num="04" kicker="dépôts github" title="Projets" />

      <div className="feat-pin">
        <div className="feat-head">
          <p className="box-label">// projets phares — {pad(FEATURED.length)}</p>
          <div className="feat-progress" aria-hidden="true"><i /></div>
        </div>
        <div className="feat-track">
          {FEATURED.map((p, i) => (
            <a key={p.name} className={`feat-card cat-${p.cat}`} href={url(p)} target="_blank" rel="noopener" data-cursor="Ouvrir ↗">
              <div className="feat-top">
                <span className="feat-num">{pad(i + 1)}</span>
                <span className="feat-meta">{CAT_LABEL[p.cat]} · {p.lang}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="feat-desc">{p.desc}</p>
              <div className="proj-tags">{p.tags.map((t) => <span key={t}><T term={t}>{t}</T></span>)}</div>
              <span className="proj-link">Voir le dépôt ↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="all-projects">
        <div className="all-head" data-reveal>
          <p className="box-label">// tous les dépôts</p>
          <div className="filters" role="group" aria-label="Filtrer les projets">
            {FILTERS.map(([f, label]) => (
              <button key={f} type="button" className={`filter${filter === f ? " on" : ""}`} aria-pressed={filter === f} onClick={() => pick(f)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="projects">
          {OTHERS.map((p) => (
            <SpotlightCard key={p.name} className={`proj cat-${p.cat}${filter === "all" || p.cat === filter ? "" : " is-hidden"}`} spotlightColor={pal.acidInk} theme={pal.spotlight} intensity={0.1} spotlightSize={220} data-flip-id={p.name}>
              <a href={url(p)} target="_blank" rel="noopener" className="proj-inner" data-cursor="Ouvrir ↗">
                <div className="proj-top"><span>{CAT_LABEL[p.cat]}</span><span>{p.lang}</span></div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="proj-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <span className="proj-link">Voir le dépôt ↗</span>
              </a>
            </SpotlightCard>
          ))}
        </div>

        <p className="projects-more" data-reveal>
          Tout le code est sur <a href="https://github.com/asnoj" target="_blank" rel="noopener">github.com/asnoj ↗</a>
        </p>
      </div>

      <Ticker items={["Shell", "libc en ASM", "/proc", "Fractales", "Argon2id", "XChaCha20-Poly1305", "fork · execve · pipe", "github.com/asnoj"]} />
    </section>
  );
}
