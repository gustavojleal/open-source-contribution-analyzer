import axios from "axios";
import { Contributor, RepositoryData } from "../types";

export const getTotalPagesFromLinkHeader = (
  linkHeader: string | null
): number => {
  if (!linkHeader) return 1;
  const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
  return lastPageMatch ? parseInt(lastPageMatch[1], 10) : 1;
};

export const getTopItems = (
  contributors: Contributor[],
  key: keyof Contributor,
  topN: number
) => {
  const itemCounts: { [key: string]: number } = {};

  contributors.forEach((contributor) => {
    const item = contributor[key];
    if (item) {
      if (!itemCounts[item]) {
        itemCounts[item] = 0;
      }
      itemCounts[item] +=
        key === "contributions" ? contributor.contributions : 1;
    }
  });

  return Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN);
};

export const getTopCompanies = (contributors: Contributor[], topN: number) => {
  return getTopItems(contributors, "company", topN);
};

export const getTopLocations = (contributors: Contributor[], topN: number) => {
  return getTopItems(contributors, "location", topN);
};

export const handleError = (
  error: unknown,
  setError: (message: string | null) => void
) => {
  if (axios.isAxiosError(error)) {
    setError(
      error.response?.status === 404
        ? "Repository not found"
        : "API rate limit exceeded or network error"
    );
  } else {
    setError("An unexpected error occurred");
  }
};

export const resetState = (
  setRepository: (repository: RepositoryData | null) => void,
  setContributors: (contributors: Contributor[]) => void,
  setCurrentPage: (page: number) => void,
  setTotalPages: (pages: number) => void,
  setError: (message: string | null) => void
) => {
  setRepository(null);
  setContributors([]);
  setCurrentPage(1);
  setTotalPages(1);
  setError(null);
};
