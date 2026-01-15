import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";
const NB_COOCKIES = 6;

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  cookieSelectionnes = [];
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  constructor(l, c) {
    this.c = c;
    this.l = l;

    this.tabcookies = this.remplirTableauDeCookies(NB_COOCKIES);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.c);
      let colonne = index % this.c;

      let cookie = this.tabcookies[ligne][colonne];
      let img = cookie.htmlImage;

      this.ajouteEcouteurAuCookie(cookie);
      div.appendChild(img);
    });
  }

  // inutile ?
  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }

  #detecteAlignementsGenerique(limit, getCookieFunc) {
    let res = [];
    if (limit === 0) return res;

    let firstCookie = getCookieFunc(0);
    let currentType = firstCookie ? firstCookie.type : null;
    let currentCount = 1;

    for (let i = 1; i <= limit; i++) {
      let current = i < limit ? getCookieFunc(i) : null;
      let type = current ? current.type : null;

      if (type !== null && type === currentType) {
        currentCount++;
      } else {
        if (currentCount >= 3 && currentType !== null) {
          for (let k = i - currentCount; k < i; k++) {
            res.push(getCookieFunc(k));
          }
        }
        if (current) {
          currentType = current.type;
          currentCount = 1;
        } else {
          currentType = null;
          currentCount = 0;
        }
      }
    }
    return res;
  }

  detecteAlignementsLigne(ligne) {
    return this.#detecteAlignementsGenerique(this.c, (colIndex) => {
      return this.tabcookies[ligne][colIndex];
    });
  }

  detecteAlignementsColonnes(colonne) {
    return this.#detecteAlignementsGenerique(this.l, (rowIndex) => {
      return this.tabcookies[rowIndex][colonne];
    });
  }

  detecteAlignementsGrille() {
    let res = [];
    _.range(0, this.c).forEach((c) => {
      res.push(...this.detecteAlignementsColonnes(c));
    });
    _.range(0, this.l).forEach((l) => {
      res.push(...this.detecteAlignementsLigne(l));
    });
    return [...new Set(res)];
  }

  gèreChutes() {
    for (let c = 0; c < this.c; c++) {
      let videTrouve = this.l - 1;

      for (let l = this.l - 1; l >= 0; l--) {
        if (this.tabcookies[l][c] !== null) {
          if (l !== videTrouve) {
            this.tabcookies[videTrouve][c] = this.tabcookies[l][c];
            this.tabcookies[l][c] = null;

            let cookie = this.tabcookies[videTrouve][c];
            cookie.ligne = videTrouve;
            cookie.htmlImage.dataset.ligne = videTrouve;

            const targetDivIndex = videTrouve * this.c + c;
            const targetDiv =
              document.querySelectorAll("#grille div")[targetDivIndex];
            targetDiv.appendChild(cookie.htmlImage);
          }

          videTrouve--;
        }
      }
    }
  }

  netoieGrille() {
    const cookiesATuer = this.detecteAlignementsGrille();
    console.log(cookiesATuer);

    if (cookiesATuer.length > 0) {
      console.log(`On a trouvé ${cookiesATuer.length} cookies a tuer.`);
      cookiesATuer.forEach((c) => {
        c.htmlImage.remove();
        this.tabcookies[c.ligne][c.colonne] = null; // Marquer la case comme vide
      });
      this.gèreChutes();
      this.repeupleTableauDeCookies(NB_COOCKIES);
      this.netoieGrille();
    }
  }

  repeupleTableauDeCookies(nbDeCookiesDifferents) {
    let caseDivs = document.querySelectorAll("#grille div");

    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {
        if (this.tabcookies[l][c] === null) {
          const type = Math.floor(Math.random() * nbDeCookiesDifferents);
          const newCookie = new Cookie(type, l, c);
          this.tabcookies[l][c] = newCookie;

          const index = l * this.c + c;
          const targetDiv = caseDivs[index];

          targetDiv.appendChild(newCookie.htmlImage);

          this.ajouteEcouteurAuCookie(newCookie);
        }
      }
    }
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // créer un tableau vide de 9 cases pour une ligne
    // en JavaScript on ne sait pas créer de matrices
    // d'un coup. Pas de new tab[3][4] par exemple.
    // Il faut créer un tableau vide et ensuite remplir
    // chaque case avec un autre tableau vide
    // Faites ctrl-click sur la fonction create2DArray
    // pour voir comment elle fonctionne
    let tab = create2DArray(9);

    // remplir
    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {
        // on génère un nombre aléatoire entre 0 et nbDeCookiesDifferents-1
        const type = Math.floor(Math.random() * nbDeCookiesDifferents);
        // console.log(type);
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  ajouteEcouteurAuCookie(cookie) {
    cookie.htmlImage.onclick = (event) => {
      if (cookie.isSelectionnee()) {
        cookie.deselectionnee();
        this.cookieSelectionnes = [];
        return;
      }

      cookie.selectionnee();
      this.cookieSelectionnes.push(cookie);

      if (this.cookieSelectionnes.length === 2) {
        let [C1, C2] = this.cookieSelectionnes;
        let success = Cookie.swapCookies(C1, C2);

        if (success) {
          this.tabcookies[C1.ligne][C1.colonne] = C1;
          this.tabcookies[C2.ligne][C2.colonne] = C2;
          this.netoieGrille();
        }

        C1.deselectionnee();
        C2.deselectionnee();
        this.cookieSelectionnes = [];
      }
    };
  }
}
