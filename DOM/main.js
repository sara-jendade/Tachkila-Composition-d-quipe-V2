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