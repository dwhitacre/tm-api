import { expect, test, setSystemTime, beforeEach, afterAll } from "bun:test";
import Leaderboard from "./leaderboard";
import type { JsonObject } from "./json";

beforeEach(() => setSystemTime());
afterAll(() => setSystemTime());

test("should construct with defaults", () => {
  const date = new Date(123);
  setSystemTime(date);
  const player = new Leaderboard();

  expect(player.leaderboardId).toEqual("-1");
  expect(player.name).toEqual("");
  expect(player.lastModified).toEqual(date);
});

test.each([
  [{}, { leaderboardId: "-1", lastModified: new Date(123), name: "" }],
  [
    { leaderboardId: "123" },
    { leaderboardId: "123", lastModified: new Date(123), name: "" },
  ],
  [
    {
      leaderboardId: "123",
      lastModified: "2020-01-01T00:00:00.000",
      name: "abc",
    },
    {
      leaderboardId: "123",
      lastModified: new Date("2020-01-01T00:00:00.000Z"),
      name: "abc",
    },
  ],
])("should create fromJson", (json: JsonObject, expected: JsonObject) => {
  setSystemTime(expected.lastModified);
  const leaderboard = Leaderboard.fromJson(json);

  expect(leaderboard.leaderboardId).toEqual(expected.leaderboardId);
  expect(leaderboard.name).toEqual(expected.name);
  expect(leaderboard.lastModified).toEqual(expected.lastModified);
});

test.each([null, undefined])("should throw fromJson", (json: unknown) => {
  setSystemTime(new Date());
  expect(() => Leaderboard.fromJson(json as JsonObject)).toThrowError();
});
