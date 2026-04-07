import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

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

    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument();
    expect(
      screen.getByText('L\'application a rencontré un problème inattendu. Veuillez recharger la page.')
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});