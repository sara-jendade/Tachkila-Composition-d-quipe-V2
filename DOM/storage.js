const ouvrir = document.getElementById("ouvrir");
const modal = document.getElementById("modal");
const fermer = document.getElementById("fermer");
const annuler = document.getElementById("annuler");
const formulaire = document.getElementById("form-joueur");
const listeJoueurs = document.getElementById("liste-joueurs");
const nombreJoueurs = document.getElementById("nombre-joueurs");
const positionnement = document.getElementById("message-position");
const posting = document.getElementById("message-post");

// TABLEAU DES JOUEURS   

let joueurs = JSON.parse(localStorage.getItem("joueurs")) || [];
let indexModification = -1;

function refStor() {
    localStorage.setItem("joueurs", JSON.stringify(joueurs));
}

function getback() {
    afficherJoueurs();
}

// AJOUTER UN JOUEUR

ouvrir.addEventListener("click", function () {
    indexModification = -1;
    formulaire.reset();

    document.querySelector(".modal-header h2").textContent = "Ajouter un joueur";
    document.querySelector(".btn-ajouter").textContent = "Ajouter";
    modal.hidden = false;
});

// FERMER LE MODAL

fermer.addEventListener("click", function () {
    modal.hidden = true;
});

annuler.addEventListener("click", function () {
    modal.hidden = true;
});

// AJOUTER OU MODIFIER UN JOUEUR

formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    let nom = document.getElementById("nom").value;
    let poste = document.getElementById("poste").value;
    let number = document.getElementById("numero").value;

    let joueur = {
        nom: nom,
        poste: poste,
        number: Number(number),
        position: ""
    };

    if (indexModification === -1) {
        joueurs.push(joueur);
    } else {
        joueur.position = joueurs[indexModification].position;
        joueurs[indexModification] = joueur;
        indexModification = -1;
    }
    refStor();
    afficherJoueurs();

    console.log(joueurs);
    formulaire.reset();
    modal.hidden = true;
});

// AFFICHER LES JOUEURS DANS LA SIDEBAR

function afficherJoueurs() {
    listeJoueurs.innerHTML = "";

    for (let i = 0; i < joueurs.length; i++) {
        let joueur = joueurs[i];

        // CARTE DU JOUEUR

        let carte = document.createElement("div");
        carte.className = "bg-black border border-red-500 rounded-xl p-2 md:p-3 overflow-hidden";

        // INFORMATIONS DU JOUEUR

        let informations = document.createElement("div");
        informations.className = "flex justify-between items-center gap-2 p-2";

        let texte = document.createElement("div");
        texte.className = "min-w-0";

        // NOM EN BLANC ET NUMERO EN ROUGE

        let nomJoueur = document.createElement("strong");
        nomJoueur.className = "text-sm text-white";
        nomJoueur.textContent = joueur.nom;

        let numeroJoueur = document.createElement("span");
        numeroJoueur.className = "text-red-500";
        numeroJoueur.textContent = " -" + joueur.number;
        nomJoueur.appendChild(numeroJoueur);

        // POSTE EN ROUGE

        let posteJoueur = document.createElement("p");
        posteJoueur.className = "text-xs text-red-500";
        posteJoueur.textContent = joueur.poste;
        texte.appendChild(nomJoueur);
        texte.appendChild(posteJoueur);

        // BOUTONS MODIFIER ET SUPPRIMER

        let boutons = document.createElement("div");
        boutons.className = "flex gap-2 shrink-0";
        let modifier = document.createElement("button");

        modifier.type = "button";
        modifier.className = "text-xs text-white hover:text-red-500";
        modifier.textContent = "Modifier";
        modifier.addEventListener("click", function () {
            indexModification = i;

            document.getElementById("nom").value = joueur.nom;
            document.getElementById("poste").value = joueur.poste;
            document.getElementById("numero").value = joueur.number;
            document.querySelector(".modal-header h2").textContent = "Modifier un joueur";
            document.querySelector(".btn-ajouter").textContent = "Enregistrer";
            modal.hidden = false;
        });

        let supprimer = document.createElement("button");

            supprimer.type = "button";
            supprimer.className = "text-xs text-red-500 hover:text-white";
            supprimer.textContent = "Supprimer";
            supprimer.addEventListener("click", function () {
            joueurs.splice(i, 1);

            refStor();
            afficherJoueurs();
        });

        boutons.appendChild(modifier);
        boutons.appendChild(supprimer);

        informations.appendChild(texte);
        informations.appendChild(boutons);

        // POSITION DU JOUEUR

        let zoneSelect = document.createElement("div");
        zoneSelect.className = "mt-2";

        let labelPosition = document.createElement("label");
        labelPosition.className = "block text-xs text-white mb-2";
        labelPosition.textContent = "Position sur le terrain";

        let select = document.createElement("select");
        select.className =
            "w-full bg-black text-white text-xs p-2 rounded border border-[#333333]";

        let options = [
            ["", "Sur le banc"],
            ["GB", "GB - Gardien"],
            ["DG", "DG - Défenseur gauche"],
            ["DC1", "DC - Défenseur central 1"],
            ["DC2", "DC - Défenseur central 2"],
            ["DD", "DD - Défenseur droit"],
            ["MG", "MG - Milieu gauche"],
            ["MC1", "MC - Milieu central 1"],
            ["MC2", "MC - Milieu central 2"],
            ["MD", "MD - Milieu droit"],
            ["BU1", "BU - Buteur 1"],
            ["BU2", "BU - Buteur 2"]
        ];

        for (let j = 0; j < options.length; j++) {

            let option = document.createElement("option");

            option.value = options[j][0];
            option.textContent = options[j][1];
            select.appendChild(option);
        }

        select.value = joueur.position;

        select.addEventListener("change", function () {
            positionnement.hidden = true;
            posting.hidden = true;

            // VERIFIER LE POSTE WAX DYALO

            if (gererPosition(joueur, select.value) === false) {
                maessageofposting();
                select.value = joueur.position;
                return;
            }

            // VERIFIER SI LA POSITION EST OCCUPEE

            let caseOccupee = false;

            for (let j = 0; j < joueurs.length; j++) {
                if (
                    joueurs[j] !== joueur &&
                    joueurs[j].position === select.value &&
                    select.value !== ""
                ) {
                    caseOccupee = true;
                }
            }

            if (caseOccupee) {
                massagesofpositionnement();
                select.value = joueur.position;
                return;
            }

            joueur.position = select.value;

            refStor();
            afficherJoueurs();
        });

        zoneSelect.appendChild(labelPosition);
        zoneSelect.appendChild(select);

        carte.appendChild(informations);
        carte.appendChild(zoneSelect);

        listeJoueurs.appendChild(carte);
    }

    nombreJoueurs.textContent = joueurs.length + " joueur(s)";

    afficherTerrain();
}

