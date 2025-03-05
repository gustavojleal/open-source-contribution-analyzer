import axios from "axios";
import { Contributor, GitHubUser, RepositoryData } from "../types";
import { getTotalPagesFromLinkHeader } from "../utils/tools";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: process.env.REACT_APP_GITHUB_TOKEN
      ? `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
      : "",
    Accept: "application/vnd.github.v3+json",
  },
});

const cache: { [key: string]: any } = {};

type PaginationParams = {
  page?: number;
  per_page?: number;
};

type ContributorsResponse = {
  contributorsData: Contributor[];
  totalPages: number;
  ownerFollowers: number;
};

const fetchUserDetails = async (username: string): Promise<GitHubUser> => {
  const cacheKey = `user_${username}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const { data } = await githubApi.get<GitHubUser>(`/users/${username}`);
  cache[cacheKey] = data;
  return data;
};

export const fetchRepository = async (
  owner: string,
  repo: string
): Promise<RepositoryData> => {
  const cacheKey = `repo_${owner}_${repo}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const { data } = await githubApi.get(`/repos/${owner}/${repo}`);
  cache[cacheKey] = data;
  return data;
};

export const fetchContributors = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
): Promise<ContributorsResponse> => {
  const cacheKey = `contributors_${owner}_${repo}_page_${page}_perPage_${perPage}`;
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const [contributorsRes, ownerRes] = await Promise.all([
      githubApi.get(`/repos/${owner}/${repo}/contributors`, {
        params: { page, per_page: perPage } as PaginationParams,
      }),
      githubApi.get<GitHubUser>(`/users/${owner}`),
    ]);

    const contributorsData = await Promise.all(
      contributorsRes.data.map(async (contributor: Contributor) => ({
        ...contributor,
        ...(await fetchUserDetails(contributor.login)),
      }))
    );

    const response = {
      contributorsData,
      totalPages: getTotalPagesFromLinkHeader(contributorsRes.headers.link),
      ownerFollowers: ownerRes.data.followers,
    };

    cache[cacheKey] = response;
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 403 &&
        error.response.headers["x-ratelimit-remaining"] === "0"
      ) {
        throw new Error("Rate limit exceeded. Use a personal access token.");
      }
      throw new Error(error.message);
    }
    throw new Error("Unknown error in the request");
  }
};
