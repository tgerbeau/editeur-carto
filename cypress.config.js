const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "6fk98d",
    env: {
      baseUrl: "https://ignf.github.io/cartes.gouv.fr-editeur-carto/"
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
