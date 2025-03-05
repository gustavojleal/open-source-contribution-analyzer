import React, { useState } from 'react';
import '../style.css';
import { RepositoryData } from '../types';

interface RepositoryFormProps {
  onSubmit: (owner: string, repo: string, perPage: number) => void;
  repository: RepositoryData | null;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({ onSubmit, repository }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [perPage, setPerPage] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(owner, repo, perPage);
  };

  return (
    <div className={`repository-form-container ${repository ? 'with-repo' : ''}`}>
      <form onSubmit={handleSubmit} className={`repository-form ${repository ? 'with-repo' : ''}`}>
        <div className="form-group">
          <label htmlFor="owner">Owner (ex: facebook)</label>
          <input
            type="text"
            id="owner"
            placeholder="Owner (ex: facebook)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="repo">Repository (ex: react)</label>
          <input
            type="text"
            id="repo"
            placeholder="Repository (ex: react)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="perPage">Contributors (up to 200)</label>
          <input
            type="number"
            id="perPage"
            value={perPage}
            min="30"
            max="200"
            onChange={(e) => setPerPage(Number(e.target.value))}
          />
        </div>
        <button className="analyze-button" type="submit">Analyze</button>
      </form>
    </div>
  );
};

export default RepositoryForm;