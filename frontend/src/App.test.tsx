import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./pages/teamPage', () => ({
  default: () => <div>Team Page</div>
}));

vi.mock('./pages/authPage', () => ({
  default: () => <div>Auth Page</div>
}));

vi.mock('./pages/userPage', () => ({
  default: () => <div>User Page</div>
}));

vi.mock('./pages/testErrorPage', () => ({
  default: () => <div>Test Error Page</div>
}));

describe('App routing', () => {
  it('renders not found page on unknown route', () => {
    window.history.pushState({}, '', '/missing');
    render(<App />);

    expect(screen.getByText('Page non trouvée')).toBeInTheDocument();
  });

  it('renders team page on root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByText('Team Page')).toBeInTheDocument();
  });

  it('renders auth page on /auth route', () => {
    window.history.pushState({}, '', '/auth');
    render(<App />);

    expect(screen.getByText('Auth Page')).toBeInTheDocument();
  });
});
