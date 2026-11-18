import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "../components/rb/ScrollReveal.jsx";
import DecryptedText from "../components/rb/DecryptedText/DecryptedText.jsx";
import { EMAIL, GH, LINKEDIN, HTB_URL } from "../data.js";

const LINKS = [
  ["Email", EMAIL, `mailto:${EMAIL}`],
  ["GitHub", "github.com/asnoj", GH],
  ["LinkedIn", "linkedin.com/in/jonascrochet", LINKEDIN],
  ["Hack The Box", "profil HTB · asnoj", HTB_URL],
];

export default function Contact() {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".contact-link", {
        autoAlpha: 0, y: 30, duration: 0.6, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: ".contact-links", start: "top 90%", once: true },
      });
      gsap.from(".contact-stripe", {
        scaleX: 0, transformOrigin: "left center", ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 30%", scrub: true },
      });
    });
  }, { scope: root });

  return (
    <section id="contact" className="section contact" ref={root}>
      <span className="contact-stripe" aria-hidden="true" />
      <p className="sh-kicker">
        <DecryptedText text="// 07 — contact" animateOn="view" sequential speed={35} characters="ABCDEF0123456789/" />
      </p>

      <ScrollReveal containerClassName="contact-title" textClassName="contact-title-text" effect="rise" baseOpacity={0} enableBlur={false} baseRotation={0} wordAnimationEnd="top 35%">
        Travaillons ensemble.
      </ScrollReveal>

      <p className="contact-lead" data-reveal>
        Je cherche un <strong>stage de 6 mois</strong> ou une <strong>alternance</strong> dès janvier 2027, en cybersécurité ou en
        développement logiciel C/C++. Basé au Havre, <strong>mobile dans toute la France</strong> et prêt à déménager là où est le poste.
        Si votre équipe fait du système, du C/C++ ou de la sécurité, je serais ravi d'en discuter.
      </p>

      <div className="contact-links">
        {LINKS.map(([label, text, href]) => (
          <a key={label} className="contact-link" href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
            <span>{label}</span><b>{text}</b><i aria-hidden="true">→</i>
          </a>
        ))}
      </div>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Jonas Crochet // herisson</span>
        <span>React · GSAP · Lenis · React Bits</span>
        <span className="footer-hex" title="HERISSON">0x48 0x45 0x52 0x49 0x53 0x53 0x4F 0x4E</span>
      </footer>
    </section>
  );
}
