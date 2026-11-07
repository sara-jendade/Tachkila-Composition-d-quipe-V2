export function afficherHeader() {
    const header = document.getElementById("header");
    if (!header) return;

    header.innerHTML = `
        <header class="flex flex-wrap items-center justify-between gap-4 rounded border border-red-500 p-5">
            <h1 class="text-xl font-bold text-red-500">TACHKILA</h1>
            <nav aria-label="Navigation principale">
                <ul class="flex flex-wrap gap-5">
                    <li><a href="effectif.html">Effectif</a></li>
                    <li><a href="composition.html">Composition</a></li>
                    <li><a href="matches.html">Matchs</a></li>
                </ul>
            </nav>
        </header>
    `;
}