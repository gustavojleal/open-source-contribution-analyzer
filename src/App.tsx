import React, { useState, useEffect } from 'react';
import './style.css';
import { fetchRepository, fetchContributors } from './services/github';
import { Contributor, RepositoryData } from './types';
import { handleError, resetState } from './utils/tools';
import AppRoutes from './components/AppRoutes';

const App: React.FC = () => {
  const [repository, setRepository] = useState<RepositoryData | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [favorites, setFavorites] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(30);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const loadMoreContributors = async () => {
    if (!repository || currentPage >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const { contributorsData } = await fetchContributors(
        repository.owner.login,
        repository.name,
        nextPage,
        perPage
      );

      setContributors(prev => [...prev, ...contributorsData]);
      setCurrentPage(nextPage);
    } catch (error) {
      setError("Failed to load more contributors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (owner: string, repo: string, perPage: number) => {
    try {
      resetState(setRepository, setContributors, setCurrentPage, setTotalPages, setError);
      setLoading(true);
      setPerPage(perPage);

      const repoData = await fetchRepository(owner, repo);
      const { contributorsData, totalPages, ownerFollowers } = await fetchContributors(owner, repo, 1, perPage);

      setRepository({
        ...repoData,
        totalPages,
        ownerFollowers,
        owner: {
          ...repoData.owner,
          followers: ownerFollowers,
        },
      });
      setContributors(contributorsData);
      setTotalPages(totalPages);
    } catch (error) {
      handleError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = (contributor: Contributor) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.login === contributor.login);
      if (isFavorite) {
        return prev.filter(fav => fav.login !== contributor.login);
      } else {
        return [...prev, contributor];
      }
    });
  };

  return (
    <AppRoutes
      repository={repository}
      contributors={contributors}
      favorites={favorites}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      handleSubmit={handleSubmit}
      loadMoreContributors={loadMoreContributors}
      addFavorite={addFavorite}
    />
  );
};

export default App;