import { afficherheader, gererposition } from "./resource.js";
import { joueurs, sauvegarderjoueurs } from "./storage.js";

afficherheader(true, "composition");

const liste = document.getElementById("liste-composition");
const cases = document.querySelectorAll(".terrain > div");
const message = document.getElementById("message-composition");



const noms = [
    "Gardien", "Défenseur gauche", "Défenseur central 1",
    "Défenseur central 2", "Défenseur droit", "Milieu gauche",
    "Milieu central 1", "Milieu central 2", "Milieu droit",
    "Buteur 1", "Buteur 2"
];

const positions = [
    ["", "Sur le banc"], ["GB", "GB - Gardien"],
    ["DG", "DG - Défenseur gauche"], ["DC1", "DC - Défenseur central 1"],
    ["DC2", "DC - Défenseur central 2"], ["DD", "DD - Défenseur droit"],
    ["MG", "MG - Milieu gauche"], ["MC1", "MC - Milieu central 1"],
    ["MC2", "MC - Milieu central 2"], ["MD", "MD - Milieu droit"],
    ["BU1", "BU - Buteur 1"], ["BU2", "BU - Buteur 2"]
];

function affichermessage(texte) {
    message.textContent = texte;
}

function afficherterrain() {
    cases.forEach((casejoueur, index) => {
        const titre = document.createElement("h3");
        titre.textContent = noms[index];
        casejoueur.replaceChildren(titre);
    });

    joueurs.forEach((joueur) => {
        if (!joueur.position || joueur.statut === "blesse") return;

        const classe = gererposition(joueur, joueur.position);
        if (!classe) return;

        const cible = document.querySelector("." + classe);
        if (!cible) return;

        const texte = document.createElement("p");
        texte.textContent = joueur.nom + " #" + joueur.numero;
        cible.append(texte);
    });
}

function afficherliste() {
    liste.replaceChildren();

    joueurs.forEach((joueur, index) => {
        const carte = document.createElement("article");
        carte.className = "composition-card";

        const nom = document.createElement("strong");
        nom.textContent = joueur.nom + " #" + joueur.numero;

        const detail = document.createElement("p");
        detail.textContent = joueur.poste + " · " + (joueur.statut === "forme" ? "En forme" : "Blessé");

        const label = document.createElement("label");
        label.textContent = "Position sur le terrain";
        label.htmlFor = "position-" + index;

        const select = document.createElement("select");
        select.id = "position-" + index;
        select.dataset.index = index;

        positions.forEach((position) => {
            const option = document.createElement("option");
            option.value = position[0];
            option.textContent = position[1];
            select.append(option);
        });

        if (joueur.statut === "blesse") {
            select.disabled = true;
            joueur.position = "";
        } else {
            select.value = joueur.position || "";
        }

        carte.append(nom, detail, label, select);
        liste.append(carte);
    });
}

liste.addEventListener("change", (event) => {
    if (!event.target.matches("select[data-index]")) return;

    const index = Number(event.target.dataset.index);
    const joueur = joueurs[index];
    const nouvelleposition = event.target.value;

    if (joueur.statut === "blesse") return;

    const classe = gererposition(joueur, nouvelleposition);
    if (classe === false) {
        event.target.value = joueur.position || "";
        affichermessage("Ce joueur ne peut pas jouer à cette position.");
        return;
    }

    const occupee = joueurs.some((autre, i) =>
        i !== index && autre.position === nouvelleposition && nouvelleposition !== ""
    );

    if (occupee) {
        event.target.value = joueur.position || "";
        affichermessage("Cette position est déjà occupée.");
        return;
    }

    joueur.position = nouvelleposition;
    sauvegarderjoueurs();
    affichermessage("");
    afficherterrain();
});

function nettoyerpositions() {
    joueurs.forEach((joueur) => {
        if (joueur.statut === "blesse" || !gererposition(joueur, joueur.position)) {
            joueur.position = "";
        }
    });
    sauvegarderjoueurs();
}

nettoyerpositions();
afficherliste();
afficherterrain();
