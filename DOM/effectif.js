import {
    afficherheader,
    affichererreur,
    affichermessage,
    creerbouton,
    activerfermeturemodal,
    demanderconfirmation
} from "./resource.js";

import {
    joueurs,
    sauvegarderjoueurs
} from "./storage.js";


afficherheader(false, "effectif");

const liste = document.getElementById("liste-joueurs");
const modal = document.getElementById("modal-joueur");
const formulaire = document.getElementById("form-joueur");

const titre = document.getElementById("titre-modal");
const boutonformulaire = document.getElementById("bouton-formulaire");

const recherche = document.getElementById("recherche");
const filtreposte = document.getElementById("filtre-poste");
const pagination = document.getElementById("pagination");

const parpage = 8;

let pageactuelle = 1;
let indexModification = -1;


const champs = {
    nom: document.getElementById("nom"),
    poste: document.getElementById("poste"),
    numero: document.getElementById("numero"),
    age: document.getElementById("age"),
    statut: document.getElementById("statut")
};


function validerchamp(champ) {

    const valeur = champ.value.trim();
    let erreur = "";

    if (champ === champs.nom) {

        if (valeur.length < 3 || valeur.length > 30) {
            erreur = "Le nom doit contenir entre 3 et 30 caractères.";
        }
    }

    if (champ === champs.poste) {

        if (valeur === "") {
            erreur = "Choisissez un poste.";
        }

        if (valeur === "GB") {

            let nombreGardiens = 0;

            for (let i = 0; i < joueurs.length; i++) {

                if (joueurs[i].poste === "GB" && i !== indexModification) {
                    nombreGardiens++;
                }
            }

            if (nombreGardiens >= 2) {
                erreur = "Il y a déjà 2 gardiens.";
            }
        }
    }

    if (champ === champs.numero) {

        const numero = Number(valeur);

        if (numero < 1 || numero > 99 || !Number.isInteger(numero)) {
            erreur = "Le numéro doit être entre 1 et 99.";
        }

        for (let i = 0; i < joueurs.length; i++) {

            if (joueurs[i].numero === numero && i !== indexModification) {
                erreur = "Ce numéro est déjà utilisé.";
            }
        }
    }

    if (champ === champs.age) {

        const age = Number(valeur);

        if (age < 18 || age > 39 || !Number.isInteger(age)) {
            erreur = "L'âge doit être entre 18 et 39 ans.";
        }
    }

    affichererreur(champ, erreur);

    return erreur === "";
}


function ouvrirmodal(index) {

    indexModification = index;

    formulaire.reset();

    affichererreur(champs.nom, "");
    affichererreur(champs.poste, "");
    affichererreur(champs.numero, "");
    affichererreur(champs.age, "");
    affichererreur(champs.statut, "");

    if (index === -1) {

        titre.textContent = "Ajouter un joueur";
        boutonformulaire.textContent = "Ajouter";

    } else {

        const joueur = joueurs[index];

        titre.textContent = "Modifier un joueur";
        boutonformulaire.textContent = "Enregistrer";

        champs.nom.value = joueur.nom;
        champs.poste.value = joueur.poste;
        champs.numero.value = joueur.numero;
        champs.age.value = joueur.age;
        champs.statut.value = joueur.statut;
    }

    modal.hidden = false;
}


function creercarte(joueur, index) {

    const carte = document.createElement("article");

    carte.className = "player-card poste-" + joueur.poste;

    if (joueur.capitaine === true) {
        carte.classList.add("capitaine");
    }

    const nom = document.createElement("h3");
    nom.textContent = joueur.nom + " #" + joueur.numero;

    const detail = document.createElement("p");
    detail.textContent = joueur.poste + " - " + joueur.age + " ans";

    const statut = document.createElement("span");
    statut.className = "status " + joueur.statut;
    statut.textContent = joueur.statut;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    actions.append(
        creerbouton("Capitaine", "capitaine", index, "small-button"),
        creerbouton("Modifier", "modifier", index, "small-button"),
        creerbouton("Supprimer", "supprimer", index, "small-button danger")
    );

    const haut = document.createElement("div");
    haut.className = "player-top";

    haut.append(nom, detail, statut, actions);

    carte.append(haut);

    return carte;
}


