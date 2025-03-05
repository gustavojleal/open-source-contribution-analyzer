import React, { useState, useEffect } from 'react';
import { Contributor } from '../types';
import ContributorsTable from './ContributorsTable';

interface ContributorsTableContainerProps {
  contributors: Contributor[];
  onAddFavorite: (contributor: Contributor) => void;
}

const ContributorsTableContainer: React.FC<ContributorsTableContainerProps> = ({ contributors, onAddFavorite }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage when the component mounts
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(new Set(JSON.parse(storedFavorites)));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const handleAddFavorite = (contributor: Contributor) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(contributor.login)) {
      newFavorites.delete(contributor.login);
    } else {
      newFavorites.add(contributor.login);
    }
    setFavorites(newFavorites);
    onAddFavorite(contributor);
  };

  return (
    <ContributorsTable 
      contributors={contributors} 
      onAddFavorite={handleAddFavorite} 
      favorites={favorites} 
    />
  );
};

export default ContributorsTableContainer;