export function getJoueurs() {
    return JSON.parse(localStorage.getItem("joueurs")) || [];
}

export function sauvegarderJoueurs(joueurs) {
    localStorage.setItem("joueurs", JSON.stringify(joueurs));
}