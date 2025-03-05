import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { Contributor } from '../types';
import '../style.css';

interface ContributorsTableProps {
  contributors: Contributor[];
  onAddFavorite?: (contributor: Contributor) => void;
  favorites?: Set<string>;
}

const ContributorsTable: React.FC<ContributorsTableProps> = ({ contributors, onAddFavorite, favorites }) => {
  useEffect(() => {
  }, [favorites]);

  const handleAddFavorite = (contributor: Contributor) => {
    if (onAddFavorite) {
      onAddFavorite(contributor);
    }
  };

  return (
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
            {onAddFavorite && <TableCell className="table-header">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {contributors.map((contributor) => (
            <TableRow key={contributor.login} className="table-row">
              <TableCell className="table-cell">
                <img 
                  src={contributor.avatar_url} 
                  alt={contributor.login} 
                  className="avatar"
                />
              </TableCell>
              <TableCell className="table-cell">
                <a href={`https://github.com/${contributor.login}`} target="_blank" rel="noopener noreferrer">
                  {contributor.login}
                </a>
              </TableCell>
              <TableCell className="table-cell">{contributor.contributions}</TableCell>
              <TableCell className="table-cell">{contributor.name || '-'}</TableCell>
              <TableCell className="table-cell">{contributor.company || '-'}</TableCell>
              <TableCell className="table-cell">{contributor.location || '-'}</TableCell>
              {onAddFavorite && (
                <TableCell className="table-cell">
                  <IconButton 
                    aria-label="Add to favorites"
                    onClick={() => handleAddFavorite(contributor)}
                    color={favorites?.has(contributor.login) ? "secondary" : "primary"}
                  >
                    <StarIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ContributorsTable;