import Json, { type JsonObject } from "./json";

type Cache = {};

export class Leaderboard {
  leaderboardId: string = "-1";
  name: string = "";
  lastModified: Date = new Date();

  #cache: Cache = {};

  static fromJson(json: JsonObject): Leaderboard {
    json = Json.lowercaseKeys(json);

    const leaderboard = new Leaderboard();

    if (json.leaderboardid) leaderboard.leaderboardId = json.leaderboardid;
    if (json.name) leaderboard.name = json.name;
    if (json.lastmodified)
      leaderboard.lastModified = new Date(json.lastmodified);

    return leaderboard;
  }

  constructor() {}

  toJson(): JsonObject {
    return {
      leaderboardId: this.leaderboardId,
      name: this.name,
      lastModified: this.lastModified.toISOString(),
    };
  }
}

export default Leaderboard;
