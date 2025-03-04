import React, { useState } from 'react';
import axios from 'axios';
import './style.css';
import RepositoryForm from './components/RepositoryForm';
import Header from './components/Header';
import { fetchRepository, fetchContributors } from './services/github';
import { ContributorsTable } from './components/ContributorsTable';
import Summary from './components/Summary';
import FavoritesPage from './pages/FavoritesPage';
import { Contributor, RepositoryData } from './types';
import { CircularProgress, Button, Alert } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App: React.FC = () => {
  const [repository, setRepository] = useState<RepositoryData | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [favorites, setFavorites] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(30);

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
      resetState();
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

  const addFavorite = (contributor: Contributor) => {
    setFavorites(prev => [...prev, contributor]);
  };

  return (
    <Router>
      <div className="app-container">
        <Header />
        <nav>
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <>
              <RepositoryForm onSubmit={handleSubmit} repository={repository} />
  
              {loading && <CircularProgress className="loading-spinner" />}
  
              {error && (
                <Alert severity="error" className="error-alert">
                  {error}
                </Alert>
              )}
  
              {contributors.length > 0 && (
                <Summary contributors={contributors} repository={repository} />
              )}
              
  
              {contributors.length > 0 && (
                <div className="contributors-section">
                  <h3 className="section-title">Top Contributors</h3>
                  <ContributorsTable contributors={contributors} onAddFavorite={addFavorite} />
                  
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
  
            </>
          } />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;