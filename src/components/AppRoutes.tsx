import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RepositoryForm from './RepositoryForm';
import Header from './Header';
import Navigation from './Navigation';
import ContributorsTableContainer from './ContributorsTableContainer';
import Summary from './Summary';
import FavoritesPage from '../pages/FavoritesPage';
import { CircularProgress, Button, Alert } from '@mui/material';
import { Contributor, RepositoryData } from '../types';

interface AppRoutesProps {
  repository: RepositoryData | null;
  contributors: Contributor[];
  favorites: Contributor[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  handleSubmit: (owner: string, repo: string, perPage: number) => void;
  loadMoreContributors: () => void;
  addFavorite: (contributor: Contributor) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  repository,
  contributors,
  favorites,
  loading,
  error,
  currentPage,
  totalPages,
  handleSubmit,
  loadMoreContributors,
  addFavorite,
}) => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navigation />
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
                  <ContributorsTableContainer contributors={contributors} onAddFavorite={addFavorite} />
                  
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

export default AppRoutes;