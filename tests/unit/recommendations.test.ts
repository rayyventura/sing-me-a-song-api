import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { jest } from "@jest/globals";
import { recommendationUnit as recommendation } from "../factories/recommendationsFactory.js";

const not_found = {
  message: "",
  type: "not_found",
};

const conflict = {
  message: "Recommendations names must be unique",
  type: "conflict",
};

describe("unitTest /recommendationService/upvote", () => {
  beforeEach(reset);
  it("should throw not found error if it does't find a recommendation", async () => {
    jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

    expect(async () => {
      await recommendationService.upvote(1);
    }).rejects.toEqual(not_found);
  });
});

describe("unitTest /recommendationService/downvote", () => {
  beforeEach(reset);
  it("should delete recommendation if a downvote bring to lower then -5", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValue({ ...recommendation, score: -10 });

    const removeRecommendation = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValue(null);

    await recommendationService.downvote(1);

    expect(removeRecommendation).toHaveBeenCalledTimes(1);
  });

  it("should throw not found error if it does't find a recommendation", async () => {
    jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

    expect(async () => {
      await recommendationService.downvote(1);
    }).rejects.toEqual(not_found);
  });
});
describe("unitTest /recommendationService/insert", () => {
  beforeEach(reset);
  it("should throw conflict error if find recommendation already exists", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValue({ ...recommendation });

    expect(async () => {
      await recommendationService.insert(recommendation);
    }).rejects.toEqual(conflict);
  });
});

describe("unitTest /recommendationService/getByScore", () => {
  beforeEach(reset);
  it("should return recommendations", async () => {
    const recommendations = [
      { ...recommendation, score: 100 },
      { ...recommendation, score: 50 },
      { ...recommendation },
    ];
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue(recommendations);

    const result = await recommendationService.getByScore("gt");

    expect(result).toEqual(recommendations);
  });

  it("should throw not found error if it does't find a recommendation", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([null]);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(not_found);
  });
});

describe("unitTest /recommendationService/getScoreFilter", () => {
  beforeEach(reset);
  it("should return lte if value is higher than 0.7", async () => {
    const result = recommendationService.getScoreFilter(0.8);

    expect(result).toBe("lte");
  });

  it("should return gt if value is lower than 0.7", async () => {
    const result = recommendationService.getScoreFilter(0.6);

    expect(result).toBe("gt");
  });
});

describe("unitTest /recommendationService/getRandom", () => {
  beforeEach(reset);
  it("should throw not found error if it does't find a recommendation", async () => {
    jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
    jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue(null);

    expect(async () => {
      await recommendationService.getRandom();
    }).rejects.toEqual(not_found);
  });
});

function reset() {
  jest.clearAllMocks();
  jest.resetAllMocks();
}