// AFFICHER LES JOUEURS SUR LE TERRAIN

function afficherTerrain() {
    
    let cases = document.querySelectorAll(".terrain > div");

    let nomsCases = [
        "Gardien",
        "Défenseur gauche",
        "Défenseur central 1",
        "Défenseur central 2",
        "Défenseur droit",
        "Milieu gauche",
        "Milieu central 1",
        "Milieu central 2",
        "Milieu droit",
        "Buteur 1",
        "Buteur 2"
    ];

    for (let i = 0; i < cases.length; i++) {
        cases[i].innerHTML = "";

        let titre = document.createElement("h3");
        titre.textContent = nomsCases[i];

        cases[i].appendChild(titre);
    }

    for (let i = 0; i < joueurs.length; i++) {
        let joueur = joueurs[i];

        if (joueur.position !== "") {
            let classe = gererPosition(joueur, joueur.position);

            if (classe !== false && classe !== "") {
                let caseJoueur = document.querySelector("." + classe);

                if (caseJoueur !== null) {
                    let texte = document.createElement("p");
                    texte.className = "text-sm text-white";
                    texte.textContent = joueur.nom;

                    let numeroJoueur = document.createElement("span");
                    numeroJoueur.className = "text-red-500";
                    numeroJoueur.textContent = " -" + joueur.number;

                    texte.appendChild(numeroJoueur);
                    caseJoueur.appendChild(texte);
                }
            }
        }
    }
}

// GERER LA POSITION DU JOUEUR

function gererPosition(joueur, position) {
    if (position !== "") {
        if (joueur.poste === "GB" && position !== "GB") {
            return false;
        }

        if (
            joueur.poste === "DEF" &&
            position !== "DG" &&
            position !== "DC1" &&
            position !== "DC2" &&
            position !== "DD"
        ) {
            return false;
        }

        if (
            joueur.poste === "MIL" &&
            position !== "MG" &&
            position !== "MC1" &&
            position !== "MC2" &&
            position !== "MD"
        ) {
            return false;
        }

        if (
            joueur.poste === "ATT" &&
            position !== "BU1" &&
            position !== "BU2"
        ) {
            return false;
        }
    }

    if (position === "GB") return "Gardien";
    if (position === "DG") return "Défenseur-gauche";
    if (position === "DC1") return "Défenseur-central-1";
    if (position === "DC2") return "Défenseur-central-2";
    if (position === "DD") return "Défenseur-droit";
    if (position === "MG") return "Milieu-gauche";
    if (position === "MC1") return "Milieu-central-1";
    if (position === "MC2") return "Milieu-central-2";
    if (position === "MD") return "Milieu-droit";
    if (position === "BU1") return "Buteur-1";
    if (position === "BU2") return "Buteur-2";

    return "";
}

// MESSAGE : POSITION DEJA OCCUPEE

function massagesofpositionnement() {
    positionnement.textContent = "Cette position est déjà occupée !";
    positionnement.className = "message-position";
    positionnement.hidden = false;
}

// MESSAGE : POSTE NON AUTORISE

function maessageofposting() {
    posting.textContent = "Ce joueur ne peut pas jouer à cette position !";
    posting.className = "message-post";
    posting.hidden = false;
}

// CHARGER LES JOUEURS SAUVEGARDES

getback();