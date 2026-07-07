const axios = require("axios");

class KickService {
  constructor() {
    this.channel = process.env.KICK_CHANNEL || "BoomEpicKill";
    this.clientId = process.env.KICK_CLIENT_ID;
    this.clientSecret = process.env.KICK_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const response = await axios.post(
      "https://id.kick.com/oauth/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiresAt = Date.now() + ((response.data.expires_in - 60) * 1000);

    return this.accessToken;
  }

  async getLivestreamStatus() {
    const token = await this.getAccessToken();

    const response = await axios.get("https://api.kick.com/public/v1/channels", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        slug: this.channel
      }
    });

    const channel = response.data?.data?.[0];

    if (!channel) {
    return {
        enabled: true,
        live: false,
        title: "",
        category: "",
        message: "",
        wentLiveAt: ""
    };
}

const stream = channel.stream;
const isLive = stream?.is_live === true;

    console.log(JSON.stringify(response.data, null, 2));

    return {
  enabled: true,
  live: isLive,
  title: isLive ? channel.stream_title : "",
  category: isLive ? channel.category?.name ?? "" : "",
  message: isLive
    ? `BoomEpicKill is live: ${channel.stream_title}`
    : "",
  wentLiveAt: isLive ? stream.start_time : ""
};
  }
}

module.exports = KickService;