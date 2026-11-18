/* Lenis (smooth scroll) piloté par le ticker GSAP, synchronisé avec ScrollTrigger */
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;
const tick = (time) => lenis?.raf(time * 1000);

export function initScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ lerp: 0.11, anchors: false, autoRaf: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function destroyScroll() {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}

export const getLenis = () => lenis;

/* Aller à une section (id) — offset = hauteur de la barre du haut */
export function scrollToId(id, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: id === "accueil" ? 0 : -56, immediate: immediate || reducedMotion(), duration: 1.4 });
  else el.scrollIntoView();
  if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
  return true;
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
