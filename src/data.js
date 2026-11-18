/* =========================================================
   Contenu du portfolio — modifier ici, pas dans les composants
   ========================================================= */

export const GH = "https://github.com/asnoj/";
export const HTB_URL = "https://profile.hackthebox.com/profile/01a1c295-d2df-737d-a264-8e72620451c0";
export const RNCP_URL = "https://www.francecompetences.fr/recherche/rncp/39774/";
export const EMAIL = "jonas.crochet.jc@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/jonascrochet";

export const SECTIONS = [
  { id: "accueil", label: "Accueil", desc: "Qui je suis, ce que je sais faire et ce que je recherche." },
  { id: "profil", label: "Profil", desc: "Mon chemin du C vers la cybersécurité, et les postes que je vise." },
  { id: "parcours", label: "Parcours", desc: "Expert en architecture informatique (RNCP 39774) et bac général NSI." },
  { id: "competences", label: "Compétences", desc: "Chaque compétence reliée au projet qui la prouve." },
  { id: "projets", label: "Projets", desc: "Shell Unix, libc en assembleur, gestionnaire de mots de passe chiffré, moniteur système…" },
  { id: "htb", label: "Hack The Box", desc: "Machines résolues sur Hack The Box et write-ups publiés." },
  { id: "terminal", label: "Terminal", desc: "Un shell invité interactif. Tapez help, whoami ou cd projets." },
  { id: "contact", label: "Contact", desc: "Email, LinkedIn, GitHub et Hack The Box. Disponible partout en France." },
];

/* cat : lowlevel | cyber | system | graphics */
export const CAT_LABEL = { lowlevel: "Bas niveau", cyber: "Cyber", system: "Système / Réseau", graphics: "Algo / Graphique" };

