import { useEffect, useRef, useState } from "react";
import SectionHead from "../components/SectionHead.jsx";
import { PROJECTS, CAT_LABEL, GH, HTB_URL, EMAIL, LINKEDIN, RNCP_URL, SECTIONS, HTB_MACHINES } from "../data.js";
import { scrollToId } from "../lib/scroll.js";

const A = ({ href, children }) => <a href={href} target="_blank" rel="noopener">{children ?? href}</a>;
const PROMPT = <><b className="g">guest@herisson</b>:<i className="c">~</i>$</>;

const HELP = [
  ["whoami", "qui suis-je"], ["skills", "compétences principales"], ["projects", "liste des projets"],
  ["open <projet>", "ouvre le dépôt GitHub d'un projet"], ["htb", "progression Hack The Box"],
  ["contact", "comment me joindre"], ["cv", "statut de la recherche"], ["parcours", "formation"],
  ["cd <section>", "aller à une section (ex : cd projets)"], ["clear", "efface l'écran"],
];

export default function Terminal() {
  const [lines, setLines] = useState([{ cls: "m", out: <>hsh v4.2 — shell invité de Jonas Crochet. Tapez <span className="c">help</span> pour commencer.</> }]);
  const [value, setValue] = useState("");
  const history = useRef([]);
  const hIdx = useRef(0);
  const body = useRef(null);
  const input = useRef(null);

  useEffect(() => { body.current.scrollTop = body.current.scrollHeight; }, [lines]);

  const run = (raw) => {
    const line = raw.trim();
    const out = [{ cls: "cmd", out: <>{PROMPT} {line}</> }];
    const p = (o, cls = "") => out.push({ cls, out: o });

    if (line) {
      history.current.push(line);
      hIdx.current = history.current.length;
      const [cmd, ...args] = line.split(/\s+/);
      const COMMANDS = {
        help: () => { p("Commandes disponibles :", "y"); HELP.forEach(([c, d]) => p(<><span className="c">{c.padEnd(16)}</span><span className="m">{d}</span></>)); },
        whoami: () => {
          p("Jonas Crochet (herisson / asnoj)", "y");
          p("Étudiant en architecture informatique (Bac+5) à l'École 42 Le Havre.");
          p("C, C++, x86-64 ASM sous Linux. Je construis mes outils de zéro, côté offensif comme défensif.", "m");
        },
        skills: () => {
          p("[ BAS NIVEAU ] C · C++17 · x86-64 NASM · syscalls · mémoire · processus · threads", "y");
          p("[ CYBER      ] pentest · CTF · offensif/défensif · crypto (libsodium) · RGPD", "c");
          p("[ RÉSEAU     ] Docker · TLS 1.2/1.3 · HTTPS/WSS · sockets · WebSocket · Socket.io", "g");
          p("[ OUTILS     ] Linux · Windows · Bash · SQL · Git · gdb · valgrind · Metasploit", "r");
        },
        projects: () => {
          PROJECTS.forEach((x) => p(<><span className={x.featured ? "y" : "m"}>{x.featured ? "★" : "·"}</span> <span className="c">{x.name.padEnd(18)}</span><span className="m">{CAT_LABEL[x.cat]}</span></>));
          p(<>→ tapez <span className="c">open &lt;nom&gt;</span> pour ouvrir un dépôt.</>, "m");
        },
        open: () => {
          const q = (args[0] || "").toLowerCase();
          if (!q) return p("usage : open <projet>", "r");
          const x = PROJECTS.find((y) => y.name.toLowerCase() === q || y.repo.toLowerCase() === q) || PROJECTS.find((y) => y.name.toLowerCase().startsWith(q));
          if (!x) return p(`open: ${q}: projet introuvable`, "r");
          const url = GH + encodeURIComponent(x.repo);
          p(<>ouverture de <A href={url} /> …</>, "g");
          window.open(url, "_blank", "noopener");
        },
        htb: () => {
          p(`${HTB_MACHINES.length} machines résolues — ${HTB_MACHINES.map((m) => m.name).join(" · ")}`, "g");
          p("Objectif : machines Medium et exploitation manuelle sans Metasploit.", "m");
          p(<>profil   <A href={HTB_URL}>profile.hackthebox.com</A></>);
          p(<>writeups <A href={GH + "htb-writeups"} /></>);
        },
        contact: () => {
          p(<>email    <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>);
          p(<>github   <A href={GH}>github.com/asnoj</A></>);
          p(<>linkedin <A href={LINKEDIN}>linkedin.com/in/jonascrochet</A></>);
          p(<>htb      <A href={HTB_URL}>profil Hack The Box</A></>);
        },
        cv: () => {
          p("STATUT    : recherche active", "y");
          p("TYPE      : stage de 6 mois ou alternance");
          p("DÉBUT     : janvier 2027");
          p("DOMAINE   : cybersécurité · développement logiciel C/C++");
          p(<>FORMATION : expert en architecture informatique, Bac+5 (<A href={RNCP_URL}>RNCP 39774</A>), École 42 Le Havre</>);
          p("LIEU      : basé au Havre (76) · mobile dans toute la France, prêt à déménager", "m");
          p("EXTRA     : permis B, véhiculé · anglais B2", "m");
        },
        parcours: () => {
          p("2025 → …  École 42 Le Havre — expert en architecture informatique (Bac+5)", "y");
          p("2025      Bac général — NSI · Maths · HLP — Lycée Guillaume Le Conquérant, Lillebonne");
        },
        cd: () => {
          let q = (args[0] || "").toLowerCase().replace(/^[#/~.]+/, "");
          if (!q) return p(`usage : cd <${SECTIONS.map((s) => s.id).join("|")}>`, "r");
          if (q === "skills") q = "competences";
          const s = SECTIONS.find((x) => x.id === q || x.label.toLowerCase().startsWith(q));
          if (!s) return p(`cd: ${q}: section introuvable`, "r");
          p(`→ ${s.label}`, "g");
          setTimeout(() => scrollToId(s.id), 150);
        },
        ls: () => p("projects/  htb-writeups/  cv.txt", "c"),
        cat: () => (args[0] === "cv.txt" ? COMMANDS.cv() : p(`cat: ${args[0] || ""}: Aucun fichier ou dossier de ce type`, "r")),
        sudo: () => p("guest n'est pas dans le fichier sudoers.", "r"),
        exit: () => { p("logout", "m"); setTimeout(() => scrollToId("accueil"), 150); },
        hedgehog: () => p("   .|||||||||.\n  |||||||||||||\n |||||||||||' .\\\n `||||||||||_,__o", "y"),
      };
      if (cmd.toLowerCase() === "clear") { setLines([]); return; }
      const fn = COMMANDS[cmd.toLowerCase()];
      if (fn) fn();
      else p(<>hsh: commande introuvable : {cmd} — tapez <span className="c">help</span></>, "r");
    }
    setLines((l) => [...l, ...out]);
  };

  const onKey = (e) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) { e.preventDefault(); hIdx.current = Math.max(0, hIdx.current - 1); setValue(h[hIdx.current]); }
    else if (e.key === "ArrowDown" && h.length) { e.preventDefault(); hIdx.current = Math.min(h.length, hIdx.current + 1); setValue(h[hIdx.current] || ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const names = ["help", "whoami", "skills", "projects", "open", "htb", "contact", "cv", "parcours", "cd", "clear", "ls", "cat", "exit"];
      const m = names.filter((k) => k.startsWith(value.trim()));
      if (m.length === 1) setValue(m[0] + " ");
    }
  };

  return (
    <section id="terminal" className="section">
      <SectionHead num="06" kicker="shell invité" title="Terminal" />

      <div className="term" data-reveal>
        <div className="term-bar">
          <span className="dots"><i /><i /><i /></span>
          <span>guest@herisson: ~</span>
          <span>hsh v4.2</span>
        </div>
        <div
          className="term-body"
          ref={body}
          data-lenis-prevent
          onClick={() => { if (!window.getSelection().toString()) input.current.focus({ preventScroll: true }); }}
        >
          {lines.map((l, i) => <div key={i} className={l.cls}>{l.out}</div>)}
          <form className="term-line" autoComplete="off" onSubmit={(e) => { e.preventDefault(); run(value); setValue(""); }}>
            <label htmlFor="term-in" className="prompt">{PROMPT}</label>
            <input
              id="term-in" ref={input} type="text" spellCheck="false" autoCapitalize="off" aria-label="Commande du terminal"
              value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
            />
          </form>
        </div>
      </div>
      <p className="term-hint" data-reveal>Essayez <code>help</code>, <code>whoami</code>, <code>projects</code>, <code>skills</code> ou <code>contact</code>.</p>
    </section>
  );
}
