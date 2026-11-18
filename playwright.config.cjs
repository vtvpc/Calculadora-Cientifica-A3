const { defineConfig } = require("@playwright/test");
// PORT permite rodar os testes mesmo com outro servidor ocupando a 8000.
const port = process.env.PORT || 8000;
module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.cjs",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: `http://127.0.0.1:${port}`, headless: true },
  webServer: {
    command: `python3 -m http.server ${port} --bind 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "ignore",
  },
  reporter: "list",
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
  ],
});
