// Facts come from the cyber CV and from the public READMEs on github.com/asnoj.
// Where they disagree (Hedgepass now uses libsodium), GitHub wins: it is the more recent.

const gh = (repo) => `https://github.com/asnoj/${repo}`;

export const person = {
  first: 'Jonas',
  last: 'Crochet',
  email: 'jonas.crochet.jc@gmail.com',
  github: 'https://github.com/asnoj',
  linkedin: 'https://www.linkedin.com/in/jonascrochet/',
};

export const intro = {
  pitch:
    'Étudiant en architecture informatique (Bac+5) à l’École 42 Le Havre, à l’aise en C, C++ et assembleur x86-64. J’apprends en construisant mes outils de zéro plutôt qu’en lisant seulement la théorie, et je m’intéresse autant à l’offensif (pentest, CTF) qu’au défensif.',
  want: 'Un passionné de cybersécurité qui cherche un stage ou une alternance à partir de janvier 2027.',
};

// The projects drawn in full. A selection, not the whole shelf.
export const featured = [
  {
    id: 'woody',
    name: 'woody_woodpacker',
    url: gh('woody_woodpacker'),
    what: 'Packer ELF64 pour Linux x86-64 (C, NASM)',
    text: 'Il prend un binaire, chiffre son code et produit un « woody » qui se déchiffre lui-même en mémoire au lancement, puis se comporte exactement comme l’original. Pour comprendre comment fonctionnent les vrais packers en en écrivant un.',
    notes: ['RC4 · clé 128 bits', 'stub NASM', 'PT_NOTE → PT_LOAD', 'PIE, adressage relatif'],
    log: [
      'en-têtes ELF parsés à la main, sans libelf',
      'clé tirée de /dev/urandom',
      'stub indépendant de la position : marche avec l’ASLR',
    ],
  },
  {
    id: 'hedgepass',
    name: 'hedgepass',
    url: gh('hedgepass'),
    what: 'Gestionnaire de mots de passe en ligne de commande (C++17)',
    text: 'Un coffre chiffré dans un seul fichier, assez petit pour être relu d’une traite. Pas de crypto maison : des primitives éprouvées de libsodium, assemblées avec soin, et un modèle de menace écrit noir sur blanc.',
    notes: ['Argon2id', 'XChaCha20-Poly1305', 'mémoire verrouillée', 'parseur fuzzé'],
    log: [
      'secrets en pages verrouillées (mlock), effacés à la destruction',
      'écritures atomiques : jamais de coffre à moitié écrit',
      'parseur testé avec libFuzzer, ASan et UBSan',
    ],
  },
  {
    id: 'inception',
    name: 'Inception',
    url: gh('Inseption-42-'),
    what: 'Infrastructure conteneurisée (Docker Compose)',
    text: 'Une pile LEMP complète, NGINX en TLS 1.2/1.3, WordPress/PHP-FPM et MariaDB, orchestrée avec Docker Compose et des Dockerfiles personnalisés. Le côté défense : un seul point d’entrée chiffré, et chaque service isolé.',
    notes: ['NGINX · TLS 1.2/1.3', 'WordPress + PHP-FPM', 'MariaDB', 'Dockerfiles maison'],
    log: ['seul point d’entrée : NGINX en TLS 1.2/1.3', 'chaque service isolé dans son conteneur', 'images construites à la main'],
  },
];

