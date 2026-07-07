const { Octokit } = require("@octokit/rest");

class GitHubService {
  constructor() {
    this.owner = process.env.GITHUB_OWNER;
    this.repo = process.env.GITHUB_REPO;
    this.branch = process.env.GITHUB_BRANCH || "main";

    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async getFile(path) {
    const response = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.branch
    });

    const content = Buffer.from(response.data.content, "base64").toString("utf8");

    return {
      sha: response.data.sha,
      content
    };
  }

  async updateFile(path, content, message) {
    const current = await this.getFile(path);

    if (current.content.trim() === content.trim()) {
      console.log(`${path} unchanged.`);
      return false;
    }

    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha: current.sha,
      branch: this.branch
    });

    console.log(`${path} updated.`);
    return true;
  }
}

module.exports = GitHubService;