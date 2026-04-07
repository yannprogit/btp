import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

vi.mock('../utils/config', () => ({
  getDevelopmentMode: vi.fn().mockResolvedValue(true),
}));

const Crash = () => {
  throw new Error('render crash');
};

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child crashes during render', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Crash />
      </ErrorBoundary>
    );

    expect(screen.getByText('⚠️ Oups, un problème')).toBeInTheDocument();
    expect(
      screen.getByText('L\'application a rencontré une erreur inattendue. Veuillez recharger la page pour continuer.')
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});