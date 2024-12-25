import type { Db } from "./db";
import { Leaderboard } from "../domain/leaderboard";

export class LeaderboardService {
  db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(
    leaderboardId: Leaderboard["leaderboardId"]
  ): Promise<Leaderboard | undefined> {
    const result = await this.db.selectOne(
      `
        select l.LeaderboardId, l.Name, l.LastModified
        from Leaderboard l
        where l.LeaderboardId = $1
      `,
      [leaderboardId]
    );

    return result ? Leaderboard.fromJson(result) : result;
  }

  async insert(leaderboard: Leaderboard) {
    if (leaderboard.leaderboardId !== "-1")
      throw Error("Skipping insert since leaderboardId was provided.");
    return this.db.insert(
      `
        insert into Leaderboard (Name)
        values ($1)
      `,
      [leaderboard.name]
    );
  }

  async update(leaderboard: Leaderboard) {
    return this.db.update(
      `
        update Leaderboard
        set Name=$2, LastModified=now()
        where LeaderboardId=$1
      `,
      [leaderboard.leaderboardId, leaderboard.name]
    );
  }

  async upsert(leaderboard: Leaderboard) {
    const result = await this.db.upsert(
      this.insert.bind(this),
      this.update.bind(this),
      leaderboard
    );
    return Leaderboard.fromJson(result.rows[0]);
  }
}

export default (db: Db) => new LeaderboardService(db);
