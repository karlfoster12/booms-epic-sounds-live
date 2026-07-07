require("dotenv").config();

const KickService = require("./services/KickService");
const GitHubService = require("./services/GitHubService");
const LivestreamService = require("./services/LiveStreamService");

const CHECK_INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS || 60000);

const kickService = new KickService();
const githubService = new GitHubService();
const livestreamService = new LivestreamService(kickService, githubService);

async function runOnce() {
  await livestreamService.checkAndUpdate();
}

async function main() {
  const once = process.argv.includes("--once");

  if (once) {
    await runOnce();
    return;
  }

  await runOnce();

  setInterval(() => {
    runOnce().catch((error) => {
      console.error("Livestream check failed:", error);
    });
  }, CHECK_INTERVAL_MS);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
