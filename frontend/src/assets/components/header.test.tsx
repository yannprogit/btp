import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Header from './header';

vi.mock('/assets/images/logo_btp.png', () => ({
  default: 'logo.png'
}));

const renderHeader = () => {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/profile" element={<div>Profile Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Header', () => {
  it('shows Login link when no user is stored', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('opens user menu and navigates to profile', async () => {
    const user = userEvent.setup();
    localStorage.setItem('userName', 'Alice');

    renderHeader();

    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: 'Paramètres' }));

    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });
});
