import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionHead from "../components/SectionHead.jsx";
import Magnet from "../components/rb/Magnet/Magnet.jsx";
import { T } from "../components/Tip.jsx";
import { HTB_MACHINES, HTB_URL, GH } from "../data.js";

const pad = (n) => String(n).padStart(2, "0");

export default function Htb() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".htb-wrap", start: "top 75%", once: true } });
      tl.from(".htb-wrap", { clipPath: "inset(0 100% 0 0)", duration: 0.8, ease: "power4.inOut" })
        .from(".htb-table tbody tr", { autoAlpha: 0, x: -20, duration: 0.4, ease: "power2.out", stagger: 0.08 }, "-=0.2")
        .from(".htb-table .pwned", { scale: 1.6, autoAlpha: 0, duration: 0.3, ease: "back.out(3)", stagger: 0.08 }, "-=0.4");
    });
  }, { scope: root });

  return (
    <section id="htb" className="section" ref={root}>
      <SectionHead num="05" kicker="hack the box" title="Write-ups HTB" />

      <div className="htb-wrap">
        <div className="htb-head">
          <span>Write-ups</span>
          <span>machines retirées uniquement · aucun flag publié</span>
        </div>
        <div className="table-scroll" data-lenis-prevent-horizontal>
          <table className="htb-table">
            <thead>
              <tr><th>#</th><th>Machine</th><th>OS</th><th>Diff.</th><th>Concepts clés</th><th>Statut</th></tr>
            </thead>
            <tbody>
              {HTB_MACHINES.map((m, i) => (
                <tr key={m.name}>
                  <td>{pad(i + 1)}</td>
                  <td className="m-name">{m.name}</td>
                  <td>{m.os}</td>
                  <td><span className="diff easy">{m.diff}</span></td>
                  <td>{m.concepts.map((c, k) => <span key={c}>{k > 0 && ", "}<T term={c}>{c}</T></span>)}</td>
                  <td><span className="pwned">Pwned</span></td>
                </tr>
              ))}
              <tr className="next">
                <td>{pad(HTB_MACHINES.length + 1)}</td><td>???</td><td>—</td>
                <td><span className="diff med">Medium</span></td>
                <td>Prochaine étape : passer de <T term="Metasploit">Metasploit</T> à l'exploitation manuelle</td>
                <td className="pending">En cours<span className="caret">_</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="htb-actions">
          <Magnet padding={50} magnetStrength={4}>
            <a className="btn btn-p" href={HTB_URL} target="_blank" rel="noopener">Mon profil HTB ↗</a>
          </Magnet>
          <Magnet padding={50} magnetStrength={4}>
            <a className="btn btn-ghost" href={GH + "htb-writeups"} target="_blank" rel="noopener">Lire les write-ups ↗</a>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
