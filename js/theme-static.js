// Farbschema für statische Unterseiten (z. B. datenschutz.html) wie in der App.
// Liegt als eigene Datei vor, weil die Content-Security-Policy keine Inline-Skripte erlaubt.
try {
    const t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
} catch (e) { /* Speicher nicht verfügbar */ }
