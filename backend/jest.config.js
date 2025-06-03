module.exports = {
  roots: ["<rootDir>/__tests__"], // Jest commence les tests ici
  testMatch: ["**/*.test.js"],     // Fichiers de test recherchés
  moduleDirectories: ["node_modules", "game"], // Permet d'importer via `require('...')` sans trop de chemins relatifs
  collectCoverage: true,
  collectCoverageFrom: [
    "game/**/*.js",                // Analyse de couverture pour tout dans /game
    "!**/node_modules/**"
  ],
  coverageReporters: ["text", "lcov"], // Affiche un résumé + génère un rapport HTML dans /coverage
};