function afficherjoueurs() {

    liste.replaceChildren();

    const terme = recherche.value.toLowerCase().trim();
    const poste = filtreposte.value;

    const resultats = [];

    for (let i = 0; i < joueurs.length; i++) {

        const joueur = joueurs[i];

        if (
            (joueur.nom.toLowerCase().includes(terme) ||
            String(joueur.numero).includes(terme)) &&
            (poste === "" || joueur.poste === poste)
        ) {
            resultats.push(joueur);
        }
    }

    let totalpages = Math.ceil(resultats.length / parpage);

    if (totalpages === 0) {
        totalpages = 1;
    }

    if (pageactuelle > totalpages) {
        pageactuelle = totalpages;
    }

    const debut = (pageactuelle - 1) * parpage;
    const fin = debut + parpage;

    for (let i = debut; i < fin && i < resultats.length; i++) {

        const joueur = resultats[i];
        const index = joueurs.indexOf(joueur);

        const carte = creercarte(joueur, index);

        liste.append(carte);
    }

    pagination.replaceChildren();

    for (let i = 1; i <= totalpages; i++) {

        const bouton = document.createElement("button");

        bouton.type = "button";
        bouton.textContent = i;

        if (i === pageactuelle) {
            bouton.className = "page-button active";
        } else {
            bouton.className = "page-button";
        }

        bouton.addEventListener("click", function() {
            pageactuelle = i;
            afficherjoueurs();
        });

        pagination.append(bouton);
    }

    let enforme = 0;

    for (let i = 0; i < joueurs.length; i++) {

        if (joueurs[i].statut === "forme") {
            enforme++;
        }
    }

    document.getElementById("nombre-joueurs").textContent =
        resultats.length + " joueur(s)";

    document.getElementById("statistiques").textContent =
        enforme + " en forme · " +
        (joueurs.length - enforme) + " blessé(s)";
}


formulaire.addEventListener("submit", function(event) {

    event.preventDefault();

    let valide = true;

    if (!validerchamp(champs.nom)) valide = false;
    if (!validerchamp(champs.poste)) valide = false;
    if (!validerchamp(champs.numero)) valide = false;
    if (!validerchamp(champs.age)) valide = false;

    if (!valide) {
        return;
    }

    const joueur = {

        nom: champs.nom.value.trim(),
        poste: champs.poste.value,
        numero: Number(champs.numero.value),
        age: Number(champs.age.value),
        statut: champs.statut.value,
        capitaine: false,
        position: ""
    };


    if (indexModification === -1) {

        joueurs.push(joueur);

        pageactuelle = Math.ceil(joueurs.length / parpage);

        affichermessage("Joueur ajouté avec succès.");

    } else {

        const ancien = joueurs[indexModification];

        joueur.capitaine = ancien.capitaine;
        joueur.position = ancien.position;

        joueurs[indexModification] = joueur;

        affichermessage("Joueur modifié avec succès.");
    }

    sauvegarderjoueurs();

    modal.hidden = true;

    afficherjoueurs();
});


liste.addEventListener("click", function(event) {

    const bouton = event.target.closest("button");

    if (!bouton) {
        return;
    }

    const index = Number(bouton.dataset.index);
    const action = bouton.dataset.action;


    if (action === "modifier") {

        ouvrirmodal(index);
    }


    if (action === "supprimer") {

        demanderconfirmation(function() {

            joueurs.splice(index, 1);

            sauvegarderjoueurs();

            affichermessage("Joueur supprimé.");

            afficherjoueurs();
        });
    }


    if (action === "capitaine") {

        for (let i = 0; i < joueurs.length; i++) {
            joueurs[i].capitaine = false;
        }

        sauvegarderjoueurs();

        affichermessage("Nouveau capitaine désigné.");

        afficherjoueurs();
    }

});



    

recherche.addEventListener("input", function() {

    pageactuelle = 1;

    afficherjoueurs();
});


filtreposte.addEventListener("change", function() {

    pageactuelle = 1;

    afficherjoueurs();
});


document.getElementById("ouvrir").addEventListener("click", function() {

    ouvrirmodal(-1);
});


activerfermeturemodal(modal, [
    document.getElementById("fermer"),
    document.getElementById("annuler")
]);


champs.nom.addEventListener("input", function() {
    validerchamp(champs.nom);
});

champs.poste.addEventListener("change", function() {
    validerchamp(champs.poste);
});

champs.numero.addEventListener("input", function() {
    validerchamp(champs.numero);
});

champs.age.addEventListener("input", function() {
    validerchamp(champs.age);
});


afficherjoueurs();