export const PROJECTS = [
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
    name: "Dr_Quine", repo: "dr_Quine", cat: "lowlevel", featured: true, lang: "C · ASM",
    desc: "Programmes auto-réplicants (Colleen, Grace, Sully) en C et en assembleur x86-64 : théorème de récursion de Kleene et code auto-générateur.",
    tags: ["Quines", "NASM", "Macros", "Kleene"],
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
    name: "Inception", repo: "Inseption-42-", cat: "system", lang: "Docker",
    desc: "Stack LEMP entièrement conteneurisée : NGINX (TLS 1.2/1.3), WordPress/PHP-FPM, MariaDB, orchestrée avec Docker Compose et des Dockerfiles faits main.",
    tags: ["Docker", "TLS", "NGINX", "Infra"],
  },
  {
    name: "net_practice", repo: "net_practice", cat: "cyber", lang: "Réseau",
    desc: "Exercices d'adressage IP et de routage : masques de sous-réseau, passerelles, tables de routage et configuration de topologies.",
    tags: ["TCP/IP", "Subnetting", "Routage"],
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

export const SKILL_TREES = [
  {
    id: "A", accent: "acid", title: "Bas niveau", sub: "Systèmes · Mémoire · Assembleur",
    foot: "Un programme qui plante ou fuit en mémoire, je sais pourquoi.",
    items: [
      { term: "C", label: "Langage C", lvl: 3, proof: ["minishell", "hedgemon", "philosophers", "libft"] },
      { term: "gestion mémoire", label: "Gestion de la mémoire", lvl: 3, proof: ["minishell", "libft", "hedgepass"] },
      { term: "processus", label: "Processus, signaux, IPC", lvl: 3, proof: ["minishell", "minitalk"] },
      { term: "Linux", label: "Linux (admin, CLI, scripting Bash)", lvl: 3, proof: "utilisé au quotidien" },
      { term: "C++", label: "C++ (17)", lvl: 2, proof: ["hedgepass", "ft_irc", "CPP Modules"] },
      { term: "threads", label: "Programmation parallèle (threads)", lvl: 2, proof: ["philosophers"] },
      { term: "assembleur", label: "Assembleur x86-64", lvl: 2, proof: ["libasm", "Dr_Quine"] },
    ],
  },
  {
    id: "B", accent: "pink", title: "Cybersécurité", sub: "Offensif · Défensif · Crypto",
    foot: "Hack The Box · nmap · Metasploit · Wireshark · netcat",
    items: [
      { term: "pentest", label: "Tests d'intrusion (pentest)", lvl: 2, proof: [["5 machines Hack The Box", HTB_URL]] },
      { term: "recon", label: "Reconnaissance & énumération", lvl: 2, proof: ["htb-writeups"] },
      { term: "privesc", label: "Élévation de privilèges", lvl: 1, proof: ["htb-writeups"] },
      { term: "cryptographie", label: "Cryptographie appliquée", lvl: 2, proof: ["hedgepass"] },
      { term: "memory safety", label: "Code sécurisé & fuzzing", lvl: 2, proof: ["hedgepass"] },
      { term: "CTF", label: "CTF, offensif & défensif", lvl: 1, proof: "en cours de pratique" },
      { term: "RGPD", label: "Protection des données (RGPD, CGU)", lvl: 1, proof: "notions acquises en formation" },
    ],
  },
  {
    id: "C", accent: "white", title: "Réseau & outils", sub: "Infra · Administration · Workflow",
    foot: "Le terminal est mon environnement de travail.",
    items: [
      { term: "TCP/IP", label: "Réseau TCP/IP & sous-réseaux", lvl: 2, proof: ["net_practice", "hedgemon"] },
      { term: "sockets", label: "Sockets & serveur réseau", lvl: 2, proof: ["ft_irc"] },
      { term: "Docker", label: "Docker & Docker Compose", lvl: 2, proof: ["Inception"] },
      { term: "TLS", label: "TLS 1.2/1.3, HTTPS, NGINX", lvl: 2, proof: ["Inception"] },
      { term: "Git", label: "Git", lvl: 3, proof: [["20 repos publics", GH]] },
      { term: "GDB", label: "Débogage (GDB, Valgrind)", lvl: 3, proof: "tous mes projets C" },
      { term: "WebSocket", label: "WebSocket / Socket.io, SQL", lvl: 1, proof: "notions" },
    ],
  },
];

export const LEVELS = { 3: "Solide", 2: "Pratiqué", 1: "En progression" };

export const CHECKLIST = [
  ["C", "C / C++"], ["Linux", "Linux"], ["pentest", "Pentest"], ["TCP/IP", "Réseau TCP/IP"],
  ["cryptographie", "Cryptographie"], ["assembleur", "Assembleur"], ["Docker", "Docker"], ["Git", "Git"],
  ["Bash", "Bash / scripting"], ["SQL", "SQL"], ["RGPD", "RGPD"], [null, "Anglais B2"],
  [null, "Travail en équipe"], ["peer-learning", "Autonomie"],
];

export const HTB_MACHINES = [
  { name: "Cap", os: "Linux", diff: "Easy", concepts: ["IDOR", "pcap", "FTP", "SSH", "Linux capabilities"] },
  { name: "Blue", os: "Windows", diff: "Easy", concepts: ["SMB", "EternalBlue"] },
  { name: "Legacy", os: "Windows", diff: "Easy", concepts: ["SMB", "MS08-067", "MS17-010"] },
  { name: "Lame", os: "Linux", diff: "Easy", concepts: ["Samba", "distcc", "Metasploit"] },
  { name: "Jerry", os: "Windows", diff: "Easy", concepts: ["Tomcat", "WAR", "reverse shell"] },
];

/* GLOSSAIRE — définitions vulgarisées affichées au survol des termes soulignés */
const GLOSSARY = [
  [["c", "langage c"], "Langage de programmation proche de la machine. On l'utilise pour les systèmes d'exploitation, l'embarqué et les logiciels qui doivent être rapides et fiables."],
  [["c++", "c++17"], "Évolution du C avec la programmation orientée objet. Utilisé pour les logiciels exigeants : outils de sécurité, navigateurs, jeux, finance."],
  [["assembleur", "nasm", "x86-64", "asm"], "Le langage le plus proche du processeur : on écrit directement les instructions que la puce exécute. Indispensable pour analyser des programmes malveillants."],
  [["bas niveau"], "Programmer au plus près du matériel (mémoire, processeur, système) plutôt qu'avec des outils qui cachent ces détails."],
  [["linux"], "Le système d'exploitation qui fait tourner la grande majorité des serveurs, du cloud et des équipements réseau."],
  [["bash"], "Langage de script de Linux, pour automatiser des tâches répétitives."],
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
  [["privesc"], "Élévation de privilèges : passer d'un accès limité à un accès administrateur sur une machine."],
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
  [["websocket"], "Une connexion permanente entre un navigateur et un serveur pour échanger en temps réel (chat, notifications, jeux)."],
  [["docker"], "Outil qui emballe une application avec tout ce dont elle a besoin dans un « conteneur », pour qu'elle tourne de la même façon partout."],
  [["tls"], "Le protocole qui chiffre les connexions sur Internet : c'est le cadenas du HTTPS."],
  [["nginx"], "Serveur web très répandu, utilisé pour héberger des sites et répartir le trafic."],
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
GLOSSARY.forEach(([keys, def]) => keys.forEach((k) => DEFS.set(k, def)));
export const defOf = (term) => DEFS.get(String(term ?? "").trim().toLowerCase());
