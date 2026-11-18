import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PROJECTS, HTB_MACHINES } from "../data.js";
import { reducedMotion } from "../lib/scroll.js";

const LINES = [
  ["profil", "OK"],
  ["parcours", "OK"],
  ["compétences", "OK"],
  ["projets", String(PROJECTS.length).padStart(2, "0")],
  ["hack the box", String(HTB_MACHINES.length).padStart(2, "0")],
  ["contact", "OK"],
];
const COLS = 6;

export function shouldBoot() {
  try { if (sessionStorage.getItem("booted") === "1") return false; } catch { /* stockage indisponible */ }
  return !reducedMotion() && !/[?&]noboot\b/.test(location.search);
}

export default function Boot({ onReveal }) {
  const root = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP((ctx, contextSafe) => {
    const q = gsap.utils.selector(root);
    const counter = { v: 0 };
    const name = q(".boot-name")[0];
    const target = name.textContent;
    const glyphs = "ABCDEF0123456789/#";

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q(".bf-corner"), { scale: 0, duration: 0.4, stagger: 0.05 })
      .from(q(".bf-row"), { autoAlpha: 0, y: 8, duration: 0.4 }, "<")
      .addLabel("load")
      .to(counter, {
        v: 100, duration: 1.5, ease: "power2.inOut",
        onUpdate: () => {
          q(".boot-pct")[0].textContent = String(Math.round(counter.v)).padStart(3, "0");
          q(".boot-bar i")[0].style.transform = `scaleX(${counter.v / 100})`;
        },
      }, "load")
      .from(q(".boot-log li"), { autoAlpha: 0, x: -10, duration: 0.25, stagger: 0.22 }, "load+=0.1")
      .to(q(".boot-load"), { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" }, "+=0.25")
      .addLabel("id")
      .fromTo(q(".boot-id"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "id")
      .to({ k: 0 }, {
        k: 1, duration: 0.8, ease: "none",
        onUpdate() {
          const k = this.targets()[0].k;
          name.textContent = [...target].map((c, i) =>
            c === " " || i / target.length < k ? c : glyphs[(Math.random() * glyphs.length) | 0]).join("");
        },
      }, "id")
      .from(q(".boot-sub, .boot-tags span"), { autoAlpha: 0, y: 10, duration: 0.4, stagger: 0.06 }, "id+=0.4")
      .addLabel("exit", "+=0.5")
      .to(q(".boot-col"), { scaleY: 1, duration: 0.45, ease: "power4.in", stagger: 0.05 }, "exit")
      .set(q(".boot-inner"), { autoAlpha: 0 })
      .set(root.current, { backgroundColor: "transparent" })
      .add(() => onReveal?.(), "+=0.02")
      .to(q(".boot-col"), { yPercent: -100, duration: 0.6, ease: "power4.inOut", stagger: 0.05 })
      .add(() => setDone(true));

    const skip = contextSafe(() => {
      if (tl.currentLabel() === "exit" || tl.progress() > 0.8) return;
      tl.seek("exit");
    });
    window.addEventListener("keydown", skip);
    root.current.addEventListener("click", skip);
    try { sessionStorage.setItem("booted", "1"); } catch { /* ignore */ }
    return () => window.removeEventListener("keydown", skip);
  }, { scope: root });

  if (done) return null;
  return (
    <div className="boot" ref={root} aria-hidden="true">
      <div className="boot-cols">
        {Array.from({ length: COLS }, (_, i) => <i className="boot-col" key={i} />)}
      </div>
      <div className="boot-inner">
        <div className="boot-frame">
          <span className="bf-corner tl" /><span className="bf-corner tr" />
          <span className="bf-corner bl" /><span className="bf-corner br" />
          <div className="bf-row bf-top"><span>JC // PORTFOLIO</span><span>LE HAVRE · FR</span></div>
          <div className="bf-row bf-bottom"><span>v2.0</span><span>[ clic ou touche pour passer ]</span></div>
        </div>

        <div className="boot-load">
          <ul className="boot-log">
            {LINES.map(([k, v]) => (
              <li key={k}><span>{k}</span><i /><b>[ {v} ]</b></li>
            ))}
          </ul>
          <div className="boot-meter">
            <p className="boot-label">// chargement</p>
            <p className="boot-count"><span className="boot-pct">000</span><small>%</small></p>
            <div className="boot-bar"><i /></div>
          </div>
        </div>

        <div className="boot-id">
          <p className="boot-label">// profil</p>
          <p className="boot-name">JONAS CROCHET</p>
          <p className="boot-sub">Étudiant en architecture informatique · École 42 Le Havre</p>
          <div className="boot-tags"><span>Bas niveau</span><span>Cybersécurité</span><span>Stage · Alternance</span><span>Janv. 2027</span></div>
        </div>
      </div>
    </div>
  );
}
