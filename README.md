# HERISSON // portfolio

Portfolio personnel, DA cyberpunk. HTML, CSS et JS pur, sans framework ni build.

## Lancer en local

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

Ajoute `?noboot` à l'URL pour passer l'intro.

## Personnaliser

- **Projets** : tableau `PROJECTS` en haut de `js/main.js`
- **Contact** : liens email / LinkedIn / GitHub / HTB dans `index.html` (section `#contact`)
- **Couleurs** : variables CSS dans `:root` de `css/style.css`

## Déployer sur GitHub Pages

1. Pousse ce dossier sur GitHub (repo `asnoj/portfolio`)
2. Settings → Pages → Source : `main` / `root`
3. Le site sera en ligne sur `https://asnoj.github.io/portfolio/` (ou `https://asnoj.github.io/` si le repo s'appelle `asnoj.github.io`)
