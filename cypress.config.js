const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    projectId: "6fk98d",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
