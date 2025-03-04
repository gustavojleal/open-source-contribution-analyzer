import React, { useState } from 'react';
import '../style.css';
import { RepositoryData } from '../types';

interface RepositoryFormProps {
  onSubmit: (owner: string, repo: string) => void;
  repository: RepositoryData | null;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({ onSubmit, repository }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(owner, repo);
  };

  return (
    <div className={`repository-form-container ${repository ? 'with-repo' : ''}`}>
      <form onSubmit={handleSubmit} className={`repository-form ${repository ? 'with-repo' : ''}`}>
        <input
          type="text"
          placeholder="Owner (ex: facebook)"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          type="text"
          placeholder="Repository (ex: react)"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>

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
    </div>
  );
};

export default RepositoryForm;