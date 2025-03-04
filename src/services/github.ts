import axios from "axios";
import { Contributor } from "../types";

const GITHUB_API = "https://api.github.com";
const token = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
  Authorization: token ? `Bearer ${token}` : "",
  Accept: "application/vnd.github.v3+json",
};

export const fetchRepository = async (owner: string, repo: string) => {
  try {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fetchContributors = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
): Promise<{
  contributorsData: Contributor[];
  totalPages: number;
  ownerFollowers: number;
}> => {
  try {
    const response = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contributors`,
      {
        headers,
        params: {
          page,
          per_page: perPage,
        },
      }
    );

    const linkHeader = response.headers.link;
    let totalPages = 1;

    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        totalPages = parseInt(lastPageMatch[1], 10);
      }
    }

    const contributorsData = await Promise.all(
      response.data.map(async (contributor: any) => {
        const userResponse = await axios.get(
          `${GITHUB_API}/users/${contributor.login}`,
          { headers }
        );
        return {
          login: contributor.login,
          contributions: contributor.contributions,
          avatar_url: contributor.avatar_url,
          name: userResponse.data.name,
          company: userResponse.data.company,
          location: userResponse.data.location,
        };
      })
    );

    const ownerResponse = await axios.get(`${GITHUB_API}/users/${owner}`, {
      headers,
    });
    const ownerFollowers = ownerResponse.data.followers;

    return {
      contributorsData,
      totalPages,
      ownerFollowers,
    };
  } catch (error) {
    handleApiError(error);
    return {
      contributorsData: [],
      totalPages: 1,
      ownerFollowers: 0,
    };
  }
};

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (
      error.response?.status === 403 &&
      error.response.headers["x-ratelimit-remaining"] === "0"
    ) {
      throw new Error(
        "GitHub API rate limit exceeded. Use a personal access token."
      );
    }
    throw new Error(error.message);
  }
  throw new Error("Unknown error");
};
