import SectionHead from "../components/SectionHead.jsx";
import { T } from "../components/Tip.jsx";
import ScrollReveal from "../components/rb/ScrollReveal.jsx";
import CountUp from "../components/rb/CountUp/CountUp.jsx";
import { PROJECTS, HTB_MACHINES, RNCP_URL } from "../data.js";

export default function Profil() {
  return (
    <section id="profil" className="section">
      <SectionHead num="01" kicker="qui je suis" title="Profil" />

      <div className="profile-grid">
        <div className="profile-text" data-reveal>
          <p>
            Je suis en formation d'<strong>expert en architecture informatique</strong> (Bac+5,{" "}
            <a className="ext" href={RNCP_URL} target="_blank" rel="noopener">RNCP 39774 ↗</a>) à l'École 42 Le Havre depuis octobre 2025.
            Je viens du <strong>C</strong>, et c'est là que je me sens chez moi : pointeurs, <T>gestion mémoire</T>,{" "}
            <T>appels système</T>, <T>processus</T>, <T>IPC</T>. J'ai appris en <strong>reconstruisant les outils</strong> plutôt
            qu'en lisant la théorie : un <T>shell</T>, une <T>libc</T> en <T>assembleur</T>, un moniteur système qui lit{" "}
            <code><T>/proc</T></code>, un gestionnaire de mots de passe chiffré.
          </p>
          <p>
            Cette base bas niveau m'a naturellement mené vers la <strong>cybersécurité</strong> : comprendre comment un programme
            tourne vraiment, c'est comprendre comment il casse. Je documente ma progression sur <T>Hack The Box</T> et je construis
            mes propres outils de sécurité, comme un gestionnaire de mots de passe chiffré (<T>Argon2id</T> + <T>XChaCha20-Poly1305</T>).
          </p>
          <p>
            J'aime travailler en équipe et partager ce que j'apprends. Hors écran : escalade, musculation, échecs, et 7 ans de
            conservatoire en musique classique.
          </p>
        </div>

        <div className="profile-side">
          <div className="objective" data-reveal>
            <p className="obj-label">Objectif actuel</p>
            <p className="obj-title">Stage / Alternance</p>
            <ul>
              <li><T>Pentest</T> · Sécurité <T>offensive</T> & <T>défensive</T></li>
              <li><T>Reverse engineering</T> · Analyse de binaires</li>
              <li>Développement logiciel C/C++ · Système</li>
              <li>Sécurité applicative · Protection des données</li>
            </ul>
            <p className="obj-foot">Dès janvier 2027 · stage de 6 mois ou alternance</p>
          </div>
          <div className="facts" data-reveal>
            <div className="fact"><b>Bac+<CountUp to={5} duration={1.2} /></b><span>RNCP 39774</span></div>
            <div className="fact"><b><CountUp to={PROJECTS.length} duration={1.6} /></b><span>Projets</span></div>
            <div className="fact"><b><CountUp to={HTB_MACHINES.length} duration={1.2} /></b><span>Machines HTB</span></div>
            <div className="fact"><b><CountUp from={2000} to={2027} duration={1.8} /></b><span>Dispo janvier</span></div>
          </div>
        </div>
      </div>

      <ScrollReveal
        containerClassName="quote"
        textClassName="quote-text"
        baseOpacity={0.12}
        blurStrength={6}
        baseRotation={0}
        highlightColor="#c8ff00"
        wordAnimationEnd="center center"
      >
        « Les livres c'est bien, mais casser et construire des trucs, c'est beaucoup plus fun. »
      </ScrollReveal>
    </section>
  );
}
