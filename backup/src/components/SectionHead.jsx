import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import DecryptedText from "./rb/DecryptedText/DecryptedText.jsx";

export function SplitChars({ text, className = "" }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span className="split-word" key={w} aria-hidden="true">
          {[...word].map((c, i) => <span className="split-char" key={i}>{c}</span>)}
        </span>
      ))}
    </span>
  );
}

export default function SectionHead({ num, kicker, title }) {
  const root = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } });
      tl.from(".sh-num", { xPercent: -100, autoAlpha: 0, duration: 0.5, ease: "power3.out" })
        .from(".split-char", { yPercent: 110, duration: 0.7, ease: "power4.out", stagger: 0.025 }, "<0.1")
        .from(".sh-line", { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power3.inOut" }, "<0.1");
    });
  }, { scope: root });

  return (
    <header className="section-head" ref={root}>
      <span className="sh-num">{num}</span>
      <div className="sh-text">
        <p className="sh-kicker">
          <DecryptedText text={`// ${kicker}`} animateOn="view" sequential speed={35} characters="ABCDEF0123456789/" />
        </p>
        <h2><SplitChars text={title} /></h2>
      </div>
      <span className="sh-line" aria-hidden="true" />
    </header>
  );
}
