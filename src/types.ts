export interface Contributor {
  login: string;
  contributions: number;
  avatar_url: string;
  company?: string;
  location?: string;
  name?: string;
}

export type GitHubUser = {
  login: string;
  name?: string;
  company?: string;
  location?: string;
  followers: number;
};

export interface RepositoryData {
  owner: {
    login: string;
    followers?: number;
  };
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string;
  license: {
    name: string;
  } | null;
  contributions: number;
  avatar_url: string;
  company?: string;
  location?: string;
  totalPages?: number;
  ownerFollowers?: number;
}
