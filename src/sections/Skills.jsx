import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHead from "../components/SectionHead.jsx";
import SpotlightCard from "../components/rb/SpotlightCard.jsx";
import { T } from "../components/Tip.jsx";
import { CHECKLIST, SKILL_TREES, LEVELS, PROJECTS, GH } from "../data.js";
import { usePalette } from "../lib/theme.jsx";

const repoOf = (name) => PROJECTS.find((p) => p.name === name)?.repo ?? name;

function Proof({ proof }) {
  if (typeof proof === "string") return <>{proof}</>;
  return proof.map((p, i) => {
    const [label, url] = Array.isArray(p) ? p : [p, GH + encodeURIComponent(repoOf(p))];
    return (
      <span key={label}>
        {i > 0 && " · "}
        <a href={url} target="_blank" rel="noopener">{label}</a>
      </span>
    );
  });
}

export default function Skills() {
  const root = useRef(null);
  const pal = usePalette();
  const ACCENT = { acid: pal.acidInk, pink: pal.pink, white: pal.strong };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".match li", {
        autoAlpha: 0, y: 14, scale: 0.9, duration: 0.4, ease: "back.out(2)", stagger: 0.035,
        scrollTrigger: { trigger: ".match", start: "top 85%", once: true },
      });
      gsap.from(".tree", {
        autoAlpha: 0, y: 60, duration: 0.9, ease: "power4.out", stagger: 0.12,
        scrollTrigger: { trigger: ".skills-grid", start: "top 80%", once: true },
      });
      gsap.utils.toArray(".tree", root.current).forEach((tree) => {
        gsap.from(tree.querySelectorAll(".skill-list li"), {
          autoAlpha: 0, x: -14, duration: 0.4, ease: "power2.out", stagger: 0.05,
          scrollTrigger: { trigger: tree, start: "top 70%", once: true },
        });
      });
    });
  }, { scope: root });

  return (
    <section id="competences" className="section" ref={root}>
      <SectionHead num="03" kicker="stack technique" title="Compétences" />

      <p className="lead" data-reveal>
        Chaque compétence renvoie au projet qui la prouve. Un terme <T term="terme technique">souligné</T> ? Survolez-le.
      </p>

      <div className="match">
        <p className="box-label">// checklist recruteur</p>
        <ul>
          {CHECKLIST.map(([term, label]) => (
            <li key={label}><b>✓</b>{term ? <T term={term}>{label}</T> : label}</li>
          ))}
        </ul>
      </div>

      <div className="legend" data-reveal>
        <span><i className="lvl l3">Solide</i> utilisé dans plusieurs projets complets</span>
        <span><i className="lvl l2">Pratiqué</i> mis en œuvre dans au moins un projet</span>
        <span><i className="lvl l1">En progression</i> en cours d'apprentissage</span>
      </div>

      <div className="skills-grid">
        {SKILL_TREES.map((tree) => (
          <SpotlightCard
            key={tree.id}
            className={`tree tree-${tree.accent}`}
            spotlightColor={ACCENT[tree.accent]}
            theme={pal.spotlight}
            intensity={0.12}
            spotlightSize={320}
            borderGlow={0.8}
          >
            <header>
              <span className="tree-id">TREE_{tree.id}</span>
              <h3>{tree.title}</h3>
              <p>{tree.sub}</p>
            </header>
            <ul className="skill-list">
              {tree.items.map((s) => (
                <li key={s.label}>
                  <div className="sk-top"><T term={s.term}>{s.label}</T><span className={`lvl l${s.lvl}`}>{LEVELS[s.lvl]}</span></div>
                  <p className="proof"><span>Preuve →</span> <Proof proof={s.proof} /></p>
                </li>
              ))}
            </ul>
            <p className="tree-foot">{tree.foot}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
