import React from 'react';
import { Contributor } from '../types';
import ContributorsTable from '../components/ContributorsTable';
import '../style.css';

interface FavoritesPageProps {
  favorites: Contributor[];
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites }) => {
  return (
    <div className="favorites-page">
      <h2>Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <ContributorsTable contributors={favorites} />
      )}
    </div>
  );
};

export default FavoritesPage;