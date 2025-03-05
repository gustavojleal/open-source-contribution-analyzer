import React, { Fragment } from 'react';
import { Contributor, RepositoryData } from '../types';
import { getTopCompanies, getTopLocations } from '../utils/tools';

interface SummaryProps {
  repository: RepositoryData | null;
  contributors: Contributor[];
}

const Summary: React.FC<SummaryProps> = ({ contributors, repository }) => {
  const topCompanies = getTopCompanies(contributors, 5);
  const topLocations = getTopLocations(contributors, 5);

  return (
    <Fragment>
      <div className="summary-container">
        {repository && (
          <div className="repo-info">
            <h2 className="repo-name">{repository.name}</h2>
            <p className="repo-description">{repository.description}</p>
            <p>{repository.language}</p>
            <p>{repository.license?.name}</p>
            <div className="repo-stats">
              <span className="stat-item">Stars: {repository.stargazers_count}</span>
              <span className="stat-item">Followers: {repository.ownerFollowers}</span>
            </div>
            <p>{repository.company}</p>
          </div>
        )}

        <div className="summary-section">
          <div className="section-title">
            <h3>Top Companies with most Contributions</h3>
            <ul>
              {topCompanies.map(([company, contributions]) => (
                <li key={company}>{company}: {contributions} contributions</li>
              ))}
            </ul>
          </div>

          <div className="section-title">
            <h3>Top Locations with most Contributors</h3>
            <ul>
              {topLocations.map(([location, count]) => (
                <li key={location}>{location}: {count} contributors</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Summary;