import ScrollVelocity from "./rb/ScrollVelocity.jsx";

/* Bandeau défilant dont la vitesse suit celle du scroll (React Bits · ScrollVelocity) */
export default function Ticker({ items, velocity = 40, alt = false }) {
  return (
    <div className={`ticker${alt ? " ticker-alt" : ""}`} aria-hidden="true">
      <ScrollVelocity
        texts={[items.map((t) => `// ${t}`).join("   ")]}
        velocity={velocity}
        numCopies={4}
        separator="▲"
        skewWithVelocity={4}
        parallaxClassName="ticker-parallax"
        scrollerClassName="ticker-scroller"
        velocityMapping={{ input: [0, 1000], output: [0, 4] }}
      />
    </div>
  );
}
