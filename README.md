# HERISSON // portfolio v2

Portfolio personnel, DA cyberpunk / netrunner. React + Vite, animations GSAP (ScrollTrigger, Flip), smooth scroll Lenis, composants React Bits.

L'ancienne version (HTML/CSS/JS pur) est conservée dans [`backup/`](backup/).

## Développement

```bash
npm install
npm run dev        # http://localhost:5173
```

Ajoute `?noboot` à l'URL pour passer l'intro (elle ne se joue aussi qu'une fois par session).

## Build et hébergement

```bash
npm run build      # génère dist/
npm run preview    # teste le build en local
```

`dist/` est un site 100 % statique avec des chemins relatifs : il suffit de servir ce dossier avec n'importe quel serveur web (nginx, Caddy, Apache…), à la racine d'un domaine ou dans un sous-dossier.

Exemple minimal avec Caddy :

```
monsite.fr {
  root * /chemin/vers/portfolio/dist
  file_server
}
```

## Personnaliser

- **Contenu** (projets, compétences, machines HTB, glossaire, liens) : `src/data.js`
- **Couleurs et typo** : variables CSS dans `:root` de `src/styles.css`
- **Sections** : `src/sections/*.jsx`
- **Composants React Bits** (non modifiés, récupérés depuis reactbits.dev) : `src/components/rb/`

## Stack

| Rôle | Outil |
|------|-------|
| UI | React 19, Vite |
| Animations | GSAP + ScrollTrigger + Flip, `@gsap/react` (`useGSAP`) |
| Smooth scroll | Lenis, synchronisé sur le ticker GSAP |
| Effets | React Bits : DotGrid, ScrollVelocity, DecryptedText, SpotlightCard, Magnet, ScrollReveal, CountUp |

`prefers-reduced-motion` est respecté : pas d'intro, pas d'épinglage ni d'animations au scroll.
