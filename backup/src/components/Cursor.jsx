import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/* Curseur réticule : un point qui suit exactement, un cadre qui suit avec inertie.
   Réagit au contexte : liens/boutons (cadre agrandi), éléments [data-cursor] (étiquette),
   champs de saisie (curseur natif). Souris uniquement, désactivé si mouvement réduit. */
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function Cursor() {
  const root = useRef(null);
  const [label, setLabel] = useState("");
  const [enabled] = useState(() => window.matchMedia(QUERY).matches);

  useGSAP((ctx, contextSafe) => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const dot = root.current.querySelector(".cursor-dot");
    const ring = root.current.querySelector(".cursor-ring");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });

    let shown = false;
    let mode = "";
    const setMode = (m, text = "") => {
      if (m === mode) return;
      mode = m;
      ring.dataset.mode = m;
      setLabel(text);
      gsap.to(ring, {
        width: m === "label" ? "auto" : m === "link" ? 46 : 30,
        height: m === "label" ? 30 : m === "link" ? 46 : 30,
        rotate: m === "link" ? 45 : 0,
        duration: 0.3, ease: "power3.out", overwrite: "auto",
      });
      gsap.to(dot, { scale: m === "label" ? 0 : 1, duration: 0.2 });
      gsap.to([dot, ring], { autoAlpha: m === "native" ? 0 : 1, duration: 0.15 });
    };

    const onMove = contextSafe((e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (!shown) { shown = true; gsap.set([dot, ring], { x: e.clientX, y: e.clientY }); gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 }); }
    });
    const onOver = contextSafe((e) => {
      const t = e.target;
      if (t.closest?.("input, textarea, [contenteditable], .term-body")) return setMode("native");
      const tagged = t.closest?.("[data-cursor]");
      if (tagged) return setMode("label", tagged.dataset.cursor);
      if (t.closest?.("a, button, [role=button], .tip")) return setMode("link");
      setMode("");
    });
    const onDown = contextSafe(() => gsap.to(ring, { scale: 0.75, duration: 0.12 }));
    const onUp = contextSafe(() => gsap.to(ring, { scale: 1, duration: 0.35, ease: "back.out(3)" }));
    const onLeave = contextSafe(() => { shown = false; gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 }); });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    html.addEventListener("pointerleave", onLeave);
    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.removeEventListener("pointerleave", onLeave);
    };
  }, { scope: root });

  if (!enabled) return null;
  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <span className="cursor-ring"><span className="cursor-label">{label}</span></span>
      <span className="cursor-dot" />
    </div>
  );
}
