import axios from "axios";

const GITHUB_API = "https://api.github.com";
const token = process.env.REACT_APP_GITHUB_TOKEN;

const headers = {
  Authorization: token ? `Bearer ${token}` : "",
  Accept: "application/vnd.github.v3+json",
};

export const fetchRepository = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
) => {
  try {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Adicione esta função
export const fetchContributors = async (
  owner: string,
  repo: string,
  page: number = 1,
  perPage: number = 30
) => {
  const response = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=30`,
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

  const ownerResponse = await axios.get(`${GITHUB_API}/users/${owner}`, {
    headers,
  });
  const ownerFollowers = ownerResponse.data.followers;

  return { contributorsData: response.data, totalPages, ownerFollowers };
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
