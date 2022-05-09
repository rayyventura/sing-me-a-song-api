import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { recommendation } from "../factories/recommendationsFactory.js";

describe("POST /recommendations ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 201 given a valid body and persist", async () => {
    const response = await supertest(app)
      .post("/recommendations")
      .send(recommendation);

    expect(response.status).toEqual(201);
    const createdRecommendation = await prisma.recommendation.findMany({});
    expect(createdRecommendation.length).toEqual(1);
  });

  it("should return 422 given an invalid body", async () => {
    const firstResponse = await supertest(app).post("/recommendations").send({
      name: "",
      youtubeLink: "",
    });
    const secontResponse = await supertest(app).post("/recommendations").send({
      name: recommendation.name,
    });
    expect(firstResponse.status).toEqual(422);
    expect(secontResponse.status).toEqual(422);
  });
});

describe("POST /recommendations/:id/upvote ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 given a valid body", async () => {
    const createdRecommendation = await prisma.recommendation.create({
      data: recommendation,
    });

    const response = await supertest(app).post(
      `/recommendations/${createdRecommendation.id}/upvote`
    );
    expect(response.status).toEqual(200);
  });
});

describe("POST /recommendations/:id/downvote ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 given a valid recommendation", async () => {
    const createdRecommendation = await prisma.recommendation.create({
      data: recommendation,
    });

    const response = await supertest(app).post(
      `/recommendations/${createdRecommendation.id}/downvote`
    );
    expect(response.status).toEqual(200);
  });
});

describe("GET /recommendations ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 and a list of recommendations", async () => {
    await prisma.recommendation.create({
      data: recommendation,
    });

    const response = await supertest(app).get("/recommendations");
    expect(response.body.length).toEqual(1);
    expect(response.status).toEqual(200);
  });
});

describe("GET /recommendations/:id ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 and a recommendation by id", async () => {
    const createdRecommendation = await prisma.recommendation.create({
      data: recommendation,
    });

    const response = await supertest(app).get(
      `/recommendations/${createdRecommendation.id}`
    );
    expect(response.body).toEqual(createdRecommendation);
  });
});

describe("GET /recommendations/random ", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 and a random recommendation", async () => {
    const createdRecommendation = await prisma.recommendation.create({
      data: { ...recommendation, score: 100 },
    });

    const response = await supertest(app).get("/recommendations/random");
    expect(response.body).toEqual(createdRecommendation);
  });
});

describe("GET /recommendations/top/:amount", () => {
  beforeEach(truncateUsers);
  afterAll(disconnect);

  it("should return status 200 and a list of recommendations ordered by score ", async () => {
    const amount = 4;

    await prisma.recommendation.createMany({
      data: [
        recommendation,
        recommendation,
        { ...recommendation, score: 100 },
        { ...recommendation, score: 50 },
      ],
    });

    const response = await supertest(app).get(`/recommendations/top/${amount}`);
    expect(response.body.length).toEqual(amount);
    expect(response.body[0].score).toEqual(100);
  });
});

async function disconnect() {
  await prisma.$disconnect();
}

async function truncateUsers() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}
