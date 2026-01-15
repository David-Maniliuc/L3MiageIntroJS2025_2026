export default class Cookie {
  ligne = 0;
  colonne = 0;
  type = 0;
  htmlImage = undefined;

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;

    // On récupère l'URL de l'image correspondant au type
    // qui est un nombre entre 0 et 5
    const url = Cookie.urlsImagesNormales[type];

    // On crée une image HTML avec l'API du DOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    // pour pouvoir récupérer la ligne et la colonne
    // quand on cliquera sur une image et donc à partir
    // de cette ligne et colonne on pourra récupérer le cookie
    // On utilise la dataset API du DOM, qui permet de stocker
    // des données arbitraires dans un élément HTML
    img.dataset.ligne = ligne;
    img.dataset.colonne = colonne;

    // On stocke l'image dans l'objet cookie
    this.htmlImage = img;
  }

  isSelectionnee() {
    // on regarde si l'image a la classe CSS "cookies-selected"
    return this.htmlImage.classList.contains("cookies-selected");
  }

  selectionnee() {
    // On change la source de l'image par la version surlignée
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];

    // On ajoute la classe CSS
    this.htmlImage.classList.add("cookies-selected");
  }

  deselectionnee() {
    // On remet l'image normale
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];

    // On retire la classe CSS
    this.htmlImage.classList.remove("cookies-selected");
  }

  static swapCookies(c1, c2) {
    console.log("On essaie SWAP C1 C2");

    // On regarde la distance entre les deux cookies
    // si elle est de 1, on peut les swapper
    if (this.distance(c1, c2) !== 1) {
      console.log("On de peut pas SWAP C1 et C2");
      return false;
    }
    let tempL = c1.ligne;
    let tempC = c1.colonne;

    c1.ligne = c2.ligne;
    c1.colonne = c2.colonne;
    c2.ligne = tempL;
    c2.colonne = tempC;

    c1.htmlImage.dataset.ligne = c1.ligne;
    c1.htmlImage.dataset.colonne = c1.colonne;
    c2.htmlImage.dataset.ligne = c2.ligne;
    c2.htmlImage.dataset.colonne = c2.colonne;

    const div1 = c1.htmlImage.parentNode;
    const div2 = c2.htmlImage.parentNode;

    div1.appendChild(c2.htmlImage);
    div2.appendChild(c1.htmlImage);
    return true;
  }

  /** renvoie la distance au sens "nombre de cases"
   * entre deux cookies. Servira pour savoir si on peut
   * swapper deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.abs(l1 - l2) + Math.abs(c1 - c2);
    console.log(`Distance = ${distance}`);
    return distance;
  }
}
