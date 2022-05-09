import { Recommendation } from "@prisma/client";

type CreateRecommendationData = Omit<Omit<Recommendation, "id">, "score">;

export const recommendation: CreateRecommendationData = {
  name: "Ghost",
  youtubeLink: "https://www.youtube.com/watch?v=Fp8msa5uYsc",
};
export const recommendationUnit: Recommendation = {
  id: 1,
  name: "Ghost",
  youtubeLink: "https://www.youtube.com/watch?v=Fp8msa5uYsc",
  score: 0,
};
