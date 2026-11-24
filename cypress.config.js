const { defineConfig } = require("cypress");
const fs = require("node:fs");
const path = require("node:path");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envPath);
}

module.exports = defineConfig({
  e2e: {
    projectId: "ejionw",
    video: true,
    videoCompression: 32,
    pageLoadTimeout: 90000,
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 800,
    retries: { runMode: 1, openMode: 0 },
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1,
    env: {
      baseUrl: "https://cartes.gouv.fr/explorer-les-cartes/",
      prodUrl: "https://cartes.gouv.fr/explorer-les-cartes/",
      editorUrl: "https://cartes.gouv.fr/creer-une-carte/",
      username: process.env.CYPRESS_USERNAME,
      password: process.env.CYPRESS_PASSWORD,
    },
    setupNodeEvents(on, config) {
      // Les variables d'environnement (.env / CI) priment sur cypress.env.json
      if (process.env.CYPRESS_USERNAME) config.env.username = process.env.CYPRESS_USERNAME
      if (process.env.CYPRESS_PASSWORD) config.env.password = process.env.CYPRESS_PASSWORD
      return config
    },
  },
});
