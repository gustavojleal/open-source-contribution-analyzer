import React from 'react';
import { Contributor } from '../types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
        <TableContainer component={Paper} className="contributors-table-container">
          <Table className="contributors-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Avatar</TableCell>
                <TableCell className="table-header">Username</TableCell>
                <TableCell className="table-header">Contributions</TableCell>
                <TableCell className="table-header">Full Name</TableCell>
                <TableCell className="table-header">Company</TableCell>
                <TableCell className="table-header">Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {favorites.map((favorite) => (
                <TableRow key={favorite.login} className="table-row">
                  <TableCell className="table-cell">
                    <img 
                      src={favorite.avatar_url} 
                      alt={favorite.login} 
                      className="avatar"
                    />
                  </TableCell>
                  <TableCell className="table-cell">{favorite.login}</TableCell>
                  <TableCell className="table-cell">{favorite.contributions}</TableCell>
                  <TableCell className="table-cell">{favorite.name || '-'}</TableCell>
                  <TableCell className="table-cell">{favorite.company || '-'}</TableCell>
                  <TableCell className="table-cell">{favorite.location || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default FavoritesPage;