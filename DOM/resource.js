export function afficherheader(danspages, pageactive) {
    const racine = danspages ? "../" : "./";
    const liens = [
        ["effectif", "Effectif", racine + "index.html"],
        ["composition", "Composition", racine + "pages/composition.html"],
        ["matches", "Matchs", racine + "pages/matches.html"]
    ];

    const header = document.createElement("header");
    header.className = "site-header";

    const logo = document.createElement("a");
    logo.className = "logo";
    logo.href = racine + "index.html";
    logo.textContent = "TACHKILA";

    const liste = document.createElement("ul");
    liste.className = "nav-list";

    liens.forEach((lien) => {
        const item = document.createElement("li");
        const a = document.createElement("a");
        a.href = lien[2];
        a.textContent = lien[1];
        if (lien[0] === pageactive) a.classList.add("active");
        item.append(a);
        liste.append(item);
    });

    const nav = document.createElement("nav");
    nav.append(liste);
    header.append(logo, nav);
    document.getElementById("header").replaceChildren(header);
}

export function gererposition(joueur, position) {
    if (!position) return "";

    const positions = {
        GB: ["GB"],
        DEF: ["DG", "DC1", "DC2", "DD"],
        MIL: ["MG", "MC1", "MC2", "MD"],
        ATT: ["BU1", "BU2"]
    };

    const classes = {
        GB: "Gardien",
        DG:     "Défenseur-gauche",
        DC1:    "Défenseur-central-1",
        DC2:    "Défenseur-central-2",
        DD:     "Défenseur-droit",
        MG:     "Milieu-gauche",
        MC1:    "Milieu-central-1",
        MC2:    "Milieu-central-2",
        MD:     "Milieu-droit",
        BU1:    "Buteur-1",
        BU2:    "Buteur-2"
    };

    return positions[joueur.poste]?.includes(position) ? classes[position] : false;
}

export function affichererreur(champ, message) {
    document.getElementById(champ.id + "-erreur").textContent = message;
}

export function affichermessage(texte) {
    document.getElementById("message").textContent = texte;
}

export function creerbouton(texte, action, index, classe) {
    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = texte;
    bouton.className = classe;
    bouton.dataset.action = action;
    bouton.dataset.index = index;
    return bouton;
}

export function activerfermeturemodal(modal, boutons) {
    boutons.forEach((bouton) => {
        bouton.addEventListener("click", () => modal.hidden = true);
    });
    modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.hidden = true;
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") modal.hidden = true;
    });
}

export function demanderconfirmation(action) {
    const zone = document.getElementById("confirmation");

    const texte = document.createElement("p");
    texte.textContent = "Voulez-vous vraiment supprimer cet élément ?";

    const confirmer = creerbouton("Confirmer", "confirmer", 0, "small-button danger");
    confirmer.addEventListener("click", () => {
        zone.replaceChildren();
        action();
    });

    const annuler = creerbouton("Annuler", "annuler", 0, "small-button");
    annuler.addEventListener("click", () => zone.replaceChildren());

    zone.replaceChildren(texte, confirmer, annuler);
}
