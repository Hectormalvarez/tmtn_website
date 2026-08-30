import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/header';
import { mockUserProfile } from '../test/fixtures';

describe('Header', () => {
  it('renders site name', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText('Hector Alvarez')).toBeDefined();
  });

  it('renders tagline', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText('Systems Automation & IT Support')).toBeDefined();
  });

  it('renders public repo count', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText(/25 repos/)).toBeDefined();
  });

  it('renders follower count', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText(/12 followers/)).toBeDefined();
  });

  it('renders total stars', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText(/★ 17/)).toBeDefined();
  });

  it('renders GitHub join year', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByText(/2019/)).toBeDefined();
  });

  it('renders the TMTN logo', () => {
    render(<Header profile={mockUserProfile} totalStars={17} />);
    expect(screen.getByAltText('TMTN Logo')).toBeDefined();
  });
});
