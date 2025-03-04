import { test, expect } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Agora o TypeScript reconhecerá a função "test"
test('renders the application', () => {
  render(<App />);
  const linkElement = screen.getByText(/your application text/i);
  expect(linkElement).toHaveReturned();
});