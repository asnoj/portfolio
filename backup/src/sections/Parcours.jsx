import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHead from "../components/SectionHead.jsx";
import Ticker from "../components/Ticker.jsx";
import { RNCP_URL } from "../data.js";

export default function Parcours() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // la ligne de la timeline se trace avec le scroll
      gsap.fromTo(".tl-line i", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "bottom 60%", scrub: 0.4 },
      });
      gsap.utils.toArray(".tl-item", root.current).forEach((item) => {
        gsap.from(item, {
          autoAlpha: 0, x: -30, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
        });
      });
    });
  }, { scope: root });

  return (
    <section id="parcours" className="section" ref={root}>
      <SectionHead num="02" kicker="formation" title="Parcours" />

      <div className="parcours-grid">
        <div className="timeline">
          <span className="tl-line" aria-hidden="true"><i /></span>
          <article className="tl-item is-live">
            <p className="tl-date">Oct. 2025 → en cours</p>
            <h3>Diplôme d'expert en architecture informatique <span>(Bac+5, <a className="ext" href={RNCP_URL} target="_blank" rel="noopener">RNCP 39774 ↗</a>)</span></h3>
            <p className="tl-org">École 42 Le Havre</p>
            <p>Pédagogie par projets et par les pairs, sans cours magistraux. Poursuite en spécialisation en stage ou en alternance dès janvier 2027.</p>
          </article>
          <article className="tl-item">
            <p className="tl-date">Juin 2025</p>
            <h3>Baccalauréat général</h3>
            <p className="tl-org">Lycée Guillaume Le Conquérant, Lillebonne</p>
            <p>Spécialités : Numérique et Sciences Informatiques (NSI), Mathématiques, Humanités, Littérature et Philosophie (HLP).</p>
          </article>
        </div>

        <aside className="traits">
          <div className="box box-p" data-reveal>
            <p className="box-label">// savoir-être</p>
            <ul>
              <li>Travail en équipe et partage des connaissances</li>
              <li>Résilient</li>
              <li>Bonne intelligence relationnelle</li>
              <li>Débrouillard</li>
            </ul>
          </div>
          <div className="box box-o" data-reveal>
            <p className="box-label">// centres d'intérêt</p>
            <div className="chips">
              <span>Cybersécurité</span><span>Escalade</span><span>Musculation</span>
              <span>Échecs</span><span>Musique (7 ans de conservatoire)</span>
            </div>
          </div>
        </aside>
      </div>

      <Ticker alt velocity={-35} items={["Travail en équipe", "Partage des connaissances", "Mobile dans toute la France", "Prêt à déménager", "Permis B", "Anglais B2", "Escalade", "Échecs", "7 ans de conservatoire"]} />
    </section>
  );
}
