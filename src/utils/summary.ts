import { Contributor } from "../types";

export const getTopCompanies = (contributors: Contributor[], limit = 5) => {
  const companies = contributors.reduce((acc, { company }) => {
    if (company) acc[company] = (acc[company] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(companies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
};

export const getTopLocations = (contributors: Contributor[], limit = 5) => {
  // Implementação similar à getTopCompanies
};
