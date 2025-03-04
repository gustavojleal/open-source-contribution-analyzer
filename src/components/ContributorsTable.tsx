import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Contributor } from '../types';
import '../style.css'; // Importando o CSS

interface ContributorsTableProps {
  contributors: Contributor[];
}

export const ContributorsTable: React.FC<ContributorsTableProps> = ({ contributors }) => (
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
        {contributors.map((contributor) => (
          <TableRow key={contributor.login} className="table-row">
            <TableCell className="table-cell">
              <img 
                src={contributor.avatar_url} 
                alt={contributor.login} 
                className="avatar"
              />
            </TableCell>
            <TableCell className="table-cell">{contributor.login}</TableCell>
            <TableCell className="table-cell">{contributor.contributions}</TableCell>
            <TableCell className="table-cell">{contributor.name || '-'}</TableCell>
            <TableCell className="table-cell">{contributor.company || '-'}</TableCell>
            <TableCell className="table-cell">{contributor.location || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);