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
      baseUrl: "https://cartes.mut-dev.ign.fr/explorer-les-cartes/",
      prodUrl: "https://cartes.gouv.fr/explorer-les-cartes/",
      editorUrl: "https://cartes.mut-dev.ign.fr/creer-une-carte/",
      username: process.env.CYPRESS_MUT_DEV_USERNAME || process.env.CYPRESS_USERNAME,
      password: process.env.CYPRESS_MUT_DEV_PASSWORD || process.env.CYPRESS_PASSWORD,
      // L'éditeur (creer-une-carte) a son propre compte « Ma carte », distinct du SSO Géoplateforme.
      editorUsername: process.env.CYPRESS_EDITOR_USERNAME,
      editorPassword: process.env.CYPRESS_EDITOR_PASSWORD,
    },
    setupNodeEvents(on, config) {
      // Les variables d'environnement (.env / CI) priment sur cypress.env.json
      // Identifiants MUT_DEV pour mut-dev ; USERNAME/PASSWORD pour la prod (baseUrl surchargé).
      const isMutDev = new URL(config.env.baseUrl).hostname.includes("mut-dev")
      const pick = (mutDev, generic) => (isMutDev ? mutDev || generic : generic || mutDev)
      const username = pick(process.env.CYPRESS_MUT_DEV_USERNAME, process.env.CYPRESS_USERNAME)
      const password = pick(process.env.CYPRESS_MUT_DEV_PASSWORD, process.env.CYPRESS_PASSWORD)
      if (username) config.env.username = username
      if (password) config.env.password = password
      if (process.env.CYPRESS_EDITOR_USERNAME) config.env.editorUsername = process.env.CYPRESS_EDITOR_USERNAME
      if (process.env.CYPRESS_EDITOR_PASSWORD) config.env.editorPassword = process.env.CYPRESS_EDITOR_PASSWORD
      return config
    },
  },
});
