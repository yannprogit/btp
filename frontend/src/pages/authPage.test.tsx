import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import AuthPage from './authPage';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

const renderAuthPage = () => {
  return render(
    <MemoryRouter initialEntries={['/auth']}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const getInputByName = (name: string): HTMLInputElement => {
  const element = document.querySelector(`input[name="${name}"]`);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Input with name '${name}' not found`);
  }
  return element;
};

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and redirects to home', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'token-123',
        user: { id: '1', name: 'Alice' }
      }
    });

    renderAuthPage();

    await user.type(getInputByName('email'), 'alice@example.com');
    await user.type(getInputByName('password'), 'pwd');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    expect(localStorage.getItem('token')).toBe('token-123');
    expect(localStorage.getItem('userName')).toBe('Alice');
    expect(localStorage.getItem('userId')).toBe('1');
  });

  it('switches to signup mode and sends signup request', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        token: 'token-signup',
        user: { id: '2', name: 'Bob' }
      }
    });

    renderAuthPage();

    await user.click(screen.getByRole('button', { name: 'Créer un compte' }));

    await user.type(getInputByName('name'), 'Bob');
    await user.type(getInputByName('email'), 'bob@example.com');
    await user.type(getInputByName('password'), 'pwd');
    await user.click(screen.getByRole('button', { name: "S'inscrire" }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5000/users/auth/signup',
        { name: 'Bob', email: 'bob@example.com', password: 'pwd' }
      );
    });
  });

  it('shows API error message when request fails', async () => {
    const user = userEvent.setup();
    const error = {
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    };

    mockedAxios.post.mockRejectedValueOnce(error);
    mockedAxios.isAxiosError.mockReturnValue(true);

    renderAuthPage();

    await user.type(getInputByName('email'), 'alice@example.com');
    await user.type(getInputByName('password'), 'pwd');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
