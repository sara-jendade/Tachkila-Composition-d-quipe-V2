export let joueurs = JSON.parse(localStorage.getItem("joueurs")) || [];
export let matchs = JSON.parse(localStorage.getItem("matchs")) || [];

export function sauvegarderjoueurs() {
    localStorage.setItem("joueurs", JSON.stringify(joueurs));
}

export function sauvegardermatchs() {
    localStorage.setItem("matchs", JSON.stringify(matchs));
}
