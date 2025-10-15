const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "f9h5s9",
    env: {
      baseUrl: "https://ignf.github.io/cartes.gouv.fr-editeur-carto/",
      prodUrl: "https://cartes.gouv.fr/cartes/"
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