// Everything else on GitHub, hung in the burrow (le terrier).
export const burrow = [
  {
    sign: 'sécurité',
    desc: 'Attaquer pour comprendre, défendre en connaissance de cause : binaires qui se cachent, se chiffrent ou se recopient.',
    repos: [
      { name: 'woody_woodpacker', lang: 'C · NASM', url: gh('woody_woodpacker'), text: 'un packer ELF64 : le binaire est chiffré et se déchiffre lui-même en mémoire au lancement' },
      { name: 'Dr_Quine', lang: 'C · asm', url: gh('dr_Quine'), text: 'programmes auto-réplicants, théorème de récursion de Kleene' },
      { name: 'htb-writeups', lang: 'notes', url: gh('htb-writeups'), text: 'mes write-ups Hack The Box : machines retirées, sans flags, avec là où j’ai bloqué' },
    ],
  },
  {
    sign: 'bas niveau',
    desc: 'Au plus près de la machine : mémoire gérée à la main, appels système, assembleur x86-64.',
    repos: [
      { name: 'libasm', lang: 'asm', url: gh('libasm'), text: 'fonctions de la libc réécrites en x86-64, ABI System V' },
      { name: 'minishell', lang: 'C', url: gh('minishell'), text: 'un shell façon bash, en binôme : pipes, redirections, signaux' },
      { name: 'hedgemon', lang: 'C', url: gh('hedgmon'), text: 'un htop maison : CPU, RAM, processus et connexions TCP lus dans /proc' },
    ],
  },
  {
    sign: 'réseau',
    desc: 'Comment les machines se parlent : sockets, protocoles, adressage et routage.',
    repos: [
      { name: 'ft_irc', lang: 'C++', url: gh('ft_irc'), text: 'un serveur IRC' },
      { name: 'NetPractice', lang: 'TCP/IP', url: gh('net_practice'), text: 'adressage, masques et tables de routage' },
    ],
  },
  {
    sign: 'cursus 42',
    desc: 'Les projets du tronc commun de l’École 42 : du C pur, sans bibliothèque, corrigés par les pairs.',
    repos: [
      { name: 'philosophers', lang: 'C', url: gh('philosophers'), text: 'threads et mutex autour d’une table' },
      { name: 'minitalk', lang: 'C', url: gh('minitalk'), text: 'des messages envoyés par signaux UNIX' },
      { name: 'Cub3d', lang: 'C', url: gh('Cub3d'), text: 'un moteur de raycasting' },
      { name: 'push_swap', lang: 'C', url: gh('push_swap'), text: 'trier avec deux piles et peu d’instructions' },
      { name: 'fract-ol', lang: 'C', url: gh('fract-ol'), text: 'des fractales à l’écran' },
      { name: 'cpp_module_42', lang: 'C++', url: gh('cpp_module_42'), text: 'les modules C++ du cursus' },
      { name: 'libft', lang: 'C', url: gh('libft'), text: 'ma bibliothèque C de base' },
      { name: 'get_next_line', lang: 'C', url: gh('get_next_line'), text: 'lire un fichier ligne par ligne' },
      { name: 'ft_printf', lang: 'C', url: gh('ft_printft'), text: 'printf, refait à la main' },
    ],
  },
];

// `on`: circled in pencil, the groups that matter most for a cyber role.
export const skills = [
  {
    id: 'cyber',
    title: 'Cybersécurité',
    items: ['Pentest', 'CTF', 'Mécanismes offensifs et défensifs', 'Protection des données personnelles (RGPD, Privacy Policy, CGU)'],
    on: true,
  },
  {
    id: 'net',
    title: 'Réseaux & administration',
    items: ['Docker / Docker Compose', 'TLS 1.2/1.3', 'HTTPS / WSS', 'Sockets', 'WebSocket / Socket.io'],
    on: true,
  },
  { id: 'lang', title: 'Langages', items: ['C', 'C++', 'Assembleur x86-64 (NASM)', 'SQL', 'Bash'], on: true },
  {
    id: 'prog',
    title: 'Programmation système',
    items: ['Gestion mémoire manuelle', 'Appels système (syscall)', 'Processus & signaux', 'IPC'],
  },
  { id: 'sys', title: 'Systèmes', items: ['Linux (admin, CLI, scripting)', 'Windows', 'Git'] },
];

export const path = [
  {
    when: 'juin 2025',
    title: 'Bac général',
    where: 'Lycée Guillaume Le Conquérant, Lillebonne',
    text: 'Spécialités NSI, Mathématiques, Humanités, Littérature et Philosophie.',
  },
  {
    when: 'depuis oct. 2025',
    title: 'Expert en architecture informatique',
    where: 'École 42 Le Havre',
    text: 'Diplôme Bac+5 (RNCP 39774). Poursuite en spécialisation en stage ou alternance dès janvier 2027.',
  },
  {
    when: 'juil. – août 2026',
    title: 'Service technique',
    where: 'Port-Jérôme-sur-Seine',
    text: 'Entretien de la voirie, CDD du 20 juillet au 7 août 2026.',
  },
];

export const interests = [
  { id: 'climb', label: 'Escalade' },
  { id: 'gym', label: 'Musculation' },
  { id: 'music', label: 'Musique', detail: 'conservatoire classique, 7 ans' },
  { id: 'chess', label: 'Échecs' },
];

export const traits = [
  'Apte au travail en équipe et au partage de connaissances',
  'Résilient',
  'Bonne intelligence relationnelle',
  'Débrouillard',
];
