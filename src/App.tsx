import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import RepositoryForm from './components/RepositoryForm';
import Header from './components/Header';
import { fetchRepository, fetchContributors } from './services/github';
import { ContributorsTable } from './components/ContributorsTable';
import { Contributor, RepositoryData } from './types';
import { CircularProgress, Button, Alert } from '@mui/material';

const App: React.FC = () => {
  const [repository, setRepository] = useState<RepositoryData | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMoreContributors = async () => {
    if (!repository || currentPage >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const { contributorsData } = await fetchContributors(
        repository.owner.login,
        repository.name,
        nextPage
      );

      setContributors(prev => [...prev, ...contributorsData]);
      setCurrentPage(nextPage);
    } catch (error) {
      setError("Failed to load more contributors");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (owner: string, repo: string) => {
    try {
      resetState();
      setLoading(true);

      const repoData = await fetchRepository(owner, repo);
      const { contributorsData, totalPages, ownerFollowers } = await fetchContributors(owner, repo, 1);

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
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setRepository(null);
    setContributors([]);
    setCurrentPage(1);
    setTotalPages(1);
    setError(null);
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      setError(error.response?.status === 404
        ? "Repository not found"
        : "API rate limit exceeded or network error");
    } else {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="app-container">
      <Header />
  
      <RepositoryForm onSubmit={handleSubmit} repository={repository} />
  
      {loading && <CircularProgress className="loading-spinner" />}
  
      {error && (
        <Alert severity="error" className="error-alert">
          {error}
        </Alert>
      )}
  
      {contributors.length > 0 && (
        <div className="contributors-section">
          <h3 className="section-title">Top Contributors</h3>
          <ContributorsTable contributors={contributors} />
          
          {currentPage <= totalPages && (
            <>
            <Button
              variant="contained"
              onClick={loadMoreContributors}
              disabled={loading}
              className="load-more-button"
            >
              {loading ? <CircularProgress size={24} /> : "Load More"}
            </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;