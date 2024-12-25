import { expect, test } from "bun:test";
import { faker } from "@faker-js/faker";

const leaderboardGet = (leaderboardId: string) => {
  return fetch(`http://localhost:8081/api/leaderboard/${leaderboardId}`);
};

const leaderboardCreate = ({
  body,
  method = "PUT",
}: {
  body?: any;
  method?: string;
} = {}) => {
  return fetch("http://localhost:8081/api/leaderboard", {
    body: JSON.stringify(body),
    method,
    headers: {
      "x-api-key": "developer-test-key",
    },
  });
};

test("get leaderboard dne", async () => {
  const response = await leaderboardGet("000");
  expect(response.status).toEqual(204);
});

test("create leaderboard no adminkey", async () => {
  const name = faker.word.words(3);
  const response = await fetch("http://localhost:8081/api/leaderboard", {
    body: JSON.stringify({ name }),
    method: "PUT",
  });
  expect(response.status).toEqual(403);
});

test("create leaderboard bad method", async () => {
  const response = await leaderboardCreate({ method: "DELETE" });
  expect(response.status).toEqual(405);
});

test("create leaderboard bad body", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: faker.string.uuid(),
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard no name", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: {},
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual("");
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard", async () => {
  const now = Date.now();
  const name = faker.word.words(3);
  const response = await leaderboardCreate({
    body: { name },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  expect(json.leaderboardId).toBeGreaterThan(0);
  expect(json.name).toEqual(name);
  expect(Date.parse(json.lastModified)).toBeGreaterThan(now);
});

test("create leaderboard repeat is an update", async () => {
  const now = Date.now();
  const response = await leaderboardCreate({
    body: { name: faker.word.words(3) },
  });
  expect(response.status).toEqual(201);

  const json = await response.json();

  const now2 = Date.now();
  const name2 = faker.word.words(3);
  const response2 = await leaderboardCreate({
    body: { leaderboardId: json.leaderboardId, name: name2 },
  });
  expect(response2.status).toEqual(201);

  const json2 = await response2.json();

  expect(json2.leaderboardId).toBeNumber();
  expect(json2.name).toEqual(name2);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(now);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(now2);
  expect(Date.parse(json2.lastModified)).toBeGreaterThan(
    Date.parse(json.lastModified)
  );
  expect(json2.leaderboardId).toEqual(json.leaderboardId);
});
