import Grille from "./grille.js";

// 1 On définit une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES sont chargées
window.onload = () => {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)
  let grille = new Grille(9, 9);
  grille.showCookies();
  tictac();
};

let totalSeconds = 0;
let tictac = function () {
  let tmpsDiv = document.getElementById("tmps");

  totalSeconds++;

  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  tmpsDiv.textContent = `Temps : ${minutes}: ${displaySeconds}`;

  setTimeout(tictac, 1000);
};
