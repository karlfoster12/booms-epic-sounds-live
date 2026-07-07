class LivestreamService {
  constructor(kickService, githubService) {
    this.kickService = kickService;
    this.githubService = githubService;
  }

  async checkAndUpdate() {
    const status = await this.kickService.getLivestreamStatus();

    const livestreamJson = JSON.stringify(status, null, 2) + "\n";

    await this.githubService.updateFile(
      "livestream.json",
      livestreamJson,
      `Update livestream status: ${status.live ? "live" : "offline"}`
    );
  }
}

module.exports = LivestreamService;