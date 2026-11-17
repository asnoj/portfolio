/* =========================================================
   HERISSON // portfolio — main.js (vanilla, zéro dépendance)
   ========================================================= */
(() => {
  "use strict";

  const GH = "https://github.com/asnoj/";
  const HTB = "https://profile.hackthebox.com/profile/01a1c295-d2df-737d-a264-8e72620451c0";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let goNode = () => {};   // défini par nodes(), utilisé par le terminal

  /* ---------------------------------------------------------
     DONNÉES PROJETS — modifie ici pour ajouter / retirer
     cat: lowlevel | cyber | system | graphics
     --------------------------------------------------------- */
  const PROJECTS = [
    {
      name: "hedgepass", repo: "hedgepass", cat: "cyber", featured: true, lang: "C++17",
      desc: "Gestionnaire de mots de passe en CLI. Argon2id + XChaCha20-Poly1305 via libsodium, mémoire verrouillée, écritures atomiques et parseur fuzzé.",
      tags: ["libsodium", "Argon2id", "Memory safety", "Fuzzing"],
    },
    {
      name: "libasm", repo: "libasm", cat: "lowlevel", featured: true, lang: "x86-64 NASM",
      desc: "Réimplémentation de fonctions de la libc (strlen, strcmp, strdup, read, write…) en assembleur pur, en respectant l'ABI System V AMD64.",
      tags: ["NASM", "System V ABI", "Alignement pile", "errno"],
    },
    {
      name: "Dr_Quine", repo: "dr_Quine", cat: "lowlevel", featured: true, lang: "C · ASM",
      desc: "Programmes auto-réplicants (Colleen, Grace, Sully) en C et en assembleur x86-64 : théorème de récursion de Kleene et code auto-générateur.",
      tags: ["Quines", "NASM", "Macros", "Kleene"],
    },
    {
      name: "hedgemon", repo: "hedgmon", cat: "system", featured: true, lang: "C",
      desc: "Moniteur système façon htop, fait maison : CPU, RAM, swap, processus et connexions TCP lus directement depuis /proc. Zéro dépendance.",
      tags: ["/proc", "TCP states", "Parsing", "Projet perso"],
    },
    {
      name: "minishell", repo: "minishell", cat: "system", featured: true, lang: "C",
      desc: "Shell Unix inspiré de bash : pipes, redirections, heredocs, builtins, variables d'environnement et gestion des signaux avec GNU Readline.",
      tags: ["fork/execve", "Pipes", "Signaux", "Parsing"],
    },
    {
      name: "htb-writeups", repo: "htb-writeups", cat: "cyber", lang: "Markdown",
      desc: "Mes write-ups Hack The Box : recon, exploitation et privesc sur des machines retirées, avec les outils, concepts et galères rencontrés.",
      tags: ["Pentest", "Privesc", "SMB", "Metasploit"],
    },
    {
      name: "ft_irc", repo: "ft_irc", cat: "system", lang: "C++",
      desc: "Serveur IRC en C++ : sockets non bloquants, multiplexage I/O avec poll() et implémentation du protocole IRC.",
      tags: ["Sockets", "poll()", "Réseau", "RFC"],
    },
    {
      name: "net_practice", repo: "net_practice", cat: "cyber", lang: "Réseau",
      desc: "Exercices d'adressage IP et de routage : masques de sous-réseau, passerelles, tables de routage et configuration de topologies.",
      tags: ["TCP/IP", "Subnetting", "Routage"],
    },
    {
      name: "Inception", repo: "Inseption-42-", cat: "system", lang: "Docker",
      desc: "Stack LEMP entièrement conteneurisée : NGINX (TLS 1.2/1.3), WordPress/PHP-FPM, MariaDB, orchestrée avec Docker Compose et des Dockerfiles faits main.",
      tags: ["Docker", "TLS", "NGINX", "Infra"],
    },
    {
      name: "philosophers", repo: "philosophers", cat: "lowlevel", lang: "C",
      desc: "Le dîner des philosophes : threads, mutex et gestion fine des data races et deadlocks.",
      tags: ["pthreads", "Mutex", "Concurrence"],
    },
    {
      name: "minitalk", repo: "minitalk", cat: "lowlevel", lang: "C",
      desc: "Communication client/serveur bit à bit en utilisant uniquement les signaux UNIX SIGUSR1 et SIGUSR2.",
      tags: ["Signaux", "IPC", "Bitwise"],
    },
    {
      name: "libft", repo: "libft", cat: "lowlevel", lang: "C",
      desc: "Ma propre bibliothèque C standard : manipulation mémoire, chaînes et listes chaînées, réutilisée dans tous mes projets.",
      tags: ["libc", "Mémoire", "Listes"],
    },
    {
      name: "get_next_line", repo: "get_next_line", cat: "lowlevel", lang: "C",
      desc: "Lecture ligne par ligne depuis un file descriptor avec buffer statique, gestion multi-fd.",
      tags: ["read()", "Buffers", "Static"],
    },
    {
      name: "ft_printf", repo: "ft_printft", cat: "lowlevel", lang: "C",
      desc: "Réimplémentation de printf : fonctions variadiques et conversions de formats.",
      tags: ["Variadiques", "Formatage"],
    },
    {
      name: "cub3D", repo: "Cub3d", cat: "graphics", lang: "C",
      desc: "Moteur de raycasting façon années 90 : rendu 3D à partir d'une carte 2D, textures et déplacements en temps réel.",
      tags: ["Raycasting", "MiniLibX", "Maths"],
    },
    {
      name: "fract-ol", repo: "fract-ol", cat: "graphics", lang: "C",
      desc: "Explorateur de fractales (Mandelbrot, Julia) avec zoom et couleurs dynamiques.",
      tags: ["Fractales", "MiniLibX", "Complexes"],
    },
    {
      name: "push_swap", repo: "push_swap", cat: "graphics", lang: "C",
      desc: "Tri de données sur deux piles avec un jeu d'instructions limité, en minimisant le nombre d'opérations.",
      tags: ["Algorithmie", "Complexité"],
    },
    {
      name: "CPP Modules", repo: "cpp_module_42", cat: "lowlevel", lang: "C++",
      desc: "Les modules C++ de 42 : POO, forme canonique, templates, STL, casts et exceptions.",
      tags: ["POO", "Templates", "STL"],
    },
  ];


  /* ---------------------------------------------------------
     GLOSSAIRE — définitions vulgarisées affichées au survol.
     Chaque entrée : [ [alias...], "définition" ]
     --------------------------------------------------------- */
  const GLOSSARY = [
    [["c", "langage c"], "Langage de programmation proche de la machine. On l'utilise pour les systèmes d'exploitation, l'embarqué et les logiciels qui doivent être rapides et fiables."],
    [["c++", "c++ (17)", "c++17"], "Évolution du C avec la programmation orientée objet. Utilisé pour les logiciels exigeants : outils de sécurité, navigateurs, jeux, finance."],
    [["assembleur", "nasm", "x86-64", "asm"], "Le langage le plus proche du processeur : on écrit directement les instructions que la puce exécute. Indispensable pour analyser des programmes malveillants."],
    [["bas niveau"], "Programmer au plus près du matériel (mémoire, processeur, système) plutôt qu'avec des outils qui cachent ces détails."],
    [["linux"], "Le système d'exploitation qui fait tourner la grande majorité des serveurs, du cloud et des équipements réseau."],
    [["bash", "bash / scripting"], "Langage de script de Linux, pour automatiser des tâches répétitives."],
    [["appels système", "syscalls"], "La façon dont un programme demande un service au système : lire un fichier, ouvrir une connexion réseau, lancer un autre programme…"],
    [["processus"], "Un programme en cours d'exécution. Savoir les gérer, c'est savoir les lancer, les surveiller, les faire communiquer et les arrêter proprement."],
    [["ipc"], "Inter-Process Communication : les techniques qui permettent à plusieurs programmes d'échanger des données entre eux."],
    [["signaux"], "Petits messages envoyés par le système à un programme, par exemple Ctrl+C pour lui demander de s'arrêter."],
    [["gestion mémoire", "mémoire"], "Réserver puis libérer soi-même la mémoire d'un programme. Mal fait, c'est la première source de plantages et de failles de sécurité."],
    [["memory safety"], "Garantir qu'un programme n'accède jamais à une zone mémoire interdite. C'est la base pour éviter les failles exploitables par un attaquant."],
    [["threads", "pthreads"], "Faire exécuter plusieurs tâches en parallèle dans un même programme pour aller plus vite."],
    [["mutex"], "Un « verrou » qui empêche deux tâches parallèles de modifier la même donnée en même temps."],
    [["concurrence"], "Faire tourner plusieurs tâches en même temps sans qu'elles se gênent ni se bloquent."],
    [["/proc"], "Dossier spécial de Linux où le système affiche en direct l'état de la machine : processeur, mémoire, programmes en cours."],
    [["system v abi"], "Les règles officielles qui fixent comment les fonctions se transmettent des données au niveau du processeur sous Linux."],
    [["shell"], "Le programme qui lit les commandes tapées dans un terminal et les exécute (comme bash)."],
    [["libc"], "La bibliothèque de base du langage C : les fonctions que presque tous les programmes utilisent (texte, mémoire, fichiers)."],
    [["pentest"], "Test d'intrusion : attaquer un système avec l'autorisation de son propriétaire pour trouver ses failles avant les vrais pirates."],
    [["offensive", "offensif"], "Sécurité offensive : se mettre dans la peau de l'attaquant pour trouver les failles (pentest, red team)."],
    [["défensive", "défensif"], "Sécurité défensive : protéger, surveiller et réagir aux incidents (SOC, blue team)."],
    [["ctf"], "Capture The Flag : compétitions de cybersécurité où l'on exploite des failles pour récupérer un « drapeau » caché."],
    [["hack the box", "htb"], "Plateforme d'entraînement reconnue où l'on attaque légalement de vraies machines vulnérables."],
    [["recon", "reconnaissance"], "Première étape d'une attaque : cartographier la cible (services, versions, utilisateurs) pour trouver un point d'entrée."],
    [["privesc", "privilege escalation"], "Élévation de privilèges : passer d'un accès limité à un accès administrateur sur une machine."],
    [["reverse engineering"], "Comprendre comment fonctionne un programme sans avoir son code source, en analysant directement le fichier exécutable."],
    [["cryptographie", "chiffrement"], "Rendre des données illisibles pour quiconque n'a pas la bonne clé."],
    [["libsodium"], "Bibliothèque de cryptographie moderne et reconnue, conçue pour être difficile à mal utiliser."],
    [["argon2id"], "Algorithme qui transforme un mot de passe en clé de chiffrement. Il est conçu pour rendre les attaques par force brute très coûteuses."],
    [["xchacha20-poly1305"], "Algorithme de chiffrement moderne qui protège à la fois le secret des données et le fait qu'elles n'ont pas été modifiées."],
    [["fuzzing"], "Bombarder un programme de données aléatoires ou malformées pour détecter automatiquement les plantages et les failles."],
    [["rgpd"], "Règlement européen sur la protection des données personnelles. Toute entreprise qui traite des données doit le respecter."],
    [["tcp/ip", "réseau"], "L'ensemble des règles (protocoles) qui font fonctionner Internet et les réseaux d'entreprise."],
    [["sockets"], "Le mécanisme de base qui permet à deux programmes de communiquer à travers le réseau."],
    [["poll()"], "Fonction qui permet à un serveur de surveiller des dizaines de connexions réseau en même temps."],
    [["websocket", "socket.io"], "Une connexion permanente entre un navigateur et un serveur pour échanger en temps réel (chat, notifications, jeux)."],
    [["docker"], "Outil qui emballe une application avec tout ce dont elle a besoin dans un « conteneur », pour qu'elle tourne de la même façon partout."],
    [["tls"], "Le protocole qui chiffre les connexions sur Internet : c'est le cadenas du HTTPS."],
    [["nginx"], "Serveur web très répandu, utilisé pour héberger des sites et répartir le trafic."],
    [["infra"], "L'infrastructure : les serveurs, réseaux et services sur lesquels tournent les applications."],
    [["git"], "Outil qui garde l'historique de chaque modification du code et permet de travailler à plusieurs sans se marcher dessus."],
    [["gdb"], "Débogueur : il permet d'exécuter un programme pas à pas pour trouver l'origine d'un bug."],
    [["sql"], "Langage pour interroger et gérer des bases de données."],
    [["parsing"], "Analyser un texte (une commande, un fichier) pour en comprendre la structure et l'exploiter."],
    [["fork/execve"], "Les appels système Linux qui créent un nouveau processus puis y lancent un programme."],
    [["pipes"], "Relier la sortie d'un programme à l'entrée d'un autre, comme une chaîne de traitement."],
    [["tcp states"], "Les différentes étapes de vie d'une connexion réseau : en écoute, établie, en fermeture…"],
    [["quines"], "Programmes qui affichent leur propre code source. Un exercice de logique qui demande de maîtriser finement le langage."],
    [["kleene"], "Théorème mathématique qui garantit qu'un programme peut toujours accéder à sa propre description."],
    [["raycasting"], "Technique de rendu 3D des premiers jeux vidéo des années 90 : on calcule ce que voit le joueur en lançant des rayons."],
    [["minilibx"], "Petite bibliothèque graphique fournie par l'École 42 pour ouvrir une fenêtre et dessiner."],
    [["variadiques"], "Fonctions qui acceptent un nombre variable de paramètres, comme printf."],
    [["poo"], "Programmation orientée objet : organiser le code en « objets » qui regroupent données et comportements."],
    [["stl", "templates"], "Outils du C++ pour écrire du code générique et réutilisable (listes, tableaux, tris…)."],
    [["smb"], "Protocole de partage de fichiers de Windows. Historiquement à l'origine de failles majeures, comme celle de WannaCry."],
    [["eternalblue", "ms17-010"], "Faille Windows célèbre, exploitée par le rançongiciel WannaCry en 2017."],
    [["ms08-067"], "Ancienne faille critique de Windows permettant de prendre le contrôle d'une machine à distance."],
    [["metasploit"], "Outil de référence des pentesteurs, qui regroupe des milliers d'attaques prêtes à l'emploi."],
    [["idor"], "Faille où l'on accède aux données d'un autre utilisateur simplement en changeant un identifiant dans l'adresse."],
    [["pcap"], "Fichier d'enregistrement du trafic réseau, que l'on analyse pour retrouver ce qui a transité (parfois des mots de passe)."],
    [["ftp", "ssh"], "Protocoles pour transférer des fichiers (FTP) ou se connecter à distance à une machine (SSH)."],
    [["linux capabilities"], "Droits spéciaux accordés à un programme sous Linux. Mal configurés, ils permettent de devenir administrateur."],
    [["samba"], "Logiciel qui permet à Linux de partager des fichiers avec Windows (protocole SMB)."],
    [["distcc"], "Outil de compilation distribuée. Une version vulnérable permet d'exécuter des commandes à distance."],
    [["tomcat"], "Serveur d'applications web Java, très utilisé en entreprise."],
    [["war"], "Format de paquet pour déployer une application Java sur un serveur comme Tomcat."],
    [["reverse shell"], "Technique où la machine attaquée se connecte elle-même à l'attaquant, lui donnant un terminal à distance."],
    [["peer-learning", "autonomie"], "À 42, pas de professeurs ni de cours : on apprend seul et entre pairs, par projets. Ça forge l'autonomie et la débrouillardise."],
    [["terme technique"], "Comme ça ! Une définition courte et sans jargon, pour que tout le monde s'y retrouve."],
  ];
  const DEFS = new Map();
  GLOSSARY.forEach(([keys, def]) => keys.forEach((k) => DEFS.set(k.toLowerCase(), def)));
  const defOf = (txt) => DEFS.get(String(txt).trim().toLowerCase());

  const CAT_LABEL = { lowlevel: "BAS NIVEAU", cyber: "CYBER", system: "SYSTÈME", graphics: "ALGO/GFX" };

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* zoom CSS appliqué à <html> (dézoom PC) : les rects sont en px écran, les styles en px CSS */
  const pageZoom = () => parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- INTRO (séquence d'accès) ---------- */
  function boot() {
    const el = $("#boot");
    const log = $("#boot-log");
    const bar = $("#boot-bar");
    const pct = $("#boot-pct");
    const mod = $("#boot-mod");
    const name = $("#boot-name");
    let seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; } catch (_) { /* stockage indisponible */ }
    if (reduced || seen || /[?&]noboot\b/.test(location.search)) { el.classList.add("done"); return; }

    document.documentElement.classList.add("booting");
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const phase = (c) => el.classList.add(c);
    let ended = false;

    const end = () => {
      if (ended) return;
      ended = true;
      timers.forEach(clearTimeout);
      el.classList.add("exit");
      document.documentElement.classList.remove("booting");
      try { sessionStorage.setItem("booted", "1"); } catch (_) { /* ignore */ }
      window.removeEventListener("keydown", end);
      el.removeEventListener("click", end);
      setTimeout(() => el.classList.add("done"), 1100);
      setTimeout(() => document.dispatchEvent(new Event("boot:done")), 350);
    };
    window.addEventListener("keydown", end);
    el.addEventListener("click", end);

    // phase 0 : cadre technique
    later(() => phase("p0"), 60);

    // phase 1 : journal + compteur
    const T1 = 500, D1 = 2100;
    const lines = [
      ["mem check ..................... 16384 MB", "ok"],
      ["loading kernel modules ........ [ OK ]", "ok"],
      ["mount /dev/brain .............. [ OK ]", "ok"],
      ["caffeine level ................ [ LOW ]", "warn"],
      ["linking libft.a ............... [ OK ]", "ok"],
      ["unlocking hedgepass vault ..... [ OK ]", "ok"],
      ["scanning htb targets .......... [ 5 ]", "ok"],
      ["uplink: ÉCOLE 42 LE HAVRE ..... [ OK ]", "ok"],
    ];
    const mods = ["NOYAU", "MÉMOIRE", "RÉSEAU", "CRYPTO", "PROJETS", "PROFIL"];
    later(() => {
      phase("p1");
      lines.forEach(([txt, cls], i) => later(() => {
        const span = document.createElement("span");
        span.className = cls;
        span.textContent = txt + "\n";
        log.appendChild(span);
      }, 100 + i * (D1 / lines.length)));
      const t0 = performance.now();
      const progress = () => {
        if (ended) return;
        const k = Math.min(1, (performance.now() - t0) / D1);
        const e = 1 - Math.pow(1 - k, 2);
        bar.style.width = `${e * 100}%`;
        pct.textContent = String(Math.round(e * 100)).padStart(3, "0");
        mod.textContent = `MODULE : ${mods[Math.min(mods.length - 1, Math.floor(e * mods.length))]}`;
        if (k < 1) requestAnimationFrame(progress);
        else { mod.textContent = "PROFIL CHARGÉ ✓"; phase("p1done"); }
      };
      requestAnimationFrame(progress);
    }, T1);

    // phase 2 : aplat plein écran (après un temps d'arrêt à 100 %)
    const T2 = T1 + D1 + 1100;
    later(() => phase("p2"), T2);

    // phase 3 : identification
    const T3 = T2 + 900;
    later(() => {
      phase("p3");
      const target = name.textContent;
      const glyphs = "ABCDEF0123456789#$%&@!?<>/\\";
      const t1 = performance.now();
      const D = 900;
      const decode = () => {
        if (ended) return;
        const k = Math.min(1, (performance.now() - t1) / D);
        name.textContent = [...target].map((c, i) =>
          c === " " || i / target.length < k ? c : glyphs[(Math.random() * glyphs.length) | 0]).join("");
        if (k < 1) requestAnimationFrame(decode);
      };
      decode();
    }, T3);
    later(() => phase("p4"), T3 + 1100);
    later(end, T3 + 3300);
  }

  /* ---------- TEXTE TAPÉ ---------- */
  function typed() {
    const el = $(".typed");
    if (!el) return;
    const words = el.dataset.words.split("|");
    if (reduced) { el.textContent = words[0]; return; }
    let w = 0, i = 0, del = false;
    const tick = () => {
      const word = words[w];
      el.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 70);
    };
    tick();
  }

  /* ---------- PROJETS ---------- */
  function renderProjects() {
    const grid = $("#projects-grid");
    grid.innerHTML = PROJECTS.map((p, idx) => `
      <a class="proj clip reveal ${p.cat}${p.featured ? " featured" : ""}" data-cat="${p.cat}"
         href="${GH}${encodeURIComponent(p.repo)}" target="_blank" rel="noopener">
        <div class="proj-top">
          <span class="proj-cat">${CAT_LABEL[p.cat]}${p.featured ? ' <span class="proj-star">★</span>' : ""}</span>
          <span>#${String(idx + 1).padStart(2, "0")} · ${esc(p.lang)}</span>
        </div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <div class="proj-tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <span class="proj-link">> ouvrir le repo ↗</span>
      </a>`).join("");

    $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
      const f = btn.dataset.filter;
      $$(".proj", grid).forEach((card) => {
        card.classList.toggle("hidden", f !== "all" && card.dataset.cat !== f);
      });
    }));
  }

  /* ---------- TERMINAL INTERACTIF ---------- */
  function terminal() {
    const out = $("#term-out");
    const form = $("#term-form");
    const input = $("#term-in");
    const body = $("#term-body");
    const history = [];
    let hIdx = 0;

    const print = (html, cls = "") => {
      const d = document.createElement("div");
      if (cls) d.className = cls;
      d.innerHTML = html;
      out.appendChild(d);
    };
    const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener">${esc(label || url)}</a>`;

    const COMMANDS = {
      help: () => {
        print("Commandes disponibles :", "y");
        [
          ["whoami", "qui suis-je"],
          ["skills", "compétences principales"],
          ["projects", "liste des projets"],
          ["open &lt;projet&gt;", "ouvre le repo GitHub d'un projet"],
          ["htb", "progression Hack The Box"],
          ["contact", "comment me joindre"],
          ["cv", "statut de la recherche"],
          ["parcours", "formation"],
          ["cd &lt;nœud&gt;", "se connecter à un nœud (ex : cd projets)"],
          ["clear", "efface l'écran"],
        ].forEach(([c, d]) => print(`  <span class="c">${c.padEnd(16)}</span><span class="m">${d}</span>`));
      },
      whoami: () => {
        print("Jonas Crochet (herisson / asnoj)", "y");
        print("Étudiant en architecture informatique (Bac+5) à l'École 42 Le Havre.");
        print("C, C++, x86-64 ASM sous Linux. Je construis mes outils de zéro, côté offensif comme défensif.", "m");
      },
      skills: () => {
        print("[ BAS NIVEAU ] C · C++17 · x86-64 NASM · syscalls · mémoire · processus · threads", "y");
        print("[ CYBER      ] pentest · CTF · offensif/défensif · crypto (libsodium) · RGPD", "c");
        print("[ RÉSEAU     ] Docker · TLS 1.2/1.3 · HTTPS/WSS · sockets · WebSocket · Socket.io", "g");
        print("[ OUTILS     ] Linux · Windows · Bash · SQL · Git · gdb · valgrind · Metasploit", "r");
      },
      projects: () => {
        PROJECTS.forEach((p) => print(
          `<span class="${p.featured ? "y" : "m"}">${p.featured ? "★" : "·"}</span> <span class="c">${esc(p.name).padEnd(18)}</span><span class="m">${CAT_LABEL[p.cat]}</span>`));
        print("→ tape <span class=\"c\">open &lt;nom&gt;</span> pour ouvrir un repo.", "m");
      },
      open: (args) => {
        const q = (args[0] || "").toLowerCase();
        if (!q) return print("usage : open &lt;projet&gt;", "r");
        const p = PROJECTS.find((x) => x.name.toLowerCase() === q || x.repo.toLowerCase() === q)
              || PROJECTS.find((x) => x.name.toLowerCase().startsWith(q));
        if (!p) return print(`open: ${esc(q)}: projet introuvable`, "r");
        const url = GH + encodeURIComponent(p.repo);
        print(`ouverture de ${link(url)} …`, "g");
        window.open(url, "_blank", "noopener");
      },
      htb: () => {
        print("5 machines pwned — Cap · Blue · Legacy · Lame · Jerry", "g");
        print("Objectif : machines Medium et exploitation manuelle sans Metasploit.", "m");
        print("profil   " + link(HTB, "profile.hackthebox.com"));
        print("writeups " + link(GH + "htb-writeups"));
      },
      contact: () => {
        const mail = $(".contact-link[href^='mailto:']");
        if (mail) print(`email    ${link(mail.href, mail.href.replace("mailto:", ""))}`);
        print(`github   ${link(GH, "github.com/asnoj")}`);
        print(`linkedin ${link("https://www.linkedin.com/in/jonascrochet", "linkedin.com/in/jonascrochet")}`);
        print(`htb      ${link(HTB, "profil Hack The Box")}`);
        print("→ ou descends à la section Contact.", "m");
      },
      cv: () => {
        print("STATUT    : recherche active", "y");
        print("TYPE      : stage de 6 mois ou alternance");
        print("DÉBUT     : janvier 2027");
        print("DOMAINE   : cybersécurité · développement logiciel C/C++");
        print(`FORMATION : expert en architecture informatique, Bac+5 (${link("https://www.francecompetences.fr/recherche/rncp/39774/", "RNCP 39774")}), École 42 Le Havre`);
        print("LIEU      : basé au Havre (76) · mobile dans toute la France, prêt à déménager", "m");
        print("EXTRA     : permis B, véhiculé · anglais B2", "m");
      },
      parcours: () => {
        print("2025 → …  École 42 Le Havre — expert en architecture informatique (Bac+5)", "y");
        print("2025      Bac général — NSI · Maths · HLP — Lycée Guillaume Le Conquérant, Lillebonne");
      },
      cd: (args) => {
        const q = (args[0] || "").toLowerCase().replace(/^[#/~.]+/, "");
        if (!q) return print("usage : cd &lt;accueil|profil|parcours|skills|projets|htb|terminal|contact&gt;", "r");
        if (!goNode(q)) print(`cd: ${esc(q)}: nœud introuvable`, "r");
        else print(`connexion au nœud ${esc(q)}…`, "g");
      },
      clear: () => { out.innerHTML = ""; },
      ls: () => print("projects/  htb-writeups/  coffee.txt  .secrets", "c"),
      "cat": (args) => {
        if (args[0] === "coffee.txt") return print("niveau de café : critique. réapprovisionnement requis.", "y");
        if (args[0] === ".secrets") return print("cat: .secrets: Permission denied", "r");
        print(`cat: ${esc(args[0] || "")}: Aucun fichier ou dossier de ce type`, "r");
      },
      sudo: () => print("herisson n'est pas dans le fichier sudoers. Cet incident sera signalé. >;]", "r"),
      "rm": () => print("rm: bien essayé.", "r"),
      exit: () => print("Il n'y a pas de sortie. Seulement des offres de stage.", "y"),
      hedgehog: () => print("   .|||||||||.\n  |||||||||||||\n |||||||||||' .\\\n `||||||||||_,__o", "y"),
    };

    const run = (raw) => {
      const line = raw.trim();
      print(`<span class="g">guest@herisson</span>:<span class="c">~</span>$ ${esc(line)}`, "cmd");
      if (!line) return;
      history.push(line);
      hIdx = history.length;
      const [cmd, ...args] = line.split(/\s+/);
      const fn = COMMANDS[cmd.toLowerCase()];
      if (fn) fn(args);
      else print(`hsh: commande introuvable : ${esc(cmd)} — tape <span class="c">help</span>`, "r");
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      run(input.value);
      input.value = "";
      body.scrollTop = body.scrollHeight;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && history.length) {
        hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx]; e.preventDefault();
      } else if (e.key === "ArrowDown" && history.length) {
        hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ""; e.preventDefault();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const m = Object.keys(COMMANDS).filter((k) => k.startsWith(input.value.trim()));
        if (m.length === 1) input.value = m[0] + " ";
      }
    });
    body.addEventListener("click", () => {
      if (!window.getSelection().toString()) input.focus({ preventScroll: true });
    });

    print("hsh v4.2 — shell invité de Jonas Crochet. Tape <span class=\"c\">help</span> pour commencer.", "m");
  }


  /* ---------- NAVIGATION PAR NŒUDS (pas de défilement de page) ---------- */
  function nodes() {
    const panels = $$(".panel");
    const links = $$(".nodes a");
    const ids = panels.map((p) => p.id);
    const names = links.map((a) => a.querySelector("span").textContent);
    const view = $("#viewport");
    const jack = $("#jack");
    const packet = $(".nodes-packet");
    const dotsBox = $("#hud-dots");
    let cur = -1;
    let busy = false;
    let queued = null;

    dotsBox.innerHTML = panels.map(() => "<i></i>").join("");
    const dots = $$("i", dotsBox);

    const revealIn = (panel) => {
      $$(".reveal", panel).forEach((e, k) => {
        e.style.transitionDelay = `${Math.min(k, 12) * 55}ms`;
        e.classList.add("in");
      });
    };
    const revealOut = (panel) => {
      $$(".reveal", panel).forEach((e) => { e.style.transitionDelay = "0ms"; e.classList.remove("in"); });
    };

    const movePacket = (i, instant) => {
      if (instant) {
        packet.style.transition = "none";
        requestAnimationFrame(() => requestAnimationFrame(() => { packet.style.transition = ""; }));
      }
      const dot = links[i].querySelector(".dot");
      const box = packet.offsetParent || document.body;
      const r = dot.getBoundingClientRect(), b = box.getBoundingClientRect();
      const z = pageZoom();
      packet.style.transform = `translate(${(r.left - b.left + r.width / 2) / z - 5}px, ${(r.top - b.top + r.height / 2) / z - 5}px)`;
    };

    const hud = (i, instant) => {
      links.forEach((a, k) => {
        a.classList.toggle("is-active", k === i);
        if (k === i) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      $("#hud-node").textContent = String(i).padStart(2, "0");
      $("#hud-name").textContent = names[i].toUpperCase();
      const prev = (i - 1 + panels.length) % panels.length, next = (i + 1) % panels.length;
      $("#prev-label").textContent = names[prev].toUpperCase();
      $("#next-label").textContent = names[next].toUpperCase();
      document.title = i === 0 ? "Jonas Crochet // Systèmes & Cybersécurité" : `${names[i]} // Jonas Crochet`;
      movePacket(i, instant);
      // sur mobile, garder le nœud actif visible dans la barre
      links[i].scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" });
    };

    const scramble = (el, text, ms) => {
      const glyphs = "0123456789ABCDEF";
      const t0 = performance.now();
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        el.textContent = [...text].map((c, n) => (c === " " || n / text.length < k ? c : glyphs[(Math.random() * 16) | 0])).join("");
        if (k < 1) requestAnimationFrame(step);
      };
      step();
    };
    let hexTimer = null;
    const hexNoise = (on) => {
      clearInterval(hexTimer);
      if (!on) return;
      const el = $("#jack-hex");
      hexTimer = setInterval(() => {
        el.textContent = Array.from({ length: 12 }, () => ((Math.random() * 256) | 0).toString(16).toUpperCase().padStart(2, "0")).join(" ");
      }, 45);
    };

    const show = (i) => {
      panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
      panels[i].scrollTop = 0;
    };

    const go = (i, opts = {}) => {
      if (i < 0 || i >= panels.length) return false;
      if (busy) { queued = i; return true; }
      if (i === cur) return true;
      const from = cur >= 0 ? panels[cur] : null;
      const to = panels[i];
      if (opts.push !== false && location.hash !== `#${ids[i]}`) history.pushState(null, "", `#${ids[i]}`);
      cur = i;
      hud(i, !from);

      if (!from || opts.instant || reduced) {
        if (from) revealOut(from);
        show(i);
        if (!opts.hold) revealIn(to);
        return true;
      }

      busy = true;
      from.classList.add("is-leaving");
      jack.classList.add("on");
      $("#jack-cmd").textContent = `> jack_in --node ${String(i).padStart(2, "0")}`;
      scramble($("#jack-name"), names[i].toUpperCase(), 300);
      hexNoise(true);

      setTimeout(() => {
        from.classList.remove("is-leaving");
        revealOut(from);
        show(i);
        to.classList.add("is-entering");
        view.classList.add("scanning");
        jack.classList.remove("on");
        hexNoise(false);
        revealIn(to);
      }, 520);
      setTimeout(() => {
        to.classList.remove("is-entering");
        view.classList.remove("scanning");
        busy = false;
        if (queued !== null) { const q = queued; queued = null; go(q); }
      }, 1100);
      return true;
    };

    const indexOf = (key) => {
      const k = String(key).toLowerCase();
      let i = ids.indexOf(k);
      if (i < 0) i = names.findIndex((n) => n.toLowerCase().startsWith(k));
      if (i < 0 && k === "competences") i = ids.indexOf("skills");
      return i;
    };
    goNode = (key) => { const i = indexOf(key); return i >= 0 && go(i); };

    // liens internes (#profil, #contact…) -> navigation par nœud
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const i = ids.indexOf(a.getAttribute("href").slice(1));
      if (i < 0) return;
      e.preventDefault();
      go(i);
    });
    $("#prev-node").addEventListener("click", () => go((cur - 1 + panels.length) % panels.length));
    $("#next-node").addEventListener("click", () => go((cur + 1) % panels.length));
    window.addEventListener("popstate", () => {
      const i = ids.indexOf(location.hash.slice(1));
      go(i >= 0 ? i : 0, { push: false });
    });

    // clavier : ← → et chiffres 0-7 (sauf quand on tape dans le terminal)
    document.addEventListener("keydown", (e) => {
      if (document.documentElement.classList.contains("booting")) return;
      if (document.documentElement.classList.contains("menu-open")) return;
      if (e.target.closest && e.target.closest("input, textarea, [contenteditable]")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go((cur + 1) % panels.length); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go((cur - 1 + panels.length) % panels.length); }
      else if (/^[0-7]$/.test(e.key)) go(Number(e.key));
      else if (e.key === "m" || e.key === "M") $("#nodes-toggle").click();
      else if (e.key === "Escape") { e.preventDefault(); openMenu(); }
    });

    // tactile : balayage horizontal
    let tx = 0, ty = 0, tOk = false;
    view.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      tx = t.clientX; ty = t.clientY;
      tOk = !e.target.closest(".table-scroll, .term, .filters, .hero-ticker");
    }, { passive: true });
    view.addEventListener("touchend", (e) => {
      if (!tOk) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - tx, dy = t.clientY - ty;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 50) go(dx < 0 ? (cur + 1) % panels.length : (cur - 1 + panels.length) % panels.length);
    }, { passive: true });

    window.addEventListener("resize", () => { if (cur >= 0) movePacket(cur, true); });

    // carte réseau : fermée (numéros seuls) ou ouverte (noms visibles)
    const root = document.documentElement;
    const toggle = $("#nodes-toggle");
    const syncMap = () => {
      const open = root.classList.contains("map-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.title = open ? "Réduire la carte (M)" : "Agrandir la carte (M)";
    };
    const setMap = (open) => {
      root.classList.toggle("map-open", open);
      try { localStorage.setItem("map", open ? "open" : "closed"); } catch (_) { /* ignore */ }
      syncMap();
    };
    syncMap();
    toggle.addEventListener("click", () => setMap(!root.classList.contains("map-open")));
    $("#nodes").addEventListener("transitionend", (e) => {
      if (e.target.id === "nodes" && e.propertyName === "width" && cur >= 0) movePacket(cur, true);
    });
    if (document.fonts) document.fonts.ready.then(() => { if (cur >= 0) movePacket(cur, true); });

    // horloge du HUD
    const clock = $("#hud-clock");
    const tick = () => { clock.textContent = new Date().toLocaleTimeString("fr-FR", { hour12: false }); };
    tick();
    setInterval(tick, 1000);

    // nœud de départ : celui de l'URL, sinon l'accueil
    const start = Math.max(0, ids.indexOf(location.hash.slice(1)));
    const booting = document.documentElement.classList.contains("booting");
    go(start, { push: false, instant: true, hold: booting });
    /* ----- menu principal ----- */
    const INFO = [
      { d: "Vue d'ensemble : qui je suis, ce que je sais faire et ce que je recherche.", m: [["CIBLE", "Stage · Alternance"], ["DISPO", "Janvier 2027 · toute la France"]] },
      { d: "Mon chemin du C vers la cybersécurité, et les postes que je vise.", m: [["FORMATION", "Bac+5 · École 42 Le Havre"], ["LANGUES", "Français · Anglais B2"]] },
      { d: "Formation d'expert en architecture informatique (RNCP 39774) et bac général NSI.", m: [["DEPUIS", "Octobre 2025"], ["ÉCOLE", "42 Le Havre"]] },
      { d: "Checklist recruteur, et chaque compétence reliée au projet qui la prouve.", m: [["DOMAINES", "Bas niveau · Cyber · Réseau"], ["FORMAT", "Niveau + preuve"]] },
      { d: "Shell Unix, libc en assembleur, gestionnaire de mots de passe chiffré, moniteur système…", m: [["PROJETS", String(PROJECTS.length)], ["LANGAGES", "C · C++ · x86-64"]] },
      { d: "Journal d'opérations : machines compromises sur Hack The Box et write-ups publiés.", m: [["MACHINES", "5 compromises"], ["PROCHAINE", "Niveau Medium"]] },
      { d: "Un shell invité interactif. Tape help, whoami ou cd projets.", m: [["SHELL", "hsh v4.2"], ["ACCÈS", "Invité"]] },
      { d: "Email, LinkedIn, GitHub et Hack The Box. Disponible partout en France.", m: [["EMAIL", "jonas.crochet.jc@gmail.com"], ["RÉPONSE", "Rapide"]] },
    ];
    const menu = $("#menu");
    const items = $$(".menu-item", menu);
    const frame = $("#mp-frame");
    let mIdx = 0;
    let menuOpen = false;
    let swapTimer = null;

    const replayEnter = (i) => {
      panels[i].classList.add("is-entering");
      view.classList.add("scanning");
      revealIn(panels[i]);
      setTimeout(() => { panels[i].classList.remove("is-entering"); view.classList.remove("scanning"); }, 700);
    };

    const setActive = (i, focus) => {
      if (i === mIdx && items[i].classList.contains("is-active")) { if (focus) items[i].focus({ preventScroll: true }); return; }
      mIdx = i;
      items.forEach((b, k) => b.classList.toggle("is-active", k === i));
      if (focus) items[i].focus({ preventScroll: true });
      $("#mp-num").textContent = String(i).padStart(2, "0");
      scramble($("#mp-title"), names[i].toUpperCase(), 260);
      $("#mp-desc").textContent = INFO[i].d;
      $("#mp-meta").innerHTML = INFO[i].m.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
      frame.classList.remove("swap");
      void frame.offsetWidth; // relance l'animation
      frame.classList.add("swap");
      clearTimeout(swapTimer);
      swapTimer = setTimeout(() => frame.classList.remove("swap"), 400);
    };

    function openMenu() {
      if (menuOpen) return;
      menuOpen = true;
      menu.hidden = false;
      root.classList.add("menu-open");
      items.forEach((b) => b.classList.remove("is-active"));
      setActive(cur >= 0 ? cur : 0, true);
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("on")));
    }

    const closeMenu = (sel) => {
      if (!menuOpen) return;
      menuOpen = false;
      const target = sel ?? cur;
      if (sel != null) items[sel].classList.add("chosen");
      setTimeout(() => menu.classList.add("out"), reduced ? 0 : 200);
      setTimeout(() => {
        menu.hidden = true;
        menu.classList.remove("on", "out");
        items.forEach((b) => b.classList.remove("chosen"));
        root.classList.remove("menu-open");
        if (target === cur) { if (!reduced) replayEnter(cur); else revealIn(panels[cur]); }
        else go(target);
        $("#menu-open").focus({ preventScroll: true });
      }, reduced ? 0 : 650);
    };

    items.forEach((b, k) => {
      b.addEventListener("mouseenter", () => setActive(k, false));
      b.addEventListener("focus", () => setActive(k, false));
      b.addEventListener("click", () => closeMenu(k));
    });
    $("#menu-close").addEventListener("click", () => closeMenu(null));
    $("#menu-open").addEventListener("click", openMenu);
    menu.addEventListener("keydown", (e) => {
      const n = items.length;
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) { e.preventDefault(); setActive((mIdx + 1) % n, true); }
      else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) { e.preventDefault(); setActive((mIdx - 1 + n) % n, true); }
      else if (e.key === "Enter") { e.preventDefault(); closeMenu(mIdx); }
      else if (e.key === "Escape") { e.preventDefault(); closeMenu(null); }
      else if (/^[0-7]$/.test(e.key)) { e.preventDefault(); setActive(Number(e.key), true); closeMenu(Number(e.key)); }
    });

    // après l'intro : entrée directe sur le premier nœud
    if (booting) document.addEventListener("boot:done", () => replayEnter(start), { once: true });
  }

  /* ---------- INFO-BULLES (définitions) ---------- */
  function tooltips() {
    // les tags de projets connus du glossaire deviennent aussi des info-bulles
    $$(".proj-tags span").forEach((el) => { if (defOf(el.textContent)) el.classList.add("tip"); });

    const tip = document.createElement("div");
    tip.className = "tooltip";
    tip.setAttribute("role", "tooltip");
    tip.id = "tooltip";
    document.body.appendChild(tip);
    let current = null;

    $$(".tip").forEach((el) => {
      const def = defOf(el.dataset.term || el.textContent);
      if (!def) { el.classList.remove("tip"); return; }
      el.dataset.def = def;
      if (!el.closest("a")) el.tabIndex = 0;
    });

    const show = (el) => {
      current = el;
      const term = el.dataset.term && el.dataset.term !== "terme technique" ? el.dataset.term : el.textContent.trim();
      tip.innerHTML = `<b>${esc(term)}</b>${esc(el.dataset.def)}`;
      tip.classList.add("on");
      el.setAttribute("aria-describedby", "tooltip");
      const z = pageZoom(), b = el.getBoundingClientRect();
      const r = { left: b.left / z, top: b.top / z, bottom: b.bottom / z, width: b.width / z };
      const tw = tip.offsetWidth, th = tip.offsetHeight, m = 10;
      let x = r.left + r.width / 2 - tw / 2;
      x = Math.max(m, Math.min(x, window.innerWidth / z - tw - m));
      let y = r.top - th - 10;
      tip.classList.toggle("below", y < m);
      if (y < m) y = r.bottom + 10;
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    };
    const hide = () => {
      if (current) current.removeAttribute("aria-describedby");
      current = null;
      tip.classList.remove("on");
    };

    const find = (e) => e.target.closest && e.target.closest(".tip[data-def]");
    document.addEventListener("mouseover", (e) => { const el = find(e); if (el && el !== current) show(el); });
    document.addEventListener("mouseout", (e) => { const el = find(e); if (el && !el.contains(e.relatedTarget)) hide(); });
    document.addEventListener("focusin", (e) => { const el = find(e); if (el) show(el); });
    document.addEventListener("focusout", (e) => { if (find(e)) hide(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
    document.addEventListener("scroll", hide, { passive: true, capture: true });

    // écrans tactiles : un tap affiche la définition (sans suivre le lien du projet)
    const touch = window.matchMedia("(hover: none)");
    document.addEventListener("click", (e) => {
      if (!touch.matches) return;
      const el = find(e);
      if (el) { e.preventDefault(); el === current ? hide() : show(el); }
      else if (current) hide();
    }, true);
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    renderProjects();
    boot();          // ajoute html.booting si l'intro se joue
    nodes();
    typed();
    terminal();
    tooltips();
  });
})();
