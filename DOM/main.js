function afficherHeader() {
    document.getElementById("header").innerHTML = `
        <header class="flex items-center justify-between rounded border border-red-500 p-5">
            <h1 class="text-xl font-bold text-red-500">TACHKILA</h1>

            <nav>
                <ul class="flex gap-5">
                    <li><a href="effectif.html">Effectif</a></li>
                    <li><a href="composition.html">Compositions</a></li>
                    <li><a href="matches.html">Matchs</a></li>
                </ul>
            </nav>
        </header>
    `;
}

afficherHeader();

const ouvrir = document.getElementById("ouvrir");
const fermer = document.getElementById("fermer");
const annuler = document.getElementById("annuler");
const modal = document.getElementById("modal");

ouvrir.addEventListener("click", () => {
    modal.hidden = false;
});

fermer.addEventListener("click", () => {
    modal.hidden = true;
});

annuler.addEventListener("click", () => {
    modal.hidden = true;
});